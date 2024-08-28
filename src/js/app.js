import About from './components/about.js';
import Finder from './components/finder.js';
import { classNames, select } from './settings.js';

const app = {

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromhash = window.location.hash.replace('#', '');

    let pageMatchingHash = this.pages[0].id;
    for(let page of thisApp.pages) {
      if(page.id == idFromhash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
      
        const id = clickedElement.getAttribute('href').replace('#', '');
      
        thisApp.activatePage(id);
      
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;
    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    
    for(let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
  },

  initAboutContent () {
    const thisApp = this;
    const aboutContainer = document.querySelector('.about-wraper');
    if (aboutContainer) {
      new About (aboutContainer, thisApp);
    }
  },

  initFinderContent () {
    const thisApp = this;
    const finderContainer = document.querySelector('.finder-wraper');
    if (finderContainer) {
      new Finder (finderContainer, thisApp);
    }
  },

  init: function () {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initAboutContent();
    thisApp.initFinderContent();
  }
};

app.init();