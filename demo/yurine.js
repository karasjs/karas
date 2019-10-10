(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('homunculus')) :
  typeof define === 'function' && define.amd ? define(['homunculus'], factory) :
  (global = global || self, global.yurine = factory(global.homunculus));
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

  var ES6Token = homunculus.getClass('token', 'js');
  var Token = homunculus.getClass('token', 'csx');
  var Node = homunculus.getClass('node', 'csx');
  var S = {};
  S[Token.LINE] = S[Token.COMMENT] = S[Token.BLANK] = true;
  var res;
  var append;

  function ignore(node, includeLine) {
    if (node instanceof Token || node instanceof ES6Token) {
      if (node.isVirtual()) {
        return;
      }

      node.ignore = true;
      append = '';

      while (node = node.next()) {
        if (node.isVirtual() || !S.hasOwnProperty(node.type())) {
          break;
        }

        var s = node.content();
        res += s;
        append += s;

        if (includeLine || s != '\n') {
          node.ignore = true;
        }
      }
    } else if (node.isToken()) {
      ignore(node.token(), includeLine);
    } else {
      node.leaves().forEach(function (leaf) {
        ignore(leaf, includeLine);
      });
    }
  }

  function parse(node, includeLine) {
    res = '';
    append = '';
    ignore(node, includeLine);
    return {
      res: res,
      append: append
    };
  }

  parse.S = S;

  var Token$1 = homunculus.getClass('token', 'csx');
  var Node$1 = homunculus.getClass('node', 'csx');

  function parse$1(node, res, param, opt) {
    switch (node.name()) {
      case Node$1.EXPRSTMT:
        linkage(node.first(), param, opt).arr.forEach(function (item) {
          res[item] = true;
        });
        break;

      case Node$1.VARSTMT:
        node.leaves().forEach(function (leaf, i) {
          if (i % 2 === 1) {
            var initlz = leaf.leaf(1);
            var temp = linkage(initlz.leaf(1), param, opt);
            temp.arr.forEach(function (item) {
              res[item] = true;
            });
          }
        });
        break;

      case Node$1.BLOCKSTMT:
        var block = node.first();

        for (var i = 1, _leaves = block.leaves(); i < _leaves.length - 1; i++) {
          parse$1(_leaves[i], res, param, opt);
        }

        break;

      case Node$1.IFSTMT:
        var condition = node.leaf(2);
        linkage(condition, param, opt).arr.forEach(function (item) {
          res[item] = true;
        });
        parse$1(node.last(), res, param, opt);
        break;

      case Node$1.ITERSTMT:
        var peek = node.first().token().content();

        if (peek === 'for') {
          var first = node.leaf(2); // for(;...

          if (first.isToken()) ; else {
            if (first.name() === Node$1.LEXDECL) {
              parse$1(first, res, param, opt);
            } else if (first.name() === Node$1.VARSTMT) {
              parse$1(first, res, param, opt);
            }
          }

          var second = node.leaf(3); // for(;;...

          if (second.isToken()) ; else {
            var temp = linkage(second, param, opt);
            temp.arr.forEach(function (item) {
              res[item] = true;
            });
          }

          var third = node.leaf(4);

          if (third.isToken()) {
            third = node.leaf(5);

            if (third.isToken()) ; else {
              var _temp = linkage(third, param, opt);

              _temp.arr.forEach(function (item) {
                res[item] = true;
              });
            }
          } else {
            var _temp2 = linkage(third, param, opt);

            _temp2.arr.forEach(function (item) {
              res[item] = true;
            });
          }
        } else if (peek === 'do') {
          var _blockstmt = node.leaf(1);

          parse$1(_blockstmt, res, param, opt);

          var _temp3 = linkage(node.leaf(4), param, opt);

          _temp3.arr.forEach(function (item) {
            res[item] = true;
          });
        } else if (peek === 'while') {
          var _temp4 = linkage(node.leaf(2), param, opt);

          _temp4.arr.forEach(function (item) {
            res[item] = true;
          });

          var stmt = node.last();
          parse$1(stmt, res, param, opt);
        }

        break;

      case Node$1.LEXDECL:
        node.leaves().forEach(function (leaf, i) {
          if (i % 2 === 1) {
            var initlz = leaf.leaf(1);

            var _temp5 = linkage(initlz.leaf(1), param, opt);

            _temp5.arr.forEach(function (item) {
              res[item] = true;
            });
          }
        });
        break;

      case Node$1.RETSTMT:
        // 第一层arrowFn的return语句不包含在linkage中，还有递归return的arrowFn也是
        if (opt.arrowFn.length > 0) {
          var allReturn = true;

          for (var _i = 0, len = opt.arrowFn.length; _i < len; _i++) {
            if (!opt.arrowFn[_i]) {
              allReturn = false;
              break;
            }
          }

          if (!allReturn) {
            linkage(node.leaf(1), param, opt).arr.forEach(function (item) {
              res[item] = true;
            });
          }
        }

        break;

      case Node$1.WITHSTMT:
        linkage(node.leaf(2), param, opt).arr.forEach(function (item) {
          res[item] = true;
        });
        var blockstmt = node.last();
        parse$1(blockstmt, res, param, opt);
        break;

      case Node$1.SWCHSTMT:
        linkage(node.leaf(2), param, opt).arr.forEach(function (item) {
          res[item] = true;
        });
        var caseblock = node.last();
        parse$1(caseblock, res, param, opt);
        break;

      case Node$1.CASEBLOCK:
        var leaves = node.leaves();

        for (var _i2 = 1; _i2 < leaves.length - 1; _i2++) {
          var leaf = leaves[_i2];

          if (leaf.name() === Node$1.CASECLAUSE) {
            var expr = leaf.leaf(1);

            var _temp6 = linkage(expr, param, opt);

            _temp6.arr.forEach(function (item) {
              res[item] = true;
            });

            parse$1(leaf.last(), res, param, opt);
          } else if (leaf.name() === Node$1.DFTCLAUSE) {
            parse$1(leaf.last(), res, param, opt);
          }
        }

        break;
    }
  }

  function arrowfn (node, res, param, opt) {
    node.leaves().forEach(function (leaf) {
      parse$1(leaf, res, param, opt);
    });
  }

  var Token$2 = homunculus.getClass('token', 'csx');
  var Node$2 = homunculus.getClass('node', 'csx');

  function parse$2(node, res, param, opt) {
    if (node.isToken()) ; else {
      switch (node.name()) {
        case Node$2.EXPR:
          parse$2(node.first(), res, param, opt); //可能有连续多个表达式

          for (var i = 2, leaves = node.leaves(), len = leaves.length; i < len; i += 2) {
            parse$2(node.leaf(i), res, param, opt);
          }

          break;

        case Node$2.PRMREXPR:
          parse$2(node.first(), res, param, opt);
          break;

        case Node$2.MMBEXPR:
          mmbexpr(node, res, param, opt);
          break;

        case Node$2.CNDTEXPR:
          parse$2(node.first(), res, param, opt);
          parse$2(node.leaf(2), res, param, opt);
          parse$2(node.last(), res, param, opt);
          break;

        case Node$2.LOGOREXPR:
        case Node$2.LOGANDEXPR:
        case Node$2.BITANDEXPR:
        case Node$2.BITOREXPR:
        case Node$2.BITXOREXPR:
        case Node$2.EQEXPR:
        case Node$2.RELTEXPR:
        case Node$2.SHIFTEXPR:
        case Node$2.ADDEXPR:
        case Node$2.MTPLEXPR:
          parse$2(node.first(), res, param, opt); //可能有连续多个表达式

          for (var _i = 2, _leaves = node.leaves(), _len = _leaves.length; _i < _len; _i += 2) {
            parse$2(node.leaf(_i), res, param, opt);
          }

          break;

        case Node$2.UNARYEXPR:
        case Node$2.NEWEXPR:
          parse$2(node.last(), res, param, opt);
          break;

        case Node$2.POSTFIXEXPR:
          parse$2(node.first(), res, param, opt);
          break;

        case Node$2.CALLEXPR:
          callexpr(node, res, param, opt);
          break;

        case Node$2.ARRLTR:
          arrltr(node, res, param, opt);
          break;

        case Node$2.CPEAPL:
          cpeapl(node, res, param, opt);
          break;

        case Node$2.ARGS:
          parse$2(node.leaf(1), res, param, opt);
          break;

        case Node$2.ARGLIST:
        case Node$2.TEMPLATE:
          for (var _i2 = 0, _leaves2 = node.leaves(), _len2 = _leaves2.length; _i2 < _len2; _i2++) {
            var leaf = node.leaf(_i2);

            if (!leaf.isToken()) {
              parse$2(leaf, res, param, opt);
            }
          }

          break;

        case Node$2.ARROWFN:
          opt.arrowFn = opt.arrowFn || [];
          var temp = node.parent();

          if (temp && temp.name() === Node$2.ARGLIST) {
            temp = temp.parent();

            if (temp && temp.name() === Node$2.ARGS) {
              temp = temp.prev();

              if (temp && temp.name() === Node$2.MMBEXPR) {
                var _callexpr = temp.parent();

                temp = temp.leaf(2);

                if (temp.isToken() && temp.token().content() === 'map') {
                  var body = node.last().leaf(1);

                  if (opt.arrowFn.length === 0) {
                    opt.arrowFn.push(true);
                  } else {
                    opt.arrowFn.push(_callexpr.parent().name() === Node$2.RETSTMT);
                  }

                  arrowfn(body, res, param, opt);
                  opt.arrowFn.pop();
                }
              }
            }
          }

          break;

        case Node$2.CSXElement:
          parse$2(node.first(), res, param, opt);

          for (var _i3 = 1, _leaves3 = node.leaves(); _i3 < _leaves3.length - 1; _i3++) {
            parse$2(_leaves3[_i3], res, param, opt);
          }

          break;

        case Node$2.CSXSelfClosingElement:
        case Node$2.CSXOpeningElement:
          for (var _i4 = 1, _leaves4 = node.leaves(); _i4 < _leaves4.length - 1; _i4++) {
            parse$2(_leaves4[_i4], res, param, opt);
          }

          break;

        case Node$2.CSXAttribute:
          var value = node.last();

          if (value.name() === Node$2.CSXAttributeValue) {
            var first = value.first();

            if (first.isToken() && first.token().content() === '{') {
              parse$2(value.leaf(1), res, param, opt);
            }
          }

          break;

        case Node$2.CSXChild:
          node.leaves().forEach(function (leaf) {
            parse$2(leaf, res, param, opt);
          });
          break;
      }
    }
  }

  function mmbexpr(node, res, param, opt) {
    var prmr = node.first();

    if (prmr.name() === Node$2.PRMREXPR) {
      var first = prmr.first();

      if (first.isToken()) {
        var me = first.token().content();

        if (me === 'this') {
          var dot = node.leaf(1);

          if (dot.isToken()) {
            if (dot.token().content() === '.') {
              var token = dot.next();
              var id = token.token().content();

              if (id === 'model') {
                if (node.name() === Node$2.MMBEXPR) {
                  var next = node.next();

                  if (next.isToken()) {
                    if (next.token().content() === '.') {
                      next = next.next();

                      if (next.isToken()) {
                        var _token = next.token();

                        res['model.' + _token.content()] = true;
                      }
                    } else if (next.token().content() === '[') {
                      var expr = next.next();

                      if (expr.name() === Node$2.PRMREXPR) {
                        var s = expr.first();

                        if (s.isToken()) {
                          s = s.token();

                          if (s.type() === Token$2.STRING) {
                            res['model.' + s.val()] = true;
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                res[id] = true;
              }
            } else if (dot.token().content() === '[') {
              var _expr = dot.next();

              if (_expr.name() === Node$2.EXPR) {
                parse$2(_expr.last(), res, param, opt);
              } else if (_expr.name() === Node$2.PRMREXPR) {
                var _s = _expr.first();

                if (_s.isToken()) {
                  _s = _s.token();

                  if (_s.type() === Token$2.STRING) {
                    res[_s.val()] = true;
                  }
                }
              } else {
                parse$2(_expr, res, param, opt);
              }
            }
          }
        } else {
          var bracket = node.leaf(1);

          if (bracket.isToken()) {
            if (bracket.token().content() === '[') {
              var _expr2 = bracket.next();

              if (_expr2.name() === Node$2.EXPR) {
                parse$2(_expr2.last(), res, param, opt);
              } else {
                parse$2(_expr2, res, param, opt);
              }
            }
          }
        }
      } else {
        parse$2(first, res, param, opt);
      }
    } else if (prmr.name() === Node$2.MMBEXPR) {
      mmbexpr(prmr, res, param, opt);

      var _dot = prmr.next();

      if (_dot.isToken() && _dot.token().content() === '[') {
        var _expr3 = _dot.next();

        if (_expr3.name() === Node$2.EXPR) {
          parse$2(_expr3.last(), res, param, opt);
        } else if (_expr3.name() === Node$2.PRMREXPR) {
          var _s2 = _expr3.first();

          if (_s2.isToken()) {
            _s2 = _s2.token();

            if (_s2.type() === Token$2.STRING) {
              res[_s2.val()] = true;
            }
          }
        } else {
          parse$2(_expr3, res, param, opt);
        }
      }
    } else {
      parse$2(prmr, res, param, opt);
    }
  }

  function callexpr(node, res, param, opt) {
    parse$2(node.first(), res, param, opt);
    var args = node.last();

    if (args.name() === Node$2.ARGS) {
      args.leaf(1).leaves().forEach(function (leaf, i) {
        if (i % 2 === 0) {
          parse$2(leaf, res, param, opt);
        }
      });
    }
  }

  function arrltr(node, res, param, opt) {
    node.leaves().forEach(function (leaf, i) {
      if (i % 2 === 1) {
        if (!leaf.isToken()) {
          parse$2(leaf, res, param, opt);
        }
      }
    });
  }

  function cpeapl(node, res, param, opt) {
    if (node.size() > 2) {
      var leaf = node.leaf(1);

      if (!leaf.isToken()) {
        parse$2(leaf, res, param, opt);
      }
    }
  }

  function linkage (node, param, opt) {
    var res = {}; // 取得全部this.xxx

    parse$2(node, res, param, opt);
    var arr = Object.keys(res);
    var bind = false;
    arr = arr.filter(function (item) {
      //model.xxx全部通过
      if (item.indexOf('model.') === 0) {
        bind = true;
        return true;
      } //没get不通过


      if (!(param.getHash || {}).hasOwnProperty(item)) {
        return false;
      } //有get需要有bind或link


      return (param.bindHash || {}).hasOwnProperty(item) || (param.evalHash || {}).hasOwnProperty(item) || (param.linkHash || {}).hasOwnProperty(item);
    }); // 只要有一个是双向绑定就是双向

    arr.forEach(function (item) {
      if ((param.bindHash || {}).hasOwnProperty(item)) {
        bind = true;
      }
    }); // 因特殊Array优化需要，this.v或者(..., this.v)形式的侦听变量
    // see https://github.com/migijs/migi/issues/29

    var single = false;

    if (node.name() === Node$2.MMBEXPR && node.leaves().length === 3 && node.first().name() === Node$2.PRMREXPR) {
      single = arr.length === 1 && node.first().first().isToken() && node.first().first().token().content() === 'this' && node.last().isToken() && node.last().token().content() === arr[0];
    } else if (node.name() === Node$2.MMBEXPR && node.leaves().length === 3 && node.first().name() === Node$2.MMBEXPR && node.first().leaves().length === 3 && node.first().first().name() === Node$2.PRMREXPR) {
      single = arr.length === 1 && node.first().first().first().isToken() && node.first().first().first().token().content() === 'this' && node.first().last().isToken() && node.first().last().token().content() === 'model' && node.last().isToken() && node.last().token().content() === arr[0].slice(6);
    } else if (node.name() === Node$2.PRMREXPR && node.first().name() === Node$2.CPEAPL) {
      var _cpeapl = node.first();

      if (_cpeapl.leaves().length === 3 && _cpeapl.leaf(1).name() === Node$2.EXPR) {
        var expr = _cpeapl.leaf(1);

        if (expr.last().name() === Node$2.MMBEXPR) {
          var _mmbexpr = expr.last();

          if (_mmbexpr.leaves().length === 3 && _mmbexpr.first().name() === Node$2.PRMREXPR && _mmbexpr.last().isToken()) {
            single = arr.length && _mmbexpr.first().first().isToken() && _mmbexpr.first().first().token().content() === 'this' && _mmbexpr.last().token().content() === arr[arr.length - 1];
          }
        }
      } else if (_cpeapl.leaves().length === 3 && _cpeapl.leaf(1).name() === Node$2.MMBEXPR && _cpeapl.first().isToken() && _cpeapl.first().token().content() === '(') {
        var _mmbexpr2 = _cpeapl.leaf(1);

        if (_mmbexpr2.leaves().length === 3 && _mmbexpr2.first().name() === Node$2.PRMREXPR && _mmbexpr2.last().isToken()) {
          single = arr.length && _mmbexpr2.first().first().isToken() && _mmbexpr2.first().first().token().content() === 'this' && _mmbexpr2.last().token().content() === arr[arr.length - 1];
        }
      }
    }

    return {
      arr: arr,
      single: single,
      bind: bind
    };
  }

  var Token$3 = homunculus.getClass('token', 'csx');
  var S$1 = {};
  S$1[Token$3.LINE] = S$1[Token$3.COMMENT] = S$1[Token$3.BLANK] = true;
  var res$1;

  function recursion(node, excludeLine) {
    if (node.isToken()) {
      var token = node.token();

      if (!token.isVirtual()) {
        res$1 += token.content();

        while (token.next()) {
          token = token.next();

          if (token.isVirtual() || !S$1.hasOwnProperty(token.type())) {
            break;
          }

          var s = token.content();

          if (!excludeLine || s != '\n') {
            res$1 += token.content();
          }
        }
      }
    } else {
      node.leaves().forEach(function (leaf) {
        recursion(leaf, excludeLine);
      });
    }
  }

  function join2 (node, excludeLine) {
    res$1 = '';
    recursion(node, excludeLine);
    return res$1;
  }

  var Token$4 = homunculus.getClass('token', 'csx');
  var Node$3 = homunculus.getClass('node', 'csx');

  var InnerTree =
  /*#__PURE__*/
  function () {
    function InnerTree() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, InnerTree);

      this.res = '';
      this.opt = opt;
      this.param = param;
    }

    _createClass(InnerTree, [{
      key: "parse",
      value: function parse(node) {
        this.recursion(node);
        return this.res;
      }
    }, {
      key: "recursion",
      value: function recursion(node) {
        var self = this;
        var isToken = node.isToken();

        if (isToken) {
          var token = node.token();

          if (token.isVirtual()) {
            return;
          }

          if (!token.ignore) {
            this.res += token.content();
          }

          while (token.next()) {
            token = token.next();

            if (token.isVirtual() || !parse.S.hasOwnProperty(token.type())) {
              break;
            }

            if (!token.ignore) {
              this.res += token.content();
            }
          }
        } else {
          switch (node.name()) {
            case Node$3.CSXElement:
            case Node$3.CSXSelfClosingElement:
              this.res += parse$4(node, {
                isInBind: self.opt.isInBind || self.opt.isBind,
                arrowFn: self.opt.arrowFn
              }, self.param);
              return;

            case Node$3.RETSTMT:
              if (self.opt.isBind || self.opt.isInBind) {
                var allReturn = true;
                self.opt.arrowFn = self.opt.arrowFn || [];

                for (var i = 0, len = self.opt.arrowFn.length; i < len; i++) {
                  if (!self.opt.arrowFn[i]) {
                    allReturn = false;
                    break;
                  }
                }

                if (allReturn) {
                  var temp = linkage(node.leaf(1), self.param, {
                    arrowFn: self.opt.arrowFn
                  });
                  var list = temp.arr;
                  var listener = list.length === 1 ? '"' + list[0] + '"' : JSON.stringify(list);

                  if (list.length) {
                    return this.res += join2(node.first()) + 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(self.opt, self.param).parse(node.leaf(1)).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')})';
                  }
                }
              }

              break;

            case Node$3.ARROWFN:
              self.opt.arrowFn = self.opt.arrowFn || [];

              if (self.opt.arrowFn.length === 0) {
                self.opt.arrowFn.push(true);
              } else {
                var is = false;

                var _temp = node.parent();

                if (_temp && _temp.name() === Node$3.ARGLIST) {
                  _temp = _temp.parent();

                  if (_temp && _temp.name() === Node$3.ARGS) {
                    var callexpr = _temp.parent();

                    _temp = _temp.prev();

                    if (_temp && _temp.name() === Node$3.MMBEXPR) {
                      _temp = _temp.leaf(2);

                      if (_temp.isToken() && _temp.token().content() === 'map') {
                        is = callexpr.parent().name() === Node$3.RETSTMT;
                      }
                    }
                  }
                }

                self.opt.arrowFn.push(is);
              }

              break;
          }

          node.leaves().forEach(function (leaf) {
            self.recursion(leaf);
          });

          switch (node.name()) {
            case Node$3.ARROWFN:
              self.opt.arrowFn.pop();
              break;
          }
        }
      }
    }]);

    return InnerTree;
  }();

  var JsNode = homunculus.getClass('Node', 'es6');
  var Token$5 = homunculus.getClass('Token');
  function join (node, word) {
    var res = recursion$1(node, {
      's': '',
      'word': word
    });
    return res.s;
  }

  function recursion$1(node, res) {
    var isToken = node.name() === JsNode.TOKEN;
    var isVirtual = isToken && node.token().type() === Token$5.VIRTUAL;

    if (isToken) {
      var token = node.token();

      if (!isVirtual) {
        if (res.word && [Token$5.ID, Token$5.NUMBER, Token$5.KEYWORD].indexOf(token.type()) > -1) {
          res.s += ' ';
        }

        if (token.content() === '}' && res.s.charAt(res.s.length - 1) === ';') {
          res.s = res.s.replace(/;$/, '');
        }

        res.s += token.content();
        res.word = [Token$5.ID, Token$5.NUMBER, Token$5.KEYWORD].indexOf(token.type()) > -1;
      } else if (token.content() === ';') {
        res.s += ';';
        res.word = false;
      }
    } else {
      node.leaves().forEach(function (leaf) {
        recursion$1(leaf, res);
      });
    }

    return res;
  }

  var Token$6 = homunculus.getClass('token', 'csx');
  var Node$4 = homunculus.getClass('node', 'csx');
  var S$2 = {};
  S$2[Token$6.LINE] = S$2[Token$6.COMMENT] = S$2[Token$6.BLANK] = true;
  var res$2 = '';

  function parse$3(node) {
    var prmr = node.leaf(1);

    if (prmr && prmr.name() === Node$4.PRMREXPR) {
      var objltr = prmr.first();
      var tree = new InnerTree();
      res$2 = tree.parse(node);
      res$2 = res$2.replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
    } else {
      var _tree = new InnerTree();

      res$2 = _tree.parse(node);
      res$2 = res$2.replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
    }

    return res$2;
  }

  var Token$7 = homunculus.getClass('token', 'csx');
  var Node$5 = homunculus.getClass('node', 'csx');

  function elem(node, opt, param) {
    var res = ''; //open和selfClose逻辑复用

    res += selfClose(node.first(), opt, param);
    res += ',[';
    var comma = false;

    for (var i = 1, len = node.size(); i < len - 1; i++) {
      var leaf = node.leaf(i);

      switch (leaf.name()) {
        case Node$5.CSXChild:
          if (comma) {
            res += ',';
            comma = false;
          }

          res += child(leaf, opt, param);
          comma = true;
          break;

        case Node$5.TOKEN:
          var s = leaf.token().content(); //open和close之间的空白不能忽略

          if (/^\s+$/.test(s)) {
            if (leaf.prev().name() === Node$5.CSXOpeningElement && leaf.next().name() === Node$5.CSXClosingElement) {
              res += '"' + s.replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n') + '"';
            } else {
              res += s;
            }
          } else {
            if (comma) {
              res += ',';
              comma = false;
            }

            res += '"' + s.replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n') + '"';
            comma = true;
          }

          break;

        default:
          if (comma) {
            res += ',';
            comma = false;
          }

          res += parse$4(leaf, opt, param);
          comma = true;
      }
    }

    res += '])';

    if (node.last().name() === Node$5.CSXClosingElement) {
      res += parse(node.last(), true).res;
    }

    return res;
  }

  function selfClose(node, opt, param) {
    var res = '';
    var name;
    var first = node.leaf(1);

    if (first.isToken()) {
      name = first.token().content();
    } else if (first.name() === Node$5.CSXMemberExpression) {
      name = first.first().token().content();

      for (var i = 1, len = first.size(); i < len; i++) {
        name += first.leaf(i).token().content();
      }
    }

    if (/^[A-Z]/.test(name)) {
      res += 'karas.createCp(';
      res += name;
    } else if (/^\$/.test(name)) {
      res += 'karas.createGm(';
      res += '"' + name + '"';
    } else {
      res += 'karas.createVd(';
      res += '"' + name + '"';
    }

    res += ',[';

    for (var _i = 2, _len = node.size(); _i < _len - 1; _i++) {
      var leaf = node.leaf(_i);

      if (_i !== 2) {
        res += ',';
      }

      switch (leaf.name()) {
        case Node$5.CSXBindAttribute:
          res += attr(leaf, opt, param);
          break;

        case Node$5.CSXAttribute:
          res += attr(leaf, opt, param);
          break;

        case Node$5.CSXSpreadAttribute:
          res += spread(leaf);
          break;
      }
    }

    res += ']';
    return res;
  }

  function attr(node, opt, param) {
    var res = '';
    var key = node.first().token().content();
    var name = node.parent().leaf(1).token().content();
    var isCp = /^[A-Z]/.test(name);

    if (key.charAt(0) === '@') {
      key = key.slice(1);
    } // 组件属性非@申明均不bind
    else if (isCp && opt.isBind) {
        opt.isBind = false;
      }

    var k = '["' + key + '"';
    res += k + ',';
    var v = node.last();

    if (v.isToken()) {
      v = v.token().content();
      res += v;
    } else if (/^on-?[a-zA-Z]/.test(key)) {
      res += onEvent(v);
    } else {
      res += child(v, opt, param, true);
    }

    res += ']';
    return res;
  }

  function onEvent(node, opt, param) {
    return parse$3(node);
  }

  function spread(node) {
    return join(node.leaf(2));
  }

  function child(node, opt, param, isAttr) {
    var callexpr = node.leaf(1);

    if (opt.isBind) {
      var temp = linkage(callexpr, param, {
        arrowFn: opt.arrowFn
      });
      var list = temp.arr;
      var single = temp.single;
      var bind = temp.bind;

      if (list.length) {
        var listener = list.length === 1 ? '"' + list[0] + '"' : JSON.stringify(list);

        if (isAttr) {
          var key = node.prev().prev().token().content();

          if (key === 'value' || key === 'checked' || key === 'selected') {
            var tag = node.parent().parent().leaf(1).token().content();

            if (tag === 'input' || tag === 'select' || tag === 'option') {
              var value = node.leaf(1); // 单独值mmbexpr非运算符双向绑定，其余单向

              if (value.name() === Node$5.MMBEXPR) {
                var v = join2(value);
                return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : ',false') + (bind ? ',(v)=>{v!==' + v + '&&(' + v + '=v)})' : ')');
              }

              return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : '') + ')';
            }
          }
        } else if (node.prev() && node.prev().name() === Node$5.CSXOpeningElement) {
          var _key = node.prev().leaf(1).token().content();

          if (_key === 'textarea') {
            var _value = node.leaf(1);

            if (_value.name() === Node$5.MMBEXPR) {
              var _v = join2(_value);

              return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : ',false') + (bind ? ',(v)=>{v!==' + _v + '&&(' + _v + '=v)})' : ')');
            }
          }
        }

        return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : '') + ')';
      }
    } // Obj中再次出现的:input的value还需要添加Obj
    else if (opt.isInBind) {
        if (isAttr) {
          var _key2 = node.prev().prev().token().content();

          if (_key2 === 'value') {
            var _tag = node.parent().parent().leaf(1).token().content();

            if (_tag === 'input' || _tag === 'select') {
              var _temp = linkage(callexpr, param, {
                arrowFn: opt.arrowFn
              });

              var _list = _temp.arr;
              var _bind = _temp.bind;

              if (_list.length) {
                var _value2 = node.leaf(1);

                var _listener = _list.length === 1 ? '"' + _list[0] + '"' : JSON.stringify(_list);

                if (_value2.name() === Node$5.MMBEXPR) {
                  var _v2 = join2(_value2);

                  return 'new yurine.Obj(' + _listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + ',false' + (_bind ? ',(v)=>{v!==' + _v2 + '&&(' + _v2 + '=v)})' : ')');
                }

                return 'new yurine.Obj(' + _listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')})';
              }
            }
          }
        } else if (node.prev() && node.prev().name() === Node$5.CSXOpeningElement) {
          var _key3 = node.prev().leaf(1).token().content();

          if (_key3 === 'textarea') {
            var _temp2 = linkage(callexpr, param, {
              arrowFn: opt.arrowFn
            });

            var _list2 = _temp2.arr;
            var _bind2 = _temp2.bind;

            if (_list2.length) {
              var _value3 = node.leaf(1);

              var _listener2 = _list2.length === 1 ? '"' + _list2[0] + '"' : JSON.stringify(_list2);

              if (_value3.name() === Node$5.MMBEXPR) {
                var _v3 = join2(_value3);

                return 'new yurine.Obj(' + _listener2 + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + ',false' + (_bind2 ? ',(v)=>{v!==' + _v3 + '&&(' + _v3 + '=v)})' : ')');
              }

              return 'new yurine.Obj(' + _listener2 + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')})';
            }
          }
        }
      }

    return new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
  }

  function parse$4(node, opt, param) {
    var res = '';

    switch (node.name()) {
      case Node$5.CSXElement:
        res += elem(node, opt, param);
        break;

      case Node$5.CSXSelfClosingElement:
        res += selfClose(node, opt, param);
        res += ')';
        break;
    }

    return res;
  }

  var Token$8 = homunculus.getClass('token', 'csx');
  var Node$6 = homunculus.getClass('node', 'csx');
  var res$3;

  function stmt(node, param) {
    recursion$2(node, param);
  }

  function recursion$2(node, param) {
    if (node.isToken()) {
      var token = node.token();

      if (token.isVirtual()) {
        return;
      }

      if (!token.ignore) {
        res$3 += token.content();
      }

      while (token.next()) {
        token = token.next();

        if (token.isVirtual() || !parse.S.hasOwnProperty(token.type())) {
          break;
        }

        if (!token.ignore) {
          res$3 += token.content();
        }
      }
    } else {
      switch (node.name()) {
        case Node$6.CSXElement:
        case Node$6.CSXSelfClosingElement:
          res$3 += parse$4(node, {
            isBind: true
          }, param);
          return;

        case Node$6.FNEXPR:
        case Node$6.FNDECL:
        case Node$6.CLASSEXPR:
          var tree = new InnerTree();
          res$3 += tree.parse(node);
          return;
      }

      node.leaves().forEach(function (leaf) {
        recursion$2(leaf, param);
      });
    }
  }

  function parse$5(node, param) {
    res$3 = '';
    var len = node.size();
    node.leaves().forEach(function (leaf, i) {
      //fnbody
      if (i === len - 2) {
        leaf.leaves().forEach(function (item) {
          stmt(item, param);
        });
      } else {
        res$3 += join2(leaf);
      }
    });
    return res$3;
  }

  var Node$7 = homunculus.getClass('node', 'csx');

  var Tree =
  /*#__PURE__*/
  function () {
    function Tree() {
      _classCallCheck(this, Tree);

      this.res = '';
    }

    _createClass(Tree, [{
      key: "parse",
      value: function parse(node) {
        this.recursion(node, false);
        return this.res;
      }
    }, {
      key: "recursion",
      value: function recursion(node, inClass) {
        var self = this;
        var isToken = node.isToken();

        if (isToken) {
          var token = node.token();

          if (token.isVirtual()) {
            return;
          }

          if (!token.ignore) {
            this.res += token.content();
          }

          while (token.next()) {
            token = token.next();

            if (token.isVirtual() || !parse.S.hasOwnProperty(token.type())) {
              break;
            }

            if (!token.ignore) {
              this.res += token.content();
            }
          }
        } else {
          switch (node.name()) {
            case Node$7.CSXElement:
            case Node$7.CSXSelfClosingElement:
              this.res += parse$4(node, {}, this.param);
              return;

            case Node$7.CLASSDECL:
              inClass = this.klass(node);
              break;

            case Node$7.CLASSEXPR:
              inClass = this.klass(node);
              break;

            case Node$7.CLASSBODY:
              if (inClass) {
                this.param = {
                  getHash: {},
                  setHash: {},
                  evalHash: {},
                  bindHash: {},
                  linkHash: {},
                  linkedHash: {}
                };
                this.list(node);
              }

              break;

            case Node$7.METHOD:
              var isRender = this.method(node);

              if (isRender) {
                this.res += parse$5(node, this.param || {});
                return;
              }

              break;

            case Node$7.ANNOT:
              if (['@bind', '@eval', '@link'].indexOf(node.first().token().content()) > -1) {
                this.res += parse(node, true).res;
              } else {
                this.res += join2(node);
              }

              return;

            case Node$7.LEXBIND:
              if (inClass && node.parent().name() === Node$7.CLASSELEM) {
                this.res += this.bindLex(node);
                return;
              }

              break;
          }

          node.leaves().forEach(function (leaf) {
            self.recursion(leaf, inClass);
          });

          switch (node.name()) {
            case Node$7.FNBODY:
              this.fnbody(node, inClass);
              break;

            case Node$7.CLASSDECL:
              inClass = false;
              break;

            case Node$7.CLASSEXPR:
              inClass = false;
              break;
          }
        }
      }
    }, {
      key: "klass",
      value: function klass(node) {
        var heritage = node.leaf(2);

        if (heritage && heritage.name() === Node$7.HERITAGE) {
          var body = node.last().prev();
          var leaves = body.leaves();

          for (var i = 0, len = leaves.length; i < len; i++) {
            var leaf = leaves[i];
            var method = leaf.first();

            if (method.name() === Node$7.METHOD) {
              var first = method.first();

              if (first.name() === Node$7.PROPTNAME) {
                var id = first.first();

                if (id.name() === Node$7.LTRPROPT) {
                  id = id.first();

                  if (id.isToken()) {
                    id = id.token().content();

                    if (id === 'constructor') {
                      return true;
                    }
                  }
                }
              }
            }
          }
        }

        return false;
      }
    }, {
      key: "method",
      value: function method(node) {
        var first = node.first();

        if (first.name() === Node$7.PROPTNAME) {
          first = first.first();

          if (first.name() === Node$7.LTRPROPT) {
            first = first.first();

            if (first.isToken() && first.token().content() === 'render') {
              return true;
            }
          }
        }
      }
    }, {
      key: "fnbody",
      value: function fnbody(node, inClass) {
        if (!inClass) {
          return;
        }

        var parent = node.parent();

        if (parent.name() === Node$7.METHOD) {
          var setV;
          var first = parent.first();

          if (first.isToken() && first.token().content() === 'set') {
            var fmparams = parent.leaf(3);

            if (fmparams && fmparams.name() === Node$7.FMPARAMS) {
              var single = fmparams.first();

              if (single && single.name() === Node$7.SINGLENAME) {
                var bindid = single.first();

                if (bindid && bindid.name() === Node$7.BINDID) {
                  setV = bindid.first().token().content();
                }
              }
            }

            var name = parent.leaf(1).first().first().token().content();
            var prev = parent.parent().prev();
            var ids = [];

            if (prev) {
              prev = prev.first();

              if (prev.name() === Node$7.ANNOT && ['@bind', '@eval'].indexOf(prev.first().token().content()) > -1) {
                ids.push(name);
              }
            }

            ids = ids.concat(this.param.linkedHash[name] || []);

            if (ids.length) {
              if (setV) {
                if (ids.length === 1) {
                  this.res += ';this.__array("';
                  this.res += ids[0] + '",';
                  this.res += setV;
                  this.res += ')';
                } else {
                  this.res += ';this.__array(["';
                  this.res += ids.join('","') + '"],';
                  this.res += setV;
                  this.res += ')';
                }
              }

              if (ids.length === 1) {
                this.res += ';this.__data("';
                this.res += ids[0];
                this.res += '")';
              } else {
                this.res += ';this.__data(["';
                this.res += ids.join('","');
                this.res += '"])';
              }
            }
          }
        }
      }
    }, {
      key: "list",
      value: function list(node) {
        var _this = this;

        var leaves = node.leaves();
        var length = leaves.length;

        for (var i = 0; i < length; i++) {
          var item = leaves[i].first();

          if (item.name() === Node$7.ANNOT) {
            var annot = item.first().token().content();
            var method = leaves[i + 1] ? leaves[i + 1].first() : null;

            if (method && method.name() === Node$7.METHOD) {
              var first = method.first();

              if (first.isToken()) {
                var token = first.token().content();

                if (token === 'set' && annot === '@bind') {
                  var name = first.next().first().first().token().content();
                  this.param.bindHash[name] = true;
                } else if (token === 'set' && annot === '@eval') {
                  var _name = first.next().first().first().token().content();

                  this.param.evalHash[_name] = true;
                } else if (token === 'get' && annot === '@link') {
                  (function () {
                    var name = first.next().first().first().token().content();
                    _this.param.linkHash[name] = _this.param.linkHash[name] || [];
                    var params = item.leaf(2);

                    if (params && params.name() === Node$7.FMPARAMS) {
                      params.leaves().forEach(function (param) {
                        if (param.name() === Node$7.SINGLENAME) {
                          param = param.first();

                          if (param.name() === Node$7.BINDID) {
                            param = param.first();

                            if (param.isToken()) {
                              param = param.token().content();
                              this.param.linkHash[name].push(param);
                              this.param.linkedHash[param] = this.param.linkedHash[param] || [];
                              this.param.linkedHash[param].push(name);
                            }
                          }
                        }
                      }.bind(_this));
                    }
                  })();
                }
              }
            } else if (method && method.name() === Node$7.LEXBIND) {
              var _first = method.first();

              if (_first.name() === Node$7.BINDID) {
                var _name2 = _first.first().token().content();

                parseLex(this.param, _name2, item, annot);
              }
            } //连续2个
            else if (method && method.name() === Node$7.ANNOT) {
                var item2 = method;
                var annot2 = method.first().token().content();
                method = leaves[i + 2] ? leaves[i + 2].first() : null;

                if (method && method.name() === Node$7.LEXBIND) {
                  var _first2 = method.first();

                  if (_first2.name() === Node$7.BINDID) {
                    var _name3 = _first2.first().token().content();

                    parseLex(this.param, _name3, item, annot);
                    parseLex(this.param, _name3, item2, annot2);
                  }
                }
              }
          } else if (item.name() === Node$7.METHOD) {
            var _first3 = item.first();

            if (_first3.isToken()) {
              var _token = _first3.token().content();

              var _name4 = _first3.next().first().first().token().content();

              if (_token === 'get') {
                this.param.getHash[_name4] = true;
              } else if (_token === 'set') {
                this.param.setHash[_name4] = true;
              }
            }
          } else if (item.name() === Node$7.LEXBIND) {
            var _first4 = item.first();

            if (_first4.name() === Node$7.BINDID) {
              var _name5 = _first4.first().token().content();

              this.param.getHash[_name5] = true;
              this.param.setHash[_name5] = true;
            }
          }
        }
      }
    }, {
      key: "bindLex",
      value: function bindLex(node) {
        var parent = node.parent();
        var bindid = node.first();

        if (bindid.name() === Node$7.BINDID) {
          var token = bindid.first();
          var name = token.token().content();
          var init = node.leaf(1);
          var ids = [];
          var prev = parent.prev();

          if (prev) {
            prev = prev.first();

            if (prev.name() === Node$7.ANNOT && ['@bind', '@eval'].indexOf(prev.first().token().content()) > -1) {
              ids.push(name);
            }
          }

          ids = ids.concat(this.param.linkedHash[name] || []);
          var s = '';
          s += 'set ' + name + '(v){';
          s += 'this.__setBind("' + name + '",v)';

          if (ids.length) {
            if (ids.length === 1) {
              s += ';this.__data("';
              s += ids[0];
              s += '")';
            } else {
              s += ';this.__data(["';
              s += ids.join('","');
              s += '"])';
            }
          }

          s += '}get ' + name + '(){';
          s += parse(token).res;

          if (init) {
            s += 'if(this.__initBind("' + name + '"))';
            s += 'this.__setBind("' + name + '",';
            s += parse(init.first()).res;
            s += join2(init.last());
            s += ');';
          }

          s += 'return this.__getBind("' + name + '")}';
          return s;
        }
      }
    }]);

    return Tree;
  }();

  function parseLex(param, name, item, annot) {
    if (annot === '@bind') {
      param.bindHash[name] = true;
    } else if (annot === '@eval') {
      param.evalHash[name] = true;
    } else if (annot === '@link') {
      param.linkHash[name] = param.linkHash[name] || [];
      var params = item.leaf(2);

      if (params && params.name() === Node$7.FMPARAMS) {
        params.leaves().forEach(function (item) {
          if (item.name() === Node$7.SINGLENAME) {
            item = item.first();

            if (item.name() === Node$7.BINDID) {
              item = item.first();

              if (item.isToken()) {
                item = item.token().content();
                param.linkHash[name].push(item);
                param.linkedHash[item] = param.linkedHash[item] || [];
                param.linkedHash[item].push(name);
              }
            }
          }
        });
      }
    }
  }

  var Yurine =
  /*#__PURE__*/
  function () {
    function Yurine() {
      _classCallCheck(this, Yurine);

      this.parser = null;
      this.node = null;
    }

    _createClass(Yurine, [{
      key: "parse",
      value: function parse(code) {
        this.parser = homunculus.getParser('csx');
        this.node = this.parser.parse(code);
        var tree = new Tree();
        return tree.parse(this.node);
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
    }], [{
      key: "parse",
      value: function parse(code) {
        return new Yurine().parse(code);
      }
    }]);

    return Yurine;
  }();

  var Yurine$1 = new Yurine();

  return Yurine$1;

}));
//# sourceMappingURL=yurine.js.map
