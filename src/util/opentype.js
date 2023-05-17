import inject from './inject';
import inflate from './inflate';

const decode = {};

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF16 = function(data, offset, numBytes) {
  const codePoints = [];
  const numChars = numBytes / 2;
  for (let j = 0; j < numChars; j++, offset += 2) {
    codePoints[j] = data.getUint16(offset);
  }

  return String.fromCharCode.apply(null, codePoints);
};

// Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comparatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))
/**
 * @private
 */
const eightBitMacEncodings = {
  'x-mac-croatian':  // Python: 'mac_croatian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
    '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
  'x-mac-cyrillic':  // Python: 'mac_cyrillic'
    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
    'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
  'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
    'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
  'x-mac-greek':  // Python: 'mac_greek'
    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
    'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
  'x-mac-icelandic':  // Python: 'mac_iceland'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
    'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
  'x-mac-ce':  // Python: 'mac_latin2'
    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
    'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
  macintosh:  // Python: 'mac_roman'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  'x-mac-romanian':  // Python: 'mac_romanian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  'x-mac-turkish':  // Python: 'mac_turkish'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};

/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */
decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
  const table = eightBitMacEncodings[encoding];
  if (table === undefined) {
    return undefined;
  }

  let result = '';
  for (let i = 0; i < dataLength; i++) {
    const c = dataView.getUint8(offset + i);
    // In all eight-bit Mac encodings, the characters 0x00..0x7F are
    // mapped to U+0000..U+007F; we only need to look up the others.
    if (c <= 0x7F) {
      result += String.fromCharCode(c);
    } else {
      result += table[c & 0x7F];
    }
  }

  return result;
};

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

const typeOffsets = {
  byte: 1,
  uShort: 2,
  short: 2,
  uLong: 4,
  fixed: 4,
  longDateTime: 8,
  tag: 4
};

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

  skip(type, amount) {
    if (amount === undefined) {
      amount = 1;
    }
    this.relativeOffset += typeOffsets[type] * amount;
  }
}

const nameTableNames = [
  'copyright',              // 0
  'fontFamily',             // 1
  'fontSubfamily',          // 2
  'uniqueID',               // 3
  'fullName',               // 4
  'version',                // 5
  'postScriptName',         // 6
  'trademark',              // 7
  'manufacturer',           // 8
  'designer',               // 9
  'description',            // 10
  'manufacturerURL',        // 11
  'designerURL',            // 12
  'license',                // 13
  'licenseURL',             // 14
  'reserved',               // 15
  'preferredFamily',        // 16
  'preferredSubfamily',     // 17
  'compatibleFullName',     // 18
  'sampleText',             // 19
  'postScriptFindFontName', // 20
  'wwsFamily',              // 21
  'wwsSubfamily'            // 22
];
const macLanguages = {
  0: 'en',
  1: 'fr',
  2: 'de',
  3: 'it',
  4: 'nl',
  5: 'sv',
  6: 'es',
  7: 'da',
  8: 'pt',
  9: 'no',
  10: 'he',
  11: 'ja',
  12: 'ar',
  13: 'fi',
  14: 'el',
  15: 'is',
  16: 'mt',
  17: 'tr',
  18: 'hr',
  19: 'zh-Hant',
  20: 'ur',
  21: 'hi',
  22: 'th',
  23: 'ko',
  24: 'lt',
  25: 'pl',
  26: 'hu',
  27: 'es',
  28: 'lv',
  29: 'se',
  30: 'fo',
  31: 'fa',
  32: 'ru',
  33: 'zh',
  34: 'nl-BE',
  35: 'ga',
  36: 'sq',
  37: 'ro',
  38: 'cz',
  39: 'sk',
  40: 'si',
  41: 'yi',
  42: 'sr',
  43: 'mk',
  44: 'bg',
  45: 'uk',
  46: 'be',
  47: 'uz',
  48: 'kk',
  49: 'az-Cyrl',
  50: 'az-Arab',
  51: 'hy',
  52: 'ka',
  53: 'mo',
  54: 'ky',
  55: 'tg',
  56: 'tk',
  57: 'mn-CN',
  58: 'mn',
  59: 'ps',
  60: 'ks',
  61: 'ku',
  62: 'sd',
  63: 'bo',
  64: 'ne',
  65: 'sa',
  66: 'mr',
  67: 'bn',
  68: 'as',
  69: 'gu',
  70: 'pa',
  71: 'or',
  72: 'ml',
  73: 'kn',
  74: 'ta',
  75: 'te',
  76: 'si',
  77: 'my',
  78: 'km',
  79: 'lo',
  80: 'vi',
  81: 'id',
  82: 'tl',
  83: 'ms',
  84: 'ms-Arab',
  85: 'am',
  86: 'ti',
  87: 'om',
  88: 'so',
  89: 'sw',
  90: 'rw',
  91: 'rn',
  92: 'ny',
  93: 'mg',
  94: 'eo',
  128: 'cy',
  129: 'eu',
  130: 'ca',
  131: 'la',
  132: 'qu',
  133: 'gn',
  134: 'ay',
  135: 'tt',
  136: 'ug',
  137: 'dz',
  138: 'jv',
  139: 'su',
  140: 'gl',
  141: 'af',
  142: 'br',
  143: 'iu',
  144: 'gd',
  145: 'gv',
  146: 'ga',
  147: 'to',
  148: 'el-polyton',
  149: 'kl',
  150: 'az',
  151: 'nn'
};

