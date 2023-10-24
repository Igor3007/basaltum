import $ from 'jquery';

$(document).ready(function () {

    const ulSelect = $('.ul-select-wrp .ul-select li');

    ulSelect.each(function(index){
        if(index == 0){
            $(this).addClass('active');
        }

        if($(this).hasClass('active') && index != 0){
            ulSelect.removeClass('active')
            $(this).addClass('active')
            return false;
        }
    })

    ulSelect.on('click', function (event) {

        if ($(this).hasClass('active')) {
            event.preventDefault();
        }

        ulSelect.removeClass('active')
        $(this).addClass('active')
        $(this).parent().toggleClass('open');
    })
});