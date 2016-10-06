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

let renderList = document.querySelector('.j-class-lst'),
    pageBox = document.querySelector('.m-page'),
    classTab = document.querySelector('.j-class-tab'),
    curr = 1,
    screenCache = isLargeScreen(),
    psize =  screenCache ? 20 : 15,
    classType = 10

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

function bind() {
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

export default {
    init() {
        init()
        bind()
    }
}
