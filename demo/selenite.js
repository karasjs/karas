(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('homunculus')) :
    typeof define === 'function' && define.amd ? define(['homunculus'], factory) :
      (global = global || self, global.selenite = factory(global.homunculus));
}(this, function (homunculus) { 'use strict';

  homunculus = homunculus && homunculus.hasOwnProperty('default') ? homunculus['default'] : homunculus;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var Token = homunculus.getClass('token', 'jsx');
  var S = {};
  S[Token.LINE] = S[Token.COMMENT] = S[Token.BLANK] = true;
  var res;

  function recursion(node, excludeLine) {
    if (node.isToken()) {
      var token = node.token();

      if (!token.isVirtual()) {
        res += token.content();

        while (token.next()) {
          token = token.next();

          if (token.isVirtual() || !S.hasOwnProperty(token.type())) {
            break;
          }

          var s = token.content();

          if (!excludeLine || s !== '\n') {
            res += token.content();
          }
        }
      }
    } else {
      node.leaves().forEach(function (leaf) {
        recursion(leaf, excludeLine);
      });
    }
  }

  function join (node, excludeLine) {
    res = '';
    recursion(node, excludeLine);
    return res;
  }

  function quickSort(arr, begin, end, compare) {
    if (begin >= end) {
      return;
    }

    var i = begin,
      j = end,
      p = i,
      n = arr[p],
      seq = true;

    outer: while (i < j) {
      if (seq) {
        for (; i < j; j--) {
          if (compare && compare.call(arr, n, arr[j]) || !compare && n > arr[j]) {
            swap(arr, p, j);
            p = j;
            seq = !seq;
            continue outer;
          }
        }
      } else {
        for (; i < j; i++) {
          if (compare && compare.call(arr, arr[i], n) || !compare && n < arr[i]) {
            swap(arr, p, i);
            p = i;
            seq = !seq;
            continue outer;
          }
        }
      }
    }

    quickSort(arr, begin, p, compare);
    quickSort(arr, p + 1, end, compare);
  }

  function swap(arr, a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  function sort (arr, compare) {
    if (!Array.isArray(arr)) {
      throw new Error('quick sort need an array');
    }

    if (arr.length < 2) {
      return arr;
    }

    quickSort(arr, 0, arr.length - 1, compare);
    return arr;
  }

  var Token$1 = homunculus.getClass('token', 'css');
  var Node = homunculus.getClass('node', 'css');
  var idx;

  function parse(node) {
    idx = 0;
    var res = {};
    node.leaves().forEach(function (leaf, i) {
      if (leaf.name() === Node.STYLESET) {
        styleset(leaf, res);
      }
    });
    return res;
  }

  function styleset(node, res) {
    var sels = selectors(node.first());
    var styles = block(node.last());
    var i = idx++;
    sels.forEach(function (sel) {
      record(sel, i, styles, res);
    });
  }

  function selectors(node) {
    var res = [];
    node.leaves().forEach(function (leaf) {
      if (leaf.name() === Node.SELECTOR) {
        res.push(selector(leaf));
      }
    });
    return res;
  }

  function selector(node) {
    return node.leaves().map(function (leaf) {
      return leaf.token();
    });
  }

  function block(node) {
    var res = [];
    node.leaves().forEach(function (leaf) {
      if (leaf.name() === Node.STYLE) {
        res.push(style(leaf));
      }
    });
    return res;
  }

  function style(node) {
    var s = join(node, true).trim();
    s = s.replace(/;$/, '');
    return s;
  }

  function record(sel, idx, styles, res) {
    var _p = [0, 0, 0];

    for (var i = sel.length - 1; i >= 0; i--) {
      var temp = {
        s: [],
        a: [],
        p: []
      };
      var t = sel[i];
      var s = t.content();
      priority(t, s, _p);

      switch (t.type()) {
        case Token$1.SELECTOR:
          temp.s.push(s);
          break;

        case Token$1.PSEUDO:
          var s2 = s.replace(/^:+/, '');

          if (sel[i].content() === '(') {
            s2 += '(';

            for (var j = i + 1; j < sel.length; j++) {
              if (sel[j].content() === ')') {
                s2 += ')';
                break;
              }

              s2 += sel[j].content();
            }
          }

          temp.p.push(s2);
          break;

        case Token$1.SIGN:
          switch (s) {
            case ']':
              var item = [];
              i--;
              t = t.prev();

              while (t) {
                s = t.content();

                if (s === '[') {
                  break;
                }

                i--;
                t = t.prev();
                s = s.replace(/^(['"])(.*)\1$/, '$2');
                item.unshift(s);
              }

              temp.a.push({
                v: item,
                s: item.join('')
              });
              break;

            case '+':
            case '>':
            case '~':
              s = '_' + s;
              res[s] = res[s] || {};
              res = res[s];
              continue;
            //忽略掉()，因为其出现在:nth-child(n)中

            case ')':
              i--;
              t = t.prev();

              while (t) {
                s = t.content();

                if (s === '(') {
                  break;
                }

                i--;
                t = t.prev();
              }

              break;
          }

          break;
      }

      t = t.prev();

      while (t && !isSplit(t)) {
        s = t.content();
        priority(t, s, _p);

        switch (t.type()) {
          case Token$1.SELECTOR:
            temp.s.push(s);
            break;

          case Token$1.PSEUDO:
            var _s = s.replace(/^:+/, '');

            if (sel[i].content() === '(') {
              _s += '(';

              for (var _j = i + 1; _j < sel.length; _j++) {
                if (sel[_j].content() === ')') {
                  _s += ')';
                  break;
                }

                _s += sel[_j].content();
              }
            }

            temp.p.push(_s);
            break;

          case Token$1.SIGN:
            switch (s) {
              case ']':
                var _item = [];
                i--;
                t = t.prev();

                while (t) {
                  s = t.content();

                  if (s === '[') {
                    break;
                  }

                  i--;
                  t = t.prev();
                  s = s.replace(/^(['"])(.*)\1$/, '$2');

                  _item.unshift(s);
                }

                temp.a.push({
                  v: _item,
                  s: _item.join('')
                });
                break;

              case '+':
              case '>':
              case '~':
                s = '_' + s;
                res[s] = res[s] || {};
                res = res[s];
                continue;
              //忽略掉()，因为其出现在:nth-child(n)中

              case ')':
                i--;
                t = t.prev();

                while (t) {
                  s = t.content();

                  if (s === '(') {
                    break;
                  }

                  i--;
                  t = t.prev();
                }

                break;
            }

            break;
        }

        t = t.prev();
        i--;
      }

      res = save(temp, res);
    }

    res._v = res._v || [];
    styles.forEach(function (style) {
      var _style$split = style.split(':'),
        _style$split2 = _slicedToArray(_style$split, 2),
        k = _style$split2[0],
        v = _style$split2[1];

      k = k.replace(/-(\w)/g, function ($0, $1) {
        return $1.toUpperCase();
      });

      res._v.push([idx, [k, v]]);
    });
    res._p = _p;
  }

  function priority(token, s, p) {
    switch (token.type()) {
      case Token$1.SELECTOR:
        if (s.charAt(0) === '#') {
          p[0]++;
        } else if (s.charAt(0) === '.') {
          p[1]++;
        } else {
          p[2]++;
        }

        break;

      case Token$1.PSEUDO:
        p[2]++;
        break;

      case Token$1.SIGN:
        if (s === ']') {
          p[1]++;
        }

        break;
    }
  }

  function isSplit(token) {
    if (token.type() === Token$1.BLANK) {
      return true;
    }

    if (token.type() === Token$1.LINE) {
      return true;
    }

    if (token.type() === Token$1.SIGN) {
      return ['>', '+', '~', '{', '}', ','].indexOf(token.content()) > -1;
    }

    return false;
  }

  function save(temp, res) {
    if (!temp.s.length) {
      temp.s.push('*');
    } //selector按name/class/id排序


    sort(temp.s, function (a, b) {
      return a !== '*' && a < b || b === '*';
    });
    var star = temp.s[0] === '*'; //*开头有几种组合，记录之

    if (star) {
      res['_*'] = true;

      if (temp.s.length > 1) {
        if (temp.s.length > 2) {
          res['_*.#'] = true;
        } else if (temp.s[1][0] === '.') {
          res['_*.'] = true;
        } else {
          res['_*#'] = true;
        }
      }
    }

    var s = temp.s.join('');
    res[s] = res[s] || {};
    res = res[s]; //伪类

    if (temp.p.length) {
      res['_:'] = res['_:'] || [];
      var pseudos = res['_:'];
      var pseudo = [];
      temp.p.forEach(function (item) {
        //防止多次重复
        if (pseudo.indexOf(item) === -1) {
          pseudo.push(item);
        }
      }); //排序后比对，可能重复，合并之如a:hover{...}a:hover{...}会生成2个hover数组

      sort(pseudo, function (a, b) {
        return a < b;
      });
      var isExist = -1;

      for (var j = 0, len = pseudos.length; j < len; j++) {
        if (pseudos[j][0].join(',') === pseudo.join(',')) {
          isExist = j;
          break;
        }
      }

      if (isExist > -1) {
        res = pseudos[isExist][1];
      } else {
        var arr = [];
        arr.push(pseudo);
        res = {};
        arr.push(res);
        pseudos.push(arr);
      }
    } //属性


    if (temp.a.length) {
      res['_['] = res['_['] || [];
      var attrs = res['_['];
      var attr = []; //去重并排序

      sort(temp.a, function (a, b) {
        return a.s < b.s;
      });
      var hash = {};
      temp.a.forEach(function (item) {
        if (!hash.hasOwnProperty(item.s)) {
          attr.push(item.v);
        }
      });

      var _isExist = -1;

      var _join = '';
      _join += attr.map(function (item) {
        return item.join('');
      });

      for (var _j2 = 0, _len = attrs.length; _j2 < _len; _j2++) {
        var s1 = '';
        s1 += attrs[_j2][0].map(function (item) {
          return item.join('');
        });

        if (s1 === _join) {
          _isExist = _j2;
          break;
        }
      }

      if (_isExist > -1) {
        res = attrs[_isExist][1];
      } else {
        var _arr = [];

        _arr.push(attr);

        res = {};

        _arr.push(res);

        attrs.push(_arr);
      }
    }

    return res;
  }

  var Selenite =
    /*#__PURE__*/
    function () {
      function Selenite() {
        _classCallCheck(this, Selenite);

        this.parser = null;
        this.node = null;
      }

      _createClass(Selenite, [{
        key: "parse",
        value: function parse$1(code) {
          this.parser = homunculus.getParser('css');
          this.node = this.parser.parse(code);
          return parse(this.node);
        }
      }, {
        key: "tokens",
        value: function tokens() {
          return this.ast ? this.parser.lexer.tokens() : null;
        }
      }, {
        key: "ast",
        value: function ast() {
          return this.node;
        }
      }]);

      return Selenite;
    }();

  var index = new Selenite();

  return index;

}));
//# sourceMappingURL=index.js.map
