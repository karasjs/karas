import Dom from './node/Dom';
import Root from './node/Root';
import mode from './mode';
import Geom from './geom/Geom';
import Line from './geom/Line';
import Polyline from './geom/Polyline';
import Polygon from './geom/Polygon';
import Sector from './geom/Sector';
import Rect from './geom/Rect';
import Circle from './geom/Circle';
import Ellipse from './geom/Ellipse';
import Grid from './geom/Grid';

Geom.register('$line', Line);
Geom.register('$polyline', Polyline);
Geom.register('$polygon', Polygon);
Geom.register('$sector', Sector);
Geom.register('$rect', Rect);
Geom.register('$circle', Circle);
Geom.register('$ellipse', Ellipse);
Geom.register('$grid', Grid);

let karas = {
  render(cs, dom) {
    if(!(cs instanceof Root)) {
      throw new Error('render root muse be canvas or svg');
    }
    if(dom) {
      cs.appendTo(dom);
    }
    return cs;
  },
  createVd(tagName, props, children) {
    if(['canvas', 'svg'].indexOf(tagName) > -1) {
      return new Root(tagName, props, children);
    }
    if(Dom.isValid(tagName)) {
      return new Dom(tagName, props, children);
    }
    throw new Error('can not use marker: ' + tagName);
  },
  createGm(tagName, props) {
    let klass = Geom.getImplement(tagName);
    return new klass(tagName, props);
  },
  createCp(cp, props) {
    return new cp(props);
  },
  Geom,
  mode,
};

if(typeof window != 'undefined') {
  window.karas = karas;
}

export default karas;
