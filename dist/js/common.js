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

    if (document.querySelector('.pricelist')) {
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


    /* =======================================
    splide banner
    =======================================*/

    document.querySelectorAll('[data-slider="banner"]').forEach(item => {

        item['splide'] = new Splide(item, {
            type: 'fade',
            autoplay: true,
            arrows: false,
            pagination: true,
            gap: 16,
            start: 0,
            mediaQuery: 'min',
            perPage: 1

        });

        item['splide'].mount();

        const prevButton = document.querySelector('[data-slider-prev="banner"]')
        const nextButton = document.querySelector('[data-slider-next="banner"]')

        prevButton.addEventListener('click', e => {
            item['splide'].go('<')
        })

        nextButton.addEventListener('click', e => {
            item['splide'].go('>')
        })

    })

    /* =======================================
    splide plist
    =======================================*/

    document.querySelectorAll('[data-slider="plist"]').forEach(item => {

        const textElems = item.closest('section').querySelectorAll('.products-line__list li')
        const containerElems = item.closest('section').querySelector('.products-line__list ul')

        const scrollToElem = (elem, container) => {
            var rect = elem.getBoundingClientRect();
            var rectContainer = container.getBoundingClientRect();

            let elemOffset = {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            }

            let containerOffset = {
                top: rectContainer.top + document.body.scrollTop,
                left: rectContainer.left + document.body.scrollLeft
            }

            let leftPX = elemOffset.left - containerOffset.left + container.scrollLeft - (container.offsetWidth / 2) + ((elem.offsetWidth + 0) / 2)

            container.scrollTo({
                left: leftPX,
                behavior: 'smooth'
            });
        }

        item['splide'] = new Splide(item, {
            type: 'loop',
            autoplay: true,
            arrows: false,
            pagination: true,
            gap: 16,
            start: 0,
            mediaQuery: 'min',
            perPage: 1,

            breakpoints: {
                576: {
                    pagination: false,
                },
            },

        });

        item['splide'].on('move', function (index) {
            textElems.forEach((item, i) => {
                item.classList.toggle('is-active', i == index)
            })

            scrollToElem(textElems[index], containerElems)
        });

        item['splide'].mount();

        textElems.forEach((li, i) => {
            li.addEventListener('click', e => item['splide'].go(i))
        })



    })

    /* =======================================
    form personal offer
    =======================================*/

    class FormValidator {
        constructor(formElement) {
            this.form = formElement;
            this.errorContainer = null;
            this.init();
        }

        init() {
            // Создаем контейнер для ошибок
            this.createErrorContainer();

            // Назначаем обработчик отправки формы
            this.form.addEventListener('submit', (e) => {
                if (!this.validateForm()) {
                    e.preventDefault();
                }
            });
        }

        createErrorContainer() {
            this.errorContainer = document.createElement('div');
            this.errorContainer.className = 'form-errors';
            this.form.appendChild(this.errorContainer);
        }

        validateForm() {
            const errors = [];

            // Очищаем предыдущие ошибки
            this.clearErrors();

            // 1. Проверка областей применения
            if (!this.validateApplicationAreas()) {
                errors.push('Выберите хотя бы одну область применения');
            }

            // 2. Проверка характеристик
            const characteristicsErrors = this.validateCharacteristics();
            errors.push(...characteristicsErrors);

            // 3. Проверка графика поставок
            if (!this.validateDeliverySchedule()) {
                errors.push('Выберите график поставок');
            }

            // 4. Проверка локации и сроков
            const locationErrors = this.validateLocation();
            errors.push(...locationErrors);

            // 5. Проверка контактных данных
            const contactErrors = this.validateContactData();
            errors.push(...contactErrors);

            // 6. Проверка согласия на обработку данных
            if (!this.validateConsent()) {
                errors.push('Необходимо согласие на обработку персональных данных');
            }

            // Если есть ошибки - показываем их
            if (errors.length > 0) {
                this.showErrors(errors);
                return false;
            }

            return true;
        }

        validateApplicationAreas() {
            const checkboxes = this.form.querySelectorAll('input[name="space"]');
            return Array.from(checkboxes).some(checkbox => checkbox.checked);
        }

        validateCharacteristics() {
            const errors = [];
            const thickness = this.form.querySelector('input[name="weight"]');
            const density = this.form.querySelector('input[name="plot"]');
            const systemClass = this.form.querySelector('input[name="sys_class"]');

            if (!thickness.value.trim()) {
                errors.push('Укажите толщину');
                this.highlightField(thickness);
            }

            if (!density.value.trim()) {
                errors.push('Укажите ориентир по плотности');
                this.highlightField(density);
            }

            if (!systemClass.value.trim()) {
                errors.push('Укажите класс системы');
                this.highlightField(systemClass);
            }

            return errors;
        }

        validateDeliverySchedule() {
            const radios = this.form.querySelectorAll('input[name="graph-delivery"][type="radio"]');
            return Array.from(radios).some(radio => radio.checked);
        }

        validateLocation() {
            const errors = [];
            const address = this.form.querySelector('input[name="address"]');
            const delivery = this.form.querySelector('input[name="delivery"]');

            if (!address.value.trim()) {
                errors.push('Укажите расположение объекта');
                this.highlightField(address);
            }

            if (!delivery.value.trim()) {
                errors.push('Укажите сроки доставки');
                this.highlightField(delivery);
            }

            return errors;
        }

        validateContactData() {
            const errors = [];
            const name = this.form.querySelector('input[name="user-name"]');
            const phone = this.form.querySelector('input[name="user-phone"]');

            if (!name.value.trim()) {
                errors.push('Укажите ФИО');
                this.highlightField(name);
            }

            if (!phone.value.trim()) {
                errors.push('Укажите номер телефона');
                this.highlightField(phone);
            } else if (!this.validatePhone(phone.value)) {
                errors.push('Укажите корректный номер телефона');
                this.highlightField(phone);
            }

            return errors;
        }

        validateConsent() {
            const consentCheckbox = this.form.querySelector('input[name="undefined"][type="checkbox"]');
            return consentCheckbox && consentCheckbox.checked;
        }

        validatePhone(phone) {
            // Простая валидация телефона - можно усложнить при необходимости
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            return phoneRegex.test(phone.trim());
        }

        highlightField(field) {
            field.classList.toggle('err', true)

            // Убираем подсветку при исправлении
            field.addEventListener('input', () => {
                field.classList.toggle('err', false)
            }, { once: true });
        }

        showErrors(errors) {
            this.errorContainer.innerHTML = '';

            const title = document.createElement('div');
            title.textContent = 'Для отправки формы необходимо исправить следующие ошибки:';
            title.style.cssText = 'font-weight: bold; margin-bottom: 10px;';
            this.errorContainer.appendChild(title);

            const list = document.createElement('ul');
            list.style.cssText = 'margin: 0; padding-left: 20px;';

            errors.forEach(error => {
                const item = document.createElement('li');
                item.textContent = '- ' + error;
                list.appendChild(item);
            });

            this.errorContainer.appendChild(list);
            this.errorContainer.style.display = 'block';

            // Прокрутка к ошибкам
            this.errorContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        clearErrors() {
            this.errorContainer.style.display = 'none';
            this.errorContainer.innerHTML = '';

            // Сбрасываем подсветку полей
            const highlightedFields = this.form.querySelectorAll('input[style*="border-color"]');
            highlightedFields.forEach(field => {
                field.classList.toggle('err', false)
            });
        }
    }

    const form = document.querySelector('.form-personal__form form');
    if (form) {
        new FormValidator(form);
    }

    /* ========================================
    scroll smooth
    ========================================*/

    document.querySelectorAll('[data-scroll]').forEach(item => {
        item.addEventListener('click', e => {
            window.scrollToTargetAdjusted(document.querySelector(item.dataset.scroll))
        })
    })


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
    btnShowMore.addEventListener('click', () => {
        document.querySelectorAll('.pricelist__group').forEach(item => {
            if (item.classList.contains('is-hide')) {
                item.classList.remove('is-hide')
                btnShowMore.remove()
            }
        })
    })
}


// ========== ДАННЫЕ ДЛЯ КАЛЬКУЛЯТОРА ==========
const calculatorConfig = {
    purposes: [
        { value: 'facade', label: 'Фасад', tabIndex: '0', hasAdditional: true, additionalType: 'facade' },
        { value: 'insulating', label: 'Изоляционные', tabIndex: '1', hasAdditional: false },
        { value: 'load', label: 'Напольные', tabIndex: '2', hasAdditional: false },
        { value: 'roof', label: 'Кровля', tabIndex: '3', hasAdditional: true, additionalType: 'roof' },
        { value: 'universal', label: 'Универсальные', tabIndex: '4', hasAdditional: false },
        { value: 'sandwich', label: 'Сэндвич панель', tabIndex: '5', hasAdditional: false }
    ],

    additionalFields: {
        facade: {
            title: 'Выберите тип фасада (для назначения «Фасады» требуется дополнительное уточнение):',
            options: [
                { value: 'Вентилируемый', label: 'Вентилируемый', name: 'radio2' },
                { value: 'Штукатурка', label: 'Штукатурка', name: 'radio2' }
            ],
            contentIndex: '0'
        },
        roof: {
            title: 'Выберите тип кровли (для назначения «Кровля» требуется дополнительное уточнение):',
            options: [
                { value: 'Плоская', label: 'Плоская', name: 'radio3' },
                { value: 'Скатная', label: 'Скатная', name: 'radio3' }
            ],
            contentIndex: '3'
        }
    },

    thicknessOptions: [
        { value: '30', label: '30 мм', name: 'radioAdd', onlyFor: 'insulating' }, // только для insulating
        { value: '50', label: '50 мм', name: 'radioAdd' },
        { value: '100', label: '100 мм', name: 'radioAdd' }
    ]
};

const basaltum_list = {
    universal: [
        {name: 'Базальтум 50', width: 50, boxm3: 0.216, price: 144},
        {name: 'Базальтум 50', width: 100, boxm3: 0.216, price: 144},
    ],
    facade: [
        {name: 'Базальтум вент 75', width: 50, boxm3: 0.216, price: 192, vent: true},
        {name: 'Базальтум вент 75', width: 100, boxm3: 0.216, price: 192, vent: true},
        {name: 'Базальтум вент 90', width: 50, boxm3: 0.216, price: 228, vent: true},
        {name: 'Базальтум вент 90', width: 100, boxm3: 0.216, price: 288, vent: true},
        {name: 'Базальтум вент 95', width: 50, boxm3: 0.216, price: 234, vent: true},
        {name: 'Базальтум вент 95', width: 100, boxm3: 0.216, price: 234, vent: true},
        {name: 'Базальтум вент 100', width: 50, boxm3: 0.216, price: 246, vent: true},
        {name: 'Базальтум вент 100', width: 100, boxm3: 0.216, price: 246, vent: true},
        {name: 'Базальтум фасад 80', width: 50, boxm3: 0.216, price: 204, vent: false},
        {name: 'Базальтум фасад 80', width: 100, boxm3: 0.216, price: 204, vent: false},
        {name: 'Базальтум фасад 90', width: 50, boxm3: 0.216, price: 228, vent: false},
        {name: 'Базальтум фасад 90', width: 100, boxm3: 0.216, price: 228, vent: false},
        {name: 'Базальтум фасад 95', width: 50, boxm3: 0.216, price: 234, vent: false},
        {name: 'Базальтум фасад 95', width: 100, boxm3: 0.216, price: 234, vent: false},
        {name: 'Базальтум фасад 100', width: 50, boxm3: 0.216, price: 246, vent: false},
        {name: 'Базальтум фасад 100', width: 100, boxm3: 0.216, price: 246, vent: false},
        {name: 'Базальтум фасад 110', width: 50, boxm3: 0.216, price: 264, vent: false},
        {name: 'Базальтум фасад 110', width: 100, boxm3: 0.216, price: 264, vent: false},
        {name: 'Базальтум фасад 120', width: 50, boxm3: 0.216, price: 282, vent: false},
        {name: 'Базальтум фасад 120', width: 100, boxm3: 0.216, price: 282, vent: false},
        {name: 'Базальтум фасад 135', width: 50, boxm3: 0.216, price: 306, vent: false},
        {name: 'Базальтум фасад 135', width: 100, boxm3: 0.216, price: 306, vent: false},
        {name: 'Базальтум фасад 150', width: 50, boxm3: 0.216, price: 336, vent: false},
        {name: 'Базальтум фасад 150', width: 100, boxm3: 0.216, price: 336, vent: false},
    ],
    roof: [
        {name: 'Базальтум РУФ 100', width: 50, boxm3: 0.216, price: 246},
        {name: 'Базальтум РУФ 100', width: 100, boxm3: 0.216, price: 246},
        {name: 'Базальтум РУФ 115', width: 50, boxm3: 0.216, price: 270},
        {name: 'Базальтум РУФ 115', width: 100, boxm3: 0.216, price: 270},
        {name: 'Базальтум РУФ 120', width: 50, boxm3: 0.216, price: 282},
        {name: 'Базальтум РУФ 120', width: 100, boxm3: 0.216, price: 282},
        {name: 'Базальтум РУФ 130', width: 50, boxm3: 0.216, price: 300},
        {name: 'Базальтум РУФ 130', width: 100, boxm3: 0.216, price: 300},
        {name: 'Базальтум РУФ 135', width: 50, boxm3: 0.216, price: 312},
        {name: 'Базальтум РУФ 135', width: 100, boxm3: 0.216, price: 312},
        {name: 'Базальтум РУФ 160', width: 50, boxm3: 0.216, price: 354},
        {name: 'Базальтум РУФ 160', width: 100, boxm3: 0.216, price: 354},
        {name: 'Базальтум РУФ 170', width: 50, boxm3: 0.216, price: 372},
        {name: 'Базальтум РУФ 170', width: 100, boxm3: 0.216, price: 372},
        {name: 'Базальтум РУФ 185', width: 50, boxm3: 0.216, price: 396},
        {name: 'Базальтум РУФ 185', width: 100, boxm3: 0.216, price: 396},
        {name: 'Базальтум РУФ 190', width: 50, boxm3: 0.144, price: 408},
        {name: 'Базальтум РУФ 190', width: 100, boxm3: 0.144, price: 408},
    ],
    load: [
        {name: 'Базальтум флор 125', width: 50, boxm3: 0.216, price: 288},
        {name: 'Базальтум флор 125', width: 100, boxm3: 0.216, price: 288},
        {name: 'Базальтум флор 155', width: 50, boxm3: 0.216, price: 342},
        {name: 'Базальтум флор 155', width: 100, boxm3: 0.216, price: 342},
        {name: 'Базальтум флор 180', width: 50, boxm3: 0.216, price: 390},
        {name: 'Базальтум флор 180', width: 100, boxm3: 0.216, price: 390},
    ],
    sandwich: [
        {name: 'Базальтум сэндвич 95', width: 100, boxm3: 0.226, price: 234},
        {name: 'Базальтум сэндвич 100', width: 100, boxm3: 0.226, price: 246},
        {name: 'Базальтум сэндвич C 110', width: 100, boxm3: 0.226, price: 264},
        {name: 'Базальтум сэндвич K 125', width: 100, boxm3: 0.226, price: 288},
    ],
    insulating: [
        {name: 'Базальтум 30', width: 100, boxm3: 0.288, price: 114},
        {name: 'Базальтум 35', width: 50, boxm3: 0.226, price: 120},
        {name: 'Базальтум 35', width: 100, boxm3: 0.288, price: 120},
        {name: 'Базальтум 40', width: 100, boxm3: 0.288, price: 126},
        {name: 'Базальтум Аккустик', width: 50, boxm3: 0.216, price: 138},
        {name: 'Базальтум Аккустик', width: 100, boxm3: 0.288, price: 138},
        {name: 'Базальтум 60', width: 50, boxm3: 0.226, price: 162},
        {name: 'Базальтум 60', width: 100, boxm3: 0.216, price: 162},
        {name: 'Базальтум 70', width: 50, boxm3: 0.216, price: 180},
        {name: 'Базальтум 70', width: 100, boxm3: 0.216, price: 180},
        {name: 'Базальтум 80', width: 50, boxm3: 0.216, price: 198},
        {name: 'Базальтум 80', width: 100, boxm3: 0.216, price: 198},
        {name: 'Базальтум 90', width: 50, boxm3: 0.216, price: 216},
        {name: 'Базальтум 90', width: 100, boxm3: 0.216, price: 216},
        {name: 'Базальтум 100', width: 50, boxm3: 0.216, price: 240},
        {name: 'Базальтум 100', width: 100, boxm3: 0.216, price: 240},
        {name: 'Базальтум 110', width: 50, boxm3: 0.216, price: 258},
        {name: 'Базальтум 110', width: 100, boxm3: 0.216, price: 258},
        {name: 'Базальтум 120', width: 50, boxm3: 0.216, price: 276},
        {name: 'Базальтум 120', width: 100, boxm3: 0.216, price: 276},
        {name: 'Базальтум 130', width: 50, boxm3: 0.216, price: 294},
        {name: 'Базальтум 130', width: 100, boxm3: 0.216, price: 294},
        {name: 'Базальтум 140', width: 50, boxm3: 0.216, price: 306},
        {name: 'Базальтум 140', width: 100, boxm3: 0.216, price: 306},
        {name: 'Базальтум 150', width: 50, boxm3: 0.216, price: 324},
        {name: 'Базальтум 150', width: 30, boxm3: 0.216, price: 324},
        {name: 'Базальтум 150', width: 100, boxm3: 0.216, price: 324},
        {name: 'Базальтум 160', width: 50, boxm3: 0.216, price: 342},
        {name: 'Базальтум 160', width: 100, boxm3: 0.216, price: 342},
        {name: 'Базальтум 170', width: 50, boxm3: 0.216, price: 360},
        {name: 'Базальтум 170', width: 100, boxm3: 0.216, price: 360},
        {name: 'Базальтум 180', width: 50, boxm3: 0.216, price: 378},
        {name: 'Базальтум 180', width: 100, boxm3: 0.216, price: 378},
        {name: 'Базальтум 190', width: 50, boxm3: 0.144, price: 396},
        {name: 'Базальтум 190', width: 100, boxm3: 0.144, price: 396},
        {name: 'Базальтум 200', width: 50, boxm3: 0.144, price: 414},
        {name: 'Базальтум 200', width: 100, boxm3: 0.144, price: 414},
    ],
};

function generateRadio(label, name, value) {
    return `
        <label class="radio">
            <input type="radio" name="${name}" value="${value}">
            <span class="radio__elem"></span>
            <span class="radio__text">${label}</span>
        </label>
    `;
}

function generateCalculatorHTML() {
    return `
        <div class="calculator__item">
            <div class="calculator__item_title">1: Назначение</div>
            <div class="additional">
                <ul class="additionalCheckbox">
                    ${calculatorConfig.purposes.map(purpose => `
                        <li data-tab="${purpose.tabIndex}">
                            ${generateRadio(purpose.label, 'radio', purpose.value)}
                        </li>
                    `).join('')}
                </ul>
                <ul class="additionalContend">
                    ${Object.entries(calculatorConfig.additionalFields).map(([key, field]) => `
                        <li data-content="${field.contentIndex}">
                            <div class="additionalContend__box">
                                <div class="additional__label">${field.title}</div>
                                <div class="additionalContend__box_check">
                                    ${field.options.map(option => generateRadio(option.label, option.name, option.value)).join('')}
                                </div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        <div class="calculator__item">
            <div class="calculator__item_title">2. Дополнительные параметры</div>
            <div class="additional">
                <div class="additional__label">Толщина плиты:</div>
                <ul class="additionalParamsCheckbox">
                    ${calculatorConfig.thicknessOptions.map(option => {
                        const specialClass = option.value === '30' ? 'thickness-30-only' : '';
                        return `<li class="${specialClass}">${generateRadio(option.label, option.name, option.value)}</li>`;
                    }).join('')}
                </ul>
                <div class="form__item">
                    <label class="additional__label">Количество требуемых квадратных метров:</label>
                    <input type="text" placeholder="Введите м²">
                </div>
            </div>
        </div>
    `;
}

// ========== ОСНОВНОЙ КОД ==========
document.addEventListener('DOMContentLoaded', function() {
    // ========== ИНИЦИАЛИЗАЦИЯ LIGHTBOX ==========
    const lightbox = new afLightbox({ mobileInBottom: true });

    // ========== ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ДЛЯ DATA-MODAL ==========
    document.body.addEventListener('click', function(e) {
        const modalTrigger = e.target.closest('[data-modal]');
        if (modalTrigger) {
            e.preventDefault();
            const modalPath = modalTrigger.getAttribute('data-modal');
            if (modalPath) {
                fetch(modalPath)
                    .then(response => response.text())
                    .then(html => lightbox.open(html))
                    .catch(error => {
                        console.error('Ошибка загрузки модального окна:', error);
                        lightbox.open('<div style="padding: 20px;">Ошибка загрузки содержимого</div>');
                    });
            }
        }
    });

    // ========== ГЕНЕРАЦИЯ HTML КАЛЬКУЛЯТОРА ==========
    const calculatorContainer = document.querySelector('.calculator__card .form');
    if (calculatorContainer) {
        const prep = calculatorContainer.querySelector('.calculator__card_pre');
        if (prep) {
            const generatedHTML = generateCalculatorHTML();
            prep.insertAdjacentHTML('afterend', generatedHTML);
        }
    }

    // ========== КЭШ ЭЛЕМЕНТОВ ==========
    const moreContent = document.querySelector('.moreContent');
    const addMoreContentBtn = document.querySelector('.addMoreContent');

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    const getSelectedPurpose = () => {
        const checked = document.querySelector('input[name="radio"]:checked');
        return checked ? checked.value : null;
    };

    const getSelectedFacadeType = () => {
        const checked = document.querySelector('input[name="radio2"]:checked');
        return checked ? checked.value === 'Вентилируемый' : null;
    };

    const getSelectedRoofType = () => {
        const checked = document.querySelector('input[name="radio3"]:checked');
        return checked ? checked.value : null;
    };

    const getSelectedWidth = () => {
        const checked = document.querySelector('input[name="radioAdd"]:checked');
        return checked ? parseInt(checked.value) : null;
    };

    const getSquareMeters = () => {
        const input = document.querySelector('.form__item input[type="text"]');
        if (!input?.value) return 0;
        const value = parseFloat(input.value);
        return isNaN(value) ? 0 : value;
    };

    // ========== ФУНКЦИИ ДЛЯ ОТОБРАЖЕНИЯ ОШИБОК ==========
    const clearAllErrors = () => {
        const allErrors = document.querySelectorAll('.errorText');
        allErrors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    };

    const showError = (selector, message) => {
        const container = document.querySelector(selector);
        if (!container) return;

        let errorDiv = container.querySelector('.errorText:not(.global-error)');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'errorText';
            container.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    // ========== ОСНОВНЫЕ ФУНКЦИИ ==========
    const filterProducts = (purpose, ventRequired, width) => {
        if (!purpose || !basaltum_list[purpose]) return [];
        let products = [...basaltum_list[purpose]];
        if (purpose === 'facade' && ventRequired !== null) {
            products = products.filter(p => p.vent === ventRequired);
        }
        if (width) {
            products = products.filter(p => p.width === width);
        }
        return products;
    };

    const calculatePacks = (needm3, boxm3) => {
        if (!needm3 || !boxm3 || boxm3 === 0) return 0;
        return Math.ceil(needm3 / boxm3);
    };

    const escapeHtml = (str) => {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    };

    const renderResults = (products, squareMeters, widthInMeters) => {
        if (!moreContent) return;

        const itemsToRemove = moreContent.querySelectorAll('.moreContent__item');
        itemsToRemove.forEach(item => item.remove());

        if (!products?.length) {
            const noResults = document.createElement('div');
            noResults.className = 'moreContent__item noResults';
            noResults.innerHTML = '<div>Нет подходящих вариантов</div>';
            const addText = moreContent.querySelector('.moreContent__AddText');
            addText ? moreContent.insertBefore(noResults, addText) : moreContent.appendChild(noResults);
            return;
        }

        const needm3 = squareMeters * (widthInMeters / 1000);

        products.forEach(product => {
            const packsCount = calculatePacks(needm3, product.boxm3);
            const totalPrice = packsCount * product.price;
            const totalVolume = packsCount * product.boxm3;

            const productCard = document.createElement('div');
            productCard.className = 'moreContent__item';
            productCard.setAttribute('data-modal', '/parts/_popup-product.html');
            productCard.innerHTML = `
                <div class="moreContent__item_product">
                    <div class="moreContent__item_product-img">
                        <picture>
                            <img src="/img/common/product/1.png" loading="lazy" alt="${escapeHtml(product.name)}">
                        </picture>
                    </div>
                    <div class="moreContent__item_product-name">${escapeHtml(product.name)}</div>
                </div>
                <div class="moreContent__item_line">
                    <div class="moreContent__item_line-text">Упаковок нужно</div>
                    <div class="moreContent__item_line-info">${packsCount} шт.</div>
                </div>
                <div class="moreContent__item_line">
                    <div class="moreContent__item_line-text">Объём в упаковке</div>
                    <div class="moreContent__item_line-info">${totalVolume.toFixed(3)} м<sup>3</sup></div>
                </div>
                <div class="moreContent__item_line">
                    <div class="moreContent__item_line-text">Общая стоимость</div>
                    <div class="moreContent__item_line-info"><b>${totalPrice} руб.</b><sup>*</sup></div>
                </div>
            `;
            const addText = moreContent.querySelector('.moreContent__AddText');
            addText ? moreContent.insertBefore(productCard, addText) : moreContent.appendChild(productCard);
        });
    };

    // Функция валидации формы
    const validateForm = () => {
        const purpose = getSelectedPurpose();
        const width = getSelectedWidth();
        const squareMeters = getSquareMeters();

        clearAllErrors();
        let isValid = true;

        if (!purpose) {
            showError('.additionalCheckbox', 'Выберите тип назначения');
            isValid = false;
        }
        if (!width) {
            showError('.additionalParamsCheckbox', 'Выберите толщину плиты');
            isValid = false;
        }
        if (squareMeters <= 0 || isNaN(squareMeters)) {
            showError('.form__item', 'Введите корректное количество квадратных метров');
            isValid = false;
        }
        if (purpose === 'facade') {
            const ventRequired = getSelectedFacadeType();
            if (ventRequired === null) {
                showError('.additionalContend li[data-content="0"]', 'Выберите тип фасада');
                isValid = false;
            }
        } else if (purpose === 'roof') {
            const roofType = getSelectedRoofType();
            if (!roofType) {
                showError('.additionalContend li[data-content="3"]', 'Выберите тип кровли');
                isValid = false;
            }
        }
        return isValid;
    };

    const calculateAndDisplay = () => {
        if (!validateForm()) {
            if (moreContent) moreContent.classList.remove('open');
            return;
        }

        const purpose = getSelectedPurpose();
        const width = getSelectedWidth();
        const squareMeters = getSquareMeters();

        if (moreContent) moreContent.classList.add('open');

        if (purpose === 'facade') {
            const ventRequired = getSelectedFacadeType();
            renderResults(filterProducts(purpose, ventRequired, width), squareMeters, width);
        } else {
            renderResults(filterProducts(purpose, null, width), squareMeters, width);
        }
    };

    // ========== ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ ==========
    if (addMoreContentBtn) {
        addMoreContentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculateAndDisplay();
        });
    }

    if (moreContent) {
        moreContent.classList.remove('open');
    }

    // Управление дополнительными блоками
    const purposeRadios = document.querySelectorAll('input[name="radio"]');
    const additionalContents = document.querySelectorAll('.additionalContend li');

    const setActiveContent = () => {
        const selectedPurpose = getSelectedPurpose();
        additionalContents.forEach(content => {
            content.style.display = 'none';
        });
        if (selectedPurpose === 'facade') {
            const content = document.querySelector('.additionalContend li[data-content="0"]');
            if (content) content.style.display = 'block';
        } else if (selectedPurpose === 'roof') {
            const content = document.querySelector('.additionalContend li[data-content="3"]');
            if (content) content.style.display = 'block';
        }
        // Удаляем все классы
        document.body.classList.remove('facade-selected', 'insulating-selected', 'roof-selected');

        // Добавляем класс для выбранного назначения
        if (selectedPurpose) {
            document.body.classList.add(`${selectedPurpose}-selected`);
        }
        clearAllErrors();
    };

    purposeRadios.forEach(radio => {
        radio.addEventListener('change', setActiveContent);
    });

    // Очистка ошибок при изменении полей
    const setupRealtimeErrorClearing = () => {
        document.querySelectorAll('input[name="radioAdd"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const errorDiv = document.querySelector('.calculator__item .additional ul .errorText');
                if (errorDiv) {
                    errorDiv.textContent = '';
                    errorDiv.style.display = 'none';
                }
            });
        });

        const squareInput = document.querySelector('.form__item input[type="text"]');
        if (squareInput) {
            squareInput.addEventListener('input', () => {
                const errorDiv = document.querySelector('.form__item .errorText');
                if (errorDiv) {
                    errorDiv.textContent = '';
                    errorDiv.style.display = 'none';
                }
            });
        }

        document.querySelectorAll('input[name="radio2"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const errorDiv = document.querySelector('.additionalContend li[data-content="0"] .errorText');
                if (errorDiv) {
                    errorDiv.textContent = '';
                    errorDiv.style.display = 'none';
                }
            });
        });

        document.querySelectorAll('input[name="radio3"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const errorDiv = document.querySelector('.additionalContend li[data-content="3"] .errorText');
                if (errorDiv) {
                    errorDiv.textContent = '';
                    errorDiv.style.display = 'none';
                }
            });
        });
    };

    setupRealtimeErrorClearing();
    setActiveContent();
});