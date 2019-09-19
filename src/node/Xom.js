import Node from './Node';
import mode from '../mode';
import unit from '../style/unit';

function arr2hash(arr) {
  let hash = {};
  for(let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i];
    if(Array.isArray(item)) {
      hash[item[0]] = item[1];
    }
    else {
      for(let list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
        let k = list[j];
        hash[k] = item[k];
      }
    }
  }
  return hash;
}

function hash2arr(hash) {
  let arr = [];
  for(let list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
    let k = list[i];
    arr.push([k, hash[k]]);
  }
  return arr;
}

function spread(arr) {
  for(let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i];
    if(!Array.isArray(item)) {
      let temp = [];
      for(let list = Object.keys(item), j = 0, len = list.length; j < len; j++) {
        let k = list[j];
        temp.push([k, item[k]]);
      }
      arr.splice(i, 1, ...temp);
    }
  }
  return arr;
}

class Xom extends Node {
  constructor(tagName, props) {
    super();
    props = props || [];
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = arr2hash(props);
      this.__props = spread(props);
    }
    else {
      this.props = props;
      this.__props = hash2arr(props);
    }
    this.__tagName = tagName;
    this.__style = this.props.style || {}; // style被解析后的k-v形式
    this.__listener = {};
    this.__props.forEach(item => {
      let k = item[0];
      if(/^on[a-zA-Z]/.test(k)) {
        this.__listener[k.slice(2).toLowerCase()] = item[1];
      }
    });
  }

  __preLay(data) {
    let { style, style: { display } } = this;
    if(display === 'none') {
      return;
    }
    if(display === 'block') {
      this.__preLayBlock(data);
    }
    else if(display === 'flex') {
      this.__preLayFlex(data);
    }
    else if(display === 'inline') {
      this.__preLayInline(data);
    }
    // relative偏移
    let { width, height } = this.parent || this;
    let {
      position,
      top,
      right,
      bottom,
      left,
    } = style;
    if(position === 'relative') {
      if(left.unit !== unit.AUTO) {
        let diff = left.unit === unit.PX ? left.value : left.value * width * 0.01;
        this.__offsetX(diff);
      }
      else if(right.unit !== unit.AUTO) {
        let diff = right.unit === unit.PX ? right.value : right.value * width * 0.01;
        this.__offsetX(-diff);
      }
      if(top.unit !== unit.AUTO) {
        let diff = top.unit === unit.PX ? top.value : top.value * height * 0.01;
        this.__offsetY(diff);
      }
      else if(bottom.unit !== unit.AUTO) {
        let diff = bottom.unit === unit.PX ? bottom.value : bottom.value * height * 0.01;
        this.__offsetY(-diff);
      }
    }
  }

  render(renderMode) {
    this.__virtualDom = {
      bb: [],
    };
    let { ctx, style, x, y, width, height, virtualDom } = this;
    let {
      display,
      backgroundColor,
      borderTopWidth,
      borderTopColor,
      borderTopStyle,
      borderRightWidth,
      borderRightColor,
      borderRightStyle,
      borderBottomWidth,
      borderBottomColor,
      borderBottomStyle,
      borderLeftWidth,
      borderLeftColor,
      borderLeftStyle,
      marginTop,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = style;
    if(display === 'none') {
      return;
    }
    if(marginLeft) {
      x += marginLeft.value;
    }
    if(marginTop) {
      y += marginTop.value;
    }
    if(backgroundColor) {
      let x1 = x;
      if(borderLeftWidth) {
        x1 += borderLeftWidth.value;
      }
      let y1 = y;
      if(borderTopWidth) {
        y1 += borderTopWidth.value;
      }
      let w = width + paddingLeft.value + paddingRight.value;
      let h = height + paddingTop.value + paddingBottom.value;
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.fillStyle = backgroundColor;
        ctx.rect(x1, y1, w, h);
        ctx.fill();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        virtualDom.bb.push({
          type: 'item',
          tagName: 'rect',
          props: [
            ['x', x1],
            ['y', y1],
            ['width', w],
            ['height', h],
            ['fill', backgroundColor]
          ],
        });
      }
    }
    if(borderTopWidth.value) {
      let x1 = x + borderLeftWidth.value;
      let y1 = y + borderTopWidth.value * 0.5;
      let x2 = x1 + width;
      if(paddingLeft) {
        x2 += paddingLeft.value;
      }
      if(paddingRight) {
        x2 += paddingRight.value;
      }
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.lineWidth = borderTopWidth.value;
        ctx.strokeStyle = borderTopColor;
        if(borderTopStyle === 'dashed') {
          ctx.setLineDash([borderTopWidth.value * 3, borderTopWidth.value * 2]);
        }
        else if(borderTopStyle === 'dotted') {
          ctx.setLineDash([borderTopWidth.value, borderTopWidth.value]);
        }
        else {
          ctx.setLineDash([]);
        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.stroke();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        let item = {
          type: 'item',
          tagName: 'line',
          props: [
            ['x1', x1],
            ['y1', y1],
            ['x2', x2],
            ['y2', y1],
            ['stroke-width', borderTopWidth.value],
            ['stroke', borderTopColor]
          ],
        };
        if(borderTopStyle === 'dashed') {
          item.props.push(['stroke-dasharray', `${borderTopWidth.value * 3}, ${borderTopWidth.value * 2}`])
        }
        else if(borderTopStyle === 'dotted') {
          item.props.push(['stroke-dasharray', `${borderTopWidth.value}, ${borderTopWidth.value}`])
        }
        virtualDom.bb.push(item);
      }
    }
    if(borderRightWidth.value) {
      let x1 = x + width + borderLeftWidth.value + borderRightWidth.value * 0.5;
      let y1 = y;
      let y2 = y1 + height + borderTopWidth.value + borderBottomWidth.value;
      if(paddingLeft) {
        x1 += paddingLeft.value;
      }
      if(paddingRight) {
        x1 += paddingRight.value;
      }
      if(paddingTop) {
        y2 += paddingTop.value;
      }
      if(paddingBottom) {
        y2 += paddingBottom.value;
      }
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.lineWidth = borderRightWidth.value;
        ctx.strokeStyle = borderRightColor;
        if(borderRightStyle === 'dashed') {
          ctx.setLineDash([borderRightWidth.value * 3, borderRightWidth.value * 2]);
        }
        else if(borderRightStyle === 'dotted') {
          ctx.setLineDash([borderRightWidth.value, borderRightWidth.value * 2]);
        }
        else {
          ctx.setLineDash([]);
        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.stroke();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        let item = {
          type: 'item',
          tagName: 'line',
          props: [
            ['x1', x1],
            ['y1', y1],
            ['x2', x1],
            ['y2', y2],
            ['stroke-width', borderRightWidth.value],
            ['stroke', borderRightColor]
          ],
        };
        if(borderRightStyle === 'dashed') {
          item.props.push(['stroke-dasharray', `${borderRightWidth.value * 3}, ${borderRightWidth.value * 2}`])
        }
        else if(borderTopStyle === 'dotted') {
          item.props.push(['stroke-dasharray', `${borderRightWidth.value}, ${borderRightWidth.value}`])
        }
        virtualDom.bb.push(item);
      }
    }
    if(borderBottomWidth.value) {
      let x1 = x + borderLeftWidth.value;
      let y1 = y + height + borderTopWidth.value + borderBottomWidth.value * 0.5;
      let x2 = x1 + width;
      if(paddingLeft) {
        x2 += paddingLeft.value;
      }
      if(paddingRight) {
        x2 += paddingRight.value;
      }
      if(paddingTop) {
        y1 += paddingTop.value;
      }
      if(paddingBottom) {
        y1 += paddingBottom.value;
      }
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.lineWidth = borderBottomWidth.value;
        ctx.strokeStyle = borderBottomColor;
        if(borderBottomStyle === 'dashed') {
          ctx.setLineDash([borderBottomWidth.value * 3, borderBottomWidth.value * 2]);
        }
        else if(borderBottomStyle === 'dotted') {
          ctx.setLineDash([borderBottomWidth.value, borderBottomWidth.value * 2]);
        }
        else {
          ctx.setLineDash([]);
        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.stroke();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        let item = {
          type: 'item',
          tagName: 'line',
          props: [
            ['x1', x1],
            ['y1', y1],
            ['x2', x2],
            ['y2', y1],
            ['stroke-width', borderBottomWidth.value],
            ['stroke', borderBottomColor]
          ],
        };
        if(borderBottomStyle === 'dashed') {
          item.props.push(['stroke-dasharray', `${borderBottomWidth.value * 3}, ${borderBottomWidth.value * 2}`])
        }
        else if(borderBottomStyle === 'dotted') {
          item.props.push(['stroke-dasharray', `${borderBottomWidth.value}, ${borderBottomWidth.value}`])
        }
        virtualDom.bb.push(item);
      }
    }
    if(borderLeftWidth.value) {
      let x1 = x + borderLeftWidth.value * 0.5;
      let y1 = y;
      let y2 = y1 + height + borderTopWidth.value + borderBottomWidth.value;
      if(paddingTop) {
        y2 += paddingTop.value;
      }
      if(paddingBottom) {
        y2 += paddingBottom.value;
      }
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.lineWidth = borderLeftWidth.value;
        ctx.strokeStyle = borderLeftColor;
        if(borderLeftStyle === 'dashed') {
          ctx.setLineDash([borderLeftWidth.value * 3, borderLeftWidth.value * 2]);
        }
        else if(borderLeftStyle === 'dotted') {
          ctx.setLineDash([borderLeftWidth.value, borderLeftWidth.value * 2]);
        }
        else {
          ctx.setLineDash([]);
        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.stroke();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        let item = {
          type: 'item',
          tagName: 'line',
          props: [
            ['x1', x1],
            ['y1', y1],
            ['x2', x1],
            ['y2', y2],
            ['stroke-width', borderLeftWidth.value],
            ['stroke', borderLeftColor]
          ],
        };
        if(borderLeftStyle === 'dashed') {
          item.props.push(['stroke-dasharray', `${borderLeftWidth.value * 3}, ${borderLeftWidth.value * 2}`])
        }
        else if(borderLeftStyle === 'dotted') {
          item.props.push(['stroke-dasharray', `${borderLeftWidth.value}, ${borderLeftWidth.value}`])
        }
        virtualDom.bb.push(item);
      }
    }
  }

  get tagName() {
    return this.__tagName;
  }
  get outerWidth() {
    let { style: {
      borderLeftWidth,
      borderRightWidth,
      marginLeft,
      marginRight,
      paddingLeft,
      paddingRight,
    } } = this;
    return this.width
      + borderLeftWidth.value
      + borderRightWidth.value
      + marginLeft.value
      + marginRight.value
      + paddingLeft.value
      + paddingRight.value;
  }
  get outerHeight() {
    let { style: {
      borderTopWidth,
      borderBottomWidth,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    } } = this;
    return this.height
      + borderTopWidth.value
      + borderBottomWidth.value
      + marginTop.value
      + marginBottom.value
      + paddingTop.value
      + paddingBottom.value;
  }
  get listener() {
    return this.__listener;
  }
}

export default Xom;
