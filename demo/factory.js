define(function(require, exports) {
	var Lexer = homunculus.getClass('lexer'),
		EcmascriptLexer = homunculus.getClass('lexer', 'ecmascript'),
		CssLexer = homunculus.getClass('lexer', 'css'),
    HtmlLexer = homunculus.getClass('lexer', 'html'),
		AxmlLexer = homunculus.getClass('lexer', 'axml'),
    JSXLexer = homunculus.getClass('lexer', 'jsx'),
		CSXLexer = homunculus.getClass('lexer', 'csx'),
		EcmascriptRule = homunculus.getClass('rule', 'ecmascript'),
		CssRule = homunculus.getClass('rule', 'css'),
    HtmlRule = homunculus.getClass('rule', 'html'),
		AxmlRule = homunculus.getClass('rule', 'axml'),
    JavaRule = homunculus.getClass('rule', 'java'),
    CRule = homunculus.getClass('rule', 'c');
	exports.lexer = function(syntax) {
		switch(syntax.toLowerCase()) {
			case 'js':
			case 'javascript':
			case 'ecmascript':
			case 'es6':
			case 'jscript':
			case 'as':
			case 'as3':
			case 'actionscript':
			case 'actionscript3':
				return new EcmascriptLexer(new EcmascriptRule());
			case 'css':
			case 'css2':
			case 'css3':
				return new CssLexer(new CssRule());
			case 'java':
				return new Lexer(new JavaRule());
			case 'c':
			case 'c++':
			case 'cpp':
			case 'cplusplus':
				return new Lexer(new CRule());
      case 'htm':
      case 'html':
        return new HtmlLexer(new HtmlRule());
			case 'axml':
				return new AxmlLexer(new AxmlRule());
      case 'jsx':
        return new JSXLexer(new EcmascriptRule());
			case 'csx':
				return new CSXLexer(new EcmascriptRule());
		}
	};
});
