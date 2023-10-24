     /* =========================================
     datepicker
     ========================================= */

     window.initDatepicker = function (input, option) {

         // input - input DOM elem

         if (!input.datepicker) {
             let datepicker = new Datepicker(input, {
                 autohide: true,
                 language: (input.dataset.datepickerLang ? input.dataset.datepickerLang : 'ru')
             });

             if (option.autoShow) datepicker.show()

             input.addEventListener('changeDate', function (event) {
                 if (event.target.value) {
                     input.setAttribute('area-valid', 'true')
                 } else {
                     input.removeAttribute('area-valid')
                 }
             })

             input.datepicker.picker.element.classList.add('picker-custom-offset');
         }
     }

     if (document.querySelector('[data-datepicker-lang]')) {
         (function () {
             Datepicker.locales.ru = {
                 days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                 daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
                 daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                 months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                 monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                 today: "Сегодня",
                 clear: "Очистить",
                 format: "dd.mm.yyyy",
                 weekStart: 1,
                 monthsTitle: 'Месяцы'
             }
         })();
     }

     if (document.querySelector('.input-datepicker')) {

         document.querySelectorAll('.input-datepicker').forEach(function (input) {
             input.addEventListener('focus', function (event) {

                 window.initDatepicker(input, {
                     autoShow: true
                 })

             })

             // click on icons
             input.parentNode.addEventListener('click', function (event) {
                 input.focus()
             })
         })
     }

     //clear datepicker

     function initClearDatepicker() {
         if (document.querySelectorAll('.clear-calendar').length) {

             document.querySelectorAll('.clear-calendar').forEach(function (item) {



                 item.parentNode.querySelector('input').addEventListener('changeDate', function () {
                     item.style.display = 'block'
                 })

                 // asasas

                 item.addEventListener('click', function (e) {
                     e.stopPropagation(true)

                     let container = e.target.closest('.lineup__date')

                     container.querySelector('input').value = ''
                     container.querySelector('input').removeAttribute('area-valid')

                     item.style.display = 'none'



                 })
             })
         }
     }

     initClearDatepicker()