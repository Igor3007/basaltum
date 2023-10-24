import Cookies from "js-cookie"

export default function WishList(){

    this.elemCookie = 'wishlist';
    this.elemTotal  = document.querySelector('[data-totalwishlist]');

    this.init = function(){
        this.getTotal()
    }

    this.getTotal = function(){

        if(this.getArray().length){
            this.elemTotal.classList.remove('hide');
            this.elemTotal.innerText = this.getArray().length;
        }

    }

    this.getArray = function(){
        if(!Cookies.get(this.elemCookie)) return new Array()

        return String(Cookies.get(this.elemCookie)).split(',')
    } 

    this.add = function(id){
        var array = this.getArray();
            array.push(id)
            array = Array.from(new Set(array))

        Cookies.set(this.elemCookie, array.join(','), { expires: 7 })
        this.getTotal()
        return array;
    }

    this.remove = function(id){

        var array = this.getArray();
        var result = array.filter(function(item){
            return item != id
        })

        Cookies.set(this.elemCookie, result.join(','), { expires: 7 })
        this.getTotal()
        return array;

    }
}