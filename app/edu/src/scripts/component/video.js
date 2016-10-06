import _ from '../module/util'

let videoBtn = document.querySelector('.u-video')

function bind() {
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

export default {
    init() {
        bind()
    }
}
