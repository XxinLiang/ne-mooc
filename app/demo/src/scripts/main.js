/*
* @Author: zhangxinliang
* @Date:   2016-07-04 16:12:42
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-07-04 19:16:03
*/

'use strict';

import module  from "module";

let a = () => {
	return new Promise((resolve, reject) => {
		resolve('a');
	});
}
a.num = module.a;
