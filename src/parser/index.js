import parse from './parse';
import abbr from './abbr';
import inject from '../util/inject';
import util from '../util/util';
import font from '../style/font';
import Controller from '../animate/Controller';

let o = {
  parse(karas, json, dom, options) {
    if(!json) {
      return;
    }
    // 根节点的fonts字段定义字体信息
    let fonts = json.fonts;
    if(fonts) {
      if(!Array.isArray(fonts)) {
        fonts = [fonts];
      }
      fonts.forEach(item => {
        let { fontFamily, data } = item;
        if(fontFamily && data) {
          font.register(fontFamily, data);
        }
      });
    }
    // 重载，在确定dom传入选择器字符串或html节点对象时作为渲染功能，否则仅创建vd返回
    if(!inject.isDom(dom)) {
      options = options || dom || {};
      dom = null;
    }
    // json中定义无abbr
    if(json.abbr === false) {
      options.abbr = false;
    }
    if(options.abbr !== false) {
      inject.warn('Abbr in json is deprecated');
    }
    // 特殊单例声明无需clone加速解析
    if(!options.singleton && !json.singleton) {
      json = util.clone(json);
    }
    // 暂存所有动画声明，等root的生成后开始执行
    let animateRecords = [];
    let vd = parse(karas, json, animateRecords, options);
    // 有dom时parse作为根方法渲染
    if(dom) {
      let { tagName } = json;
      if(['canvas', 'svg', 'webgl'].indexOf(tagName) === -1) {
        throw new Error('Parse dom must be canvas/svg/webgl');
      }
      // parse直接（非递归）的动画记录
      let ac = options.controller instanceof Controller ? options.controller : vd.animateController;
      // 第一次render，收集递归json里面的animateRecords，它在xom的__layout最后生成
      karas.render(vd, dom);
      // 由于vd首先生成的都是json，根parse要特殊处理将target指向真正的vd引用，json的vd在builder中赋值
      animateRecords.forEach(item => {
        item.target = item.target.vd;
      });
      // 直接的json里的animateRecords，再加上递归的parse的json的（第一次render布局时处理）动画一并播放
      if(options.autoPlay !== false) {
        ac.__records = ac.__records.concat(animateRecords);
        ac.__playAuto();
      }
      // 不自动播放进入记录列表，初始化并等待手动调用
      else {
        ac.__records2 = ac.__records2.concat(animateRecords);
        ac.init(ac.__records2, ac.list2);
      }
    }
    // 递归的parse，如果有动画，此时还没root，先暂存下来，等上面的root的render第一次布局时收集
    else {
      if(animateRecords.length) {
        vd.__animateRecords = {
          options,
          list: animateRecords,
          controller: options.controller instanceof Controller ? options.controller : null,
        };
      }
    }
    return vd;
  },
  loadAndParse(karas, json, dom, options) {
    let { fonts, components, imgs } = json;
    let list1 = [];
    let list2 = [];
    let list3 = [];
    if(fonts) {
      if(!Array.isArray(fonts)) {
        fonts = [fonts];
      }
      fonts.forEach(item => {
        let url = item.url;
        if(url) {
          list1.push(item);
        }
      });
    }
    if(components) {
      if(!Array.isArray(components)) {
        components = [components];
      }
      components.forEach(item => {
        let { tagName, url, reload } = item;
        // 如果没申明reload且已经被注册，则无需重复加载
        if(tagName && karas.Component.hasRegister(tagName) && !reload) {
          return;
        }
        // 即便没有tagName也要加载，可能组件内部执行了注册逻辑
        if(url) {
          list2.push(item);
        }
      });
    }
    if(imgs) {
      if(!Array.isArray(imgs)) {
        imgs = [imgs];
      }
      imgs.forEach(item => {
        let url = item.url;
        if(url) {
          list3.push(url);
        }
      });
    }
    let a = list1.length, b = list2.length, c = list3.length;
    let count = 0;
    let cb = function() {
      if(count === a + b + c) {
        let res = o.parse(karas, json, dom, options);
        if(options && util.isFunction(options.callback)) {
          options.callback(res);
        }
      }
    };
    if(a || b || c) {
      karas.inject.loadFont(list1, function() {
        count += a;
        cb();
      });
      karas.inject.loadComponent(list2.map(item => item.url), function() {
        count += b;
        // 默认约定加载的js组件会在全局变量申明同名tagName，已有不覆盖，防止组件代码内部本身有register
        list2.forEach(item => {
          let tagName = item.tagName;
          if(tagName && window[tagName] && !karas.Component.hasRegister(tagName)) {
            karas.Component.register(tagName, window[tagName]);
          }
        });
        cb();
      });
      karas.inject.measureImg(list3, function() {
        count += c;
        cb();
      });
    }
    else {
      cb();
    }
  },
  abbr,
};

export default o;
