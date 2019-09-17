const CANVAS = 0;
const SVG = 1;

let div;
let svgHtml = '';

export default {
  CANVAS,
  SVG,
  appendHtml(s) {
    svgHtml += s;
  },
  get html() {
    return svgHtml;
  },
  reset() {
    svgHtml = '';
  },
  measure(s, style) {
    if(!div) {
      div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '99999px';
      div.style.top = '-99999px';
      div.style.visibility = 'hidden';
      document.body.appendChild(div);
    }
    div.style.fontSize = style.fontSize + 'px';
    div.innerText = s;
    let css = window.getComputedStyle(div, null);
    return parseFloat(css.width);
  }
};
