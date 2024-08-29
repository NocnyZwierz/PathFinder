import { classNames, select, templates } from '../settings.js';

class Finder {
  constructor (element) {
    const thisFinder = this;
    // save reference to finder page div
    thisFinder.element = element;
    thisFinder.step = 1;
    

    this.render(element);
  }

  render(element) {
    const thisFinder = this; //bez tego ani nie idzie musi być bo nie ma do czego przypisać
    thisFinder.dom = {}; // i to też!!!!!!!!!!!
    thisFinder.dom.wrapper = element;

    let pageData = {}; //będzie null safety
    console.log('przed przypisaniem title i btn', pageData);
    switch (thisFinder.step) {
    case 1:
      pageData = {title: 'Draw routes', btnText: 'Finish drowing'};
      break;
    case 2:
      pageData = {title: 'Pick start and finish', btnText: 'Compute'};
      break;
    case 3:
      pageData = {title: 'The best route is', btnText: 'Start again'};
      break;
    }

    const generatedHTML = templates.finderContent(pageData);
    thisFinder.dom.wrapper.innerHTML = generatedHTML;

    let html = '';
    for (let row = 1; row <= 10; row++){
      html += '<div class="style-row">';
      for(let col = 1; col <= 10; col++){
        html += '<div class="field" data-row="' + row + '" data-col="' + col + '"></div>';
      }
      html += '</div>';
    }
    thisFinder.element.querySelector(select.finder.grid).innerHTML = html;
    this.fieldClick();
  }

  changeStep(newStep) {
    const thisFinder = this;
    thisFinder.step = newStep;
    thisFinder.render(this.element);
  }

  fieldClick () {
    const thisFinder = this;
    // switch bo szybciej i czyściej
    switch (thisFinder.step) {
    case 1:
      thisFinder.element.querySelector(select.finder.mainBtn).addEventListener('click', function(e) {
        e.preventDefault();
        thisFinder.changeStep(2);
      });
     
      thisFinder.element.querySelector(select.finder.grid).addEventListener('click', function(e) {
        e.preventDefault();
        if(e.target.cllassList.contains(classNames.finder.field)) {
          thisFinder.toggleField(e.target);
        }
      });
      
      break;
    case 2:
        
      break;
    case 3:
        
      break;
    }
  }


}

export default Finder;