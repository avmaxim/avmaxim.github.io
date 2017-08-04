var Carousel = (function($){
    function createFromSelector(selector, options){

        var defaults = $.extend({}, options);
        var timer = -1;
        var jcarousel =  $(selector);

        jcarousel
            .on('jcarousel:reload jcarousel:create', function () {
                jcarousel.jcarousel('items').width(jcarousel.innerWidth());
            })
            .on("swipeleft",function(){
                jcarousel.jcarousel('scroll', '+=1');
            })
            .on("swiperight", function(){
                jcarousel.jcarousel('scroll', '-=1');
            })
            .jcarousel({
                animation: Modernizr.touchevents ? 1000 : 1200,
                wrap: 'circular',
                transitions: Modernizr.csstransitions ? {
                    transforms:   Modernizr.csstransforms,
                    transforms3d: Modernizr.csstransforms3d,
                    easing:       'ease'
                } : false;
            });

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
                })
                .jcarouselControl({
                    target: '+=1'
                });
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