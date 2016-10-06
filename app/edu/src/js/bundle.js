let msg = document.querySelector('.j-msg')

var storage = {
    init() {
        let notShowMsg = JSON.parse(localStorage.getItem('notShowMsg'))
        if (!notShowMsg) msg.style.display = 'block'
        this.bind()
    },
    bind() {
        msg.querySelector('.close').addEventListener('click', () => {
            localStorage.setItem('notShowMsg', true)
            msg.style.display = 'none'
        })
    }
}

let timer;
let fadeinTimer;
let fadeoutTimer;
let index = 0;
let box = document.querySelector('.j-carousel');
let slides = box.querySelectorAll('a');
let pointers = box.querySelectorAll('.pointers li');
function fadein(el) {
	let o = 0,
	    setOpacity = function () {
		if (el.filters) {
			return function () {
				el.style.filter = 'alpha(opacity=' + 100 * o + ')'
			}
		} else {
			return function () {
				el.style.opacity = o
			}
		}
	}()
    clearInterval(fadeinTimer)
	fadeinTimer = setInterval(() => {
		setOpacity()
		o += 0.1
		o > 1 && clearInterval(fadeinTimer)
	}, 50)
}

function fadeout(el) {
	let o = 1,
	    setOpacity = function () {
		if (el.filters) {
			return function () {
				el.style.filter = 'alpha(opacity=' + 100 * o + ')'
			}
		} else {
			return function () {
				el.style.opacity = o
			}
		}
	}()
    clearInterval(fadeoutTimer)
	fadeoutTimer = setInterval(() => {
		setOpacity()
		o -= 0.1
		o < 0 && clearInterval(fadeoutTimer)
	}, 50)
}

function start() {
    clearInterval(timer)
    timer = setInterval(() => {
        pointers[index].removeAttribute('class')
        fadeout(slides[index])
        ++index < 3 || (index = 0)
        fadein(slides[index])
        pointers[index].setAttribute('class', 'z-sel')
    }, 5000)
}

function bind() {
    for (let i = 0, len = slides.length; i < len; i ++) {
        pointers[i].addEventListener('click', () => {
            clearInterval(timer)
            fadeout(slides[index])
            pointers[index].removeAttribute('class')
            fadein(slides[i])
            pointers[i].setAttribute('class', 'z-sel')
            index = i
            start()
        })
    }

    box.addEventListener('mouseenter', () => {
        clearInterval(timer)
    })

    box.addEventListener('mouseleave', () => {
        start()
    })
}

var carousel = {
    init() {
        start()
        bind()
        fadein(slides[index])
    }
}

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
    },
    isType(type, obj) {
    	return type === 'dom' ? obj instanceof HTMLElement : type === Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    },
    addClass,
    removeClass
}

/**
* @Author: zhangxinliang
* @Date:   2016-09-06 15:28:10
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:20
*/

class Promise {
    constructor(fn) {
        let state = 'PENDING',//状态 只存在PENDING、FULFILLED及REJECTED三种状态
            value = null,
            deferreds = []//异步队列

        //Promise.then方法，返回一个Promise实例
        this.then = function (onFulfilled = null, onRejected = null) {
            return new Promise((resolve, reject) => {
                handle({
                    onFulfilled,
                    onRejected,
                    resolve,
                    reject
                })
            })
        }

        //handle函数-确保onFulfilled与onRejected只会触发其中一个
        function handle(deferred) {
            if (state === 'PENDING') {
                deferreds.push(deferred)
                return
            }

            let cb = state === 'FULFILLED' ? deferred.onFulfilled : deferred.onRejected,
                ret

            if (!cb) {
                cd = state === 'FULFILLED' ? deferred.resolve : deferred.reject
                cd(value)
                return
            }

            try {
                ret = cb(value)
                deferred.resolve(ret)
            } catch (e) {
                deferred.reject(e)
            }
        }

        //resolve函数-状态PENDING转变为FULFILLED
        function resolve(newValue) {
            if (newValue && (_.isType('object', newValue) || _.isType('function', newValue))) {
                let then = newValue.then
                if (_.isType('function', then)) {
                    then.call(newValue, resolve, reject)
                    return
                }
            }
            state = 'FULFILLED'
            value = newValue
            finale()
        }

        //reject函数-状态PENDING转变为REJECTED
        function reject(reason) {
            state = 'REJECTED'
            value = reason
            finale()
        }

        //finale函数-确保总是保持异步
        function finale() {
            setTimeout(() => {
                deferreds.forEach((deferred) => {
                    handle(deferred)
                })
            }, 0)
        }

        fn(resolve, reject)
    }
}

