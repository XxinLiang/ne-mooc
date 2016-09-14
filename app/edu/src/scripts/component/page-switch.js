/**
* @Author: zhangxinliang
* @Date:   2016-09-09 13:44:26
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:24:20
*/

import Promise from '../module/promise'
import rtpl from '../module/render'
import http from '../module/http'
import Page from '../module/page'

function _render(page) {
    http({
        url: 'http://study.163.com/webDev/couresByCategory.htm',
        data: {
            pageNo: page,
            psize: 6,
            type: 20
        },
        type: 'GET',
        dataType: 'json'
    }).then((data) => {
        console.dir(data)
        document.querySelector('.g-main').innerHTML = rtpl([
            '{{# data.list.forEach(function (item){ }}',
                '<div>',
                    '<span>{{item.name}}</span>',
                    '<img src="{{item.bigPhotoUrl}}">',
                    '<p>{{item.description}}</p>',
                '</div>',
            '{{# }) }}'
        ].join('')).render(data)
    }, (err) => {
        console.dir(err)
    })
}

export default {
    init() {
        // _render(1)
        new Page({
            el: document.querySelector('.m-page'),
            total: 10,
            max: 8,
            jump(page) {
                // _render(page)
            }
        })

    }
}
