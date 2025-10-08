export default class customSelect{

  constructor(option){
    this.selector = option.selector;
    this.selectAll = document.querySelectorAll(this.selector)
  }

  init(){
    this.renderTemplate()
    this.clickEventOut()
  }

  renderTemplate() {

    const _this = this;

    this.selectAll.forEach(function(item, index){
      item.classList.add('select-hidden');
      const wrapper = document.createElement('div');
            wrapper.classList.add('af-select');
            wrapper.innerHTML = item.outerHTML;
      item.parentNode.replaceChild(wrapper, item);
    })

    document.querySelectorAll('.af-select').forEach(function(item, index){

      const styledSelect = document.createElement('div')
            styledSelect.classList.add('select-styled');
            styledSelect.innerHTML = '<span>Выберите</span>';
      const styledOptions = document.createElement('ul')
            styledOptions.classList.add('select-options');

      item.appendChild(styledSelect)
      item.appendChild(styledOptions)

      _this.clickEventOpenSelect(item)

      //====

      item.querySelectorAll('select > option').forEach(function(item, index){

        if (index == 0) styledSelect.innerHTML = '<span>'+item.innerText+'</span>';

        const li = document.createElement('li')
              li.innerHTML = item.innerText
              li.setAttribute('rel', item.value)

        styledOptions.appendChild(li)

        _this.clickEventListItem(li)

      })

    })
  }

  openSelect(elem){
      elem.style.width = (elem.offsetWidth) + 'px'
      elem.querySelector('.select-styled').classList.toggle('active')
      elem.querySelector('.select-options').classList.toggle('active')
      document.querySelector('body').classList.add('af-select-open')
  }

  closeSelect(){

    if(!document.querySelector('.select-styled.active')) return false

    document.querySelector('.select-styled.active').classList.remove('active')
    document.querySelector('.select-options.active').classList.remove('active')
    document.querySelector('body').classList.remove('af-select-open')
  }

  clickEventOut() {
    const _this = this;
    document.addEventListener('click', function(){
      _this.closeSelect()
    })
  }

  clickEventListItem(elem){

    const parentElem = elem.parentNode.parentNode.parentNode
    const _this = this;

    elem.addEventListener('click', function(event){

      event.stopPropagation()
      event.preventDefault()

      if(parentElem.querySelector('.select-options li.active'))
        parentElem.querySelector('.select-options li.active').classList.remove('active')
      
      this.classList.add('active')
      parentElem.querySelector('.select-styled span').innerHTML = this.innerHTML
      parentElem.querySelector('select').value = this.getAttribute('rel')

      _this.closeSelect()
    })
  }

  clickEventOpenSelect(elem){
    const _this = this;

    elem.addEventListener('click', function(event){
      event.stopPropagation()
      event.preventDefault()
      _this.openSelect(this)
    })
  }

}