// While Microsoft indicates a region/country for all its language
// IDs, we omit the region code if it's equal to the "most likely
// region subtag" according to Unicode CLDR. For scripts, we omit
// the subtag if it is equal to the Suppress-Script entry in the
// IANA language subtag registry for IETF BCP 47.
//
// For example, Microsoft states that its language code 0x041A is
// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
// and not 'hr-HR' because Croatia is the default country for Croatian,
// according to Unicode CLDR. As another example, Microsoft states
// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
// for the Croatian language, according to IANA.
//
// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
const windowsLanguages = {
  0x0436: 'af',
  0x041C: 'sq',
  0x0484: 'gsw',
  0x045E: 'am',
  0x1401: 'ar-DZ',
  0x3C01: 'ar-BH',
  0x0C01: 'ar',
  0x0801: 'ar-IQ',
  0x2C01: 'ar-JO',
  0x3401: 'ar-KW',
  0x3001: 'ar-LB',
  0x1001: 'ar-LY',
  0x1801: 'ary',
  0x2001: 'ar-OM',
  0x4001: 'ar-QA',
  0x0401: 'ar-SA',
  0x2801: 'ar-SY',
  0x1C01: 'aeb',
  0x3801: 'ar-AE',
  0x2401: 'ar-YE',
  0x042B: 'hy',
  0x044D: 'as',
  0x082C: 'az-Cyrl',
  0x042C: 'az',
  0x046D: 'ba',
  0x042D: 'eu',
  0x0423: 'be',
  0x0845: 'bn',
  0x0445: 'bn-IN',
  0x201A: 'bs-Cyrl',
  0x141A: 'bs',
  0x047E: 'br',
  0x0402: 'bg',
  0x0403: 'ca',
  0x0C04: 'zh-HK',
  0x1404: 'zh-MO',
  0x0804: 'zh',
  0x1004: 'zh-SG',
  0x0404: 'zh-TW',
  0x0483: 'co',
  0x041A: 'hr',
  0x101A: 'hr-BA',
  0x0405: 'cs',
  0x0406: 'da',
  0x048C: 'prs',
  0x0465: 'dv',
  0x0813: 'nl-BE',
  0x0413: 'nl',
  0x0C09: 'en-AU',
  0x2809: 'en-BZ',
  0x1009: 'en-CA',
  0x2409: 'en-029',
  0x4009: 'en-IN',
  0x1809: 'en-IE',
  0x2009: 'en-JM',
  0x4409: 'en-MY',
  0x1409: 'en-NZ',
  0x3409: 'en-PH',
  0x4809: 'en-SG',
  0x1C09: 'en-ZA',
  0x2C09: 'en-TT',
  0x0809: 'en-GB',
  0x0409: 'en',
  0x3009: 'en-ZW',
  0x0425: 'et',
  0x0438: 'fo',
  0x0464: 'fil',
  0x040B: 'fi',
  0x080C: 'fr-BE',
  0x0C0C: 'fr-CA',
  0x040C: 'fr',
  0x140C: 'fr-LU',
  0x180C: 'fr-MC',
  0x100C: 'fr-CH',
  0x0462: 'fy',
  0x0456: 'gl',
  0x0437: 'ka',
  0x0C07: 'de-AT',
  0x0407: 'de',
  0x1407: 'de-LI',
  0x1007: 'de-LU',
  0x0807: 'de-CH',
  0x0408: 'el',
  0x046F: 'kl',
  0x0447: 'gu',
  0x0468: 'ha',
  0x040D: 'he',
  0x0439: 'hi',
  0x040E: 'hu',
  0x040F: 'is',
  0x0470: 'ig',
  0x0421: 'id',
  0x045D: 'iu',
  0x085D: 'iu-Latn',
  0x083C: 'ga',
  0x0434: 'xh',
  0x0435: 'zu',
  0x0410: 'it',
  0x0810: 'it-CH',
  0x0411: 'ja',
  0x044B: 'kn',
  0x043F: 'kk',
  0x0453: 'km',
  0x0486: 'quc',
  0x0487: 'rw',
  0x0441: 'sw',
  0x0457: 'kok',
  0x0412: 'ko',
  0x0440: 'ky',
  0x0454: 'lo',
  0x0426: 'lv',
  0x0427: 'lt',
  0x082E: 'dsb',
  0x046E: 'lb',
  0x042F: 'mk',
  0x083E: 'ms-BN',
  0x043E: 'ms',
  0x044C: 'ml',
  0x043A: 'mt',
  0x0481: 'mi',
  0x047A: 'arn',
  0x044E: 'mr',
  0x047C: 'moh',
  0x0450: 'mn',
  0x0850: 'mn-CN',
  0x0461: 'ne',
  0x0414: 'nb',
  0x0814: 'nn',
  0x0482: 'oc',
  0x0448: 'or',
  0x0463: 'ps',
  0x0415: 'pl',
  0x0416: 'pt',
  0x0816: 'pt-PT',
  0x0446: 'pa',
  0x046B: 'qu-BO',
  0x086B: 'qu-EC',
  0x0C6B: 'qu',
  0x0418: 'ro',
  0x0417: 'rm',
  0x0419: 'ru',
  0x243B: 'smn',
  0x103B: 'smj-NO',
  0x143B: 'smj',
  0x0C3B: 'se-FI',
  0x043B: 'se',
  0x083B: 'se-SE',
  0x203B: 'sms',
  0x183B: 'sma-NO',
  0x1C3B: 'sms',
  0x044F: 'sa',
  0x1C1A: 'sr-Cyrl-BA',
  0x0C1A: 'sr',
  0x181A: 'sr-Latn-BA',
  0x081A: 'sr-Latn',
  0x046C: 'nso',
  0x0432: 'tn',
  0x045B: 'si',
  0x041B: 'sk',
  0x0424: 'sl',
  0x2C0A: 'es-AR',
  0x400A: 'es-BO',
  0x340A: 'es-CL',
  0x240A: 'es-CO',
  0x140A: 'es-CR',
  0x1C0A: 'es-DO',
  0x300A: 'es-EC',
  0x440A: 'es-SV',
  0x100A: 'es-GT',
  0x480A: 'es-HN',
  0x080A: 'es-MX',
  0x4C0A: 'es-NI',
  0x180A: 'es-PA',
  0x3C0A: 'es-PY',
  0x280A: 'es-PE',
  0x500A: 'es-PR',

  // Microsoft has defined two different language codes for
  // “Spanish with modern sorting” and “Spanish with traditional
  // sorting”. This makes sense for collation APIs, and it would be
  // possible to express this in BCP 47 language tags via Unicode
  // extensions (eg., es-u-co-trad is Spanish with traditional
  // sorting). However, for storing names in fonts, the distinction
  // does not make sense, so we give “es” in both cases.
  0x0C0A: 'es',
  0x040A: 'es',

  0x540A: 'es-US',
  0x380A: 'es-UY',
  0x200A: 'es-VE',
  0x081D: 'sv-FI',
  0x041D: 'sv',
  0x045A: 'syr',
  0x0428: 'tg',
  0x085F: 'tzm',
  0x0449: 'ta',
  0x0444: 'tt',
  0x044A: 'te',
  0x041E: 'th',
  0x0451: 'bo',
  0x041F: 'tr',
  0x0442: 'tk',
  0x0480: 'ug',
  0x0422: 'uk',
  0x042E: 'hsb',
  0x0420: 'ur',
  0x0843: 'uz-Cyrl',
  0x0443: 'uz',
  0x042A: 'vi',
  0x0452: 'cy',
  0x0488: 'wo',
  0x0485: 'sah',
  0x0478: 'ii',
  0x046A: 'yo'
};

