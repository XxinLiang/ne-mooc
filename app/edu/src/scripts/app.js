/**
* @Author: zhangxinliang
* @Date:   2016-08-30 14:09:49
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-06 17:05:24
*/

'use strict'

import Promise from './promise'
import rtpl from './render'
import http from './http'
import PageSwitch from './page'

new PageSwitch({
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
