export function YMaps(option){

    this.map = null;
    this.MyBalloonLayout = null;
    this.MyBalloonContentLayout = null;
    this.MyIconContentLayout = null;
    this.isInit = false;

    this.mapsParams = {
        container: 'inmap',
        params: {
          center: [55.714225, 37.848540],
          zoom: 14,
          controls: ['zoomControl', 'fullscreenControl']
        },
        ballonMobileMode: false,
        autoscale: false,
        icons: {
          'default':'/img/svg/ic_pen-empty.svg',
          'active':'/img/svg/ic_pen-empty.svg',
        },
        points: []
    }

    this.init = function(onInitCallback){

        if(!this.isInit) {

            this.isInit = !this.isInit
            var _this = this
            console.info('init Ymaps')

            ymaps.ready(function () {

                // Создание экземпляра карты и его привязка к созданному контейнеру.
                _this.map = new ymaps.Map(''+_this.mapsParams.container+'',  _this.mapsParams.params , {
                    suppressMapOpenBlock: true,
                });

                // Создание макета балуна на основе Twitter Bootstrap.
                _this.MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="sh-balloon"></div>' 
                );

                // Создание вложенного макета содержимого балуна.
                _this.MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="bln-scroll-offset" >$[properties.balloonContent]</div>'
                );

                _this.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="pin-content" >$[properties.iconContent]</div>'
                );

                _this.map.behaviors.disable('scrollZoom')
                
                onInitCallback(_this.isInit);
            })
        }
        
        
    }

    this.resizeContainer = function(){
        var _this = this;
        setTimeout(function(){
            _this.map.container.fitToViewport();
            //autoscale
            if(_this.mapsParams.autoscale){
                _this.autoScale()
            }
        }, 500)
    }

    this.autoScale = function(){
        var _this = this;
        _this.map.setBounds(_this.map.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 100 });
    }

    this.addPlacemark = function(arrayPoints){


            var _this = this;
            var sizeIcons = [50, 70];
            var placemarkOffset = [-25, -70];
            var offsetIcons = [16, 15];
            this.mapsParams.points = arrayPoints;
            this.map.geoObjects.removeAll();

            if(window.innerWidth < 769) {
                sizeIcons = [30, 45];
                offsetIcons = [8, 9]; 
                placemarkOffset = [-15, -45];
            } 
        
            try {
        
                var PlacemarkArr = [];
        
                for (let i = 0; i < _this.mapsParams.points.length; i++) {

                    // Создание метки  
                    PlacemarkArr[i] = new ymaps.Placemark(_this.mapsParams.points[i].coordinates.split(','), {
                        balloonContent: '',
                        iconContent: '<span class="icons-marker" style="background-image: url('+_this.mapsParams.points[i].markerImage+')" ></span>',
                        //hintContent: 'hint',
                    }, {
                        balloonShadow: false,
                        balloonLayout: _this.MyBalloonLayout,
                        balloonContentLayout: _this.MyBalloonContentLayout,
                        balloonPanelLayout: _this.MyBalloonLayout,
                        balloonPanelMaxMapArea: false,
                        // Не скрываем иконку при открытом балуне.
                        hideIconOnBalloonOpen: false,
                        // И дополнительно смещаем балун, для открытия над иконкой.
                        balloonOffset: [-15, 6],
                        
        
                        // balloonContentLayout: LayoutActivatePoint,
                        iconLayout: 'default#imageWithContent',
                        iconImageHref: _this.mapsParams.icons.default,
                        iconImageSize: sizeIcons,
                        iconImageOffset: placemarkOffset,
                        pane: 'balloon',
                        iconContentOffset: offsetIcons,
                        iconContentLayout: _this.MyIconContentLayout,
                        draggable: false
                    });
        
                    PlacemarkArr[i].events.add('balloonopen', function (e) {
                        
                        // PlacemarkArr[i].properties.set('balloonContent', _this.mapsParams.points[i].balloonContent);
                        // e.get('target').options.set({
                        //     iconImageHref: _this.mapsParams.icons.active
                        // });

                        // app.renderMapPopupClick(_this.mapsParams.points[i].code, false)

                    });
        
                    PlacemarkArr[i].events.add('balloonclose', function (e) {
                        // e.get('target').options.set({
                        //     iconImageHref: _this.mapsParams.icons.default
                        // });
        
                        // app.closeMapPopup()
                    });
        
                    _this.map.geoObjects.add(PlacemarkArr[i]);
        
                }// endfor
        
        
            } catch(err) {
                console.error('error: YM addPlacemark ', err)
            }
    }

}