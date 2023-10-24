 /* ==============================================
     fixed header
     ============================================== */


 //smart neader - hide on scroll down and show on scroll up
 let previousScrollPosition = 0;
 const isScrollingDown = () => {
     let currentScrolledPosition = window.scrollY || window.pageYOffset;
     let scrollingDown;

     if (currentScrolledPosition > previousScrollPosition) {
         scrollingDown = true;
     } else {
         scrollingDown = false;
     }
     previousScrollPosition = currentScrolledPosition;
     return scrollingDown;
 };

 const nav = document.querySelector("header");

 function handleNavScroll() {
     if (isScrollingDown() && !nav.contains(document.activeElement) && !document.body.classList.contains("page_mobile")) {
         nav.classList.add("header--scrolldown");
         nav.classList.remove("header--scrollup");
     } else {
         nav.classList.add("header--scrollup");
         nav.classList.remove("header--scrolldown");
     }

     if (window.pageYOffset <= 0) {
         nav.classList.remove("header--scrollup");
         nav.classList.remove("header--scrolldown");
     }

     const heightHeaderTop = document.querySelector('.header-top').clientHeight

     console.log(heightHeaderTop)

     if (window.pageYOffset >= heightHeaderTop) {
         nav.classList.add("header--fixed-menu");
     } else {
         nav.classList.contains("header--fixed-menu") ? nav.classList.remove("header--fixed-menu") : ''
     }

 }

 function scrollTop() {
     if (window.pageYOffset > 0) {
         this.document.querySelector(".scroll-top").classList.add("scroll-top_active");
     } else {
         this.document.querySelector(".scroll-top").classList.remove("scroll-top_active");
     }

     if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
         this.document.querySelector(".scroll-top").classList.add("at-bottom");
     } else {
         this.document.querySelector(".scroll-top").classList.remove("at-bottom");
     }

 }

 window.addEventListener("scroll", () => {
     //Smart header
     handleNavScroll();
 });