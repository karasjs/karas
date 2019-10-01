(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.homunculus = {}));
}(this, function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function inheritPrototype(subType, superType) {
	  var prototype = Object.create(superType.prototype);
	  prototype.constructor = subType;
	  subType.prototype = prototype;
	  //继承static变量
	  Object.keys(superType).forEach(function(k) {
	    subType[k] = superType[k];
	  });
	  return subType;
	}
	function wrap(fn) {
	  fn.extend = function(sub) {
	    inheritPrototype(sub, fn);
	    return wrap(sub);
	  };
	  fn.methods = function(o) {
	    Object.keys(o).forEach(function(k) {
	      fn.prototype[k] = o[k];
	    });
	    return fn;
	  };
	  fn.statics = function(o) {
	    Object.keys(o).forEach(function(k) {
	      fn[k] = o[k];
	    });
	    return fn;
	  };
	  return fn;
	}
	function klass(cons) {
	  return wrap(cons || function() {});
	}
	klass.extend = inheritPrototype;
	var Class = klass;

	var character = createCommonjsModule(function (module, exports) {
	exports.LINE = '\n';
	exports.ENTER = '\r';
	exports.BLANK = ' ';
	exports.TAB = '\t';
	exports.UNDERLINE = '_';
	exports.DOLLAR = '$';
	exports.SHARP = '#';
	exports.MINUS = '-';
	exports.AT = '@';
	exports.SLASH = '/';
	exports.BACK_SLASH = '\\';
	exports.DECIMAL = '.';
	exports.LEFT_BRACKET = '[';
	exports.RIGHT_BRACKET = ']';
	exports.LEFT_BRACE = '{';
	exports.RIGHT_BRACE = '}';
	exports.STAR = '*';
	exports.LEFT_PARENTHESE = '(';
	exports.RIGHT_PARENTHESE = ')';
	exports.COMMA = ',';
	exports.SEMICOLON = ';';
	exports.EQUAL = '=';
	exports.GRAVE = '`';
	exports.isDigit = function(c) {
	  return c >= '0' && c <= '9';
	};
	exports.isDigit16 = function(c) {
	  return exports.isDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
	};
	exports.isDigit2 = function(c) {
	  return c == '0' || c == '1';
	};
	exports.isDigit8 = function(c) {
	  return c >= '0' && c <= '7';
	};
	exports.isLetter = function(c) {
	  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
	};
	exports.count = function(s, c) {
	  var count = 0,
	    i = -1;
	  while((i = s.indexOf(c, i + 1)) != -1) {
	    count++;
	  }
	  return count;
	};
	exports.isUndefined = function(s) {
	  return typeof s == 'undefined';
	};
	exports.isString = function(s) {
	  return Object.prototype.toString.call(s) == "[object String]";
	};
	exports.isNumber = function(s) {
	  return Object.prototype.toString.call(s) == "[object Number]";
	};
	});
	var character_1 = character.LINE;
	var character_2 = character.ENTER;
	var character_3 = character.BLANK;
	var character_4 = character.TAB;
	var character_5 = character.UNDERLINE;
	var character_6 = character.DOLLAR;
	var character_7 = character.SHARP;
	var character_8 = character.MINUS;
	var character_9 = character.AT;
	var character_10 = character.SLASH;
	var character_11 = character.BACK_SLASH;
	var character_12 = character.DECIMAL;
	var character_13 = character.LEFT_BRACKET;
	var character_14 = character.RIGHT_BRACKET;
	var character_15 = character.LEFT_BRACE;
	var character_16 = character.RIGHT_BRACE;
	var character_17 = character.STAR;
	var character_18 = character.LEFT_PARENTHESE;
	var character_19 = character.RIGHT_PARENTHESE;
	var character_20 = character.COMMA;
	var character_21 = character.SEMICOLON;
	var character_22 = character.EQUAL;
	var character_23 = character.GRAVE;
	var character_24 = character.isDigit;
	var character_25 = character.isDigit16;
	var character_26 = character.isDigit2;
	var character_27 = character.isDigit8;
	var character_28 = character.isLetter;
	var character_29 = character.count;
	var character_30 = character.isUndefined;
	var character_31 = character.isString;
	var character_32 = character.isNumber;

	var tid = 0;
	var types;
	var Token = Class(function(type, content, val, sIndex) {
	  this.t = type; //token类型
	  this.c = content; //token的字面内容，string包括头尾的引号
	  this.pr = null;
	  this.ne = null;
	  this.li = -1;
	  this.co = -1;
	  if(character.isNumber(val)) {
	    sIndex = val;
	    val = content;
	  }
	  else if(character.isUndefined(val)) {
	    val = content;
	    sIndex = -1;
	  }
	  this.v = val; //token的值，一般情况下等于content，特殊如string情况下值是不加头尾的引号
	  this.id = tid++; //token的索引
	  this.si = sIndex; //token在源码字符串中的索引
	}).methods({
	  type: function(t) {
	    if(t !== void 0) {
	      this.t = t;
	    }
	    return this.t;
	  },
	  content: function(c) {
	    if(c !== void 0) {
	      this.c = c;
	    }
	    return this.c;
	  },
	  val: function(v) {
	    if(v !== void 0) {
	      this.v = v;
	    }
	    return this.v;
	  },
	  tag: function(t) {
	    if(t !== void 0) {
	      this.t = t;
	    }
	    return Token.type(this.t);
	  },
	  tid: function(id) {
	    if(id !== void 0) {
	      this.id = id;
	    }
	    return this.id;
	  },
	  sIndex: function(si) {
	    if(si !== void 0) {
	      this.si = si;
	    }
	    return this.si;
	  },
	  prev: function(t) {
	    if(t !== void 0) {
	      this.pr = t;
	    }
	    return this.pr;
	  },
	  next: function(t) {
	    if(t !== void 0) {
	      this.ne = t;
	    }
	    return this.ne;
	  },
	  cancel: function() {
	    tid--;
	  },
	  isVirtual: function() {
	    return this.t == Token.VIRTUAL;
	  },
	  line: function(i) {
	    if(i !== undefined) {
	      this.li = i;
	    }
	    return this.li;
	  },
	  col: function(i) {
	    if(i !== undefined) {
	      this.co = i;
	    }
	    return this.co;
	  }
	}).statics({
	  //公用
	  IGNORE: -2,
	  VIRTUAL: -1,
	  OTHER: 0,
	  BLANK: 1,
	  TAB: 2,
	  LINE: 3,
	  NUMBER: 4,
	  ID: 5,
	  COMMENT: 6,
	  STRING: 7,
	  SIGN: 8,
	  KEYWORD: 10,
	  //js部分
	  REG: 9,
	  //es6
	  TEMPLATE: 13,
	  //仅java
	  ANNOT: 11,
	  //基本无用
	  ENTER: 14,
	  TEMPLATE_HEAD: 29,
	  TEMPLATE_MIDDLE: 30,
	  TEMPLATE_TAIL: 31,
	  type: function(tag) {
	    var self = this;
	    if(character.isUndefined(types)) {
	      types = [];
	      Object.keys(self).forEach(function(o) {
	        if(typeof self[o] == 'number') {
	          types[self[o]] = o;
	        }
	      });
	    }
	    return types[tag];
	  },
	  reset: function() {
	    tid = 0;
	  }
	});
	var Token_1 = Token;

	var walk = createCommonjsModule(function (module, exports) {
	var index;

	function recursion(node, ignore, nodeVisitors, tokenVisitors) {
	  var isToken = node.isToken();
	  if(isToken) {
	    var token = node.token();
	    var isVirtual = token.isVirtual();
	    if(!isVirtual) {
	      var ignores = [];
	      while(ignore[++index]) {
	        ignores.push(ignore[index]);
	      }
	      if(tokenVisitors.hasOwnProperty(token.type())) {
	        tokenVisitors[token.type()](token, ignores);
	      }
	    }
	  }
	  else {
	    if(nodeVisitors.hasOwnProperty(node.name())) {
	      nodeVisitors[node.name()](node);
	    }
	    node.leaves().forEach(function(leaf) {
	      recursion(leaf, ignore, nodeVisitors, tokenVisitors);
	    });
	  }
	}

	exports.simple = function(node, nodeVisitors, tokenVisitors) {
	  exports.simpleIgnore(node, {}, nodeVisitors, tokenVisitors);
	};

	exports.simpleIgnore = function(node, ignore, nodeVisitors, tokenVisitors) {
	  index = 0;
	  while(ignore[index]) {
	    ignore[index++];
	  }
	  nodeVisitors = nodeVisitors || {};
	  tokenVisitors = tokenVisitors || {};
	  recursion(node, ignore, nodeVisitors, tokenVisitors);
	};

	function rcs(node, callback) {
	  var isToken = node.isToken();
	  if(isToken) {
	    var token = node.token();
	    var isVirtual = token.isVirtual();
	    if(!isVirtual) {
	      callback(token, true);
	    }
	  }
	  else {
	    callback(node);
	    node.leaves().forEach(function(leaf) {
	      rcs(leaf, callback);
	    });
	  }
	}

	exports.recursion = function(node, callback) {
	  rcs(node, callback);
	};

	function toPlainObject(node, res) {
	  var isToken = node.isToken();
	  if(isToken) {
	    var token = node.token();
	    var isVirtual = token.isVirtual();
	    if(!isVirtual) {
	      res.push(token.content());
	    }
	  }
	  else {
	    res.push(node.name().toUpperCase());
	    var childs = [];
	    res.push(childs);
	    node.leaves().forEach(function(leaf) {
	      toPlainObject(leaf, childs);
	    });
	  }
	  return res;
	}

	exports.plainObject = function(obj) {
	  //token
	  if(Array.isArray(obj)) {
	    var res = [];
	    obj.forEach(function(token) {
	      res.push(token.content());
	    });
	    return res;
	  }
	  //ast
	  else {
	    return toPlainObject(obj, []);
	  }
	};
	});
	var walk_1 = walk.simple;
	var walk_2 = walk.simpleIgnore;
	var walk_3 = walk.recursion;
	var walk_4 = walk.plainObject;

	var Lexer = Class(function(rule) {
	  this.rule = rule; //当前语法规则
	  this.init();
	}).methods({
	  init: function() {
	    this.code = ''; //要解析的代码
	    this.peek = ''; //向前看字符
	    this.index = 0; //向前看字符字符索引
	    this.isReg = Lexer.IS_REG; //当前/是否是perl风格正则表达式
	    this.tokenList = []; //结果的token列表
	    this.parentheseState = false; //(开始时标记之前终结符是否为if/for/while等关键字
	    this.parentheseStack = []; //圆括号深度记录当前是否为if/for/while等语句内部
	    this.braceState = false; //{是object还是block
	    this.braceStack = []; //深度记录
	    this.cacheLine = 0; //行缓存值
	    this.totalLine = 1; //总行数
	    this.colNum = 0; //列
	    this.colMax = 0; //最大列数
	    this.isReturn = false; //当出现return，后面有换行则自动插入;，影响{的语意
	    this.last = null;
	  },
	  parse: function(code) {
	    this.code = code || '';
	    var temp = [];
	    this.scan(temp);
	    return temp;
	  },
	  parseOn: function() {
	    var temp = [];
	    this.scan(temp);
	    return temp;
	  },
	  tokens: function(plainObject) {
	    if(plainObject) {
	      return walk.plainObject(this.tokenList);
	    }
	    return this.tokenList;
	  },
	  scan: function(temp) {
	    var perlReg = this.rule.perlReg();
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	    while(this.index < length) {
	      if(this.cacheLine > 0 && count >= this.cacheLine) {
	        break;
	      }
	      this.readch();
	      //perl风格正则
	      if(perlReg
	        && this.isReg == Lexer.IS_REG
	        && this.peek == character.SLASH
	        && !{ '/': true, '*': true }[this.code.charAt(this.index)]) {
	        this.dealReg(temp, length);
	        this.isReg = Lexer.NOT_REG;
	      }
	      //依次遍历匹配规则，命中则继续
	      else {
	        for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	          var match = matches[i];
	          if(match.match(this.peek, this.code, this.index)) {
	            var token = new Token_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	            var error = match.error();
	            var matchLen = match.content().length;
	            if(error) {
	              this.error(error, this.code.slice(this.index - matchLen, this.index));
	            }
	            if(token.type() == Token_1.ID
	              && this.rule.keyWords().hasOwnProperty(token.content())) {
	              token.type(Token_1.KEYWORD);
	            }

	            //回调可自定义处理匹配的token
	            if(match.callback) {
	              match.callback.call(match, token, this.tokenList);
	            }
	            //回调特殊处理忽略掉此次匹配
	            if(match.cancel) {
	              token.cancel();
	              continue;
	            }

	            var n = character.count(token.val(), character.LINE);
	            count += n;
	            //处理token
	            this.dealToken(token, matchLen, n, temp);
	            //支持perl正则需判断关键字、圆括号对除号语义的影响
	            if(perlReg && match.perlReg() != Lexer.IGNORE) {
	              this.stateReg(match);
	            }
	            //处理{
	            this.stateBrace(match.content(), token.type());

	            continue outer;
	          }
	        }
	        //如果有未匹配的，说明规则不完整，抛出错误
	        this.error('unknow token');
	      }
	    }
	    return this;
	  },
	  dealToken: function(token, matchLen, count, temp) {
	    if(this.last) {
	      token.prev(this.last);
	      this.last.next(token);
	    }
	    this.last = token;
	    temp.push(token);
	    this.tokenList.push(token);
	    this.index += matchLen - 1;
	    token.line(this.totalLine);
	    token.col(this.colNum);
	    this.totalLine += count;
	    if(count) {
	      var j = token.content().indexOf(character.LINE);
	      var k = token.content().lastIndexOf(character.LINE);
	      this.colMax = Math.max(this.colMax, this.colNum + j);
	      this.colNum = token.content().length - k;
	    }
	    else {
	      this.colNum += matchLen;
	    }
	    this.colMax = Math.max(this.colMax, this.colNum);
	  },
	  stateReg: function(match) {
	    if(match.perlReg() == Lexer.SPECIAL) {
	      this.isReg = match.special();
	    }
	    else {
	      this.isReg = match.perlReg();
	    }
	    if(this.peek == character.LEFT_PARENTHESE) {
	      this.parentheseStack.push(this.parentheseState);
	      this.parentheseState = false;
	    }
	    else if(this.peek == character.RIGHT_PARENTHESE) {
	      this.isReg = this.parentheseStack.pop() ? Lexer.IS_REG : Lexer.NOT_REG;
	    }
	    else {
	      this.parentheseState = match.parenthese();
	    }
	  },
	  stateBrace: function(content, type) {
	    if(content == '{') {
	      if(this.isReturn) {
	        this.braceState = true;
	      }
	      this.braceStack.push(this.braceState);
	      this.isReturn = false;
	    }
	    else if(content == '}') {
	      this.braceState = this.braceStack.pop();
	      if(this.braceState) {
	        this.isReg = false;
	      }
	      this.isReturn = false;
	    }
	    else if(type == Token_1.SIGN) {
	      //反向设置，符号大多出现expr中，后跟{表示object；某些不能跟；以下（换行）跟表示block
	      this.braceState = !{
	        '--': true,
	        '++': true,
	        '=>': true,
	        ';': true,
	        ')': true
	      }.hasOwnProperty(content);
	      this.isReturn = false;
	    }
	    else if(type == Token_1.KEYWORD) {
	      this.braceState = {
	        'instanceof': true,
	        'delete': true,
	        'void': true,
	        'typeof': true,
	        'return': true
	      }.hasOwnProperty(content);
	      this.isReturn = content == 'return';
	    }
	    else if([Token_1.BLANK, Token_1.TAB, Token_1.LINE, Token_1.COMMENT].indexOf(type) == -1) {
	      this.braceState = false;
	    }
	    else if(type == Token_1.LINE
	      || type == Token_1.COMMENT
	        && content.indexOf('\n') > -1) {
	      if(this.isReturn) {
	        this.braceState = false;
	        this.isReturn = false;
	      }
	    }
	  },
	  dealReg: function(temp, length) {
	    var lastIndex = this.index - 1;
	    var res = false;
	    outer:
	    do {
	      this.readch();
	      if(this.peek == character.LINE) {
	        this.error('SyntaxError: unterminated regular expression literal '
	          + this.peek, this.code.slice(lastIndex, this.index));
	        break;
	      }
	      else if(this.peek == character.BACK_SLASH) {
	        this.index++;
	      }
	      else if(this.peek == character.LEFT_BRACKET) {
	        do {
	          this.readch();
	          if(this.peek == character.LINE) {
	            this.error('SyntaxError: unterminated regular expression literal '
	              + this.peek, this.code.slice(lastIndex, this.index));
	            break outer;
	          }
	          else if(this.peek == character.BACK_SLASH) {
	            this.index++;
	          }
	          else if(this.peek == character.RIGHT_BRACKET) {
	            continue outer;
	          }
	        } while(this.index < length);
	      }
	      else if(this.peek == character.SLASH) {
	        res = true;
	        var hash = {};
	        var flag = {
	          'g': true,
	          'i': true,
	          'm': true,
	          'u': true,
	          'y': true
	        };
	        //正则的flag中有gimuy5种，大小写敏感且不能重复
	        do {
	          this.readch();
	          if(character.isLetter(this.peek)) {
	            if(hash.hasOwnProperty(this.peek) || !flag.hasOwnProperty(this.peek)) {
	              this.error('SyntaxError: invalid regular expression flag '
	                + this.peek, this.code.slice(lastIndex, this.index));
	              break outer;
	            }
	            hash[this.peek] = true;
	          }
	          else {
	            break outer;
	          }
	        } while(this.index <= length);
	      }
	    } while(this.index < length);
	    if(!res) {
	      this.error('SyntaxError: unterminated regular expression literal',
	        this.code.slice(lastIndex, this.index - 1));
	    }
	    var token = new Token_1(Token_1.REG, this.code.slice(lastIndex, --this.index), lastIndex);
	    this.index = lastIndex + 1;
	    this.dealToken(token, token.content().length, 0, temp);
	  },
	  readch: function() {
	    this.peek = this.code.charAt(this.index++);
	  },
	  cache: function(i) {
	    if(!character.isUndefined(i) && i !== null) {
	      this.cacheLine = i;
	    }
	    return this.cacheLine;
	  },
	  finish: function() {
	    return this.index >= this.code.length;
	  },
	  line: function() {
	    return this.totalLine;
	  },
	  col: function() {
	    return this.colMax;
	  },
	  error: function(s, str) {console.log(arguments.callee.caller);
	    if(character.isUndefined(str)) {
	      str = this.code.substr(this.index - 1, 20);
	    }
	    if(Lexer.mode() === Lexer.STRICT) {
	      throw new Error(s + ', line ' + this.line() + ' col ' + this.colNum + '\n' + str);
	    }
	    else if(Lexer.mode() === Lexer.LOOSE && typeof console !== void 0) {
	      console.warn(s + ', line ' + this.line() + ' col ' + this.colNum + '\n' + str);
	    }
	    return this;
	  }
	}).statics({
	  IGNORE: 0,
	  IS_REG: 1,
	  NOT_REG: 2,
	  SPECIAL: 3,
	  STRICT: 0,
	  LOOSE: 1,
	  mode: function(i) {
	    if(!character.isUndefined(i)) {
	      cmode = i;
	    }
	    return cmode;
	  }
	});
	var cmode = Lexer.STRICT;
	var Lexer_1 = Lexer;

	var Rule = Class(function(words, pReg) {
	    var self = this;
	    self.kw = {};
	    words.forEach(function(o) {
	      self.kw[o] = true;
	    });
	    self.pReg = pReg || false;
	    self.matchList = [];
	  }).methods({
	    perlReg: function() {
	      return this.pReg;
	    },
	    addMatch: function(match) {
	      this.matchList.push(match);
	      return this;
	    },
	    matches: function() {
	      return this.matchList;
	    },
	    keyWords: function() {
	      return this.kw;
	    },
	    addKeyWord: function(v) {
	      this.kw[v] = true;
	      return this.kw;
	    }
	  });
	var Rule_1 = Rule;

	var CssToken = Token_1.extend(function(type, content, val, sIndex) {
	  Token_1.call(this, type, content, val, sIndex);
	}).statics({
	  HEAD: 12,
	  PROPERTY: 15,
	  VARS: 16,
	  HACK: 17,
	  IMPORTANT: 18,
	  PSEUDO: 19,
	  UNITS: 20,
	  SELECTOR: 21,
	  ATTR: 22,
	  COLOR: 23
	});

	var CssToken_1 = CssToken;

	var Match = Class(function(type, setPReg, special, parenthese) {
	  this.type = type;
	  if(character.isUndefined(setPReg)) {
	    setPReg = Lexer_1.IGNORE;
	  }
	  this.setPReg = setPReg;
	  this.result = null;
	  //忽略0，是1，否2，特殊3
	  if(setPReg) {
	    if(character.isUndefined(special)) {
	      special = function() {
	        return Lexer_1.IGNORE;
	      };
	    }
	    if(character.isUndefined(parenthese)) {
	      parenthese = function() {
	        return false;
	      };
	    }
	  }
	  this.special = special;
	  this.parenthese = parenthese;
	}).methods({
	  tokenType: function() {
	    return this.type;
	  },
	  perlReg: function() {
	    return this.setPReg;
	  },
	  val: function() {
	    return this.content();
	  },
	  content: function() {
	    return this.result;
	  },
	  match: function(c, code, index) {
	    //需被实现
	    throw new Error('match needs to be implement');
	  },
	  error: function() {
	    return false;
	  }
	});

	var RegMatch = Match.extend(function(type, reg, valid, setPReg, special, parenthese) {
	    if(typeof valid == 'number') {
	      parenthese = special;
	      special = setPReg;
	      setPReg = valid;
	      valid = null;
	    }
	    Match.call(this, type, setPReg, special, parenthese);
	    this.reg = reg;
	    this.valid = valid;
	  }).methods({
	    match: function(c, code, index) {
	      var self = this,
	        res = self.reg.exec(code.slice(index - 1));
	      self.msg = null;
	      if(res) {
	        self.result = res[0];
	        if(self.valid) {
	          for(var i = 0, keys = Object.keys(self.valid), len = keys.length; i < len; i++) {
	            if(self.valid[keys[i]].test(self.result)) {
	              self.msg = keys[i];
	              break;
	            }
	          }
	        }
	        return true;
	      }
	      return false;
	    },
	    error: function() {
	      return this.msg;
	    }
	  });
	var RegMatch_1 = RegMatch;

	var S = {
	  '\n': true,
	  '\r': true,
	  ' ': true,
	  '\t': true
	};
	var ADD_VALUE = new RegMatch_1(CssToken_1.ID, /^[a-z][\w\-\+\.]*/i);
	var CssLexer = Lexer_1.extend(function(rule) {
	  Lexer_1.call(this, rule);
	  this.media = false;
	  this.impt = false;
	  this.value = false;
	  this.parenthese = false;
	  this.bracket = false;
	  this.number = false;
	  this.url = false;
	  this.kw = false;
	  this.sel = true;
	  this.va = false;
	  this.cvar = false;
	  this.page = false;
	  this.kf = false;
	  this.ns = false;
	  this.doc = false;
	  this.supports = false;
	  this.extend = false;
	  this.param = false;
	  this.depth = 0;
	}).methods({
	  //@override
	  scan: function(temp) {
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	    while(this.index < length) {
	      if(this.cacheLine > 0 && count >= this.cacheLine) {
	        break;
	      }
	      this.readch();
	      //(之后的字符串可省略"号
	      if(this.parenthese && this.url) {
	        if(!S.hasOwnProperty(this.peek)
	          && !{
	            "'": true,
	            '"': true,
	            ')': true,
	            '$': true
	          }.hasOwnProperty(this.peek)) {
	          this.dealPt(temp);
	          this.url = false;
	          continue outer;
	        }
	        //url只能省略一次，即url()中第一个出现的非空白token，多个的话不能省略
	        this.url = false;
	      }
	      for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	        var match = matches[i];
	        if(match.match(this.peek, this.code, this.index)) {
	          var token = new CssToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	          var matchLen = match.content().length;

	          //回调可自定义处理匹配的token
	          if(match.callback) {
	            match.callback(token);
	          }

	          var s = token.content().toLowerCase();
	          switch(token.type()) {
	            //单位必须紧跟数字，否则便不是单位
	            case CssToken_1.BLANK:
	            case CssToken_1.TAB:
	            case CssToken_1.LINE:
	              this.number = false;
	              break;
	            //@import和@media之后进入值状态
	            case CssToken_1.HEAD:
	              s = s.replace(/^@(-moz-|-o-|-ms-|-webkit-|-vx-|-hp-|-khtml-|mso-|-prince-|-rim-|-ro-|-tc-|-wap-|-apple-|-atsc-|-ah-)/, '@');
	              this.sel = false;
	              this.kw = false;
	              this.value = true;
	              this.number = false;
	              this.va = false;
	              switch(s) {
	                case '@import':
	                  this.impt = true;
	                  break;
	                case '@media':
	                  this.media = true;
	                  break;
	                case '@page':
	                  this.page = true;
	                  break;
	                case '@keyframes':
	                  this.kf = true;
	                  break;
	                case '@document':
	                  this.doc = true;
	                  break;
	                case '@supports':
	                  this.supports = true;
	                  break;
	                case '@extend':
	                  this.extend = true;
	                  this.value = false;
	                  this.sel = true;
	                  break;
	              }
	              break;
	            //单位要跟在数字之后，否则便不是单位
	            case CssToken_1.UNITS:
	              if(!this.number) {
	                continue;
	              }
	              this.sel = false;
	              this.kw = false;
	              this.va = false;
	              this.number = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              break;
	            case CssToken_1.KEYWORD:
	              if(!this.value || this.supports) {
	                this.kw = true;
	                this.url = false;
	                this.va = false;
	                this.sel = false;
	                this.number = false;
	                this.page = false;
	                this.kf = false;
	                this.ns = false;
	                this.doc = false;
	                this.parenthese = false;
	              }
	              break;
	            case CssToken_1.COLOR:
	              if(!this.value && !this.param && !this.cvar) {
	                token.type(CssToken_1.SELECTOR);
	              }
	              break;
	            //将id区分出属性名和属性值
	            case CssToken_1.ID:
	              if(this.bracket && this.sel) {
	                token.type(CssToken_1.ATTR);
	                this.url = false;
	                this.va = false;
	              }
	              else if(this.extend) {
	                token.type(CssToken_1.SELECTOR);
	              }
	              else if(this.number) {
	                token.type(CssToken_1.UNITS);
	                this.url = false;
	                this.kw = false;
	                this.va = false;
	              }
	              else if(this.page || this.kf || this.ns) {
	                this.sel = true;
	                this.url = false;
	                this.kw = false;
	                this.va = false;
	                this.value = false;
	              }
	              else if(this.va) {
	                token.type(CssToken_1.VARS);
	                this.url = false;
	                this.va = false;
	              }
	              else if(this.supports) {
	                if(this.rule.keyWords().hasOwnProperty(s)) {
	                  token.type(CssToken_1.KEYWORD);
	                }
	                else {
	                  token.type(CssToken_1.PROPERTY);
	                }
	              }
	              else if(this.param || this.cvar) {
	                //value时id可以带+号，必须紧跟
	                if(this.code.charAt(this.index) == '+') {
	                  ADD_VALUE.match(this.peek, this.code, this.index);
	                  token = new CssToken_1(ADD_VALUE.tokenType(), ADD_VALUE.content(), ADD_VALUE.val(), this.index - 1);
	                  matchLen = ADD_VALUE.content().length;
	                }
	                if(this.rule.keyWords().hasOwnProperty(s)) {
	                  //前面是hack也作为关键字
	                  if(this.tokenList[this.tokenList.length - 1].type() == CssToken_1.HACK) {
	                    token.type(CssToken_1.KEYWORD);
	                    this.kw = true;
	                  }
	                  else {
	                    //LL2确定后面如果是:说明是关键字（$var:keyword:）
	                    for(var j = this.index + matchLen - 1; j < length; j++) {
	                      var c = this.code.charAt(j);
	                      if(!S.hasOwnProperty(c)) {
	                        if(c == ':') {
	                          token.type(CssToken_1.KEYWORD);
	                          this.kw = true;
	                        }
	                        else {
	                          token.type(CssToken_1.PROPERTY);
	                          this.value = true;
	                        }
	                        break;
	                      }
	                    }
	                  }
	                }
	                else if(this.rule.values().hasOwnProperty(s)) {
	                  token.type(CssToken_1.PROPERTY);
	                  this.url = ['url', 'format', 'url-prefix', 'domain', 'regexp'].indexOf(s) > -1;
	                }
	                this.sel = false;
	                this.cvar = false;
	              }
	              else if(this.value) {
	                //value时id可以带+号，必须紧跟
	                if(this.code.charAt(this.index) == '+') {
	                  ADD_VALUE.match(this.peek, this.code, this.index);
	                  token = new CssToken_1(ADD_VALUE.tokenType(), ADD_VALUE.content(), ADD_VALUE.val(), this.index - 1);
	                  matchLen = ADD_VALUE.content().length;
	                }
	                if(this.rule.colors().hasOwnProperty(s)) {
	                  token.type(CssToken_1.COLOR);
	                  this.url = false;
	                  this.va = false;
	                }
	                else if(this.rule.keyWords().hasOwnProperty(s)
	                  || this.rule.values().hasOwnProperty(s)) {
	                  token.type(CssToken_1.PROPERTY);
	                  this.url = ['url', 'format', 'url-prefix', 'domain', 'regexp'].indexOf(s) > -1;
	                  this.va = s == 'var';
	                }
	                this.kw = false;
	                this.sel = false;
	              }
	              else {
	                if(this.rule.keyWords().hasOwnProperty(s)) {
	                  token.type(CssToken_1.KEYWORD);
	                  this.kw = true;
	                  this.sel = false;
	                  this.parenthese = false;
	                }
	                else {
	                  var isFnCall = false;
	                  for(var i = this.index + s.length - 1; i < length; i++) {
	                    var c = this.code.charAt(i);
	                    if(!S.hasOwnProperty(c)) {
	                      isFnCall = c == '(';
	                      break;
	                    }
	                  }
	                  if(isFnCall) {
	                    token.type(CssToken_1.VARS);
	                    this.sel = false;
	                  }
	                  else {
	                    token.type(CssToken_1.SELECTOR);
	                    this.sel = true;
	                  }
	                  this.kw = false;
	                }
	                this.url = false;
	                this.va = false;
	              }
	              this.number = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              break;
	            case CssToken_1.PSEUDO:
	              if((this.kw || this.value || this.cvar)
	                && !this.page) {
	                token.cancel();
	                continue;
	              }
	              this.va = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              break;
	            case CssToken_1.SELECTOR:
	              if(this.value) {
	                token.cancel();
	                continue;
	              }
	              this.sel = true;
	              this.kw = false;
	              this.number = false;
	              this.va = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              break;
	            case CssToken_1.IMPORTANT:
	              this.url = false;
	              this.va = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              break;
	            case CssToken_1.SIGN:
	              this.number = false;
	              switch(s) {
	                case ':':
	                  if(this.kw) {
	                    this.value = true;
	                  }
	                  this.url = false;
	                  this.sel = false;
	                  this.va = false;
	                  break;
	                case '(':
	                  this.parenthese = true;
	                  if(this.media || this.impt || this.doc) {
	                    this.value = false;
	                  }
	                  //fncall只会出现在block中
	                  else if(this.depth > 0) {
	                    //向前确定此(之后是fncall的param
	                    for(var j = this.tokenList.length - 1; j >= 2; j--) {
	                      var t = this.tokenList[j];
	                      if([CssToken_1.IGNORE, CssToken_1.BLANK, CssToken_1.LINE, CssToken_1.VIRTUAL, CssToken_1.COMMENT].indexOf(t.type()) == -1) {
	                        if(t.type() == CssToken_1.VARS) {
	                          this.param = true;
	                          this.parenthese = false;
	                        }
	                        break;
	                      }
	                    }
	                  }
	                  break;
	                case ')':
	                  if(this.media || this.impt || this.doc) {
	                    this.value = true;
	                  }
	                  this.url = false;
	                  this.parenthese = false;
	                  this.va = false;
	                  //)之后可能跟单位，比如margin:(1+2)px
	                  this.number = true;
	                  this.param = false;
	                  break;
	                case '[':
	                  if(!this.value) {
	                    //LL2确定是selector还是hack
	                    for(var j = this.index; j < length; j++) {
	                      var c = this.code.charAt(j);
	                      if(!S.hasOwnProperty(c)) {
	                        if(c == ';') {
	                          token.type(CssToken_1.HACK);
	                          this.sel = false;
	                        }
	                        break;
	                      }
	                    }
	                  }
	                  this.bracket = true;
	                  this.url = false;
	                  this.va = false;
	                  break;
	                case ']':
	                  if(!this.value && !this.sel) {
	                    token.type(CssToken_1.HACK);
	                  }
	                  this.bracket = false;
	                  this.url = false;
	                  this.va = false;
	                  break;
	                case ';':
	                  if(this.bracket && !this.sel) {
	                    token.type(CssToken_1.HACK);
	                  }
	                  this.value = false;
	                  this.impt = false;
	                  this.url = false;
	                  this.sel = false;
	                  this.va = false;
	                  this.cvar = false;
	                  this.extend = false;
	                  this.param = false;
	                  break;
	                case '{':
	                  this.depth++;
	                  this.value = false;
	                  this.media = false;
	                  this.impt = false;
	                  this.url = false;
	                  this.sel = true;
	                  this.va = false;
	                  this.supports = false;
	                  this.cvar = false;
	                  this.extend = false;
	                  this.param = false;
	                  break;
	                case '}':
	                  this.value = false;
	                  this.media = false;
	                  this.impt = false;
	                  this.url = false;
	                  this.sel = true;
	                  this.depth--;
	                  this.va = false;
	                  this.cvar = false;
	                  this.extend = false;
	                  this.param = false;
	                  break;
	                case '*':
	                  if(this.cvar && !this.value) {
	                    token.type(CssToken_1.HACK);
	                  }
	                  else if(this.param) {
	                    //向前如果是(则为hack
	                    for(var j = this.tokenList.length - 1; j >= 2; j--) {
	                      var t = this.tokenList[j];
	                      if([CssToken_1.IGNORE, CssToken_1.BLANK, CssToken_1.LINE, CssToken_1.VIRTUAL, CssToken_1.COMMENT].indexOf(t.type()) == -1) {
	                        if(t.content() == '(') {
	                          token.type(CssToken_1.HACK);
	                        }
	                        break;
	                      }
	                    }
	                  }
	                  else if(this.depth && !this.value) {
	                    //LL2确定是selector还是hack
	                    for(var j = this.index; j < length; j++) {
	                      var c = this.code.charAt(j);
	                      if(!S.hasOwnProperty(c)) {
	                        if(':{,+([#>.'.indexOf(c) > -1) {
	                          token.type(CssToken_1.SELECTOR);
	                          this.sel = true;
	                        }
	                        else {
	                          token.type(CssToken_1.HACK);
	                          this.sel = false;
	                        }
	                        break;
	                      }
	                    }
	                  }
	                  else if(!this.value) {
	                    token.type(CssToken_1.SELECTOR);
	                    this.sel = true;
	                  }
	                  this.va = false;
	                  break;
	                case '-':
	                case '/':
	                  if(!this.value) {
	                    token.type(CssToken_1.HACK);
	                  }
	                  this.url = false;
	                  this.sel = false;
	                  this.va = false;
	                  break;
	                case '~':
	                  if(this.sel && !this.param) {
	                    var last = this.tokenList[this.tokenList.length - 1];
	                    if(last) {
	                      if(last.type() == CssToken_1.SIGN && ['{', '}'].indexOf(last.content()) > -1) {
	                        token.type(CssToken_1.HACK);
	                      }
	                    }
	                  }
	                  else if(!this.value && ['"', "'", '@', '$'].indexOf(this.code.charAt(this.index)) == -1) {
	                    token.type(CssToken_1.HACK);
	                  }
	                default:
	                  this.url = false;
	                  this.va = false;
	                  break;
	              }
	              this.kw = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              break;
	            case CssToken_1.NUMBER:
	              this.number = true;
	              this.url = false;
	              this.va = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              if(this.cvar || this.param) {
	                this.value = true;
	              }
	              break;
	            case CssToken_1.STRING:
	              if(this.cvar || this.param) {
	                this.value = true;
	              }
	              break;
	            case CssToken_1.VARS:
	              this.sel = false;
	              this.url = false;
	              this.number = false;
	              this.va = false;
	              this.page = false;
	              this.kf = false;
	              this.ns = false;
	              this.doc = false;
	              //vardecl时作为值
	              if(this.cvar) {
	                this.value = true;
	              }
	              //非值时的$是声明
	              else if(!this.value) {
	                this.cvar = true;
	              }
	              break;
	          }

	          if(this.last) {
	            token.prev(this.last);
	            this.last.next(token);
	          }
	          this.last = token;
	          temp.push(token);
	          this.tokenList.push(token);
	          this.index += matchLen - 1;
	          token.line(this.totalLine);
	          token.col(this.colNum);
	          var n = character.count(token.val(), character.LINE);
	          count += n;
	          this.totalLine += n;
	          if(n) {
	            var i = match.content().indexOf(character.LINE);
	            var j = match.content().lastIndexOf(character.LINE);
	            this.colMax = Math.max(this.colMax, this.colNum + i);
	            this.colNum = match.content().length - j;
	          }
	          else {
	            this.colNum += matchLen;
	          }
	          this.colMax = Math.max(this.colMax, this.colNum);
	          continue outer;
	        }
	      }
	      //如果有未匹配的，css默认忽略，查找下一个;
	      var j = this.code.indexOf(';', this.index);
	      if(j == -1) {
	        j = this.code.indexOf('}', this.index);
	        if(j == -1) {
	          j = this.code.length;
	        }
	        else if(this.depth) {
	          j--;
	        }
	      }
	      var s = this.code.slice(this.index - 1, ++j);
	      var token = new CssToken_1(CssToken_1.IGNORE, s, this.index - 1);
	      if(this.last) {
	        token.prev(this.last);
	        this.last.next(token);
	      }
	      this.last = token;
	      temp.push(token);
	      this.tokenList.push(token);
	      token.line(this.totalLine);
	      token.col(this.colNum);
	      this.index = j;
	      this.colNum += this.index - s.length;
	      this.colMax = Math.max(this.colMax, this.colNum);
	    }
	    return this;
	  },
	  dealPt: function(temp) {
	    var k = this.code.indexOf(')', this.index);
	    //()未结束直接跳出
	    if(k == -1) {
	      var token = new CssToken_1(CssToken_1.IGNORE, this.code.slice(this.index - 1, this.code.length), this.index - 1);
	      temp.push(token);
	      this.tokenList.push(token);
	      token.line(this.totalLine);
	      token.col(this.colNum);
	      this.index = this.code.length;
	      var n = character.count(token.val(), character.LINE);
	      if(n > 0) {
	        var i = token.content().indexOf(character.LINE);
	        var j = token.content().lastIndexOf(character.LINE);
	        this.colMax = Math.max(this.colMax, this.colNum + i);
	        this.colNum = token.content().length - j;
	      }
	      else {
	        this.colNum += token.content().length;
	      }
	      this.colMax = Math.max(this.colMax, this.colNum);
	      return;
	    }
	    var s = this.code.slice(this.index - 1, k);
	    var reg = /[\s\r\n]/.exec(s.trim());
	    var token;
	    //)之前的空白要判断
	    if(reg) {
	      token = new CssToken_1(CssToken_1.IGNORE, s, this.index - 1);
	    }
	    else {
	      token = new CssToken_1(CssToken_1.STRING, s, this.index - 1);
	    }
	    if(this.last) {
	      token.prev(this.last);
	      this.last.next(token);
	    }
	    this.last = token;
	    temp.push(token);
	    this.tokenList.push(token);
	    token.line(this.totalLine);
	    token.col(this.colNum);
	    this.index += s.length - 1;
	    this.parenthese = false;
	    this.url = false;
	    var n = character.count(token.val(), character.LINE);
	    if(n > 0) {
	      var i = token.content().indexOf(character.LINE);
	      var j = token.content().lastIndexOf(character.LINE);
	      this.colMax = Math.max(this.colMax, this.colNum + i);
	      this.colNum = token.content().length - j;
	    }
	    else {
	      this.colNum += token.content().length;
	    }
	    this.colMax = Math.max(this.colMax, this.colNum);
	  }
	});

	var CssLexer_1 = CssLexer;

	var HtmlToken = Token_1.extend(function(type, content, val, sIndex) {
	  Token_1.call(this, type, content, val, sIndex);
	}).statics({
	  DOC: 27,
	  PROPERTY: 15,
	  TEXT: 25,
	  MARK: 26,
	  ELEM: 24
	});

	var HtmlToken_1 = HtmlToken;

	var ELEM = new RegMatch_1(HtmlToken_1.ELEM, /^[a-z]\w*(?:-\w+)*/i);

	var HtmlLexer = Lexer_1.extend(function(rule) {
	  Lexer_1.call(this, rule);
	}).methods({
	  init: function() {
	    Lexer_1.prototype.init.call(this);
	    this.state = false; //是否在<>状态中
	    this.style = false; //style标签
	    this.script = false; //script标签
	  },
	  scan: function(temp) {
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	    while(this.index < length) {
	      if(this.cacheLine > 0 && count >= this.cacheLine) {
	        break;
	      }
	      if(this.state) {
	        this.readch();
	        // />
	        if(this.peek == '/') {
	          if(this.code.charAt(this.index) == '>') {
	            this.state = false;
	            var token = new HtmlToken_1(HtmlToken_1.MARK, this.peek + '>', this.peek + '>', this.index - 1);
	            this.dealToken(token, 2, 0, temp);
	          }
	          else {
	            this.error('unknow html token: / ');
	          }
	        }
	        else if(this.peek == '>') {
	          this.state = false;
	          var token = new HtmlToken_1(HtmlToken_1.MARK, this.peek, this.peek, this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	        }
	        else {
	          for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	            var match = matches[i];
	            if(match.match(this.peek, this.code, this.index)) {
	              var token = new HtmlToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	              var error = match.error();
	              var matchLen = match.content().length;
	              if(error) {
	                this.error(error, this.code.slice(this.index - matchLen, this.index));
	              }
	              var n = character.count(token.val(), character.LINE);
	              count += n;
	              this.dealToken(token, matchLen, n, temp);
	              continue outer;
	            }
	          }
	          //如果有未匹配的，说明规则不完整，抛出错误
	          this.error('unknow token');
	        }
	      }
	      else if(this.style || this.script) {
	        this.dealStSc(this.style ? 'style' : 'script', temp);
	        this.style = this.script = false;
	      }
	      else {
	        this.readch();
	        var idx = this.code.indexOf('<', this.index - 1);
	        if(idx == -1) {
	          idx = length;
	          if(this.index && idx > this.index - 1) {
	            this.addText(this.code.slice(this.index - 1, idx), temp);
	            this.index = length;
	          }
	          return this;
	        }
	        if(this.index && idx > this.index - 1) {
	          this.addText(this.code.slice(this.index - 1, idx), temp);
	          this.readch();
	        }
	        var s = this.code.slice(idx, idx + 4).toLowerCase();
	        var c1 = this.code.charAt(idx + 1);
	        var c2 = this.code.charAt(idx + 2);
	        if(s == '<!--') {
	          var end = this.code.indexOf('-->', this.index + 4);
	          if(end == -1) {
	            end = length;
	          }
	          else {
	            end += 3;
	          }
	          s = this.code.slice(idx, end);
	          var token = new HtmlToken_1(HtmlToken_1.COMMENT, s, s, this.index - 1);
	          var n = character.count(s, character.LINE);
	          this.dealToken(token, s.length, n, temp);
	        }
	        //</\w
	        else if(c1 == '/' && character.isLetter(c2)) {
	          this.state = true;
	          var token = new HtmlToken_1(HtmlToken_1.MARK, '</', '</', this.index - 1);
	          this.dealToken(token, 2, 0, temp);
	          this.readch();
	          //\w elem
	          this.dealTag(temp);
	        }
	        //<\w
	        else if(character.isLetter(c1)) {
	          this.state = true;
	          var token = new HtmlToken_1(HtmlToken_1.MARK, '<', '<', this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	          this.readch();
	          //\w elem
	          this.dealTag(temp);
	        }
	        else if(c1 == '!') {
	          this.state = true;
	          var token = new HtmlToken_1(HtmlToken_1.MARK, '<', '<', this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	        }
	      }
	    }
	    return this;
	  },
	  dealStSc: function(s, temp) {
	    var reg = new RegExp('^/' + s + '\\b');
	    for(var i = this.index; i < this.code.length; i++) {
	      if(this.code.charAt(i) == '<') {
	        if(reg.test(this.code.slice(i + 1, i + 8))) {
	          var s = this.code.slice(this.index, i);
	          this.addText(s, temp);
	          this.index = i;
	          return;
	        }
	      }
	    }
	    var s = this.code.slice(this.index);
	    this.index = this.code.length;
	    this.addText(s, temp);
	  },
	  addText: function(s, temp) {
	    var token = new HtmlToken_1(HtmlToken_1.TEXT, s, s, this.index - 1);
	    var n = character.count(token.val(), character.LINE);
	    this.dealToken(token, s.length, n, temp);
	  },
	  dealTag: function(temp) {
	    ELEM.match(this.peek, this.code, this.index);
	    var token = new HtmlToken_1(ELEM.tokenType(), ELEM.content(), ELEM.val(), this.index - 1);
	    var matchLen = ELEM.content().length;
	    this.dealToken(token, matchLen, 0, temp);
	    var s = ELEM.content().toLowerCase();
	    if(s == 'style') {
	      this.style = true;
	    }
	    else if(s == 'script') {
	      this.script = true;
	    }
	  }
	});
	var HtmlLexer_1 = HtmlLexer;

	var LineSearch = Match.extend(function(type, begin, end, contain, setPReg) {
	  if(character.isUndefined(contain)) {
	    contain = false;
	  }
	  Match.call(this, type, setPReg);
	  this.begin = begin;
	  this.end = end;
	  this.contain = contain;
	  this.msg = null;
	}).methods({
	  match: function(c, code, index) {
	    this.msg = null;
	    if(this.begin == code.substr(--index, this.begin.length)) {
	      //支持多个end匹配时不支持包含选项
	      if(!this.contain && Array.isArray(this.end)) {
	        for(var j = 0, len = this.end.length; j < len; j++) {
	          var i = code.indexOf(this.end[j], index + this.begin.length);
	          if(i != -1) {
	            this.result = code.slice(index, i);
	            return true;
	          }
	        }
	        //都不匹配时到末尾
	        this.result = code.slice(index);
	        return true;
	      }
	      else {
	        var i = code.indexOf(this.end, index + this.begin.length);
	        if(i == -1) {
	          if(this.contain) {
	            this.msg = 'SyntaxError: unterminated ' + Token_1.type(this.type).toLowerCase();
	          }
	          i = code.length;
	        }
	        else if(this.contain) {
	          i += this.end.length;
	        }
	        this.result = code.slice(index, i);
	        return true;
	      }
	    }
	    return false;
	  },
	  error: function() {
	    return this.msg;
	  }
	});
	var LineSearch_1 = LineSearch;

	var LineParse = Match.extend(function(type, begin, end, mutiline, setPReg) {
	    if(character.isUndefined(mutiline)) {
	      mutiline = false;
	    }
	    Match.call(this, type, setPReg);
	    this.begin = begin;
	    this.end = end;
	    this.msg = null;
	    this.mutiline = mutiline;
	  }).methods({
	    match: function(c, code, index) {
	      this.msg = null;
	      if(this.begin == code.charAt(index - 1)) {
	        var len = code.length,
	          lastIndex = index - 1,
	          res = false;
	        while(index < len) {
	          var c = code.charAt(index++);
	          //转义
	          if(c == character.BACK_SLASH) {
	            if(code.charAt(index++) == character.ENTER) {
	              index++;
	            }
	          }
	          else if(c == character.LINE && !this.mutiline) {
	            break;
	          }
	          else if(c == this.end) {
	            res = true;
	            break;
	          }
	        }
	        if(!res) {
	          this.msg = 'SyntaxError: unterminated ' + Token_1.type(this.type).toLowerCase() + ' literal';
	        }
	        this.result = code.slice(lastIndex, index);
	        return true;
	      }
	      return false;
	    },
	    error: function() {
	      return this.msg;
	    },
	    val: function() {
	      return this.content().slice(this.begin.length, -this.end.length);
	    }
	  });
	var LineParse_1 = LineParse;

	var CompleteEqual = Match.extend(function(type, result, setPReg, ignoreCase) {
	  Match.call(this, type, setPReg);
	  this.result = result;
	  this.ignoreCase = ignoreCase;
	  this.temp = null;
	}).methods({
	  match: function(c, code, index) {
	    this.temp = code.substr(--index, this.result.length);
	    return this.ignoreCase
	      ? this.temp.toLowerCase() == this.result.toLowerCase()
	      : this.temp == this.result;
	  },
	  content: function() {
	    return this.temp;
	  }
	});
	var CompleteEqual_1 = CompleteEqual;

	var CharacterSet = Match.extend(function(type, str, setPReg) {
	  Match.call(this, type, setPReg);
	  this.str = str;
	}).methods({
	  match: function(c, code, index) {
	    var isIn = this.str.indexOf(c) > -1;
	    if(isIn) {
	      this.result = c;
	    }
	    return isIn;
	  }
	});
	var CharacterSet_1 = CharacterSet;

	var isProperty = false;
	var EcmascriptRule = Rule_1.extend(function() {
	  var self = this;
	  Rule_1.call(self, EcmascriptRule.KEYWORDS, true);

	  self.addMatch(new CompleteEqual_1(Token_1.BLANK, character.BLANK));
	  self.addMatch(new CompleteEqual_1(Token_1.TAB, character.TAB));
	  self.addMatch(new CompleteEqual_1(Token_1.LINE, character.ENTER + character.LINE));
	  self.addMatch(new CompleteEqual_1(Token_1.LINE, character.ENTER));
	  self.addMatch(new CompleteEqual_1(Token_1.LINE, character.LINE));

	  self.addMatch(new LineSearch_1(Token_1.COMMENT, '//', [character.ENTER + character.LINE, character.ENTER, character.LINE]));
	  self.addMatch(new LineSearch_1(Token_1.COMMENT, '<!--', [character.ENTER + character.LINE, character.ENTER, character.LINE]));
	  var htmlEndComment =  new LineSearch_1(Token_1.COMMENT, '-->', [character.ENTER + character.LINE, character.ENTER, character.LINE]);
	  htmlEndComment.callback = function(token, tokenList) {
	    for(var i = tokenList.length - 1; i >= 0; i--) {
	      var t = tokenList[i];
	      if([Token_1.LINE, Token_1.ENTER].indexOf(t.type()) > -1) {
	        return;
	      }
	      else if([Token_1.COMMENT, Token_1.BLANK, Token_1.TAB].indexOf(t.type()) == -1) {
	        this.cancel = true;
	        return;
	      }
	    }
	  };
	  self.addMatch(htmlEndComment);
	  self.addMatch(new LineSearch_1(Token_1.COMMENT, '/*', '*/', true));
	  self.addMatch(new LineParse_1(Token_1.STRING, '"', '"', false, Lexer_1.NOT_REG));
	  self.addMatch(new LineParse_1(Token_1.STRING, "'", "'", false, Lexer_1.NOT_REG));

	  var id = new RegMatch_1(Token_1.ID, /^[$a-zA-Z_\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e-\u066f\u0671-\u06d3\u06d5\u06e5-\u06e6\u06ee-\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4-\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0-\u08b2\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc-\u09dd\u09df-\u09e1\u09f0-\u09f1\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0-\u0ae1\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c59\u0c60-\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0-\u0ce1\u0cf1-\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32-\u0e33\u0e40-\u0e46\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb0\u0eb2-\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065-\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae-\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5-\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a-\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5-\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7][$\w\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0966-\u096f\u0971-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7-\u09c8\u09cb-\u09ce\u09d7\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3c\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b5c-\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c58-\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1-\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82-\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18-\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772-\u1773\u1780-\u17d3\u17d7\u17dc-\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1ab0-\u1abd\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8-\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c-\u200d\u203f-\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099-\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\ua9e0-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabea\uabec-\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7]*/, Lexer_1.SPECIAL, function() {
	    return !!(self.keyWords().hasOwnProperty(this.content()));
	  }, function() {
	    return ['if', 'for', 'while'].indexOf(this.content()) != -1;
	  });
	  id.callback = function(token) {
	    var s = token.content();
	    if(isProperty) {
	      token.type(Token_1.ID);
	    }
	    isProperty = false;
	  };
	  self.addMatch(id);

	  self.addMatch(new RegMatch_1(Token_1.NUMBER, /^\.\d+(?:E[+-]?\d*)?/i, {
	    'SyntaxError: missing exponent': /E[+-]?$/i
	  }, Lexer_1.NOT_REG));

	  self.addMatch(new CompleteEqual_1(Token_1.SIGN, ']', Lexer_1.NOT_REG));

	  ['*=', '/=', '+=', '-=', '%=', '^=', '&=', '|=', '&&', '--', '++', '===', '==', '!==', '!=', '||', '>>>=', '>>>', '>>=', '<<=', '<<', '>>', '>=', '<=', '...', '=>', '**'].forEach(function(o) {
	    self.addMatch(new CompleteEqual_1(Token_1.SIGN, o, Lexer_1.IS_REG));
	  });
	  var sign = new CharacterSet_1(Token_1.SIGN, ':;/?.,[{}~!^|%=-+*()~><&', Lexer_1.IS_REG);
	  sign.callback = function(token) {
	    var s = token.content();
	    isProperty = s == '.';
	  };
	  self.addMatch(sign);

	  self.addMatch(new RegMatch_1(Token_1.NUMBER, /^0x[\da-f]*/i, {
	    "SyntaxError: missing hexadecimal digits after '0x'": /^0x$/i
	  }, Lexer_1.NOT_REG));
	  self.addMatch(new RegMatch_1(Token_1.NUMBER, /^0b[01]*/i, {
	    "SyntaxError: missing binary digits after '0b'": /^0b$/i
	  }, Lexer_1.NOT_REG));
	  self.addMatch(new RegMatch_1(Token_1.NUMBER, /^0o[01234567]*/i, {
	    "SyntaxError: missing octal digits after '0b'": /^0o$/i
	  }, Lexer_1.NOT_REG));
	  self.addMatch(new RegMatch_1(Token_1.NUMBER, /^\d+\.?\d*(?:E[+-]?\d*)?/i, {
	    'SyntaxError: missing exponent': /E[+-]?$/i
	  }, Lexer_1.NOT_REG));

	  self.addMatch(new CharacterSet_1(Token_1.LINE, '\u2028\u2029'));
	  self.addMatch(new CharacterSet_1(Token_1.BLANK, '\f\u000b\u00A0\uFEFF\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'));
	  self.addMatch(new RegMatch_1(Token_1.ANNOT, /^@[$a-zA-Z_\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e-\u066f\u0671-\u06d3\u06d5\u06e5-\u06e6\u06ee-\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4-\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0-\u08b2\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc-\u09dd\u09df-\u09e1\u09f0-\u09f1\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0-\u0ae1\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c59\u0c60-\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0-\u0ce1\u0cf1-\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32-\u0e33\u0e40-\u0e46\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb0\u0eb2-\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065-\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae-\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5-\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a-\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5-\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7][$\w\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0966-\u096f\u0971-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7-\u09c8\u09cb-\u09ce\u09d7\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3c\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b5c-\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c58-\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1-\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82-\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18-\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772-\u1773\u1780-\u17d3\u17d7\u17dc-\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1ab0-\u1abd\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8-\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c-\u200d\u203f-\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099-\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\ua9e0-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabea\uabec-\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7]*/));
	}).statics({
	  KEYWORDS: 'await async break case catch class const continue debugger default delete do else enum export extends false finally for function if implements import in instanceof interface let new null package private protected public return static super switch this throw true try typeof var void while with yield'.split(' ')
	});
	var EcmascriptRule_1 = EcmascriptRule;

	var EcmascriptLexer = Lexer_1.extend(function(rule, inTemplate) {
	  Lexer_1.call(this, rule);
	  this.inTemplate = inTemplate;
	}).methods({
	  init: function() {
	    Lexer_1.prototype.init.call(this);
	  },
	  scan: function(temp) {
	    var perlReg = this.rule.perlReg();
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	      while(this.index < length) {
	        if(this.cacheLine > 0 && count >= this.cacheLine) {
	          break;
	        }
	        this.readch();
	        //perl风格正则
	        if(perlReg
	          && this.isReg == Lexer_1.IS_REG
	          && this.peek == character.SLASH
	          && !{ '/': true, '*': true }[this.code.charAt(this.index)]) {
	          this.dealReg(temp, length);
	          this.isReg = Lexer_1.NOT_REG;
	        }
	        //template特殊语法
	        else if(this.peek == character.GRAVE) {
	          this.dealGrave(temp, length);
	          this.isReg = Lexer_1.NOT_REG;
	        }
	        //递归解析template中的expr时结束跳出
	        else if(this.inTemplate && this.peek == '}') {
	          return this;
	        }
	        //依次遍历匹配规则，命中则继续
	        else {
	          for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	            var match = matches[i];
	            if(match.match(this.peek, this.code, this.index)) {
	              var token = new Token_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	              var error = match.error();
	              var matchLen = match.content().length;
	              if(error) {
	                this.error(error, this.code.slice(this.index - matchLen, this.index));
	              }

	              if(token.type() == Token_1.ID
	                && this.rule.keyWords().hasOwnProperty(token.content())) {
	                token.type(Token_1.KEYWORD);
	              }

	              //回调可自定义处理匹配的token
	              if(match.callback) {
	                match.callback.call(match, token, this.tokenList);
	              }
	              //回调特殊处理忽略掉此次匹配
	              if(match.cancel) {
	                token.cancel();
	                continue;
	              }

	              var n = character.count(token.val(), character.LINE);
	              count += n;
	              //处理token
	              this.dealToken(token, matchLen, n, temp);
	              //支持perl正则需判断关键字、圆括号对除号语义的影响
	              if(perlReg && match.perlReg() != Lexer_1.IGNORE) {
	                this.stateReg(match);
	              }
	              //处理{
	              this.stateBrace(match.content(), token.type());

	              continue outer;
	            }
	          }
	          //如果有未匹配的，说明规则不完整，抛出错误
	          this.error('unknow token');
	        }
	      }
	    return this;
	  },
	  dealGrave: function(temp, length) {
	    var lastIndex = this.index - 1;
	    var res = false;
	    var expr = false;
	    var head = true;
	    var tempIndex = lastIndex;
	    do {
	      this.readch();
	      if(this.peek == character.BACK_SLASH) {
	        this.index++;
	      }
	      else if(this.peek == character.DOLLAR) {
	        this.readch();
	        if(this.peek == character.LEFT_BRACE) {
	          this.readch();
	          expr = true;
	          var token = new Token_1(head ? Token_1.TEMPLATE_HEAD : Token_1.TEMPLATE_MIDDLE, this.code.slice(tempIndex, --this.index), lastIndex);
	          head = false;
	          this.index = tempIndex + 1;
	          var n = character.count(token.val(), character.LINE);
	          this.dealToken(token, token.content().length, n, temp);
	          var lexer = new EcmascriptLexer(new EcmascriptRule_1(), true);
	          lexer.index = this.index;
	          lexer.colNum = this.colNum;
	          lexer.colMax = this.colMax;
	          lexer.totalLine = this.totalLine;
	          lexer.parse(this.code);
	          var tokenList = lexer.tokenList;
	          for(var i = 0, len = tokenList.length; i < len; i++) {
	            var n = character.count(token.val(), character.LINE);
	            this.dealToken(tokenList[i], token.content().length, n, temp);
	          }
	          tempIndex = this.index = lexer.index - 1;
	        }
	      }
	      else if(this.peek == character.GRAVE) {
	        res = true;
	        break;
	      }
	    } while(this.index < length);
	    if(!res) {
	      this.error('SyntaxError: unterminated template literal',
	        this.code.slice(lastIndex, this.index - 1));
	    }
	    var token = new Token_1(expr ? Token_1.TEMPLATE_TAIL : Token_1.TEMPLATE, this.code.slice(tempIndex, this.index), tempIndex);
	    this.index = tempIndex + 1;
	    var n = character.count(token.val(), character.LINE);
	    this.dealToken(token, token.content().length, n, temp);
	  }
	});
	var EcmascriptLexer_1 = EcmascriptLexer;

	var JSXToken = Token_1.extend(function(type, content, val, sIndex) {
	  Token_1.call(this, type, content, val, sIndex);
	}).statics({
	  MARK: 26,
	  ELEM: 24,
	  PROPERTY: 15,
	  TEXT: 25,
	  BIND_PROPERTY: 28,
	});

	var JSXToken_1 = JSXToken;

	var ELEM$1 = new RegMatch_1(JSXToken_1.ELEM, /^[a-z]\w*(?:-\w+)*/i);
	var JSXMatch = [
	  new CompleteEqual_1(JSXToken_1.BLANK, character.BLANK),
	  new CompleteEqual_1(JSXToken_1.TAB, character.TAB),
	  new CompleteEqual_1(JSXToken_1.LINE, character.ENTER + character.LINE),
	  new CompleteEqual_1(JSXToken_1.LINE, character.ENTER),
	  new CompleteEqual_1(JSXToken_1.LINE, character.LINE),
	  new CompleteEqual_1(JSXToken_1.SIGN, character.DECIMAL),
	  new LineSearch_1(JSXToken_1.STRING, '"', '"', true),
	  new LineSearch_1(JSXToken_1.STRING, "'", "'", true),
	  new CharacterSet_1(JSXToken_1.SIGN, '=:'),
	  new RegMatch_1(JSXToken_1.NUMBER, /^\d+(?:\.\d*)?/),
	  new RegMatch_1(JSXToken_1.BIND_PROPERTY, /^@[a-z]\w*/i),
	  new RegMatch_1(JSXToken_1.PROPERTY, /^[a-z]\w*(?:-\w+)*/i)
	];

	var SELF_CLOSE = {
	  'img': true,
	  'meta': true,
	  'link': true,
	  'br': true,
	  'basefont': true,
	  'base': true,
	  'col': true,
	  'embed': true,
	  'frame': true,
	  'hr': true,
	  'input': true,
	  'keygen': true,
	  'area': true,
	  'param': true,
	  'source': true,
	  'track': true
	};

	var JSXLexer = EcmascriptLexer_1.extend(function(rule) {
	  EcmascriptLexer_1.call(this, rule);
	}).methods({
	  init: function() {
	    EcmascriptLexer_1.prototype.init.call(this);
	    this.html = false; //目前是否为解析html状态
	    this.state = false; //是否在<>中
	    this.hStack = []; //当mark开始时++，减少时--，以此得知jsx部分结束回归js
	    this.jStack = []; //当{开始时++，}减少时--，以此得知js部分结束回归jsx
	    this.aStack = []; //html和js互相递归时，记录当前层是否在attr状态中
	    this.cStack = []; //html和js互相递归时，记录当前jsx标签是否是自闭合
	    this.selfClose = false; //当前jsx标签是否是自闭合
	  },
	  scan: function(temp) {
	    var perlReg = this.rule.perlReg();
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	      while(this.index < length) {
	        if(this.cacheLine > 0 && count >= this.cacheLine) {
	          break;
	        }
	        this.readch();
	        //在解析html中
	        if(this.html) {
	          if(this.state) {
	            // />
	            if(this.peek == '/') {
	              if(this.code.charAt(this.index) == '>') {
	                this.state = false;
	                // />结束时，html深度--，如到0，说明html状态结束
	                this.hStack[this.hStack.length - 1]--;
	                if(this.hStack[this.hStack.length - 1] == 0) {
	                  this.hStack.pop();
	                  this.html = false;
	                  this.isReg = false;
	                }
	                var token = new JSXToken_1(JSXToken_1.MARK, this.peek + '>', this.peek + '>', this.index - 1);
	                this.dealToken(token, 2, 0, temp);
	              }
	              else {
	                this.error('unknow jsx token: ' + this.code.charAt(this.index));
	              }
	            }
	            //>
	            else if(this.peek == '>') {
	              if(this.selfClose) {
	                this.error('self-close tag needs />');
	              }
	              this.state = false;
	              //>结束时，html深度若为0，说明html状态结束，或者栈最后一个计数器为0，也结束
	              if(!this.hStack.length || !this.hStack[this.hStack.length - 1]) {
	                this.html = false;
	                this.isReg = false;
	                if(this.hStack.length) {
	                  this.hStack.pop();
	                }
	              }
	              var token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	              this.dealToken(token, 1, 0, temp);
	            }
	            //<>和</>
	            else if(this.peek == '<') {
	              if(this.code.charAt(this.index) == '>') {
	                var token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	                this.dealToken(token, 1, 0, temp);
	                this.readch();
	                token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	                this.dealToken(token, 1, 0, temp);
	              }
	              else if(this.code.charAt(this.index) == '/' && this.code.charAt(this.index + 1) == '>') {
	                var token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	                this.dealToken(token, 1, 0, temp);
	                this.readch();
	                token = new JSXToken_1(JSXToken_1.MARK, '</', '</', this.index - 1);
	                this.dealToken(token, 2, 0, temp);
	                this.index += 2;
	              }
	              else {
	                this.error('unknow jsx token: ' + this.code.charAt(this.index));
	              }
	            }
	            //{递归进入js状态
	            else if(this.peek == '{') {
	              this.html = false;
	              this.jStack.push(1);
	              this.cStack.push(this.selfClose);
	              this.aStack.push(this.state);
	              var token = new JSXToken_1(JSXToken_1.SIGN, this.peek, this.peek);
	              this.dealToken(token, 1, 0, temp);
	              this.stateBrace(this.peek);
	            }
	            else {
	              for(var i = 0, len = JSXMatch.length; i < len; i++) {
	                var match = JSXMatch[i];
	                if(match.match(this.peek, this.code, this.index)) {
	                  var token = new JSXToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	                  var error = match.error();
	                  if(error) {
	                    this.error(error, this.code.slice(this.index - matchLen, this.index));
	                  }
	                  var matchLen = match.content().length;
	                  var n = character.count(token.val(), character.LINE);
	                  count += n;
	                  this.dealToken(token, matchLen, n, temp);
	                  continue outer;
	                }
	              }
	              //如果有未匹配的，说明规则不完整，抛出错误
	              this.error('unknow jsx token');
	            }
	          }
	          //<>外面
	          else {
	            //<之前的text部分或{}js部分
	            var idx = this.code.indexOf('<', this.index - 1);
	            var idx2 = this.code.indexOf('{', this.index - 1);
	            //找不到<和{
	            if(idx == -1 && idx2 == -1) {
	              idx = length;
	              if(idx > this.index - 1) {
	                this.addText(this.code.slice(this.index - 1, idx), temp);
	                this.index = length;
	              }
	              return this;
	            }
	            //找到<
	            if(idx2 == -1 || idx2 > idx) {
	              var c1 = this.code.charAt(idx + 1);
	              var c2 = this.code.charAt(idx + 2);
	              //</\w
	              if(c1 == '/' && character.isLetter(c2)) {
	                if(idx > this.index - 1) {
	                  this.addText(this.code.slice(this.index - 1, idx), temp);
	                  this.index = idx;
	                }
	                this.state = true;
	                this.hStack[this.hStack.length - 1]--;
	                //</
	                var token = new JSXToken_1(JSXToken_1.MARK, '</', '</', this.index - 1);
	                this.dealToken(token, 2, 0, temp);
	                this.index = idx + 2;
	                this.readch();
	                //\w elem
	                this.dealTag(temp, true);
	              }
	              //</>
	              else if(c1 == '/' && c2 == '>') {
	                if(idx > this.index - 1) {
	                  this.addText(this.code.slice(this.index - 1, idx), temp);
	                  this.index = idx;
	                }
	                this.state = true;
	                this.hStack[this.hStack.length - 1]--;
	                //</
	                var token = new JSXToken_1(JSXToken_1.MARK, '</', '</', this.index - 1);
	                this.dealToken(token, 2, 0, temp);
	                this.index = idx + 2;
	              }
	              //<\w
	              else if(character.isLetter(c1)) {
	                if(idx > this.index - 1) {
	                  this.addText(this.code.slice(this.index - 1, idx), temp);
	                  this.index = idx;
	                }
	                this.state = true;
	                this.hStack[this.hStack.length - 1]++;
	                //<
	                var token = new JSXToken_1(JSXToken_1.MARK, '<', '<', this.index - 1);
	                this.dealToken(token, 1, 0, temp);
	                this.index = idx + 1;
	                this.readch();
	                //\w elem
	                this.dealTag(temp);
	              }
	              else {
	                this.error();
	              }
	            }
	            //{block
	            else {
	              if(idx2 > this.index - 1) {
	                this.addText(this.code.slice(this.index - 1, idx2), temp);
	                this.readch();
	              }
	              this.jStack.push(1);
	              this.html = false;
	              var token = new JSXToken_1(JSXToken_1.SIGN, this.peek, this.peek, this.index - 1);
	              this.dealToken(token, 1, 0, temp);
	              this.stateBrace(this.peek);
	            }
	          }
	        }
	        //<\w开始则jsx，<作为mark开头和识别正则/开头上下文语意相同
	        else if(this.isReg == JSXLexer.IS_REG
	          && this.peek == '<'
	          && character.isLetter(this.code.charAt(this.index))) {
	          //新的jsx开始，html深度++，html状态开始，同时为非text状态
	          this.hStack.push(1);
	          this.html = true;
	          this.state = true;
	          //<
	          var token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	          this.readch();
	          //\w elem
	          this.dealTag(temp);
	        }
	        //<>则jsx，fragment出现
	        else if(this.isReg == JSXLexer.IS_REG
	          && this.peek == '<'
	          && this.code.charAt(this.index) == '>') {
	          //新的jsx开始，html深度++，html状态开始，同时为非text状态
	          this.hStack.push(1);
	          this.html = true;
	          //<>
	          var token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	          this.readch();
	          token = new JSXToken_1(JSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	        }
	        //perl风格正则
	        else if(perlReg
	          && this.isReg == JSXLexer.IS_REG
	          && this.peek == character.SLASH
	          && !{ '/': true, '*': true }[this.code.charAt(this.index)]) {
	          this.dealReg(temp, length);
	          this.isReg = JSXLexer.NOT_REG;
	        }
	        //template特殊语法
	        else if(this.peek == character.GRAVE) {
	          this.dealGrave(temp, length);
	          this.isReg = EcmascriptLexer_1.NOT_REG;
	        }
	        //递归解析template中的expr时结束跳出
	        else if(this.inTemplate && this.peek == '}') {
	          return this;
	        }
	        //依次遍历匹配规则，命中则继续
	        else {
	          for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	            var match = matches[i];
	            if(match.match(this.peek, this.code, this.index)) {
	              var token = new JSXToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	              var error = match.error();
	              var matchLen = match.content().length;
	              if(error) {
	                this.error(error, this.code.slice(this.index - matchLen, this.index));
	              }
	              if(token.type() == JSXToken_1.ID
	                && this.rule.keyWords().hasOwnProperty(token.content())) {
	                token.type(JSXToken_1.KEYWORD);
	              }

	              //回调可自定义处理匹配的token
	              if(match.callback) {
	                match.callback.call(match, token, this.tokenList);
	              }
	              //回调特殊处理忽略掉此次匹配
	              if(match.cancel) {
	                token.cancel();
	                continue;
	              }

	              var n = character.count(token.val(), character.LINE);
	              count += n;
	              //处理token
	              this.dealToken(token, matchLen, n, temp);
	              //支持perl正则需判断关键字、圆括号对除号语义的影响
	              if(perlReg && match.perlReg() != EcmascriptLexer_1.IGNORE) {
	                this.stateReg(match);
	              }
	              //处理{
	              this.stateBrace(match.content(), token.type());
	              this.xBrace(match.content());

	              continue outer;
	            }
	          }
	          //如果有未匹配的，说明规则不完整，抛出错误
	          this.error('unknow token');
	        }
	      }
	    return this;
	  },
	  addText: function(s, temp) {
	    var token = new JSXToken_1(JSXToken_1.TEXT, s, s, this.index - 1);
	    var n = character.count(token.val(), character.LINE);
	    this.dealToken(token, s.length, n, temp);
	  },
	  dealTag: function(temp, end) {
	    ELEM$1.match(this.peek, this.code, this.index);
	    var token = new JSXToken_1(ELEM$1.tokenType(), ELEM$1.content(), ELEM$1.val(), this.index - 1);
	    var matchLen = ELEM$1.content().length;
	    this.dealToken(token, matchLen, 0, temp);
	    if(!end) {
	      //自闭合没有.和:
	      if(SELF_CLOSE.hasOwnProperty(token.content().toLowerCase())) {
	        this.selfClose = true;
	        return;
	      }
	      this.selfClose = false;
	    }
	    this.selfClose = false;
	    var c = this.code.charAt(this.index);
	    if(c == '.') {
	      while(true) {
	        this.readch();
	        token = new JSXToken_1(JSXToken_1.SIGN, this.peek, this.peek, this.index - 1);
	        this.dealToken(token, 1, 0, temp);
	        this.readch();
	        if(!character.isLetter(this.peek)) {
	          this.error('missing jsx identifier');
	        }
	        ELEM$1.match(this.peek, this.code, this.index);
	        token = new JSXToken_1(ELEM$1.tokenType(), ELEM$1.content(), ELEM$1.val(), this.index - 1);
	        matchLen = ELEM$1.content().length;
	        this.dealToken(token, matchLen, 0, temp);
	        c = this.code.charAt(this.index);
	        if(c != '.') {
	          break;
	        }
	      }
	    }
	    else if(c == ':') {
	      while(true) {
	        this.readch();
	        token = new JSXToken_1(JSXToken_1.SIGN, this.peek, this.peek, this.index - 1);
	        this.dealToken(token, 1, 0, temp);
	        this.readch();
	        if(!character.isLetter(this.peek)) {
	          this.error('missing jsx identifier');
	        }
	        ELEM$1.match(this.peek, this.code, this.index);
	        token = new JSXToken_1(ELEM$1.tokenType(), ELEM$1.content(), ELEM$1.val(), this.index - 1);
	        matchLen = ELEM$1.content().length;
	        this.dealToken(token, matchLen, 0, temp);
	        c = this.code.charAt(this.index);
	        if(c != ':') {
	          break;
	        }
	      }
	    }
	  },
	  xBrace: function(content) {
	    if(content == '{') {
	      if(this.jStack.length) {
	        this.jStack[this.jStack.length - 1]++;
	      }
	    }
	    else if(content == '}') {
	      if(this.jStack.length) {
	        this.jStack[this.jStack.length - 1]--;
	        if(this.jStack[this.jStack.length - 1] == 0) {
	          this.html = true;
	          this.selfClose = this.cStack.pop();
	          this.state = this.aStack.pop();
	          this.jStack.pop();
	        }
	      }
	    }
	  }
	}).statics({
	  SELF_CLOSE: SELF_CLOSE
	});
	var JSXLexer_1 = JSXLexer;

	var CSXToken = Token_1.extend(function(type, content, val, sIndex) {
	  Token_1.call(this, type, content, val, sIndex);
	}).statics({
	  MARK: 26,
	  ELEM: 24,
	  PROPERTY: 15,
	  TEXT: 25,
	  BIND_PROPERTY: 28,
	});

	var CSXToken_1 = CSXToken;

	var ELEM$2 = new RegMatch_1(CSXToken_1.ELEM, /^\$?[a-z]\w*(?:-\w+)*/i);
	var CSXMatch = [
	  new CompleteEqual_1(CSXToken_1.BLANK, character.BLANK),
	  new CompleteEqual_1(CSXToken_1.TAB, character.TAB),
	  new CompleteEqual_1(CSXToken_1.LINE, character.ENTER + character.LINE),
	  new CompleteEqual_1(CSXToken_1.LINE, character.ENTER),
	  new CompleteEqual_1(CSXToken_1.LINE, character.LINE),
	  new CompleteEqual_1(CSXToken_1.SIGN, character.DECIMAL),
	  new LineSearch_1(CSXToken_1.STRING, '"', '"', true),
	  new LineSearch_1(CSXToken_1.STRING, "'", "'", true),
	  new CharacterSet_1(CSXToken_1.SIGN, '=:'),
	  new RegMatch_1(CSXToken_1.NUMBER, /^\d+(?:\.\d*)?/),
	  new RegMatch_1(CSXToken_1.BIND_PROPERTY, /^@[a-z]\w*/i),
	  new RegMatch_1(CSXToken_1.PROPERTY, /^[a-z]\w*(?:-\w+)*/i)
	];

	var SELF_CLOSE$1 = {
	  'img': true,
	  'meta': true,
	  'link': true,
	  'br': true,
	  'basefont': true,
	  'base': true,
	  'col': true,
	  'embed': true,
	  'frame': true,
	  'hr': true,
	  'input': true,
	  'keygen': true,
	  'area': true,
	  'param': true,
	  'source': true,
	  'track': true
	};

	var JSXLexer$1 = EcmascriptLexer_1.extend(function(rule) {
	  EcmascriptLexer_1.call(this, rule);
	}).methods({
	  init: function() {
	    EcmascriptLexer_1.prototype.init.call(this);
	    this.html = false; //目前是否为解析html状态
	    this.state = false; //是否在<>中
	    this.hStack = []; //当mark开始时++，减少时--，以此得知jsx部分结束回归js
	    this.jStack = []; //当{开始时++，}减少时--，以此得知js部分结束回归jsx
	    this.aStack = []; //html和js互相递归时，记录当前层是否在attr状态中
	    this.cStack = []; //html和js互相递归时，记录当前jsx标签是否是自闭合
	    this.selfClose = false; //当前jsx标签是否是自闭合
	  },
	  scan: function(temp) {
	    var perlReg = this.rule.perlReg();
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	      while(this.index < length) {
	        if(this.cacheLine > 0 && count >= this.cacheLine) {
	          break;
	        }
	        this.readch();
	        //在解析html中
	        if(this.html) {
	          if(this.state) {
	            // />
	            if(this.peek == '/') {
	              if(this.code.charAt(this.index) == '>') {
	                this.state = false;
	                // />结束时，html深度--，如到0，说明html状态结束
	                this.hStack[this.hStack.length - 1]--;
	                if(this.hStack[this.hStack.length - 1] == 0) {
	                  this.hStack.pop();
	                  this.html = false;
	                  this.isReg = false;
	                }
	                var token = new CSXToken_1(CSXToken_1.MARK, this.peek + '>', this.peek + '>', this.index - 1);
	                this.dealToken(token, 2, 0, temp);
	              }
	              else {
	                this.error('unknow jsx token: / ');
	              }
	            }
	            //>
	            else if(this.peek == '>') {
	              if(this.selfClose) {
	                this.error('self-close tag needs />');
	              }
	              this.state = false;
	              //>结束时，html深度若为0，说明html状态结束，或者栈最后一个计数器为0，也结束
	              if(!this.hStack.length || !this.hStack[this.hStack.length - 1]) {
	                this.html = false;
	                this.isReg = false;
	                if(this.hStack.length) {
	                  this.hStack.pop();
	                }
	              }
	              var token = new CSXToken_1(CSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	              this.dealToken(token, 1, 0, temp);
	            }
	            //{递归进入js状态
	            else if(this.peek == '{') {
	              this.html = false;
	              this.braceState = false;
	              this.jStack.push(1);
	              this.cStack.push(this.selfClose);
	              this.aStack.push(this.state);
	              var token = new CSXToken_1(CSXToken_1.SIGN, this.peek, this.peek);
	              this.dealToken(token, 1, 0, temp);
	              this.stateBrace(this.peek);
	            }
	            else {
	              for(var i = 0, len = CSXMatch.length; i < len; i++) {
	                var match = CSXMatch[i];
	                if(match.match(this.peek, this.code, this.index)) {
	                  var token = new CSXToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	                  var error = match.error();
	                  if(error) {
	                    this.error(error, this.code.slice(this.index - matchLen, this.index));
	                  }
	                  var matchLen = match.content().length;
	                  var n = character.count(token.val(), character.LINE);
	                  count += n;
	                  this.dealToken(token, matchLen, n, temp);
	                  continue outer;
	                }
	              }
	              //如果有未匹配的，说明规则不完整，抛出错误
	              this.error('unknow jsx token');
	            }
	          }
	          //<>外面
	          else {
	            //<之前的text部分或{}js部分
	            var idx = this.code.indexOf('<', this.index - 1);
	            var idx2 = this.code.indexOf('{', this.index - 1);
	            //找不到<和{
	            if(idx == -1 && idx2 == -1) {
	              idx = length;
	              if(idx > this.index - 1) {
	                this.addText(this.code.slice(this.index - 1, idx), temp);
	                this.index = length;
	              }
	              return this;
	            }
	            //找到<
	            if(idx2 == -1 || idx2 > idx) {
	              var c1 = this.code.charAt(idx + 1);
	              var c2 = this.code.charAt(idx + 2);
	              //</\w
	              if(c1 == '/' && (character.isLetter(c2) || character.DOLLAR == c2)) {
	                if(idx > this.index - 1) {
	                  this.addText(this.code.slice(this.index - 1, idx), temp);
	                  this.index = idx;
	                }
	                this.state = true;
	                this.hStack[this.hStack.length - 1]--;
	                //</
	                var token = new CSXToken_1(CSXToken_1.MARK, '</', '</', this.index - 1);
	                this.dealToken(token, 2, 0, temp);
	                this.index = idx + 2;
	                this.readch();
	                //\w elem
	                this.dealTag(temp, true);
	              }
	              //<\w
	              else if(character.isLetter(c1) || character.DOLLAR == c1) {
	                if(idx > this.index - 1) {
	                  this.addText(this.code.slice(this.index - 1, idx), temp);
	                  this.index = idx;
	                }
	                this.state = true;
	                this.hStack[this.hStack.length - 1]++;
	                //<
	                var token = new CSXToken_1(CSXToken_1.MARK, '<', '<', this.index - 1);
	                this.dealToken(token, 1, 0, temp);
	                this.index = idx + 1;
	                this.readch();
	                //\w elem
	                this.dealTag(temp);
	              }
	              else {
	                this.error();
	              }
	            }
	            //{block
	            else {
	              if(idx2 > this.index - 1) {
	                this.addText(this.code.slice(this.index - 1, idx2), temp);
	                this.readch();
	              }
	              this.jStack.push(1);
	              this.html = false;
	              this.braceState = false;
	              var token = new CSXToken_1(CSXToken_1.SIGN, this.peek, this.peek, this.index - 1);
	              this.dealToken(token, 1, 0, temp);
	              this.stateBrace(this.peek);
	            }
	          }
	        }
	        //<\w开始则jsx，<作为mark开头和识别正则/开头上下文语意相同
	        else if(this.isReg == JSXLexer$1.IS_REG
	          && this.peek == '<'
	          && (character.isLetter(this.code.charAt(this.index)) || character.DOLLAR == this.code.charAt(this.index))) {
	          //新的jsx开始，html深度++，html状态开始，同时为非text状态
	          this.hStack.push(1);
	          this.html = true;
	          this.state = true;
	          //<
	          var token = new CSXToken_1(CSXToken_1.MARK, this.peek, this.peek, this.index - 1);
	          this.dealToken(token, 1, 0, temp);
	          this.readch();
	          //\w elem
	          this.dealTag(temp);
	          this.braceState = false;
	        }
	        //perl风格正则
	        else if(perlReg
	          && this.isReg == JSXLexer$1.IS_REG
	          && this.peek == character.SLASH
	          && !{ '/': true, '*': true }[this.code.charAt(this.index)]) {
	          this.dealReg(temp, length);
	          this.isReg = JSXLexer$1.NOT_REG;
	        }
	        //template特殊语法
	        else if(this.peek == character.GRAVE) {
	          this.dealGrave(temp, length);
	          this.isReg = EcmascriptLexer_1.NOT_REG;
	        }
	        //递归解析template中的expr时结束跳出
	        else if(this.inTemplate && this.peek == '}') {
	          return this;
	        }
	        //依次遍历匹配规则，命中则继续
	        else {
	          for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	            var match = matches[i];
	            if(match.match(this.peek, this.code, this.index)) {
	              var token = new CSXToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	              var error = match.error();
	              var matchLen = match.content().length;
	              if(error) {
	                this.error(error, this.code.slice(this.index - matchLen, this.index));
	              }
	              if(token.type() == CSXToken_1.ID
	                && this.rule.keyWords().hasOwnProperty(token.content())) {
	                token.type(CSXToken_1.KEYWORD);
	              }

	              //回调可自定义处理匹配的token
	              if(match.callback) {
	                match.callback.call(match, token, this.tokenList);
	              }
	              //回调特殊处理忽略掉此次匹配
	              if(match.cancel) {
	                token.cancel();
	                continue;
	              }

	              var n = character.count(token.val(), character.LINE);
	              count += n;
	              //处理token
	              this.dealToken(token, matchLen, n, temp);
	              //支持perl正则需判断关键字、圆括号对除号语义的影响
	              if(perlReg && match.perlReg() != EcmascriptLexer_1.IGNORE) {
	                this.stateReg(match);
	              }
	              //处理{
	              this.stateBrace(match.content(), token.type());
	              this.xBrace(match.content());

	              continue outer;
	            }
	          }
	          //如果有未匹配的，说明规则不完整，抛出错误
	          this.error('unknow token');
	        }
	      }
	    return this;
	  },
	  addText: function(s, temp) {
	    var token = new CSXToken_1(CSXToken_1.TEXT, s, s, this.index - 1);
	    var n = character.count(token.val(), character.LINE);
	    this.dealToken(token, s.length, n, temp);
	  },
	  dealTag: function(temp, end) {
	    ELEM$2.match(this.peek, this.code, this.index);
	    var token = new CSXToken_1(ELEM$2.tokenType(), ELEM$2.content(), ELEM$2.val(), this.index - 1);
	    var matchLen = ELEM$2.content().length;
	    this.dealToken(token, matchLen, 0, temp);
	    if(!end) {
	      //自闭合没有.和:
	      if(SELF_CLOSE$1.hasOwnProperty(token.content().toLowerCase())) {
	        this.selfClose = true;
	        return;
	      }
	      this.selfClose = false;
	    }
	    this.selfClose = false;
	    var c = this.code.charAt(this.index);
	    if(c == '.') {
	      while(true) {
	        this.readch();
	        token = new CSXToken_1(CSXToken_1.SIGN, this.peek, this.peek, this.index - 1);
	        this.dealToken(token, 1, 0, temp);
	        this.readch();
	        if(!character.isLetter(this.peek)) {
	          this.error('missing jsx identifier');
	        }
	        ELEM$2.match(this.peek, this.code, this.index);
	        token = new CSXToken_1(ELEM$2.tokenType(), ELEM$2.content(), ELEM$2.val(), this.index - 1);
	        matchLen = ELEM$2.content().length;
	        this.dealToken(token, matchLen, 0, temp);
	        c = this.code.charAt(this.index);
	        if(c != '.') {
	          break;
	        }
	      }
	    }
	    else if(c == ':') {
	      while(true) {
	        this.readch();
	        token = new CSXToken_1(CSXToken_1.SIGN, this.peek, this.peek, this.index - 1);
	        this.dealToken(token, 1, 0, temp);
	        this.readch();
	        if(!character.isLetter(this.peek)) {
	          this.error('missing jsx identifier');
	        }
	        ELEM$2.match(this.peek, this.code, this.index);
	        token = new CSXToken_1(ELEM$2.tokenType(), ELEM$2.content(), ELEM$2.val(), this.index - 1);
	        matchLen = ELEM$2.content().length;
	        this.dealToken(token, matchLen, 0, temp);
	        c = this.code.charAt(this.index);
	        if(c != ':') {
	          break;
	        }
	      }
	    }
	  },
	  xBrace: function(content) {
	    if(content == '{') {
	      if(this.jStack.length) {
	        this.jStack[this.jStack.length - 1]++;
	      }
	    }
	    else if(content == '}') {
	      if(this.jStack.length) {
	        this.jStack[this.jStack.length - 1]--;
	        if(this.jStack[this.jStack.length - 1] == 0) {
	          this.html = true;
	          this.selfClose = this.cStack.pop();
	          this.state = this.aStack.pop();
	          this.jStack.pop();
	        }
	      }
	    }
	  }
	}).statics({
	  SELF_CLOSE: SELF_CLOSE$1
	});
	var CSXLexer = JSXLexer$1;

	var AxmlToken = Token_1.extend(function(type, content, val, sIndex) {
	  Token_1.call(this, type, content, val, sIndex);
	}).statics({
	  DOC: 27,
	  PROPERTY: 15,
	  TEXT: 25,
	  MARK: 26,
	  ELEM: 24
	});

	var AxmlToken_1 = AxmlToken;

	var ELEM$3 = new RegMatch_1(AxmlToken_1.ELEM, /^[a-z]\w*(?:-\w+)*/i);

	var AxmlLexer = Lexer_1.extend(function(rule) {
	  Lexer_1.call(this, rule);
	}).methods({
	  init: function() {
	    Lexer_1.prototype.init.call(this);
	    this.state = false; //是否在<>状态中
	    this.style = false; //style标签
	    this.script = false; //script标签
	  },
	  scan: function(temp) {
	    var length = this.code.length;
	    var count = 0;
	    this.colNum = length ? 1 : 0;
	    outer:
	      while(this.index < length) {
	        if(this.cacheLine > 0 && count >= this.cacheLine) {
	          break;
	        }
	        if(this.state) {
	          this.readch();
	          // />
	          if(this.peek == '/') {
	            if(this.code.charAt(this.index) == '>') {
	              this.state = false;
	              var token = new AxmlToken_1(AxmlToken_1.MARK, this.peek + '>', this.peek + '>', this.index - 1);
	              this.dealToken(token, 2, 0, temp);
	            }
	            else {
	              this.error('unknow html token: / ');
	            }
	          }
	          else if(this.peek == '>') {
	            this.state = false;
	            var token = new AxmlToken_1(AxmlToken_1.MARK, this.peek, this.peek, this.index - 1);
	            this.dealToken(token, 1, 0, temp);
	          }
	          else {
	            for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
	              var match = matches[i];
	              if(match.match(this.peek, this.code, this.index)) {
	                var token = new AxmlToken_1(match.tokenType(), match.content(), match.val(), this.index - 1);
	                var error = match.error();
	                var matchLen = match.content().length;
	                if(error) {
	                  this.error(error, this.code.slice(this.index - matchLen, this.index));
	                }
	                var n = character.count(token.val(), character.LINE);
	                count += n;
	                this.dealToken(token, matchLen, n, temp);
	                continue outer;
	              }
	            }
	            //如果有未匹配的，说明规则不完整，抛出错误
	            this.error('unknow token');
	          }
	        }
	        else if(this.style || this.script) {
	          this.dealStSc(this.style ? 'style' : 'script', temp);
	          this.style = this.script = false;
	        }
	        else {
	          this.readch();
	          var idx = this.code.indexOf('<', this.index - 1);
	          if(idx == -1) {
	            idx = length;
	            if(this.index && idx > this.index - 1) {
	              this.addText(this.code.slice(this.index - 1, idx), temp);
	              this.index = length;
	            }
	            return this;
	          }
	          if(this.index && idx > this.index - 1) {
	            this.addText(this.code.slice(this.index - 1, idx), temp);
	            this.readch();
	          }
	          var s = this.code.slice(idx, idx + 4).toLowerCase();
	          var c1 = this.code.charAt(idx + 1);
	          var c2 = this.code.charAt(idx + 2);
	          if(s == '<!--') {
	            var end = this.code.indexOf('-->', this.index + 4);
	            if(end == -1) {
	              end = length;
	            }
	            else {
	              end += 3;
	            }
	            s = this.code.slice(idx, end);
	            var token = new AxmlToken_1(AxmlToken_1.COMMENT, s, s, this.index - 1);
	            var n = character.count(s, character.LINE);
	            this.dealToken(token, s.length, n, temp);
	          }
	          //</\w
	          else if(c1 == '/' && character.isLetter(c2)) {
	            this.state = true;
	            var token = new AxmlToken_1(AxmlToken_1.MARK, '</', '</', this.index - 1);
	            this.dealToken(token, 2, 0, temp);
	            this.readch();
	            //\w elem
	            this.dealTag(temp);
	          }
	          //<\w
	          else if(character.isLetter(c1)) {
	            this.state = true;
	            var token = new AxmlToken_1(AxmlToken_1.MARK, '<', '<', this.index - 1);
	            this.dealToken(token, 1, 0, temp);
	            this.readch();
	            //\w elem
	            this.dealTag(temp);
	          }
	          else if(c1 == '!') {
	            this.state = true;
	            var token = new AxmlToken_1(AxmlToken_1.MARK, '<', '<', this.index - 1);
	            this.dealToken(token, 1, 0, temp);
	          }
	        }
	      }
	    return this;
	  },
	  dealStSc: function(s, temp) {
	    var reg = new RegExp('^/' + s + '\\b');
	    for(var i = this.index; i < this.code.length; i++) {
	      if(this.code.charAt(i) == '<') {
	        if(reg.test(this.code.slice(i + 1, i + 8))) {
	          var s = this.code.slice(this.index, i);
	          this.addText(s, temp);
	          this.index = i;
	          return;
	        }
	      }
	    }
	    var s = this.code.slice(this.index);
	    this.index = this.code.length;
	    this.addText(s, temp);
	  },
	  addText: function(s, temp) {
	    var token = new AxmlToken_1(AxmlToken_1.TEXT, s, s, this.index - 1);
	    var n = character.count(token.val(), character.LINE);
	    this.dealToken(token, s.length, n, temp);
	  },
	  dealTag: function(temp) {
	    ELEM$3.match(this.peek, this.code, this.index);
	    var token = new AxmlToken_1(ELEM$3.tokenType(), ELEM$3.content(), ELEM$3.val(), this.index - 1);
	    var matchLen = ELEM$3.content().length;
	    this.dealToken(token, matchLen, 0, temp);
	    var s = ELEM$3.content().toLowerCase();
	    if(s == 'style') {
	      this.style = true;
	    }
	    else if(s == 'script') {
	      this.script = true;
	    }
	  }
	});
	var AxmlLexer_1 = AxmlLexer;

	var CssRule = Rule_1.extend(function() {
	  var self = this;
	  Rule_1.call(self, CssRule.KEYWORDS);

	  self.vl = {};
	  CssRule.VALUES.forEach(function(o) {
	    self.vl[o] = true;
	  });

	  self.cl = {};
	  CssRule.COLORS.forEach(function(o) {
	    self.cl[o] = true;
	  });

	  self.addMatch(new CompleteEqual_1(CssToken_1.BLANK, character.BLANK));
	  self.addMatch(new CompleteEqual_1(CssToken_1.TAB, character.TAB));
	  self.addMatch(new CompleteEqual_1(CssToken_1.LINE, character.ENTER + character.LINE));
	  self.addMatch(new CompleteEqual_1(CssToken_1.LINE, character.ENTER));
	  self.addMatch(new CompleteEqual_1(CssToken_1.LINE, character.LINE));

	  self.addMatch(new LineSearch_1(CssToken_1.COMMENT, '//', [character.ENTER + character.LINE, character.ENTER, character.LINE]));
	  self.addMatch(new LineSearch_1(CssToken_1.COMMENT, '/*', '*/', true));
	  self.addMatch(new LineParse_1(CssToken_1.STRING, '"', '"', false));
	  self.addMatch(new LineParse_1(CssToken_1.STRING, "'", "'", false));

	  self.addMatch(new RegMatch_1(CssToken_1.NUMBER, /^[+-]?\d+\.?\d*/i));
	  self.addMatch(new RegMatch_1(CssToken_1.NUMBER, /^[+-]?\.\d+/i));
	  self.addMatch(new CompleteEqual_1(CssToken_1.UNITS, '%', null, true));

	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '\\9\\0'));
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '\\0/'));
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '\\0'));
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '\\9'));
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '\\,'));
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-vx-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-hp-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-khtml-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, 'mso-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-prince-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-rim-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-ro-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-tc-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-wap-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-apple-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-atsc-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-ah-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-moz-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-webkit-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-ms-'), null, true);
	  self.addMatch(new CompleteEqual_1(CssToken_1.HACK, '-o-'), null, true);

	  self.addMatch(new RegMatch_1(CssToken_1.COLOR, /^#[\da-f]{3,6}/i));
	  self.addMatch(new RegMatch_1(CssToken_1.SELECTOR, /^\.[a-z_][\w_\-]*/i));
	  self.addMatch(new RegMatch_1(CssToken_1.SELECTOR, /^#\w[\w\-]*/i));
	  self.addMatch(new CompleteEqual_1(CssToken_1.SELECTOR, '&'));
	  self.addMatch(new RegMatch_1(CssToken_1.VARS, /^var-[\w\-]+/i));
	  self.addMatch(new RegMatch_1(CssToken_1.VARS, /^--[\w\-]+/i));
	  self.addMatch(new CompleteEqual_1(CssToken_1.KEYWORD, 'min--moz-device-pixel-ratio'));
	  self.addMatch(new CompleteEqual_1(CssToken_1.KEYWORD, 'max--moz-device-pixel-ratio'));
	  self.addMatch(new RegMatch_1(CssToken_1.ID, /^[a-z][\w\-]*/i));
	  self.addMatch(new RegMatch_1(CssToken_1.STRING, /^(\\[a-z\d]{4})+/i));
	  self.addMatch(new RegMatch_1(CssToken_1.IMPORTANT, /^!\s*important/i));
	  self.addMatch(new RegMatch_1(CssToken_1.HACK, /^![a-z]+/i));
	  self.addMatch(new RegMatch_1(CssToken_1.PSEUDO, /^::?(?:-(?:moz|webkit|ms|o)-)?[a-z]+(?:-[a-z]+)*/i));
	  ['$=', '|=', '*=', '~=', '^=', '>=', '<=', '!=', '==', '++', '--'].forEach(function(o) {
	    self.addMatch(new CompleteEqual_1(CssToken_1.SIGN, o));
	  });

	  var head = new RegMatch_1(CssToken_1.HEAD, /^@[\w-]+/);
	  head.callback = function(token) {
	    var s = token.content().toLowerCase();
	    s = s.replace(/^@(-moz-|-o-|-ms-|-webkit-|-vx-|-hp-|-khtml-|mso-|-prince-|-rim-|-ro-|-tc-|-wap-|-apple-|-atsc-|-ah-)/, '@');
	    if(!{
	      '@page': true,
	      '@import': true,
	      '@charset': true,
	      '@media': true,
	      '@font-face': true,
	      '@keyframes': true,
	      '@namespace': true,
	      '@document': true,
	      '@counter-style': true,
	      '@viewport': true,
	      '@supports': true,
	      '@region': true,
	      '@navigation': true,
	      '@footnote': true,
	      '@layout': true,
	      '@top': true,
	      '@top-left': true,
	      '@top-center': true,
	      '@top-right': true,
	      '@extend': true,
	      '@if': true,
	      '@elseif': true,
	      '@else': true,
	      '@for': true,
	      '@dir': true,
	      '@basename': true,
	      '@extname': true,
	      '@width': true,
	      '@height': true
	    }.hasOwnProperty(s)) {
	      token.type(CssToken_1.VARS);
	    }
	  };
	  self.addMatch(head);

	  self.addMatch(new RegMatch_1(CssToken_1.VARS, /^@\{[\w\-\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0966-\u096f\u0971-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7-\u09c8\u09cb-\u09ce\u09d7\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3c\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b5c-\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c58-\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1-\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82-\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18-\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772-\u1773\u1780-\u17d3\u17d7\u17dc-\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1ab0-\u1abd\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8-\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c-\u200d\u203f-\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099-\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\ua9e0-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabea\uabec-\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7]+\}/));
	  self.addMatch(new RegMatch_1(CssToken_1.VARS, /^\$[\w\-\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0966-\u096f\u0971-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7-\u09c8\u09cb-\u09ce\u09d7\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3c\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b5c-\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c58-\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1-\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82-\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18-\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772-\u1773\u1780-\u17d3\u17d7\u17dc-\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1ab0-\u1abd\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8-\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c-\u200d\u203f-\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099-\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\ua9e0-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabea\uabec-\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7]+/));
	  self.addMatch(new RegMatch_1(CssToken_1.VARS, /^\$\{[\w\-\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376-\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0966-\u096f\u0971-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7-\u09c8\u09cb-\u09ce\u09d7\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3c\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b5c-\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c58-\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1-\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82-\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18-\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772-\u1773\u1780-\u17d3\u17d7\u17dc-\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1ab0-\u1abd\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8-\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c-\u200d\u203f-\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099-\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0-\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\ua9e0-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64-\uab65\uabc0-\uabea\uabec-\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7]+\}/));

	  self.addMatch(new CharacterSet_1(CssToken_1.SIGN, '{},:();-{}><+/[]=*~.'));
	  self.addMatch(new CharacterSet_1(CssToken_1.HACK, '_`?|%'));
	}).methods({
	  values: function() {
	    return this.vl;
	  },
	  colors: function() {
	    return this.cl;
	  },
	  addValue: function(v) {
	    this.vl[v] = true;
	    return this.vl;
	  },
	  addColor: function(v) {
	    this.cl[v] = true;
	    return this.cl;
	  }
	}).statics({
	  KEYWORDS: 'handler-blocked transform-3d -replace -set-link-source -use-link-source accelerator additive-symbols align-content align-items align-self alignment-adjust alignment-baseline anchor-point animation animation-delay animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function app-region appearance ascent aspect-ratio autohiding-scrollbar azimuth backface-visibility background background-attachment background-clip background-color background-image background-origin background-origin-x background-origin-y background-position background-position-x background-position-y background-repeat background-size baseline baseline-shift behavior binding blend-mode block-progression bookmark-label bookmark-level bookmark-state bookmark-target border border-after border-after-color border-after-style border-after-width border-before border-before-color border-before-style border-before-width border-bottom border-bottom-color border-bottom-colors border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width border-clip-bottom border-clip-left border-clip-right border-clip-top border-collapse border-color border-fit border-horizontal-spacing border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-left border-left-color border-left-colors border-left-style border-left-width border-radius border-radius-bottomleft border-radius-bottomright border-radius-topleft border-radius-topright border-right border-right-color border-right-colors border-right-style border-right-width border-spacing border-start border-start-color border-start-style border-start-width border-style border-top border-top-color border-top-colors border-top-left-radius border-top-right-radius border-top-style border-top-width border-vertical-spacing border-width bottom bottom-left-radius bottom-right-radius box box-align box-decoration-break box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack box-reflect box-shadow box-sizing box-snap break-after break-before break-inside cap-height caption-side centerline chains clear clip clip-path clip-rule color color-correction color-index color-profile column-axis column-break-after column-break-before column-break-inside column-count column-fill column-gap column-progression column-rule column-rule-color column-rule-style column-rule-width column-span column-width columns content content-zoom-chaining content-zoom-limit content-zoom-limit-max content-zoom-limit-min content-zoom-snap content-zoom-snap-points content-zoom-snap-type content-zooming counter-increment counter-reset cue cue-after cue-before cursor dashboard-region definition-src descent device-aspect-ratio device-height device-pixel-ratio device-width direction display display-box display-extras display-inside display-outside dominant-baseline drop-initial-after-adjust drop-initial-after-align drop-initial-before-adjust drop-initial-before-align drop-initial-size drop-initial-value elevation empty-cells fallback fill fill-opacity fill-rule filter fit fit-position flavor flex flex-basis flex-direction flex-flow flex-grow flex-pack flex-shrink flex-wrap float float-edge float-offset flood-color flood-opacity flow-from flow-into focus-ring-color font font-color font-emphasize font-emphasize-position font-emphasize-style font-family font-feature-settings font-kerning font-language-override font-size font-size-adjust font-size-delta font-smooth font-smoothing font-stretch font-style font-synthesis font-variant font-variant-alternates font-variant-caps font-variant-east-asian font-variant-ligatures font-variant-numeric font-variant-position font-weight footnote force-broken-image-icon glyph-orientation-horizontal glyph-orientation-vertical grid grid-area grid-auto-columns grid-auto-flow grid-auto-rows grid-column grid-column-align grid-column-position grid-column-span grid-columns grid-definition-columns grid-definition-rows grid-position grid-row grid-row-align grid-row-position grid-row-span grid-rows grid-span grid-template hanging-punctuation height high-contrast high-contrast-adjust highlight horiz-align hyphenate-character hyphenate-limit-after hyphenate-limit-before hyphenate-limit-chars hyphenate-limit-last hyphenate-limit-lines hyphenate-limit-zone hyphenate-resource hyphens icon image-orientation image-rendering image-resolution images-in-menus ime-mode include-source inherit initial inline-box-align inline-flex inline-table input-format input-required interpolation-mode interpret-as justify-content justify-items justify-self kerning languages layer-background-color layer-background-image layout-flow layout-grid layout-grid-char layout-grid-char-spacing layout-grid-line layout-grid-mode layout-grid-type left letter-spacing lighting-color line-align line-box-contain line-break line-clamp line-grid line-height line-slack line-snap line-stacking line-stacking-ruby line-stacking-shift line-stacking-strategy linear-gradient link link-source list-image-1 list-image-2 list-image-3 list-style list-style-image list-style-position list-style-type locale logical-height logical-width mac-graphite-theme maemo-classic margin margin-after margin-after-collapse margin-before margin-before-collapse margin-bottom margin-bottom-collapse margin-collapse margin-end margin-left margin-right margin-start margin-top margin-top-collapse marker marker-end marker-mid marker-offset marker-start marks marquee marquee-dir marquee-direction marquee-increment marquee-loop marquee-play-count marquee-repetition marquee-speed marquee-style mask mask-attachment mask-box-image mask-box-image-outset mask-box-image-repeat mask-box-image-slice mask-box-image-source mask-box-image-width mask-clip mask-composite mask-image mask-origin mask-position mask-position-x mask-position-y mask-repeat mask-repeat-x mask-repeat-y mask-size mask-type match-nearest-mail-blockquote-color mathline max-aspect-ratio max-color max-color-index max-device-aspect-ratio max-device-height max-device-pixel-ratio max-device-width max-height max-logical-height max-logical-width max-monochrome max-resolution max-width max-zoom min-aspect-ratio min-color min-color-index min-device-aspect-ratio min-device-height min-device-pixel-ratio min-device-width min-height min-logical-height min-logical-width min-monochrome min-resolution min-width min-zoom mini-fold monochrome move-to nav-banner-image nav-bottom nav-down nav-down-shift nav-index nav-left nav-left-shift nav-right nav-right-shift nav-up nav-up-shift navbutton-* nbsp-mode negative none normal object-fit object-position oeb-column-number oeb-page-foot oeb-page-head opacity order orient orientation orphans osx-font-smoothing outline outline-color outline-offset outline-radius outline-radius-bottomleft outline-radius-bottomright outline-radius-topleft outline-radius-topright outline-style outline-width overflow overflow-scrolling overflow-style overflow-x overflow-y pad padding padding-bottom padding-left padding-right padding-top page page-break-after page-break-before page-break-inside page-policy panose-1 pause pause-after pause-before perspective perspective-origin perspective-origin-x perspective-origin-y phonemes pitch pitch-range play-during pointer-events position prefix presentation-level print-color-adjust progress-appearance property-name punctuation-trim punctuation-wrap quotes radial-gradient range region-break-after region-break-before region-break-inside region-overflow rendering-intent replace resize resolution rest rest-after rest-before richness right rotation-point row-span rtl-ordering ruby-align ruby-overhang ruby-position ruby-span scan script-level script-min-size script-size-multiplier scroll-chaining scroll-limit scroll-limit-x-max scroll-limit-x-min scroll-limit-y-max scroll-limit-y-min scroll-rails scroll-snap-points-x scroll-snap-points-y scroll-snap-type scroll-snap-x scroll-snap-y scroll-translation scrollbar-3d-light-color scrollbar-3dlight-color scrollbar-arrow-color scrollbar-base-color scrollbar-dark-shadow-color scrollbar-darkshadow-color scrollbar-end-backward scrollbar-end-forward scrollbar-face-color scrollbar-highlight-color scrollbar-shadow-color scrollbar-start-backward scrollbar-start-forward scrollbar-thumb-proportional scrollbar-track-color separator-image set-link-source shape-image-threshold shape-inside shape-margin shape-outside shape-padding shape-rendering size slope speak speak-as speak-header speak-numeral speak-punctuation speech-rate src stack-sizing stemh stemv stop-color stop-opacity stress string-set stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width suffix svg-shadow symbols system tab-size tab-stops table-baseline table-border-color-dark table-border-color-light table-layout tap-highlight-color target target-name target-new target-position text-align text-align-last text-anchor text-autospace text-blink text-combine text-combine-horizontal text-decoration text-decoration-color text-decoration-line text-decoration-skip text-decoration-style text-decorations-in-effect text-effect text-emphasis text-emphasis-color text-emphasis-position text-emphasis-skip text-emphasis-style text-fill-color text-fit text-height text-indent text-justify text-justify-trim text-kashida text-kashida-space text-line-through text-orientation text-outline text-overflow text-rendering text-security text-shadow text-size-adjust text-space-collapse text-spacing text-stroke text-stroke-color text-stroke-width text-transform text-trim text-underline text-underline-color text-underline-position text-underline-style text-wrap top top-bar-button top-left-radius top-right-radius touch-action touch-callout touch-enabled transform transform-origin transform-origin-x transform-origin-y transform-origin-z transform-style transition transition-delay transition-duration transition-property transition-repeat-count transition-timing-function unicode-bidi unicode-range units-per-em use-link-source user-drag user-focus user-input user-modify user-select user-zoom vector-effect version vertical-align viewport visibility voice-balance voice-duration voice-family voice-pitch voice-pitch-range voice-range voice-rate voice-stress voice-volume volume white-space widows width widths will-change window-shadow windows-classic windows-compositor windows-default-theme word-break word-spacing word-wrap wrap wrap-flow wrap-margin wrap-padding wrap-through writing-mode x-height z-index zoom'.split(' '),
	  VALUES: 'domain regexp farthest-corner closest-side closest-corner farthest-side above absolute additive all alpha alphabetic always and antialiased aqua armenian attr aural auto avoid background baseline behind below bicubic bidi-override black blink block blue bold bolder border-box both bottom braille break-all break-word calc canvas capitalize caption center center-left center-right circle cjk-decimal cjk-ideographic close-quote code collapse color compact condensed contain content-box continuous counter counters cover crop cross cross-fade crosshair cubic-bezier cursive cycle cyclic dashed decimal decimal-leading-zero default device-cmyk digits disabled disc disclosure-closed disclosure-open dotted double e-resize ease ease-in ease-in-out ease-out element embed embossed enabled expanded extra-condensed extra-expanded false fantasy far-left far-right fast faster fixed flipouttobottom flipouttoleft flipouttoright flipouttotop format fuchsia georgian gray grayscale green groove handheld hebrew help hidden hide high higher hiragana hiragana-iroha hsl hsla icon image image-rect image-region infinite inherit inline inline-block inline-table inset inside inter-ideograph invert italic japanese-formal japanese-informal justify katakana katakana-iroha korean-hangul-formal korean-hanja-formal korean-hanja-informal landscape large larger leader left-side leftwards level lighter lime line-through linear linear-gradient list-item local loud low lower lower-alpha lower-greek lower-latin lower-roman lowercase ltr marker maroon medium message-box middle min max mix move n-resize narrower navy ne-resize no-close-quote no-open-quote no-repeat none normal not nowrap numeric nw-resize oblique olive once only opacity open-quote outset outside overline padding-box pending perspective pointer portrait pre print projection purple rebeccapurple rect red relative repeat repeat-x repeat-y repeating-linear-gradient repeating-radial-gradient rgb rgba ridge right right-side rightwards rotate rotate3d rotate3D rotateX rotateY rotateZ round rounddown roundup rtl run-in running s-resize scale scale3D scale3d scaleX scaleY scaleZ screen scroll se-resize semi-condensed semi-expanded separate show silent silver simp-chinese-formal simp-chinese-informal skew skew3D skewX skewY skewZ slow slower small small-caps small-caption smaller soft solid space speech spell-out square static status-bar steps string sub super sw-resize symbolic symbols table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group target-counter target-counters target-pull target-text teal text text-bottom text-top thick thin toggle top trad-chinese-formal trad-chinese-informal translate translate3d translate3D translateX translateY translateZ true tty tv ultra-condensed ultra-expanded underline upper-alpha upper-latin upper-roman uppercase url url-prefix var visible w-resize wait white wider width x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow'.split(' '),
	  COLORS: 'transparent activeborder aliceblue antiquewhite appworkspace aqua aqua aquamarine azure beige bisque black black blanchedalmond blue blue blueviolet brown burlywood buttonface buttonshadow cadetblue captiontext chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia fuchsia gainsboro ghostwhite gold goldenrod gray gray green green greenyellow grey highlight honeydew hotpink inactiveborder inactivecaptiontext indianred indigo infotext ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime lime limegreen linen magenta maroon maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred menutext midnightblue mintcream mistyrose moccasin navajowhite navy navy oldlace olive olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple purple red red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal teal thistle threeddarkshadow threedhighlight threedshadow tomato turquoise violet wheat white white whitesmoke windowframe yellow yellow yellowgreen'.split(' '),
	  addKeyWord: function(kw) {
	    if(Array.isArray(kw)) {
	      CssRule.KEYWORDS = CssRule.KEYWORDS.concat(kw);
	    }
	    else {
	      CssRule.KEYWORDS.push(kw.trim());
	    }
	  },
	  addValue: function(v) {
	    if(Array.isArray(v)) {
	      CssRule.VALUES = CssRule.VALUES.concat(v);
	    }
	    else {
	      CssRule.VALUES.push(v.trim());
	    }
	  },
	  addColor: function(v) {
	    if(Array.isArray(v)) {
	      CssRule.COLORS = CssRule.COLORS.concat(v);
	    }
	    else {
	      CssRule.COLORS.push(v.trim());
	    }
	  }
	});
	var CssRule_1 = CssRule;

	var JavaRule = Rule_1.extend(function() {
	    var self = this;
	    Rule_1.call(self, JavaRule.KEYWORDS);
	    
	    self.addMatch(new LineSearch_1(Token_1.COMMENT, '//', '\n'));
	    self.addMatch(new LineSearch_1(Token_1.COMMENT, '/*', '*/', true));
	    self.addMatch(new LineParse_1(Token_1.STRING, '"', '"'));
	    self.addMatch(new LineParse_1(Token_1.STRING, "'", "'"));
	    self.addMatch(new RegMatch_1(Token_1.ID, /^[a-zA-Z_]\w*/));
	    self.addMatch(new RegMatch_1(Token_1.ANNOT, /^@\w+/));

	    ['~', '!', '%', '^', '&&', '&', '*', '(', ')', '--', '-', '++', '+', '===', '==', '=', '!==', '!=', '[', ']', '{', '}', '||', '|', '\\', '<<<', '>>>', '<<', '>>', '<', '>', '>=', '<=', ',', '...', '.', '?:', '?', ':', ';', '/'].forEach(function(o) {
	      self.addMatch(new CompleteEqual_1(Token_1.SIGN, o));
	    });
	  }).statics({
	    KEYWORDS: 'if else for break case continue function true false switch default do while int float double long throws transient abstract assert boolean byte class const enum instanceof try volatilechar extends final finally goto implements import protected return void char interface native new package private protected throw short public return strictfp super synchronized this static null String'.split(' ')
	  });
	var JavaRule_1 = JavaRule;

	var CRule = Rule_1.extend(function() {
	    var self = this;
	    Rule_1.call(self, CRule.KEYWORDS);
	    
	    self.addMatch(new LineSearch_1(Token_1.COMMENT, '//', '\n'));
	    self.addMatch(new LineSearch_1(Token_1.COMMENT, '/*', '*/', true));
	    self.addMatch(new LineParse_1(Token_1.STRING, '"', '"'));
	    self.addMatch(new LineParse_1(Token_1.STRING, "'", "'"));
	    self.addMatch(new RegMatch_1(Token_1.ID, /^[a-zA-Z_]\w*/));
	    self.addMatch(new RegMatch_1(Token_1.HEAD, /^#\w+/));

	    ['~', '!', '%', '^', '&&', '&', '*', '(', ')', '--', '-', '++', '+', '===', '==', '=', '!==', '!=', '[', ']', '{', '}', '||', '|', '\\', '<<<', '>>>', '<<', '>>', '<', '>', '>=', '<=', ',', '...', '.', '?:', '?', ':', ';', '/'].forEach(function(o) {
	      self.addMatch(new CompleteEqual_1(Token_1.SIGN, o));
	    });
	  }).statics({
	    KEYWORDS: 'if else for break case continue function true false switch default do while int float double long const_cast private short char return void static null whcar_t volatile  uuid explicit extern class const __finally __exception __try virtual using signed namespace new public protected __declspec delete unsigned friend goto inline mutable deprecated dllexport dllimport dynamic_cast enum union bool naked typeid noinline noreturn nothrow register this reinterpret_cast selectany sizeof static_cast struct template thread throw try typedef typename'.split(' ')
	  });
	var CRule_1 = CRule;

	var HtmlRule = Rule_1.extend(function() {
	  var self = this;
	  Rule_1.call(self, HtmlRule.KEYWORDS);

	  self.addMatch(new CompleteEqual_1(HtmlToken_1.BLANK, character.BLANK));
	  self.addMatch(new CompleteEqual_1(HtmlToken_1.TAB, character.TAB));
	  self.addMatch(new CompleteEqual_1(HtmlToken_1.LINE, character.ENTER + character.LINE));
	  self.addMatch(new CompleteEqual_1(HtmlToken_1.LINE, character.ENTER));
	  self.addMatch(new CompleteEqual_1(HtmlToken_1.LINE, character.LINE));

	  self.addMatch(new CompleteEqual_1(HtmlToken_1.DOC, '!DOCTYPE', null, true));
	  self.addMatch(new LineSearch_1(HtmlToken_1.STRING, '"', '"', true));
	  self.addMatch(new LineSearch_1(HtmlToken_1.STRING, "'", "'", true));
	  self.addMatch(new CompleteEqual_1(HtmlToken_1.SIGN, '=', null, true));
	  self.addMatch(new RegMatch_1(HtmlToken_1.NUMBER, /^\d+/));
	  self.addMatch(new RegMatch_1(HtmlToken_1.PROPERTY, /^[a-z]+(-\w+)*/i));
	}).statics({
	  KEYWORDS: 'doctype a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command datalist dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'.split(' ')
	});
	var HtmlRule_1 = HtmlRule;

	var AxmlRule = Rule_1.extend(function() {
	  var self = this;
	  Rule_1.call(self, AxmlRule.KEYWORDS);

	  self.addMatch(new CompleteEqual_1(AxmlToken_1.BLANK, character.BLANK));
	  self.addMatch(new CompleteEqual_1(AxmlToken_1.TAB, character.TAB));
	  self.addMatch(new CompleteEqual_1(AxmlToken_1.LINE, character.ENTER + character.LINE));
	  self.addMatch(new CompleteEqual_1(AxmlToken_1.LINE, character.ENTER));
	  self.addMatch(new CompleteEqual_1(AxmlToken_1.LINE, character.LINE));

	  self.addMatch(new CompleteEqual_1(AxmlToken_1.DOC, '!DOCTYPE', null, true));
	  self.addMatch(new LineSearch_1(AxmlToken_1.STRING, '"', '"', true));
	  self.addMatch(new LineSearch_1(AxmlToken_1.STRING, "'", "'", true));
	  self.addMatch(new CompleteEqual_1(AxmlToken_1.SIGN, '=', null, true));
	  self.addMatch(new RegMatch_1(AxmlToken_1.NUMBER, /^\d+/));
	  self.addMatch(new RegMatch_1(AxmlToken_1.PROPERTY, /^[a-z]+:[a-z]+/i));
	  self.addMatch(new RegMatch_1(AxmlToken_1.PROPERTY, /^[a-z]+(-\w+)*/i));
	}).statics({
	  KEYWORDS: []
	});
	var AxmlRule_1 = AxmlRule;

	var Parser = Class(function(lexer) {
	  this.lexer = lexer;
	  this.tree =  {};
	  this.ignores = {};
	  return this;
	}).methods({
	  parse: function(code) {
	    return this.tree;
	  },
	  ast: function(plainObject) {
	    if(plainObject) {
	      return walk.plainObject(this.tree);
	    }
	    return this.tree;
	  },
	  ignore: function() {
	    return this.ignores;
	  }
	});
	var Parser_1 = Parser;

	var nid = 0;
	var Node = Class(function(type, children) {
	  this.type = type;
	  if(type == Node.TOKEN) {
	    this.children = children;
	  }
	  else if(Array.isArray(children)) {
	    this.children = children;
	  }
	  else {
	    this.children = children ? [children] : [];
	  }
	  this.p = null;
	  this.pr = null;
	  this.ne = null;
	  this.id = nid++;
	  return this;
	}).methods({
	  nid: function() {
	    return this.id;
	  },
	  name: function(t) {
	    if(!character.isUndefined(t)) {
	      this.type = t;
	    }
	    return this.type;
	  },
	  leaves: function() {
	    return this.children;
	  },
	  leaf: function(i) {
	    return this.children[i];
	  },
	  size: function() {
	    return this.children.length;
	  },
	  first: function() {
	    return this.leaf(0);
	  },
	  last: function() {
	    return this.leaf(this.size() - 1);
	  },
	  isEmpty: function() {
	    return this.size() === 0;
	  },
	  add: function() {
	    var self = this;
	    var args = Array.prototype.slice.call(arguments, 0);
	    args.forEach(function(node) {
	      if(Array.isArray(node)) {
	        node.forEach(function(node2) {
	          node2.parent(self);
	          var last = self.children[self.children.length - 1];
	          if(last) {
	            last.next(node2);
	            node2.prev(last);
	          }
	          self.children.push(node2);
	        });
	      }
	      else {
	        node.parent(self);
	        var last = self.children[self.children.length - 1];
	        if(last) {
	          last.next(node);
	          node.prev(last);
	        }
	        self.children.push(node);
	      }
	    });
	    return self;
	  },
	  addFirst: function() {
	    var self = this;
	    var args = Array.prototype.slice.call(arguments, 0);
	    args.forEach(function(node) {
	      if(Array.isArray(node)) {
	        node.forEach(function(node2) {
	          node2.parent(self);
	          var last = self.children[0];
	          if(last) {
	            last.next(node2);
	            node2.prev(last);
	          }
	          self.children.unshift(node2);
	        });
	      }
	      else {
	        node.parent(self);
	        var last = self.children[0];
	        if(last) {
	          last.next(node);
	          node.prev(last);
	        }
	        self.children.unshift(node);
	      }
	    });
	    return self;
	  },
	  token: function() {
	    return this.children;
	  },
	  parent: function(p) {
	    if(p) {
	      this.p = p;
	    }
	    return this.p;
	  },
	  prev: function(pr) {
	    if(pr) {
	      this.pr = pr;
	    }
	    return this.pr;
	  },
	  next: function(ne) {
	    if(ne) {
	      this.ne = ne;
	    }
	    return this.ne;
	  },
	  isToken: function() {
	    return this.type == Node.TOKEN;
	  },
	  toString: function() {
	    return this.name();
	  }
	}).statics({
	  TOKEN: 'token'
	});
	var Node_1 = Node;

	var Node$1 = Node_1.extend(function(type, children) {
	  Node_1.call(this, type, children);
	  return this;
	}).statics({
	  PROGRAM: 'program',
	  ELEM: 'elem',
	  VARSTMT: 'varstmt',
	  VARDECL: 'vardecl',
	  FNBODY: 'fnbody',
	  BLOCK: 'block',
	  ITERSTMT: 'iterstmt',
	  FNPARAMS: 'fnparams',
	  EXPR: 'expr',
	  PROGRAM: 'program',
	  STMT: 'stmt',
	  ASSIGN: 'assign',
	  EMPTSTMT: 'emptstmt',
	  IFSTMT: 'ifstmt',
	  CNTNSTMT: 'cntnstmt',
	  BRKSTMT: 'brkstmt',
	  RETSTMT: 'retstmt',
	  WITHSTMT: 'withstmt',
	  SWCHSTMT: 'swchstmt',
	  CASEBLOCK: 'caseblock',
	  CASECLAUSE: 'caseclause',
	  DFTCLAUSE: 'dftclause',
	  LABSTMT: 'labstmt',
	  THRSTMT: 'thrstmt',
	  TRYSTMT: 'trystmt',
	  DEBSTMT: 'debstmt',
	  EXPRSTMT: 'exprstmt',
	  CACH: 'cach',
	  FINL: 'finl',
	  FNDECL: 'fndecl',
	  FNEXPR: 'fnexpr',
	  ASSIGNEXPR: 'assignexpr',
	  CNDTEXPR: 'cndtexpr',
	  LOGOREXPR: 'logorexpr',
	  LOGANDEXPR: 'logandexpr',
	  BITOREXPR: 'bitorexpr',
	  BITANDEXPR: 'bitandexpr',
	  BITXOREXPR: 'bitxorexpr',
	  EQEXPR: 'eqexpr',
	  RELTEXPR: 'reltexpr',
	  SHIFTEXPR: 'shiftexpr',
	  ADDEXPR: 'addexpr',
	  MTPLEXPR: 'mtplexpr',
	  UNARYEXPR: 'unaryexpr',
	  MMBEXPR: 'mmbexpr',
	  PRMREXPR: 'prmrexpr',
	  ARRLTR: 'arrltr',
	  OBJLTR: 'objltr',
	  PROPTASSIGN: 'proptassign',
	  ARGS: 'args',
	  ARGLIST: 'arglist',
	  POSTFIXEXPR: 'postfixexpr',
	  NEWEXPR: 'newexpr',
	  CALLEXPR: 'callexpr',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys) {
	      var self = this;
	      keys = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys[v] = k;
	      });
	    }
	    return keys[s];
	  }
	});
	var keys;
	var Node_1$1 = Node$1;

	var S$1 = {};
	S$1[Token_1.BLANK] = S$1[Token_1.TAB] = S$1[Token_1.COMMENT] = S$1[Token_1.LINE] = S$1[Token_1.ENTER] = true;
	var NOASSIGN = {};
	NOASSIGN[Node_1$1.CNDTEXPR]
	  = NOASSIGN[Node_1$1.LOGOREXPR]
	  = NOASSIGN[Node_1$1.LOGANDEXPR]
	  = NOASSIGN[Node_1$1.BITOREXPR]
	  = NOASSIGN[Node_1$1.BITXOREXPR]
	  = NOASSIGN[Node_1$1.BITANDEXPR]
	  = NOASSIGN[Node_1$1.EQEXPR]
	  = NOASSIGN[Node_1$1.RELTEXPR]
	  = NOASSIGN[Node_1$1.SHIFTEXPR]
	  = NOASSIGN[Node_1$1.ADDEXPR]
	  = NOASSIGN[Node_1$1.MTPLEXPR]
	  = NOASSIGN[Node_1$1.UNARYEXPR]
	  = NOASSIGN[Node_1$1.POSTFIXEXPR]
	  = true;
	var Parser$1 = Parser_1.extend(function(lexer) {
	  Parser_1.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  parse: function(code) {
	    this.lexer.parse(code);
	    this.tree = this.program();
	    return this.tree;
	  },
	  init: function(lexer) {
	    this.look = null;
	    this.tokens = null;
	    this.lastLine = 1;
	    this.lastCol = 1;
	    this.line = 1;
	    this.col = 1;
	    this.index = 0;
	    this.length = 0;
	    this.ignores = {};
	    this.hasMoveLine = false;
	    this.tree = {};
	    if(lexer) {
	      this.lexer = lexer;
	    }
	    else if(this.lexer) {
	      this.lexer.init();
	    }
	    else {
	      this.lexer = new Lexer_1(new EcmascriptRule_1());
	    }
	  },
	  program: function() {
	    this.tokens = this.lexer.tokens();
	    this.length = this.tokens.length;
	    if(this.tokens.length) {
	      this.move();
	    }
	    var node = new Node_1$1(Node_1$1.PROGRAM);
	    while(this.look) {
	      node.add(this.element());
	    }
	    return node;
	  },
	  element: function() {
	    if(this.look.content() == 'function') {
	      return this.fndecl();
	    }
	    else {
	      return this.stmt();
	    }
	  },
	  stmt: function() {
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content()) {
	      case 'var':
	        return this.varstmt();
	      case '{':
	        return this.block();
	      case ';':
	        return this.emptstmt();
	      case 'if':
	        return this.ifstmt();
	      case 'do':
	      case 'while':
	      case 'for':
	        return this.iterstmt();
	      case 'continue':
	        return this.cntnstmt();
	      case 'break':
	        return this.brkstmt();
	      case 'return':
	        return this.retstmt();
	      case 'with':
	        return this.withstmt();
	      case 'switch':
	        return this.swchstmt();
	      case 'throw':
	        return this.thrstmt();
	      case 'try':
	        return this.trystmt();
	      case 'debugger':
	        return this.debstmt();
	      default:
	        if(this.look.type() == Token_1.ID) {
	          for(var i = this.index; i < this.length; i++) {
	            var token = this.tokens[i];
	            if(!S$1[token.type()]) {
	              if(token.content() == ':') {
	                return this.labstmt();
	              }
	              else {
	                return this.exprstmt();
	              }
	            }
	          }
	        }
	        return this.exprstmt();
	    }
	  },
	  exprstmt: function() {
	    var node = new Node_1$1(Node_1$1.EXPRSTMT);
	    node.add(this.expr(), this.match(';'));
	    return node;
	  },
	  varstmt: function(noSem) {
	    var node = new Node_1$1(Node_1$1.VARSTMT);
	    node.add(
	      this.match('var'),
	      this.vardecl()
	    );
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.vardecl()
	      );
	    }
	    if(!noSem) {
	      node.add(this.match(';'));
	    }
	    return node;
	  },
	  vardecl: function() {
	    var node = new Node_1$1(Node_1$1.VARDECL);
	    if(!this.look) {
	      this.error('missing variable name');
	    }
	    node.add(this.match(Token_1.ID, 'missing variable name'));
	    if(this.look && this.look.content() == '=') {
	      node.add(this.assign());
	    }
	    return node;
	  },
	  assign: function() {
	    var node = new Node_1$1(Node_1$1.ASSIGN);
	    node.add(this.match('='));
	    if(!this.look) {
	      this.error();
	    }
	    node.add(this.assignexpr());
	    return node;
	  },
	  block: function() {
	    var node = new Node_1$1(Node_1$1.BLOCK);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      node.add(this.stmt());
	    }
	    node.add(this.match('}', 'missing } in compound statement'));
	    return node;
	  },
	  emptstmt: function() {
	    var node = new Node_1$1(Node_1$1.EMPTSTMT);
	    node.add(this.match(';'));
	    return node;
	  },
	  ifstmt: function() {
	    var node = new Node_1$1(Node_1$1.IFSTMT);
	    node.add(
	      this.match('if'),
	      this.match('('),
	      this.expr(),
	      this.match(')'),
	      this.stmt()
	    );
	    if(this.look && this.look.content() == 'else') {
	      node.add(
	        this.match('else'),
	        this.stmt()
	      );
	    }
	    return node;
	  },
	  iterstmt: function() {
	    var node = new Node_1$1(Node_1$1.ITERSTMT);
	    switch(this.look.content()) {
	      case 'do':
	        node.add(
	          this.match(),
	          this.stmt(),
	          this.match('while'),
	          this.match('('),
	          this.expr(),
	          this.match(')'),
	          this.match(';')
	        );
	      break;
	      case 'while':
	        node.add(
	          this.match(),
	          this.match('('),
	          this.expr(),
	          this.match(')'),
	          this.stmt()
	        );
	      break;
	      case 'for':
	        node.add(
	          this.match(),
	          this.match('(')
	        );
	        if(!this.look) {
	          this.error();
	        }
	        //当前是var/let/const的话，LL3确定是for(var vardecllist;或for(var vardecl in
	        if(this.look.content() == 'var') {
	          var node2 = this.varstmt(true);
	          if(!this.look) {
	            this.error('missing ; after for-loop initializer');
	          }
	          if(this.look.content() == 'in') {
	            if(node2.size() > 2) {
	              this.error('invalid for/in left-hand side');
	            }
	            node.add(node2);
	            node.add(
	              this.match(),
	              this.expr()
	            );
	          }
	          else {
	            node.add(node2);
	            node.add(this.match(';'));
	            if(this.look.content() != ';') {
	              node.add(this.expr());
	            }
	            node.add(this.match(';'));
	            if(!this.look) {
	              this.error();
	            }
	            if(this.look.content() != ')') {
	              node.add(this.expr());
	            }
	          }
	        }
	        else {
	          if(this.look.content() == 'in') {
	            this.error();
	          }
	          //for(EXPRnoin;) or for(leftexpr in
	          var expr;
	          if(this.look.content() != ';') {
	            expr = this.expr(true);
	            node.add(expr);
	          }
	          if(!this.look) {
	            this.error('missing ;');
	          }
	          if(this.look.content() == 'in') {
	            if(expr.name() == Node_1$1.MMBEXPR
	              || expr.name() == Node_1$1.PRMREXPR
	              || expr.name() == Node_1$1.NEWEXPR) {
	              node.add(
	                this.match(),
	                this.expr()
	              );
	            }
	            else {
	              this.error('invalid for/in left-hand side');
	            }
	          }
	          else {
	            //for的;不能省略，强制判断
	            node.add(this.match(';', 'missing ;'));
	            if(!this.look) {
	              this.error();
	            }
	            if(this.look.content() != ';') {
	              node.add(this.expr());
	            }
	            node.add(this.match(';', 'missing ;'));
	            if(!this.look) {
	              this.error();
	            }
	            if(this.look.content() != ')') {
	              node.add(this.expr());
	            }
	          }
	        }
	        node.add(this.match(')'));
	        node.add(this.stmt());
	    }
	    return node;
	  },
	  cntnstmt: function() {
	    var node = new Node_1$1(Node_1$1.CNTNSTMT);
	    node.add(this.match('continue', true));
	    if(this.look && this.look.type() == Token_1.ID) {
	      node.add(this.match());
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  brkstmt: function() {
	    var node = new Node_1$1(Node_1$1.BRKSTMT);
	    node.add(this.match('break', true));
	    if(this.look && this.look.type() == Token_1.ID) {
	      node.add(this.match());
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  retstmt: function() {
	    var node = new Node_1$1(Node_1$1.RETSTMT);
	    node.add(this.match('return', true));
	    //return后换行视作省略;，包括多行注释的换行
	    if(this.look) {
	      if(this.look.content() == ';'
	        || this.look.content() == '}'
	        || this.look.type() == Token_1.LINE
	        || this.look.type() == Token_1.COMMENT) {
	        node.add(this.match(';'));
	      }
	      else {
	        node.add(this.expr(), this.match(';'));
	      }
	    }
	    else {
	      node.add(this.match(';'));
	    }
	    return node;
	  },
	  withstmt: function() {
	    var node = new Node_1$1(Node_1$1.WITHSTMT);
	    node.add(
	      this.match('with'),
	      this.match('('),
	      this.expr(),
	      this.match(')'),
	      this.stmt()
	    );
	    return node;
	  },
	  swchstmt: function() {
	    var node = new Node_1$1(Node_1$1.SWCHSTMT);
	    node.add(
	      this.match('switch'),
	      this.match('('),
	      this.expr(),
	      this.match(')'),
	      this.caseblock()
	    );
	    return node;
	  },
	  caseblock: function() {
	    var node = new Node_1$1(Node_1$1.CASEBLOCK);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      if(this.look.content() == 'case') {
	        node.add(this.caseclause());
	      }
	      else if(this.look.content() == 'default') {
	        node.add(this.dftclause());
	      }
	      else {
	        this.error('invalid switch statement');
	      }
	    }
	    node.add(this.match('}'));
	    return node;
	  },
	  caseclause: function() {
	    var node = new Node_1$1(Node_1$1.CASECLAUSE);
	    node.add(
	      this.match('case'),
	      this.expr(),
	      this.match(':')
	    );
	    while(this.look
	      && this.look.content() != 'case'
	      && this.look.content() != 'default'
	      && this.look.content() != '}') {
	      node.add(this.stmt());
	    }
	    return node;
	  },
	  dftclause: function() {
	    var node = new Node_1$1(Node_1$1.DFTCLAUSE);
	    node.add(
	      this.match('default'),
	      this.match(':')
	    );
	    while(this.look && this.look.content() == 'case') {
	      node.add(
	        this.match('case'),
	        this.expr(),
	        this.match(':')
	      );
	    }
	    while(this.look && this.look.content() != '}') {
	      node.add(this.stmt());
	    }
	    return node;
	  },
	  labstmt: function() {
	    var node = new Node_1$1(Node_1$1.LABSTMT);
	    node.add(
	      this.match(Token_1.ID),
	      this.match(':'),
	      this.stmt()
	    );
	    return node;
	  },
	  thrstmt: function() {
	    var node = new Node_1$1(Node_1$1.THRSTMT);
	    node.add(
	      this.match('throw', true),
	      this.expr(),
	      this.match(';')
	    );
	    return node;
	  },
	  trystmt: function() {
	    var node = new Node_1$1(Node_1$1.TRYSTMT);
	    node.add(
	      this.match('try'),
	      this.block()
	    );
	    if(this.look && this.look.content() == 'catch') {
	      node.add(this.cach());
	      if(this.look && this.look.content() == 'finally') {
	        node.add(this.finl());
	      }
	    }
	    else {
	      node.add(this.finl());
	    }
	    return node;
	  },
	  debstmt: function() {
	    var node = new Node_1$1(Node_1$1.DEBSTMT);
	    node.add(this.match('debugger'), this.match(';'));
	    return node;
	  },
	  cach: function() {
	    var node = new Node_1$1(Node_1$1.CACH);
	    node.add(
	      this.match('catch'),
	      this.match('('),
	      this.match(Token_1.ID, 'missing identifier in catch'),
	      this.match(')'),
	      this.block()
	    );
	    return node;
	  },
	  finl: function() {
	    var node = new Node_1$1(Node_1$1.FINL);
	    node.add(
	      this.match('finally'),
	      this.block()
	    );
	    return node;
	  },
	  fndecl: function() {
	    var node = new Node_1$1(Node_1$1.FNDECL);
	    node.add(
	      this.match('function'),
	      this.match(Token_1.ID, 'function statement requires a name'),
	      this.match('(')
	    );
	    if(!this.look) {
	      this.error('missing formal parameter');
	    }
	    if(this.look.content() != ')') {
	      node.add(this.fnparams());
	    }
	    node.add(
	      this.match(')'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}')
	    );
	    return node;
	  },
	  fnexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.FNEXPR);
	    node.add(this.match('function'));
	    if(!this.look) {
	      this.error('missing formal parameter');
	    }
	    if(this.look.type() == Token_1.ID) {
	      if(noIn && this.look.content() == 'in') {
	        this.error();
	      }
	      node.add(this.match());
	    }
	    node.add(this.match('('));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() != ')') {
	      node.add(this.fnparams());
	    }
	    node.add(
	      this.match(')'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}', 'missing } in compound statement')
	    );
	    return node;
	  },
	  fnparams: function() {
	    var node = new Node_1$1(Node_1$1.FNPARAMS);
	    while(this.look) {
	      node.add(this.match(Token_1.ID, 'missing formal parameter'));
	      if(this.look) {
	        if(this.look.content() == ',') {
	          node.add(this.match());
	        }
	        else if(this.look.content() == ')') {
	          break;
	        }
	      }
	    }
	    return node;
	  },
	  fnbody: function() {
	    var node = new Node_1$1(Node_1$1.FNBODY);
	    while(this.look && this.look.content() != '}') {
	      node.add(this.element());
	    }
	    return node;
	  },
	  expr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.EXPR),
	      assignexpr = this.assignexpr(noIn);
	    if(this.look && this.look.content() == ',') {
	      node.add(assignexpr);
	      while(this.look && this.look.content() == ',') {
	        node.add(this.match(), this.assignexpr(noIn));
	      }
	    }
	    else {
	      return assignexpr;
	    }
	    return node;
	  },
	  assignexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.ASSIGNEXPR);
	    var cndt = this.cndtexpr(noIn);
	    if(this.look && {
	      '*=': true,
	      '/=': true,
	      '%=': true,
	      '+=': true,
	      '-=': true,
	      '<<=': true,
	      '>>=': true,
	      '>>>=': true,
	      '&=': true,
	      '^=': true,
	      '|=': true,
	      '=': true
	    }.hasOwnProperty(this.look.content()) && !NOASSIGN.hasOwnProperty(cndt.name())) {
	      node.add(cndt, this.match(), this.assignexpr(noIn));
	    }
	    else {
	      return cndt;
	    }
	    return node;
	  },
	  cndtexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.CNDTEXPR),
	      logorexpr = this.logorexpr(noIn);
	    if(this.look && this.look.content() == '?') {
	      node.add(
	        logorexpr,
	        this.match(),
	        this.assignexpr(noIn),
	        this.match(':'),
	        this.assignexpr(noIn)
	      );
	    }
	    else {
	      return logorexpr;
	    }
	    return node;
	  },
	  logorexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.LOGOREXPR),
	      logandexpr = this.logandexpr(noIn);
	    if(this.look && this.look.content() == '||') {
	      node.add(logandexpr);
	      while(this.look && this.look.content() == '||') {
	        node.add(
	          this.match(),
	          this.logandexpr(noIn)
	        );
	      }
	    }
	    else {
	      return logandexpr;
	    }
	    return node;
	  },
	  logandexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.LOGANDEXPR),
	      bitorexpr = this.bitorexpr(noIn);
	    if(this.look && this.look.content() == '&&') {
	      node.add(bitorexpr);
	      while(this.look && this.look.content() == '&&') {
	        node.add(
	          this.match(),
	          this.bitorexpr(noIn)
	        );
	      }
	    }
	    else {
	      return bitorexpr;
	    }
	    return node;
	  },
	  bitorexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.BITOREXPR),
	      bitxorexpr = this.bitxorexpr(noIn);
	    if(this.look && this.look.content() == '|') {
	      node.add(bitxorexpr);
	      while(this.look && this.look.content() == '|') {
	        node.add(
	          this.match(),
	          this.bitxorexpr(noIn)
	        );
	      }
	    }
	    else {
	      return bitxorexpr;
	    }
	    return node;
	  },
	  bitxorexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.BITXOREXPR),
	      bitandexpr = this.bitandexpr(noIn);
	    if(this.look && this.look.content() == '^') {
	      node.add(bitandexpr);
	      while(this.look && this.look.content() == '^') {
	        node.add(
	          this.match(),
	          this.bitandexpr(noIn)
	        );
	      }
	    }
	    else {
	      return bitandexpr;
	    }
	    return node;
	  },
	  bitandexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.BITANDEXPR),
	      eqexpr = this.eqexpr(noIn);
	    if(this.look && this.look.content() == '&') {
	      node.add(eqexpr);
	      while(this.look && this.look.content() == '&') {
	        node.add(
	          this.match(),
	          this.eqexpr(noIn)
	        );
	      }
	    }
	    else {
	      return eqexpr;
	    }
	    return node;
	  },
	  eqexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.EQEXPR),
	      reltexpr = this.reltexpr(noIn);
	    if(this.look && {
	      '==': true,
	      '===': true,
	      '!==': true,
	      '!=': true
	    }.hasOwnProperty(this.look.content())) {
	      node.add(reltexpr);
	      while(this.look && {
	        '==': true,
	        '===': true,
	        '!==': true,
	        '!=': true
	      }.hasOwnProperty(this.look.content())) {
	        node.add(
	          this.match(),
	          this.reltexpr(noIn)
	        );
	      }
	    }
	    else {
	      return reltexpr;
	    }
	    return node;
	  },
	  reltexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.RELTEXPR),
	      shiftexpr = this.shiftexpr(noIn);
	    if(this.look && ({
	      '<': true,
	      '>': true,
	      '>=': true,
	      '<=': true,
	      'instanceof': true
	    }.hasOwnProperty(this.look.content()) || (!noIn && this.look.content() == 'in'))) {
	      node.add(shiftexpr);
	      while(this.look && ({
	        '<': true,
	        '>': true,
	        '>=': true,
	        '<=': true,
	        'instanceof': true
	      }.hasOwnProperty(this.look.content()) || (!noIn && this.look.content() == 'in'))) {
	        node.add(
	          this.match(),
	          this.shiftexpr(noIn)
	        );
	      }
	    }
	    else {
	      return shiftexpr;
	    }
	    return node;
	  },
	  shiftexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.SHIFTEXPR),
	      addexpr = this.addexpr(noIn);
	    if(this.look && ['<<', '>>', '>>>'].indexOf(this.look.content()) != -1) {
	      node.add(addexpr);
	      while(this.look && ['<<', '>>', '>>>'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.addexpr(noIn)
	        );
	      }
	    }
	    else {
	      return addexpr;
	    }
	    return node;
	  },
	  addexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.ADDEXPR),
	      mtplexpr = this.mtplexpr(noIn);
	    if(this.look && ['+', '-'].indexOf(this.look.content()) != -1) {
	      node.add(mtplexpr);
	      while(this.look && ['+', '-'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.mtplexpr(noIn)
	        );
	      }
	    }
	    else {
	      return mtplexpr;
	    }
	    return node;
	  },
	  mtplexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.MTPLEXPR),
	      unaryexpr = this.unaryexpr(noIn);
	    if(this.look && ['*', '/', '%'].indexOf(this.look.content()) != -1) {
	      node.add(unaryexpr);
	      while(this.look && ['*', '/', '%'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.unaryexpr(noIn)
	        );
	      }
	    }
	    else {
	      return unaryexpr;
	    }
	    return node;
	  },
	  unaryexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.UNARYEXPR);
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content()) {
	      case '++':
	      case '--':
	        node.add(
	          this.match(),
	          this.leftexpr(noIn)
	        );
	      break;
	      case 'delete':
	      case 'void':
	      case 'typeof':
	      case '+':
	      case '-':
	      case '~':
	      case '!':
	        node.add(
	          this.match(),
	          this.unaryexpr(noIn)
	        );
	      break;
	      default:
	        return this.postfixexpr(noIn);
	    }
	    return node;
	  },
	  postfixexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.POSTFIXEXPR);
	    var leftexpr = this.leftexpr(noIn);
	    if(this.look && ['++', '--'].indexOf(this.look.content()) > -1 && !this.hasMoveLine) {
	      node.add(
	        leftexpr,
	        this.match()
	      );
	    }
	    else {
	      return leftexpr;
	    }
	    return node;
	  },
	  leftexpr: function(noIn) {
	    if(this.look.content() == 'new') {
	      return this.newexpr(0, noIn);
	    }
	    else {
	      return this.callexpr(null, noIn);
	    }
	  },
	  newexpr: function(depth, noIn) {
	    depth = depth || 0;
	    var node = new Node_1$1(Node_1$1.NEWEXPR);
	    node.add(this.match('new'));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == 'new') {
	      node.add(this.newexpr(depth + 1, noIn));
	    }
	    else {
	      node.add(this.mmbexpr(noIn));
	    }
	    if(this.look && this.look.content() == '(') {
	      node.add(this.args());
	    }
	    if(this.look && ['.', '['].indexOf(this.look.content()) > -1) {
	      var mmb = new Node_1$1(Node_1$1.MMBEXPR);
	      mmb.add(node);
	      while(this.look) {
	        if(this.look.content() == '.') {
	          mmb.add(
	            this.match(),
	            this.match(Token_1.ID, 'missing name after . operator')
	          );
	        }
	        else if(this.look.content() == '[') {
	          mmb.add(
	            this.match(),
	            this.expr(noIn),
	            this.match(']')
	          );
	        }
	        else {
	          break;
	        }
	      }
	      if(depth == 0 && this.look && this.look.content() == '(') {
	        var callexpr = this.callexpr(mmb, noIn);
	        return callexpr;
	      }
	      return mmb;
	    }
	    return node;
	  },
	  callexpr: function(mmb, noIn) {
	    var node = new Node_1$1(Node_1$1.CALLEXPR);
	    mmb = mmb || this.mmbexpr(noIn);
	    if(this.look && this.look.content() == '(') {
	      node.add(
	        mmb,
	        this.args()
	      );
	      while(this.look) {
	        var temp;
	        if(this.look.content() == '.') {
	          temp = new Node_1$1(Node_1$1.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.match(Token_1.ID, 'missing name after . operator')
	          );
	          node = temp;
	        }
	        else if(this.look.content() == '[') {
	          temp = new Node_1$1(Node_1$1.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.expr(noIn),
	            this.match(']')
	          );
	          node = temp;
	        }
	        else if(this.look.content() == '(') {
	          temp = new Node_1$1(Node_1$1.CALLEXPR);
	          temp.add(
	            node,
	            this.args()
	          );
	          node = temp;
	        }
	        else {
	          break;
	        }
	      }
	    }
	    else {
	      return mmb;
	    }
	    return node;
	  },
	  mmbexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.MMBEXPR);
	    var mmb;
	    if(this.look.content() == 'function') {
	      mmb = this.fnexpr(noIn);
	    }
	    else {
	      mmb = this.prmrexpr(noIn);
	    }
	    if(this.look && ['.', '['].indexOf(this.look.content()) > -1) {
	      node.add(mmb);
	      if(this.look.content() == '.') {
	        node.add(
	          this.match(),
	          this.match(Token_1.ID, 'missing name after . operator')
	        );
	      }
	      else {
	        node.add(
	          this.match(),
	          this.expr(noIn),
	          this.match(']')
	        );
	      }
	      while(this.look) {
	        var temp;
	        if(this.look.content() == '.') {
	          temp = new Node_1$1(Node_1$1.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.match(Token_1.ID, 'missing name after . operator')
	          );
	          node = temp;
	        }
	        else if(this.look.content() == '[') {
	          temp = new Node_1$1(Node_1$1.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.expr(noIn),
	            this.match(']')
	          );
	          node = temp;
	        }
	        else {
	          break;
	        }
	      }
	    }
	    else {
	      return mmb;
	    }
	    return node;
	  },
	  prmrexpr: function(noIn) {
	    var node = new Node_1$1(Node_1$1.PRMREXPR);
	    switch(this.look.type()) {
	      case Token_1.ID:
	        if(noIn && this.look.content() == 'in') {
	          this.error();
	        }
	      case Token_1.NUMBER:
	      case Token_1.STRING:
	      case Token_1.REG:
	      case Token_1.TEMPLATE:
	        node.add(this.match());
	      break;
	      default:
	        switch(this.look.content()) {
	          case 'this':
	          case 'null':
	          case 'true':
	          case 'false':
	            node.add(this.match());
	          break;
	          case '(':
	            node.add(this.match(), this.expr(), this.match(')'));
	          break;
	          case '[':
	            node.add(this.arrltr());
	          break;
	          case '{':
	            node.add(this.objltr());
	          break;
	          default:
	            this.error();
	        }
	    }
	    return node;
	  },
	  arrltr: function() {
	    var node = new Node_1$1(Node_1$1.ARRLTR);
	    node.add(this.match('['));
	    while(this.look && this.look.content() != ']') {
	      if(this.look.content() == ',') {
	        node.add(this.match());
	      }
	      else {
	        node.add(this.assignexpr());
	      }
	    }
	    node.add(this.match(']', 'missing ] after element list'));
	    return node;
	  },
	  objltr: function() {
	    var node = new Node_1$1(Node_1$1.OBJLTR);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      node.add(this.proptassign());
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match('}', 'missing } after property list'));
	    return node;
	  },
	  proptassign: function() {
	    var node = new Node_1$1(Node_1$1.PROPTASSIGN);
	    switch(this.look.type()) {
	      case Token_1.ID:
	        if(this.look.content() == 'get') {
	          node.add(this.match());
	          if(!this.look) {
	            this.error('missing : after property id');
	          }
	          if(this.look.type() == Token_1.ID || this.look.type() == Token_1.KEYWORD) {
	            node.add(
	              this.match(),
	              this.match('(', 'missing ( before formal parameters'),
	              this.match(')', 'missing ) after formal parameters'),
	              this.match('{'),
	              this.fnbody(),
	              this.match('}', 'missing } after function body')
	            );
	          }
	          else {
	            node.add(
	              this.match(':', 'missing : after property id'),
	              this.assignexpr()
	            );
	          }
	          break;
	        }
	        else if(this.look.content() == 'set') {
	          node.add(this.match());
	          if(!this.look) {
	            this.error('missing : after property id');
	          }
	          if(this.look.type() == Token_1.ID || this.look.type() == Token_1.KEYWORD) {
	            node.add(
	              this.match(),
	              this.match('(', 'missing ( before formal parameters'),
	              this.match(Token_1.ID, 'setter functions must have one argument'),
	              this.match(')', 'missing ) after formal parameters'),
	              this.match('{'),
	              this.fnbody(),
	              this.match('}', 'missing } after function body')
	            );
	          }
	          else {
	            node.add(
	              this.match(':', 'missing : after property id'),
	              this.assignexpr()
	            );
	          }
	          break;
	        }
	      case Token_1.STRING:
	      case Token_1.NUMBER:
	      case Token_1.KEYWORD:
	        node.add(
	          this.match(),
	          this.match(':', 'missing : after property id'),
	          this.assignexpr()
	        );
	      break;
	      default:
	        this.error('invalid property id');
	    }
	    return node;
	  },
	  args: function() {
	    var node = new Node_1$1(Node_1$1.ARGS);
	    node.add(this.match('('));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() != ')') {
	      node.add(this.arglist());
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  arglist: function() {
	    var node = new Node_1$1(Node_1$1.ARGLIST);
	    while(this.look) {
	      node.add(this.assignexpr());
	      if(this.look) {
	        if(this.look.content() == ',') {
	          node.add(this.match());
	        }
	        else if(this.look.content() == ')') {
	          break;
	        }
	      }
	    }
	    return node;
	  },
	  virtual: function(s) {
	    return new Node_1$1(Node_1$1.TOKEN, new Token_1(Token_1.VIRTUAL, s));
	  },
	  match: function(type, line, msg) {
	    if(typeof type == 'boolean') {
	      msg = line;
	      line = type;
	      type = undefined;
	    }
	    if(typeof line != 'boolean') {
	      line = false;
	      msg = line;
	    }
	    //未定义为所有非空白token
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$1(Node_1$1.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      //特殊处理;，不匹配但有换行或者末尾时自动补全，还有受限行
	      if(type == ';'
	        && (!this.look
	          || (this.look.content() != type && this.hasMoveLine)
	          || this.look.content() == '}')
	      ) {
	        if(this.look && S$1[this.look.type()]) {
	          this.move();
	        }
	        return this.virtual(';');
	      }
	      else if(this.look && this.look.content() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$1(Node_1$1.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$1(Node_1$1.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + Token_1.type(type) + (msg || ''));
	      }
	    }
	  },
	  move: function(line) {
	    this.lastLine = this.line;
	    this.lastCol = this.col;
	    //遗留下来的换行符
	    this.hasMoveLine = false;
	    do {
	      this.look = this.tokens[this.index++];
	      if(!this.look) {
	        return;
	      }
	      //存下忽略的token
	      if(S$1[this.look.type()]) {
	        this.ignores[this.index - 1] = this.look;
	      }
	      //包括line的情况下要跳出
	      if(this.look.type() == Token_1.LINE) {
	        this.line++;
	        this.col = 1;
	        this.hasMoveLine = true;
	        if(line) {
	          break;
	        }
	      }
	      else if(this.look.type() == Token_1.COMMENT) {
	        var s = this.look.content();
	        var n = character.count(this.look.content(), character.LINE);
	        if(n > 0) {
	          this.line += n;
	          var i = s.lastIndexOf(character.LINE);
	          this.col += s.length - i - 1;
	          this.hasMoveLine = true;
	          if(line) {
	            break;
	          }
	        }
	      }
	      else {
	        this.col += this.look.content().length;
	        if(!S$1[this.look.type()]) {
	          break;
	        }
	      }
	    } while(this.index <= this.length);
	  },
	  error: function(msg) {
	    msg = 'SyntaxError: ' + (msg || ' syntax error');
	    throw new Error(msg + ' line ' + this.lastLine + ' col ' + this.lastCol);
	  }
	});
	var Parser_1$1 = Parser$1;

	var Node$2 = Node_1.extend(function(type, children) {
	  Node_1.call(this, type, children);
	  return this;
	}).statics({
	  SCRIPT: 'script',
	  SCRIPTBODY: 'scriptbody',
	  VARSTMT: 'varstmt',
	  VARDECL: 'vardecl',
	  FNBODY: 'fnbody',
	  BLOCKSTMT: 'blockstmt',
	  BLOCK: 'block',
	  ITERSTMT: 'iterstmt',
	  FNPARAMS: 'fnparams',
	  RESTPARAM: 'restparam',
	  EXPR: 'expr',
	  STMT: 'stmt',
	  ASSIGN: 'assign',
	  EMPTSTMT: 'emptstmt',
	  IFSTMT: 'ifstmt',
	  CNTNSTMT: 'cntnstmt',
	  BRKSTMT: 'brkstmt',
	  RETSTMT: 'retstmt',
	  WITHSTMT: 'withstmt',
	  SWCHSTMT: 'swchstmt',
	  CASEBLOCK: 'caseblock',
	  CASECLAUSE: 'caseclause',
	  DFTCLAUSE: 'dftclause',
	  LABSTMT: 'labstmt',
	  THRSTMT: 'thrstmt',
	  TRYSTMT: 'trystmt',
	  DEBSTMT: 'debstmt',
	  EXPRSTMT: 'exprstmt',
	  CACH: 'cach',
	  CACHPARAM: 'cachparam',
	  FINL: 'finl',
	  FNDECL: 'fndecl',
	  FNEXPR: 'fnexpr',
	  ASSIGNEXPR: 'assignexpr',
	  CNDTEXPR: 'cndtexpr',
	  LOGOREXPR: 'logorexpr',
	  LOGANDEXPR: 'logandexpr',
	  BITOREXPR: 'bitorexpr',
	  BITANDEXPR: 'bitandexpr',
	  BITXOREXPR: 'bitxorexpr',
	  EQEXPR: 'eqexpr',
	  RELTEXPR: 'reltexpr',
	  SHIFTEXPR: 'shiftexpr',
	  ADDEXPR: 'addexpr',
	  MTPLEXPR: 'mtplexpr',
	  UNARYEXPR: 'unaryexpr',
	  MMBEXPR: 'mmbexpr',
	  PRMREXPR: 'prmrexpr',
	  ARRLTR: 'arrltr',
	  OBJLTR: 'objltr',
	  PROPTDEF: 'proptdef',
	  ARGS: 'args',
	  ARGLIST: 'arglist',
	  IMPTSTMT: 'imptstmt',
	  POSTFIXEXPR: 'postfixexpr',
	  NEWEXPR: 'newexpr',
	  CALLEXPR: 'callexpr',
	  SPREAD: 'spread',
	  ARRCMPH: 'arrcmph',
	  CMPHFOR: 'cmphfor',
	  INITLZ: 'initlz',
	  BINDID: 'bindid',
	  ARRBINDPAT: 'arrbindpat',
	  OBJBINDPAT: 'objbindpat',
	  BINDELEM: 'bindelem',
	  BINDREST: 'bindrest',
	  PROPTNAME: 'proptname',
	  SINGLENAME: 'singlename',
	  BINDPROPT: 'bindpropt',
	  LTRPROPT: 'ltrpropt',
	  CMPTPROPT: 'cmptpropt',
	  LEXDECL: 'lexdecl',
	  LEXBIND: 'lexbind',
	  FMPARAMS: 'fmparams',
	  CMPHIF: 'cmphif',
	  YIELDEXPR: 'yieldexpr',
	  ARROWFN: 'arrowfn',
	  ARROWPARAMS: 'arrowparams',
	  CPEAPL: 'cpeapl',
	  CLASSEXPR: 'classexpr',
	  GENEXPR: 'genexpr',
	  GENDECL: 'gendecl',
	  GENCMPH: 'gencmph',
	  CMPH: 'cmph',
	  CNCSBODY: 'cncsbody',
	  CLASSDECL: 'classdecl',
	  HERITAGE: 'heritage',
	  CLASSBODY: 'classbody',
	  CLASSELEM: 'classelem',
	  METHOD: 'method',
	  GENMETHOD: 'genmethod',
	  MODULEBODY: 'moduelbody',
	  IMPORT: 'import',
	  EXPORT: 'export',
	  IMPORTDECL: 'importdecl',
	  MODULEIMPORT: 'moduleimport',
	  FROMCAULSE: 'formcaulse',
	  IMPORTCAULSE: 'importcaulse',
	  NAMEIMPORT: 'nameimport',
	  IMPORTSPEC: 'importspec',
	  EXPORTDECL: 'exportdecl',
	  EXPORTCAULSE: 'exportcaulse',
	  EXPORTSPEC: 'exportspec',
	  ANNOT: 'annot',
	  TEMPLATE: 'template',
	  ASYNCDECL: 'asyncdecl',
	  ASYNCARROWFN: 'asyncarrowfn',
	  ASYNCEXPR: 'asyncexpr',
	  ASYNCMETHOD: 'asyncmethod',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys$1) {
	      var self = this;
	      keys$1 = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys$1[v] = k;
	      });
	    }
	    return keys$1[s];
	  }
	});
	var keys$1;
	var Node_1$2 = Node$2;

	var S$2 = {};
	S$2[Token_1.BLANK] = S$2[Token_1.TAB] = S$2[Token_1.COMMENT] = S$2[Token_1.LINE] = S$2[Token_1.ENTER] = true;
	var NOASSIGN$1 = {};
	NOASSIGN$1[Node_1$2.CNDTEXPR]
	  = NOASSIGN$1[Node_1$2.LOGOREXPR]
	  = NOASSIGN$1[Node_1$2.LOGANDEXPR]
	  = NOASSIGN$1[Node_1$2.BITOREXPR]
	  = NOASSIGN$1[Node_1$2.BITXOREXPR]
	  = NOASSIGN$1[Node_1$2.BITANDEXPR]
	  = NOASSIGN$1[Node_1$2.EQEXPR]
	  = NOASSIGN$1[Node_1$2.RELTEXPR]
	  = NOASSIGN$1[Node_1$2.SHIFTEXPR]
	  = NOASSIGN$1[Node_1$2.ADDEXPR]
	  = NOASSIGN$1[Node_1$2.MTPLEXPR]
	  = NOASSIGN$1[Node_1$2.UNARYEXPR]
	  = NOASSIGN$1[Node_1$2.POSTFIXEXPR]
	  = true;
	var Parser$2 = Parser_1.extend(function(lexer) {
	  Parser_1.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  parse: function(code) {
	    this.lexer.parse(code);
	    this.tree = this.script();
	    return this.tree;
	  },
	  init: function(lexer) {
	    this.look = null;
	    this.tokens = null;
	    this.lastLine = 1;
	    this.lastCol = 1;
	    this.line = 1;
	    this.col = 1;
	    this.index = 0;
	    this.length = 0;
	    this.ignores = {};
	    this.hasMoveLine = false;
	    this.module = false;
	    this.tree = {};
	    if(lexer) {
	      this.lexer = lexer;
	    }
	    else if(this.lexer) {
	      this.lexer.init();
	    }
	    else {
	      this.lexer = new EcmascriptLexer_1(new EcmascriptRule_1());
	    }
	  },
	  script: function() {
	    this.tokens = this.lexer.tokens();
	    this.length = this.tokens.length;
	    if(this.tokens.length) {
	      this.move();
	    }
	    var node = new Node_1$2(Node_1$2.SCRIPT);
	    if(this.look) {
	      node.add(this.modulebody());
	      //未出现module,import,export时，此script不是一个模块
	      if(!this.module) {
	        node.leaf(0).name(Node_1$2.SCRIPTBODY);
	      }
	    }
	    return node;
	  },
	  modulebody: function() {
	    var node = new Node_1$2(Node_1$2.MODULEBODY);
	    while(this.look) {
	      node.add(this.moduleitem());
	    }
	    return node;
	  },
	  moduleitem: function() {
	    if(this.look.content() == 'module') {
	      //根据LL2分辨是es6 module语法还是module.exports等语法
	      for(var i = this.index; i < this.length; i++) {
	        var next = this.tokens[i];
	        if(!S$2[next.type()]) {
	          if(next.type() == Token_1.ID) {
	            this.module = true;
	            return this.moduleimport();
	          }
	          break;
	        }
	      }
	    }
	    else if(this.look.content() == 'import') {
	      this.module = true;
	      return this.importdecl();
	    }
	    else if(this.look.content() == 'export') {
	      this.module = true;
	      return this.exportdecl();
	    }
	    return this.stmtlitem();
	  },
	  importdecl: function() {
	    var node = new Node_1$2(Node_1$2.IMPORTDECL);
	    node.add(this.match('import'));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.type() == Token_1.STRING) {
	      node.add(
	        this.match()
	      );
	    }
	    else {
	      node.add(
	        this.importcaulse(),
	        this.fromcaulse()
	      );
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  moduleimport: function() {
	    var node = new Node_1$2(Node_1$2.MODULEIMPORT);
	    node.add(
	      this.match('module', true),
	      this.bindid(),
	      this.fromcaulse(),
	      this.match(';')
	    );
	    return node;
	  },
	  fromcaulse: function() {
	    var node = new Node_1$2(Node_1$2.FROMCAULSE);
	    node.add(
	      this.match('from'),
	      this.match(Token_1.STRING)
	    );
	    return node;
	  },
	  importcaulse: function() {
	    var node = new Node_1$2(Node_1$2.IMPORTCAULSE);
	    while(this.look) {
	      if(this.look.type() == Token_1.ID) {
	        node.add(this.match());
	        if(this.look && this.look.content() == ',') {
	          node.add(this.match());
	        }
	        else {
	          break;
	        }
	      }
	      else if(this.look.content() == '{') {
	        node.add(this.nameimport());
	        break;
	      }
	      else {
	        break;
	      }
	    }
	    return node;
	  },
	  nameimport: function() {
	    var node = new Node_1$2(Node_1$2.NAMEIMPORT);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      node.add(this.importspec());
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match('}'));
	    return node;
	  },
	  importspec: function() {
	    var node = new Node_1$2(Node_1$2.IMPORTSPEC);
	    if(!this.look || this.look.type() != Token_1.ID) {
	      this.error();
	    }
	    //LL2确定是否有as
	    for(var i = this.index; i < this.length; i++) {
	      var token = this.tokens[i];
	      if(!S$2[token.type()]) {
	        if(token.content() == 'as') {
	          node.add(
	            this.match(),
	            this.match(),
	            this.bindid()
	          );
	          return node;
	        }
	        else {
	          break;
	        }
	      }
	    }
	    node.add(this.idref());
	    return node;
	  },
	  exportdecl: function() {
	    var node = new Node_1$2(Node_1$2.EXPORTDECL);
	    node.add(this.match('export'));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '*') {
	      node.add(
	        this.match(),
	        this.fromcaulse(),
	        this.match(';')
	      );
	    }
	    else if(this.look.content() == '{') {
	      node.add(this.exportcaulse());
	      if(this.look && this.look.content() == 'from') {
	        node.add(this.fromcaulse());
	      }
	      node.add(this.match(';'));
	    }
	    else if(this.look.content() == 'default') {
	      node.add(
	        this.match(),
	        this.assignexpr(),
	        this.match(';')
	      );
	    }
	    else if(this.look.content() == 'var') {
	      node.add(this.varstmt());
	    }
	    else {
	      node.add(this.decl());
	    }
	    return node;
	  },
	  exportcaulse: function() {
	    var node = new Node_1$2(Node_1$2.EXPORTCAULSE);
	    while(this.look && this.look.content() != '}') {
	      node.add(this.match('{'));
	      node.add(this.exportspec());
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match('}'));
	    return node;
	  },
	  exportspec: function() {
	    var node = new Node_1$2(Node_1$2.EXPORTSPEC);
	    node.add(this.idref());
	    if(this.look && this.look.content() == 'as') {
	      node.add(
	        this.match('as'),
	        this.match(Token_1.ID)
	      );
	    }
	    return node;
	  },
	  stmtlitem: function(yYield, isConstructor) {
	    if(['function', 'class', 'let', 'const', 'async'].indexOf(this.look.content()) > -1) {
	      return this.decl(yYield);
	    }
	    else if(this.look.type() == Token_1.ANNOT) {
	      return this.annot();
	    }
	    else {
	      return this.stmt(yYield, isConstructor);
	    }
	  },
	  decl: function(yYield) {
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content()) {
	      case 'let':
	      case 'const':
	        return this.lexdecl(yYield);
	      case 'function':
	        for(var i = this.index; i < this.length; i++) {
	          var token = this.tokens[i];
	          if(!S$2[token.type()]) {
	            if(token.content() == '*') {
	              return this.gendecl();
	            }
	            else {
	              return this.fndecl();
	            }
	          }
	        }
	        return this.fndecl();
	      case 'async':
	        return this.asyncdecl();
	      case 'class':
	        return this.classdecl();
	      default:
	        this.error();
	    }
	  },
	  stmt: function(yYield, isConstructor) {
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content()) {
	      case 'var':
	        return this.varstmt(null, yYield);
	      case '{':
	        return this.blockstmt(yYield);
	      case ';':
	        return this.emptstmt();
	      case 'if':
	        return this.ifstmt(yYield);
	      case 'do':
	      case 'while':
	      case 'for':
	        return this.iterstmt(yYield);
	      case 'continue':
	        return this.cntnstmt();
	      case 'break':
	        return this.brkstmt();
	      case 'return':
	        return this.retstmt();
	      case 'with':
	        return this.withstmt(yYield);
	      case 'switch':
	        return this.swchstmt(yYield, isConstructor);
	      case 'throw':
	        return this.thrstmt(yYield);
	      case 'try':
	        return this.trystmt(yYield);
	      case 'debugger':
	        return this.debstmt();
	      default:
	        if(this.look.type() == Token_1.ID) {
	          for(var i = this.index; i < this.length; i++) {
	            var token = this.tokens[i];
	            if(!S$2[token.type()]) {
	              if(token.content() == ':') {
	                return this.labstmt();
	              }
	              else {
	                return this.exprstmt(yYield, isConstructor);
	              }
	            }
	          }
	        }
	        return this.exprstmt(yYield, isConstructor);
	    }
	  },
	  exprstmt: function(yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.EXPRSTMT);
	    node.add(this.expr(null, null, yYield, isConstructor), this.match(';'));
	    return node;
	  },
	  lexdecl: function(yYield) {
	    var node = new Node_1$2(Node_1$2.LEXDECL);
	    if(this.look.content() == 'let') {
	      node.add(this.match());
	    }
	    else if(this.look.content() == 'const') {
	      node.add(this.match());
	    }
	    else {
	      this.error();
	    }
	    node.add(this.lexbind(yYield));
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.lexbind(yYield)
	      );
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  lexbind: function(yYield) {
	    var node = new Node_1$2(Node_1$2.LEXBIND);
	    this.declnode(node, yYield);
	    return node;
	  },
	  declnode: function(node, yYield) {
	    if(!this.look) {
	      this.error('missing variable name');
	    }
	    if(['[', '{'].indexOf(this.look.content()) > -1) {
	      node.add(this.bindpat());
	      if(!this.look || this.look.content() != '=') {
	        this.error('missing = in destructuring declaration');
	      }
	      node.add(this.initlz(null, null, yYield));
	    }
	    else {
	      node.add(this.bindid('missing variable name'));
	      if(this.look && this.look.content() == '=') {
	        node.add(this.initlz(null, null, yYield));
	      }
	    }
	  },
	  varstmt: function(noSem, yYield) {
	    var node = new Node_1$2(Node_1$2.VARSTMT);
	    node.add(
	      this.match('var'),
	      this.vardecl(yYield)
	    );
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.vardecl(yYield)
	      );
	    }
	    if(!noSem) {
	      node.add(this.match(';'));
	    }
	    return node;
	  },
	  vardecl: function(yYield) {
	    var node = new Node_1$2(Node_1$2.VARDECL);
	    this.declnode(node, yYield);
	    return node;
	  },
	  bindid: function(msg, noIn, noOf, canKw) {
	    var node = new Node_1$2(Node_1$2.BINDID);
	    if(!this.look) {
	      this.error(msg);
	    }
	    if(noIn && this.look.content() == 'in') {
	      this.error();
	    }
	    if(noOf && this.look.content() == 'of') {
	      this.error();
	    }
	    if(canKw && this.look.type() == Token_1.KEYWORD) {
	      node.add(this.match(undefined, msg));
	    }
	    else {
	      node.add(this.match(Token_1.ID, msg));
	    }
	    return node;
	  },
	  bindpat: function() {
	    if(this.look.content() == '[') {
	      return this.arrbindpat();
	    }
	    else if(this.look.content() == '{') {
	      return this.objbindpat();
	    }
	    else {
	      this.error();
	    }
	  },
	  arrbindpat: function() {
	    var node = new Node_1$2(Node_1$2.ARRBINDPAT);
	    node.add(this.match('['));
	    while(this.look && this.look.content() != ']') {
	      if(this.look.content() == ',') {
	        node.add(this.match());
	      }
	      else if(this.look.content() == '...') {
	        break;
	      }
	      else {
	        node.add(this.bindelem());
	      }
	    }
	    if(this.look && this.look.content() == '...') {
	      node.add(this.bindrest());
	    }
	    node.add(this.match(']', 'missing ] after element list'));
	    return node;
	  },
	  bindelem: function() {
	    var node = new Node_1$2(Node_1$2.BINDELEM);
	    if(['[', '{'].indexOf(this.look.content()) > -1) {
	      node.add(this.bindpat());
	      if(this.look && this.look.content() == '=') {
	        node.add(this.initlz());
	      }
	    }
	    else {
	      return this.singlename();
	    }
	    return node;
	  },
	  singlename: function(canKw) {
	    var node = new Node_1$2(Node_1$2.SINGLENAME);
	    node.add(this.bindid(null, null, null, canKw));
	    if(this.look && this.look.content() == '=') {
	      node.add(this.initlz());
	    }
	    return node;
	  },
	  bindrest: function() {
	    var node = new Node_1$2(Node_1$2.BINDREST);
	    node.add(
	      this.match('...'),
	      this.bindid('no parameter name after ...')
	    );
	    return node;
	  },
	  objbindpat: function() {
	    var node = new Node_1$2(Node_1$2.OBJBINDPAT);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      node.add(this.bindpropt());
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match('}', 'missing } after property list'));
	    return node;
	  },
	  bindpropt: function() {
	    var node = new Node_1$2(Node_1$2.BINDPROPT);
	    //只能是singlename或者properyname
	    switch(this.look.type()) {
	      case Token_1.ID:
	      case Token_1.STRING:
	      case Token_1.NUMBER:
	      case Token_1.KEYWORD:
	      break;
	      default:
	        if(this.look.content() != '[') {
	          this.error('invalid property id');
	        }
	    }
	    //[为PropertyName左推导
	    if(this.look.content() == '[') {
	      node.add(
	        this.proptname(),
	        this.match(':'),
	        this.bindelem()
	      );
	      return node;
	    }
	    //根据LL2分辨是PropertyName[?Yield, ?GeneratorParameter] : BindingElement[?Yield, ?GeneratorParameter]
	    //还是SingleNameBinding[?Yield, ?GeneratorParameter]
	    for(var i = this.index; i < this.length; i++) {
	      var next = this.tokens[i];
	      if(!S$2[next.type()]) {
	        if(next.content() == ':') {
	          node.add(
	            this.proptname(),
	            this.match(':'),
	            this.bindelem()
	          );
	        }
	        else {
	          node.add(this.singlename(true));
	        }
	        return node;
	      }
	    }
	    this.error('missing : after property id');
	  },
	  blockstmt: function(yYield) {
	    var node = new Node_1$2(Node_1$2.BLOCKSTMT);
	    node.add(this.block(null, yYield));
	    return node;
	  },
	  block: function(msg, yYield) {
	    var node = new Node_1$2(Node_1$2.BLOCK);
	    node.add(this.match('{', msg));
	    while(this.look && this.look.content() != '}') {
	      node.add(this.stmtlitem(yYield));
	    }
	    node.add(this.match('}', 'missing } in compound statement'));
	    return node;
	  },
	  emptstmt: function() {
	    var node = new Node_1$2(Node_1$2.EMPTSTMT);
	    node.add(this.match(';'));
	    return node;
	  },
	  ifstmt: function(yYield) {
	    var node = new Node_1$2(Node_1$2.IFSTMT);
	    node.add(
	      this.match('if'),
	      this.match('('),
	      this.expr(),
	      this.match(')'),
	      this.stmt(yYield)
	    );
	    if(this.look && this.look.content() == 'else') {
	      node.add(
	        this.match('else'),
	        this.stmt(yYield)
	      );
	    }
	    return node;
	  },
	  iterstmt: function(yYield) {
	    var node = new Node_1$2(Node_1$2.ITERSTMT);
	    switch(this.look.content()) {
	      case 'do':
	        node.add(
	          this.match(),
	          this.stmt(yYield),
	          this.match('while'),
	          this.match('('),
	          this.expr(),
	          this.match(')'),
	          this.match(';')
	        );
	      break;
	      case 'while':
	        node.add(
	          this.match(),
	          this.match('('),
	          this.expr(),
	          this.match(')'),
	          this.stmt(yYield)
	        );
	      break;
	      case 'for':
	        node.add(
	          this.match(),
	          this.match('(')
	        );
	        if(!this.look) {
	          this.error();
	        }
	        //当前是var的话，LL2确定是for(var forbind;或for(var vardecllist
	        if(this.look.content() == 'var') {
	          var end = false;
	          outer:
	          for(var i = this.index; i < this.length; i++) {
	            var token = this.tokens[i];
	            if(!S$2[token.type()]) {
	              //直接指向forbind
	              if(['{', '['].indexOf(token.content()) > -1) {
	                node.add(
	                  this.match(),
	                  this.forbind()
	                );
	              }
	              //仅一个id之后跟着of或in就是forbind
	              else if(token.type() == Token_1.ID) {
	                var end2 = false;
	                for(var j = i + 1; j < this.length; j++) {
	                  var next = this.tokens[j];
	                  if(!S$2[next.type()]) {
	                    if(['in', 'of'].indexOf(next.content()) > -1) {
	                      node.add(
	                        this.match(),
	                        this.forbind()
	                      );
	                    }
	                    else {
	                      node.add(this.varstmt(true));
	                    }
	                    end = end2 = true;
	                    break outer;
	                  }
	                }
	              }
	              else {
	                this.error();
	              }
	              end = true;
	              break;
	            }
	          }
	          if(!end || !this.look) {
	            this.error('missing ; after for-loop initializer');
	          }
	          //in/of前只能是一个vardecl，不能出现vardecllist
	          if(['in', 'of'].indexOf(this.look.content()) > -1) {
	            if(node.leaf(2).name() == Node_1$2.VARSTMT && node.leaf(2).size() > 2) {
	              this.error('invalid for/in left-hand side');
	            }
	            var isOf = this.look.content() == 'of';
	            node.add(
	              this.match(),
	              isOf ? this.assignexpr() : this.expr()
	            );
	          }
	          else {
	            node.add(this.match(';'));
	            if(this.look.content() != ';') {
	              node.add(this.expr());
	            }
	            node.add(this.match(';'));
	            if(!this.look) {
	              this.error();
	            }
	            if(this.look.content() != ')') {
	              node.add(this.expr());
	            }
	          }
	        }
	        else if(['let', 'const'].indexOf(this.look.content()) > -1) {
	          outer:
	          for(var i = this.index; i < this.length; i++) {
	            var token = this.tokens[i];
	            if(!S$2[token.type()]) {
	              //直接指向LexicalDeclaration
	              if(['{', '['].indexOf(token.content()) > -1) {
	                node.add(this.lexdecl(yYield));
	                if(this.look && this.look.content() != ';') {
	                  node.add(this.expr());
	                }
	                node.add(this.match(';'));
	                if(this.look && this.look.content() != ')') {
	                  node.add(this.expr());
	                }
	                break;
	              }
	              //仅一个id之后跟着of或in也是LexicalDeclaration
	              else if(token.type() == Token_1.ID) {
	                for(var j = i + 1; j < this.length; j++) {
	                  var next = this.tokens[j];
	                  if(!S$2[next.type()]) {
	                    if(['in', 'of'].indexOf(next.content()) > -1) {
	                      node.add(
	                        this.match(),
	                        this.forbind()
	                      );
	                      var isOf = next.content() == 'of';
	                      node.add(
	                        this.match(),
	                        isOf ? this.assignexpr() : this.expr()
	                      );
	                    }
	                    else {
	                      node.add(this.lexdecl(yYield));
	                      if(this.look && this.look.content() != ';') {
	                        node.add(this.expr());
	                      }
	                      node.add(this.match(';'));
	                      if(this.look && this.look.content() != ')') {
	                        node.add(this.expr());
	                      }
	                    }
	                    break outer;
	                  }
	                }
	              }
	              else {
	                this.error();
	              }
	            }
	          }
	        }
	        else {
	          if(['in', 'of'].indexOf(this.look.content()) > -1) {
	            this.error();
	          }
	          //for(EXPRnoin;) or for(leftexpr in
	          var expr;
	          if(this.look.content() != ';') {
	            expr = this.expr(true, true);
	            node.add(expr);
	          }
	          if(!this.look) {
	            this.error('missing ;');
	          }
	          if(this.look.content() == 'in') {
	            if(expr.name() == Node_1$2.MMBEXPR
	              || expr.name() == Node_1$2.PRMREXPR
	              || expr.name() == Node_1$2.NEWEXPR) {
	              node.add(
	                this.match(),
	                this.expr()
	              );
	            }
	            else {
	              this.error('invalid for/in left-hand side');
	            }
	          }
	          else if(this.look.content() == 'of') {
	            if(expr.name() == Node_1$2.MMBEXPR
	              || expr.name() == Node_1$2.PRMREXPR
	              || expr.name() == Node_1$2.NEWEXPR) {
	              node.add(
	                this.match(),
	                this.assignexpr()
	              );
	            }
	            else {
	              this.error('invalid for/in left-hand side');
	            }
	          }
	          else {
	            //for的;不能省略，强制判断
	            node.add(this.match(';', 'missing ;'));
	            if(!this.look) {
	              this.error();
	            }
	            if(this.look.content() != ';') {
	              node.add(this.expr());
	            }
	            node.add(this.match(';', 'missing ;'));
	            if(!this.look) {
	              this.error();
	            }
	            if(this.look.content() != ')') {
	              node.add(this.expr());
	            }
	          }
	        }
	        node.add(this.match(')'));
	        node.add(this.stmt(yYield));
	    }
	    return node;
	  },
	  cntnstmt: function() {
	    var node = new Node_1$2(Node_1$2.CNTNSTMT);
	    node.add(this.match('continue', true));
	    if(this.look && this.look.type() == Token_1.ID) {
	      node.add(this.match());
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  brkstmt: function() {
	    var node = new Node_1$2(Node_1$2.BRKSTMT);
	    node.add(this.match('break', true));
	    if(this.look && this.look.type() == Token_1.ID) {
	      node.add(this.match());
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  retstmt: function() {
	    var node = new Node_1$2(Node_1$2.RETSTMT);
	    node.add(this.match('return', true));
	    //return后换行视作省略;，包括多行注释的换行
	    if(this.look) {
	      if(this.look.content() == ';'
	        || this.look.content() == '}'
	        || this.look.type() == Token_1.LINE
	        || this.look.type() == Token_1.COMMENT) {
	        node.add(this.match(';'));
	      }
	      else {
	        node.add(this.expr(), this.match(';'));
	      }
	    }
	    else {
	      node.add(this.match(';'));
	    }
	    return node;
	  },
	  withstmt: function(yYield) {
	    var node = new Node_1$2(Node_1$2.WITHSTMT);
	    node.add(
	      this.match('with', 'missing ( before with-statement object'),
	      this.match('('),
	      this.expr(),
	      this.match(')', 'missing ) after with-statement object'),
	      this.stmt(yYield)
	    );
	    return node;
	  },
	  swchstmt: function(yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.SWCHSTMT);
	    node.add(
	      this.match('switch'),
	      this.match('('),
	      this.expr(),
	      this.match(')'),
	      this.caseblock(yYield, isConstructor)
	    );
	    return node;
	  },
	  caseblock: function(yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.CASEBLOCK);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      if(this.look.content() == 'case') {
	        node.add(this.caseclause(yYield, isConstructor));
	      }
	      else if(this.look.content() == 'default') {
	        node.add(this.dftclause(yYield, isConstructor));
	      }
	      else {
	        this.error('invalid switch statement');
	      }
	    }
	    node.add(this.match('}'));
	    return node;
	  },
	  caseclause: function(yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.CASECLAUSE);
	    node.add(
	      this.match('case'),
	      this.expr(),
	      this.match(':')
	    );
	    while(this.look
	      && this.look.content() != 'case'
	      && this.look.content() != 'default'
	      && this.look.content() != '}') {
	      node.add(this.stmtlitem(yYield, isConstructor));
	    }
	    return node;
	  },
	  dftclause: function(yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.DFTCLAUSE);
	    node.add(
	      this.match('default'),
	      this.match(':')
	    );
	    while(this.look && this.look.content() == 'case') {
	      node.add(
	        this.match('case'),
	        this.expr(),
	        this.match(':')
	      );
	    }
	    while(this.look && this.look.content() != '}') {
	      node.add(this.stmtlitem(yYield, isConstructor));
	    }
	    return node;
	  },
	  labstmt: function() {
	    var node = new Node_1$2(Node_1$2.LABSTMT);
	    node.add(
	      this.match(Token_1.ID),
	      this.match(':'),
	      this.stmt()
	    );
	    return node;
	  },
	  thrstmt: function() {
	    var node = new Node_1$2(Node_1$2.THRSTMT);
	    node.add(
	      this.match('throw', true),
	      this.expr(),
	      this.match(';')
	    );
	    return node;
	  },
	  trystmt: function(yYield) {
	    var node = new Node_1$2(Node_1$2.TRYSTMT);
	    node.add(
	      this.match('try'),
	      this.block('missing { before try block', yYield)
	    );
	    if(this.look && this.look.content() == 'catch') {
	      node.add(this.cach(yYield));
	      if(this.look && this.look.content() == 'finally') {
	        node.add(this.finl(yYield));
	      }
	    }
	    else {
	      node.add(this.finl(yYield));
	    }
	    return node;
	  },
	  debstmt: function() {
	    var node = new Node_1$2(Node_1$2.DEBSTMT);
	    node.add(this.match('debugger'), this.match(';'));
	    return node;
	  },
	  cach: function(yYield) {
	    var node = new Node_1$2(Node_1$2.CACH);
	    node.add(
	      this.match('catch', 'missing catch or finally after try'),
	      this.match('(', 'missing ( before catch'),
	      this.cachparam(),
	      this.match(')', 'missing ) after catch'),
	      this.block('missing { before catch block', yYield)
	    );
	    return node;
	  },
	  cachparam: function() {
	    var node = new Node_1$2(Node_1$2.CACHPARAM);
	    if(['[', '{'].indexOf(this.look.content()) > -1) {
	      node.add(this.bindpat());
	    }
	    else {
	      node.add(this.bindid('missing identifier in catch'));
	    }
	    return node;
	  },
	  finl: function(yYield) {
	    var node = new Node_1$2(Node_1$2.FINL);
	    node.add(
	      this.match('finally'),
	      this.block('missing { before finally block', yYield)
	    );
	    return node;
	  },
	  imptstmt: function() {
	    var node = new Node_1$2(Node_1$2.IMPTSTMT);
	    return node;
	  },
	  fndecl: function() {
	    var node = new Node_1$2(Node_1$2.FNDECL);
	    node.add(
	      this.match('function'),
	      this.bindid('function statement requires a name'),
	      this.match('(', 'missing ( before formal parameters'),
	      this.fmparams(),
	      this.match(')', 'missing ) after formal parameters'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}', 'missing } after function body')
	    );
	    return node;
	  },
	  fnexpr: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.FNEXPR);
	    node.add(
	      this.match('function')
	    );
	    if(!this.look) {
	      this.error('missing formal parameter');
	    }
	    if(this.look.type() == Token_1.ID) {
	      node.add(this.bindid(null, noIn, noOf));
	    }
	    node.add(
	      this.match('(', 'missing ( before formal parameters'),
	      this.fmparams(),
	      this.match(')', 'missing ) after formal parameters'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}', 'missing } after function body')
	    );
	    return node;
	  },
	  genexpr: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.GENEXPR);
	    node.add(
	      this.match('function'),
	      this.match('*')
	    );
	    if(!this.look) {
	      this.error('missing formal parameter');
	    }
	    if(this.look.type() == Token_1.ID) {
	      node.add(this.bindid(null, noIn, noOf));
	    }
	    node.add(
	      this.match('(', 'missing ( before formal parameters'),
	      this.fmparams(),
	      this.match(')', 'missing ) after formal parameters'),
	      this.match('{'),
	      this.fnbody(true),
	      this.match('}', 'missing } after function body')
	    );
	    return node;
	  },
	  gendecl: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.GENDECL);
	    node.add(
	      this.match('function'),
	      this.match('*')
	    );
	    node.add(this.bindid('missing formal parameter', noIn, noOf));
	    node.add(
	      this.match('(', 'missing ( before formal parameters'),
	      this.fmparams(),
	      this.match(')', 'missing ) after formal parameters'),
	      this.match('{'),
	      this.fnbody(true),
	      this.match('}', 'missing } after function body')
	    );
	    return node;
	  },
	  fmparams: function() {
	    var node = new Node_1$2(Node_1$2.FMPARAMS);
	    if(!this.look) {
	      this.error('missing formal parameter');
	    }
	    if(this.look.content() != ')') {
	      while(this.look) {
	        if(this.look.content() == '...') {
	          break;
	        }
	        else {
	          node.add(this.bindelem(true));
	          if(this.look && this.look.content() == ')') {
	            break;
	          }
	          if(this.look && this.look.content() == ',') {
	            node.add(this.match());
	          }
	        }
	      }
	    }
	    if(!this.look) {
	      this.error('missing ) after formal parameters');
	    }
	    if(this.look.content() == '...') {
	      node.add(this.bindrest(true));
	    }
	    return node;
	  },
	  fnbody: function(yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.FNBODY);
	    while(this.look && this.look.content() != '}') {
	      node.add(this.stmtlitem(yYield, isConstructor));
	    }
	    return node;
	  },
	  asyncdecl: function() {
	    var node = new Node_1$2(Node_1$2.ASYNCDECL);
	    //LL2判断是否是async arrow fn
	    for(var i = this.index + 1; i < this.length; i++) {
	      var next = this.tokens[i];
	      if(!S$2[next.type()] && next.content() != character.ENTER && next.content() != character.LINE) {
	        if(next.content() == '(' || next.content() != 'function') {
	          return this.asyncarrowfn();
	        }
	        else {
	          break;
	        }
	      }
	    }
	    node.add(
	      this.match('async', true),
	      this.match('function'),
	      this.bindid('async function statement requires a name'),
	      this.match('(', 'missing ( before formal parameters'),
	      this.fmparams(),
	      this.match(')', 'missing ) after formal parameters'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}', 'missing } after function body')
	    );
	    return node;
	  },
	  asyncexpr: function() {
	    var node = new Node_1$2(Node_1$2.ASYNCEXPR);
	    node.add(
	      this.match('async', true),
	      this.match('function')
	    );
	    if(this.look && this.look.content() == '(') {
	      node.add(
	        this.match('(', 'missing ( before formal parameters'),
	        this.fmparams(),
	        this.match(')', 'missing ) after formal parameters'),
	        this.match('{'),
	        this.fnbody(),
	        this.match('}', 'missing } after function body')
	      );
	    }
	    else {
	      node.add(
	        this.bindid(),
	        this.match('{'),
	        this.fnbody(),
	        this.match('}', 'missing } after function body')
	      );
	    }
	    return node;
	  },
	  asyncarrowfn: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.ASYNCARROWFN);
	    node.add(this.match('async', true));
	    if(this.look && this.look.content() == '(') {
	      node.add(this.match());
	      if(this.look && this.look.content() != ')') {
	        node.add(this.bindid());
	      }
	      node.add(
	        this.match(')'),
	        this.match('=>')
	      );
	      if(this.look && this.look.content() == '{') {
	        node.add(
	          this.match(),
	          this.fnbody(),
	          this.match('}')
	        );
	      }
	      else {
	        node.add(this.assignexpr());
	      }
	    }
	    else {
	      node.add(
	        this.bindid('', noIn, noOf),
	        this.match('=>')
	      );
	      if(this.look && this.look.content() == '{') {
	        node.add(
	          this.match(),
	          this.fnbody(),
	          this.match('}')
	        );
	      }
	      else {
	        node.add(this.assignexpr());
	      }
	    }
	    return node;
	  },
	  classdecl: function() {
	    var node = new Node_1$2(Node_1$2.CLASSDECL);
	    node.add(
	      this.match('class'),
	      this.bindid()
	    );
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == 'extends') {
	      node.add(this.heratige());
	    }
	    node.add(
	      this.match('{'),
	      this.classbody(),
	      this.match('}')
	    );
	    return node;
	  },
	  classexpr: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CLASSEXPR);
	    node.add(this.match('class'));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.type() == Token_1.ID) {
	      node.add(this.bindid(null, noIn, noOf));
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == 'extends') {
	      node.add(this.heratige(noIn, noOf));
	    }
	    node.add(
	      this.match('{'),
	      this.classbody(noIn, noOf),
	      this.match('}')
	    );
	    return node;
	  },
	  heratige: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.HERITAGE);
	    node.add(
	      this.match('extends'),
	      this.leftexpr(noIn, noOf)
	    );
	    return node;
	  },
	  classbody: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CLASSBODY);
	    while(this.look && this.look.content() != '}') {
	      node.add(this.classelem(noIn, noOf));
	    }
	    return node;
	  },
	  classelem: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CLASSELEM);
	    if(this.look.content() == ';') {
	      node.add(this.match());
	    }
	    else if(this.look.content() == 'static') {
	      node.add(
	        this.match(),
	        this.method(noIn, noOf)
	      );
	    }
	    else if(this.look.type() == Token_1.ANNOT) {
	      node.add(this.annot());
	    }
	    else if(['[', '{'].indexOf(this.look.content()) != -1) {
	      node.add(this.lexbind());
	    }
	    else if(this.look.type() == Token_1.ID && ['get', 'set'].indexOf(this.look.content()) == -1) {
	      //LL2区分新增语法classbody内赋值
	      for(var i = this.index; i < this.length; i++) {
	        var next = this.tokens[i];
	        if(!S$2[next.type()]) {
	          if(next.content() == '(') {
	            node.add(this.method(noIn, noOf));
	          }
	          else {
	            node.add(this.lexbind());
	          }
	          return node;
	        }
	      }
	    }
	    else if(this.look.content() == 'async') {
	      node.add(this.asyncmethod(noIn, noOf));
	    }
	    else {
	      node.add(this.method(noIn, noOf));
	    }
	    return node;
	  },
	  asyncmethod: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.ASYNCMETHOD);
	    node.add(
	      this.match('async', true),
	      this.proptname(),
	      this.match('('),
	      this.fmparams(),
	      this.match(')'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}')
	    );
	    return node;
	  },
	  annot: function() {
	    var node = new Node_1$2(Node_1$2.ANNOT);
	    node.add(this.match());
	    if(this.look && this.look.content() == '(') {
	      node.add(
	        this.match('('),
	        this.fmparams(),
	        this.match(')')
	      );
	    }
	    return node;
	  },
	  method: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.METHOD);
	    if(this.look.content() == 'get') {
	      node.add(
	        this.match(),
	        this.proptname(noIn, noOf),
	        this.match('('),
	        this.fmparams(),
	        this.match(')'),
	        this.match('{'),
	        this.fnbody(),
	        this.match('}')
	      );
	    }
	    else if(this.look.content() == 'set') {
	      node.add(
	        this.match(),
	        this.proptname(noIn, noOf),
	        this.match('('),
	        this.fmparams(),
	        this.match(')'),
	        this.match('{'),
	        this.fnbody(),
	        this.match('}')
	      );
	    }
	    else if(this.look.content() == '*') {
	      return this.genmethod(noIn, noOf);
	    }
	    else if(this.look.content() == 'async') {
	      return this.asyncmethod(noIn, noOf);
	    }
	    else {
	      var isConstructor = this.look.type() == Token_1.ID && this.look.content() == 'constructor';
	      node.add(
	        this.proptname(noIn, noOf),
	        this.match('('),
	        this.fmparams(),
	        this.match(')'),
	        this.match('{'),
	        this.fnbody(false, isConstructor),
	        this.match('}')
	      );
	    }
	    return node;
	  },
	  genmethod: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.GENMETHOD);
	    node.add(
	      this.match('*'),
	      this.proptname(noIn, noOf),
	      this.match('('),
	      this.fmparams(),
	      this.match(')'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}')
	    );
	    return node;
	  },
	  asyncmethod: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.ASYNCMETHOD);
	    node.add(
	      this.match('async', true),
	      this.proptname(noIn, noOf),
	      this.match('('),
	      this.fmparams(),
	      this.match(')'),
	      this.match('{'),
	      this.fnbody(),
	      this.match('}')
	    );
	    return node;
	  },
	  expr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.EXPR),
	      assignexpr = this.assignexpr(noIn, noOf, yYield, isConstructor);
	    //LL2区分,后的...是否为cpeapl
	    if(this.look && this.look.content() == ',') {
	      for(var i = this.index; i < this.length; i++) {
	        var next = this.tokens[i];
	        if(!S$2[next.type()]) {
	          if(next.content() == '...') {
	            return assignexpr;
	          }
	          break;
	        }
	      }
	      node.add(assignexpr);
	      outer:
	      while(this.look && this.look.content() == ',') {
	        for(var i = this.index; i < this.length; i++) {
	          var next = this.tokens[i];
	          if(!S$2[next.type()]) {
	            if(next.content() == '...') {
	              break outer;
	            }
	            break;
	          }
	        }
	        node.add(this.match(), this.assignexpr(noIn, noOf, yYield, isConstructor));
	      }
	    }
	    else {
	      return assignexpr;
	    }
	    return node;
	  },
	  initlz: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.INITLZ);
	    node.add(
	      this.match('='),
	      this.assignexpr(noIn, noOf, yYield)
	    );
	    return node;
	  },
	  assignexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.ASSIGNEXPR);
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == 'yield') {
	      if(!yYield) {
	        this.error('yield not in generator function');
	      }
	      return this.yieldexpr(noIn, noOf, yYield);
	    }
	    //LL2判断async arrow fn提前
	    if(this.look.content() == 'async') {
	      for(var i = this.index; i < this.length; i++) {
	        var next = this.tokens[i];
	        if(!S$2[next.type()]) {
	          if(next.content() == '(' || next.type() == Token_1.ID) {
	            node.add(this.asyncarrowfn(noIn, noOf, yYield));
	            return node;
	          }
	          break;
	        }
	      }
	    }
	    var cndt = this.cndtexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look
	      && this.look.content() == '=>'
	      && this.hasMoveLine == false
	      && cndt.name() == Node_1$2.PRMREXPR
	      && cndt.size() == 1
	      && (cndt.first().name() == Node_1$2.CPEAPL
	        || (cndt.first().name() == Node_1$2.TOKEN
	          && cndt.first().token().type() == Token_1.ID))) {
	      node = new Node_1$2(Node_1$2.ARROWFN);
	      var arrowparams = new Node_1$2(Node_1$2.ARROWPARAMS);
	      arrowparams.add(cndt.first());
	      node.add(
	        arrowparams,
	        this.match(),
	        this.cncsbody(noIn, noOf, yYield)
	      );
	    }
	    else if(this.look
	      && {
	        '*=': true,
	        '/=': true,
	        '%=': true,
	        '+=': true,
	        '-=': true,
	        '<<=': true,
	        '>>=': true,
	        '>>>=': true,
	        '&=': true,
	        '^=': true,
	        '|=': true,
	        '=': true,
	        '**': true,
	      }.hasOwnProperty(this.look.content())
	      && !NOASSIGN$1.hasOwnProperty(cndt.name())) {
	      node.add(cndt, this.match(), this.assignexpr(noIn, noOf, yYield, isConstructor));
	    }
	    else {
	      return cndt;
	    }
	    return node;
	  },
	  yieldexpr: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.YIELDEXPR);
	    node.add(this.match('yield'));
	    if(this.look && this.look.content() == '*') {
	      node.add(this.match());
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if([';', '}'].indexOf(this.look.content()) == -1
	      && this.look.type() != Token_1.KEYWORD) {
	      node.add(this.assignexpr(noIn, noOf, yYield));
	    }
	    return node;
	  },
	  cpeapl: function() {
	    var node = new Node_1$2(Node_1$2.CPEAPL);
	    node.add(this.match('('));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '...') {
	      node.add(
	        this.match(),
	        this.bindid(),
	        this.match(')')
	      );
	      return node;
	    }
	    if(this.look.content() != ')') {
	      node.add(this.expr());
	    }
	    if(this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.match('...'),
	        this.bindid()
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  cncsbody: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CNCSBODY);
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '{') {
	      node.add(
	        this.match(),
	        this.fnbody(),
	        this.match('}')
	      );
	    }
	    else {
	      node.add(this.assignexpr(noIn, noOf));
	    }
	    return node;
	  },
	  cndtexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.CNDTEXPR),
	      logorexpr = this.logorexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && this.look.content() == '?') {
	      node.add(
	        logorexpr,
	        this.match(),
	        this.assignexpr(noIn, noOf, yYield, isConstructor),
	        this.match(':'),
	        this.assignexpr(noIn, noOf, yYield, isConstructor)
	      );
	    }
	    else {
	      return logorexpr;
	    }
	    return node;
	  },
	  logorexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.LOGOREXPR),
	      logandexpr = this.logandexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && this.look.content() == '||') {
	      node.add(logandexpr);
	      while(this.look && this.look.content() == '||') {
	        node.add(
	          this.match(),
	          this.logandexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return logandexpr;
	    }
	    return node;
	  },
	  logandexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.LOGANDEXPR),
	      bitorexpr = this.bitorexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && this.look.content() == '&&') {
	      node.add(bitorexpr);
	      while(this.look && this.look.content() == '&&') {
	        node.add(
	          this.match(),
	          this.bitorexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return bitorexpr;
	    }
	    return node;
	  },
	  bitorexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.BITOREXPR),
	      bitxorexpr = this.bitxorexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && this.look.content() == '|') {
	      node.add(bitxorexpr);
	      while(this.look && this.look.content() == '|') {
	        node.add(
	          this.match(),
	          this.bitxorexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return bitxorexpr;
	    }
	    return node;
	  },
	  bitxorexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.BITXOREXPR),
	      bitandexpr = this.bitandexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && this.look.content() == '^') {
	      node.add(bitandexpr);
	      while(this.look && this.look.content() == '^') {
	        node.add(
	          this.match(),
	          this.bitandexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return bitandexpr;
	    }
	    return node;
	  },
	  bitandexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.BITANDEXPR),
	      eqexpr = this.eqexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && this.look.content() == '&') {
	      node.add(eqexpr);
	      while(this.look && this.look.content() == '&') {
	        node.add(
	          this.match(),
	          this.eqexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return eqexpr;
	    }
	    return node;
	  },
	  eqexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.EQEXPR),
	      reltexpr = this.reltexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && {
	      '==': true,
	      '===': true,
	      '!==': true,
	      '!=': true
	    }.hasOwnProperty(this.look.content())) {
	      node.add(reltexpr);
	      while(this.look && {
	        '==': true,
	        '===': true,
	        '!==': true,
	        '!=': true
	      }.hasOwnProperty(this.look.content())) {
	        node.add(
	          this.match(),
	          this.reltexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return reltexpr;
	    }
	    return node;
	  },
	  reltexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.RELTEXPR),
	      shiftexpr = this.shiftexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && ({
	      '<': true,
	      '>': true,
	      '>=': true,
	      '<=': true,
	      'instanceof': true
	    }.hasOwnProperty(this.look.content())
	      || (!noIn && this.look.content() == 'in'))) {
	      node.add(shiftexpr);
	      while(this.look && ({
	        '<': true,
	        '>': true,
	        '>=': true,
	        '<=': true,
	        'instanceof': true
	      }.hasOwnProperty(this.look.content())
	        || (!noIn && this.look.content() == 'in'))) {
	        node.add(
	          this.match(),
	          this.shiftexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return shiftexpr;
	    }
	    return node;
	  },
	  shiftexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.SHIFTEXPR),
	      addexpr = this.addexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && ['<<', '>>', '>>>'].indexOf(this.look.content()) != -1) {
	      node.add(addexpr);
	      while(this.look && ['<<', '>>', '>>>'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.addexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return addexpr;
	    }
	    return node;
	  },
	  addexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.ADDEXPR),
	      mtplexpr = this.mtplexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && ['+', '-'].indexOf(this.look.content()) != -1) {
	      node.add(mtplexpr);
	      while(this.look && ['+', '-'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.mtplexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return mtplexpr;
	    }
	    return node;
	  },
	  mtplexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.MTPLEXPR),
	      unaryexpr = this.unaryexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && ['*', '/', '%'].indexOf(this.look.content()) != -1) {
	      node.add(unaryexpr);
	      while(this.look && ['*', '/', '%'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.unaryexpr(noIn, noOf, yYield, isConstructor)
	        );
	      }
	    }
	    else {
	      return unaryexpr;
	    }
	    return node;
	  },
	  unaryexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.UNARYEXPR);
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content()) {
	      case '++':
	      case '--':
	        node.add(
	          this.match(),
	          this.leftexpr(noIn, noOf, yYield, isConstructor)
	        );
	        break;
	      case 'delete':
	      case 'void':
	      case 'typeof':
	      case '+':
	      case '-':
	      case '~':
	      case '!':
	      case 'await':
	        node.add(
	          this.match(),
	          this.unaryexpr(noIn, noOf, yYield, isConstructor)
	        );
	      break;
	      default:
	        return this.postfixexpr(noIn, noOf, yYield, isConstructor);
	    }
	    return node;
	  },
	  postfixexpr: function(noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.POSTFIXEXPR);
	    var leftexpr = this.leftexpr(noIn, noOf, yYield, isConstructor);
	    if(this.look && ['++', '--'].indexOf(this.look.content()) > -1 && !this.hasMoveLine) {
	      node.add(
	        leftexpr,
	        this.match()
	      );
	    }
	    else {
	      return leftexpr;
	    }
	    return node;
	  },
	  leftexpr: function(noIn, noOf, yYield, isConstructor) {
	    if(this.look.content() == 'new') {
	      return this.newexpr(0, noIn, noOf, yYield);
	    }
	    else {
	      return this.callexpr(null, noIn, noOf, yYield, isConstructor);
	    }
	  },
	  newexpr: function(depth, noIn, noOf, yYield) {
	    depth = depth || 0;
	    var node = new Node_1$2(Node_1$2.NEWEXPR);
	    node.add(this.match('new'));
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == 'new') {
	      node.add(this.newexpr(depth + 1, noIn, noOf, yYield));
	    }
	    //LL2分辨super后是否为.[至mmbexpr
	    else if(this.look.content() == 'super') {
	      var end = false;
	      for(var i = this.index; i < this.length; i++) {
	        var next = this.tokens[i];
	        if(!S$2[next.type()]) {
	          if(['.', '['].indexOf(next.content()) > -1) {
	            node.add(this.mmbexpr(noIn, noOf, yYield));
	          }
	          else {
	            node.add(this.match());
	          }
	          end = true;
	          break;
	        }
	      }
	      if(!end) {
	        node.add(this.match());
	      }
	    }
	    else {
	      node.add(this.mmbexpr(noIn, noOf, yYield));
	    }
	    if(this.look && this.look.content() == '(') {
	      node.add(this.args());
	    }
	    if(this.look && ['.', '['].indexOf(this.look.content()) > -1) {
	      var mmb = new Node_1$2(Node_1$2.MMBEXPR);
	      mmb.add(node);
	      while(this.look) {
	        if(this.look.content() == '.') {
	          mmb.add(
	            this.match(),
	            this.match(Token_1.ID, 'missing name after . operator')
	          );
	        }
	        else if(this.look.content() == '[') {
	          mmb.add(
	            this.match(),
	            this.expr(noIn, noOf, yYield),
	            this.match(']')
	          );
	        }
	        else {
	          break;
	        }
	      }
	      if(depth == 0 && this.look && this.look.content() == '(') {
	        var callexpr = this.callexpr(mmb, noIn, noOf, yYield);
	        return callexpr;
	      }
	      return mmb;
	    }
	    return node;
	  },
	  callexpr: function(mmb, noIn, noOf, yYield, isConstructor) {
	    var node = new Node_1$2(Node_1$2.CALLEXPR);
	    if(!mmb) {
	      //根据LL2分辨是super()还是mmbexpr
	      if(this.look.content() == 'super') {
	        for(var i = this.index; i < this.length; i++) {
	          var next = this.tokens[i];
	          if(!S$2[next.type()]) {
	            if(next.content() == '(') {
	              if(!isConstructor) {
	                node.add(this.match());
	                this.error('super call is only allowed in derived constructor');
	              }
	              node.add(
	                this.match(),
	                this.args()
	              );
	              mmb = node;
	              node = new Node_1$2(Node_1$2.CALLEXPR);
	            }
	            else {
	              mmb = this.mmbexpr(noIn, noOf, yYield);
	            }
	            break;
	          }
	        }
	      }
	      else {
	        mmb = this.mmbexpr(noIn, noOf, yYield);
	      }
	    }
	    if(this.look && this.look.content() == '(') {
	      node.add(
	        mmb,
	        this.args()
	      );
	      while(this.look) {
	        var temp;
	        if(this.look.content() == '.') {
	          temp = new Node_1$2(Node_1$2.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.match(Token_1.ID, 'missing name after . operator')
	          );
	          node = temp;
	        }
	        else if(this.look.content() == '[') {
	          temp = new Node_1$2(Node_1$2.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.expr(noIn, noOf, yYield),
	            this.match(']')
	          );
	          node = temp;
	        }
	        else if(this.look.content() == '(') {
	          temp = new Node_1$2(Node_1$2.CALLEXPR);
	          temp.add(
	            node,
	            this.args()
	          );
	          node = temp;
	        }
	        else if(this.look.type() == Token_1.TEMPLATE) {
	          temp = new Node_1$2(Node_1$2.CALLEXPR);
	          temp.add(
	            node,
	            this.match()
	          );
	          node = temp;
	        }
	        else {
	          break;
	        }
	      }
	    }
	    else {
	      return mmb;
	    }
	    return node;
	  },
	  mmbexpr: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.MMBEXPR);
	    var mmb;
	    if(this.look.content() == 'super') {
	      mmb = this.match();
	      if(!this.look || ['.', '['].indexOf(this.look.content()) == -1) {
	        this.error();
	      }
	    }
	    else {
	      mmb = this.prmrexpr(noIn, noOf, yYield);
	    }
	    if(this.look
	      && (['.', '['].indexOf(this.look.content()) > -1
	        || this.look.type() == Token_1.TEMPLATE)) {
	      node.add(mmb);
	      if(this.look.content() == '.') {
	        node.add(
	          this.match(),
	          this.match(Token_1.ID, 'missing name after . operator')
	        );
	      }
	      else if(this.look.content() == '[') {
	        node.add(
	          this.match(),
	          this.expr(noIn, noOf, yYield),
	          this.match(']')
	        );
	      }
	      else {
	        node.add(this.match());
	      }
	      while(this.look) {
	        var temp;
	        if(this.look.content() == '.') {
	          temp = new Node_1$2(Node_1$2.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.match(Token_1.ID, 'missing name after . operator')
	          );
	          node = temp;
	        }
	        else if(this.look.content() == '[') {
	          temp = new Node_1$2(Node_1$2.MMBEXPR);
	          temp.add(
	            node,
	            this.match(),
	            this.expr(noIn, noOf, yYield),
	            this.match(']')
	          );
	          node = temp;
	        }
	        else if(this.look.type() == Token_1.TEMPLATE) {
	          temp = new Node_1$2(Node_1$2.MMBEXPR);
	          temp.add(
	            node,
	            this.match()
	          );
	          node = temp;
	        }
	        else {
	          break;
	        }
	      }
	    }
	    else {
	      return mmb;
	    }
	    return node;
	  },
	  prmrexpr: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.PRMREXPR);
	    switch(this.look.type()) {
	      case Token_1.ID:
	        if(noIn && this.look.content() == 'in') {
	          this.error();
	        }
	        if(noOf && this.look.content() == 'of') {
	          this.error();
	        }
	        node.add(this.idref(noIn, noOf));
	      break;
	      case Token_1.NUMBER:
	      case Token_1.STRING:
	      case Token_1.REG:
	      case Token_1.TEMPLATE:
	        node.add(this.match());
	      break;
	      case Token_1.TEMPLATE_HEAD:
	        return this.template(noIn, noOf, yYield);
	      default:
	        switch(this.look.content()) {
	          //LL2是否为*区分fnexpr和genexpr
	          case 'function':
	            for(var i = this.index; i < this.length; i++) {
	              var next = this.tokens[i];
	              if(!S$2[next.type()]) {
	                if(next.content() == '*') {
	                  node.add(this.genexpr(noIn, noOf));
	                }
	                else {
	                  node.add(this.fnexpr(noIn, noOf));
	                }
	                break;
	              }
	            }
	          break;
	          case 'async':
	            return this.asyncexpr();
	          case 'class':
	            node.add(this.classexpr(noIn, noOf));
	          break;
	          case 'this':
	          case 'null':
	          case 'true':
	          case 'false':
	            node.add(this.match());
	          break;
	          //LL2区分for是否为gencmph
	          case '(':
	            for(var i = this.index; i < this.length; i++) {
	              var next = this.tokens[i];
	              if(!S$2[next.type()]) {
	                if(next.content() == 'for') {
	                  node.add(this.gencmph(noIn, noOf, yYield));
	                }
	                else {
	                  node.add(this.cpeapl(noIn, noOf, yYield));
	                }
	                break;
	              }
	            }
	          break;
	          case '[':
	            node.add(this.arrinit(noIn, noOf));
	          break;
	          case '{':
	            node.add(this.objltr(noIn, noOf));
	          break;
	          default:
	            this.error();
	        }
	    }
	    return node;
	  },
	  template: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.TEMPLATE);
	    node.add(this.match());
	    while(this.look && this.look.type() != Token_1.TEMPLATE_TAIL) {
	      node.add(this.expr(noIn, noOf, yYield));
	      if(this.look && this.look.type() == Token_1.TEMPLATE_TAIL) {
	        break;
	      }
	      node.add(this.match(Token_1.TEMPLATE_MIDDLE));
	    }
	    node.add(this.match());
	    return node;
	  },
	  arrinit: function(noIn, noOf) {
	    //根据LL2分辨是arrltr还是arrcmph
	    //[assignexpr or [for
	    for(var i = this.index; i < this.length; i++) {
	      var next = this.tokens[i];
	      if(!S$2[next.type()]) {
	        if(next.content() == 'for') {
	          return this.arrcmph(noIn, noOf);
	        }
	        else {
	          return this.arrltr(noIn, noOf);
	        }
	      }
	    }
	    this.error();
	  },
	  gencmph: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.GENCMPH);
	    node.add(
	      this.match('('),
	      this.cmph(noIn, noOf, yYield),
	      this.match(')')
	    );
	    return node;
	  },
	  arrcmph: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.ARRCMPH);
	    node.add(
	      this.match('['),
	      this.cmph(noIn, noOf),
	      this.match(']', 'missing ] after element list')
	    );
	    return node;
	  },
	  cmph: function(noIn, noOf, yYield) {
	    var node = new Node_1$2(Node_1$2.CMPH);
	    node.add(this.cmphfor());
	    while(this.look && this.look.content() != ']') {
	      if(this.look.content() == 'for') {
	        node.add(this.cmphfor(noIn, noOf, yYield));
	      }
	      else if(this.look.content() == 'if') {
	        node.add(this.cmphif(noIn, noOf, yYield));
	      }
	      else {
	        node.add(this.assignexpr(noIn, noOf, yYield));
	        break;
	      }
	    }
	    return node;
	  },
	  cmphfor: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CMPHFOR);
	    node.add(
	      this.match('for'),
	      this.match('('),
	      this.forbind(noIn, noOf),
	      this.match('of'),
	      this.assignexpr(noIn, noOf),
	      this.match(')')
	    );
	    return node;
	  },
	  forbind: function(noIn, noOf) {
	    if(!this.look) {
	      this.error();
	    }
	    if(['[', '{'].indexOf(this.look.content()) > -1) {
	      return this.bindpat();
	    }
	    else {
	      return this.bindid(noIn, noOf);
	    }
	  },
	  cmphif: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CMPHIF);
	    node.add(
	      this.match('if'),
	      this.match('('),
	      this.assignexpr(noIn, noOf),
	      this.match(')')
	    );
	    return node;
	  },
	  arrltr: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.ARRLTR);
	    node.add(this.match('['));
	    while(this.look && this.look.content() != ']') {
	      if(this.look.content() == ',') {
	        node.add(this.match());
	      }
	      else if(this.look.content() == '...') {
	        node.add(this.spread(noIn, noOf));
	      }
	      else {
	        node.add(this.assignexpr(noIn, noOf));
	        if(this.look && this.look.content() == ',') {
	          node.add(this.match());
	        }
	      }
	    }
	    node.add(this.match(']', 'missing ] after element list'));
	    return node;
	  },
	  spread: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.SPREAD);
	    node.add(this.match('...'), this.assignexpr(noIn, noOf));
	    return node;
	  },
	  objltr: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.OBJLTR);
	    node.add(this.match('{'));
	    while(this.look && this.look.content() != '}') {
	      node.add(this.proptdef(noIn, noOf));
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match('}', 'missing } after property list'));
	    return node;
	  },
	  proptdef: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.PROPTDEF);
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '[') {
	      var cmpt = this.cmptpropt(noIn, noOf);
	      if(!this.look) {
	        this.error();
	      }
	      if(this.look.content() == ':') {
	        node.add(
	          this.proptname(cmpt, noIn, noOf),
	          this.match(),
	          this.assignexpr(noIn, noOf)
	        );
	      }
	      else {
	        node.add(cmpt);
	      }
	    }
	    else {
	      switch(this.look.type()) {
	        case Token_1.ID:
	          //LL2区分 (为method :为propt: assginment
	          var end = false;
	          for(var i = this.index; i < this.length; i++) {
	            var next = this.tokens[i];
	            if(!S$2[next.type()]) {
	              if([Token_1.KEYWORD, Token_1.ID].indexOf(next.type()) > -1 || next.content() == '(') {
	                node.add(this.method(noIn, noOf));
	                end = true;
	              }
	              else if(next.content() == '=') {
	                node.add(
	                  this.match(),
	                  this.initlz(noIn, noOf)
	                );
	                end = true;
	              }
	              else if([',', '}'].indexOf(next.content()) > -1) {
	                node.add(this.idref(noIn, noOf));
	                end = true;
	              }
	              break;
	            }
	          }
	          if(end) {
	            break;
	          }
	        case Token_1.STRING:
	        case Token_1.NUMBER:
	        case Token_1.KEYWORD:
	          node.add(
	            this.proptname(cmpt, noIn, noOf),
	            this.match(':', 'missing : after property id'),
	            this.assignexpr(noIn, noOf)
	          );
	        break;
	        default:
	          this.error('invalid property id');
	      }
	    }
	    return node;
	  },
	  idref: function(noIn, noOf) {
	    if(!this.look) {
	      this.error('invalid property id');
	    }
	    if(noIn && this.look.content() == 'in') {
	      this.error();
	    }
	    if(noOf && this.look.content() == 'of') {
	      this.error();
	    }
	    return this.match(Token_1.ID, 'invalid property id');
	  },
	  proptname: function(cmpt, noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.PROPTNAME);
	    if(!this.look) {
	      this.error('invalid property id');
	    }
	    if(cmpt) {
	      node.add(cmpt);
	    }
	    else if(this.look.content() == '[') {
	      node.add(this.cmptpropt(noIn, noOf));
	    }
	    else {
	      node.add(this.ltrpropt(noIn, noOf));
	    }
	    return node;
	  },
	  ltrpropt: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.LTRPROPT);
	    switch(this.look.type()) {
	      case Token_1.ID:
	        if(noIn && this.look.content() == 'in') {
	          this.error();
	        }
	        if(noOf && this.look.content() == 'of') {
	          this.error();
	        }
	      case Token_1.NUMBER:
	      case Token_1.STRING:
	      case Token_1.KEYWORD:
	        node.add(this.match());
	        return node;
	      default:
	        this.error('invalid property id');
	    }
	  },
	  cmptpropt: function(noIn, noOf) {
	    var node = new Node_1$2(Node_1$2.CMPTPROPT);
	    node.add(
	      this.match('['),
	      this.assignexpr(noIn, noOf),
	      this.match(']')
	    );
	    return node;
	  },
	  args: function() {
	    var node = new Node_1$2(Node_1$2.ARGS);
	    node.add(this.match('('));
	    if(!this.look) {
	      this.error();
	    }
	    node.add(this.arglist());
	    node.add(this.match(')'));
	    return node;
	  },
	  arglist: function() {
	    var node = new Node_1$2(Node_1$2.ARGLIST);
	    if(this.look && this.look.content() == '...') {
	      node.add(
	        this.match(),
	        this.assignexpr()
	      );
	    }
	    else if(this.look && this.look.content() != ')') {
	      while(this.look) {
	        node.add(this.assignexpr());
	        if(this.look) {
	          if(this.look.content() == ',') {
	            node.add(this.match());
	            if(this.look && this.look.content() == '...') {
	              node.add(
	                this.match(),
	                this.assignexpr()
	              );
	              break;
	            }
	          }
	          else if(this.look.content() == ')') {
	            break;
	          }
	        }
	      }
	    }
	    return node;
	  },
	  virtual: function(s) {
	    return new Node_1$2(Node_1$2.TOKEN, new Token_1(Token_1.VIRTUAL, s));
	  },
	  match: function(type, line, msg) {
	    if(typeof type == 'boolean') {
	      msg = line;
	      line = type;
	      type = undefined;
	    }
	    if(typeof line != 'boolean') {
	      line = false;
	      msg = line;
	    }
	    //未定义为所有非空白token
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$2(Node_1$2.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      //特殊处理;，不匹配但有换行或者末尾时自动补全，还有受限行
	      if(type == ';'
	        && (!this.look
	          || (this.look.content() != type && this.hasMoveLine)
	          || this.look.content() == '}')
	      ) {
	        if(this.look && S$2[this.look.type()]) {
	          this.move();
	        }
	        return this.virtual(';');
	      }
	      else if(this.look && this.look.content() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$2(Node_1$2.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$2(Node_1$2.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + Token_1.type(type) + (msg || ''));
	      }
	    }
	  },
	  move: function(line) {
	    this.lastLine = this.line;
	    this.lastCol = this.col;
	    //遗留下来的换行符
	    this.hasMoveLine = false;
	    do {
	      this.look = this.tokens[this.index++];
	      if(!this.look) {
	        return;
	      }
	      //存下忽略的token
	      if(S$2[this.look.type()]) {
	        this.ignores[this.index - 1] = this.look;
	      }
	      //包括line的情况下要跳出
	      if(this.look.type() == Token_1.LINE) {
	        this.line++;
	        this.col = 1;
	        this.hasMoveLine = true;
	        if(line) {
	          break;
	        }
	      }
	      else if(this.look.type() == Token_1.COMMENT) {
	        var s = this.look.content();
	        var n = character.count(this.look.content(), character.LINE);
	        if(n > 0) {
	          this.line += n;
	          var i = s.lastIndexOf(character.LINE);
	          this.col += s.length - i - 1;
	          this.hasMoveLine = true;
	          if(line) {
	            break;
	          }
	        }
	      }
	      else {
	        this.col += this.look.content().length;
	        if(!S$2[this.look.type()]) {
	          break;
	        }
	      }
	    } while(this.index <= this.length);
	  },
	  error: function(msg) {
	    msg = 'SyntaxError: ' + (msg || ' syntax error');
	    throw new Error(msg + ' line ' + this.lastLine + ' col ' + this.lastCol);
	  }
	}).statics({
	  S: S$2
	});
	var Parser_1$2 = Parser$2;

	var Node$3 = Node_1.extend(function(type, children) {
	  Node_1.call(this, type, children);
	  return this;
	}).statics({
	  SHEET: 'sheet',
	  ELEMENT: 'element',
	  IMPORT: 'import',
	  MEDIA: 'media',
	  CHARSET: 'charset',
	  MEDIAQLIST: 'mediaqlist',
	  MEDIAQUERY: 'mediaquer',
	  MEDIATYPE: 'mediatype',
	  NAMESPACE: 'namespace',
	  DOC: 'doc',
	  EXPR: 'expression',
	  BLOCK: 'block',
	  STYLESET: 'styleset',
	  STYLE: 'style',
	  SELECTORS: 'selectors',
	  SELECTOR: 'selector',
	  KEY: 'key',
	  VALUE: 'value',
	  FONTFACE: 'fontface',
	  KEYFRAMES: 'kframes',
	  PAGE: 'page',
	  URL: 'url',
	  LINEARGRADIENT: 'lineargradient',
	  POINT: 'point',
	  COLORSTOP: 'colorstop',
	  RADIOGRADIENT: 'radiogradient',
	  POS: 'pos',
	  LEN: 'len',
	  LENGTH: 'length',
	  RGB: 'rgb',
	  RGBA: 'rgba',
	  HSL: 'hsl',
	  HSLA: 'hsla',
	  MAX: 'max',
	  MIN: 'min',
	  VARDECL: 'vardecl',
	  EXTEND: 'extend',
	  FORMAT: 'format',
	  FN: 'function',
	  PARAMS: 'params',
	  FNC: 'fncall',
	  CPARAMS: 'cparams',
	  CTSTYLE: 'ctstyle',
	  VIEWPORT: 'viewport',
	  SUPPORTS: 'supports',
	  CNDT: 'cndt',
	  ADDEXPR: 'addexpr',
	  MTPLEXPR: 'mtplexpr',
	  PRMREXPR: 'prmrexpr',
	  PARAM: 'param',
	  COUNTER: 'counter',
	  CALC: 'calc',
	  TOGGLE: 'toggle',
	  ATTR: 'attr',
	  FILTER: 'filter',
	  TRANSLATE: 'translate',
	  "TRANSLATE3D": 'translate3d',
	  TRANSLATEX: 'translatex',
	  TRANSLATEY: 'translatey',
	  TRANSLATEZ: 'translatez',
	  ROTATE: 'rotate',
	  "ROTATE3D": 'rotate3d',
	  ROTATEX: 'rotatex',
	  ROTATEY: 'rotatey',
	  ROTATEZ: 'rotatez',
	  SCALE: 'scale',
	  "SCALE3D": 'scale3d',
	  SCALEX: 'scalex',
	  SCALEY: 'scaley',
	  SCALEZ: 'scalez',
	  VARS: 'vars',
	  BRACKET: 'bracket',
	  URLPREFIX: 'ulrprefix',
	  DOMAIN: 'domain',
	  REGEXP: 'regexp',
	  IFSTMT: 'ifstmt',
	  FORSTMT: 'forstmt',
	  VARSTMT: 'varstmt',
	  EQSTMT: 'eqstmt',
	  RELSTMT: 'relstmt',
	  ADDSTMT: 'addstmt',
	  MTPLSTMT: 'mtplstmt',
	  POSTFIXSTMT: 'postfixstmt',
	  MMBSTMT: 'mmbstmt',
	  PRMRSTMT: 'prmrstmt',
	  ARRLTR: 'arrltr',
	  DIR: 'dir',
	  UNBOX: 'unbox',
	  BASENAME: 'basename',
	  EXTNAME: 'extname',
	  WIDTH: 'width',
	  HEIGHT: 'height',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys$2) {
	      var self = this;
	      keys$2 = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys$2[v] = k;
	      });
	    }
	    return keys$2[s];
	  }
	});
	var keys$2;
	var Node_1$3 = Node$3;

	var S$3 = {};
	S$3[CssToken_1.BLANK] = S$3[CssToken_1.TAB] = S$3[CssToken_1.COMMENT] = S$3[CssToken_1.LINE] = true;

	var MQL = {
	  'only': true,
	  'not': true,
	  'all': true,
	  'aural': true,
	  'braille': true,
	  'handheld': true,
	  'print': true,
	  'projection': true,
	  'screen': true,
	  'tty': true,
	  'embossed': true,
	  'tv': true,
	  '(': true
	};

	var MT = {
	  'all': true,
	  'aural': true,
	  'braille': true,
	  'handheld': true,
	  'print': true,
	  'projection': true,
	  'screen': true,
	  'tty': true,
	  'embossed': true,
	  'tv': true
	};

	var NO_MTPL = {
	  'font': true,
	  'border-image': true,
	  'device-aspect-ratio': true,
	  'device-pixel-ratio': true,
	  'min-device-pixel-ratio': true,
	  'max-device-pixel-ratio': true,
	  'min--moz-device-pixel-ratio': true,
	  'max--moz-device-pixel-ratio': true
	};

	var Parser$3 = Parser_1.extend(function(lexer) {
	  Parser_1.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  init: function(lexer) {
	    if(lexer) {
	      this.lexer = lexer;
	    }
	    else if(this.lexer) {
	      this.lexer.init();
	    }
	    else {
	      this.lexer = new Lexer_1(new CssRule_1());
	    }
	    this.look = null;
	    this.tokens = null;
	    this.lastLine = 1;
	    this.lastCol = 1;
	    this.line = 1;
	    this.col = 1;
	    this.index = 0;
	    this.length = 0;
	    this.ignores = {};
	    this.tree = {};
	  },
	  parse: function(code) {
	    this.lexer.parse(code);
	    this.tree = this.sheet();
	    return this.tree;
	  },
	  ast: function() {
	    return this.tree;
	  },
	  sheet: function() {
	    this.tokens = this.lexer.tokens();
	    this.length = this.tokens.length;
	    if(this.tokens.length) {
	      this.move();
	    }
	    var node = new Node_1$3(Node_1$3.SHEET);
	    while(this.look) {
	      var element = this.element();
	      if(element) {
	        node.add(element);
	      }
	    }
	    return node;
	  },
	  element: function() {
	    switch(this.look.type()) {
	      case CssToken_1.HEAD:
	        return this.head();
	      case CssToken_1.VARS:
	        var isFn = false;
	        for(var i = this.index; i < this.length; i++) {
	          var t = this.tokens[i];
	          if(!S$3.hasOwnProperty(t.type())) {
	            isFn = t.content() == '(';
	            break;
	          }
	        }
	        return isFn ? this.fn() : this.varstmt();
	      case CssToken_1.SELECTOR:
	      case CssToken_1.PSEUDO:
	        return this.styleset();
	      default:
	        if(this.look.content() == '[' && this.look.type() != CssToken_1.HACK) {
	          return this.styleset();
	        }
	        if(['{', '}'].indexOf(this.look.content()) > -1) {
	          this.error();
	        }
	        return this.match();
	    }
	  },
	  head: function() {
	    var s = this.look.content().toLowerCase();
	    s = s.replace(/^@(-moz-|-o-|-ms-|-webkit-)/, '@');
	    switch(s) {
	      case '@import':
	        return this.impt();
	      case '@media':
	        return this.media();
	      case '@charset':
	        return this.charset();
	      case '@font-face':
	        return this.fontface();
	      case '@keyframes':
	        return this.kframes();
	      case '@page':
	        return this.page();
	      case '@namespace':
	        return this.namespace();
	      case '@document':
	        return this.doc();
	      case '@counter-style':
	        return this.ctstyle();
	      case '@viewport':
	        return this.viewport();
	      case '@supports':
	        return this.supports();
	      case '@extend':
	        return this.extend();
	      case '@if':
	        return this.ifstmt();
	      case '@for':
	        return this.forstmt();
	      default:
	        this.error('unknow head');
	    }
	  },
	  extend: function() {
	    var node = new Node_1$3(Node_1$3.EXTEND);
	    node.add(this.match());
	    if(!this.look) {
	      this.error();
	    }
	    node.add(this.selectors());
	    node.add(this.match(';'));
	    return node;
	  },
	  supports: function() {
	    var node = new Node_1$3(Node_1$3.SUPPORTS);
	    node.add(this.match());
	    while(this.look && this.look.content() != '{') {
	      node.add(this.cndt());
	    }
	    node.add(this.block());
	    return node;
	  },
	  cndt: function() {
	    var node = new Node_1$3(Node_1$3.CNDT);
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content().toLowerCase()) {
	      case 'and':
	      case 'not':
	      case 'or':
	        node.add(this.match());
	        node.add(this.cndt());
	        break;
	      case '(':
	        node.add(
	          this.match(),
	          this.cndt(),
	          this.match(')')
	        );
	        break;
	      default:
	        node.add(this.style(null, true));
	        break;
	    }
	    return node;
	  },
	  viewport: function() {
	    var node = new Node_1$3(Node_1$3.VIEWPORT);
	    node.add(this.match());
	    node.add(this.block());
	    return node;
	  },
	  ctstyle: function() {
	    var node = new Node_1$3(Node_1$3.CTSTYLE);
	    node.add(this.match());
	    node.add(this.match(CssToken_1.ID));
	    node.add(this.block());
	    return node;
	  },
	  impt: function() {
	    var node = new Node_1$3(Node_1$3.IMPORT);
	    node.add(this.match());
	    node.add(this.url(true));
	    if(this.look && MQL.hasOwnProperty(this.look.content().toLowerCase())) {
	      node.add(this.mediaQList());
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  media: function() {
	    var node = new Node_1$3(Node_1$3.MEDIA);
	    node.add(this.match());
	    if(!this.look) {
	      this.error();
	    }
	    if(MQL.hasOwnProperty(this.look.content().toLowerCase())
	      || this.look.type() == CssToken_1.HACK) {
	      node.add(this.mediaQList());
	    }
	    if(this.look && this.look.content() == '{') {
	      node.add(this.block());
	    }
	    return node;
	  },
	  mediaQList: function() {
	    var node = new Node_1$3(Node_1$3.MEDIAQLIST);
	    node.add(this.mediaQuery());
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.mediaQuery()
	      );
	    }
	    return node;
	  },
	  mediaQuery: function() {
	    var node = new Node_1$3(Node_1$3.MEDIAQUERY);
	    if(this.look && ['only', 'not'].indexOf(this.look.content().toLowerCase()) > -1) {
	      node.add(this.match());
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '(') {
	      node.add(this.expr());
	    }
	    else {
	      node.add(this.mediaType());
	    }
	    while(this.look && this.look.content().toLowerCase() == 'and') {
	      node.add(
	        this.match(),
	        this.expr()
	      );
	    }
	    return node;
	  },
	  mediaType: function() {
	    var node = new Node_1$3(Node_1$3.MEDIATYPE);
	    if(this.look && this.look.type() == CssToken_1.HACK) {
	      node.add(this.match());
	    }
	    if(this.look && MT.hasOwnProperty(this.look.content().toLowerCase())) {
	      node.add(this.match());
	    }
	    else {
	      while(this.look
	      && [CssToken_1.ID, CssToken_1.NUMBER, CssToken_1.UNITS, CssToken_1.PROPERTY].indexOf(this.look.type()) > -1
	      && !MT.hasOwnProperty(this.look.content().toLowerCase())) {
	        node.add(this.match());
	      }
	    }
	    while(this.look && this.look.type() == CssToken_1.HACK) {
	      node.add(this.match());
	      if(this.look && MT.hasOwnProperty(this.look.content().toLowerCase())) {
	        node.add(this.match());
	      }
	      else {
	        while(this.look
	        && [CssToken_1.ID, CssToken_1.NUMBER, CssToken_1.UNITS, CssToken_1.PROPERTY].indexOf(this.look.type()) > -1
	        && !MT.hasOwnProperty(this.look.content().toLowerCase())) {
	          node.add(this.match());
	        }
	      }
	    }
	    return node;
	  },
	  expr: function() {
	    var node = new Node_1$3(Node_1$3.EXPR);
	    node.add(this.match('('));
	    var k = this.key();
	    node.add(k);
	    var first = k.first();
	    if(first.token().type() == CssToken_1.HACK) {
	      first = first.next();
	    }
	    var name = first.token().content().toLowerCase();
	    //有可能整个变量作为一个键值，无需再有:value部分
	    if(this.look && this.look.content() == ':') {
	      node.add(this.match(':'));
	      node.add(this.value(name));
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  charset: function() {
	    var node = new Node_1$3(Node_1$3.CHARSET);
	    node.add(this.match());
	    node.add(this.addexpr(CssToken_1.STRING));
	    node.add(this.match(';'));
	    return node;
	  },
	  fontface: function() {
	    var node = new Node_1$3(Node_1$3.FONTFACE);
	    node.add(this.match());

	    var node2 = new Node_1$3(Node_1$3.BLOCK);
	    node2.add(this.match('{'));

	    outer:
	    while(this.look) {
	      if(this.look.type() == CssToken_1.VARS) {
	        var isFnCall = false;
	        for(var i = this.index; i < this.length; i++) {
	          var t = this.tokens[i];
	          if(!S$3.hasOwnProperty(t.type())) {
	            isFnCall = t.content() == '(';
	            break;
	          }
	        }
	        if(isFnCall) {
	          node2.add(this.fnc());
	        }
	        else {
	          node2.add(this.addexpr());
	          if(this.look && this.look.content() == ':') {
	            node2.add(
	              this.match(),
	              this.value()
	            );
	          }
	          else {
	            node2.add(this.match(';'));
	          }
	        }
	        break;
	      }
	      switch(this.look.content().toLowerCase()) {
	        case 'font-family':
	        case 'src':
	        case 'font-weight':
	        case 'font-style':
	          node2.add(this.style(this.look.content()));
	          break;
	        default:
	          break outer;
	      }
	    }
	    while(this.look && this.look.content() != '}') {
	      node2.add(this.style());
	    }
	    node2.add(this.match('}'));
	    node.add(node2);
	    return node;
	  },
	  kframes: function() {
	    var node = new Node_1$3(Node_1$3.KEYFRAMES);
	    node.add(this.match());
	    node.add(this.match(CssToken_1.ID));
	    while(this.look && [CssToken_1.ID, CssToken_1.VARS].indexOf(this.look.type()) > -1) {
	      node.add(this.match());
	    }
	    node.add(this.block(true));
	    return node;
	  },
	  page: function() {
	    var node = new Node_1$3(Node_1$3.PAGE);
	    node.add(this.match());
	    if(this.look && this.look.type() == CssToken_1.ID) {
	      node.add(this.match());
	    }
	    if(this.look && this.look.type() == CssToken_1.PSEUDO) {
	      node.add(this.match());
	    }
	    node.add(this.block());
	    return node;
	  },
	  fn: function() {
	    var node = new Node_1$3(Node_1$3.FN);
	    node.add(
	      this.match(CssToken_1.VARS),
	      this.params(),
	      this.block()
	    );
	    return node;
	  },
	  params: function() {
	    var node = new Node_1$3(Node_1$3.PARAMS);
	    node.add(this.match('('));
	    while(this.look && this.look.content() != ')') {
	      node.add(this.match(CssToken_1.VARS));
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  fnc: function() {
	    var node = new Node_1$3(Node_1$3.FNC);
	    node.add(
	      this.match(),
	      this.cparams()
	    );
	    return node;
	  },
	  cparams: function() {
	    var node = new Node_1$3(Node_1$3.CPARAMS);
	    node.add(this.match('('));
	    while(this.look && this.look.content() != ')') {
	      if(this.look.content() == '~'
	        && this.tokens[this.index]
	        && [CssToken_1.VARS, CssToken_1.STRING].indexOf(this.tokens[this.index].type()) > -1) {
	        node.add(this.unbox());
	      }
	      else if(this.look.content() == '[') {
	        node.add(this.arrltr());
	      }
	      else if(this.look.content() == '@dir') {
	        node.add(this.dir());
	      }
	      else if(this.look.type() == CssToken_1.KEYWORD || this.look.type() == CssToken_1.HACK) {
	        node.add(this.style(null, true, true));
	      }
	      else {
	        node.add(this.value(null, true));
	      }
	      if(this.look && this.look.content() == ',') {
	        node.add(this.match());
	      }
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  namespace: function() {
	    var node = new Node_1$3(Node_1$3.NAMESPACE);
	    node.add(this.match());
	    if(this.look && this.look.type() == CssToken_1.ID) {
	      node.add(this.match());
	    }
	    node.add(this.addexpr(CssToken_1.STRING));
	    node.add(this.match(';'));
	    return node;
	  },
	  doc: function() {
	    var node = new Node_1$3(Node_1$3.DOC);
	    node.add(this.match());
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.content().toLowerCase()) {
	      case 'url-prefix':
	      case 'domain':
	      case 'regexp':
	        node.add(this.urlPrefix(this.look.content().toUpperCase().replace('-', '')));
	        break;
	      case 'url':
	        node.add(this.url());
	        break;
	      default:
	        this.error();
	    }
	    while(this.look && this.look.content() == ',') {
	      node.add(this.match());
	      if(!this.look) {
	        this.error();
	      }
	      switch(this.look.content().toLowerCase()) {
	        case 'url-prefix':
	        case 'domain':
	        case 'regexp':
	          node.add(this.urlPrefix(this.look.content().toUpperCase().replace('-', '')));
	          break;
	        case 'url':
	          node.add(this.url());
	          break;
	        default:
	          this.error();
	      }
	    }
	    if(this.look && this.look.content() == '{') {
	      node.add(this.block());
	    }
	    return node;
	  },
	  urlPrefix: function(name) {
	    var node = new Node_1$3(Node_1$3[name]);
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    if(this.look && this.look.content() != ')') {
	      node.add(this.addexpr(CssToken_1.STRING));
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  vardecl: function() {
	    var node = new Node_1$3(Node_1$3.VARDECL);
	    node.add(this.match());
	    if(!this.look) {
	      this.error();
	    }
	    if([':', '='].indexOf(this.look.content()) > -1) {
	      node.add(this.match());
	    }
	    else {
	      this.error();
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '[') {
	      node.add(this.arrltr());
	    }
	    else if(this.look.content() == '@dir') {
	      node.add(this.dir());
	    }
	    else if(this.look.type() == CssToken_1.KEYWORD || this.look.type() == CssToken_1.HACK) {
	      node.add(this.style(null, true, true));
	    }
	    else {
	      node.add(this.value(null, true));
	    }
	    return node;
	  },
	  styleset: function(kf) {
	    var node = new Node_1$3(Node_1$3.STYLESET);
	    node.add(this.selectors(kf));
	    //兼容less的继承写法，即只写一个选择器
	    if(this.look && [';', '}'].indexOf(this.look.content()) > -1) {
	      node.name(Node_1$3.EXTEND);
	      var extend = new CssToken_1(CssToken_1.VIRTUAL, '@extend');
	      extend = new Node_1$3(Node_1$3.TOKEN, extend);
	      node.addFirst(extend);
	      return node;
	    }
	    node.add(this.block());
	    return node;
	  },
	  selectors: function(kf) {
	    var node = new Node_1$3(Node_1$3.SELECTORS);
	    node.add(this.selector(kf));
	    while(this.look && this.look.content() == ',') {
	      node.add(this.match());
	      node.add(this.selector(kf));
	    }
	    return node;
	  },
	  selector: function(kf) {
	    var node = new Node_1$3(Node_1$3.SELECTOR);
	    if(!this.look) {
	      this.error();
	    }
	    if(kf && this.look.type() == CssToken_1.NUMBER) {
	      node.add(this.match());
	      node.add(this.match('%'));
	    }
	    else {
	      var s = this.look.content().toLowerCase();
	      if(s == '[' && this.look.type() != CssToken_1.HACK) {
	        this.bracket1(node);
	      }
	      else {
	        node.add(this.match([CssToken_1.SELECTOR, CssToken_1.PSEUDO, CssToken_1.HACK, CssToken_1.VARS]));
	      }
	      while(this.look && [',', ';', '{', '}'].indexOf(this.look.content()) == -1) {
	        if(this.look.content() == '[' && this.look.type() != CssToken_1.HACK) {
	          this.bracket1(node);
	        }
	        else if(this.look.content() == '(') {
	          this.bracket2(node);
	        }
	        else {
	          node.add(this.match([CssToken_1.SELECTOR, CssToken_1.PSEUDO, CssToken_1.SIGN, CssToken_1.HACK, CssToken_1.VARS]));
	        }
	      }
	    }
	    return node;
	  },
	  bracket1: function(node) {
	    node.add(this.match());
	    while(this.look && [']', '(', ')'].indexOf(this.look.content()) == -1) {
	      node.add(this.match([CssToken_1.ATTR, CssToken_1.SIGN, CssToken_1.VARS, CssToken_1.NUMBER, CssToken_1.UNITS, CssToken_1.STRING]));
	    }
	    node.add(this.match(']'));
	  },
	  bracket2: function(node) {
	    node.add(this.match());
	    while(this.look && this.look.content() != ')') {
	      if(this.look.content() == '[') {
	        this.bracket1(node);
	      }
	      if(this.look && this.look.content() == ')') {
	        break;
	      }
	      node.add(this.match([CssToken_1.SELECTOR, CssToken_1.PSEUDO, CssToken_1.VARS, CssToken_1.NUMBER, CssToken_1.UNITS]));
	    }
	  },
	  block: function(kf) {
	    var node = new Node_1$3(Node_1$3.BLOCK);
	    node.add(this.match('{'));
	    while(this.look
	      && this.look.content() != '}') {
	      if(this.look.type() == CssToken_1.SELECTOR
	        || this.look.content() == '['
	          && this.look.type() != CssToken_1.HACK) {
	        node.add(this.styleset());
	      }
	      else if(kf && this.look.type() == CssToken_1.NUMBER) {
	        node.add(this.styleset(kf));
	      }
	      else if(this.look.type() == CssToken_1.HEAD) {
	        node.add(this.head());
	      }
	      else if(this.look.type() == CssToken_1.VARS) {
	        var isFnCall = false;
	        var isDecl = false;
	        for(var i = this.index; i < this.length; i++) {
	          var t = this.tokens[i];
	          if(!S$3.hasOwnProperty(t.type())) {
	            isFnCall = t.content() == '(';
	            isDecl = [':', '='].indexOf(t.content()) > -1;
	            break;
	          }
	        }
	        if(isFnCall) {
	          node.add(this.fnc());
	        }
	        else if(isDecl) {
	          node.add(this.varstmt());
	        }
	        else {
	          node.add(this.addexpr());
	          if(this.look && this.look.content() == ':') {
	            node.add(
	              this.match(),
	              this.value()
	            );
	          }
	          else {
	            node.add(this.match(';'));
	          }
	        }
	      }
	      else if(this.look.content() == ';') {
	        node.add(this.match());
	      }
	      else {
	        node.add(this.style());
	      }
	    }
	    node.add(this.match('}'));
	    return node;
	  },
	  style: function(name, noS, noC) {
	    var node = new Node_1$3(Node_1$3.STYLE);
	    var k = this.key(name);
	    node.add(k);
	    var first = k.first();
	    if(first.token().type() == CssToken_1.HACK) {
	      first = first.next();
	    }
	    name = first.token().content().toLowerCase();
	    node.add(this.match(':'));
	    node.add(this.value(name, noC));
	    while(this.look && this.look.type() == CssToken_1.HACK) {
	      node.add(this.match());
	    }
	    if(!noS) {
	      node.add(this.match(';'));
	    }
	    return node;
	  },
	  key: function(name) {
	    var node = new Node_1$3(Node_1$3.KEY);
	    while(this.look && this.look.type() == CssToken_1.HACK) {
	      node.add(this.match());
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(name) {
	      if(this.look.type() == CssToken_1.VARS) {
	        node.add(this.match());
	      }
	      else {
	        node.add(this.match(name));
	      }
	    }
	    else {
	      node.add(this.addexpr([CssToken_1.STRING, CssToken_1.KEYWORD]));
	    }
	    return node;
	  },
	  value: function(name, noComma) {
	    var node = new Node_1$3(Node_1$3.VALUE);
	    if(!this.look) {
	      this.error();
	    }
	    var s = this.look.content().toLowerCase();
	    if(s == '~'
	      && this.tokens[this.index]
	      && [CssToken_1.VARS, CssToken_1.STRING].indexOf(this.tokens[this.index].type()) > -1) {
	      node.add(this.unbox());
	      return node;
	    }
	    var pCount = 0;
	    var bCount = 0;
	    if([CssToken_1.COLOR, CssToken_1.HACK, CssToken_1.VARS, CssToken_1.ID, CssToken_1.PROPERTY, CssToken_1.NUMBER, CssToken_1.STRING, CssToken_1.HEAD, CssToken_1.SIGN, CssToken_1.UNITS, CssToken_1.KEYWORD].indexOf(this.look.type()) > -1
	      && [';', '}'].indexOf(s) == -1) {
	      //内置函数必须后跟(
	      var next = this.tokens[this.index] && this.tokens[this.index].content() == '(';
	      switch(s) {
	        case 'var':
	          node.add(next ? this.vars() : this.match());
	          break;
	        case 'url':
	          node.add(next ? this.url() : this.match());
	          break;
	        case 'format':
	          node.add(next ? this.format() : this.match());
	          break;
	        case 'rgb':
	          node.add(next ? this.rgb() : this.match());
	          break;
	        case 'rgba':
	          node.add(next ? this.rgb(true) : this.match());
	          break;
	        case 'hsl':
	          node.add(next ? this.hsl() : this.match());
	          break;
	        case 'hsla':
	          node.add(next ? this.hsl(true) : this.match());
	          break;
	        case 'max':
	          node.add(next ? this.minmax(true) : this.match());
	          break;
	        case 'min':
	          node.add(next ? this.minmax() : this.match());
	          break;
	        case 'calc':
	          node.add(next ? this.calc() : this.match());
	          break;
	        //这几个语法完全一样
	        //cycle是toggle的老版本写法
	        case 'cycle':
	        case 'toggle':
	        case 'counter':
	        case 'attr':
	        case 'translate':
	        case 'rect':
	        case 'translate3d':
	        case 'translatex':
	        case 'translatey':
	        case 'translatez':
	        case 'rotate':
	        case 'rotate3d':
	        case 'rotatex':
	        case 'rotatey':
	        case 'rotatez':
	        case 'scale':
	        case 'scale3d':
	        case 'scalex':
	        case 'scaley':
	        case 'scalez':
	          node.add(next ? this.counter(s) : this.match());
	          break;
	        case 'linear-gradient':
	        case 'repeating-linear-gradient':
	          node.add(next ? this.lg() : this.match());
	          break;
	        case 'radial-gradient':
	        case 'repeating-radial-gradient':
	          node.add(next ? this.rg() : this.match());
	          break;
	        case 'alpha':
	        case 'blur':
	        case 'chroma':
	        case 'dropshadow':
	        case 'fliph':
	        case 'flipv':
	        case 'glow':
	        case 'gray':
	        case 'invert':
	        case 'light':
	        case 'mask':
	        case 'shadow':
	        case 'wave':
	        case 'xray':
	        case 'dximagetransform.microsoft.gradient':
	          node.add(next ? this.filter() : this.match());
	          break;
	        default:
	          if(s == '(') {
	            pCount++;
	          }
	          else if(s == ')') {
	            this.error();
	          }
	          else if(noComma && s == ',') {
	            this.error();
	          }
	          else if(s == '[') {
	            bCount++;
	          }
	          else if(s == ']') {
	            if(bCount == 0) {
	              return node;
	            }
	            bCount--;
	          }
	          //LL2确定是否是fncall
	          var fncall = false;
	          if(this.look.type() == CssToken_1.VARS) {
	            for(var i = this.index; i < this.length; i++) {
	              var t = this.tokens[i];
	              if(!S$3.hasOwnProperty(t.type())) {
	                if(t.content() == '(') {
	                  fncall = true;
	                }
	                break;
	              }
	            }
	          }
	          if(fncall) {
	            node.add(this.fnc());
	          }
	          else if(NO_MTPL.hasOwnProperty(name)) {
	            node.add(this.addexpr(undefined, null, true));
	          }
	          else {
	            node.add(this.addexpr());
	          }
	          break;
	      }
	    }
	    else {
	      this.error();
	    }
	    outer:
	    while(this.look) {
	      s = this.look.content().toLowerCase();
	      if([CssToken_1.COLOR, CssToken_1.HACK, CssToken_1.VARS, CssToken_1.ID, CssToken_1.PROPERTY, CssToken_1.NUMBER, CssToken_1.STRING, CssToken_1.HEAD, CssToken_1.KEYWORD, CssToken_1.SIGN, CssToken_1.UNITS, CssToken_1.KEYWORD].indexOf(this.look.type()) > -1
	        && [';', '}'].indexOf(this.look.content()) == -1) {
	        //内置函数必须后跟(
	        var next = this.tokens[this.index] && this.tokens[this.index].content() == '(';
	        switch(s) {
	          case 'var':
	            node.add(next ? this.vars() : this.match());
	            break;
	          case 'url':
	            node.add(next ? this.url() : this.match());
	            break;
	          case 'format':
	            node.add(next ? this.format() : this.match());
	            break;
	          case 'rgb':
	            node.add(next ? this.rgb() : this.match());
	            break;
	          case 'rgba':
	            node.add(next ? this.rgb(true) : this.match());
	            break;
	          case 'hsl':
	            node.add(next ? this.hsl() : this.match());
	            break;
	          case 'hsla':
	            node.add(next ? this.hsl(true) : this.match());
	            break;
	          case 'min':
	            node.add(next ? this.minmax() : this.match());
	            break;
	          case 'max':
	            node.add(next ? this.minmax(true) : this.match());
	            break;
	          case 'calc':
	            node.add(next ? this.calc() : this.match());
	            break;
	          //这几个语法完全一样
	          //cycle是toggle的老版本写法
	          case 'cycle':
	          case 'toggle':
	          case 'counter':
	          case 'attr':
	          case 'translate':
	          case 'rect':
	          case 'translate3d':
	          case 'translatex':
	          case 'translatey':
	          case 'translatez':
	          case 'rotate':
	          case 'rotate3d':
	          case 'rotatex':
	          case 'rotatey':
	          case 'rotatez':
	          case 'scale':
	          case 'scale3d':
	          case 'scalex':
	          case 'scaley':
	          case 'scalez':
	            node.add(next ? this.counter(s) : this.match());
	            break;
	          case 'linear-gradient':
	          case 'repeating-linear-gradient':
	            node.add(next ? this.lg() : this.match());
	            break;
	          case 'radial-gradient':
	          case 'repeating-radial-gradient':
	            node.add(next ? this.rg() : this.match());
	            break;
	          case 'alpha':
	          case 'blur':
	          case 'chroma':
	          case 'dropshadow':
	          case 'fliph':
	          case 'flipv':
	          case 'glow':
	          case 'gray':
	          case 'invert':
	          case 'light':
	          case 'mask':
	          case 'shadow':
	          case 'wave':
	          case 'xray':
	          case 'dximagetransform.microsoft.gradient':
	            node.add(next ? this.filter() : this.match());
	            break;
	          default:
	            if(s == '(') {
	              pCount++;
	            }
	            else if(s == ')') {
	              pCount--;
	              if(pCount < 0) {
	                break outer;
	              }
	            }
	            else if(noComma && s == ',') {
	              break outer;
	            }
	            else if(s == '[') {
	              bCount++;
	            }
	            else if(s == ']') {
	              if(bCount == 0) {
	                return node;
	              }
	              bCount--;
	            }
	            else if(s == '~'
	              && this.tokens[this.index]
	              && [CssToken_1.VARS, CssToken_1.STRING].indexOf(this.tokens[this.index].type()) > -1) {
	              node.add(this.unbox());
	              break;
	            }
	            //LL2确定是否是fncall
	            var fncall = false;
	            if(this.look.type() == CssToken_1.VARS) {
	              for(var i = this.index; i < this.length; i++) {
	                var t = this.tokens[i];
	                if(!S$3.hasOwnProperty(t.type())) {
	                  if(t.content() == '(') {
	                    fncall = true;
	                  }
	                  break;
	                }
	              }
	            }
	            if(fncall) {
	              node.add(this.fnc());
	            }
	            else if(NO_MTPL.hasOwnProperty(name)) {
	              node.add(this.addexpr(undefined, null, true));
	            }
	            else {
	              node.add(this.addexpr());
	            }
	            break;
	        }
	      }
	      else {
	        break;
	      }
	    }
	    if(this.look && this.look.type() == CssToken_1.IMPORTANT) {
	      node.add(this.match());
	    }
	    return node;
	  },
	  rg: function() {
	    var node = new Node_1$3(Node_1$3.RADIOGRADIENT);
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.type() == CssToken_1.NUMBER
	      || ['left', 'center', 'right'].indexOf(this.look.content().toLowerCase()) > -1) {
	      node.add(this.pos());
	      node.add(this.match(','));
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.type() == CssToken_1.NUMBER) {
	      node.add(this.len());
	      node.add(this.len());
	    }
	    else {
	      node.add(this.match(['circle', 'ellipse', 'closest-side', 'closest-corner', 'farthest-side', 'farthest-corner', 'contain', 'cover']));
	    }
	    node.add(this.match(','), this.colorstop());
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.colorstop()
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  pos: function() {
	    var node = new Node_1$3(Node_1$3.POS);
	    if(this.look.type() == CssToken_1.NUMBER) {
	      node.add(this.len());
	    }
	    else {
	      node.add(this.match(['left', 'center', 'right']));
	    }
	    if(this.look) {
	      if(this.look.type() == CssToken_1.NUMBER) {
	        node.add(this.len());
	      }
	      else if(['top', 'center', 'bottom'].indexOf(this.look.content().toLowerCase()) > -1){
	        node.add(this.match());
	      }
	    }
	    return node;
	  },
	  len: function() {
	    var node = new Node_1$3(Node_1$3.LEN);
	    var isZeror = this.look.content() == '0';
	    node.add(this.match(CssToken_1.NUMBER));
	    if(this.look && this.look.type() == CssToken_1.UNITS) {
	      node.add(this.match());
	    }
	    else if(!isZeror) {
	      this.error();
	    }
	    return node;
	  },
	  lg: function() {
	    var node = new Node_1$3(Node_1$3.LINEARGRADIENT);
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    if(!this.look) {
	      this.error();
	    }
	    switch(this.look.type()) {
	      case CssToken_1.NUMBER:
	      case CssToken_1.PROPERTY:
	      case CssToken_1.ID:
	        node.add(this.point());
	        node.add(this.match(','));
	        break;
	    }
	    node.add(
	      this.colorstop(),
	      this.match(','),
	      this.colorstop()
	    );
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.colorstop()
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  point: function() {
	    var node = new Node_1$3(Node_1$3.POINT);
	    if(this.look.type() == CssToken_1.NUMBER) {
	      node.add(
	        this.match(),
	        this.match('deg')
	      );
	    }
	    else {
	      if(this.look && this.look.content().toLowerCase() == 'to') {
	        node.add(this.match());
	      }
	      node.add(this.match(['left', 'right', 'top', 'bottom', 'center']));
	      if(this.look && this.look.content().toLowerCase() == 'to') {
	        node.add(this.match());
	      }
	      if(this.look && this.look.type() == CssToken_1.PROPERTY) {
	        node.add(this.match(['left', 'right', 'top', 'bottom', 'center']));
	      }
	    }
	    return node;
	  },
	  colorstop: function() {
	    var node = new Node_1$3(Node_1$3.COLORSTOP);
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.type() == CssToken_1.COLOR) {
	      node.add(this.match(CssToken_1.COLOR));
	    }
	    else {
	      switch(this.look.content()) {
	        case 'rgb':
	          node.add(this.rgb());
	          break;
	        case 'rgba':
	          node.add(this.rgb(true));
	          break;
	        case 'hsl':
	          node.add(this.hsl());
	          break;
	        case 'hsla':
	          node.add(this.hsl(true));
	          break;
	        default:
	          this.error();
	      }
	    }
	    if(this.look
	      && this.look.type() == CssToken_1.NUMBER) {
	      var isZero = this.look.content() == '0';
	      node.add(this.match());
	      if(this.look && this.look.type() == CssToken_1.UNITS) {
	        node.add(this.match());
	      }
	      else if(!isZero) {
	        this.error();
	      }
	    }
	    return node;
	  },
	  minmax: function(max) {
	    var node = new Node_1$3(max ? Node_1$3.MAX : Node_1$3.MIN);
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    node.add(this.param());
	    while(this.look && this.look.content() == ',') {
	      node.add(this.match());
	      node.add(this.param());
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  param: function(expr) {
	    var node = new Node_1$3(Node_1$3.PARAM);
	    var s = this.look.content().toLowerCase();
	    if([CssToken_1.COLOR, CssToken_1.HACK, CssToken_1.VARS, CssToken_1.ID, CssToken_1.PROPERTY, CssToken_1.NUMBER, CssToken_1.STRING, CssToken_1.HEAD, CssToken_1.SIGN, CssToken_1.UNITS, CssToken_1.KEYWORD].indexOf(this.look.type()) > -1
	      && [';', '}', ')', ','].indexOf(s) == -1) {
	      node.add(expr ? this.addexpr() : this.match());
	    }
	    else {
	      this.error();
	    }
	    while(this.look) {
	      s = this.look.content().toLowerCase();
	      if([CssToken_1.COLOR, CssToken_1.HACK, CssToken_1.VARS, CssToken_1.ID, CssToken_1.PROPERTY, CssToken_1.NUMBER, CssToken_1.STRING, CssToken_1.HEAD, CssToken_1.KEYWORD, CssToken_1.SIGN, CssToken_1.UNITS, CssToken_1.KEYWORD].indexOf(this.look.type()) > -1
	        && [';', '}', ')', ','].indexOf(this.look.content()) == -1) {
	        node.add(expr ? this.addexpr() : this.match());
	      }
	      else {
	        break;
	      }
	    }
	    return node;
	  },
	  vars: function() {
	    var node = new Node_1$3(Node_1$3.VARS);
	    node.add(
	      this.match(),
	      this.match('('),
	      this.addexpr(),
	      this.match(')')
	    );
	    return node;
	  },
	  calc: function() {
	    var node = new Node_1$3(Node_1$3.CALC);
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    var count = 0;
	    while(this.look) {
	      var s = this.look.content();
	      if([';', '}'].indexOf(s) > -1) {
	        this.error();
	      }
	      else if(s == '(') {
	        count++;
	      }
	      else if(s == ')') {
	        if(count-- == 0) {
	          break;
	        }
	      }
	      node.add(this.match());
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  counter: function(name) {
	    var node = new Node_1$3(Node_1$3[name.toUpperCase()]);
	    node.add(
	      this.match(),
	      this.match('('),
	      this.param(true)
	    );
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.param(true)
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  filter: function() {
	    var node = new Node_1$3(Node_1$3.FILTER);
	    var isFn = false;
	    for(var i = this.index; i < this.length; i++) {
	      var t = this.tokens[i];
	      if(!S$3.hasOwnProperty(t.type())) {
	        isFn = t.content() == '(';
	        break;
	      }
	    }
	    if(!isFn) {
	      return this.match();
	    }
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    node.add(this.param(true));
	    while(this.look && this.look.content() == ',') {
	      node.add(
	        this.match(),
	        this.param(true)
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  rgb: function(alpha) {
	    var node = new Node_1$3(alpha ? Node_1$3.RGBA : Node_1$3.RGB);
	    node.add(
	      this.match(),
	      this.match('('),
	      this.addexpr(CssToken_1.NUMBER),
	      this.match(','),
	      this.addexpr(CssToken_1.NUMBER),
	      this.match(','),
	      this.addexpr(CssToken_1.NUMBER)
	    );
	    if(alpha) {
	      node.add(
	        this.match(','),
	        this.addexpr(CssToken_1.NUMBER)
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  hsl: function(alpha) {
	    var node = new Node_1$3(alpha ? Node_1$3.HSLA : Node_1$3.HSL);
	    node.add(
	      this.match(),
	      this.match('('),
	      this.addexpr(CssToken_1.NUMBER),
	      this.match(',')
	    );
	    var isZero = this.look && this.look.content() == '0';
	    var isVar = this.look && this.look.type() == CssToken_1.VARS;
	    node.add(this.addexpr(CssToken_1.NUMBER, true));
	    if(this.look && this.look.content() == '%') {
	      node.add(this.match());
	    }
	    else if(!isZero && !isVar) {
	      this.error();
	    }
	    node.add(this.match(','));
	    var isZero = this.look && this.look.content() == '0';
	    var isVar = this.look && this.look.type() == CssToken_1.VARS;
	    node.add(this.addexpr(CssToken_1.NUMBER, true));
	    if(this.look && this.look.content() == '%') {
	      node.add(this.match());
	    }
	    else if(!isZero && !isVar) {
	      this.error();
	    }
	    if(alpha) {
	      node.add(
	        this.match(','),
	        this.addexpr(CssToken_1.NUMBER)
	      );
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  url: function(ellipsis) {
	    if(!this.look) {
	      this.error();
	    }
	    var node = new Node_1$3(Node_1$3.URL);
	    if(ellipsis && this.look.type() == CssToken_1.STRING) {
	      if(this.look.content().charAt(0) == '"') {
	        node.add(this.match());
	      }
	      else {
	        this.error('missing quotation');
	      }
	    }
	    else {
	      node.add(
	        this.match('url'),
	        this.match('(')
	      );
	      if(this.look && this.look.content() != ')') {
	        node.add(this.addexpr(CssToken_1.STRING));
	      }
	      node.add(this.match(')'));
	    }
	    return node;
	  },
	  format: function() {
	    var node = new Node_1$3(Node_1$3.FORMAT);
	    node.add(this.match());
	    node.add(this.match('('));
	    node.add(this.addexpr(CssToken_1.STRING));
	    node.add(this.match(')'));
	    return node;
	  },
	  addexpr: function(accepts, noUnit, noMtpl) {
	    if(accepts && !Array.isArray(accepts)) {
	      accepts = [accepts];
	    }
	    if(accepts && accepts.indexOf(CssToken_1.VARS) == -1) {
	      accepts = accepts.concat([CssToken_1.VARS]);
	    }
	    if(accepts && accepts.indexOf(CssToken_1.NUMBER) == -1) {
	      accepts = accepts.concat([CssToken_1.NUMBER]);
	    }
	    var node = new Node_1$3(Node_1$3.ADDEXPR);
	    var mtplexpr = this.mtplexpr(accepts, noUnit, noMtpl);
	    if(this.look && ['+', '-'].indexOf(this.look.content()) != -1) {
	      node.add(mtplexpr);
	      while(this.look && ['+', '-'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.mtplexpr(accepts, noUnit, noMtpl)
	        );
	        if(!noUnit && this.look && this.look.type() == CssToken_1.UNITS) {
	          node.add(this.match());
	        }
	      }
	    }
	    else {
	      return mtplexpr;
	    }
	    return node;
	  },
	  mtplexpr: function(accepts, noUnit, noMtpl) {
	    var node = new Node_1$3(Node_1$3.MTPLEXPR);
	    var prmrexpr = this.prmrexpr(accepts, noUnit);
	    if(!noMtpl && this.look && ['*', '/'].indexOf(this.look.content()) != -1) {
	      node.add(prmrexpr);
	      while(this.look && ['*', '/'].indexOf(this.look.content()) != -1) {
	        node.add(
	          this.match(),
	          this.prmrexpr(accepts)
	        );
	        if(!noUnit && this.look && this.look.type() == CssToken_1.UNITS) {
	          node.add(this.match());
	        }
	      }
	    }
	    else {
	      return prmrexpr;
	    }
	    return node;
	  },
	  prmrexpr: function(accepts, noUnit) {
	    var node = new Node_1$3(Node_1$3.PRMREXPR);
	    if(this.look && this.look.content() == '(') {
	      node.add(
	        this.match('('),
	        this.addexpr(accepts, noUnit),
	        this.match(')')
	      );
	      return node;
	    }
	    if(this.look.content() == '@basename') {
	      return this.basename();
	    }
	    else if(this.look.content() == '@extname') {
	      return this.extname();
	    }
	    else if(this.look.content() == '@width') {
	      return this.width();
	    }
	    else if(this.look.content() == '@height') {
	      return this.height();
	    }
	    //紧接着的(说明这是个未知的css内置id()
	    var next = this.tokens[this.index];
	    if(next && next.content() == '('
	      && [CssToken_1.PROPERTY, CssToken_1.ID].indexOf(this.look.type()) > -1) {
	      return this.bracket();
	    }
	    var temp = this.match(accepts);
	    if(!noUnit && this.look && this.look.type() == CssToken_1.UNITS) {
	      temp = [temp, this.match()];
	    }
	    return temp;
	  },
	  bracket: function() {
	    var node = new Node_1$3(Node_1$3.BRACKET);
	    node.add(
	      this.match([CssToken_1.ID, CssToken_1.PROPERTY]),
	      this.match('(')
	    );
	    while(this.look && this.look.content() != ')') {
	      node.add(this.addexpr());
	    }
	    node.add(this.match(')'));
	    return node;
	  },
	  ifstmt: function() {
	    var node = new Node_1$3(Node_1$3.IFSTMT);
	    node.add(
	      this.match(),
	      this.match('('),
	      this.eqstmt(),
	      this.match(')'),
	      this.block()
	    );
	    if(this.look) {
	      if(this.look.content() == '@elseif') {
	        node.add(this.ifstmt());
	      }
	      else if(this.look.content() == '@else') {
	        node.add(this.match(), this.block());
	      }
	    }
	    return node;
	  },
	  forstmt: function() {
	    var node = new Node_1$3(Node_1$3.FORSTMT);
	    node.add(
	      this.match(),
	      this.match('(')
	    );
	    var type = 0; //0为普通，1为in，2为of
	    //in和of和普通语句三种区分
	    //debugger
	    for(var i = this.index; i < this.length; i++) {
	      var token = this.tokens[i];
	      if(!S$3[token.type()]) {
	        if(token.content() == 'in') {
	          type = 1;
	        }
	        else if(token.content() == 'of') {
	          type = 2;
	        }
	        break;
	      }
	    }
	    if(type == 0) {
	      //@for(varstmt ; expr ; epxr)
	      if(this.look.content() != ';') {
	        node.add(this.varstmt());
	      }
	      else {
	        node.add(this.match(';'));
	      }
	      node.add(this.eqstmt());
	      node.add(this.match(';'));
	      node.add(this.eqstmt());
	    }
	    else if(type == 1) {
	      //@for($var in expr)
	      node.add(
	        this.match(CssToken_1.VARS),
	        this.match('in'),
	        this.exprstmt()
	      );
	    }
	    else if(type == 2) {
	      //@for($var of expr)
	      node.add(
	        this.match(CssToken_1.VARS),
	        this.match('of'),
	        this.exprstmt()
	      );
	    }
	    node.add(this.match(')'));
	    node.add(this.block());
	    return node;
	  },
	  varstmt: function() {
	    var node = new Node_1$3(Node_1$3.VARSTMT);
	    node.add(this.vardecl());
	    while(this.look && this.look.content() == ',') {
	      node.add(this.match(), this.vardecl());
	    }
	    node.add(this.match(';'));
	    return node;
	  },
	  exprstmt: function() {
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '@dir') {
	      return this.dir();
	    }
	    return this.eqstmt();
	  },
	  eqstmt: function() {
	    var node = new Node_1$3(Node_1$3.EQSTMT);
	    var relstmt = this.relstmt();
	    if(this.look && {
	        '==': true,
	        '!=': true
	      }.hasOwnProperty(this.look.content())) {
	      node.add(
	        relstmt,
	        this.match(),
	        this.relstmt()
	      );
	    }
	    else {
	      return relstmt;
	    }
	    return node;
	  },
	  relstmt: function() {
	    var node = new Node_1$3(Node_1$3.RELSTMT);
	    var addstmt = this.addstmt();
	    if(this.look && {
	        '>': true,
	        '<': true,
	        '>=': true,
	        '<=': true
	      }.hasOwnProperty(this.look.content())) {
	      node.add(
	        addstmt,
	        this.match(),
	        this.addstmt()
	      );
	    }
	    else {
	      return addstmt;
	    }
	    return node;
	  },
	  addstmt: function() {
	    if(this.look.content() == '@basename') {
	      return this.basename();
	    }
	    else if(this.look.content() == '@extname') {
	      return this.extname();
	    }
	    var node = new Node_1$3(Node_1$3.ADDSTMT);
	    var mtplstmt = this.mtplstmt();
	    if(this.look && {
	        '+': true,
	        '-': true
	      }.hasOwnProperty(this.look.content())) {
	      node.add(
	        mtplstmt,
	        this.match(),
	        this.mtplstmt()
	      );
	      while(this.look && {
	        '+': true,
	        '-': true
	      }.hasOwnProperty(this.look.content())) {
	        node.add(
	          mtplstmt,
	          this.match(),
	          this.mtplstmt()
	        );
	      }
	    }
	    else {
	      return mtplstmt;
	    }
	    return node;
	  },
	  mtplstmt: function() {
	    var node = new Node_1$3(Node_1$3.MTPLSTMT);
	    var postfixstmt = this.postfixstmt();
	    if(this.look && {
	        '*': true,
	        '/': true
	      }.hasOwnProperty(this.look.content())) {
	      node.add(
	        postfixstmt,
	        this.match(),
	        this.postfixstmt()
	      );
	      while(this.look && {
	        '*': true,
	        '/': true
	      }.hasOwnProperty(this.look.content())) {
	        node.add(
	          postfixstmt,
	          this.match(),
	          this.postfixstmt()
	        );
	      }
	    }
	    else {
	      return postfixstmt;
	    }
	    return node;
	  },
	  postfixstmt: function() {
	    if(this.look.content() == '@width') {
	      return this.width();
	    }
	    else if(this.look.content() == '@height') {
	      return this.height();
	    }
	    var node = new Node_1$3(Node_1$3.POSTFIXSTMT);
	    var prmrstmt = this.prmrstmt();
	    if(this.look && {
	        '++': true,
	        '--': true
	      }.hasOwnProperty(this.look.content())) {
	      node.add(
	        prmrstmt,
	        this.match()
	      );
	    }
	    else {
	      return prmrstmt;
	    }
	    return node;
	  },
	  prmrstmt: function() {
	    var node = new Node_1$3(Node_1$3.PRMRSTMT);
	    switch(this.look.type()) {
	      case CssToken_1.VARS:
	      case CssToken_1.NUMBER:
	      case CssToken_1.STRING:
	        node.add(this.match());
	        break;
	      default:
	        switch(this.look.content()) {
	          case '(':
	            node.add(
	              this.match(),
	              this.eqstmt(),
	              this.match(')')
	            );
	            break;
	          case '[':
	            return this.arrltr();
	          default:
	            this.error();
	        }
	    }
	    return node;
	  },
	  arrltr: function() {
	    var node = new Node_1$3(Node_1$3.ARRLTR);
	    node.add(this.match('['));
	    while(this.look && this.look.content() != ']') {
	      if(this.look.content() == ',') {
	        node.add(this.match());
	      }
	      if(!this.look) {
	        this.error();
	      }
	      if(this.look.type() == CssToken_1.KEYWORD || this.look.type() == CssToken_1.HACK) {
	        node.add(this.style(null, true, true));
	      }
	      else {
	        node.add(this.value(null, true));
	      }
	    }
	    node.add(this.match(']'));
	    return node;
	  },
	  dir: function() {
	    var node = new Node_1$3(Node_1$3.DIR);
	    node.add(
	      this.match(),
	      this.cparams()
	    );
	    return node;
	  },
	  basename: function() {
	    var node = new Node_1$3(Node_1$3.BASENAME);
	    node.add(
	      this.match(),
	      this.cparams()
	    );
	    return node;
	  },
	  extname: function() {
	    var node = new Node_1$3(Node_1$3.EXTNAME);
	    node.add(
	      this.match(),
	      this.cparams()
	    );
	    return node;
	  },
	  width: function() {
	    var node = new Node_1$3(Node_1$3.WIDTH);
	    node.add(
	      this.match(),
	      this.cparams()
	    );
	    return node;
	  },
	  height: function() {
	    var node = new Node_1$3(Node_1$3.HEIGHT);
	    node.add(
	      this.match(),
	      this.cparams()
	    );
	    return node;
	  },
	  unbox: function() {
	    var node = new Node_1$3(Node_1$3.UNBOX);
	    node.add(
	      this.match('~'),
	      this.match([CssToken_1.VARS, CssToken_1.STRING])
	    );
	    return node;
	  },
	  match: function(type, msg) {
	    //未定义为所有
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move();
	        return new Node_1$3(Node_1$3.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //数组为其中一个即可
	    else if(Array.isArray(type)) {
	      if(this.look) {
	        for(var i = 0, len = type.length; i < len; i++) {
	          var t = type[i];
	          if(typeof t == 'string' && this.look.content() == t) {
	            var l = this.look;
	            this.move();
	            return new Node_1$3(Node_1$3.TOKEN, l);
	          }
	          else if(typeof t == 'number' && this.look.type() == t) {
	            var l = this.look;
	            this.move();
	            return new Node_1$3(Node_1$3.TOKEN, l);
	          }
	        }
	      }
	      this.error('missing ' + type.join('|') + (msg || ''));
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      if(this.look && this.look.content().toLowerCase() == type) {
	        var l = this.look;
	        this.move();
	        return new Node_1$3(Node_1$3.TOKEN, l);
	      }
	      else if(type == ';' && this.look && this.look.content() == '}') {
	        var l = new CssToken_1(CssToken_1.VIRTUAL, ';');
	        return new Node_1$3(Node_1$3.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move();
	        return new Node_1$3(Node_1$3.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + CssToken_1.type(type) + (msg || ''));
	      }
	    }
	  },
	  error: function(msg) {
	    msg = 'SyntaxError: ' + (msg || ' syntax error');
	    throw new Error(msg + ' line ' + this.lastLine + ' col ' + this.lastCol + ' look ' + (this.look && this.look.content()));
	  },
	  move: function() {
	    this.lastLine = this.line;
	    this.lastCol = this.col;
	    do {
	      this.look = this.tokens[this.index++];
	      if(!this.look) {
	        return;
	      }
	      //存下忽略的token
	      if([CssToken_1.BLANK, CssToken_1.TAB, CssToken_1.ENTER, CssToken_1.LINE, CssToken_1.COMMENT, CssToken_1.IGNORE].indexOf(this.look.type()) != -1) {
	        this.ignores[this.index - 1] = this.look;
	      }
	      if(this.look.type() == CssToken_1.LINE) {
	        this.line++;
	        this.col = 1;
	      }
	      else if(this.look.type() == CssToken_1.COMMENT) {
	        var s = this.look.content(),
	          n = character.count(s, character.LINE);
	        if(n > 0) {
	          this.line += n;
	          var i = s.lastIndexOf(character.LINE);
	          this.col += s.length - i - 1;
	        }
	      }
	      else if(this.look.type() == CssToken_1.IGNORE) {
	        var s = this.look.content(),
	          n = character.count(s, character.LINE);
	        if(n > 0) {
	          this.line += n;
	          var i = s.lastIndexOf(character.LINE);
	          this.col += s.length - i - 1;
	        }
	      }
	      else {
	        this.col += this.look.content().length;
	        if([CssToken_1.BLANK, CssToken_1.TAB, CssToken_1.ENTER].indexOf(this.look.type()) == -1) {
	          break;
	        }
	      }
	    } while(this.index <= this.length);
	  },
	  ignore: function() {
	    return this.ignores;
	  }
	});
	var Parser_1$3 = Parser$3;

	var Node$4 = Node_1.extend(function(type, children) {
	  Node_1.call(this, type, children);
	  return this;
	}).statics({
	  DOCUMENT: 'document',
	  ELEMENT: 'element',
	  SelfClosingElement: 'SelfClosingElement',
	  OpeningElement: 'OpeningElement',
	  ClosingElement: 'ClosingElement',
	  Attribute: 'Attribute',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys$3) {
	      var self = this;
	      keys$3 = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys$3[v] = k;
	      });
	    }
	    return keys$3[s];
	  }
	});
	var keys$3;
	var Node_1$4 = Node$4;

	var S$4 = {};
	S$4[HtmlToken_1.BLANK] = S$4[HtmlToken_1.TAB] = S$4[HtmlToken_1.COMMENT] = S$4[HtmlToken_1.LINE] = S$4[HtmlToken_1.ENTER] = true;
	var SINGLE = {
	  'img': true,
	  'meta': true,
	  'link': true,
	  '!doctype': true,
	  'br': true,
	  'basefont': true,
	  'base': true,
	  'col': true,
	  'embed': true,
	  'frame': true,
	  'hr': true,
	  'input': true,
	  'keygen': true,
	  'area': true,
	  'param': true,
	  'source': true,
	  'track': true
	};

	var Parser$4 = Parser_1.extend(function(lexer) {
	  Parser_1.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  parse: function(code) {
	    this.lexer.parse(code);
	    this.tree = this.document();
	    return this.tree;
	  },
	  init: function(lexer) {
	    this.look = null;
	    this.tokens = null;
	    this.lastLine = 1;
	    this.lastCol = 1;
	    this.line = 1;
	    this.col = 1;
	    this.index = 0;
	    this.length = 0;
	    this.ignores = {};
	    this.hasMoveLine = false;
	    this.tree = {};
	    if(lexer) {
	      this.lexer = lexer;
	    }
	    else if(this.lexer) {
	      this.lexer.init();
	    }
	    else {
	      this.lexer = new HtmlLexer_1(new HtmlRule_1());
	    }
	  },
	  document: function() {
	    this.tokens = this.lexer.tokens();
	    this.length = this.tokens.length;
	    if(this.tokens.length) {
	      this.move();
	    }
	    var node = new Node_1$4(Node_1$4.DOCUMENT);
	    var first = true;
	    while(this.look) {
	      node.add(this.element(first));
	      first = false;
	    }
	    return node;
	  },
	  element: function(first) {
	    if(this.look.type() == HtmlToken_1.TEXT) {
	      return this.match();
	    }
	    else {
	      var node = new Node_1$4(Node_1$4.OpeningElement);
	      node.add(
	        this.match('<'),
	        this.elemname(first)
	      );
	      var name = node.last().token().content();
	      while(this.look && this.look.type() == HtmlToken_1.PROPERTY) {
	        node.add(this.attr());
	      }
	      if(!this.look) {
	        this.error();
	      }
	      if(this.look.content() == '/>') {
	        node.add(this.match());
	        node.name(Node_1$4.SelfClosingElement);
	        return node;
	      }
	      node.add(this.match('>'));
	      if(SINGLE.hasOwnProperty(name.toLowerCase())) {
	        node.name(Node_1$4.SelfClosingElement);
	        return node;
	      }
	      var n = new Node_1$4(Node_1$4.ELEMENT);
	      n.add(node);
	      while(this.look && this.look.content() != '</') {
	        n.add(this.element());
	      }
	      n.add(this.close(name));
	      return n;
	    }
	  },
	  elemname: function(first) {
	    if(!this.look) {
	      this.error();
	    }
	    if(first && this.look.type() == HtmlToken_1.DOC) {
	      return this.match();
	    }
	    return this.match(HtmlToken_1.ELEM);
	  },
	  attr: function() {
	    var node = new Node_1$4(Node_1$4.Attribute);
	    node.add(this.match(HtmlToken_1.PROPERTY));
	    if(this.look && this.look.content() == '=') {
	      node.add(this.match());
	      if(!this.look) {
	        this.error();
	      }
	      switch(this.look.type()) {
	        case HtmlToken_1.STRING:
	        case HtmlToken_1.NUMBER:
	        case HtmlToken_1.PROPERTY:
	          node.add(this.match());
	          break;
	        default:
	          this.error();
	      }
	    }
	    return node;
	  },
	  close: function(name) {
	    var node = new Node_1$4(Node_1$4.ClosingElement);
	    node.add(
	      this.match('</'),
	      this.match(name),
	      this.match('>')
	    );
	    return node;
	  },
	  match: function(type, line, msg) {
	    if(typeof type == 'boolean') {
	      msg = line;
	      line = type;
	      type = undefined;
	    }
	    if(typeof line != 'boolean') {
	      line = false;
	      msg = line;
	    }
	    //未定义为所有非空白token
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$4(Node_1$4.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      //特殊处理;，不匹配但有换行或者末尾时自动补全，还有受限行
	      if(type == ';'
	        && (!this.look
	          || (this.look.content() != type && this.hasMoveLine)
	          || this.look.content() == '}')
	        ) {
	        if(this.look && S$4[this.look.type()]) {
	          this.move();
	        }
	        return this.virtual(';');
	      }
	      else if(this.look && this.look.content() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$4(Node_1$4.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$4(Node_1$4.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + HtmlToken_1.type(type) + (msg || ''));
	      }
	    }
	  },
	  move: function(line) {
	    this.lastLine = this.line;
	    this.lastCol = this.col;
	    //遗留下来的换行符
	    this.hasMoveLine = false;
	    do {
	      this.look = this.tokens[this.index++];
	      if(!this.look) {
	        return;
	      }
	      //存下忽略的token
	      if(S$4[this.look.type()]) {
	        this.ignores[this.index - 1] = this.look;
	      }
	      //包括line的情况下要跳出
	      if(this.look.type() == HtmlToken_1.LINE) {
	        this.line++;
	        this.col = 1;
	        this.hasMoveLine = true;
	        if(line) {
	          break;
	        }
	      }
	      else if(this.look.type() == HtmlToken_1.COMMENT) {
	        var s = this.look.content();
	        var n = character.count(this.look.content(), character.LINE);
	        if(n > 0) {
	          this.line += n;
	          var i = s.lastIndexOf(character.LINE);
	          this.col += s.length - i - 1;
	          this.hasMoveLine = true;
	          if(line) {
	            break;
	          }
	        }
	      }
	      else {
	        this.col += this.look.content().length;
	        if(!S$4[this.look.type()]) {
	          break;
	        }
	      }
	    } while(this.index <= this.length);
	  },
	  error: function(msg) {
	    msg = 'SyntaxError: ' + (msg || ' syntax error');
	    throw new Error(msg + ' line ' + this.lastLine + ' col ' + this.lastCol);
	  }
	});
	var Parser_1$4 = Parser$4;

	var Node$5 = Node_1$2.extend(function(type, children) {
	  Node_1$2.call(this, type, children);
	  return this;
	}).statics({
	  JSXElement: 'JSXElement',
	  JSXSelfClosingElement: 'JSXSelfClosingElement',
	  JSXOpeningElement: 'JSXOpeningElement',
	  JSXClosingElement: 'JSXClosingElement',
	  JSXChild: 'JSXChild',
	  JSXSpreadAttribute: 'JSXSpreadAttribute',
	  JSXAttribute: 'JSXAttribute',
	  JSXBindAttribute: 'JSXBindAttribute',
	  JSXNamespacedName: 'JSXNamespacedName',
	  JSXMemberExpression: 'JSXMemberExpression',
	  JSXAttributes: 'JSXAttributes',
	  JSXAttributeValue: 'JSXAttributeValue',
	  JSXFragment: 'JSXFragment',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys$4) {
	      var self = this;
	      keys$4 = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys$4[v] = k;
	      });
	    }
	    return keys$4[s];
	  }
	});
	var keys$4;
	var Node_1$5 = Node$5;

	var Parser$5 = Parser_1$2.extend(function(lexer) {
	  Parser_1$2.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  prmrexpr: function() {
	    if(this.look.type() == JSXToken_1.MARK) {
	      var next = this.tokens[this.index];
	      if(next && next.content() == '>') {
	        return this.jsxfragment();
	      }
	      return this.jsxelem();
	    }
	    else {
	      return Parser_1$2.prototype.prmrexpr.call(this);
	    }
	  },
	  jsxfragment: function() {
	    var node = new Node_1$5(Node_1$5.JSXFragment);
	    node.add(
	      this.match('<'),
	      this.match('>')
	    );
	    while(this.look && this.look.content() != '</') {
	      node.add(this.jsxchild());
	    }
	    node.add(
	      this.match('</'),
	      this.match('>')
	    );
	    return node;
	  },
	  jsxelem: function() {
	    var node = new Node_1$5(Node_1$5.JSXOpeningElement);
	    node.add(
	      this.match(),
	      this.jsxelemname()
	    );
	    //id只有1个，member和namespace有多个
	    var type = node.last().size() > 1 ? node.last().name() : null;
	    var name;
	    if(type) {
	      name = [];
	      node.last().leaves().forEach(function(leaf) {
	        name.push(leaf.token().content());
	      });
	    }
	    else {
	      name = node.last().token().content();
	    }
	    while(this.look) {
	      if(this.look.type() == JSXToken_1.BIND_PROPERTY) {
	        node.add(this.bindAttr());
	      }
	      else if(this.look.type() == JSXToken_1.PROPERTY) {
	        node.add(this.attr());
	      }
	      else if(this.look.content() == '{') {
	        node.add(this.spreadattr());
	      }
	      else {
	        break;
	      }
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '/>') {
	      node.add(this.match());
	      node.name(Node_1$5.JSXSelfClosingElement);
	      return node;
	    }
	    node.add(this.match('>'));
	    var n = new Node_1$5(Node_1$5.JSXElement);
	    n.add(node);
	    while(this.look && this.look.content() != '</') {
	      n.add(this.jsxchild());
	    }
	    n.add(this.close(name, type));
	    return n;
	  },
	  jsxelemname: function(name, type) {
	    if(name) {
	      if(type) {
	        var node = new Node_1$5(type);
	        var self = this;
	        name.forEach(function(na) {
	          node.add(self.match(na));
	        });
	        return node;
	      }
	      else {
	        return this.match(name);
	      }
	    }
	    else {
	      var node = new Node_1$5(Node_1$5.JSXMemberExpression);
	      node.add(this.match());
	      if(!this.look) {
	        this.error();
	      }
	      if(this.look.content() == '.') {
	        while(this.look && this.look.content() == '.') {
	          node.add(
	            this.match(),
	            this.match(JSXToken_1.ELEM)
	          );
	        }
	      }
	      else if(this.look.content() == ':') {
	        while(this.look && this.look.content() == ':') {
	          node.add(
	            this.match(),
	            this.match(JSXToken_1.ELEM)
	          );
	        }
	      }
	      else {
	        return node.first();
	      }
	      return node;
	    }
	  },
	  jsxmember: function(names) {
	    var node = new Node_1$5(Node_1$5.JSXMemberExpression);
	    names.forEach(function(name) {
	      node.add(this.match(name));
	    });
	    return node;
	  },
	  bindAttr: function() {
	    var node = new Node_1$5(Node_1$5.JSXBindAttribute);
	    node.add(
	      this.match(JSXToken_1.BIND_PROPERTY),
	      this.match('='),
	      this.attrval()
	    );
	    return node;
	  },
	  attr: function() {
	    var node = new Node_1$5(Node_1$5.JSXAttribute);
	    node.add(
	      this.attrname(),
	      this.match('='),
	      this.attrval()
	    );
	    return node;
	  },
	  spreadattr: function() {
	    var node = new Node_1$5(Node_1$5.JSXSpreadAttribute);
	    node.add(
	      this.match(),
	      this.match('...'),
	      this.assignexpr(),
	      this.match('}')
	    );
	    return node;
	  },
	  attrname: function() {
	    var id = this.match(JSXToken_1.PROPERTY);
	    if(this.look && this.look.content() == ':') {
	      var node = new Node_1$5(Node_1$5.JSXNamespacedName);
	      node.add(id,
	        this.match(),
	        this.match(JSXToken_1.PROPERTY)
	      );
	      return node;
	    }
	    return id;
	  },
	  attrval: function() {
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '{') {
	      var node = new Node_1$5(Node_1$5.JSXAttributeValue);
	      node.add(this.match());
	      if(this.look && this.look.content() != '}') {
	        node.add(this.assignexpr());
	      }
	      node.add(this.match('}'));
	      return node;
	    }
	    else if(this.look.content() == '[') {
	      var node = new Node_1$5(Node_1$5.JSXAttributeValue);
	      node.add(this.match());
	      while(this.look && this.look.content() != ']') {
	        node.add(this.assignexpr());
	        if(this.look && this.look.content() == ',') {
	          node.add(this.match());
	        }
	      }
	      node.add(this.match(']'));
	      return node;
	    }
	    else if([JSXToken_1.STRING, JSXToken_1.NUMBER].indexOf(this.look.type()) > -1) {
	      return this.match();
	    }
	    else if(this.look.content() == '<') {
	      return this.jsxfragment();
	    }
	    return this.jsxelem();
	  },
	  jsxchild: function() {
	    switch(this.look.type()) {
	      case JSXToken_1.TEXT:
	        return this.match();
	      case JSXToken_1.MARK:
	        var next = this.tokens[this.index];
	        if(next && next.content() == '>') {
	          return this.jsxfragment();
	        }
	        return this.jsxelem();
	      default:
	        var node = new Node_1$5(Node_1$5.JSXChild);
	        node.add(this.match('{'));
	        if(this.look && this.look.content() != '}') {
	          node.add(this.assignexpr());
	        }
	        node.add(this.match('}'));
	        return node;
	    }
	  },
	  close: function(name, type) {
	    var node = new Node_1$5(Node_1$5.JSXClosingElement);
	    node.add(
	      this.match('</'),
	      this.jsxelemname(name, type),
	      this.match('>')
	    );
	    return node;
	  },
	  match: function(type, line, msg) {
	    if(typeof type == 'boolean') {
	      msg = line;
	      line = type;
	      type = undefined;
	    }
	    if(typeof line != 'boolean') {
	      line = false;
	      msg = line;
	    }
	    //未定义为所有非空白token
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$5(Node_1$5.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //数组为其中一个即可
	    else if(Array.isArray(type)) {
	      if(this.look) {
	        for(var i = 0, len = type.length; i < len; i++) {
	          var t = type[i];
	          if(typeof t == 'string' && this.look.content() == t) {
	            var l = this.look;
	            this.move();
	            return new Node_1$5(Node_1$5.TOKEN, l);
	          }
	          else if(typeof t == 'number' && this.look.type() == t) {
	            var l = this.look;
	            this.move();
	            return new Node_1$5(Node_1$5.TOKEN, l);
	          }
	        }
	      }
	      this.error('missing ' + type.join('|') + (msg || ''));
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      //特殊处理;，不匹配但有换行或者末尾时自动补全，还有受限行
	      if(type == ';'
	        && (!this.look
	        || (this.look.content() != type && this.hasMoveLine)
	        || this.look.content() == '}')
	      ) {
	        if(this.look && Parser_1$2.S[this.look.type()]) {
	          this.move();
	        }
	        return this.virtual(';');
	      }
	      else if(this.look && this.look.content() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$5(Node_1$5.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$5(Node_1$5.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + JSXToken_1.type(type) + (msg || ''));
	      }
	    }
	  }
	}).statics({
	  SELF_CLOSE: JSXLexer_1.SELF_CLOSE
	});

	var Parser_1$5 = Parser$5;

	var Node$6 = Node_1$2.extend(function(type, children) {
	  Node_1$2.call(this, type, children);
	  return this;
	}).statics({
	  CSXElement: 'CSXElement',
	  CSXSelfClosingElement: 'CSXSelfClosingElement',
	  CSXOpeningElement: 'CSXOpeningElement',
	  CSXClosingElement: 'CSXClosingElement',
	  CSXChild: 'CSXChild',
	  CSXSpreadAttribute: 'CSXSpreadAttribute',
	  CSXAttribute: 'CSXAttribute',
	  CSXBindAttribute: 'CSXBindAttribute',
	  CSXNamespacedName: 'CSXNamespacedName',
	  CSXMemberExpression: 'CSXMemberExpression',
	  CSXAttributes: 'CSXAttributes',
	  CSXAttributeValue: 'CSXAttributeValue',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys$5) {
	      var self = this;
	      keys$5 = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys$5[v] = k;
	      });
	    }
	    return keys$5[s];
	  }
	});
	var keys$5;
	var Node_1$6 = Node$6;

	var Parser$6 = Parser_1$2.extend(function(lexer) {
	  Parser_1$2.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  prmrexpr: function() {
	    if(this.look.type() == CSXToken_1.MARK) {
	      return this.CSXelem();
	    }
	    else {
	      return Parser_1$2.prototype.prmrexpr.call(this);
	    }
	  },
	  CSXelem: function() {
	    var node = new Node_1$6(Node_1$6.CSXOpeningElement);
	    node.add(
	      this.match(),
	      this.CSXelemname()
	    );
	    //id只有1个，member和namespace有多个
	    var type = node.last().size() > 1 ? node.last().name() : null;
	    var name;
	    if(type) {
	      name = [];
	      node.last().leaves().forEach(function(leaf) {
	        name.push(leaf.token().content());
	      });
	    }
	    else {
	      name = node.last().token().content();
	    }
	    while(this.look) {
	      if(this.look.type() == CSXToken_1.BIND_PROPERTY) {
	        node.add(this.bindAttr());
	      }
	      else if(this.look.type() == CSXToken_1.PROPERTY) {
	        node.add(this.attr());
	      }
	      else if(this.look.content() == '{') {
	        node.add(this.spreadattr());
	      }
	      else {
	        break;
	      }
	    }
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '/>') {
	      node.add(this.match());
	      node.name(Node_1$6.CSXSelfClosingElement);
	      return node;
	    }
	    node.add(this.match('>'));
	    var n = new Node_1$6(Node_1$6.CSXElement);
	    n.add(node);
	    while(this.look && this.look.content() != '</') {
	      n.add(this.CSXchild());
	    }
	    n.add(this.close(name, type));
	    return n;
	  },
	  CSXelemname: function(name, type) {
	    if(name) {
	      if(type) {
	        var node = new Node_1$6(type);
	        var self = this;
	        name.forEach(function(na) {
	          node.add(self.match(na));
	        });
	        return node;
	      }
	      else {
	        return this.match(name);
	      }
	    }
	    else {
	      var node = new Node_1$6(Node_1$6.CSXMemberExpression);
	      node.add(this.match());
	      if(!this.look) {
	        this.error();
	      }
	      if(this.look.content() == '.') {
	        while(this.look && this.look.content() == '.') {
	          node.add(
	            this.match(),
	            this.match(CSXToken_1.ELEM)
	          );
	        }
	      }
	      else if(this.look.content() == ':') {
	        while(this.look && this.look.content() == ':') {
	          node.add(
	            this.match(),
	            this.match(CSXToken_1.ELEM)
	          );
	        }
	      }
	      else {
	        return node.first();
	      }
	      return node;
	    }
	  },
	  CSXmember: function(names) {
	    var node = new Node_1$6(Node_1$6.CSXMemberExpression);
	    names.forEach(function(name) {
	      node.add(this.match(name));
	    });
	    return node;
	  },
	  bindAttr: function() {
	    var node = new Node_1$6(Node_1$6.CSXBindAttribute);
	    node.add(
	      this.match(CSXToken_1.BIND_PROPERTY),
	      this.match('='),
	      this.attrval()
	    );
	    return node;
	  },
	  attr: function() {
	    var node = new Node_1$6(Node_1$6.CSXAttribute);
	    node.add(
	      this.attrname(),
	      this.match('='),
	      this.attrval()
	    );
	    return node;
	  },
	  spreadattr: function() {
	    var node = new Node_1$6(Node_1$6.CSXSpreadAttribute);
	    node.add(
	      this.match(),
	      this.match('...'),
	      this.assignexpr(),
	      this.match('}')
	    );
	    return node;
	  },
	  attrname: function() {
	    var id = this.match(CSXToken_1.PROPERTY);
	    if(this.look && this.look.content() == ':') {
	      var node = new Node_1$6(Node_1$6.CSXNamespacedName);
	      node.add(id,
	        this.match(),
	        this.match(CSXToken_1.PROPERTY)
	      );
	      return node;
	    }
	    return id;
	  },
	  attrval: function() {
	    if(!this.look) {
	      this.error();
	    }
	    if(this.look.content() == '{') {
	      var node = new Node_1$6(Node_1$6.CSXAttributeValue);
	      node.add(this.match());
	      if(this.look && this.look.content() != '}') {
	        node.add(this.assignexpr());
	      }
	      node.add(this.match('}'));
	      return node;
	    }
	    else if(this.look.content() == '[') {
	      var node = new Node_1$6(Node_1$6.CSXAttributeValue);
	      node.add(this.match());
	      while(this.look && this.look.content() != ']') {
	        node.add(this.assignexpr());
	        if(this.look && this.look.content() == ',') {
	          node.add(this.match());
	        }
	      }
	      node.add(this.match(']'));
	      return node;
	    }
	    else if([CSXToken_1.STRING, CSXToken_1.NUMBER].indexOf(this.look.type()) > -1) {
	      return this.match();
	    }
	    return this.CSXelem();
	  },
	  CSXchild: function() {
	    switch(this.look.type()) {
	      case CSXToken_1.TEXT:
	        return this.match();
	      case CSXToken_1.MARK:
	        return this.CSXelem();
	      default:
	        var node = new Node_1$6(Node_1$6.CSXChild);
	        node.add(this.match('{'));
	        if(this.look && this.look.content() != '}') {
	          node.add(this.assignexpr());
	        }
	        node.add(this.match('}'));
	        return node;
	    }
	  },
	  close: function(name, type) {
	    var node = new Node_1$6(Node_1$6.CSXClosingElement);
	    node.add(
	      this.match('</'),
	      this.CSXelemname(name, type),
	      this.match('>')
	    );
	    return node;
	  },
	  match: function(type, line, msg) {
	    if(typeof type == 'boolean') {
	      msg = line;
	      line = type;
	      type = undefined;
	    }
	    if(typeof line != 'boolean') {
	      line = false;
	      msg = line;
	    }
	    //未定义为所有非空白token
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$6(Node_1$6.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //数组为其中一个即可
	    else if(Array.isArray(type)) {
	      if(this.look) {
	        for(var i = 0, len = type.length; i < len; i++) {
	          var t = type[i];
	          if(typeof t == 'string' && this.look.content() == t) {
	            var l = this.look;
	            this.move();
	            return new Node_1$6(Node_1$6.TOKEN, l);
	          }
	          else if(typeof t == 'number' && this.look.type() == t) {
	            var l = this.look;
	            this.move();
	            return new Node_1$6(Node_1$6.TOKEN, l);
	          }
	        }
	      }
	      this.error('missing ' + type.join('|') + (msg || ''));
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      //特殊处理;，不匹配但有换行或者末尾时自动补全，还有受限行
	      if(type == ';'
	        && (!this.look
	        || (this.look.content() != type && this.hasMoveLine)
	        || this.look.content() == '}')
	      ) {
	        if(this.look && Parser_1$2.S[this.look.type()]) {
	          this.move();
	        }
	        return this.virtual(';');
	      }
	      else if(this.look && this.look.content() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$6(Node_1$6.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$6(Node_1$6.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + CSXToken_1.type(type) + (msg || ''));
	      }
	    }
	  }
	}).statics({
	  SELF_CLOSE: CSXLexer.SELF_CLOSE
	});

	var Parser_1$6 = Parser$6;

	var Node$7 = Node_1.extend(function(type, children) {
	  Node_1.call(this, type, children);
	  return this;
	}).statics({
	  DOCUMENT: 'document',
	  ELEMENT: 'element',
	  SelfClosingElement: 'SelfClosingElement',
	  OpeningElement: 'OpeningElement',
	  ClosingElement: 'ClosingElement',
	  Attribute: 'Attribute',
	  getKey: function(s) {
	    if(!s) {
	      throw new Error('empty value');
	    }
	    if(!keys$6) {
	      var self = this;
	      keys$6 = {};
	      Object.keys(this).forEach(function(k) {
	        var v = self[k];
	        keys$6[v] = k;
	      });
	    }
	    return keys$6[s];
	  }
	});
	var keys$6;
	var Node_1$7 = Node$7;

	var S$5 = {};
	S$5[AxmlToken_1.BLANK] = S$5[AxmlToken_1.TAB] = S$5[AxmlToken_1.COMMENT] = S$5[AxmlToken_1.LINE] = S$5[AxmlToken_1.ENTER] = true;
	var SINGLE$1 = {
	  'img': true,
	  'meta': true,
	  'link': true,
	  '!doctype': true,
	  'br': true,
	  'basefont': true,
	  'base': true,
	  'col': true,
	  'embed': true,
	  'frame': true,
	  'hr': true,
	  'input': true,
	  'keygen': true,
	  'area': true,
	  'param': true,
	  'source': true,
	  'track': true
	};

	var Parser$7 = Parser_1.extend(function(lexer) {
	  Parser_1.call(this, lexer);
	  this.init(lexer);
	  return this;
	}).methods({
	  parse: function(code) {
	    this.lexer.parse(code);
	    this.tree = this.document();
	    return this.tree;
	  },
	  init: function(lexer) {
	    this.look = null;
	    this.tokens = null;
	    this.lastLine = 1;
	    this.lastCol = 1;
	    this.line = 1;
	    this.col = 1;
	    this.index = 0;
	    this.length = 0;
	    this.ignores = {};
	    this.hasMoveLine = false;
	    this.tree = {};
	    if(lexer) {
	      this.lexer = lexer;
	    }
	    else if(this.lexer) {
	      this.lexer.init();
	    }
	    else {
	      this.lexer = new AxmlLexer_1(new AxmlRule_1());
	    }
	  },
	  document: function() {
	    this.tokens = this.lexer.tokens();
	    this.length = this.tokens.length;
	    if(this.tokens.length) {
	      this.move();
	    }
	    var node = new Node_1$7(Node_1$7.DOCUMENT);
	    var first = true;
	    while(this.look) {
	      node.add(this.element(first));
	      first = false;
	    }
	    return node;
	  },
	  element: function(first) {
	    if(this.look.type() == AxmlToken_1.TEXT) {
	      return this.match();
	    }
	    else {
	      var node = new Node_1$7(Node_1$7.OpeningElement);
	      node.add(
	        this.match('<'),
	        this.elemname(first)
	      );
	      var name = node.last().token().content();
	      while(this.look && this.look.type() == AxmlToken_1.PROPERTY) {
	        node.add(this.attr());
	      }
	      if(!this.look) {
	        this.error();
	      }
	      if(this.look.content() == '/>') {
	        node.add(this.match());
	        node.name(Node_1$7.SelfClosingElement);
	        return node;
	      }
	      node.add(this.match('>'));
	      if(SINGLE$1.hasOwnProperty(name.toLowerCase())) {
	        node.name(Node_1$7.SelfClosingElement);
	        return node;
	      }
	      var n = new Node_1$7(Node_1$7.ELEMENT);
	      n.add(node);
	      while(this.look && this.look.content() != '</') {
	        n.add(this.element());
	      }
	      n.add(this.close(name));
	      return n;
	    }
	  },
	  elemname: function(first) {
	    if(!this.look) {
	      this.error();
	    }
	    if(first && this.look.type() == AxmlToken_1.DOC) {
	      return this.match();
	    }
	    return this.match(AxmlToken_1.ELEM);
	  },
	  attr: function() {
	    var node = new Node_1$7(Node_1$7.Attribute);
	    node.add(this.match(AxmlToken_1.PROPERTY));
	    if(this.look && this.look.content() == '=') {
	      node.add(this.match());
	      if(!this.look) {
	        this.error();
	      }
	      switch(this.look.type()) {
	        case AxmlToken_1.STRING:
	        case AxmlToken_1.NUMBER:
	        case AxmlToken_1.PROPERTY:
	          node.add(this.match());
	          break;
	        default:
	          this.error();
	      }
	    }
	    return node;
	  },
	  close: function(name) {
	    var node = new Node_1$7(Node_1$7.ClosingElement);
	    node.add(
	      this.match('</'),
	      this.match(name),
	      this.match('>')
	    );
	    return node;
	  },
	  match: function(type, line, msg) {
	    if(typeof type == 'boolean') {
	      msg = line;
	      line = type;
	      type = undefined;
	    }
	    if(typeof line != 'boolean') {
	      line = false;
	      msg = line;
	    }
	    //未定义为所有非空白token
	    if(character.isUndefined(type)) {
	      if(this.look) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$7(Node_1$7.TOKEN, l);
	      }
	      else {
	        this.error('syntax error' + (msg || ''));
	      }
	    }
	    //或者根据token的type或者content匹配
	    else if(typeof type == 'string') {
	      //特殊处理;，不匹配但有换行或者末尾时自动补全，还有受限行
	      if(type == ';'
	        && (!this.look
	          || (this.look.content() != type && this.hasMoveLine)
	          || this.look.content() == '}')
	        ) {
	        if(this.look && S$5[this.look.type()]) {
	          this.move();
	        }
	        return this.virtual(';');
	      }
	      else if(this.look && this.look.content() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$7(Node_1$7.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + type + (msg || ''));
	      }
	    }
	    else if(typeof type == 'number') {
	      if(this.look && this.look.type() == type) {
	        var l = this.look;
	        this.move(line);
	        return new Node_1$7(Node_1$7.TOKEN, l);
	      }
	      else {
	        this.error('missing ' + AxmlToken_1.type(type) + (msg || ''));
	      }
	    }
	  },
	  move: function(line) {
	    this.lastLine = this.line;
	    this.lastCol = this.col;
	    //遗留下来的换行符
	    this.hasMoveLine = false;
	    do {
	      this.look = this.tokens[this.index++];
	      if(!this.look) {
	        return;
	      }
	      //存下忽略的token
	      if(S$5[this.look.type()]) {
	        this.ignores[this.index - 1] = this.look;
	      }
	      //包括line的情况下要跳出
	      if(this.look.type() == AxmlToken_1.LINE) {
	        this.line++;
	        this.col = 1;
	        this.hasMoveLine = true;
	        if(line) {
	          break;
	        }
	      }
	      else if(this.look.type() == AxmlToken_1.COMMENT) {
	        var s = this.look.content();
	        var n = character.count(this.look.content(), character.LINE);
	        if(n > 0) {
	          this.line += n;
	          var i = s.lastIndexOf(character.LINE);
	          this.col += s.length - i - 1;
	          this.hasMoveLine = true;
	          if(line) {
	            break;
	          }
	        }
	      }
	      else {
	        this.col += this.look.content().length;
	        if(!S$5[this.look.type()]) {
	          break;
	        }
	      }
	    } while(this.index <= this.length);
	  },
	  error: function(msg) {
	    msg = 'SyntaxError: ' + (msg || ' syntax error');
	    throw new Error(msg + ' line ' + this.lastLine + ' col ' + this.lastCol);
	  }
	});
	var Parser_1$7 = Parser$7;

	var id = 0;
	var Context = Class(function(parent, name) {
	  this.id = id++;
	  this.parser = new Parser_1$1();
	  this.parent = parent || null; //父上下文，如果是全局则为空
	  this.name = name || null; //上下文名称，即函数名，函数表达式为空，全局也为空
	  this.children = []; //函数声明或函数表达式所产生的上下文
	  this.childrenMap = Object.create(null); //键是函数名，值是上下文，匿名函数表达式键为cid
	  this.vars = []; //变量var声明
	  this.varsMap = Object.create(null); //键为id字面量，值是它的token的节点
	  this.vardeclMap = Object.create(null); //var赋值记录，优先级vardecl > fndecl > varnodecl
	  this.params = []; //形参，函数上下文才有，即全局无
	  this.paramsMap = Object.create(null); //键为id字面量，值是它的token的节点
	  this.aParams = []; //实参，函数表达式才有
	  this.vids = []; //上下文环境里用到的变量id
	  this.vidsMap = Object.create(null); //键为id字面量，值是它的token的节点
	  this.returns = []; //上下文环境里return语句
	  this.node = null; //对应的ast的节点
	  this.thisIs = null; //this指向，仅函数表达式call或apply执行时有用
	  if(!this.isTop()) {
	    this.parent.addChild(this);
	  }
	}).methods({
	  parse: function(code) {
	    var ast;
	    if(code instanceof  Node_1$1) {
	      ast = code;
	    }
	    else {
	      ast = this.parser.parse(code);
	    }
	    recursion(ast, this);
	    return this;
	  },
	  getId: function() {
	    return this.id;
	  },
	  getName: function() {
	    return this.name;
	  },
	  getParent: function() {
	    return this.parent;
	  },
	  isTop: function() {
	    return !this.parent;
	  },
	  isFnexpr: function() {
	    return !this.isTop() && !this.name;
	  },
	  hasParam: function(p) {
	    return p in this.paramsMap;
	  },
	  getParams: function() {
	    return this.params;
	  },
	  addParam: function(p) {
	    //形参不可能重复，无需判断
	    this.paramsMap[p] = this.params.length;
	    this.params.push(p);
	    return this;
	  },
	  getAParams: function() {
	    return this.aParams;
	  },
	  addAParam: function(ap) {
	    this.aParams.push(ap);
	    return this;
	  },
	  getChild: function(name) {
	    return this.childrenMap[name];
	  },
	  getChildren: function() {
	    return this.children;
	  },
	  //通过name查找函数声明，id查找表达式
	  hasChild: function(name) {
	    return name in this.childrenMap;
	  },
	  addChild: function(child) {
	    var name = child.getName();
	    //函数表达式名字为空用id删除
	    if(name) {
	      if(name in this.vardeclMap) {
	        return this;
	      }
	      this.delVar(name);
	      this.delChild(name);
	    }
	    else {
	      this.delChild(child.getId());
	    }
	    name = name || child.getId();
	    this.childrenMap[name] = child;
	    this.children.push(child);
	    return this;
	  },
	  //name函数声明，id表达式
	  delChild: function(name) {
	    if(this.hasChild(name)) {
	      var i = this.children.indexOf(this.childrenMap[name]);
	      this.children.splice(i, 1);
	      delete this.childrenMap[name];
	    }
	    return this;
	  },
	  hasVar: function(v) {
	    return v in this.varsMap;
	  },
	  addVar: function(node, assign) {
	    var v = node.leaves()[0].token().content();
	    //赋值拥有最高优先级，会覆盖掉之前的函数声明和var
	    if(assign) {
	      this.delVar(v);
	      this.delChild(v);
	      this.vardeclMap[v] = true;
	    }
	    //仅仅是var声明无赋值，且已有过声明或函数，忽略之
	    else if(this.hasVar(v) || this.hasChild(v)) {
	      return this;
	    }
	    this.varsMap[v] = node;
	    this.vars.push(node);
	    return this;
	  },
	  delVar: function(v) {
	    if(this.hasVar(v)) {
	      var i = this.vars.indexOf(this.varsMap[v]);
	      this.vars.splice(i, 1);
	      delete this.varsMap[v];
	    }
	    return this;
	  },
	  getVars: function() {
	    return this.vars;
	  },
	  addReturn: function(node) {
	    this.returns.push(node);
	    return this;
	  },
	  getReturns: function() {
	    return this.returns;
	  },
	  hasVid: function(v) {
	    return v in this.vidsMap;
	  },
	  getVid: function(v) {
	    return this.vidsMap[v];
	  },
	  addVid: function(node) {
	    var v = node.token().content();
	    this.vids.push(node);
	    this.vidsMap[v] = this.vidsMap[v] || [];
	    this.vidsMap[v].push(node);
	    return this;
	  },
	  getVids: function() {
	    return this.vids;
	  },
	  getNode: function() {
	    return this.node;
	  },
	  setNode: function(n) {
	    this.node = n;
	    return this;
	  },
	  setThis: function(t) {
	    this.thisIs = t;
	    return this;
	  },
	  getThis: function() {
	    return this.thisIs;
	  }
	});

	function recursion(node, context) {
	  var isToken = node.name() == Node_1$1.TOKEN;
	  var isVirtual = isToken && node.token().type() == Token_1.VIRTUAL;
	  if(isToken) {
	    if(!isVirtual) {
	      var token = node.token();
	      var s = token.content();
	      if(s == 'return') {
	        context.addReturn(node);
	      }
	    }
	  }
	  else {
	    if(node.name() == Node_1$1.VARDECL) {
	      vardecl(node, context);
	    }
	    else if(node.name() == Node_1$1.FNDECL) {
	      context = fndecl(node, context);
	    }
	    else if(node.name() == Node_1$1.FNEXPR) {
	      context = fnexpr(node, context);
	    }
	    else if(node.name() == Node_1$1.PRMREXPR) {
	      prmrexpr(node, context);
	    }
	    node.leaves().forEach(function(leaf, i) {
	      recursion(leaf, context);
	    });
	  }
	}
	function vardecl(node, context) {
	  var leaves = node.leaves();
	  var assign = !!leaves[1];
	  context.addVar(node, assign);
	}
	function fndecl(node, context) {
	  var v = node.leaves()[1].leaves().content();
	  var child = new Context(context, v);
	  child.setNode(node);
	  var params = node.leaves()[3];
	  if(params.name() == Node_1$1.FNPARAMS) {
	    addParam(params, child);
	  }
	  return child;
	}
	function fnexpr(node, context) {
	  //函数表达式name为空
	  var child = new Context(context);
	  child.setNode(node);
	  //记录形参
	  var params;
	  var v = node.leaves()[1];
	  if(v.token().content() != '(') {
	    params = node.leaves()[3];
	  }
	  else {
	    params = node.leaves()[2];
	  }
	  if(params.name() == Node_1$1.FNPARAMS) {
	    addParam(params, child);
	  }
	  //匿名函数检查实参传入情况，包括call和apply设置this
	  var next = node.next();
	  //!function(){}()形式
	  if(next && next.name() == Node_1$1.ARGS) {
	    var leaves = next.leaves();
	    //长度2为()空参数，长度3有参数，第2个节点
	    if(leaves.length == 3) {
	      addAParam(leaves[1], child);
	    }
	  }
	  //call或applay
	  else if(next
	    && next.name() == Node_1$1.TOKEN
	    && next.token().content() == '.'
	    && next.next()
	    && next.next().name() == Node_1$1.TOKEN
	    && ['call', 'apply'].indexOf(next.next().token().content()) > -1) {
	    var mmb = node.parent();
	    if(mmb.name() == Node_1$1.MMBEXPR) {
	      var callexpr = mmb.parent();
	      if(callexpr.name() == Node_1$1.CALLEXPR) {
	        var isApply = next.next().token().content() == 'apply';
	        next = mmb.next();
	        if(next && next.name() == Node_1$1.ARGS) {
	          var leaves = next.leaves();
	          //长度2为()空参数，长度3有参数，第2个节点
	          if(leaves.length == 3) {
	            isApply ? addApplyAParam(leaves[1], child) : addCallAParam(leaves[1], child);
	          }
	        }
	      }
	    }
	  }
	  //(function(){})()形式
	  else {
	    var prmr = node.parent();
	    var prev = node.prev();
	    if(prmr.name() == Node_1$1.PRMREXPR
	      && prev
	      && prev.name() == Node_1$1.TOKEN
	      && prev.token().content() == '(') {
	      next = prmr.next();
	      if(next && next.name() == Node_1$1.ARGS) {
	        var leaves = next.leaves();
	        //长度2为()空参数，长度3有参数，第2个节点
	        if(leaves.length == 3) {
	          addAParam(leaves[1], child);
	        }
	      }
	      //(function(){}).call()形式
	      else if(next
	        && next.name() == Node_1$1.TOKEN
	        && next.token().content() == '.'
	        && next.next()
	        && next.next().name() == Node_1$1.TOKEN
	        && ['call', 'apply'].indexOf(next.next().token().content()) > -1) {
	        var mmb = prmr.parent();
	        if(mmb.name() == Node_1$1.MMBEXPR) {
	          var callexpr = mmb.parent();
	          if(callexpr.name() == Node_1$1.CALLEXPR) {
	            var isApply = next.next().token().content() == 'apply';
	            next = mmb.next();
	            if(next && next.name() == Node_1$1.ARGS) {
	              var leaves = next.leaves();
	              //长度2为()空参数，长度3有参数，第2个节点
	              if(leaves.length == 3) {
	                isApply ? addApplyAParam(leaves[1], child) : addCallAParam(leaves[1], child);
	              }
	              else {
	                child.setThis(undefined);
	              }
	            }
	          }
	        }
	      }
	    }
	  }
	  return child;
	}

	function addParam(params, child) {
	  params.leaves().forEach(function(leaf, i) {
	    if(leaf.name() == Node_1$1.TOKEN && leaf.token().content() != ',') {
	      child.addParam(leaf.token().content());
	    }
	  });
	}
	function addAParam(params, child) {
	  params.leaves().forEach(function(leaf, i) {
	    if(i % 2 == 0) {
	      child.addAParam(leaf);
	    }
	  });
	}
	function addCallAParam(params, child) {
	  params.leaves().forEach(function(leaf, i) {
	    if(i == 0) {
	      child.setThis(leaf);
	    }
	    else if(i % 2 == 1) {
	      child.addAParam(leaf);
	    }
	  });
	}
	function addApplyAParam(params, child) {
	  child.setThis(params.leaves()[0]);
	  if(params.leaves()[2]) {
	    params.leaves()[2].leaves()[0].leaves().forEach(function(leaf, i) {
	      if(i % 2 == 1) {
	        child.addAParam(leaf);
	      }
	    });
	  }
	}
	function prmrexpr(node, context) {
	  var first = node.leaves()[0];
	  if(first.name() == Node_1$1.TOKEN) {
	    var token = first.token();
	    if(token.type() == Token_1.ID || token.content() == 'this') {
	      context.addVid(first);
	    }
	  }
	}

	var Context_1 = Context;

	var homunculus = createCommonjsModule(function (module, exports) {
	exports.getClass = function (type, lan) {
	  type = (type || '').toLowerCase();
	  lan = (lan || '').toLowerCase();
	  switch (type) {
	    case 'lexer':
	      switch (lan) {
	        case 'js':
	        case 'javascript':
	        case 'es':
	        case 'es5':
	        case 'es6':
	        case 'es7':
	        case 'es2015':
	        case 'es2016':
	        case 'ecmascript':
	        case 'as':
	        case 'actionscript':
	          return EcmascriptLexer_1;
	        case 'css':
	          return CssLexer_1;
	        case 'html':
	        case 'htm':
	          return HtmlLexer_1;
	        case 'axml':
	          return AxmlLexer_1;
	        case 'jsx':
	          return JSXLexer_1;
	        case 'csx':
	          return CSXLexer;
	        default:
	          return Lexer_1;
	      }
	      break;
	    case 'parser':
	      switch (lan) {
	        case 'js':
	        case 'javascript':
	        case 'es':
	        case 'es5':
	        case 'ecmascript':
	          return Parser_1$1;
	        case 'es6':
	        case 'es7':
	        case 'es2015':
	        case 'es2016':
	          return Parser_1$2;
	        case 'css':
	          return Parser_1$3;
	        case 'html':
	        case 'htm':
	          return Parser_1$4;
	        case 'axml':
	          return Parser_1$7;
	        case 'jsx':
	          return Parser_1$5;
	        case 'csx':
	          return Parser_1$6;
	        default:
	          throw new Error('Unsupport Language Parser: ' + lan);
	      }
	      break;
	    case 'node':
	      switch (lan) {
	        case 'js':
	        case 'javascript':
	        case 'es':
	        case 'es5':
	        case 'ecmascript':
	          return Node_1$1;
	        case 'es6':
	        case 'es7':
	        case 'es8':
	        case 'es2015':
	        case 'es2016':
	          return Node_1$2;
	        case 'css':
	          return Node_1$3;
	        case 'html':
	        case 'htm':
	          return Node_1$4;
	        case 'axml':
	          return Node_1$7;
	        case 'jsx':
	          return Node_1$5;
	        case 'csx':
	          return Node_1$6;
	        default:
	          throw new Error('Unsupport Language Node: ' + lan);
	      }
	      break;
	    case 'context':
	      switch (lan) {
	        case 'js':
	        case 'javascript':
	        case 'es':
	        case 'es5':
	        case 'ecmascript':
	        case 'es6':
	        case 'es7':
	        case 'es8':
	        case 'es2015':
	        case 'es2016':
	          return Context_1;
	        default:
	          throw new Error('Unsupport Language Context: ' + lan);
	      }
	      break;
	    case 'token':
	      switch (lan) {
	        case 'css':
	          return CssToken_1;
	        case 'htm':
	        case 'html':
	          return HtmlToken_1;
	        case 'axml':
	          return AxmlToken_1;
	        case 'jsx':
	          return JSXToken_1;
	        case 'csx':
	          return CSXToken_1;
	        default:
	          return Token_1;
	      }
	    case 'rule':
	      switch (lan) {
	        case 'js':
	        case 'javascript':
	        case 'es':
	        case 'es5':
	        case 'es6':
	        case 'es7':
	        case 'es8':
	        case 'es2015':
	        case 'es2016':
	        case 'ecmascript':
	          return EcmascriptRule_1;
	        case 'css':
	          return CssRule_1;
	        case 'htm':
	        case 'html':
	          return HtmlRule_1;
	        case 'axml':
	          return AxmlRule_1;
	        case 'jsx':
	          return EcmascriptRule_1;
	        case 'csx':
	          return EcmascriptRule_1;
	        case 'java':
	          return JavaRule_1;
	        default:
	          return Rule_1;
	      }
	    case 'walk':
	      return walk;
	    default:
	      throw new Error('Unsupport Class Type: ' + type);
	  }
	};

	exports.getLexer = function (lan) {
	  lan = lan.toLowerCase();
	  switch (lan) {
	    case 'js':
	    case 'javascript':
	    case 'es':
	    case 'es5':
	    case 'ecmascript':
	    case 'es6':
	    case 'es7':
	    case 'es8':
	    case 'es2015':
	    case 'es2016':
	    case 'as':
	    case 'actionscript':
	      return new EcmascriptLexer_1(new EcmascriptRule_1());
	    case 'css':
	      return new CssLexer_1(new CssRule_1());
	    case "java":
	      return new Lexer_1(new JavaRule_1());
	    case "c":
	    case "c++":
	    case "cpp":
	    case "cplusplus":
	      return new Lexer_1(new CRule_1());
	    case 'html':
	    case 'htm':
	      return new HtmlLexer_1(new HtmlRule_1());
	    case 'axml':
	      return new AxmlLexer_1(new AxmlRule_1());
	    case 'jsx':
	      return new JSXLexer_1(new EcmascriptRule_1());
	    case 'csx':
	      return new CSXLexer(new EcmascriptRule_1());
	    default:
	      throw new Error('Unsupport Language Lexer: ' + lan);
	  }
	};

	exports.getParser = function (lan) {
	  lan = lan.toLowerCase();
	  switch (lan) {
	    case 'js':
	    case 'javascript':
	    case 'es':
	    case 'es5':
	    case 'ecmascript':
	      return new Parser_1$1(exports.getLexer(lan));
	    case 'es6':
	    case 'es7':
	    case 'es8':
	    case 'es2015':
	    case 'es2016':
	      return new Parser_1$2(exports.getLexer(lan));
	    case 'css':
	      return new Parser_1$3(exports.getLexer(lan));
	    case 'html':
	    case 'htm':
	      return new Parser_1$4(exports.getLexer(lan));
	    case 'axml':
	      return new Parser_1$7(exports.getLexer(lan));
	    case 'jsx':
	      return new Parser_1$5(exports.getLexer(lan));
	    case 'csx':
	      return new Parser_1$6(exports.getLexer(lan));
	    default:
	      throw new Error('Unsupport Language Parser: ' + lan);
	  }
	};

	exports.getContext = function (lan) {
	  lan = lan.toLowerCase();
	  switch (lan) {
	    case 'js':
	    case 'javascript':
	    case 'es':
	    case 'es5':
	    case 'ecmascript':
	    case 'es6':
	    case 'es7':
	    case 'es8':
	    case 'es2015':
	    case 'es2016':
	      return new Context_1();
	    default:
	      throw new Error('Unsupport Language Context: ' + lan);
	  }
	};

	exports.reset = function() {
	  Token_1.reset();
	};
	});
	var homunculus_1 = homunculus.getClass;
	var homunculus_2 = homunculus.getLexer;
	var homunculus_3 = homunculus.getParser;
	var homunculus_4 = homunculus.getContext;
	var homunculus_5 = homunculus.reset;

	exports.default = homunculus;
	exports.getClass = homunculus_1;
	exports.getContext = homunculus_4;
	exports.getLexer = homunculus_2;
	exports.getParser = homunculus_3;
	exports.reset = homunculus_5;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=homunculus.js.map