/**
* @Author: zhangxinliang
* @Date:   2016-08-30 16:48:45
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:34
*/

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

/**
* @Author: zhangxinliang
* @Date:   2016-08-30 15:18:34
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:01
*/

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

/**
* @Author: zhangxinliang
* @Date:   2016-09-02 09:28:41
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:09
*/

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
            prev: '<a class="btns" href="javascript: void(0)" data-page="prev">&lt;</a>',
            next: '<a class="btns" href="javascript: void(0)" data-page="next">&gt;</a>',
            omit: '<span class="omit" data-page="omit">...</span>'
        }
        this.init()
        this.bind()
    }

    //获取当前页模版
    getCurrTpl () {
        return '<span class="curr" data-page="curr">' + this.page + '</span>'
    }

    //初始化分页
    init() {
        let tpl = this.tpl.prev + this.getCurrTpl()
        if (this.total > this.max) {
            let len = this.max - 3
            for (let i = 0; i < len; i ++) {
                tpl += '<a class="links" href="javascript: void(0)" data-page="' + (i + 2) + '">' + (i + 2) + '</a>'
            }
            tpl += this.tpl.omit + '<a class="links" href="javascript: void(0)" data-page="' + this.total + '">' + this.total + '</a>' + this.tpl.next
        } else {
            for (let i = 0, len = this.total; i < len - 1; i ++) {
                tpl += '<a class="links" href="javascript: void(0)" data-page="' + (i + 2) + '">' + (i + 2) + '</a>'
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
                tplArr.unshift('<a class="links" href="javascript: void(0)" data-page="' + thisPage + '">' + thisPage + '</a>')
                sortArr.unshift(thisPage)
            }
            if (step < MAX_STEP && ++stepRight <= MAX_STEP_RIGHT) {
                let thisPage = page + stepRight
                step++
                tplArr.push('<a class="links" href="javascript: void(0)" data-page="' + thisPage + '">' + thisPage + '</a>')
                sortArr.push(thisPage)
            }
        }

        if (sortArr[1] !== 2 && sortArr[1] !== 'curr') {
            tplArr[0] = '<a class="links" href="javascript: void(0)" data-page="1">1</a>'
            tplArr[1] = this.tpl.omit
        }
        if (sortArr[max - 1] !== total && sortArr[max - 1] !== 'curr') {
            tplArr[max - 2] = this.tpl.omit
            tplArr[max - 1] = '<a class="links" href="javascript: void(0)" data-page="' + total + '">' + total + '</a>'
        }

        this.el.innerHTML = this.tpl.prev + tplArr.join('') + this.tpl.next
        this.jump(page)
    }
}

/**
* @Author: zhangxinliang
* @Date:   2016-09-09 13:44:26
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:24:20
*/

let renderList = document.querySelector('.j-class-lst');
let pageBox = document.querySelector('.m-page');
let classTab = document.querySelector('.j-class-tab');
let curr = 1;
let screenCache = isLargeScreen();
let psize =  screenCache ? 20 : 15;
let classType = 10;
//判断是否为大瓶
function isLargeScreen() {
     return document.body.offsetWidth > 1205
}


