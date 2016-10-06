let timer,
    fadeinTimer,
    fadeoutTimer,
    index = 0,
    box = document.querySelector('.j-carousel'),
    slides = box.querySelectorAll('a'),
    pointers = box.querySelectorAll('.pointers li')

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

export default {
    init() {
        start()
        bind()
        fadein(slides[index])
    }
}
