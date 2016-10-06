import _ from '../module/util'
import http from '../module/http'
import md5 from '../module/md5'

let attentionBox = document.querySelector('.j-attention'),
    attentionBtn = attentionBox.querySelector('.at-btn'),
    hasAttentionBox = attentionBox.querySelector('.has-at'),
    cancelAttentionBtn = hasAttentionBox.querySelector('a')

function bind() {
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

export default {
    init() {
        bind()
        if (JSON.parse(localStorage.getItem('loginSuc')) && JSON.parse(localStorage.getItem('followSuc'))) {
            _.addClass(attentionBtn, 'z-hide')
            _.removeClass(hasAttentionBox, 'z-hide')
        }
    }
}
