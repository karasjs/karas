import Dom from './node/Dom';
import CS from './node/CS';
import Line from './geom/Line';
import Polyline from './geom/Polyline';
import Polygon from './geom/Polygon';
import Sector from './geom/Sector';
import Rect from './geom/Rect';
import Circle from './geom/Circle';
import Ellipse from './geom/Ellipse';
import Grid from './geom/Grid';

let karas = {
  render(cs, dom) {
    if(!(cs instanceof CS)) {
      throw new Error('render root muse be canvas or svg');
    }
    if(dom) {
      cs.appendTo(dom);
    }
    return cs;
  },
  createVd(tagName, props, children) {
    if(['canvas', 'svg'].indexOf(tagName) > -1) {
      return new CS(tagName, props, children);
    }
    if(Dom.isValid(tagName)) {
      return new Dom(tagName, props, children);
    }
    throw new Error('can not use marker: ' + tagName);
  },
  createGm(tagName, props) {
    switch(tagName) {
      case '$line':
        return new Line(props);
      case '$polyline':
        return new Polyline(props);
      case '$polygon':
        return new Polygon(props);
      case '$sector':
        return new Sector(props);
      case '$rect':
        return new Rect(props);
      case '$circle':
        return new Circle(props);
      case '$ellipse':
        return new Ellipse(props);
      case '$grid':
        return new Grid(props);
    }
    throw new Error('can not use geom marker: ' + tagName);
  },
  createCp(cp, props) {
    return new cp(props);
  },
};

if(typeof window != 'undefined') {
  window.karas = karas;
}

export default karas;
