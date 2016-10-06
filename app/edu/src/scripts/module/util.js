/**
* @Author: zhangxinliang
* @Date:   2016-08-30 15:38:33
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:41
*/

function hasClass(el, className) {
    return el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
    if (!hasClass(el, className)) el.className += ' ' + className
}

function removeClass(el, className) {
    if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className = el.className.replace(reg, ' ')
    }
}

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
    },
    isType(type, obj) {
    	return type === 'dom' ? obj instanceof HTMLElement : type === Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    },
    addClass,
    removeClass
}