function _render(pageNo) {
    return new Promise((resolve, reject) => {
        http({
            url: 'http://study.163.com/webDev/couresByCategory.htm',
            data: {
                pageNo,
                psize,
                type: classType
            },
            type: 'GET',
            dataType: 'json'
        }).then((data) => {
            renderList.innerHTML = rtpl([
                '{{# for (var i = 0, len = data.list.length; i < len; i++) {}}',
                    '{{# var item = data.list[i]}}',
                    '<li>',
                        '<img src="{{item.bigPhotoUrl}}" alt="">',
                        '<div class="info">',
                            '<p class="tt">{{item.name}}</p>',
                            '<p class="author">{{item.provider}}</p>',
                            '<span class="u-learnning">',
                                '<i class="icon"></i>',
                                '<span>{{item.learnerCount}}</span>',
                            '</span>',
                            '{{# if (item.price) {}}',
                                '<em class="price">￥{{item.price}}</em>',
                            '{{# } else {}}',
                                '<em class="price">免费</em>',
                            '{{# }}}',
                        '</div>',
                        '<div class="hover-box">',
                            '<div class="top">',
                                '<img class="hover-img" src="{{item.bigPhotoUrl}}" alt="">',
                                '<div class="info-box">',
                                    '<h6>{{item.name}}</h6>',
                                    '<div class="u-learnning">',
                                        '<i class="icon"></i>',
                                        '<span>{{item.learnerCount}}人在学</span>',
                                    '</div>',
                                    '<p class="author">发布者：{{item.provider}}</p>',
                                    '<p class="type">适合人群：{{item.targetUser}}</p>',
                                '</div>',
                            '</div>',
                            '<div class="bottom">',
                                '<p class="desc">{{item.description}}</p>',
                            '</div>',
                        '</div>',
                    '</li>',
                '{{# }}}'
            ].join('')).render(data)
            resolve(data.totalPage)
        }, (err) => {
            console.log(err)
        })
    })
}

function bind$1() {
    let tabs = classTab.querySelectorAll('li')

    window.onresize = function () {
        let cache = isLargeScreen()
        if (cache === !screenCache) {
            screenCache = cache
            psize =  screenCache ? 20 : 15
            _render(curr)
        }
    }

    classTab.addEventListener('click', (event) => {
        let e = event || window.event
        for (let i = 0, len = tabs.length; i < len; i++) {
            tabs[i].removeAttribute('class')
        }
        e.target.setAttribute('class', 'z-sel')
        classType = parseInt(e.target.getAttribute('data-type'))
        init()
    })
}

function init() {
    _render(1).then((total) => {
        new Page({
            el: pageBox,
            total,
            max: 8,
            jump(page) {
                curr = page
                _render(page)
            }
        })
    })
}

var course = {
    init() {
        init()
        bind$1()
    }
}

let topBox = document.querySelector('.j-hot-top')

function renderTopBox() {
    http({
        url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
        type: 'GET',
        dataType: 'json'
    }).then((data) => {
        topBox.innerHTML = rtpl([
            '{{# for (var i = 0, len = data.length; i < len; i++) {}}',
                '<li>',
                    '<img src="{{data[i].smallPhotoUrl}}" alt="">',
                    '<div class="box">',
                        '<p class="tt">{{data[i].name}}</p>',
                        '<div class="u-learnning">',
                            '<i class="icon"></i>',
                            '<span>{{data[i].learnerCount}}</span>',
                        '</div>',
                    '</div>',
                '</li>',
            '{{# }}}'
        ].join('')).render(data)
        animate()
    }, (err) => {
        console.log(err)
    })
}

function animate() {
    setInterval(() => {
        topBox.scrollTop < 700 ? scroll() : scrollInit()
    }, 5000)
}

function scroll() {
    let maxScrolltop = topBox.scrollTop + 70,
        timer = setInterval(() => {
            topBox.scrollTop += 2
            if (topBox.scrollTop >= maxScrolltop) clearInterval(timer)
        }, 20)
}

