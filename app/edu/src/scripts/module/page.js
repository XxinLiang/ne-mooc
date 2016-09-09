/**
* @Author: zhangxinliang
* @Date:   2016-09-02 09:28:41
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:09
*/

import _ from './util'

/**
 * _warn _.warn私有化
 * @param  {String} msg 警告信息
 * @return {String}     警告信息
 */
function _warn(msg) {
    return _.warn('Page', msg)
}

class Page {
    constructor(options) {
        if (!(options.el && _.isType('dom', options.el))) return _warn( 'arguments.el should be a DOM Element')
        if (!(options.total && _.isType('number', options.total))) return _warn('arguments.total should be a Number')
        if (!(options.jump && _.isType('function', options.jump))) return _warn('arguments.jump should be a Function')

        this.el = options.el
        this.total = options.total
        this.max = 8
        this.jump = options.jump

        this.page = 1
        this.tpl = {
            prev: '<a class="m-page-btns" href="javascript: void(0)" data-page="prev">&lt;</a>',
            next: '<a class="m-page-btns" href="javascript: void(0)" data-page="next">&gt;</a>',
            omit: '<span class="m-page-omit" data-page="omit">...</span>'
        }
        this.init()
        this.bind()
    }

    //获取当前页模版
    getCurrTpl () {
        return '<span class="m-page-curr" data-page="curr">' + this.page + '</span>'
    }

    //初始化分页
    init() {
        let tpl = this.tpl.prev + this.getCurrTpl()
        if (this.total > this.max) {
            let len = this.max - (this.total - this.max) - 1
            for (let i = 0; i < len; i ++) {
                tpl += '<a class="m-page-links" href="javascript: void(0)" data-page="' + (i + 2) + '">' + (i + 2) + '</a>'
            }
            tpl += this.tpl.omit + '<a class="m-page-links" href="javascript: void(0)" data-page="' + this.total + '">' + this.total + '</a>' + this.tpl.next
        } else {
            for (let i = 0, len = this.total; i < len - 1; i ++) {
                tpl += '<a class="m-page-links" href="javascript: void(0)" data-page="' + (i + 2) + '">' + (i + 2) + '</a>'
            }
            tpl += this.tpl.next
        }
        this.el.innerHTML = tpl
    }

    //事件委托
    bind() {
        this.el.addEventListener('click', (event) => {
            let e = event || window.event,
                type = e.target.getAttribute('data-page')
            switch (type) {
                case 'omit':
                case 'curr':
                    break
                case 'prev':
                    this.page !== 1 && this.pageHandel(this.page - 1)
                    break
                case 'next':
                    this.page !== this.total && this.pageHandel(this.page + 1)
                    break
                default:
                    type && this.pageHandel(parseInt(type))
            }
        })
    }

    //核心-分页处理函数
    pageHandel (page) {
        this.page = page
        let max = this.max,
            total = this.total,
            step = 0,
            stepLeft = 0,
            stepRight = 0,
            tplArr = [],
            sortArr = []
        const MAX_STEP = max - 1,//减去选中页
            MAX_STEP_LEFT = page - 1,
            MAX_STEP_RIGHT = total - page

        tplArr.push(this.getCurrTpl())
        sortArr.push('curr')

        while (step < MAX_STEP) {
            if (step < MAX_STEP && ++stepLeft <= MAX_STEP_LEFT) {
                let thisPage = page - stepLeft
                step++
                tplArr.unshift('<a class="m-page-links" href="javascript: void(0)" data-page="' + thisPage + '">' + thisPage + '</a>')
                sortArr.unshift(thisPage)
            }
            if (step < MAX_STEP && ++stepRight <= MAX_STEP_RIGHT) {
                let thisPage = page + stepRight
                step++
                tplArr.push('<a class="m-page-links" href="javascript: void(0)" data-page="' + thisPage + '">' + thisPage + '</a>')
                sortArr.push(thisPage)
            }
        }

        if (sortArr[1] !== 2 && sortArr[1] !== 'curr') {
            tplArr[0] = '<a class="m-page-links" href="javascript: void(0)" data-page="1">1</a>'
            tplArr[1] = this.tpl.omit
        }
        if (sortArr[max - 1] !== total && sortArr[max - 1] !== 'curr') {
            tplArr[max - 2] = this.tpl.omit
            tplArr[max - 1] = '<a class="m-page-links" href="javascript: void(0)" data-page="' + total + '">' + total + '</a>'
        }

        this.el.innerHTML = this.tpl.prev + tplArr.join('') + this.tpl.next
        this.jump(page)
    }
}

export default Page
