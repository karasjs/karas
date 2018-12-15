import Canvas from './Canvas';
import Dom from './Dom';
import Geom from './Geom';
import Line from './Line';

let yurine = {
  render(canvas, dom) {
    if(!canvas instanceof Canvas) {
      throw new Error('render root muse be canvas');
    }
    if(dom) {
      canvas.appendTo(dom);
    }
    return canvas;
  },
  createCp(name, props) {
    switch(name) {
      case 'Line':
        return new Line(props);
    }
  },
  createVd(name, props, children) {
    if(name === 'canvas') {
      return new Canvas(props, children);
    }
    if(Dom.isValid(name)) {
      return new Dom(name, props, children);
    }
    throw new Error('can not use marker: ' + name);
  },
};

if(typeof window != 'undefined') {
  window.yurine = yurine;
}
else if(typeof global != 'undefined') {
  global.yurine = yurine;
}

export default yurine;
