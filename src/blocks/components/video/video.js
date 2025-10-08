import $ from 'jquery';
/* video about */

$('.video').on('click', function () {
    const videoID = $(this).attr('data-id');
    $(this)
        .append('<iframe src="https://www.youtube.com/embed/' + videoID + '?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1&rel=0&showinfo=0" allowfullscreen="" width="' + $(this).width() + 'px" height="' + $(this).height() + 'px"></iframe>')
        .addClass('play')

    $('.swiper-topbar, .swiper-bottombar').hide()
})