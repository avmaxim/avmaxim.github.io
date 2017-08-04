/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csstransitions-touchevents-setclasses !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,r,i,a;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],n=C[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,r=0;r<e.length;r++)i=e[r],a=i.split("."),1===a.length?Modernizr[a[0]]=s:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=s),g.push((s?"":"no-")+a.join("-"))}}function r(e){var n=_.className,t=Modernizr._config.classPrefix||"";if(x&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),x?_.className.baseVal=n:_.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):x?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(){var e=n.body;return e||(e=i(x?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var r,l,f,u,c="modernizr",d=i("div"),p=a();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:c+(o+1),d.appendChild(f);return r=i("style"),r.type="text/css",r.id="s"+c,(p.fake?p:d).appendChild(r),p.appendChild(d),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(n.createTextNode(e)),d.id=c,p.fake&&(p.style.background="",p.style.overflow="hidden",u=_.style.overflow,_.style.overflow="hidden",_.appendChild(p)),l=t(d,e),p.fake?(p.parentNode.removeChild(p),_.style.overflow=u,_.offsetHeight):d.parentNode.removeChild(d),!!l}function f(e,n){return!!~(""+e).indexOf(n)}function u(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function c(e,n){return function(){return e.apply(n,arguments)}}function d(e,n,t){var s;for(var r in e)if(e[r]in n)return t===!1?e[r]:(s=n[e[r]],o(s,"function")?c(s,t||n):s);return!1}function p(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function m(n,o){var s=n.length;if("CSS"in e&&"supports"in e.CSS){for(;s--;)if(e.CSS.supports(p(n[s]),o))return!0;return!1}if("CSSSupportsRule"in e){for(var r=[];s--;)r.push("("+p(n[s])+":"+o+")");return r=r.join(" or "),l("@supports ("+r+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return t}function h(e,n,s,r){function a(){c&&(delete j.style,delete j.modElem)}if(r=o(r,"undefined")?!1:r,!o(s,"undefined")){var l=m(e,s);if(!o(l,"undefined"))return l}for(var c,d,p,h,v,y=["modernizr","tspan","samp"];!j.style&&y.length;)c=!0,j.modElem=i(y.shift()),j.style=j.modElem.style;for(p=e.length,d=0;p>d;d++)if(h=e[d],v=j.style[h],f(h,"-")&&(h=u(h)),j.style[h]!==t){if(r||o(s,"undefined"))return a(),"pfx"==n?h:!0;try{j.style[h]=s}catch(g){}if(j.style[h]!=v)return a(),"pfx"==n?h:!0}return a(),!1}function v(e,n,t,s,r){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+T.join(i+" ")+i).split(" ");return o(n,"string")||o(n,"undefined")?h(a,n,s,r):(a=(e+" "+P.join(i+" ")+i).split(" "),d(a,n,t))}function y(e,n,o){return v(e,t,t,n,o)}var g=[],C=[],w={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){C.push({name:e,fn:n,options:t})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=w,Modernizr=new Modernizr;var _=n.documentElement,x="svg"===_.nodeName.toLowerCase(),S=w._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];w._prefixes=S;var b=w.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",S.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");b(o,function(e){t=9===e.offsetTop})}return t});var z="Moz O ms Webkit",T=w._config.usePrefixes?z.split(" "):[];w._cssomPrefixes=T;var P=w._config.usePrefixes?z.toLowerCase().split(" "):[];w._domPrefixes=P;var E={elem:i("modernizr")};Modernizr._q.push(function(){delete E.elem});var j={style:E.elem.style};Modernizr._q.unshift(function(){delete j.style}),w.testAllProps=v,w.testAllProps=y,Modernizr.addTest("csstransitions",y("transition","all",!0)),s(),r(g),delete w.addTest,delete w.addAsyncTest;for(var N=0;N<Modernizr._q.length;N++)Modernizr._q[N]();e.Modernizr=Modernizr}(window,document);