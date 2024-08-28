import { templates } from '../settings.js';

class About {
  constructor (element) {
    this.render(element);
  }

  render(element) {
    const thisAbout = this;
    thisAbout.dom = {};
    thisAbout.dom.wrapper = element;

    const generatedHTML = templates.aboutContent();
    thisAbout.dom.wrapper.innerHTML = generatedHTML;

  }
}

export default About;