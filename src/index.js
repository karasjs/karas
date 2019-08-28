import Dom from './node/Dom';
import Canvas from './node/Canvas';
import Geom from './geom/Geom';
import Line from './geom/Line';

let karas = {
  render(canvas, dom) {
    if(!canvas instanceof Canvas) {
      throw new Error('render root muse be canvas');
    }
    if(dom) {
      canvas.appendTo(dom);
    }
    return canvas;
  },
  createVd(tagName, props, children) {
    if(tagName === 'canvas') {
      return new Canvas(props, children);
    }
    if(Dom.isValid(tagName)) {
      return new Dom(tagName, props, children);
    }
    throw new Error('can not use marker: ' + tagName);
  },
  createGp(tagName, props) {
    if(Geom.isValid(tagName)) {
      switch(tagName) {
        case '$line':
          return new Line(props);
        case '$point':
        default:
          throw new Error('can not use marker: ' + tagName);
      }
    }
  },
  createCp(tagName, props, children) {},
};

if(typeof window != 'undefined') {
  window.karas = karas;
}

export default karas;
