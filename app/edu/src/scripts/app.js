/*
* @Author: zhangxinliang
* @Date:   2016-08-30 14:09:49
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-08-30 18:41:40
*/

'use strict'

import rtpl from './render'
import http from './http'

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