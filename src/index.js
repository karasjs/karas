import Dom from './node/Dom';
import Canvas from './node/Canvas';
import Geom from './geom/Geom';
import Line from './geom/Line';
import Polygon from './geom/Polygon';

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
  createGm(tagName, props) {
    if(Geom.isValid(tagName)) {
      switch(tagName) {
        case '$line':
          return new Line(props);
        case '$polygon':
          return new Polygon(props);
      }
    }
    throw new Error('can not use geom marker: ' + tagName);
  },
  createCp(tagName, props, children) {},
};

if(typeof window != 'undefined') {
  window.karas = karas;
}

export default karas;
