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
import sort from './util/sort';
import util from './util/util';
import parse from './util/parse';
import inject from './util/inject';
import abbr from './util/abbr';
import css from './style/css';
import unit from './style/unit';
import reset from './style/reset';
import frame from './animate/frame';
import easing from './animate/easing';
import level from './animate/level';
import Controller from './animate/Controller';
import math from './math/index';

Geom.register('$line', Line);
Geom.register('$polyline', Polyline);
Geom.register('$polygon', Polygon);
Geom.register('$sector', Sector);
Geom.register('$rect', Rect);
Geom.register('$circle', Circle);
Geom.register('$ellipse', Ellipse);

let karas = {
  render(root, dom) {
    if(!(root instanceof Root)) {
      throw new Error('Render must be canvas/svg');
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
  parse(json, dom, options = {}) {
    // 重载，在确定dom传入选择器字符串或html节点对象时作为渲染功能，否则仅创建vd返回
    if(dom) {
      if(util.isString(dom)
        || window.HTMLElement && (dom instanceof window.HTMLElement)) {}
      else {
        options = dom;
        dom = null;
      }
    }
    // 暂存所有动画声明，等root的生成后开始执行
    let animateRecords = [];
    let vd = parse(this, json, animateRecords, options);
    let { tagName } = json;
    // 有dom时parse作为根方法渲染
    if(dom) {
      if(['canvas', 'svg'].indexOf(tagName) === -1) {
        throw new Error('Parse root must be canvas/svg');
      }
      // parse模式会生成controller，动画总控制器
      let ac = vd.__animateController = new Controller(animateRecords);
      // 第一次render，收集递归json里面的animateRecords，它在xom的__layout最后生成
      this.render(vd, dom);
      // 总控次数、速度
      ac.__op(options);
      // 直接的json里的animateRecords，再加上递归的parse的json的（第一次render布局时处理）动画一并播放
      if(options.autoPlay !== false) {
        ac.play();
      }
    }
    // 递归的parse，如果有动画，此时还没root，先暂存下来，等上面的root的render第一次布局时收集
    else {
      if(['canvas', 'svg'].indexOf(tagName) > -1) {
        throw new Error(`Need a dom on parse(${tagName}, dom)`);
      }
      if(animateRecords.length) {
        vd.__animateRecords = animateRecords;
      }
    }
    return vd;
  },
  Root,
  Dom,
  Img,
  Geom,
  mode,
  Component,
  Event,
  sort,
  util,
  inject,
  css,
  unit,
  reset,
  abbr,
  frame,
  easing,
  level,
  math,
};

if(typeof window !== 'undefined') {
  window.karas = karas;
}

export default karas;
