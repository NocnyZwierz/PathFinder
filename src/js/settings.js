export const select = {

  containerOf: {
    pages: '#pages',
  },


  nav: {
    links: '.buttons a',
  },

  finder: {
    grid: '.grid',
    mainBtn: '.main-button'

  },

};
  
export const classNames = {
  finder: {
    field: 'field',
    active: 'active', //dlaczego
    nextAction: 'nextAction',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }
};
  

export const templates = {
  aboutContent:  Handlebars.compile(document.querySelector('#template-about-content').innerHTML),
  finderContent: Handlebars.compile(document.querySelector('#template-finder-content').innerHTML),
};