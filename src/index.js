import Dom from './node/Dom';
import Img from './node/Img';
import Root from './node/Root';
import mode from './util/mode';
import Geom from './geom/Geom';
import Line from './geom/Line';
import Polyline from './geom/Polyline';
import Polygon from './geom/Polygon';
import Sector from './geom/Sector';
import Rect from './geom/Rect';
import Circle from './geom/Circle';
import Ellipse from './geom/Ellipse';
import Component from './node/Component';
import Event from './util/Event';
import util from './util/util';
import parser from './parser/index';
import inject from './util/inject';
import style from './style/index';
import animate from './animate/index';
import math from './math/index';
import { version } from '../package.json';

Geom.register('$line', Line);
Geom.register('$polyline', Polyline);
Geom.register('$polygon', Polygon);
Geom.register('$sector', Sector);
Geom.register('$rect', Rect);
Geom.register('$circle', Circle);
Geom.register('$ellipse', Ellipse);

let karas = {
  version,
  render(root, dom) {
    if(!(root instanceof Root)) {
      throw new Error('Render dom must be canvas/svg');
    }
    if(dom) {
      root.appendTo(dom);
    }
    return root;
  },
  createVd(tagName, props, children) {
    if(['canvas', 'svg'].indexOf(tagName) > -1) {
      return new Root(tagName, props, children);
    }
    if(Dom.isValid(tagName)) {
      if(tagName === 'img') {
        return new Img(tagName, props);
      }
      return new Dom(tagName, props, children);
    }
    throw new Error(`Can not use <${tagName}>`);
  },
  createGm(tagName, props) {
    let klass = Geom.getRegister(tagName);
    return new klass(tagName, props);
  },
  createCp(cp, props, children) {
    return new cp(props, children);
  },
  parse(json, dom, options) {
    parser.parse(this, json, dom, options);
  },
  Root,
  Dom,
  Img,
  Geom,
  mode,
  Component,
  Event,
  util,
  inject,
  style,
  parser,
  animate,
  math,
};

if(typeof window !== 'undefined') {
  window.karas = karas;
}

export default karas;
