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
    }
}

function _warn(msg) {
    return _.warn('Page', msg)
}

class Page {
    constructor(options) {
        if (!(options.el && _.isType('dom', options.el))) return _warn( 'arguments.el should be a DOM Element')
        if (!(options.total && _.isType('number', options.total))) return _warn('arguments.total should be a Number')
        if (!(options.do && _.isType('function', options.do))) return _warn('arguments.do should be a Function')

        this.el = options.el
        this.total = options.total
        this.max = 8
        this.do = options.do

        this.page = 1
        this.tpl = {
            prev: '<a class="m-page-btns" href="javascript: void(0)" data-page="prev">&lt;</a>',
            next: '<a class="m-page-btns" href="javascript: void(0)" data-page="next">&gt;</a>',
            omit: '<span class="m-page-omit" data-page="omit">...</span>'
        }
        this.init()
        this.bind()
    }

    getCurrTpl () {
        return '<span class="m-page-curr" data-page="curr">' + this.page + '</span>'
    }

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
    }
}

new Page({
    el: document.querySelector('.m-page'),
    total: 10,
    max: 8,
    do(page) {
        console.log(page)
    }
})

// http({
//     url: 'http://study.163.com/webDev/couresByCategory.htm',
//     data: {
//         pageNo: 1,
//         psize: 6,
//         type: 20
//     },
//     type: 'GET',
//     dataType: 'json'
// }).then((data) => {
//     console.dir(data)
//     document.querySelector('.g-main').innerHTML = rtpl([
//         '{{# data.list.forEach(function (item){ }}',
//             '<div>',
//                 '<span>{{item.name}}</span>',
//                 '<img src="{{item.bigPhotoUrl}}">',
//                 '<p>{{item.description}}</p>',
//             '</div>',
//         '{{# }) }}'
//     ].join('')).render(data)
// }, (err) => {
//     console.dir(err)
// })