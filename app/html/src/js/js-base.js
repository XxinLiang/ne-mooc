/*
* @Author: Xx
* @Date:   2016-07-19 20:43:20
* @Last Modified by:   Xx
* @Last Modified time: 2016-08-28 19:13:07
*/

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function random() {
	return Math.floor(Math.random() * 1000);
}

function parseQuery(query) {
	var result = {},
	    tempArr = [];
	if (typeof query != 'string') {
		return;
	}
	tempArr = query.split('&');
	for (var i = 0, len = tempArr.length; i < len; i++) {
		var keyValueArr = tempArr[i].split('=');
		keyValueArr.forEach(function (item, index) {
			keyValueArr[index] = item.replace(/\s*/g, '');
		});
		keyValueArr != '' && (result[keyValueArr[0]] = keyValueArr[1] || '');
	}
	return result;
}

function multiply() {
	var result = 1;
	for (var item in arguments) {
		result *= parseInt(item);
	}
	return result;
}

function Person(name, age) {
	this.name = name;
	this.age = age;
}
Person.prototype.introduce = function () {
	return 'I am ' + this.name + ', I am ' + this.age + ' years old!';
};

function escapeHTML(htmlStr) {
	var tpl = {
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	};
	htmlStr = htmlStr.replace(/&/g, '&amp;');
	for (var s in tpl) {
		htmlStr = htmlStr.replace(new RegExp(s, 'g'), tpl[s]);
	}
	return htmlStr;
}

function type(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

Object.create = Object.create || function (proto) {
	function F() {};
	F.prototype = proto;
	var o = new F();
	F.prototype = null;
	return o;
};

Function.prototype.bind = Function.prototype.bind || function (obj) {
	var self = this,
	    args = Array.prototype.slice.call(arguments, 1);
	return function () {
		self.apply(obj, args);
	};
};

function fibonacci(n) {
	if (n < 2) {
		return n;
	} else {
		return arguments.callee(n - 1) + arguments.callee(n - 2);
	}
}

var getDialog = function getDialog(options) {
	var title = options.title || '标题',
	    content = options.content || '内容',
	    tpl = ['<div class="weui_dialog_alert">', '<div class="weui_mask"></div>', '<div class="weui_dialog">', '<div class="weui_dialog_hd"><strong class="weui_dialog_title">' + title + '</strong></div>', '<div class="weui_dialog_bd">' + content + '</div>', '<div class="weui_dialog_ft">', '<a href="#" class="weui_btn_dialog primary">确定</a>', '</div>', '</div>', '</div>'].join(''),
	    dom = document.createElement('div');

	document.body.appendChild(dom);
	dom.innerHTML = tpl;
};

function myType(param) {
	var toString = Object.prototype.toString;
	if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) == 'object') {
		if (toString.call(param).slice(8, -1) == 'Object') {
			return 'object';
		} else {
			return toString.call(param).slice(8, -1);
		}
	} else {
		return typeof param === 'undefined' ? 'undefined' : _typeof(param);
	}
}

function search(arr, dst) {
	var l = 0,
	    r = arr.length - 1;

	while (l <= r) {
		var m = Math.floor((l + r) / 2);
		if (dst < arr[m]) {
			r = m - 1;
		} else if (dst > arr[m]) {
			l = m + 1;
		} else {
			return arr[m - 1] == dst ? m - 1 : m;
		}
	}
	return -1;
}

function formatDate(date, pattern) {
	function addZero(num) {
		return num < 10 ? '0' + num : num;
	}
	return pattern.replace(/yyyy/, date.getFullYear()).replace(/MM/, addZero(date.getMonth() + 1)).replace(/dd/, addZero(date.getDate())).replace(/HH/, addZero(date.getHours())).replace(/mm/, addZero(date.getMinutes())).replace(/ss/, addZero(date.getSeconds()));
}

function getElementChild(element) {
	if (element.children) return element.children;

	var children = [],
	    nodeList = element.childNodes;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = nodeList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;

			item.nodeType === 1 && children.push(item);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return children;
}

function getElementsByClassName(element, names) {
	if (document.getElementsByClassName) return element.getElementsByClassName(names);
	var children = element.getElementsByTagName('*'),
	    result = [];
	names = names.split(' ');
	for (var i = 0, len = children.length; i < len; i++) {
		var flag = true,
		    item = children[i];
		for (var j = 0; j < names.length; j++) {
			var name = names[j];
			if (item.className.indexOf(name) === -1) {
				flag = false;
				break;
			}
		}
		flag && result.push(item);
	}
	return result;
}

function getCookies() {
	var result = {},
	    cookie = document.cookie;
	if (!cookie) return result;
	cookie.split(';').forEach(function (item) {
		var temp = item.split('=');
		result[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
	});
	return result;
}

function fadeout(el) {
	var o = 1,
	    timer,
	    setOpacity = function () {
		if (el.filters) {
			return function () {
				el.style.filter = 'alpha(opacity=' + 100 * o + ')';
			};
		} else {
			return function () {
				el.style.opacity = o;
			};
		}
	}();
	timer = setInterval(function () {
		setOpacity();
		o -= 0.1;
		o < 0 && clearInterval(timer);
	}, 100);
}