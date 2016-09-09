/**
* @Author: zhangxinliang
* @Date:   2016-08-30 16:48:45
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:34
*/

import _ from './util'

let config = {
    open: '{{',
    close: '}}'
}

/**
 * _query 根据类别返回相应正则
 * @param  {Number} type 类别，0为匹配js语句，1为匹配模板变量，默认为0
 * @return {RegExp}          返回相应正则
 */
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

    //解析函数-将模板语句解析为Function，并添加至缓存
    parse(tpl, data) {
        let exp = _.exp,
            jsOpenEX = exp('^' + config.open + '#', ''),
            jsCloseEX = exp(config.close + '$')

        tpl = tpl.replace(/[\r\t\n]/g, ' ')
            .replace(exp(config.open) + '#', config.open + '# ')
            .replace(exp(config.close + '}'), '} ' + config.close)
            .replace(/\\/g, '\\\\')
            .replace(/(?="|')/g, '\\')
            .replace(_query(), (str) => {
                str = str.replace(jsOpenEX, '').replace(jsCloseEX, '')
                return '";' + str.replace(/\\/g, '') + '; view +="'
            })
            .replace(_query(1), (str) => {
                var start = '"+('
                if (str.replace(/\s/g, '') === config.open + config.close) {
                    return ''
                }
                str = str.replace(exp(config.open + '|' + config.close), '')
                if (/^=/.test(str)) {
                    str = str.replace(/^=/, '')
                    start = '"+html('
                }
                return start + str.replace(/\\/g, '') + ')+"'
            })
        tpl = '"use strict";var view = "' + tpl + '";return view;'

        try {
            this.cache = tpl = new Function('data, html', tpl)
            return tpl(data, _.escapeHTML)
        } catch (e) {
            this.cache = null
            return _.warn('Render', e)
        }
    }

    //模板渲染函数-将模板字符串渲染为可使用的DOM字符串
    render(data, cb = () => {}) {
        let tpl
        if (!data) return _.warn('Render', 'undefined data')
        if (!_.isType('function', cb)) return _.warn('Render', 'arguments cb should be Function')
        tpl = this.cache ? this.cache(data, _.escapeHTML) : this.parse(this.tpl, data)
        cb(tpl)
        return tpl
    }
}

/**
 * rtpl 暴露在外部的模板注册函数，免new操作
 * @param  {String} tpl 模板语句
 * @return {Object}     返回一个Tpl对象实例
 */
function rtpl(tpl) {
    if (!_.isType('string', tpl))
        return _.warn('Render', 'template should be String')
    return new Tpl(tpl)
}

export default rtpl
