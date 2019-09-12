let mode = 0;
let measureDom;
let svgHtml;

export default {
  setCanvas() {
    mode = 0;
  },
  setSvg() {
    mode = 1;
    svgHtml = '';
  },
  isCanvas() {
    return mode === 0;
  },
  isSvg() {
    return mode === 1;
  },
  appendHtml(s) {
    svgHtml += s;
  },
  get html() {
    return svgHtml;
  },
  get measure() {
    if(!measureDom) {
      measureDom = document.createElement('div');
      measureDom.style.position = 'absolute';
      measureDom.style.left = '99999px';
      measureDom.style.top = '-99999px';
      measureDom.style.visibility = 'hidden';
      document.body.appendChild(measureDom);
    }
    return measureDom;
  }
};