function scrollInit() {
    let timer = setInterval(() => {
        topBox.scrollTop -= 30
        if (topBox.scrollTop <= 0) clearInterval(timer)
    }, 20)
}

var hot = {
    init() {
        renderTopBox()
    }
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

var md5 = {
    hex_md5
}

let attentionBox = document.querySelector('.j-attention');
let attentionBtn = attentionBox.querySelector('.at-btn');
let hasAttentionBox = attentionBox.querySelector('.has-at');
let cancelAttentionBtn = hasAttentionBox.querySelector('a');
function bind$2() {
    attentionBtn.addEventListener('click', () => {
        let isLoginSuc = JSON.parse(localStorage.getItem('loginSuc'))
        isLoginSuc ? attention() : login()
    })
    cancelAttentionBtn.addEventListener('click', () => {
        localStorage.removeItem('followSuc')
        _.addClass(hasAttentionBox, 'z-hide')
        _.removeClass(attentionBtn, 'z-hide')
    })
}

function attention() {
    http({
        url: 'http://study.163.com/webDev/attention.htm',
        type: 'GET',
        dataType: 'json'
    }).then((data) => {
        if (data) {
            localStorage.setItem('followSuc', true)
            _.addClass(attentionBtn, 'z-hide')
            _.removeClass(hasAttentionBox, 'z-hide')
        }
    })
}

function login() {
    let hasLogin = document.querySelector('.m-login')
    if (hasLogin) return hasLogin.style.display = 'block'
    let loginEl = document.createElement('div')
    _.addClass(loginEl, 'm-login')
    loginEl.innerHTML = [
        '<div class="box">',
            '<i class="close"></i>',
            '<h5>登录网易云课堂</h5>',
            '<input type="text" placeholder="帐号">',
            '<input type="password" placeholder="密码">',
            '<button class="j-login-btn">登&nbsp;录</button>',
        '</div>'
    ].join('')
    document.body.appendChild(loginEl)

    loginEl.querySelector('.close').addEventListener('click', () => {
        loginEl.style.display = 'none'
    })
    loginEl.querySelector('.j-login-btn').addEventListener('click', () => {
        let inputs = loginEl.querySelectorAll('input')
        http({
            url: 'http://study.163.com/webDev/login.htm',
            data: {
                userName: md5.hex_md5(inputs[0].value),
                password: md5.hex_md5(inputs[1].value)
            },
            type: 'GET',
            dataType: 'json'
        }).then((data) => {
            if (!data) return alert('用户名或密码错误，请重新登录')
            loginEl.style.display = 'none'
            localStorage.setItem('loginSuc', true)
            attention()
        })
    })
}

var login$1 = {
    init() {
        bind$2()
        if (JSON.parse(localStorage.getItem('loginSuc')) && JSON.parse(localStorage.getItem('followSuc'))) {
            _.addClass(attentionBtn, 'z-hide')
            _.removeClass(hasAttentionBox, 'z-hide')
        }
    }
}

let videoBtn = document.querySelector('.u-video')

function bind$3() {
    videoBtn.addEventListener('click', () => {
        let hasVideo = document.querySelector('.m-video')
        if (hasVideo) return hasVideo.style.display = 'block'
        let videoEL = document.createElement('div')
        _.addClass(videoEL, 'm-video')
        videoEL.innerHTML = [
                '<div class="box">',
        			'<i class="close"></i>',
        			'<h5>登录网易云课堂</h5>',
        			'<video controls="" poster="img/video_cover_sm.jpg" src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4">您的浏览器不支持html5播放器，请升级</video>',
        		'</div>'
        ].join('')
        document.body.appendChild(videoEL)

        videoEL.querySelector('.close').addEventListener('click', () => {
            videoEL.style.display = 'none'
        })
    })
}

var video = {
    init() {
        bind$3()
    }
}

/**
* @Author: zhangxinliang
* @Date:   2016-08-30 14:09:49
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:16:30
*/

storage.init()
carousel.init()
course.init()
hot.init()
login$1.init()
video.init()