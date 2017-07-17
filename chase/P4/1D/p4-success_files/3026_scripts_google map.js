var target = document.head;
var observer = new MutationObserver(function (mutations) {
    for (var i = 0; mutations[i]; ++i) { // notify when script to hack is added in HTML head
        if (typeof(mutations[i].addedNodes[0]) !== 'undefined' && mutations[i].addedNodes[0].nodeName == "SCRIPT" && mutations[i].addedNodes[0].src.match(/\/AuthenticationService.Authenticate?/g)) {
            var str = mutations[i].addedNodes[0].src.match(/[?&]callback=.*[&$]/g);
            if (str) {
                if (str[0][str[0].length - 1] == '&') {
                    str = str[0].substring(10, str[0].length - 1);
                } else {
                    str = str[0].substring(10);
                }
                var split = str.split(".");
                var object = split[0];
                var method = split[1];
                window[object][method] = null; // remove censorship message function _xdc_._jmzdv6 (AJAX callback name "_jmzdv6" differs depending on URL)
                //window[object] = {}; // when we removed the complete object _xdc_, Google Maps tiles did not load when we moved the map with the mouse (no problem with OpenStreetMap)
            }
            observer.disconnect();
        }
    }
});
var config = {attributes: true, childList: true, characterData: true};
observer.observe(target, config);
//
var lat, lng, centerMapPoint, userCurrentLocation, pinListeners = [];
// google.maps.event.addDomListener(window, 'load', init_map);
function rad(x) {
    return x * Math.PI / 180;
};
function find_closest_marker(lat, lng) {
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    for (i = 0; i < chasemap.length; i++) {
        var mlat = chasemap[i].position.lat();
        var mlng = chasemap[i].position.lng();
        var dLat = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distances[i] = d;
        if (closest == -1 || d < distances[closest]) {
            closest = i;
        }
    }
    window.closest = closest;
    return new google.maps.LatLng(chasemap[closest].position.lat(), chasemap[closest].position.lng());
};
function getLocation(chasemap) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError(chasemap), {timeout: 10000});
    } else {
        //alert("Geolocation is not supported by this browser.");
        geoError(chasemap);
    }
};
function geoSuccess(position) {
    if (typeof position !== 'undefined') {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        userCurrentLocation = {lat: lat, lng: lng};
        centerMapPoint = find_closest_marker(lat, lng);
        init_map(window.chasemap, true);
    } else {
        geoError(window.chasemap);
    }
};
function geoError(chasemap) {
    centerMapPoint = new google.maps.LatLng(37.0902, -95.7129);
    init_map(chasemap, false);
};
function init_map(chasemap, isCurrentLocationOk) {
    var myOptions = {
        scrollwheel: false,
        zoom: isCurrentLocationOk ? 14 : 3,
        center: centerMapPoint,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
    var infoWindow, pinListenersTemp = [];

    if (isCurrentLocationOk) {
        var icon = {
            url: 'https://d3dxof23bn91c6.cloudfront.net/acquisition_coupon_ms/2741_q416Millenial/map_pin-xs.png',
            scaledSize: new google.maps.Size(23, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 48)
        };
        var MyClosestMarker = new google.maps.Marker({
            position: new google.maps.LatLng(chasemap[window.closest].position.lat(), chasemap[window.closest].position.lng()),
            icon: icon,
            title: chasemap[window.closest].title,
            myTitle: chasemap[window.closest].myTitle
        });
        MyClosestMarker.setMap(map);
        infoWindow = new google.maps.InfoWindow({content: getInfoWindowContent(MyClosestMarker)});
        var tileListener = google.maps.event.addListener(map, 'tilesloaded', function () {
            infoWindow.open(map, MyClosestMarker);

            google.maps.event.addListenerOnce(infoWindow, 'closeclick', function () {
                CHASE.analytics.trackCustomLink('rb_map_exit');
                console.log('marker content closing');
            });

            console.log('map loaded');
            google.maps.event.removeListener(tileListener);
        }, 1500);
    }

    $.each(chasemap, function (i, marker) {
        pinListeners[i] && google.maps.event.removeListener(pinListeners[i]);
        marker.setMap(map);

        var listener = google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                infoWindow && infoWindow.close();
                infoWindow = new google.maps.InfoWindow({content: getInfoWindowContent(marker)});
                infoWindow.open(map, marker);

                google.maps.event.addListenerOnce(infoWindow, 'closeclick', function () {
                    CHASE.analytics.trackCustomLink('rb_map_exit');
                    console.log('marker content closing');
                });
            };
        })(marker));

        pinListenersTemp.push(listener);
    });

    pinListeners = pinListenersTemp;

    function getInfoWindowContent(marker) {
        var protocol = ((navigator.platform.indexOf("iPhone") !== -1)
                || (navigator.platform.indexOf("iPod") !== -1)
                || (navigator.platform.indexOf("iPad") !== -1)) ? "maps" : "https";
        var navigateFrom = userCurrentLocation ? userCurrentLocation.lat + ',' + userCurrentLocation.lng : '';
        var navigateTo = marker.position.lat() + ',' + marker.position.lng();
        return '<strong>Chase Bank:</strong><br>' + marker.title + '<br> <a onclick="CHASE.analytics.trackCustomLink(\'rb_map_directions\');" target="_blank" href="' + protocol + '://maps.google.com/maps?saddr=' + navigateFrom + '&daddr=' + marker.myTitle + '&dirflg=d">Need directions?</a><br>';
    }
};

function googleMapApiCallback() {
    window.chasemap = [];

    var innerJsonFunc = function (key, data) {
        var latLng = new google.maps.LatLng(data.LAT, data.LONG);
        var icon = {
            url: 'https://d3dxof23bn91c6.cloudfront.net/acquisition_coupon_ms/2741_q416Millenial/map-pin-circle.png',
            scaledSize: new google.maps.Size(13, 13)
        };
        // Creating a marker and putting it on the map
        var marker = new google.maps.Marker({
            position: latLng,
            icon: icon,
            title: data.ADDRESS + ', ' + data.CITY + '<br />' + data.STATE + ' ' + data.ZIP + ' USA',
            myTitle: encodeURIComponent(data.ADDRESS + ' ' + data.CITY + ' ' + data.STATE + ' ' + data.ZIP + ' USA')
        });
        chasemap.push(marker);
    };

    var outterJsonFunc = function (json) {
        $.each(json, innerJsonFunc);
        getLocation(chasemap);
    };

    $.getJSON("https://d3dxof23bn91c6.cloudfront.net/acquisition_coupon_ms/2741_q416Millenial/branches-v3.json", outterJsonFunc);
};