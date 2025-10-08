if(document.querySelectorAll('.faq-item__question')){

    const faqItems = document.querySelectorAll('.faq-item__question')


    faqItems.forEach(function(item, index){
        item.addEventListener('click', function(){
            this.parentNode.classList.toggle('open')
        })
    })

} 
