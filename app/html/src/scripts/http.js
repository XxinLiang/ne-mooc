/*
* @Author: zhangxinliang
* @Date:   2016-08-22 17:23:17
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-08-24 15:15:08
*/

'use strict';

let util = {
	parse (data) {
		if (typeof data === 'object') {
			let result = '';
			for (let i in data) {
	            result += i + '=' + data[i] + "&";
	        }
	        return result;
	    } else {
	    	this.warn('data must be an object');
	    }
	},
	warn (msg) {
		let error = 'HTTP Warn: ';
		console && console.warn(error + msg);
		return error + msg;
	}
}
/**
 * http
 * @param  {object} options 参数options包含一个必选属性与三个可选属性
 *     *url {string} 请求url
 *     data {object} 请求参数
 *     type {string} 请求类型 支持GET与POST 默认为GET
 *     dataType {string} 返回值类型 设置该属性值为'json'时将自动解析返回值 目前只支持json
 * @return {promise}         返回一个Pormise对象的实例
 */
function http (options) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest(),
			data = options.data ? util.parse(options.data) : '';

		options.type = options.type || 'GET';

		if ('GETget'.indexOf(options.type) !== -1) {
			xhr.open(options.type, options.url += data ? '?' + data : '', true);
	        xhr.send(null);
	    } else if ('POSTpost'.indexOf(options.type) !== -1){
	    	xhr.open(options.type, options.url, true);
	    	xhr.send(data);
	    }

	    xhr.onreadystatechange = () => {
	        if (xhr.readyState == 4) {
	            if (xhr.status >=200 && xhr.status <= 207 || xhr.status == 304) {
	            	if ('JSONjson'.indexOf(options.dataType) !== -1) resolve(JSON.parse(xhr.responseText));
	            	resolve(xhr.responseText);
	            	
	            } else {
	            	reject(xhr.status)
	            }
	        }
	    }
	});
}

export default http;