// MacOS script ID → encoding. This table stores the default case,
// which can be overridden by macLanguageEncodings.
const macScriptEncodings = {
  0: 'macintosh',           // smRoman
  1: 'x-mac-japanese',      // smJapanese
  2: 'x-mac-chinesetrad',   // smTradChinese
  3: 'x-mac-korean',        // smKorean
  6: 'x-mac-greek',         // smGreek
  7: 'x-mac-cyrillic',      // smCyrillic
  9: 'x-mac-devanagai',     // smDevanagari
  10: 'x-mac-gurmukhi',     // smGurmukhi
  11: 'x-mac-gujarati',     // smGujarati
  12: 'x-mac-oriya',        // smOriya
  13: 'x-mac-bengali',      // smBengali
  14: 'x-mac-tamil',        // smTamil
  15: 'x-mac-telugu',       // smTelugu
  16: 'x-mac-kannada',      // smKannada
  17: 'x-mac-malayalam',    // smMalayalam
  18: 'x-mac-sinhalese',    // smSinhalese
  19: 'x-mac-burmese',      // smBurmese
  20: 'x-mac-khmer',        // smKhmer
  21: 'x-mac-thai',         // smThai
  22: 'x-mac-lao',          // smLao
  23: 'x-mac-georgian',     // smGeorgian
  24: 'x-mac-armenian',     // smArmenian
  25: 'x-mac-chinesesimp',  // smSimpChinese
  26: 'x-mac-tibetan',      // smTibetan
  27: 'x-mac-mongolian',    // smMongolian
  28: 'x-mac-ethiopic',     // smEthiopic
  29: 'x-mac-ce',           // smCentralEuroRoman
  30: 'x-mac-vietnamese',   // smVietnamese
  31: 'x-mac-extarabic'     // smExtArabic
};

