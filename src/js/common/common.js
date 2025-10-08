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

        let element = typeof elem == 'string' ? document.querySelector(elem) : elem
        let headerOffset = 20;
        let elementPosition = element.offsetTop
        let offsetPosition = elementPosition - headerOffset;

        var offset = element.getBoundingClientRect();

        window.scrollTo({
            top: offsetPosition,
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
        new MaskInput("[data-maska]")
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

    /* ================================================
    data toggle is-open
    ================================================*/

    if (document.querySelector('[data-isopen="card-vacancy"]')) {
        const items = document.querySelectorAll('[data-isopen="card-vacancy"]')

        items.forEach(item => {

            const buttonText = item.innerText

            if (item.dataset.isopen) {
                item.addEventListener('click', e => {
                    let el = e.target.closest('.' + item.dataset.isopen)
                    el.classList.toggle('is-open')
                    el.querySelector('span').innerText = el.classList.contains('is-open') ? 'Свернуть' : buttonText
                })
            }
        })

    }


    /* ================================================
    data filter price
    ================================================*/

    if (document.querySelector('.pricelist__group')) {
        const items = document.querySelectorAll('[data-filter]')

        items.forEach((item, index) => {


        })

        class filterPrice {
            constructor(params) {
                this.$el = document.querySelectorAll('[data-filter]')
                this.$link = document.querySelector('[data-list="filter"]')
                this.active = [];

                this.renderGroups()
            }

            renderButton() {

                let list = document.createElement('ul')

                this.$el.forEach((item, index) => {
                    const li = document.createElement('li')
                    li.innerHTML = `<li><a href="#price_${index}" >${item.dataset.filter}</a></li>`
                    li.addEventListener('click', e => {

                        e.preventDefault()

                        this.changeActive(item.dataset.filter)
                        window.scrollToTargetAdjusted(item)
                    })
                    this.active.includes(item.dataset.filter) ? li.classList.add('is-active') : ''
                    list.append(li)

                    item.setAttribute('id', 'price_' + index)
                })

                this.$link.innerHTML = ''
                this.$link.append(list)
            }

            changeActive(id) {

                if (this.active.includes(id)) {
                    this.active.splice(this.active.indexOf(id), 1)
                    this.renderGroups()

                    return false
                }

                this.active.push(id)
                this.active = Array.from(new Set(this.active))
                this.renderGroups()
            }

            renderGroups() {

                this.$el.forEach((item, index) => {

                    if (!this.active.length) {
                        if (index < 5) {
                            !item.classList.contains('is-hide') || item.classList.remove('is-hide')
                        } else {
                            item.classList.add('is-hide')
                        }
                        return false
                    }

                    this.active.includes(item.dataset.filter) ? !item.classList.contains('is-hide') || item.classList.remove('is-hide') : item.classList.add('is-hide')
                })

                this.renderButton()
            }
        }

        new filterPrice()

    }


}); //domContentLoaded

if (document.querySelector('.top-products')) {
    document.addEventListener('DOMContentLoaded', function () {
        let btn = document.querySelector('.top-products__content-btn div');
        let expandedContent = document.querySelector('.top-products__expanded-text');
        let arrowSpan = btn.querySelector('span');

        btn.addEventListener('click', function () {
            if (!expandedContent.classList.contains('get-more-text')) {
                expandedContent.classList.add('get-more-text')
                arrowSpan.style.transform = 'rotate(180deg)';
            } else {
                expandedContent.classList.remove('get-more-text')
                arrowSpan.style.transform = 'rotate(0deg)';
            }
        });
    });
}

if (document.querySelector('.top-products__video-wrapper')) {
    document.addEventListener("DOMContentLoaded", function () {
        let lightbox = new FsLightbox();
        let watchButton = document.querySelector('.btn-watch');
        let videoSource = document.querySelector('.top-products__video-control source').getAttribute('src');

        watchButton.addEventListener('click', function () {
            lightbox.props.sources = [videoSource];
            lightbox.open();
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        let video = document.querySelector('.top-products__video-control');
        let playButton = document.querySelector('.top-products__video-play');

        playButton.addEventListener('click', function () {
            if (video.paused) {
                video.play();
                hidePlayButton();
            }
        });

        video.addEventListener('click', function () {
            video.setAttribute('controls', '')
            video.setAttribute('autoplay', '')
            video.play();
            hidePlayButton();
        });

        function hidePlayButton() {
            playButton.style.opacity = 0;
            setTimeout(function () {
                playButton.style.display = 'none';
            }, 500);
        }
    });
}


if (document.querySelector('[data-slider="certificates"]')) {
    let sliderQuality = new Splide('[data-slider="certificates"]', {
        type: 'loop',
        arrows: false,
        pagination: true,
        fixedWidth: '296px',
        gap: 16,
        start: 0,
        mediaQuery: 'min',
        breakpoints: {
            991.98: {
                fixedWidth: '310px',
                gap: 24,
            }
        }

    });

    sliderQuality.mount();

}


if (document.querySelector('.basaltum-catalog')) {
    document.addEventListener('DOMContentLoaded', function () {
        let characteristicBtns = document.querySelectorAll('.get-characteristic');

        characteristicBtns.forEach(function (button) {
            button.addEventListener('click', function () {
                let content = this.closest('.basaltum-catalog__content').querySelector('.basaltum-catalog__characteristic');
                let svgIcon = this.querySelector('svg');
                let spanButton = this.querySelector('span');

                if (content.classList.contains('visible-characteristic')) {
                    content.classList.remove('visible-characteristic');
                    svgIcon.classList.remove('rotate-180');
                    svgIcon.classList.remove('brightness-grayscale');
                    button.classList.remove('dark-background');
                    spanButton.classList.remove('light-text');
                } else {
                    content.classList.add('visible-characteristic');
                    svgIcon.classList.add('rotate-180');
                    svgIcon.classList.add('brightness-grayscale');
                    button.classList.add('dark-background');
                    spanButton.classList.add('light-text');
                }
            });
        });
    });
}


if (document.querySelector('.pricelist__main')) {
    const btnShowMore = document.querySelector('.show-more');
    btnShowMore.addEventListener('click', ()=>{
        document.querySelectorAll('.pricelist__group').forEach(item=>{
            if(item.classList.contains('is-hide')){
                item.classList.remove('is-hide')
                btnShowMore.remove()
            }
        })
    })
}