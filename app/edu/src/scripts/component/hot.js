import rtpl from '../module/render'
import http from '../module/http'

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

export default {
    init() {
        renderTopBox()
    }
}
