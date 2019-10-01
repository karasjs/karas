(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('homunculus')) :
  typeof define === 'function' && define.amd ? define(['homunculus'], factory) :
  (global = global || self, global.yurine = factory(global.homunculus));
}(this, function (homunculus) { 'use strict';

  homunculus = homunculus && homunculus.hasOwnProperty('default') ? homunculus['default'] : homunculus;

  let ES6Token = homunculus.getClass('token', 'js');
  let Token = homunculus.getClass('token', 'csx');
  let Node = homunculus.getClass('node', 'csx');
  let S = {};
  S[Token.LINE] = S[Token.COMMENT] = S[Token.BLANK] = true;
  let res;
  let append;

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

        let s = node.content();
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
      res,
      append
    };
  }

  parse.S = S;

  let Token$1 = homunculus.getClass('token', 'csx');
  let Node$1 = homunculus.getClass('node', 'csx');

  function parse$1(node, res, param, opt) {
    switch (node.name()) {
      case Node$1.EXPRSTMT:
        linkage(node.first(), param, opt).arr.forEach(item => {
          res[item] = true;
        });
        break;

      case Node$1.VARSTMT:
        node.leaves().forEach((leaf, i) => {
          if (i % 2 === 1) {
            let initlz = leaf.leaf(1);
            let temp = linkage(initlz.leaf(1), param, opt);
            temp.arr.forEach(item => {
              res[item] = true;
            });
          }
        });
        break;

      case Node$1.BLOCKSTMT:
        let block = node.first();

        for (let i = 1, leaves = block.leaves(); i < leaves.length - 1; i++) {
          parse$1(leaves[i], res, param, opt);
        }

        break;

      case Node$1.IFSTMT:
        let condition = node.leaf(2);
        linkage(condition, param, opt).arr.forEach(item => {
          res[item] = true;
        });
        parse$1(node.last(), res, param, opt);
        break;

      case Node$1.ITERSTMT:
        let peek = node.first().token().content();

        if (peek === 'for') {
          let first = node.leaf(2); // for(;...

          if (first.isToken()) ; else {
            if (first.name() === Node$1.LEXDECL) {
              parse$1(first, res, param, opt);
            } else if (first.name() === Node$1.VARSTMT) {
              parse$1(first, res, param, opt);
            }
          }

          let second = node.leaf(3); // for(;;...

          if (second.isToken()) ; else {
            let temp = linkage(second, param, opt);
            temp.arr.forEach(item => {
              res[item] = true;
            });
          }

          let third = node.leaf(4);

          if (third.isToken()) {
            third = node.leaf(5);

            if (third.isToken()) ; else {
              let temp = linkage(third, param, opt);
              temp.arr.forEach(item => {
                res[item] = true;
              });
            }
          } else {
            let temp = linkage(third, param, opt);
            temp.arr.forEach(item => {
              res[item] = true;
            });
          }
        } else if (peek === 'do') {
          let blockstmt = node.leaf(1);
          parse$1(blockstmt, res, param, opt);
          let temp = linkage(node.leaf(4), param, opt);
          temp.arr.forEach(item => {
            res[item] = true;
          });
        } else if (peek === 'while') {
          let temp = linkage(node.leaf(2), param, opt);
          temp.arr.forEach(item => {
            res[item] = true;
          });
          let stmt = node.last();
          parse$1(stmt, res, param, opt);
        }

        break;

      case Node$1.LEXDECL:
        node.leaves().forEach((leaf, i) => {
          if (i % 2 === 1) {
            let initlz = leaf.leaf(1);
            let temp = linkage(initlz.leaf(1), param, opt);
            temp.arr.forEach(item => {
              res[item] = true;
            });
          }
        });
        break;

      case Node$1.RETSTMT:
        // 第一层arrowFn的return语句不包含在linkage中，还有递归return的arrowFn也是
        if (opt.arrowFn.length > 0) {
          let allReturn = true;

          for (let i = 0, len = opt.arrowFn.length; i < len; i++) {
            if (!opt.arrowFn[i]) {
              allReturn = false;
              break;
            }
          }

          if (!allReturn) {
            linkage(node.leaf(1), param, opt).arr.forEach(item => {
              res[item] = true;
            });
          }
        }

        break;

      case Node$1.WITHSTMT:
        linkage(node.leaf(2), param, opt).arr.forEach(item => {
          res[item] = true;
        });
        let blockstmt = node.last();
        parse$1(blockstmt, res, param, opt);
        break;

      case Node$1.SWCHSTMT:
        linkage(node.leaf(2), param, opt).arr.forEach(item => {
          res[item] = true;
        });
        let caseblock = node.last();
        parse$1(caseblock, res, param, opt);
        break;

      case Node$1.CASEBLOCK:
        let leaves = node.leaves();

        for (let i = 1; i < leaves.length - 1; i++) {
          let leaf = leaves[i];

          if (leaf.name() === Node$1.CASECLAUSE) {
            let expr = leaf.leaf(1);
            let temp = linkage(expr, param, opt);
            temp.arr.forEach(item => {
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
    node.leaves().forEach(leaf => {
      parse$1(leaf, res, param, opt);
    });
  }

  let Token$2 = homunculus.getClass('token', 'csx');
  let Node$2 = homunculus.getClass('node', 'csx');

  function parse$2(node, res, param, opt) {
    if (node.isToken()) ; else {
      switch (node.name()) {
        case Node$2.EXPR:
          parse$2(node.first(), res, param, opt); //可能有连续多个表达式

          for (let i = 2, leaves = node.leaves(), len = leaves.length; i < len; i += 2) {
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

          for (let i = 2, leaves = node.leaves(), len = leaves.length; i < len; i += 2) {
            parse$2(node.leaf(i), res, param, opt);
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
          for (let i = 0, leaves = node.leaves(), len = leaves.length; i < len; i++) {
            let leaf = node.leaf(i);

            if (!leaf.isToken()) {
              parse$2(leaf, res, param, opt);
            }
          }

          break;

        case Node$2.ARROWFN:
          opt.arrowFn = opt.arrowFn || [];
          let temp = node.parent();

          if (temp && temp.name() === Node$2.ARGLIST) {
            temp = temp.parent();

            if (temp && temp.name() === Node$2.ARGS) {
              temp = temp.prev();

              if (temp && temp.name() === Node$2.MMBEXPR) {
                let callexpr = temp.parent();
                temp = temp.leaf(2);

                if (temp.isToken() && temp.token().content() === 'map') {
                  let body = node.last().leaf(1);

                  if (opt.arrowFn.length === 0) {
                    opt.arrowFn.push(true);
                  } else {
                    opt.arrowFn.push(callexpr.parent().name() === Node$2.RETSTMT);
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

          for (let i = 1, leaves = node.leaves(); i < leaves.length - 1; i++) {
            parse$2(leaves[i], res, param, opt);
          }

          break;

        case Node$2.CSXSelfClosingElement:
        case Node$2.CSXOpeningElement:
          for (let i = 1, leaves = node.leaves(); i < leaves.length - 1; i++) {
            parse$2(leaves[i], res, param, opt);
          }

          break;

        case Node$2.CSXAttribute:
          let value = node.last();

          if (value.name() === Node$2.CSXAttributeValue) {
            let first = value.first();

            if (first.isToken() && first.token().content() === '{') {
              parse$2(value.leaf(1), res, param, opt);
            }
          }

          break;

        case Node$2.CSXChild:
          node.leaves().forEach(leaf => {
            parse$2(leaf, res, param, opt);
          });
          break;
      }
    }
  }

  function mmbexpr(node, res, param, opt) {
    let prmr = node.first();

    if (prmr.name() === Node$2.PRMREXPR) {
      let first = prmr.first();

      if (first.isToken()) {
        let me = first.token().content();

        if (me === 'this') {
          let dot = node.leaf(1);

          if (dot.isToken()) {
            if (dot.token().content() === '.') {
              let token = dot.next();
              let id = token.token().content();

              if (id === 'model') {
                if (node.name() === Node$2.MMBEXPR) {
                  let next = node.next();

                  if (next.isToken()) {
                    if (next.token().content() === '.') {
                      next = next.next();

                      if (next.isToken()) {
                        let token = next.token();
                        res['model.' + token.content()] = true;
                      }
                    } else if (next.token().content() === '[') {
                      let expr = next.next();

                      if (expr.name() === Node$2.PRMREXPR) {
                        let s = expr.first();

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
              let expr = dot.next();

              if (expr.name() === Node$2.EXPR) {
                parse$2(expr.last(), res, param, opt);
              } else if (expr.name() === Node$2.PRMREXPR) {
                let s = expr.first();

                if (s.isToken()) {
                  s = s.token();

                  if (s.type() === Token$2.STRING) {
                    res[s.val()] = true;
                  }
                }
              } else {
                parse$2(expr, res, param, opt);
              }
            }
          }
        } else {
          let bracket = node.leaf(1);

          if (bracket.isToken()) {
            if (bracket.token().content() === '[') {
              let expr = bracket.next();

              if (expr.name() === Node$2.EXPR) {
                parse$2(expr.last(), res, param, opt);
              } else {
                parse$2(expr, res, param, opt);
              }
            }
          }
        }
      } else {
        parse$2(first, res, param, opt);
      }
    } else if (prmr.name() === Node$2.MMBEXPR) {
      mmbexpr(prmr, res, param, opt);
      let dot = prmr.next();

      if (dot.isToken() && dot.token().content() === '[') {
        let expr = dot.next();

        if (expr.name() === Node$2.EXPR) {
          parse$2(expr.last(), res, param, opt);
        } else if (expr.name() === Node$2.PRMREXPR) {
          let s = expr.first();

          if (s.isToken()) {
            s = s.token();

            if (s.type() === Token$2.STRING) {
              res[s.val()] = true;
            }
          }
        } else {
          parse$2(expr, res, param, opt);
        }
      }
    } else {
      parse$2(prmr, res, param, opt);
    }
  }

  function callexpr(node, res, param, opt) {
    parse$2(node.first(), res, param, opt);
    let args = node.last();

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
      let leaf = node.leaf(1);

      if (!leaf.isToken()) {
        parse$2(leaf, res, param, opt);
      }
    }
  }

  function linkage (node, param, opt) {
    let res = {}; // 取得全部this.xxx

    parse$2(node, res, param, opt);
    let arr = Object.keys(res);
    let bind = false;
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

    arr.forEach(item => {
      if ((param.bindHash || {}).hasOwnProperty(item)) {
        bind = true;
      }
    }); // 因特殊Array优化需要，this.v或者(..., this.v)形式的侦听变量
    // see https://github.com/migijs/migi/issues/29

    let single = false;

    if (node.name() === Node$2.MMBEXPR && node.leaves().length === 3 && node.first().name() === Node$2.PRMREXPR) {
      single = arr.length === 1 && node.first().first().isToken() && node.first().first().token().content() === 'this' && node.last().isToken() && node.last().token().content() === arr[0];
    } else if (node.name() === Node$2.MMBEXPR && node.leaves().length === 3 && node.first().name() === Node$2.MMBEXPR && node.first().leaves().length === 3 && node.first().first().name() === Node$2.PRMREXPR) {
      single = arr.length === 1 && node.first().first().first().isToken() && node.first().first().first().token().content() === 'this' && node.first().last().isToken() && node.first().last().token().content() === 'model' && node.last().isToken() && node.last().token().content() === arr[0].slice(6);
    } else if (node.name() === Node$2.PRMREXPR && node.first().name() === Node$2.CPEAPL) {
      let cpeapl = node.first();

      if (cpeapl.leaves().length === 3 && cpeapl.leaf(1).name() === Node$2.EXPR) {
        let expr = cpeapl.leaf(1);

        if (expr.last().name() === Node$2.MMBEXPR) {
          let mmbexpr = expr.last();

          if (mmbexpr.leaves().length === 3 && mmbexpr.first().name() === Node$2.PRMREXPR && mmbexpr.last().isToken()) {
            single = arr.length && mmbexpr.first().first().isToken() && mmbexpr.first().first().token().content() === 'this' && mmbexpr.last().token().content() === arr[arr.length - 1];
          }
        }
      } else if (cpeapl.leaves().length === 3 && cpeapl.leaf(1).name() === Node$2.MMBEXPR && cpeapl.first().isToken() && cpeapl.first().token().content() === '(') {
        let mmbexpr = cpeapl.leaf(1);

        if (mmbexpr.leaves().length === 3 && mmbexpr.first().name() === Node$2.PRMREXPR && mmbexpr.last().isToken()) {
          single = arr.length && mmbexpr.first().first().isToken() && mmbexpr.first().first().token().content() === 'this' && mmbexpr.last().token().content() === arr[arr.length - 1];
        }
      }
    }

    return {
      arr,
      single,
      bind
    };
  }

  let Token$3 = homunculus.getClass('token', 'csx');
  let S$1 = {};
  S$1[Token$3.LINE] = S$1[Token$3.COMMENT] = S$1[Token$3.BLANK] = true;
  let res$1;

  function recursion(node, excludeLine) {
    if (node.isToken()) {
      let token = node.token();

      if (!token.isVirtual()) {
        res$1 += token.content();

        while (token.next()) {
          token = token.next();

          if (token.isVirtual() || !S$1.hasOwnProperty(token.type())) {
            break;
          }

          let s = token.content();

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

  let Token$4 = homunculus.getClass('token', 'csx');
  let Node$3 = homunculus.getClass('node', 'csx');

  class InnerTree {
    constructor(opt = {}, param = {}) {
      this.res = '';
      this.opt = opt;
      this.param = param;
    }

    parse(node) {
      this.recursion(node);
      return this.res;
    }

    recursion(node) {
      let self = this;
      let isToken = node.isToken();

      if (isToken) {
        let token = node.token();

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
              let allReturn = true;
              self.opt.arrowFn = self.opt.arrowFn || [];

              for (let i = 0, len = self.opt.arrowFn.length; i < len; i++) {
                if (!self.opt.arrowFn[i]) {
                  allReturn = false;
                  break;
                }
              }

              if (allReturn) {
                let temp = linkage(node.leaf(1), self.param, {
                  arrowFn: self.opt.arrowFn
                });
                let list = temp.arr;
                let listener = list.length === 1 ? '"' + list[0] + '"' : JSON.stringify(list);

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
              let is = false;
              let temp = node.parent();

              if (temp && temp.name() === Node$3.ARGLIST) {
                temp = temp.parent();

                if (temp && temp.name() === Node$3.ARGS) {
                  let callexpr = temp.parent();
                  temp = temp.prev();

                  if (temp && temp.name() === Node$3.MMBEXPR) {
                    temp = temp.leaf(2);

                    if (temp.isToken() && temp.token().content() === 'map') {
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

  }

  let JsNode = homunculus.getClass('Node', 'es6');
  let Token$5 = homunculus.getClass('Token');
  function join (node, word) {
    let res = recursion$1(node, {
      's': '',
      'word': word
    });
    return res.s;
  }

  function recursion$1(node, res) {
    let isToken = node.name() === JsNode.TOKEN;
    let isVirtual = isToken && node.token().type() === Token$5.VIRTUAL;

    if (isToken) {
      let token = node.token();

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

  let Token$6 = homunculus.getClass('token', 'csx');
  let Node$4 = homunculus.getClass('node', 'csx');
  let S$2 = {};
  S$2[Token$6.LINE] = S$2[Token$6.COMMENT] = S$2[Token$6.BLANK] = true;
  let res$2 = '';

  function parse$3(node) {
    let prmr = node.leaf(1);

    if (prmr && prmr.name() === Node$4.PRMREXPR) {
      let objltr = prmr.first();
      let tree = new InnerTree();
      res$2 = tree.parse(node);
      res$2 = res$2.replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
    } else {
      let tree = new InnerTree();
      res$2 = tree.parse(node);
      res$2 = res$2.replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
    }

    return res$2;
  }

  let Token$7 = homunculus.getClass('token', 'csx');
  let Node$5 = homunculus.getClass('node', 'csx');

  function elem(node, opt, param) {
    let res = ''; //open和selfClose逻辑复用

    res += selfClose(node.first(), opt, param);
    res += ',[';
    let comma = false;

    for (let i = 1, len = node.size(); i < len - 1; i++) {
      let leaf = node.leaf(i);

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
          let s = leaf.token().content(); //open和close之间的空白不能忽略

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
    let res = '';
    let name;
    let first = node.leaf(1);

    if (first.isToken()) {
      name = first.token().content();
    } else if (first.name() === Node$5.CSXMemberExpression) {
      name = first.first().token().content();

      for (let i = 1, len = first.size(); i < len; i++) {
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

    for (let i = 2, len = node.size(); i < len - 1; i++) {
      let leaf = node.leaf(i);

      if (i !== 2) {
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
    let res = '';
    let key = node.first().token().content();
    let name = node.parent().leaf(1).token().content();
    let isCp = /^[A-Z]/.test(name);

    if (key.charAt(0) === '@') {
      key = key.slice(1);
    } // 组件属性非@申明均不bind
    else if (isCp && opt.isBind) {
        opt.isBind = false;
      }

    let k = '["' + key + '"';
    res += k + ',';
    let v = node.last();

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
    let callexpr = node.leaf(1);

    if (opt.isBind) {
      let temp = linkage(callexpr, param, {
        arrowFn: opt.arrowFn
      });
      let list = temp.arr;
      let single = temp.single;
      let bind = temp.bind;

      if (list.length) {
        let listener = list.length === 1 ? '"' + list[0] + '"' : JSON.stringify(list);

        if (isAttr) {
          let key = node.prev().prev().token().content();

          if (key === 'value' || key === 'checked' || key === 'selected') {
            let tag = node.parent().parent().leaf(1).token().content();

            if (tag === 'input' || tag === 'select' || tag === 'option') {
              let value = node.leaf(1); // 单独值mmbexpr非运算符双向绑定，其余单向

              if (value.name() === Node$5.MMBEXPR) {
                let v = join2(value);
                return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : ',false') + (bind ? ',(v)=>{v!==' + v + '&&(' + v + '=v)})' : ')');
              }

              return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : '') + ')';
            }
          }
        } else if (node.prev() && node.prev().name() === Node$5.CSXOpeningElement) {
          let key = node.prev().leaf(1).token().content();

          if (key === 'textarea') {
            let value = node.leaf(1);

            if (value.name() === Node$5.MMBEXPR) {
              let v = join2(value);
              return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : ',false') + (bind ? ',(v)=>{v!==' + v + '&&(' + v + '=v)})' : ')');
            }
          }
        }

        return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + (single ? ',true' : '') + ')';
      }
    } // Obj中再次出现的:input的value还需要添加Obj
    else if (opt.isInBind) {
        if (isAttr) {
          let key = node.prev().prev().token().content();

          if (key === 'value') {
            let tag = node.parent().parent().leaf(1).token().content();

            if (tag === 'input' || tag === 'select') {
              let temp = linkage(callexpr, param, {
                arrowFn: opt.arrowFn
              });
              let list = temp.arr;
              let bind = temp.bind;

              if (list.length) {
                let value = node.leaf(1);
                let listener = list.length === 1 ? '"' + list[0] + '"' : JSON.stringify(list);

                if (value.name() === Node$5.MMBEXPR) {
                  let v = join2(value);
                  return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + ',false' + (bind ? ',(v)=>{v!==' + v + '&&(' + v + '=v)})' : ')');
                }

                return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')})';
              }
            }
          }
        } else if (node.prev() && node.prev().name() === Node$5.CSXOpeningElement) {
          let key = node.prev().leaf(1).token().content();

          if (key === 'textarea') {
            let temp = linkage(callexpr, param, {
              arrowFn: opt.arrowFn
            });
            let list = temp.arr;
            let bind = temp.bind;

            if (list.length) {
              let value = node.leaf(1);
              let listener = list.length === 1 ? '"' + list[0] + '"' : JSON.stringify(list);

              if (value.name() === Node$5.MMBEXPR) {
                let v = join2(value);
                return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')}' + ',false' + (bind ? ',(v)=>{v!==' + v + '&&(' + v + '=v)})' : ')');
              }

              return 'new yurine.Obj(' + listener + ',()=>{return(' + new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1') + ')})';
            }
          }
        }
      }

    return new InnerTree(opt, param).parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
  }

  function parse$4(node, opt, param) {
    let res = '';

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

  let Token$8 = homunculus.getClass('token', 'csx');
  let Node$6 = homunculus.getClass('node', 'csx');
  let res$3;

  function stmt(node, param) {
    recursion$2(node, param);
  }

  function recursion$2(node, param) {
    if (node.isToken()) {
      let token = node.token();

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
          let tree = new InnerTree();
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
    let len = node.size();
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

  let Node$7 = homunculus.getClass('node', 'csx');

  class Tree {
    constructor() {
      this.res = '';
    }

    parse(node) {
      this.recursion(node, false);
      return this.res;
    }

    recursion(node, inClass) {
      let self = this;
      let isToken = node.isToken();

      if (isToken) {
        let token = node.token();

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
            let isRender = this.method(node);

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

    klass(node) {
      let heritage = node.leaf(2);

      if (heritage && heritage.name() === Node$7.HERITAGE) {
        let body = node.last().prev();
        let leaves = body.leaves();

        for (let i = 0, len = leaves.length; i < len; i++) {
          let leaf = leaves[i];
          let method = leaf.first();

          if (method.name() === Node$7.METHOD) {
            let first = method.first();

            if (first.name() === Node$7.PROPTNAME) {
              let id = first.first();

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

    method(node) {
      let first = node.first();

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

    fnbody(node, inClass) {
      if (!inClass) {
        return;
      }

      let parent = node.parent();

      if (parent.name() === Node$7.METHOD) {
        let setV;
        let first = parent.first();

        if (first.isToken() && first.token().content() === 'set') {
          let fmparams = parent.leaf(3);

          if (fmparams && fmparams.name() === Node$7.FMPARAMS) {
            let single = fmparams.first();

            if (single && single.name() === Node$7.SINGLENAME) {
              let bindid = single.first();

              if (bindid && bindid.name() === Node$7.BINDID) {
                setV = bindid.first().token().content();
              }
            }
          }

          let name = parent.leaf(1).first().first().token().content();
          let prev = parent.parent().prev();
          let ids = [];

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

    list(node) {
      let leaves = node.leaves();
      let length = leaves.length;

      for (let i = 0; i < length; i++) {
        let item = leaves[i].first();

        if (item.name() === Node$7.ANNOT) {
          let annot = item.first().token().content();
          let method = leaves[i + 1] ? leaves[i + 1].first() : null;

          if (method && method.name() === Node$7.METHOD) {
            let first = method.first();

            if (first.isToken()) {
              let token = first.token().content();

              if (token === 'set' && annot === '@bind') {
                let name = first.next().first().first().token().content();
                this.param.bindHash[name] = true;
              } else if (token === 'set' && annot === '@eval') {
                let name = first.next().first().first().token().content();
                this.param.evalHash[name] = true;
              } else if (token === 'get' && annot === '@link') {
                let name = first.next().first().first().token().content();
                this.param.linkHash[name] = this.param.linkHash[name] || [];
                let params = item.leaf(2);

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
                  }.bind(this));
                }
              }
            }
          } else if (method && method.name() === Node$7.LEXBIND) {
            let first = method.first();

            if (first.name() === Node$7.BINDID) {
              let name = first.first().token().content();
              parseLex(this.param, name, item, annot);
            }
          } //连续2个
          else if (method && method.name() === Node$7.ANNOT) {
              let item2 = method;
              let annot2 = method.first().token().content();
              method = leaves[i + 2] ? leaves[i + 2].first() : null;

              if (method && method.name() === Node$7.LEXBIND) {
                let first = method.first();

                if (first.name() === Node$7.BINDID) {
                  let name = first.first().token().content();
                  parseLex(this.param, name, item, annot);
                  parseLex(this.param, name, item2, annot2);
                }
              }
            }
        } else if (item.name() === Node$7.METHOD) {
          let first = item.first();

          if (first.isToken()) {
            let token = first.token().content();
            let name = first.next().first().first().token().content();

            if (token === 'get') {
              this.param.getHash[name] = true;
            } else if (token === 'set') {
              this.param.setHash[name] = true;
            }
          }
        } else if (item.name() === Node$7.LEXBIND) {
          let first = item.first();

          if (first.name() === Node$7.BINDID) {
            let name = first.first().token().content();
            this.param.getHash[name] = true;
            this.param.setHash[name] = true;
          }
        }
      }
    }

    bindLex(node) {
      let parent = node.parent();
      let bindid = node.first();

      if (bindid.name() === Node$7.BINDID) {
        let token = bindid.first();
        let name = token.token().content();
        let init = node.leaf(1);
        let ids = [];
        let prev = parent.prev();

        if (prev) {
          prev = prev.first();

          if (prev.name() === Node$7.ANNOT && ['@bind', '@eval'].indexOf(prev.first().token().content()) > -1) {
            ids.push(name);
          }
        }

        ids = ids.concat(this.param.linkedHash[name] || []);
        let s = '';
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

  }

  function parseLex(param, name, item, annot) {
    if (annot === '@bind') {
      param.bindHash[name] = true;
    } else if (annot === '@eval') {
      param.evalHash[name] = true;
    } else if (annot === '@link') {
      param.linkHash[name] = param.linkHash[name] || [];
      let params = item.leaf(2);

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

  class Yurine {
    constructor() {
      this.parser = null;
      this.node = null;
    }

    parse(code) {
      this.parser = homunculus.getParser('csx');
      this.node = this.parser.parse(code);
      let tree = new Tree();
      return tree.parse(this.node);
    }

    tokens() {
      return this.ast ? this.parser.lexer.tokens() : null;
    }

    ast() {
      return this.node;
    }

    static parse(code) {
      return new Yurine().parse(code);
    }

  }

  var Yurine$1 = new Yurine();

  return Yurine$1;

}));
//# sourceMappingURL=yurine.js.map