// MacOS language ID → encoding. This table stores the exceptional
// cases, which override macScriptEncodings. For writing MacOS naming
// tables, we need to emit a MacOS script ID. Therefore, we cannot
// merge macScriptEncodings into macLanguageEncodings.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
const macLanguageEncodings = {
  15: 'x-mac-icelandic',    // langIcelandic
  17: 'x-mac-turkish',      // langTurkish
  18: 'x-mac-croatian',     // langCroatian
  24: 'x-mac-ce',           // langLithuanian
  25: 'x-mac-ce',           // langPolish
  26: 'x-mac-ce',           // langHungarian
  27: 'x-mac-ce',           // langEstonian
  28: 'x-mac-ce',           // langLatvian
  30: 'x-mac-icelandic',    // langFaroese
  37: 'x-mac-romanian',     // langRomanian
  38: 'x-mac-ce',           // langCzech
  39: 'x-mac-ce',           // langSlovak
  40: 'x-mac-ce',           // langSlovenian
  143: 'x-mac-inuit',       // langInuktitut
  146: 'x-mac-gaelic'       // langIrishGaelicScript
};

// Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.
function getLanguageCode(platformID, languageID, ltag) {
  switch (platformID) {
    case 0:  // Unicode
      if (languageID === 0xFFFF) {
        return 'und';
      } else if (ltag) {
        return ltag[languageID];
      }

      break;

    case 1:  // Macintosh
      return macLanguages[languageID];

    case 3:  // Windows
      return windowsLanguages[languageID];
  }

  return undefined;
}

