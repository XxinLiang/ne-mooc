/*
* @Author: zhangxinliang
* @Date:   2016-07-04 16:14:36
* @Last Modified by:   Xx
* @Last Modified time: 2016-08-18 21:50:22
*/

'use strict';

import _ from './main.js';

console.log(_(1));

class Test {
	constructor (str) {
		this.str = str;
	}
}

console.log(new Test('srt'));