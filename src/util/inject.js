import Text from '../node/Text';

export default {
  measureText(cb) {
    let { list, data } = Text.MEASURE_TEXT;
    let html = '';
    let keys = [];
    let chars = [];
    for(let i in data) {
      if(data.hasOwnProperty(i)) {
        let { key, style, s } = data[i];
        if(s) {
          let inline = `position:absolute;font-family:${style.fontFamily};font-size:${style.fontSize}px`;
          for(let j = 0, len = s.length; j < len; j++) {
            keys.push(key);
            let char = s.charAt(j);
            chars.push(char);
            html += `<span style="${inline}">${char.replace(/</, '&lt;')}</span>`;
          }
        }
      }
    }
    if(!html) {
      cb();
      return;
    }
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '99999px';
    div.style.top = '-99999px';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    div.innerHTML = html;
    let cns = div.childNodes;
    let { CHAR_WIDTH_CACHE, MEASURE_TEXT } = Text;
    for(let i = 0, len = cns.length; i < len; i++) {
      let node = cns[i];
      let key = keys[i];
      let char = chars[i];
      let css = window.getComputedStyle(node, null);
      CHAR_WIDTH_CACHE[key][char] = parseFloat(css.width);
    }
    list.forEach(text => text.__measureCb());
    cb();
    MEASURE_TEXT.list = [];
    MEASURE_TEXT.data = {};
    document.body.removeChild(div);
  },
  measureImg(url, cb) {
    let img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.left = '99999px';
    img.style.top = '-99999px';
    img.style.visibility = 'hidden';
    img.onload = function() {
      cb({
        success: true,
        width: img.width,
        height: img.height,
        source: img,
      });
    };
    img.onerror = function() {
      cb({
        success: false,
      });
    };
    img.src = url;
  },
};
