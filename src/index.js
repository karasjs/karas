import Xom from './node/Xom';
import Dom from './node/Dom';
import Img from './node/Img';
import Root from './node/Root';
import $$type from './util/$$type';
import builder from './util/builder';
import updater from './util/updater';
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
  createElement(tagName, props) {
    props = props || {};
    let children = [];
    for(let i = 2, len = arguments.length; i < len; i++) {
      children.push(arguments[i]);
    }
    if(util.isString(tagName)) {
      if(tagName.charAt(0) === '$') {
        return this.createGm(tagName, props);
      }
      else {
        return this.createVd(tagName, props, children);
      }
    }
    else if(tagName) {
      return this.createCp(tagName, props, children);
    }
  },
  createVd(tagName, props, children = []) {
    if(['canvas', 'svg'].indexOf(tagName) > -1) {
      return new Root(tagName, props, children);
    }
    if(Dom.isValid(tagName)) {
      return {
        tagName,
        props,
        children,
        $$type: $$type.TYPE_VD,
      };
    }
    throw new Error(`Can not use <${tagName}>`);
  },
  createGm(tagName, props) {
    return {
      tagName,
      props,
      $$type: $$type.TYPE_GM,
    };
  },
  createCp(klass, props, children = []) {
    props.children = children;
    return {
      klass,
      props,
      $$type: $$type.TYPE_CP,
    };
  },
  parse(json, dom, options) {
    return parser.parse(this, json, dom, options);
  },
  mode,
  Component,
  Event,
  util,
  inject,
  style,
  parser,
  animate,
  math,
  builder,
  updater,
};

builder.ref({
  Xom,
  Dom,
  Img,
  Geom,
  Component,
});
updater.ref({
  Xom,
  Dom,
  Img,
  Geom,
  Component,
});

if(typeof window !== 'undefined') {
  window.karas = karas;
}

export default karas;
