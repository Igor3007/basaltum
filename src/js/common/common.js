document.addEventListener("DOMContentLoaded", function (event) {

    const API_YMAPS = 'https://api-maps.yandex.ru/2.1/?apikey=0e2d85e0-7f40-4425-aab6-ff6d922bb371&suggest_apikey=ad5015b5-5f39-4ba3-9731-a83afcecb740&lang=ru_RU&mode=debug';


    /* =================================================
    load ymaps api
    =================================================*/

    window.loadApiYmaps = function (callback) {

        if (window.ymaps == undefined) {
            const script = document.createElement('script')
            script.src = API_YMAPS
            script.onload = () => {
                callback(window.ymaps)
            }
            document.head.append(script)
        } else {
            callback(window.ymaps)
        }

    }

    /* =================================================
    preloader
    ================================================= */

    class Preloader {

        constructor() {
            this.$el = this.init()
            this.state = false
        }

        init() {
            const el = document.createElement('div')
            el.classList.add('loading')
            el.innerHTML = '<div class="indeterminate"></div>';
            document.body.append(el)
            return el;
        }

        load() {

            this.state = true;

            setTimeout(() => {
                if (this.state) this.$el.classList.add('load')
            }, 300)
        }

        stop() {

            this.state = false;

            setTimeout(() => {
                if (this.$el.classList.contains('load'))
                    this.$el.classList.remove('load')
            }, 200)
        }

    }

    window.preloader = new Preloader();


    /* ==============================================
    Status
    ============================================== */

    function Status() {

        this.containerElem = '#status'
        this.headerElem = '#status_header'
        this.msgElem = '#status_msg'
        this.btnElem = '#status_btn'
        this.timeOut = 10000,
            this.autoHide = true

        this.init = function () {
            let elem = document.createElement('div')
            elem.setAttribute('id', 'status')
            elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
            document.body.append(elem)

            document.querySelector(this.btnElem).addEventListener('click', function () {
                this.parentNode.setAttribute('class', '')
            })
        }

        this.msg = function (_msg, _header) {
            _header = (_header ? _header : 'Отлично!')
            this.onShow('complete', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.err = function (_msg, _header) {
            _header = (_header ? _header : 'Ошибка')
            this.onShow('error', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.wrn = function (_msg, _header) {
            _header = (_header ? _header : 'Внимание')
            this.onShow('warning', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }

        this.onShow = function (_type, _header, _msg) {
            document.querySelector(this.headerElem).innerText = _header
            document.querySelector(this.msgElem).innerText = _msg
            document.querySelector(this.containerElem).classList.add(_type)
        }

        this.onHide = function () {
            setTimeout(() => {
                document.querySelector(this.containerElem).setAttribute('class', '')
            }, this.timeOut);
        }

    }

    window.STATUS = new Status();
    const STATUS = window.STATUS;
    STATUS.init();

    /* ==============================================
    ajax request
    ============================================== */

    window.ajax = function (params, response) {

        //params Object
        //dom element
        //collback function

        window.preloader.load()

        let xhr = new XMLHttpRequest();
        xhr.open((params.type ? params.type : 'POST'), params.url)

        if (params.responseType == 'json') {
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(params.data))
        } else {
            let formData = new FormData()
            for (key in params.data) {
                formData.append(key, params.data[key])
            }
            xhr.send(formData)
        }

        xhr.onload = function () {

            response ? response(xhr.status, xhr.response) : ''
            window.preloader.stop()
            setTimeout(function () {
                if (params.btn) {
                    params.btn.classList.remove('btn-loading')
                }
            }, 300)
        };

        xhr.onerror = function () {
            window.STATUS.err('Error: ajax request failed')
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                if (params.btn) {
                    params.btn.classList.add('btn-loading')
                }
            }
        };
    }


    /* =================================================
    scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (elem) {

        //elem string selector

        if (!document.querySelector(elem)) return false;

        let element = document.querySelector(elem);
        let headerOffset = 0;
        let elementPosition = element.offsetTop
        let offsetPosition = elementPosition - headerOffset;

        var offset = element.getBoundingClientRect();

        window.scrollTo({
            top: offset.top,
            behavior: "smooth"
        });
    }

    /* ==================================================
    maska
    ==================================================*/
    const {
        MaskInput,
    } = Maska

    function initMaska() {
        //new MaskInput("[data-maska]")
    }

    initMaska();

    /* ====================================================
     map footer
     ====================================================*/

    function initMapFooter() {
        window.loadApiYmaps((ymaps) => {

            //map footer
            if (document.querySelector('#map-container')) {

                const placemark = document.querySelector('#map-container').dataset.coordinates.split(',')
                const center = document.querySelector('#map-container').dataset.center.split(',')
                ymaps.ready(function () {
                    const myMap = new ymaps.Map('map-container', {
                        center: window.innerWidth > 992 ? center : placemark,
                        zoom: 14,
                        controls: ['zoomControl'],

                    }, {
                        searchControlProvider: 'yandex#search',
                        suppressMapOpenBlock: true,
                        zoomControlPosition: {
                            right: 32,
                            top: 32
                        },

                    });
                    const myPlacemark = new ymaps.Placemark(placemark, {
                        hintContent: 'Базальтум',
                    }, {
                        iconLayout: 'default#image',
                        iconImageHref: '/img/svg/ic_pin.svg',
                        iconImageSize: [60, 68],
                        iconImageOffset: [-30, -68]
                    });
                    myMap.geoObjects.add(myPlacemark)
                    myMap.behaviors.disable('scrollZoom');

                })
            }


        })

        window.removeEventListener('scroll', initMapFooter)
    }

    window.addEventListener('scroll', initMapFooter)

    /* ================================
    mobile-menu
    ================================*/

    if (document.querySelector('.header-mobile__button')) {
        document.querySelector('.header-mobile__button').addEventListener('click', e => {
            document.body.classList.toggle('open-mobile-menu')
            document.querySelector('.btn-burger').classList.toggle('open')
            document.querySelector('[data-menu="container"]').classList.toggle('open')
        })
    }

    /* ================================
    slider
    ================================*/



    if (document.querySelector('[data-slider="product"]')) {
        var splide = new Splide('[data-slider="product"]', {

            arrows: false,
            pagination: true,
            gap: 30,
            autoWidth: true,
            start: 0,
            perPage: 4,

            breakpoints: {
                760: {
                    perPage: 1,
                    gap: 15,
                },
            },

        });



        const prevButton = document.querySelector('[data-slider-prev="product"]')
        const nextButton = document.querySelector('[data-slider-next="product"]')

        prevButton.addEventListener('click', e => {
            splide.go('<')
        })

        nextButton.addEventListener('click', e => {
            splide.go('>')
        })

        splide.on('move', (newIndex, prevIndex, destIndex) => {

            nextButton.removeAttribute('disabled')
            prevButton.removeAttribute('disabled')

            if (destIndex == 0) {
                prevButton.setAttribute('disabled', 'disabled')
            }

            if (splide.length == (destIndex + splide.options.perPage)) {
                nextButton.setAttribute('disabled', 'disabled')
            }


        })

        splide.on('mounted', (e) => {

            if (splide.length == (splide.options.perPage)) {
                nextButton.setAttribute('aria-hidden', '')
                prevButton.setAttribute('aria-hidden', '')
            }
        })

        splide.mount();
    }

    /* =================================================
     popups
     =================================================*/

    function popupSuccess() {
        window.ajax({
            type: 'GET',
            url: '/parts/_popup-thanks.html'
        }, (status, response) => {

            const instansePopup = new afLightbox({
                mobileInBottom: true
            })

            instansePopup.open(response, false)
        })
    }

    if (document.querySelector('[data-modal]')) {
        const items = document.querySelectorAll('[data-modal]')

        items.forEach(item => {
            item.addEventListener('click', e => {

                window.ajax({
                    type: 'GET',
                    url: item.dataset.modal
                }, (status, response) => {

                    const instansePopup = new afLightbox({
                        mobileInBottom: true
                    })

                    instansePopup.open(response, (instanse) => {
                        initMaska()

                        if (instanse.querySelector('form')) {
                            const form = instanse.querySelector('form')

                            form.addEventListener('submit', e => {

                                e.preventDefault()

                                const formData = new FormData(e.target)

                                window.ajax({
                                    type: 'GET',
                                    url: item.dataset.modal
                                }, (status, response) => {

                                    if (status == 200) {
                                        popupSuccess();
                                        instansePopup.close()
                                    }


                                })
                            })
                        }
                    })
                })

            })
        })
    }


}); //domContentLoaded