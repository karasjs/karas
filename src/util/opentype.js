import inject from './inject';
import inflate from './inflate';

function getTag(dataView, offset) {
  let tag = '';
  for (let i = offset; i < offset + 4; i++) {
    tag += String.fromCharCode(dataView.getInt8(i));
  }
  return tag;
}

function getUShort(dataView, offset) {
  return dataView.getUint16(offset, false);
}

function getULong(dataView, offset) {
  return dataView.getUint32(offset, false);
}

function getFixed(dataView, offset) {
  let decimal = dataView.getInt16(offset, false);
  let fraction = dataView.getUint16(offset + 2, false);
  return decimal + fraction / 65535;
}

function parseOpenTypeTableEntries(data, numTables) {
  let tableEntries = [];
  let p = 12;
  for (let i = 0; i < numTables; i += 1) {
    let tag = getTag(data, p);
    let checksum = getULong(data, p + 4);
    let offset = getULong(data, p + 8);
    let length = getULong(data, p + 12);
    tableEntries.push({ tag: tag, checksum: checksum,
      offset: offset, length: length, compression: false });
    p += 16;
  }
  return tableEntries;
}

function parseWOFFTableEntries(data, numTables) {
  let tableEntries = [];
  let p = 44; // offset to the first table directory entry.
  for (let i = 0; i < numTables; i += 1) {
    let tag = getTag(data, p);
    let offset = getULong(data, p + 4);
    let compLength = getULong(data, p + 8);
    let origLength = getULong(data, p + 12);
    let compression;
    if (compLength < origLength) {
      compression = 'WOFF';
    }
    else {
      compression = false;
    }
    tableEntries.push({ tag: tag, offset: offset, compression: compression,
      compressedLength: compLength, length: origLength });
    p += 20;
  }
  return tableEntries;
}

function uncompressTable(data, tableEntry) {
  if (tableEntry.compression === 'WOFF') {
    let inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
    let outBuffer = new Uint8Array(tableEntry.length);
    inflate(inBuffer, outBuffer);
    if(outBuffer.byteLength !== tableEntry.length) {
      inject.error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
    }
    let view = new DataView(outBuffer.buffer, 0);
    return { data: view, offset: 0 };
  }
  else {
    return { data: data, offset: tableEntry.offset };
  }
}

class Parser {
  constructor(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
  }

  parseUShort() {
    let v = this.data.getUint16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
  }

  parseULong() {
    let v = getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
  }

  parseShort() {
    let v = this.data.getInt16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
  }

  parseFixed() {
    let v = getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
  }

  parseVersion(minorBase) {
    let major = getUShort(this.data, this.offset + this.relativeOffset);
    let minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    if(minorBase === undefined) {
      minorBase = 0x1000;
    }
    return major + minor / minorBase / 10;
  };
}

export default {
  parse(arrayBuffer) {
    let data = new DataView(arrayBuffer, 0);
    let signature = getTag(data, 0);
    let numTables, tableEntries;
    if(signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
      numTables = getUShort(data, 4);
      tableEntries = parseOpenTypeTableEntries(data, numTables);
    }
    else if(signature === 'OTTO') {
      numTables = getUShort(data, 4);
      tableEntries = parseOpenTypeTableEntries(data, numTables);
    }
    else if(signature === 'wOFF') {
      let flavor = getTag(data, 4);
      if(flavor !== String.fromCharCode(0, 1, 0, 0) && flavor !== 'OTTO') {
        inject.error('Unsupported OpenType flavor ' + signature);
        return;
      }
      numTables = getUShort(data, 12);
      tableEntries = parseWOFFTableEntries(data, numTables);
    }
    else {
      inject.error('Unsupported OpenType signature ' + signature);
    }
    let emSquare = 2048, ascent, descent, lineGap = 0;
    for(let i = 0; i < numTables; i++) {
      let tableEntry = tableEntries[i];
      if(tableEntry.tag === 'head') {
        let table = uncompressTable(data, tableEntry);
        let p = new Parser(table.data, table.offset);
        p.parseVersion();
        p.parseFixed();
        p.parseULong();
        p.parseULong();
        p.parseUShort();
        emSquare = p.parseUShort();
      }
      else if(tableEntry.tag === 'hhea') {
        let table = uncompressTable(data, tableEntry);
        let p = new Parser(table.data, table.offset);
        p.parseVersion();
        ascent = Math.abs(p.parseShort());
        descent = Math.abs(p.parseShort());
        lineGap = Math.abs(p.parseShort() || 0);
      }
    }
    return {
      emSquare,
      ascent,
      descent,
      lineGap,
    };
  },
};
