define(function(require, exports, module) {
	var Token = homunculus.getClass('token');
	var CssToken = homunculus.getClass('token', 'css');
	var HtmlToken = homunculus.getClass('token', 'html');
	var JSXToken = homunculus.getClass('token', 'jsx');
	var CSXToken = homunculus.getClass('token', 'csx');
	Object.keys(CssToken).forEach(function(k) {
		Token[k] = Token[k] || CssToken[k];
	});
	Object.keys(HtmlToken).forEach(function(k) {
		Token[k] = Token[k] || HtmlToken[k];
	});
  Object.keys(JSXToken).forEach(function(k) {
    Token[k] = Token[k] || JSXToken[k];
  });
	Object.keys(CSXToken).forEach(function(k) {
		Token[k] = Token[k] || CSXToken[k];
	});
	function escapeHtml(str) {
		var xmlchar = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;"
		};
		return str.replace(/[<>&]/g, function($1){
			return xmlchar[$1];
		});
	}
	module.exports = function(tokens, tabBlank) {
		var df = document.createDocumentFragment(),
			li = document.createElement('li'),
			temp = [];
		tokens.forEach(function(o) {
			if(o.type() == Token.LINE) {
				if(!temp.length) {
					temp.push('&nbsp;');
				}
				li.innerHTML = temp.join('');
				df.appendChild(li);
				li = document.createElement('li');
				temp = [];
			}
			else if(o.type() == Token.BLANK) {
				temp.push('&nbsp;');
			}
			else if(o.type() == Token.TAB) {
				temp.push(tabBlank);
			}
			else if(o.type() == Token.SIGN) {
				temp.push(escapeHtml(o.content()));
			}
			else {
				if(o.content().indexOf('\n') == -1) {
					temp.push('<span class="' + Token.type(o.type()).toLowerCase() + '">' + escapeHtml(o.content()).replace(/\t/g, tabBlank).replace(/ /g, '&nbsp;') + '</span>');
				}
				else {
					var arr = o.content().split('\n'),
						len = arr.length;
					arr.forEach(function(s, i) {
						if(i == 0) {
							temp.push('<span class="' + Token.type(o.type()).toLowerCase() + '">' + escapeHtml(s).replace(/\t/g, tabBlank).replace(/ /g, '&nbsp;') + '</span>');
							li.innerHTML = temp.join('');
							df.appendChild(li);
						}
						else if(i == len - 1) {
							temp = [];
							temp.push('<span class="' + Token.type(o.type()).toLowerCase() + '">' + escapeHtml(s).replace(/\t/g, tabBlank).replace(/ /g, '&nbsp;') + '</span>');
						}
						else {
							li.innerHTML = '<span class="' + Token.type(o.type()).toLowerCase() + '">' + escapeHtml(s).replace(/\t/g, tabBlank).replace(/ /g, '&nbsp;') + '</span>';
							df.appendChild(li);
						}
						li = document.createElement('li');
					});
				}
			}
		});
		if(!temp.length) {
			temp.push('&nbsp;');
		}
		li.innerHTML = temp.join('');
		df.appendChild(li);
		return df;
	}
});
