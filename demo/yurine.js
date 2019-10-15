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

  var JsNode = homunculus.getClass('Node', 'es6');
  var Token$1 = homunculus.getClass('Token');
  function join (node, word) {
    var res = recursion(node, {
      's': '',
      'word': word
    });
    return res.s;
  }

  function recursion(node, res) {
    var isToken = node.name() === JsNode.TOKEN;
    var isVirtual = isToken && node.token().type() === Token$1.VIRTUAL;

    if (isToken) {
      var token = node.token();

      if (!isVirtual) {
        if (res.word && [Token$1.ID, Token$1.NUMBER, Token$1.KEYWORD].indexOf(token.type()) > -1) {
          res.s += ' ';
        }

        if (token.content() === '}' && res.s.charAt(res.s.length - 1) === ';') {
          res.s = res.s.replace(/;$/, '');
        }

        res.s += token.content();
        res.word = [Token$1.ID, Token$1.NUMBER, Token$1.KEYWORD].indexOf(token.type()) > -1;
      } else if (token.content() === ';') {
        res.s += ';';
        res.word = false;
      }
    } else {
      node.leaves().forEach(function (leaf) {
        recursion(leaf, res);
      });
    }

    return res;
  }

  var Token$2 = homunculus.getClass('token', 'csx');
  var Node$1 = homunculus.getClass('node', 'csx');

  function elem(node) {
    var res = ''; //open和selfClose逻辑复用

    res += selfClose(node.first());
    res += ',[';
    var comma = false;

    for (var i = 1, len = node.size(); i < len - 1; i++) {
      var leaf = node.leaf(i);

      switch (leaf.name()) {
        case Node$1.CSXChild:
          if (comma) {
            res += ',';
            comma = false;
          }

          res += child(leaf);
          comma = true;
          break;

        case Node$1.TOKEN:
          var s = leaf.token().content(); //open和close之间的空白不能忽略

          if (/^\s+$/.test(s)) {
            if (leaf.prev().name() === Node$1.CSXOpeningElement && leaf.next().name() === Node$1.CSXClosingElement) {
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

          res += parse$1(leaf);
          comma = true;
      }
    }

    res += '])';

    if (node.last().name() === Node$1.CSXClosingElement) {
      res += parse(node.last(), true).res;
    }

    return res;
  }

  function selfClose(node) {
    var res = '';
    var name;
    var first = node.leaf(1);

    if (first.isToken()) {
      name = first.token().content();
    } else if (first.name() === Node$1.CSXMemberExpression) {
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
        case Node$1.CSXBindAttribute:
          res += attr(leaf);
          break;

        case Node$1.CSXAttribute:
          res += attr(leaf);
          break;

        case Node$1.CSXSpreadAttribute:
          res += spread(leaf);
          break;
      }
    }

    res += ']';
    return res;
  }

  function attr(node) {
    var res = '';
    var key = node.first().token().content();
    var name = node.parent().leaf(1).token().content();
    var isCp = /^[A-Z]/.test(name);
    var k = '["' + key + '"';
    res += k + ',';
    var v = node.last();

    if (v.isToken()) {
      v = v.token().content();
      res += v;
    } else {
      res += child(v);
    }

    res += ']';
    return res;
  }

  function spread(node) {
    return join(node.leaf(2));
  }

  function child(node) {
    return new Tree().parse(node).replace(/^(\s*){/, '$1').replace(/}(\s*)$/, '$1');
  }

  function parse$1(node) {
    var res = '';

    switch (node.name()) {
      case Node$1.CSXElement:
        res += elem(node);
        break;

      case Node$1.CSXSelfClosingElement:
        res += selfClose(node);
        res += ')';
        break;
    }

    return res;
  }

  var Node$2 = homunculus.getClass('node', 'csx');

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
              case Node$2.CSXElement:
              case Node$2.CSXSelfClosingElement:
                this.res += parse$1(node);
                return;
            }

            node.leaves().forEach(function (leaf) {
              self.recursion(leaf);
            });
          }
        }
      }]);

      return Tree;
    }();

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

  var index = new Yurine();

  return index;

}));
//# sourceMappingURL=index.js.map
