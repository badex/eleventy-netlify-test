!function s(i,n,a){function r(t,e){if(!n[t]){if(!i[t]){var o="function"==typeof require&&require;if(!e&&o)return o(t,!0);if(l)return l(t,!0);throw(e=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",e}o=n[t]={exports:{}},i[t][0].call(o.exports,function(e){return r(i[t][1][e]||e)},o,o.exports,s,i,n,a)}return n[t].exports}for(var l="function"==typeof require&&require,e=0;e<a.length;e++)r(a[e]);return r}({1:[function(e,t,o){var s;s=function(){var l="undefined"!=typeof window?window:this,e=l.Glider=function(e,t){var o=this;if(e._glider)return e._glider;if(o.ele=e,o.ele.classList.add("glider"),(o.ele._glider=o).opt=Object.assign({},{slidesToScroll:1,slidesToShow:1,resizeLock:!0,duration:.5,easing:function(e,t,o,s,i){return s*(t/=i)*t+o}},t),o.animate_id=o.page=o.slide=0,o.arrows={},o._opt=o.opt,o.opt.skipTrack)o.track=o.ele.children[0];else for(o.track=document.createElement("div"),o.ele.appendChild(o.track);1!==o.ele.children.length;)o.track.appendChild(o.ele.children[0]);o.track.classList.add("glider-track"),o.init(),o.resize=o.init.bind(o,!0),o.event(o.ele,"add",{scroll:o.updateControls.bind(o)}),o.event(l,"add",{resize:o.resize})},t=e.prototype;return t.init=function(e,t){var o,s=this,i=0,n=0,a=(s.slides=s.track.children,[].forEach.call(s.slides,function(e,t){e.classList.add("glider-slide"),e.setAttribute("data-gslide",t)}),s.containerWidth=s.ele.clientWidth,s.settingsBreakpoint());t=t||a,"auto"!==s.opt.slidesToShow&&void 0===s.opt._autoSlide||(o=s.containerWidth/s.opt.itemWidth,s.opt._autoSlide=s.opt.slidesToShow=s.opt.exactWidth?o:Math.max(1,Math.floor(o))),"auto"===s.opt.slidesToScroll&&(s.opt.slidesToScroll=Math.floor(s.opt.slidesToShow)),s.itemWidth=s.opt.exactWidth?s.opt.itemWidth:s.containerWidth/s.opt.slidesToShow,[].forEach.call(s.slides,function(e){e.style.height="auto",e.style.width=s.itemWidth+"px",i+=s.itemWidth,n=Math.max(e.offsetHeight,n)}),s.track.style.width=i+"px",s.trackWidth=i,s.isDrag=!1,s.preventClick=!1,s.move=!1,s.opt.resizeLock&&s.scrollTo(s.slide*s.itemWidth,0),(a||t)&&(s.bindArrows(),s.buildDots(),s.bindDrag()),s.updateControls(),s.emit(e?"refresh":"loaded")},t.bindDrag=function(){function e(){t.mouseDown=void 0,t.ele.classList.remove("drag"),t.isDrag&&(t.preventClick=!0),t.isDrag=!1}var t=this;t.mouse=t.mouse||t.handleMouse.bind(t);function o(){t.move=!0}var s={mouseup:e,mouseleave:e,mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.mouseDown=e.clientX,t.ele.classList.add("drag"),t.move=!1,setTimeout(o,300)},touchstart:function(e){t.ele.classList.add("drag"),t.move=!1,setTimeout(o,300)},mousemove:t.mouse,click:function(e){t.preventClick&&t.move&&(e.preventDefault(),e.stopPropagation()),t.preventClick=!1,t.move=!1}};t.ele.classList.toggle("draggable",!0===t.opt.draggable),t.event(t.ele,"remove",s),t.opt.draggable&&t.event(t.ele,"add",s)},t.buildDots=function(){var e=this;if(e.opt.dots){if("string"==typeof e.opt.dots?e.dots=document.querySelector(e.opt.dots):e.dots=e.opt.dots,e.dots){e.dots.innerHTML="",e.dots.setAttribute("role","tablist"),e.dots.classList.add("glider-dots");for(var t=0;t<Math.ceil(e.slides.length/e.opt.slidesToShow);++t){var o=document.createElement("button");o.dataset.index=t,o.setAttribute("aria-label","Page "+(t+1)),o.setAttribute("role","tab"),o.className="glider-dot "+(t?"":"active"),e.event(o,"add",{click:e.scrollItem.bind(e,t,!0)}),e.dots.appendChild(o)}}}else e.dots&&(e.dots.innerHTML="")},t.bindArrows=function(){var o=this;o.opt.arrows?["prev","next"].forEach(function(e){var t=o.opt.arrows[e];(t=t&&("string"==typeof t?document.querySelector(t):t))&&(t._func=t._func||o.scrollItem.bind(o,e),o.event(t,"remove",{click:t._func}),o.event(t,"add",{click:t._func}),o.arrows[e]=t)}):Object.keys(o.arrows).forEach(function(e){e=o.arrows[e];o.event(e,"remove",{click:e._func})})},t.updateControls=function(e){var r=this,t=(e&&!r.opt.scrollPropagate&&e.stopPropagation(),r.containerWidth>=r.trackWidth),l=(r.opt.rewind||(r.arrows.prev&&(r.arrows.prev.classList.toggle("disabled",r.ele.scrollLeft<=0||t),r.arrows.prev.setAttribute("aria-disabled",r.arrows.prev.classList.contains("disabled"))),r.arrows.next&&(r.arrows.next.classList.toggle("disabled",Math.ceil(r.ele.scrollLeft+r.containerWidth)>=Math.floor(r.trackWidth)||t),r.arrows.next.setAttribute("aria-disabled",r.arrows.next.classList.contains("disabled")))),r.slide=Math.round(r.ele.scrollLeft/r.itemWidth),r.page=Math.round(r.ele.scrollLeft/r.containerWidth),r.slide+Math.floor(Math.floor(r.opt.slidesToShow)/2)),c=Math.floor(r.opt.slidesToShow)%2?0:l+1;1===Math.floor(r.opt.slidesToShow)&&(c=0),r.ele.scrollLeft+r.containerWidth>=Math.floor(r.trackWidth)&&(r.page=r.dots?r.dots.children.length-1:0),[].forEach.call(r.slides,function(e,t){var o=e.classList,e=o.contains("visible"),s=r.ele.scrollLeft,i=r.ele.scrollLeft+r.containerWidth,n=r.itemWidth*t,a=n+r.itemWidth,n=([].forEach.call(o,function(e){/^left|right/.test(e)&&o.remove(e)}),o.toggle("active",r.slide===t),l===t||c&&c===t?o.add("center"):(o.remove("center"),o.add([t<l?"left":"right",Math.abs(t-(!(t<l)&&c||l))].join("-"))),Math.ceil(n)>=Math.floor(s)&&Math.floor(a)<=Math.ceil(i));o.toggle("visible",n),n!==e&&r.emit("slide-"+(n?"visible":"hidden"),{slide:t})}),r.dots&&[].forEach.call(r.dots.children,function(e,t){e.classList.toggle("active",r.page===t)}),e&&r.opt.scrollLock&&(clearTimeout(r.scrollLock),r.scrollLock=setTimeout(function(){clearTimeout(r.scrollLock),.02<Math.abs(r.ele.scrollLeft/r.itemWidth-r.slide)&&(r.mouseDown||r.trackWidth>r.containerWidth+r.ele.scrollLeft&&r.scrollItem(r.getCurrentSlide()))},r.opt.scrollLockDelay||250))},t.getCurrentSlide=function(){return this.round(this.ele.scrollLeft/this.itemWidth)},t.scrollItem=function(e,t,o){o&&o.preventDefault();var s,i=this,n=e,o=(++i.animate_id,i.slide),a=!0===t?(e=Math.round(e*i.containerWidth/i.itemWidth))*i.itemWidth:("string"==typeof e&&(a="prev"===e,e=i.opt.slidesToScroll%1||i.opt.slidesToShow%1?i.getCurrentSlide():i.slide,a?e-=i.opt.slidesToScroll:e+=i.opt.slidesToScroll,i.opt.rewind)&&(s=i.ele.scrollLeft,e=a&&!s?i.slides.length:!a&&s+i.containerWidth>=Math.floor(i.trackWidth)?0:e),e=Math.max(Math.min(e,i.slides.length),0),i.slide=e,i.itemWidth*e);return i.emit("scroll-item",{prevSlide:o,slide:e}),i.scrollTo(a,i.opt.duration*Math.abs(i.ele.scrollLeft-a),function(){i.updateControls(),i.emit("animated",{value:n,type:"string"==typeof n?"arrow":t?"dot":"slide"})}),!1},t.settingsBreakpoint=function(){var e=this,t=e._opt.responsive;if(t){t.sort(function(e,t){return t.breakpoint-e.breakpoint});for(var o=0;o<t.length;++o){var s=t[o];if(l.innerWidth>=s.breakpoint)return e.breakpoint!==s.breakpoint&&(e.opt=Object.assign({},e._opt,s.settings),e.breakpoint=s.breakpoint,!0)}}var i=0!==e.breakpoint;return e.opt=Object.assign({},e._opt),e.breakpoint=0,i},t.scrollTo=function(t,o,s){var i=this,n=(new Date).getTime(),a=i.animate_id,r=function(){var e=(new Date).getTime()-n;i.ele.scrollLeft=i.ele.scrollLeft+(t-i.ele.scrollLeft)*i.opt.easing(0,e,0,1,o),e<o&&a===i.animate_id?l.requestAnimationFrame(r):(i.ele.scrollLeft=t,s&&s.call(i))};l.requestAnimationFrame(r)},t.removeItem=function(e){var t=this;t.slides.length&&(t.track.removeChild(t.slides[e]),t.refresh(!0),t.emit("remove"))},t.addItem=function(e){this.track.appendChild(e),this.refresh(!0),this.emit("add")},t.handleMouse=function(e){var t=this;t.mouseDown&&(t.isDrag=!0,t.ele.scrollLeft+=(t.mouseDown-e.clientX)*(t.opt.dragVelocity||3.3),t.mouseDown=e.clientX)},t.round=function(e){var t=1/(this.opt.slidesToScroll%1||1);return Math.round(e*t)/t},t.refresh=function(e){this.init(!0,e)},t.setOption=function(t,e){var o=this;o.breakpoint&&!e?o._opt.responsive.forEach(function(e){e.breakpoint===o.breakpoint&&(e.settings=Object.assign({},e.settings,t))}):o._opt=Object.assign({},o._opt,t),o.breakpoint=0,o.settingsBreakpoint()},t.destroy=function(){function e(t){t.removeAttribute("style"),[].forEach.call(t.classList,function(e){/^glider/.test(e)&&t.classList.remove(e)})}var t=this,o=t.ele.cloneNode(!0);t.opt.skipTrack||(o.children[0].outerHTML=o.children[0].innerHTML),e(o),[].forEach.call(o.getElementsByTagName("*"),e),t.ele.parentNode.replaceChild(o,t.ele),t.event(l,"remove",{resize:t.resize}),t.emit("destroy")},t.emit=function(e,t){e=new l.CustomEvent("glider-"+e,{bubbles:!this.opt.eventPropagate,detail:t});this.ele.dispatchEvent(e)},t.event=function(e,t,o){var s=e[t+"EventListener"].bind(e);Object.keys(o).forEach(function(e){s(e,o[e])})},e},"function"==typeof define&&define.amd?define(s):"object"==typeof o?t.exports=s():s()},{}],2:[function(e,t,o){document.getElementById("formContact").addEventListener("submit",e=>{e.preventDefault();const t=e.target;e=new FormData(t);const o=document.querySelector(".contact-submit-message");fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(e).toString()}).then(()=>console.log("Form successfully submitted")).then(()=>{t.reset(),o.innerHTML="<p>Thank you for your message. I'll get back to you as soon as possible.</p>",o.classList.add("contact-submit-message--reveal")}).catch(e=>{o.innerHTML="<p>Sorry, there was a problem submitting your message. Please try again.</p>",o.classList.add("contact-submit-message--reveal"),console.log(e)})})},{}],3:[function(e,t,o){new Glider(document.querySelector(".glider"),{slidesToShow:1,slidesToScroll:1,draggable:!0,scrollLock:!0,dots:"#dots",arrows:{prev:".glider-prev",next:".glider-next"},responsive:[{breakpoint:944,settings:{slidesToShow:2,slidesToScroll:2}}]})},{}],4:[function(n,e,t){!function(i){!function(){var e=n("./scripts"),t=n("glider-js"),o=n("./gliderInit"),s=n("./form");i.window.myScripts=e,i.window.glider=t,i.window.gliderInit=o,i.window.form=s}.call(this)}.call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./form":2,"./gliderInit":3,"./scripts":5,"glider-js":1}],5:[function(require,module,exports){document.addEventListener("DOMContentLoaded",_=>{const log=console.log,sections=document.querySelectorAll("section"),pageNav=document.getElementById("pageNav"),navList=document.getElementById("pageNavList"),dotNav=document.getElementById("dotNav"),menuToggle=document.getElementById("menuToggle"),mainEle=document.getElementById("main"),throttleDelay=250;let throttled=!1;const sectionsOptions={root:document,threshold:0,rootMargin:"-50% 0px"},setHeight=(e,t,o="px")=>{e.style.height=""+t+o},getEleHeight=e=>e.offsetHeight,getMenuHeight=e=>getEleHeight(pageNav);function getRootVerticalOffset(e){var t=getMenuHeight();return window.innerHeight-t}let rootVerticalOffset=getRootVerticalOffset(),mainObserverCount=1,mainObserverOptions={root:document,threshold:0,rootMargin:`0px 0px -${rootVerticalOffset}px 0px`},currentID,linkItem1,linkItem2,listItem1,listItem2;const getLinkItem=e=>document.querySelector(`#${e.id} a[href="#${currentID}"]`),getListItem=e=>e.closest("li"),sectionsObserver=new IntersectionObserver((e,t)=>{e.forEach(e=>{currentID=e.target.id,linkItem1=getLinkItem(pageNav),linkItem2=getLinkItem(dotNav),listItem1=getListItem(linkItem1),listItem2=getListItem(linkItem2),!1===e.isIntersecting&&listItem1.classList.contains("page-nav__item--current")?(listItem1.classList.remove("page-nav__item--current"),listItem2.classList.remove("dot-nav__item--current")):!0!==e.isIntersecting||listItem1.classList.contains("page-nav__item--current")||(rootVerticalOffset=getRootVerticalOffset(),listItem1.classList.add("page-nav__item--current"),listItem2.classList.add("dot-nav__item--current"))})},sectionsOptions),setMainObserver=(sections.forEach(e=>{sectionsObserver.observe(e)}),window.addEventListener("resize",e=>{var t;!1===throttled&&(t=getRootVerticalOffset(),mainObserverOptions.rootMargin=`0px 0px -${t}px 0px`,stopMainObserver("mainObserver"+mainObserverCount),t="mainObserver"+ ++mainObserverCount,t=setMainObserver(),startMainObserver(t),throttled=!0,setTimeout(function(){throttled=!1},throttleDelay))}),()=>(mainObserverName="mainObserver"+mainObserverCount,window["mainObserver"+mainObserverCount]=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(pageNav.classList.remove("page-nav--large"),pageNav.classList.add("page-nav--small")):(pageNav.classList.remove("page-nav--small"),pageNav.classList.add("page-nav--large"))})},mainObserverOptions))),startMainObserver=_=>{const observer=eval("mainObserver"+mainObserverCount);observer.observe(mainEle)},stopMainObserver=observerName=>{const observer=eval(observerName);observer.unobserve(mainEle)},calendlyContainer=(setMainObserver(),startMainObserver(),document.querySelector(".calendly-inline-widget")),insertedNodes=[];let calendlyObserver=new MutationObserver(function(e){e.forEach(function(e){for(var t,o=0;o<e.addedNodes.length;o++)insertedNodes.push(e.addedNodes[o]);insertedNodes[o]instanceof HTMLIFrameElement&&(console.log("Iframe Observed"),(t=calendlyContainer.querySelector("iframe")).setAttribute("title","Select a Date & Time - Calendly"),t.setAttribute("scrolling","no"),t.setAttribute("width","100%"))})});calendlyObserver.observe(calendlyContainer,{childList:!0,subtree:!1});const btnFormSubmit=document.querySelector('.form-contact button[type="submit"]'),effectClass="ripple",animationHandler=function(e,t){var o=e.offsetX,e=e.offsetY,s=btnFormSubmit.offsetWidth;t.style.setProperty("--pseudo-height",s+"px"),t.style.setProperty("--xpos",o+"px"),t.style.setProperty("--ypos",e+"px")},openMenu=(btnFormSubmit.addEventListener("click",function(e){animationHandler(e,btnFormSubmit),btnFormSubmit.classList.add(effectClass)}),btnFormSubmit.addEventListener("animationend",function(e){btnFormSubmit.classList.remove(effectClass)}),e=>{log("openMenu"),pageNav.classList.remove("page-nav--list-off-page"),pageNav.classList.remove("page-nav--closed"),pageNav.classList.add("page-nav--open"),menuToggle.setAttribute("aria-expanded","true")}),closeMenu=e=>{pageNav.classList.remove("page-nav--open"),pageNav.classList.add("page-nav--closing")},isMenuOpen=e=>pageNav.classList.contains("page-nav--open"),isMenuClosing=e=>pageNav.classList.contains("page-nav--closing"),isMenuClosed=e=>pageNav.classList.contains("page-nav--closed"),isPageNavInFocus=e=>pageNavList.contains(document.activeElement),isMenuListOffPage=e=>pageNav.classList.contains("page-nav--list-off-page"),resetMenu=(document.addEventListener("click",function(e){e=e.target;isMenuOpen()&&null===e.closest(".page-nav__list")&&closeMenu()}),menuToggle.addEventListener("click",function(e){e.stopPropagation();e=e.target;menuToggle===e.closest("#menuToggle")&&isMenuClosing()&&pageNav.classList.remove("page-nav--closing"),menuToggle===e.closest("#menuToggle")&&(isMenuOpen()?closeMenu:openMenu)()}),pageNavList.addEventListener("focusin",function(e){e.stopPropagation(),isMenuClosed()&&openMenu()}),document.addEventListener("keyup",function(e){"Tab"!==e.key||isPageNavInFocus()||isMenuOpen()&&closeMenu()}),document.addEventListener("keydown",function(e){"Escape"===e.key&&isPageNavInFocus()&&isMenuOpen()&&(closeMenu(),menuToggle.focus())}),navList.addEventListener("transitionend",function(e){e.target===navList&&!1===isMenuOpen()&&(pageNav.classList.remove("page-nav--closing"),pageNav.classList.add("page-nav--closed"),pageNav.classList.add("page-nav--list-off-page"),menuToggle.setAttribute("aria-expanded","false"))}),e=>{e.matches&&!isMenuOpen()?(pageNav.classList.add("page-nav--list-off-page"),pageNav.classList.add("page-nav--closed")):(isMenuOpen()||pageNav.classList.add("page-nav--list-off-page"),isMenuOpen()&&pageNav.classList.remove("page-nav--open"),isMenuClosed()&&pageNav.classList.remove("page-nav--closed"),isMenuListOffPage()&&pageNav.classList.remove("page-nav--list-off-page"),isMenuClosing()&&pageNav.classList.remove("page-nav--closing"))}),menuBreakPoint=window.matchMedia("(max-width: 767px)");resetMenu(menuBreakPoint);try{menuBreakPoint.addEventListener("change",resetMenu)}catch(e1){try{log(e1,"Trying addListener instead of addEventListener."),menuBreakPoint.addListener(resetMenu)}catch(e2){log(e2)}}})},{}]},{},[4]);