const utf16 = 'utf-16';

function getEncoding(platformID, encodingID, languageID) {
  switch (platformID) {
    case 0:  // Unicode
      return utf16;

    case 1:  // Apple Macintosh
      return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

    case 3:  // Microsoft Windows
      if (encodingID === 1 || encodingID === 10) {
        return utf16;
      }

      break;
  }

  return undefined;
}

const platforms = {
  0: 'unicode',
  1: 'macintosh',
  2: 'reserved',
  3: 'windows'
};

function getPlatform(platformID) {
  return platforms[platformID];
}

function parseNameTable(data, start, ltag) {
  const name = {};
  const p = new Parser(data, start);
  const format = p.parseUShort();
  const count = p.parseUShort();
  const stringOffset = p.offset + p.parseUShort();
  for (let i = 0; i < count; i++) {
    const platformID = p.parseUShort();
    const encodingID = p.parseUShort();
    const languageID = p.parseUShort();
    const nameID = p.parseUShort();
    const property = nameTableNames[nameID] || nameID;
    const byteLength = p.parseUShort();
    const offset = p.parseUShort();
    const language = getLanguageCode(platformID, languageID, ltag);
    const encoding = getEncoding(platformID, encodingID, languageID);
    const platformName = getPlatform(platformID);
    if (encoding !== undefined && language !== undefined && platformName !== undefined) {
      let text;
      if (encoding === utf16) {
        text = decode.UTF16(data, stringOffset + offset, byteLength);
      } else {
        text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
      }

      if (text) {
        let platform = name[platformName];
        if (platform === undefined) {
          platform = name[platformName] = {};
        }
        let translations = platform[property];
        if (translations === undefined) {
          translations = platform[property] = {};
        }

        translations[language] = text;
      }
    }
  }

  let langTagCount = 0;
  if (format === 1) {
    // FIXME: Also handle Microsoft's 'name' table 1.
    langTagCount = p.parseUShort();
  }

  return name;
}

// Precondition function that checks if the given predicate is true.
// If not, it will throw an error.
function argument(predicate, message) {
  if (!predicate) {
    fail(message);
  }
}

function parseLtagTable(data, start) {
  const p = new Parser(data, start);
  const tableVersion = p.parseULong();
  argument(tableVersion === 1, 'Unsupported ltag table version.');
  // The 'ltag' specification does not define any flags; skip the field.
  p.skip('uLong', 1);
  const numTags = p.parseULong();

  const tags = [];
  for (let i = 0; i < numTags; i++) {
    let tag = '';
    const offset = start + p.parseUShort();
    const length = p.parseUShort();
    for (let j = offset; j < offset + length; ++j) {
      tag += String.fromCharCode(data.getInt8(j));
    }

    tags.push(tag);
  }

  return tags;
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
    else if (signature === 'wOF2') {
      let issue = 'https://github.com/opentypejs/opentype.js/issues/183#issuecomment-1147228025';
      inject.error('WOFF2 require an external decompressor library, see examples at: ' + issue);
    }
    else {
      inject.error('Unsupported OpenType signature ' + signature);
    }
    let emSquare = 2048, ascent, descent, lineGap = 0, name, ltagTable;
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
      else if(tableEntry.tag === 'ltag') {
        let table = uncompressTable(data, tableEntry);
        ltagTable = parseLtagTable(table.data, table.offset);
      }
      else if(tableEntry.tag === 'name') {
        let table = uncompressTable(data, tableEntry);
        let n = parseNameTable(table.data, table.offset, ltagTable);
        // https://learn.microsoft.com/en-us/typography/opentype/spec/name
        if(n.macintosh) {
          name = n.macintosh.fontFamily.en;
        }
        else if(n.windows) {
          name = n.windows.fontFamily.en;
        }
      }
    }
    return {
      name,
      emSquare,
      ascent,
      descent,
      lineGap,
    };
  },
};
