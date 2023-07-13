(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* @preserve
    _____ __ _     __                _
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/

  Version: 1.7.4
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018

*/

/* global define */

(function (factory) {
  typeof define === 'function' && define.amd
    ? define(factory)
    : typeof exports === 'object'
      ? (module.exports = factory())
      : factory()
})(function () {
  ('use strict') // eslint-disable-line no-unused-expressions

  /* globals window:true */
  var _window = typeof window !== 'undefined' ? window : this

  var Glider = (_window.Glider = function (element, settings) {
    var _ = this

    if (element._glider) return element._glider

    _.ele = element
    _.ele.classList.add('glider')

    // expose glider object to its DOM element
    _.ele._glider = _

    // merge user setting with defaults
    _.opt = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesToShow: 1,
        resizeLock: true,
        duration: 0.5,
        // easeInQuad
        easing: function (x, t, b, c, d) {
          return c * (t /= d) * t + b
        }
      },
      settings
    )

    // set defaults
    _.animate_id = _.page = _.slide = 0
    _.arrows = {}

    // preserve original options to
    // extend breakpoint settings
    _._opt = _.opt

    if (_.opt.skipTrack) {
      // first and only child is the track
      _.track = _.ele.children[0]
    } else {
      // create track and wrap slides
      _.track = document.createElement('div')
      _.ele.appendChild(_.track)
      while (_.ele.children.length !== 1) {
        _.track.appendChild(_.ele.children[0])
      }
    }

    _.track.classList.add('glider-track')

    // start glider
    _.init()

    // set events
    _.resize = _.init.bind(_, true)
    _.event(_.ele, 'add', {
      scroll: _.updateControls.bind(_)
    })
    _.event(_window, 'add', {
      resize: _.resize
    })
  })

  var gliderPrototype = Glider.prototype
  gliderPrototype.init = function (refresh, paging) {
    var _ = this

    var width = 0

    var height = 0

    _.slides = _.track.children;

    [].forEach.call(_.slides, function (_, i) {
      _.classList.add('glider-slide')
      _.setAttribute('data-gslide', i)
    })

    _.containerWidth = _.ele.clientWidth

    var breakpointChanged = _.settingsBreakpoint()
    if (!paging) paging = breakpointChanged

    if (
      _.opt.slidesToShow === 'auto' ||
      typeof _.opt._autoSlide !== 'undefined'
    ) {
      var slideCount = _.containerWidth / _.opt.itemWidth

      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth
        ? slideCount
        : Math.max(1, Math.floor(slideCount))
    }
    if (_.opt.slidesToScroll === 'auto') {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow)
    }

    _.itemWidth = _.opt.exactWidth
      ? _.opt.itemWidth
      : _.containerWidth / _.opt.slidesToShow;

    // set slide dimensions
    [].forEach.call(_.slides, function (__) {
      __.style.height = 'auto'
      __.style.width = _.itemWidth + 'px'
      width += _.itemWidth
      height = Math.max(__.offsetHeight, height)
    })

    _.track.style.width = width + 'px'
    _.trackWidth = width
    _.isDrag = false
    _.preventClick = false
    _.move = false

    _.opt.resizeLock && _.scrollTo(_.slide * _.itemWidth, 0)

    if (breakpointChanged || paging) {
      _.bindArrows()
      _.buildDots()
      _.bindDrag()
    }

    _.updateControls()

    _.emit(refresh ? 'refresh' : 'loaded')
  }

  gliderPrototype.bindDrag = function () {
    var _ = this
    _.mouse = _.mouse || _.handleMouse.bind(_)

    var mouseup = function () {
      _.mouseDown = undefined
      _.ele.classList.remove('drag')
      if (_.isDrag) {
        _.preventClick = true
      }
      _.isDrag = false
    }

    const move = function () {
      _.move = true
    }

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function (e) {
        e.preventDefault()
        e.stopPropagation()
        _.mouseDown = e.clientX
        _.ele.classList.add('drag')
        _.move = false
        setTimeout(move, 300)
      },
      touchstart: function (e) {
        _.ele.classList.add('drag')
        _.move = false
        setTimeout(move, 300)
      },
      mousemove: _.mouse,
      click: function (e) {
        if (_.preventClick && _.move) {
          e.preventDefault()
          e.stopPropagation()
        }
        _.preventClick = false
        _.move = false
      }
    }

    _.ele.classList.toggle('draggable', _.opt.draggable === true)
    _.event(_.ele, 'remove', events)
    if (_.opt.draggable) _.event(_.ele, 'add', events)
  }

  gliderPrototype.buildDots = function () {
    var _ = this

    if (!_.opt.dots) {
      if (_.dots) _.dots.innerHTML = ''
      return
    }

    if (typeof _.opt.dots === 'string') {
      _.dots = document.querySelector(_.opt.dots)
    } else _.dots = _.opt.dots
    if (!_.dots) return

    _.dots.innerHTML = ''
    _.dots.setAttribute('role', 'tablist')
    _.dots.classList.add('glider-dots')

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i) {
      var dot = document.createElement('button')
      dot.dataset.index = i
      dot.setAttribute('aria-label', 'Page ' + (i + 1))
      dot.setAttribute('role', 'tab')
      dot.className = 'glider-dot ' + (i ? '' : 'active')
      _.event(dot, 'add', {
        click: _.scrollItem.bind(_, i, true)
      })
      _.dots.appendChild(dot)
    }
  }

  gliderPrototype.bindArrows = function () {
    var _ = this
    if (!_.opt.arrows) {
      Object.keys(_.arrows).forEach(function (direction) {
        var element = _.arrows[direction]
        _.event(element, 'remove', { click: element._func })
      })
      return
    }
    ['prev', 'next'].forEach(function (direction) {
      var arrow = _.opt.arrows[direction]
      if (arrow) {
        if (typeof arrow === 'string') arrow = document.querySelector(arrow)
        if (arrow) {
          arrow._func = arrow._func || _.scrollItem.bind(_, direction)
          _.event(arrow, 'remove', {
            click: arrow._func
          })
          _.event(arrow, 'add', {
            click: arrow._func
          })
          _.arrows[direction] = arrow
        }
      }
    })
  }

  gliderPrototype.updateControls = function (event) {
    var _ = this

    if (event && !_.opt.scrollPropagate) {
      event.stopPropagation()
    }

    var disableArrows = _.containerWidth >= _.trackWidth

    if (!_.opt.rewind) {
      if (_.arrows.prev) {
        _.arrows.prev.classList.toggle(
          'disabled',
          _.ele.scrollLeft <= 0 || disableArrows
        )

        _.arrows.prev.setAttribute(
          'aria-disabled',
          _.arrows.prev.classList.contains('disabled')
        )
      }
      if (_.arrows.next) {
        _.arrows.next.classList.toggle(
          'disabled',
          Math.ceil(_.ele.scrollLeft + _.containerWidth) >=
            Math.floor(_.trackWidth) || disableArrows
        )

        _.arrows.next.setAttribute(
          'aria-disabled',
          _.arrows.next.classList.contains('disabled')
        )
      }
    }

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth)
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth)

    var middle = _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2)

    var extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1
    if (Math.floor(_.opt.slidesToShow) === 1) {
      extraMiddle = 0
    }

    // the last page may be less than one half of a normal page width so
    // the page is rounded down. when at the end, force the page to turn
    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)) {
      _.page = _.dots ? _.dots.children.length - 1 : 0
    }

    [].forEach.call(_.slides, function (slide, index) {
      var slideClasses = slide.classList

      var wasVisible = slideClasses.contains('visible')

      var start = _.ele.scrollLeft

      var end = _.ele.scrollLeft + _.containerWidth

      var itemStart = _.itemWidth * index

      var itemEnd = itemStart + _.itemWidth;

      [].forEach.call(slideClasses, function (className) {
        /^left|right/.test(className) && slideClasses.remove(className)
      })
      slideClasses.toggle('active', _.slide === index)
      if (middle === index || (extraMiddle && extraMiddle === index)) {
        slideClasses.add('center')
      } else {
        slideClasses.remove('center')
        slideClasses.add(
          [
            index < middle ? 'left' : 'right',
            Math.abs(index - (index < middle ? middle : extraMiddle || middle))
          ].join('-')
        )
      }

      var isVisible =
        Math.ceil(itemStart) >= Math.floor(start) &&
        Math.floor(itemEnd) <= Math.ceil(end)
      slideClasses.toggle('visible', isVisible)
      if (isVisible !== wasVisible) {
        _.emit('slide-' + (isVisible ? 'visible' : 'hidden'), {
          slide: index
        })
      }
    })
    if (_.dots) {
      [].forEach.call(_.dots.children, function (dot, index) {
        dot.classList.toggle('active', _.page === index)
      })
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock)
      _.scrollLock = setTimeout(function () {
        clearTimeout(_.scrollLock)
        // dont attempt to scroll less than a pixel fraction - causes looping
        if (Math.abs(_.ele.scrollLeft / _.itemWidth - _.slide) > 0.02) {
          if (!_.mouseDown) {
            // Only scroll if not at the end (#94)
            if (_.trackWidth > _.containerWidth + _.ele.scrollLeft) {
              _.scrollItem(_.getCurrentSlide())
            }
          }
        }
      }, _.opt.scrollLockDelay || 250)
    }
  }

  gliderPrototype.getCurrentSlide = function () {
    var _ = this
    return _.round(_.ele.scrollLeft / _.itemWidth)
  }

  gliderPrototype.scrollItem = function (slide, dot, e) {
    if (e) e.preventDefault()

    var _ = this

    var originalSlide = slide
    ++_.animate_id

    var prevSlide = _.slide
    var position

    if (dot === true) {
      slide = Math.round((slide * _.containerWidth) / _.itemWidth)
      position = slide * _.itemWidth
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev'

        // use precise location if fractional slides are on
        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1) {
          slide = _.getCurrentSlide()
        } else {
          slide = _.slide
        }

        if (backwards) slide -= _.opt.slidesToScroll
        else slide += _.opt.slidesToScroll

        if (_.opt.rewind) {
          var scrollLeft = _.ele.scrollLeft
          slide =
            backwards && !scrollLeft
              ? _.slides.length
              : !backwards &&
                scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)
                ? 0
                : slide
        }
      }

      slide = Math.max(Math.min(slide, _.slides.length), 0)

      _.slide = slide
      position = _.itemWidth * slide
    }

    _.emit('scroll-item', { prevSlide, slide })

    _.scrollTo(
      position,
      _.opt.duration * Math.abs(_.ele.scrollLeft - position),
      function () {
        _.updateControls()
        _.emit('animated', {
          value: originalSlide,
          type:
            typeof originalSlide === 'string' ? 'arrow' : dot ? 'dot' : 'slide'
        })
      }
    )

    return false
  }

  gliderPrototype.settingsBreakpoint = function () {
    var _ = this

    var resp = _._opt.responsive

    if (resp) {
      // Sort the breakpoints in mobile first order
      resp.sort(function (a, b) {
        return b.breakpoint - a.breakpoint
      })

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i]
        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = Object.assign({}, _._opt, size.settings)
            _.breakpoint = size.breakpoint
            return true
          }
          return false
        }
      }
    }
    // set back to defaults in case they were overriden
    var breakpointChanged = _.breakpoint !== 0
    _.opt = Object.assign({}, _._opt)
    _.breakpoint = 0
    return breakpointChanged
  }

  gliderPrototype.scrollTo = function (scrollTarget, scrollDuration, callback) {
    var _ = this

    var start = new Date().getTime()

    var animateIndex = _.animate_id

    var animate = function () {
      var now = new Date().getTime() - start
      _.ele.scrollLeft =
        _.ele.scrollLeft +
        (scrollTarget - _.ele.scrollLeft) *
          _.opt.easing(0, now, 0, 1, scrollDuration)
      if (now < scrollDuration && animateIndex === _.animate_id) {
        _window.requestAnimationFrame(animate)
      } else {
        _.ele.scrollLeft = scrollTarget
        callback && callback.call(_)
      }
    }

    _window.requestAnimationFrame(animate)
  }

  gliderPrototype.removeItem = function (index) {
    var _ = this

    if (_.slides.length) {
      _.track.removeChild(_.slides[index])
      _.refresh(true)
      _.emit('remove')
    }
  }

  gliderPrototype.addItem = function (ele) {
    var _ = this

    _.track.appendChild(ele)
    _.refresh(true)
    _.emit('add')
  }

  gliderPrototype.handleMouse = function (e) {
    var _ = this
    if (_.mouseDown) {
      _.isDrag = true
      _.ele.scrollLeft +=
        (_.mouseDown - e.clientX) * (_.opt.dragVelocity || 3.3)
      _.mouseDown = e.clientX
    }
  }

  // used to round to the nearest 0.XX fraction
  gliderPrototype.round = function (double) {
    var _ = this
    var step = _.opt.slidesToScroll % 1 || 1
    var inv = 1.0 / step
    return Math.round(double * inv) / inv
  }

  gliderPrototype.refresh = function (paging) {
    var _ = this
    _.init(true, paging)
  }

  gliderPrototype.setOption = function (opt, global) {
    var _ = this

    if (_.breakpoint && !global) {
      _._opt.responsive.forEach(function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = Object.assign({}, v.settings, opt)
        }
      })
    } else {
      _._opt = Object.assign({}, _._opt, opt)
    }

    _.breakpoint = 0
    _.settingsBreakpoint()
  }

  gliderPrototype.destroy = function () {
    var _ = this

    var replace = _.ele.cloneNode(true)

    var clear = function (ele) {
      ele.removeAttribute('style');
      [].forEach.call(ele.classList, function (className) {
        /^glider/.test(className) && ele.classList.remove(className)
      })
    }
    // remove track if it was created by glider
    if (!_.opt.skipTrack) {
      replace.children[0].outerHTML = replace.children[0].innerHTML
    }
    clear(replace);
    [].forEach.call(replace.getElementsByTagName('*'), clear)
    _.ele.parentNode.replaceChild(replace, _.ele)
    _.event(_window, 'remove', {
      resize: _.resize
    })
    _.emit('destroy')
  }

  gliderPrototype.emit = function (name, arg) {
    var _ = this

    var e = new _window.CustomEvent('glider-' + name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    })
    _.ele.dispatchEvent(e)
  }

  gliderPrototype.event = function (ele, type, args) {
    var eventHandler = ele[type + 'EventListener'].bind(ele)
    Object.keys(args).forEach(function (k) {
      eventHandler(k, args[k])
    })
  }

  return Glider
})

},{}],2:[function(require,module,exports){
const handleSubmit = (event) => {
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);
  const messageContainer = document.querySelector(".contact-submit-message");
  const messageSuccess = `<p>Thank you for your message. I'll get back to you as soon as possible.</p>`;
  const messageFail = `<p>Sorry, there was a problem submitting your message. Please try again.</p>`;
  
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => console.log("Form successfully submitted"))
    .then(() => {
      myForm.reset();
      messageContainer.innerHTML = messageSuccess;
      messageContainer.classList.add("contact-submit-message--reveal");
    })
    .catch((error) => {
      messageContainer.innerHTML = messageFail;
      messageContainer.classList.add("contact-submit-message--reveal");
      console.log(error);
    });
};

