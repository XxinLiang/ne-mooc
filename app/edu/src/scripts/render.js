/**
* @Author: zhangxinliang
* @Date:   2016-08-30 16:48:45
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-02 09:38:44
*/

'use strict'

import _ from './util'

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
        return _.warn('Render', 'template should be String')
    return new Tpl(tpl)
}

export default rtpl
