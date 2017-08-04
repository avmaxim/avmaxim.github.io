var Carousel = (function($){
    function createFromSelector(selector, options){

        var defaults = $.extend({}, options);
        var timer = -1;
        var jcarousel =  $(selector);

        jcarousel
            .on('jcarousel:reload jcarousel:create', function () {
                jcarousel.jcarousel('items').width(jcarousel.innerWidth());
            })
            .on(Modernizr.touchevents === true ? 'touchstart' : 'mousedown', function(){
                if ( defaults.isTimerBased && timer !== undefined) {
                    clearInterval(timer);
                }
            })
            .on("swipeleft",function(){
                jcarousel.jcarousel('scroll', '+=1');
                if (defaults.updateArrowsOnEndpoint) {
                    updateCarouselArrows();
                }
            })
            .on("swiperight", function(){
                jcarousel.jcarousel('scroll', '-=1');
                if (defaults.updateArrowsOnEndpoint) {
                    updateCarouselArrows();
                }
            })
            .jcarousel({
                animation: Modernizr.touchevents ? 1000 : 1200,
                wrap: 'circular',
                transitions: Modernizr.csstransitions ? {
                    transforms:   Modernizr.csstransforms,
                    transforms3d: Modernizr.csstransforms3d,
                    easing:       'ease'
                } : false
            });

        updateCarouselArrows();

        if (defaults.isTimerBased) {
            timer = setInterval(function () {
                jcarousel.jcarousel('scroll', '+=1');

                updateCarouselArrows();

            }, 10000);
        }

        if (defaults.hasPrevNextButtons) {

            $(selector + '~ .jcarousel-control-prev')
                .on('jcarouselcontrol:active', function () {
                    $(this).removeClass('inactive');
                })
                .on('jcarouselcontrol:inactive', function () {
                    $(this).addClass('inactive');
                })
                .on('click', function (e) {
                    e.preventDefault();
                    updateCarouselArrows();
                })
                .jcarouselControl({
                    target: '-=1'
                });

            $(selector + '~ .jcarousel-control-next')
                .on('jcarouselcontrol:active', function () {
                    $(this).removeClass('inactive');
                })
                .on('jcarouselcontrol:inactive', function () {
                    $(this).addClass('inactive');
                })
                .on('click', function (e) {
                    e.preventDefault();
                    updateCarouselArrows();
                })
                .jcarouselControl({
                    target: '+=1'
                });
        }
        if (defaults.isPaginated) {
            $(selector + '~ .jcarousel-pagination')
                .on('jcarouselpagination:active', 'a', function () {
                    $(this).addClass('active');
                    updateCarouselArrows();
                })
                .on('jcarouselpagination:inactive', 'a', function () {
                    $(this).removeClass('active');
                    updateCarouselArrows();
                })
                .on('click', function (e) {
                    e.preventDefault();
                })
                .jcarouselPagination({
                    item: function (page) {
                        return '<a href="#' + page + '">' + page + '</a>';
                    }
                });
        }

        function  updateCarouselArrows() {

            if (!defaults.updateArrowsOnEndpoint)
                return;

            var currentVisibleItem = jcarousel.jcarousel('visible')[0],
                $listOfItems = jcarousel.jcarousel('list');

            $(selector + '~ .jcarousel-control-prev').show();
            $(selector + '~ .jcarousel-control-next').show();

            if ( currentVisibleItem == $listOfItems.find('li.last-item')[0] ){
                $(selector + '~ .jcarousel-control-next').hide();
            }
            if ( currentVisibleItem == $listOfItems.find('li.first-item')[0] ){
                $(selector + '~ .jcarousel-control-prev').hide();
            }
        }
    }

    return {
        createFromSelector: createFromSelector
    }
}(jQuery));

$(function(){
    Carousel.createFromSelector('.rtb .jcarousel', {
        hasPrevNextButtons: true
    });
})