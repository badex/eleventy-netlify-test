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
