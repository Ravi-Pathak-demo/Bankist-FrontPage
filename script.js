'use strict';

const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');

let btnToScroll = document.querySelector('.btn--scroll-to');
let section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
// Modal window
///////////////////////////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// smooth scrolling (old method)
// scroll to section1 by pressing btn to scroll class

btnToScroll.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
  // scrollIntoView scroll the page to the particular x and y coordinate
});

//scrolling of all nav buttons { old method }
// document.querySelectorAll('.nav__link').forEach(function (el) {
// el.addEventListener('click', function (e) {
//   e.preventDefault();
//   let id = this.getAttribute('href');
//   console.log(id);

//   document.querySelector(id).scrollIntoView({ behavior: 'smoooth' });
//   });
// });

// event delegation {using parent as the bubbler for all child that access the same property }
// 1. add event listener to common parent
// 2. determine which element originated the element

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // put a matching parameter so that event does'nt fire by triggering parent
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    let id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabs activation

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // for removing the active tab from all tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // adding active tab to only the clicked tab
  clicked.classList.add('operations__tab--active');

  // activate the content area of tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// nav slide/ fade

const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      // this is the value given by bind function
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverHandler.bind(0.5));
nav.addEventListener('mouseout', hoverHandler.bind(1));

// Intersection observer api
const header = document.querySelector('header');

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
  // sticky navbar to show 90px before intersection , if +ve then 90px after intersection
});
headerObserver.observe(header);

// reveal section

const allSections = document.querySelectorAll('.section');

const showSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold: 0.15,
  // threshold is the limit at which it will work not after that
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
  // moving through all sections and adding hidden class to them
});

// lazy loading images

const allImages = document.querySelectorAll('img[data-src]');

const lazyLoader = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // if not intersecting return nothing

  entry.target.src = entry.target.dataset.src;
  // converting the small image with new pixelated one

  entry.target.addEventListener('load', function () {
    // src has a load eventListener to load image, but we try with event Listener it will load instantly
    entry.target.classList.remove('lazy-img');
  });
  // unobserve the intersectionObserver
  imageObserver.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(lazyLoader, {
  root: null,
  threshold: 0,
});

allImages.forEach(img => imageObserver.observe(img));

// slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// using keys for slide

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
  e.key === 'ArrowRight' && nextSlide();
});

// Dots for scrolling
const dotsContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide = "${i}" ></button>`
    );
  });
};

// activate dots
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

// dot callers
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

// init function
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();
// binding the hoverHandler function to the function , which gives this value (0.5, 1).
// to function.... as bind method also returns new function

///////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////

// const classSelectors = document.getElementsByClassName('btn');
// console.log(classSelectors);
// // returns a html collections of all classes with name btn
// // html collections changes with change in dom

// const idSelectors = document.getElementById('section--1');
// console.log(idSelectors);
// // select id by name

// const doc = document.documentElement;
// console.log(doc);
// // selects entire document

// const docHeader = document.head;
// console.log(document.head);
// console.log(docHeader);
// // head component selected

// console.log(document.getElementsByTagName('header'));
// // header tag selected

// const docBody = document.body;
// console.log(docBody);
// // body component selected

// console.log(document.querySelectorAll('section'));
// // node-list does'nt change if dom is changes, if its declared it will remain same

// let header = document.querySelector('header');

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // added new class into message

// // message.textContent = 'hello';

// message.innerHTML = `We use cookies for improvement of your experience
// <button class = "btn btn--close-cookie">Got it</button>
// `;
// // added new html in the message div

// header.append(message);
// // adding message above header
// // header.prepend(message);
// // adding message below header

// // only one will activate as html is unique message is unique and can
// // only added once

// // also have before and after
// // header.before(message);
// header.after(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// message.style.backgroundColor = 'black';
// message.style.width = '100%';

// console.log(message.style.width);
// // will show as we set it directly but cant access property set already at start

// // to see all property set at program start, use
// console.log(getComputedStyle(message).height);

// // to set property
// // const changeMessage = document.getElementsByTagName(message);
// // changeMessage.style.backgroundColor

// // document.documentElement.style.setProperty('--color-primary', 'red');
// // set property of doc

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);

// // can only give default property of logo, not set by us
// console.log(logo.designer);
// // to get access of property set by us, use
// console.log(logo.getAttribute('designer'));
// console.log(logo.setAttribute('college', 'lpu'));

// // can also change property
// logo.alt = 'hello';
// console.log(logo.alt);

// // data attribute
// console.log(logo.dataset.versionNumber);

// // scroll to section 1
// let btnToScroll = document.querySelector('.btn--scroll-to');
// let section1 = document.querySelector('#section--1');
// // scroll to section1 by pressing btn to scroll class

// btnToScroll.addEventListener('click', function () {
//   section1.scrollIntoView({ behavior: 'smooth' });
//   // scrollIntoView scroll the page to the particular x and y coordinate
// });

// // old method of event handler
// const headerTitle = document.querySelector('h1');
// // headerTitle.onmouseenter = function () {
// //   alert('onmuseeneter using old method');
// // };

// const removeHandler = function () {
//   alert('onmuseenter using new method');
//   headerTitle.removeEventListener('mouseenter', removeHandler);
//   // remove eventHandler`
// };
// headerTitle.addEventListener('mouseenter', removeHandler);

// // event propagation ( bubbling )
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);

//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Links', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Nav', e.target, e.currentTarget);
//     console.log(this === e.currentTarget);
//   },
//   true
// );

// // dom traversal (downwards in dom : - child) { any depth }
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// // h1 has 2 span child with class as highlight

// console.log(h1.childNodes);
// // gives all contents in between h1 , as text, comment, tag, etc..

// console.log(h1.children);
// // only returns tags within h1

// console.log(h1.firstChild);
// // returns first content in h1 could be anything tag, text, etc

// console.log(h1.firstElementChild);
// // gives first tag found in h1

// // can also change content of h1
// h1.lastElementChild.style.color = 'red';

// // (upwards: - parent) { any depth }
// console.log(h1.parentNode);
// // node parent of h1(anything)
// console.log(h1.parentElement);
// // ant tag parent of h1

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// // closest parent with header class

// // (sideways: - siblings)
// // can only access direct siblings not deeper
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// // returns siblings previous and next to h1, which are tags

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// // returns siblings,can be any thing

// // getting all siblings of h1 , trick: -
// console.log(h1.parentElement.children);
