/*
* @Author: zhangxinliang
* @Date:   2016-07-04 16:14:36
* @Last Modified by:   Xx
* @Last Modified time: 2016-08-18 21:50:22
*/

'use strict';

var _main = require('./main.js');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log((0, _main2.default)(1));

var Test = function Test(str) {
	_classCallCheck(this, Test);

	this.str = str;
};

console.log(new Test('srt'));