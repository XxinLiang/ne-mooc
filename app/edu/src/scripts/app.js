/*
* @Author: zhangxinliang
* @Date:   2016-08-30 14:09:49
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-08-30 15:30:03
*/

'use strict'

import http from './http.js'

http({
	url: 'http://study.163.com/webDev/couresByCategory.htm',
	data: {
		pageNo: 1,
		psize: 8,
		type: 20
	},
	type: 'GET',
	dataType: 'json'
}).then((res) => {
	console.log(res)
}).catch((err) => {
	console.log(err)
})
