/**
* @Author: zhangxinliang
* @Date:   2016-08-30 15:18:34
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:01
*/

import _ from './util'
import Promise from './promise'

/**
 * _parse 解析data参数
 * @param  {Object} data 请求参数对象
 * @return {String}      解析后的字符串
 */
function _parse(data) {
    if (typeof data === 'object') {
        let result = ''
        for (let i in data) {
            result += i + '=' + data[i] + "&"
        }
        return result
    } else {
        _.warn('HTTP', 'data must be an Object')
    }
}

/**
 * http
 * @param  {Object} options 参数options包含一个必选属性与三个可选属性
 *     *url {String} 请求url
 *     data {Object} 请求参数
 *     type {String} 请求类型 支持GET与POST 默认为GET
 *     dataType {String} 返回值类型 设置该属性值为'json'时将自动解析返回值 目前只支持json
 * @return {Promise}         返回一个Pormise对象的实例
 */
function http(options) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest(),
            data = options.data ? _parse(options.data) : ''

        options.type = options.type || 'GET'

        if ('GETget'.indexOf(options.type) !== -1) {
            xhr.open(options.type, options.url += data ? '?' + data : '', true)
            xhr.send(null)
        } else if ('POSTpost'.indexOf(options.type) !== -1) {
            xhr.open(options.type, options.url, true)
            xhr.send(data)
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status <= 207 || xhr.status === 304) {
                    if ('JSONjson'.indexOf(options.dataType) !== -1) resolve(JSON.parse(xhr.responseText))
                    else resolve(xhr.responseText)
                } else {
                    reject(xhr.status)
                }
            }
        }
    })
}

export default http
