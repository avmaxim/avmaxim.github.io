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

        function updateCarouselArrows() {

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

function onLoadResize() {
    var width = $(window).width();
    var $storyCarousel = $('.carousel-container');
    var $items = $('.carousel-item');

    if (width > 640) {
        $storyCarousel
            .removeClass('jcarousel')
            .find('.carousel-item')
            .sort( sortCarouselItems )
            .detach()
            .appendTo( $storyCarousel.children('ul') );
        $items.height('initial');
    } else {
        $storyCarousel.addClass('jcarousel');
        Carousel.createFromSelector('.jcarousel-rtb .jcarousel', {
            hasPrevNextButtons: true
        });

        var maxHeight = Math.max.apply(null, $items.map(function (){
            return $(this).height();
        }).get());

        $items.height(maxHeight);
    }
}

function sortCarouselItems(a, b){
    var an = +a.getAttribute('data-num'),
        bn = +b.getAttribute('data-num');

    if(an > bn) {
        return 1;
    }
    if(an < bn) {
        return -1;
    }
    return 0;
}

$(function(){
    $(window).on("load resize", onLoadResize() || onLoadResize);
});