document
  .getElementById("formContact")
  .addEventListener("submit", handleSubmit);
},{}],3:[function(require,module,exports){
new Glider(document.querySelector(".glider"), {
    // mobile first defaults
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    scrollLock: true,
    dots: "#dots",
    arrows: {
      prev: ".glider-prev",
      next: ".glider-next",
    },
    responsive: [
      {
        // screens greater than >= 775px
        breakpoint: 944,
        settings: {
          // Set to `auto` and provide item width to adjust to viewport
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  });
},{}],4:[function(require,module,exports){
(function (global){(function (){
var myScripts = require('./scripts');
var glider = require('glider-js');
var gliderInit = require('./gliderInit');
var form = require('./form');

global.window.myScripts = myScripts;
global.window.glider = glider;
global.window.gliderInit = gliderInit;
global.window.form = form;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./form":2,"./gliderInit":3,"./scripts":5,"glider-js":1}],5:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", (_) => {
  const log = console.log;
  // Section Elements to watch for ScrollSpy-like Page Navigation
  const sections = document.querySelectorAll("section");
  // Page Navigation nav element
  const pageNav = document.getElementById("pageNav");
  const navList = document.getElementById("pageNavList");
  const dotNav = document.getElementById("dotNav");
  const menuToggle = document.getElementById("menuToggle");
  // const pageNavCopy = pageNav.cloneNode(true);
  // pageNavCopy.id = "pageNavCopy";
  // pageNavCopy.classList.remove('container');

  // pageNav will change when it intersects with the main element
  // Also, its links will be highlighted as the relevant page sections come into view
  const mainEle = document.getElementById("main");

  // we'll be listening to window.resize so we need to throttle it
  const throttleDelay = 250;
  let throttled = false;

  // the options for the section elements observer
  // in the vertical center of the page
  // the full width of the page
  const sectionsOptions = {
    root: document,
    threshold: 0,
    rootMargin: "-50% 0px",
  };

  const setHeight = (ele, height, unit = "px") => {
    ele.style.height = `${height}${unit}`;
  };

  // function doesn't accept units because the
  // return value will be used in calculations
  const getEleHeight = (ele) => {
    // clientHeight = the height of an element + the vertical padding.
    // offsetHeight = the height of the element + the vertical padding +
    //the top and bottom borders + the horizontal scrollbar (if it's available).
    return ele.offsetHeight;
  };

  const getMenuHeight = (_) => getEleHeight(pageNav);

  // window height minus the height of the menu
  function getRootVerticalOffset(_) {
    const menuHeight = getMenuHeight();
    return window.innerHeight - menuHeight;
  }

  let rootVerticalOffset = getRootVerticalOffset();

  // the first main observer will be mainObserver1
  // every time there is a new one mainObserver count is concatenated to 'mainOvserver'
  let mainObserverCount = 1;

  // the root margin covers the menu area at the top of the page
  // the menu will visibly change if it intersects with the main element
  let mainObserverOptions = {
    root: document,
    threshold: 0,
    rootMargin: `0px 0px -${rootVerticalOffset}px 0px`,
  };

  // the id of the section that section observer is intersecting with
  let currentID;
  // the corresponding link of the page nav menu
  let linkItem1, linkItem2;
  // the parent of the link item gets a new class on instersection
  let listItem1, listItem2;

  // find the intersecting sections corresponding link in the page nav menu
  const getLinkItem = (navEle) => {
    return document.querySelector(`#${navEle.id} a[href="#${currentID}"]`);
  };

  // get the parent, (an li element), of the corresponding link item - see previous comment
  const getListItem = (linkEle) => {
    return linkEle.closest("li");
  };

  // create a new intersection observer
  const sectionsObserver = new IntersectionObserver(
    (entries, sectionsObserver) => {
      entries.forEach((entry) => {
        currentID = entry.target.id;
        // get link items in both navigations
        linkItem1 = getLinkItem(pageNav);
        linkItem2 = getLinkItem(dotNav);
        // get the li container of the link items
        listItem1 = getListItem(linkItem1);
        listItem2 = getListItem(linkItem2);
        // remove the class on the corresponding li element
        if (
          entry.isIntersecting === false &&
          listItem1.classList.contains("page-nav__item--current")
        ) {
          listItem1.classList.remove("page-nav__item--current");
          listItem2.classList.remove("dot-nav__item--current");
          return;
        }
        // add the class on the corresponding li element
        if (
          entry.isIntersecting === true &&
          !listItem1.classList.contains("page-nav__item--current")
        ) {
          rootVerticalOffset = getRootVerticalOffset();
          listItem1.classList.add("page-nav__item--current");
          listItem2.classList.add("dot-nav__item--current");
        }
      });
    },
    sectionsOptions
  );

  // start watching all the section elements
  sections.forEach((theSection) => {
    sectionsObserver.observe(theSection);
  });

  window.addEventListener("resize", (_) => {
    if (throttled === false) {
      const newRootVerticalOffset = getRootVerticalOffset();
      mainObserverOptions.rootMargin = `0px 0px -${newRootVerticalOffset}px 0px`;
      stopMainObserver(`mainObserver${mainObserverCount}`);
      mainObserverCount++;
      let newMainObserver = `mainObserver${mainObserverCount}`;
      newMainObserver = setMainObserver();
      startMainObserver(newMainObserver);
      throttled = true;

      setTimeout(function () {
        throttled = false;
      }, throttleDelay);
    }
  });

  const setMainObserver = () => {
    mainObserverName = `mainObserver${mainObserverCount}`;
    return (window[`mainObserver${mainObserverCount}`] =
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            pageNav.classList.remove("page-nav--small");
            pageNav.classList.add("page-nav--large");
            return;
          }
          pageNav.classList.remove("page-nav--large");
          pageNav.classList.add("page-nav--small");
        });
      }, mainObserverOptions));
  };

  const startMainObserver = (_) => {
    const observer = eval(`mainObserver${mainObserverCount}`);
    //console.log(observer);
    observer.observe(mainEle);
  };

  const stopMainObserver = (observerName) => {
    const observer = eval(observerName);
    observer.unobserve(mainEle);
  };

  setMainObserver();
  startMainObserver();

  // Add Attributes to the Calendly Widget's iframe
  const calendlyContainer = document.querySelector(".calendly-inline-widget");
  const insertedNodes = [];
  let calendlyObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        insertedNodes.push(mutation.addedNodes[i]);
      }
      if (insertedNodes[i] instanceof HTMLIFrameElement) {
        console.log('Iframe Observed');
        const calendlyIframe = calendlyContainer.querySelector("iframe");
        calendlyIframe.setAttribute("title", "Select a Date & Time - Calendly");
        calendlyIframe.setAttribute("scrolling", "no");
        calendlyIframe.setAttribute("width", "100%");
      }
    });
  });
  calendlyObserver.observe(calendlyContainer, {
    childList: true,
    subtree: false
  });

  // Animation Effect on Button Element
  const btnFormSubmit = document.querySelector(
    '.form-contact button[type="submit"]'
  );

  const effectClass = "ripple";

  const animationHandler = function (e, ele) {
    // Get the position of the click in the button
    let xPos = e.offsetX;
    let yPos = e.offsetY;
    // Get the height of the Element to preserve aspect ratio
    let btnPseudoHeight = btnFormSubmit.offsetWidth;
    // add the CSS Custom Properties to the button element
    ele.style.setProperty("--pseudo-height", `${btnPseudoHeight}px`);
    ele.style.setProperty("--xpos", `${xPos}px`);
    ele.style.setProperty("--ypos", `${yPos}px`);
  };

  // Add Custom Properties and Class to button when clicked
  btnFormSubmit.addEventListener("click", function (e) {
    animationHandler(e, btnFormSubmit);
    btnFormSubmit.classList.add(effectClass);
  });
  // Remove Class from button when animation completes
  btnFormSubmit.addEventListener("animationend", function (e) {
    btnFormSubmit.classList.remove(effectClass);
  });

  // Menu JS
  const openMenu = (_) => {
    log("openMenu");
    pageNav.classList.remove("page-nav--list-off-page");
    pageNav.classList.remove("page-nav--closed");
    pageNav.classList.add("page-nav--open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = (_) => {
    pageNav.classList.remove("page-nav--open");
    pageNav.classList.add("page-nav--closing");
  };

  const isMenuOpen = (_) => pageNav.classList.contains("page-nav--open");
  const isMenuClosing = (_) => pageNav.classList.contains("page-nav--closing");
  const isMenuClosed = (_) => pageNav.classList.contains("page-nav--closed");
  const isPageNavInFocus = (_) => pageNavList.contains(document.activeElement);
  const isMenuListOffPage = (_) => pageNav.classList.contains("page-nav--list-off-page");

  document.addEventListener("click", function (e) {
    let targetEle = e.target;
    if (isMenuOpen() && targetEle.closest(".page-nav__list") === null) {
      closeMenu();
    }
  });

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    let targetEle = e.target;
    // button has spans so we need closest
    if (menuToggle === targetEle.closest("#menuToggle") && isMenuClosing()) {
      pageNav.classList.remove("page-nav--closing");
    }
    // button has spans so we need closest
    if (menuToggle === targetEle.closest("#menuToggle")) {
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  });

  pageNavList.addEventListener("focusin", function (e) {
    e.stopPropagation();
    if (isMenuClosed()) {
      openMenu();
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.key === "Tab" && !isPageNavInFocus()) {
      if (isMenuOpen()) {
        closeMenu();
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isPageNavInFocus()) {
      if (isMenuOpen()) {
        closeMenu();
        menuToggle.focus();
      }
    }
  });

  navList.addEventListener("transitionend", function (e) {
    const targetEle = e.target;
    // only look for a transition on the list itself,
    // not the child elements
    if (targetEle === navList && isMenuOpen() === false) {
      pageNav.classList.remove("page-nav--closing");
      pageNav.classList.add("page-nav--closed");
      pageNav.classList.add("page-nav--list-off-page");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  const resetMenu = (menuBreakPoint) => {
    if (menuBreakPoint.matches && !isMenuOpen()) {
      pageNav.classList.add("page-nav--list-off-page");
      pageNav.classList.add("page-nav--closed");
      return;
    }

    if (!isMenuOpen()) {
      pageNav.classList.add("page-nav--list-off-page");
    }
    if (isMenuOpen()) {
      pageNav.classList.remove("page-nav--open");
    }
    if (isMenuClosed()) {
      pageNav.classList.remove("page-nav--closed");
    }
    if (isMenuListOffPage()) {
      pageNav.classList.remove("page-nav--list-off-page");
    }
    if (isMenuClosing()) {
      pageNav.classList.remove("page-nav--closing");
    }
  };

  const menuBreakPoint = window.matchMedia("(max-width: 767px)");

  resetMenu(menuBreakPoint);

  try {
    menuBreakPoint.addEventListener("change", resetMenu);
  } catch (e1) {
    try {
      // Safari
      // The deprecated addListener() method of the MediaQueryList interface adds a listener
      // to the MediaQueryListener that will run a custom callback function in response to
      // the media query status changing.
      // In older browsers MediaQueryList did not yet inherit from EventTarget, so this method
      // was provided as an alias of EventTarget.addEventListener(). Use addEventListener()
      // instead of addListener() if it is available in the browsers you need to support.
      // Use the removeListener to can
      log(e1, 'Trying addListener instead of addEventListener.');
      menuBreakPoint.addListener(resetMenu);
    } catch (e2) {
      log(e2);
    }
  }

});

},{}]},{},[4]);
