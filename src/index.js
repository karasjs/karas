import Canvas from './Canvas';
import Dom from './Dom';
import Geom from './geom/Geom';
import Line from './geom/Line';
import config from './config';

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
  createGeom(name, props) {
    switch(name) {
      case 'Line':
        return new Line(props);
    }
  },
  createDom(tagName, props, children) {
    if(tagName === 'canvas') {
      return new Canvas(props, children);
    }
    if(Geom.isValid(tagName)) {
      switch(tagName) {
        case 'line':
          return new Line(props);
      }
    }
    else if(Dom.isValid(tagName)) {
      return new Dom(tagName, props, children);
    }
    throw new Error('can not use marker: ' + tagName);
  },
  Line,
  config,
};

if(typeof window != 'undefined') {
  window.karas = karas;
}

export default karas;
