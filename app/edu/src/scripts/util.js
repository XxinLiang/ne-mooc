/*
* @Author: zhangxinliang
* @Date:   2016-08-30 15:38:33
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-08-30 17:23:00
*/

'use strict'

export default {
    exp(str = '') {
        return new RegExp(str, 'g')
    },
    escapeHTML(html = '') {
        return html.replace(/&(?!#?[0-9A-Za-z]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
    },
    warn(module = 'Global', msg = 'something happened:)') {
        let error = module + ' Warn: '
        console && console.warn(error + msg)
        return error + msg
    }
}