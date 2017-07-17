
/*****************  Modal Window ********************/
var Modal = (function($, window, undefined){

    return function createInstance (parentSelector, _config) {
        var service = {};

        var $overlay,
            $modal,
            $content,
            $close,
            isInitialized,
            config,
            oldWidth = 1200;

        parentSelector = parentSelector ? parentSelector : '';
        config = _config;
        $overlay = $(parentSelector + ' .abandon-overlay');
        $modal = $(parentSelector + ' .abandon-modal');
        $content = $(parentSelector + ' .abandon-content');
        $close = $(parentSelector + ' .abandon-close');

        $modal.hide();
        $overlay.hide();

        $close.on('click', function(e){
            e.preventDefault();
            service.close();
        });

        $overlay.on('click touchstart', service.close);

        isInitialized = true;

        service.open = function(){

            if (!isInitialized) {
                service.init();
            }

            $modal.show();
            $overlay.show();

            $(window).bind('resize.modal orientationchange',resize() || resize);
        };

        service.close = function() {
            if (!isInitialized) {
                service.init();
            }

            $modal.hide();
            $overlay.hide();

            $(window).unbind('resize.modal orientationchange');
        };

        function resize(){
            setTimeout(function () {

                //android keyboard hiding fix
                if ($('input').is(':focus')) {
                    return;
                }

                var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

                if (oldWidth === w){
                    return;
                }

                var isAbandonHeightBiggerThanWindow = $(window).outerHeight() < $modal.outerHeight();
                var leftModalPos = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;
                var top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
                var body = window.document.body;
                var html = window.document.documentElement;

                var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
                var modalMaxWidth =  $modal.outerWidth();
                $modal.css('position',  isAbandonHeightBiggerThanWindow ? 'absolute' :  'fixed');
                $modal.css('left', w >= modalMaxWidth ? leftModalPos : 0);

                $modal.css("top",  50 );

                $overlay.height( documentHeight);
                $('html,body').animate({
                    scrollTop:  50
                }, 700);

                oldWidth = w;
            }, 500);
        }

        return service;
    }

})(jQuery, window, undefined);


/*****************  Chase Accordion ********************/

$(window).on('load', function(){
    window.ChaseAccordion = {
        openAccountAccordion: function () {
            var balance = 0,
                screen = $(window).width();

            if (screen < 640) {
                balance = 200;
            }

            $('.accordion-account').css('display', 'block');

            $('html, body').animate({
                scrollTop: $(".accordion-account").offset().top + balance
            }, 400);

            $('.offer-box').css('padding-top', '45px')
        },

        toggleDetailAccordion: function () {
            var screen = $(window).width();
            var toggleText = $('.tap-js').text();
            if (toggleText == "+") {
                $('.accordion-body').css('display', 'block');
                $('.tap-js').addClass('collapsed').text('-')

            } else {
                $('.accordion-body').css('display', 'none');
                $('.tap-js').removeClass('collapsed').text('+')
            }
        },

        openDetailAccordion: function () {

            window.ChaseAccordion.toggleDetailAccordion();
        }
    };

}());



