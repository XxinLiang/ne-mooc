var _ = {
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

let config = {
    open: '{{',
    close: '}}'
}

function _query(type = 0) {
    return _.exp(config.open + [
        '#([\\s\\S])+?',
        '([^{#}])*?'
    ][type] + config.close)
}

class Tpl  {
    constructor(tpl) {
        this.tpl = tpl
        this.cache = null
    }

    parse(tpl, data) {
        let exp = _.exp,
            jsOpenEX = exp('^' + config.open + '#', ''),
            jsCloseEX = exp(config.close + '$')

        tpl = tpl.replace(/[\r\t\n]/g, ' ')
            .replace(exp(config.open)+'#', config.open + '# ')
            .replace(exp(config.close + '}'), '} ' + config.close)
            .replace(/\\/g, '\\\\')
            .replace(/(?="|')/g, '\\')
            .replace(_query(), (str) => {
                str = str.replace(jsOpenEX, '').replace(jsCloseEX, '')
                return '";' + str.replace(/\\/g, '') + '; view +="'
            })
            .replace(_query(1), (str) => {
                var start = '"+('
                if (str.replace(/\s/g, '') === config.open+config.close) {
                    return ''
                }
                str = str.replace(exp(config.open+'|'+config.close), '')
                if (/^=/.test(str)) {
                    str = str.replace(/^=/, '')
                    start = '"+html('
                }
                return start + str.replace(/\\/g, '') + ')+"'
            });
        tpl = '"use strict";var view = "' + tpl + '";return view;'

        try {
            this.cache = tpl = new Function('data, html', tpl)
            return tpl(data, _.escapeHTML)
        } catch (e) {
            this.cache = null
            return _.warn('Render', e)
        }
    }
    
    render(data, cb = () => {}) {
        let tpl
        if (!data) return _.warn('Render', 'undefined data')
        if (typeof cb !== 'function') return _.warn('Render', 'arguments cb should be Function')
        tpl = this.cache ? this.cache(data, _.escapeHTML) : this.parse(this.tpl, data)
        cb(tpl)
        return tpl
    }
}

function rtpl(tpl) {
    if (typeof tpl !== 'string') 
        return _.warn('Render', 'template should be String');
    return new Tpl(tpl);
}

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
        } else if ('POSTpost'.indexOf(options.type) !== -1){
            xhr.open(options.type, options.url, true)
            xhr.send(data)
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status <= 207 || xhr.status === 304) {
                    if ('JSONjson'.indexOf(options.dataType) !== -1) resolve(JSON.parse(xhr.responseText))
                    resolve(xhr.responseText)	
                } else {
                    reject(xhr.status)
                }
            }
        }
    })
}

http({
    url: 'http://study.163.com/webDev/couresByCategory.htm',
    data: {
        pageNo: 1,
        psize: 6,
        type: 20
    },
    type: 'GET',
    dataType: 'json'
}).then((data) => {
    console.log(data)
    document.querySelector('.g-bd').innerHTML = rtpl([
        '{{# data.list.forEach(function (item){ }}',
            '<div>',
                '<span>{{item.name}}</span>',
                '<img src="{{item.bigPhotoUrl}}">',
                '<p>{{item.description}}</p>',
            '</div>',
        '{{# }) }}'
    ].join('')).render(data)
}).catch((err) => {
    console.log(err)
})