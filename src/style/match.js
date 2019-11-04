import sort from '../util/sort';
import Text from '../node/Text';

function splitClass(s) {
  s = (s || '').trim();
  if(s) {
    return s.split(/\s+/);
  }
}

function parse(dom, top, json) {
  if(!json) {
    return;
  }
  let list = [];
  matchSel(dom, top, json, list);
  sort(list, function(a, b) {
    let pa = a[2];
    let pb = b[2];
    // 先比较优先级
    for(let i = 0; i < 3; i++) {
      if(pa[i] !== pb[i]) {
        return pa[i] > pb[i];
      }
    }
    // 优先级相等比较出现顺序
    return a[0] > b[0];
  });
  let res = {};
  for(let i = list.length - 1; i >= 0; i--) {
    let item = list[i];
    let [k, v] = item[1];
    if(!res.hasOwnProperty(k)) {
      res[k] = v;
    }
  }
  return res;
}

// 从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
function matchSel(dom, top, json, res) {
  let selList = combo(dom, json);
  selList.forEach(sel => {
    if(json.hasOwnProperty(sel)) {
      let item = json[sel];
      // 还未到根节点需继续向上，注意可以递归向上，多层级时需递归所有父层级组合
      let parent = dom.parent;
      while(parent) {
        matchSel(parent, top, item, res);
        parent = parent.parent;
      }
      // 将当前层次的值存入
      if(item.hasOwnProperty('_v')) {
        dealStyle(res, item);
      }
      // 父子选择器
      if(item.hasOwnProperty('_>')) {
        let parentStyle = item['_>'];
        matchSel(dom.parent, this, parentStyle, res);
      }
      // 相邻兄弟选择器
      if(item.hasOwnProperty('_+')) {
        let sibling = item['_+'];
        let prev = dom.prev;
        if(prev && !(prev instanceof Text)) {
          let prevSelList = combo(prev, sibling);
          let hash = arr2hash(prevSelList);
          Object.keys(sibling).forEach(function(k) {
            let item2 = sibling[k];
            // 有值且兄弟选择器命中时存入结果
            if(item2.hasOwnProperty('_v') && hash.hasOwnProperty(k)) {
              dealStyle(res, item2);
            }
          });
        }
      }
      // 兄弟选择器，不一定相邻，一直往前找
      if(item.hasOwnProperty('_~')) {
        let sibling = item['_~'];
        let prev = dom.prev;
        let hasMatch;
        while(prev) {
          if(prev instanceof Text) {
            prev = prev.prev;
            continue;
          }
          let prevSelList = combo(prev, sibling);
          let hash = arr2hash(prevSelList);
          Object.keys(sibling).forEach(function(k) {
            let item2 = sibling[k];
            // 有值且兄弟选择器命中时存入结果
            if(item2.hasOwnProperty('_v') && hash.hasOwnProperty(k)) {
              dealStyle(res, item2);
            }
          });
          prev = prev.prev;
        }
      }
    }
  });
}

// 组合出dom的所有sel可能
function combo(dom, json) {
  let { class: klass, tagName, id } = dom;
  klass = klass.slice();
  sort(klass, function(a, b) {
    return a > b;
  });
  let ks = [];
  if(klass.length) {
    comboClass(klass, ks, klass.length, 0);
  }
  // 各种*的情况标识，只有存在时才放入sel组合，可以减少循环次数
  let hasStarClass = json.hasOwnProperty('_*.');
  let hasStarId = json.hasOwnProperty('_*#');
  let hasStarIdClass = json.hasOwnProperty('_*.#');
  let res = [tagName];
  // 只有当前有_*时说明有*才匹配
  if(json.hasOwnProperty('_*')) {
    res.push('*');
  }
  if(id) {
    id = '#' + id;
    res.push(id);
    res.push(tagName + id);
    if(hasStarId) {
      res.push('*' + id);
    }
  }
  ks.forEach(klass => {
    res.push(klass);
    res.push(tagName + klass);
    if(hasStarClass) {
      res.push('*' + klass);
    }
    if(id) {
      res.push(klass + id);
      res.push(tagName + klass + id);
      if(hasStarIdClass) {
        res.push('*' + klass + id);
      }
    }
  });
  return res;
}

// 组合出klass里多个的可能，如.b.a和.c.b.a，注意有排序，可以使得相等比较更容易
function comboClass(arr, res, len, i) {
  if(len - i > 1) {
    comboClass(arr, res, len, i + 1);
    for(let j = 0, len2 = res.length; j < len2; j++) {
      res.push(res[j] + '.' + arr[i]);
    }
  }
  res.push('.' + arr[i]);
}

function dealStyle(res, item) {
  item._v.forEach(function(style) {
    style[2] = item._p;
    res.push(style);
  });
}

function arr2hash(arr) {
  let hash = {};
  arr.forEach(item => {
    hash[item] = true;
  });
  return hash;
}

function mergeCss(a, b) {
  if(!b) {
    return a;
  }
  if(!a) {
    return b;
  }
  for(let i in b) {
    if(b.hasOwnProperty(i)) {
      let o = b[i];
      let flag = {
        _v: true,
        _p: true,
      }.hasOwnProperty(i);
      if(!flag && typeof o === 'object' && a.hasOwnProperty(i)) {
        a[i] = mergeCss(a[i], o);
      }
      else {
        a[i] = o;
      }
    }
  }
  return a;
}

export default {
  parse,
  splitClass,
  mergeCss,
};
