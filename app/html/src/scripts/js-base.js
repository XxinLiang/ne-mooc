/*
* @Author: Xx
* @Date:   2016-07-19 20:43:20
* @Last Modified by:   Xx
* @Last Modified time: 2016-07-19 22:01:23
*/

'use strict';

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
	for (var i = 0, len = tempArr.length; i < len; i ++) {
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
}

function escapeHTML(htmlStr) {
	var tpl = {
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	}
	htmlStr = htmlStr.replace(/&/g, '&amp;');
	for (var s in tpl) {
		htmlStr = htmlStr.replace(new RegExp(s, 'g'), tpl[s]);
	}
	return htmlStr;
}
