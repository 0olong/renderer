class Slider extends MyObject {
    /**
     *
     * @param {string} selector
     * @param {object} options 选项
     * @param {number} options.min 最小值
     * @param {number} options.max 最大值
     * @param {number=} options.value 初始值，默认为 min 的值
     * @param {number=} options.width 宽度，默认 300
     * @param {string} options.title 标题
     * @param {boolean=} options.persist 是否要持续触发事件监听
     */
    constructor(selector, options) {
        super()
        let {min, max, value = min} = options
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }

        this.handlers = {}
        this.options = {
            width: 100,
            step: 0.1,
            ...options,
            value,
        }
        this.attach(selector)
    }

    attach(selector = 'body') {
        let ctn = _e(selector)
        let {title} = this.options

        let wrapper = _ce('div')
        wrapper.className = 'slider'
        let template = `
            <div class="text">
                <div class="value"></div>
                <div class="title">${title}</div>
            </div>
            <div class="main">
                <div class="outer">
                    <div class="inner">
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        `
        appendHtml(wrapper, template)

        this.bindEvents(wrapper)
        ctn.appendChild(wrapper)
    }

    bindEvents(el) {
        let e = el.querySelector.bind(el)
        let inner = e('.inner')
        let dot = e('.dot')
        let {min, max, value, width, persist, step} = this.options

        el.style.width = `${width}px`
        let maxOffset = width

        let moving = false

        let total = max - min
        let offset = 0
        let result = e('.value')
        let unit = width / total

        const updateValue = (value, publish) => {
            let percentage = value / total
            inner.style.width = String(percentage * 100) + '%'

            let actualValue = (value + min).toFixed(1)
            result.innerHTML = actualValue

            if (publish) {
                this.trigger(Slider.events.CHANGE, actualValue)
            }
        }

        updateValue(value - min)

        const updateByOffset = (x, publish) => {
            if (x > maxOffset) {
                x = maxOffset
            }
            if (x < 0) {
                x = 0
            }

            x = parseFloat((x / unit).toFixed(1))
            updateValue(x, publish)
        }

        dot.addEventListener('mousedown', (event) => {
            offset = event.clientX - dot.offsetLeft - dot.offsetWidth / 2
            moving = true
        })

        document.addEventListener('mouseup', (event) => {
            if (!persist && moving) {
                updateByOffset(event.clientX - offset, true)
            }
            moving = false
        })

        document.addEventListener('mousemove', (event) => {
            if (moving) {
                updateByOffset(event.clientX - offset, persist)
            }
        })
    }

    trigger(eventName, ...args) {
        let hs = this.handlers[eventName]
        if (hs) {
            for (let handler of hs) {
                handler(...args)
            }
        }
    }

    on(eventName, fn) {
        let hs = this.handlers
        hs[eventName] = hs[eventName] || []
        hs[eventName].push(fn)
        return this
    }
}

Slider.events = {
    CHANGE: 'change',
}
