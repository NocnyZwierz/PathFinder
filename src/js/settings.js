export const select = {

  containerOf: {
    pages: '#pages',
  },


  nav: {
    links: '.buttons a',
  },

};
  
export const classNames = {

  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }
};
  

export const templates = {
  aboutContent: Handlebars.compile(document.querySelector('#template-about-content').innerHTML),
  finderContent: Handlebars.compile(document.querySelector('#template-finder-content').innerHTML),
};