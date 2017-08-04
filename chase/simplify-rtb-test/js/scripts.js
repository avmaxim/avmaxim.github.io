var mySwiper,
    $body = $('body');

function getAndroidVersion(ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
}
/* Open apps if installed, if not - go to website */
function openAppOrWeb(applink, weblink){
    var start, end, elapsed;
    start = new Date().getTime();
    document.location = applink;
    end = new Date().getTime();
    elapsed = (end - start);
    if (elapsed < 2) {
        document.location = weblink;
    }
}

function mapLink(applink, weblink) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    if(w < 1200) {
        openAppOrWeb(applink, weblink)
    } else {
        window.open(weblink, '_blank');
    }
}

var text, logo, scene, scrollMagicController;

var Chase = {
    scrollTop: 0,
    mobileMenu: {

        isMenuOpen: false,
        menuWidth: '285px',
        headerHeight: 70,
        bodyPosition: 0,

        setHamburgerMenu: function () {
            /* Hamburdger Menu */
            $("body, .hamburger-content .anchor-link").click(function () {
                if (Chase.mobileMenu.isMenuOpen === true) {
                    Chase.mobileMenu.closeMenu();
                }
            });

            $(".hamburger-menu, .shadow-mask").click(function (e) {
                e.stopPropagation();
                toggleMenu();
            });

            $(".hamburger-content").click(function (e) {
                e.stopPropagation();
            });

            function toggleMenu() {
                if (Chase.mobileMenu.isMenuOpen === false) {
                    $(".hamburger-menu").addClass("opened");
                    preventDoubleCall(Chase.mobileMenu.openMenu);
                } else {
                    $(".hamburger-menu").removeClass("opened");
                    preventDoubleCall(Chase.mobileMenu.closeMenu);
                }
            }

            var time = new Date().getTime();
            function preventDoubleCall(fn) {
                var timeout = new Date().getTime() - time;
                if (timeout > 500) {
                    fn();
                    time = new Date().getTime();
                }
            }
        },
        openMenu: function () {
            Chase.mobileMenu.bodyPosition = $(window).scrollTop();
            $('.hamburger-content').animate({ "margin-left": '+=' + Chase.mobileMenu.menuWidth })
                .css({
                    overflowX: 'hidden',
                    overflowY: 'auto'
                });
            if (!$body.hasClass('nativeAndroid')) {
                $('.hamburger-content').css({
                    WebkitBoxShadow: '0 3px 7px rgba(0, 0, 0, 0.35)',
                    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.35)'
                });
            }
            $body.addClass("disable-scrolling")
                .css({ top: '-' + Chase.mobileMenu.bodyPosition + 'px' });

            if ($body.hasClass("down")) {
                $(".header.clone").css({ top: 0, position: 'fixed' });
            }

            $('.shadow-mask').addClass('open');

            Chase.mobileMenu.isMenuOpen = true;
        },
        closeMenu: function () {
            $('.hamburger-content')
                .animate({ "margin-left": '-=' + Chase.mobileMenu.menuWidth })
                .css({
                    WebkitBoxShadow: '0 0 0 rgba(0, 0, 0, 0)',
                    boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
                });

            $(".header, .header-cta").removeAttr('style');
            $body.removeClass("disable-scrolling").removeAttr('style');
            $(document).scrollTop(Chase.mobileMenu.bodyPosition);
            $('.shadow-mask').removeClass('open');
            $('.hamburger-menu').removeClass('opened');
            if( Chase.scrollTop < 200 ) {
                $('.header-cta').removeClass('green');
            }
            Chase.mobileMenu.isMenuOpen = false;
        },
        setStickyHeader: function () {
            /* Fixed header */
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (!$("header").hasClass("thanks-header") || $("header").hasClass("thanks-header") && w < 768) {

                $(window).on("scroll", function () {
                    var fromTop = Chase.scrollTop = $(document).scrollTop();
                    var orient;
                    if (screen.width > screen.height) {
                        orient = 90;
                    } else if (screen.width < screen.height) {
                        orient = 0;
                    }

                    if ( $('.header-cta').is(":visible") )
                        $('.header-cta').toggleClass('green', Chase.scrollTop > $(".headline-cta").position().top + 150);

                    var condition = function (top) {
                        var status = true;

                        if (orient === 90 && $("#email").is(":focus") || fromTop < top) {
                            status = false;
                        } else {
                            status = true;
                        }

                        return status;
                    };

                    var stickyStart, bodyUpDown;

                    if ($("header").hasClass("thanks-header")) {
                        stickyStart = 70;
                        bodyUpDown = 30;

                    } else {
                        stickyStart = 200;
                        bodyUpDown = 200;
                    }

                    $body.toggleClass("up", condition(bodyUpDown));
                    $body.toggleClass("down", condition(stickyStart));
                    $("header").toggleClass("clone", condition(bodyUpDown));
                });
            }


        }
    },
    general: function () {
        var ua = navigator.userAgent.toLowerCase();
        if ((ua.indexOf("msie") != -1) || (ua.indexOf("rv:11") != -1) || (ua.indexOf("edge") != -1)) {
            $("sup").css("fontSize", "0.7em");
        } else if ((ua.indexOf("ipad") != -1) || (ua.indexOf("ipod") != -1) || (ua.indexOf("iphone") != -1)) {
            $(".pane-wrapper").find("p").find("sup").css("top", "-0.6em");
            $(".rtb-ty").find("sup").css("top", "-0.7em");
            $(".footer p").css("letterSpacing", "0.1px");
        }

        function detectIE() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }
            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }
            return false;
        }
        var ie = detectIE();

        if (ie) {
            $body.addClass('ie' + ie);
        }

        $(".footer-anchor").click(function () {
            $('html, body').animate({
                scrollTop: $("#footer").offset().top
            }, 400);
        });

        function updateBgImage(){
            if (window.innerWidth <= 640) {
                $('.header-bg').height($('.header-image-text').position().top + $('.header-image-text').height() - 70);
            }else {
                $('.header-bg').css('height', '');
            }
        }

        if ( $('#couponForm').length != 0){
            $(window).on({'orientationchange': updateBgImage, 'resize': updateBgImage});
            updateBgImage();
        }

        //Android 4.4.2 has problems with box-shadow being applied when element position is fixed
        var android = getAndroidVersion();
        if(android){
            $body.addClass('android');
        }
        if (android && parseFloat(android) <= 4.4) {
            $body.addClass('nativeAndroid');
            $('.header').addClass('no-shadow');
            $('.hamburger-content').addClass('no-shadow');
        }

    },
    scrolling: function () {
        var orient,
            w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (w < 1024) {
            if (screen.width > screen.height) {
                orient = 90;
            } else if (screen.width < screen.height) {
                orient = 0;
            }
        }

        $(".anchor-link").unbind('click').click(function () {
            var scroll = 0;
            var $parent = $(this).parent();
            if ($(this).hasClass("hamburger-link") || $(this).hasClass("howitworks-link") && Chase.mobileMenu.isMenuOpen === true) {
                Chase.mobileMenu.closeMenu();
            }

            if (!$parent.hasClass('clone')) {
                scroll = 70;
            }
            if (orient == 90) {
                scroll = $(".headline-copy").offset().top
            }

            if ($(this).hasClass('howitworks-link')) {
                scroll = $(".steps").offset().top - 50;
            }

            $('html, body').animate({
                scrollTop: scroll
            }, 400);
        });

        $(".footer-note-link").click(function () {
            var scroll = 1000;

            if ($(this).hasClass('note1')) {
                scroll = $("#note1").offset().top - 60;
            } else if ($(this).hasClass('note2')) {
                scroll = $("#note2").offset().top - 60;
            }

            $('html, body').animate({
                scrollTop: scroll
            }, 400);
        });

        $("#email").focus(function () {
            $(".header").removeClass("clone");
        });
    },

    validation: function () {
        if ($("#couponForm").length > 0) {
            var settings = {
                rules: {
                    email: {
                        required: true,
                        emailProper: true
                    }
                },
                messages: {
                    email: {
                        required: "Please input right email address",
                        email: "Please input right email address"
                    }
                },
                onkeyup: false,
                focusInvalid: false,
                onfocusout: false,
                invalidHandler: function () {
                    $(this).find(".placeholder").addClass("placeholder-error");
                }
            };
            $("#couponForm").validate(settings);
            $("#couponForm2").validate(settings);
        }

    },
    animateLogo: function(){
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (w > 768){
            var scrollMagicController = new ScrollMagic();

            text = TweenMax.to('.logo-text', 0.5, {
                width: 0
            });
            logo = TweenMax.to('.logo', 0.5, {
                left: '75px'
            });
            scene = new ScrollScene({
                offset:200,
                duration: 300
            })
                .setTween([text, logo])
                .addTo(scrollMagicController);
        } else {
            if(typeof scene != 'undefined'){
                scene.destroy();
            }
        }
    },
    init: function () {
        this.general();
        this.mobileMenu.setStickyHeader();
        this.mobileMenu.setHamburgerMenu();
        this.scrolling();
        this.validation();
        this.animateLogo();

        //function initializeGoogleMaps() {
        //    var latlng = new google.maps.LatLng(-34.397, 150.644);
        //    var myOptions = {
        //        zoom: 8,
        //        center: latlng,
        //        mapTypeId: google.maps.MapTypeId.ROADMAP
        //    };
        //    var map = new google.maps.Map(document.getElementById("map"),
        //        myOptions);
        //}
        //google.maps.event.addDomListener(window, "load", initialize);
        //initializeGoogleMaps();
    },
    resize: function(){
        this.animateLogo();
    }
};

// for calling resize() only after resize event is finished
function debouncer(func, timeout) {
    var timeoutID, timeout = timeout || 100;
    return function () {
        var scope = this, args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function () {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    }
}
$(document).ready(function(){
    Chase.init();
});
$(window).resize(debouncer(function(){
    Chase.resize();
}));
window.addEventListener("orientationchange", function () {
    Chase.scrolling();
}, false);
