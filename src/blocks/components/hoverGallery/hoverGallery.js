export default class hoverGallery {
    constructor(element){
        this.elem = element
        this.slideCount = 0

        this.galleryContainer = element.querySelector('.minicard__gallery')
        this.navContainer     = element.querySelector('.minicard__nav ul.dots')
        this.hoverContainer   = element.querySelector('.minicard__nav ul.hover')
    }

    init() {
         
        this.slideCount = this.galleryContainer.children.length;
        this.createNavDots(this.slideCount)
        this.slideChange(0)
        this.event();
    }

    createNavDots(count) {
        for(let i=0; i<count; i++ ){
            this.navContainer.appendChild(document.createElement('li'))
            this.hoverContainer.appendChild(document.createElement('li'))
        }
    }

    slideChange(index){

        //nav
        if(this.navContainer.querySelector('li.active')){
            this.navContainer.querySelector('li.active').classList.remove('active')
        }
        this.navContainer.querySelectorAll('li')[index].classList.add('active')

        //gallery

        if(this.galleryContainer.querySelector('div.active')){
            this.galleryContainer.querySelector('div.active').classList.remove('active')
        }
        this.galleryContainer.querySelectorAll('div')[index].classList.add('active')
    }

    event(){


        var elems = this.navContainer.querySelectorAll('li')
        var _this = this;

        elems.forEach(function(item, index){
            item.addEventListener('click', function(event){
                var index = Array.prototype.slice.call(event.target.parentElement.children).indexOf(event.target)
                _this.slideChange(index)
            });
        })

        //hover
        var elems = this.hoverContainer.querySelectorAll('li')

        elems.forEach(function(item, index){
            item.addEventListener('mouseenter', function(event){
                var index = Array.prototype.slice.call(event.target.parentElement.children).indexOf(event.target)
                _this.slideChange(index)
            });
        })


    }
}