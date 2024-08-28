import { templates } from '../settings.js';

class Finder {
  constructor (element) {
    this.render(element);
  }

  render(element) {
    console.log('render finder ----------------->');
    const thisFinder = this;
    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;

    const generatedHTML = templates.finderContent();
    thisFinder.dom.wrapper.innerHTML = generatedHTML;

  }
}

export default Finder;