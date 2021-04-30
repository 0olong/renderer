const log = console.log.bind(console)

const _ce = document.createElement.bind(document)

const _e = (sel) => document.querySelector(sel)

const _es = (sel) => document.querySelectorAll(sel)

const interpolate = (a, b, factor) => a + (b - a) * factor

const random01 = () => Math.round(Math.random()*255)

const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)

const bindAll = (sel, eventName, callback) => {
    let l = _es(sel)
    for (let i = 0; i < l.length; i++) {
        let input = l[i]
        input.addEventListener(eventName, (event) => {
            callback(event)
        })
    }
}
