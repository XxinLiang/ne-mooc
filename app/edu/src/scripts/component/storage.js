
let msg = document.querySelector('.j-msg')

export default {
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
