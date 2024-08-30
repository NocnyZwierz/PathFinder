import { classNames, select, templates } from '../settings.js';

class Finder {
  
  constructor (element) {
    const thisFinder = this;
    // save reference to finder page div
    thisFinder.element = element;
    thisFinder.step = 1;
    

    this.render(element);

    thisFinder.grid ={};
    for(let row = 1; row <=10; row++){
      thisFinder.grid[row] = {};
      for(let col = 1; col <=10; col++) {
        thisFinder.grid[row][col]= false;
      }
    }
    console.log('siatka', thisFinder.grid);
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
        console.log(e.target.classList);
        console.log(classNames.finder.field);
        if(e.target.classList.contains(classNames.finder.field)) {
          console.log(e.target);
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

  toggleField(fieldElement) {
    const thisFinder = this;
    console.log('toggle');
    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col'),
    };
    console.log(field);
    if(thisFinder.grid[field.row][field.col]) {
      this.grid[field.row][field.col] = false;
      fieldElement.classNames.remove(classNames.finder.active);
    } else {
      const gridValue = Object.values(thisFinder.grid).map(col => Object.values(col)).flat(); // nie rozumiem tego zapisu
      console.log(gridValue);
      if(gridValue.includes(true)) {
        console.log('test');
        const edgeFields = [];
        if(field.col > 1) edgeFields.push(thisFinder.grid[field.row][field.col-1]);

        if(field.col < 10) edgeFields.push(thisFinder.grid[field.row][parseInt(field.col)+1]);
        if(field.row > 1) edgeFields.push(thisFinder.grid[field.row-1][field.col]);
        if(field.row < 10) edgeFields.push(thisFinder.grid[parseInt(field.row)+1][field.col]);
        console.log(edgeFields);
        if(!edgeFields.includes(true)){
          alert('A new field should touch at least one that is already selected!');
          return;
        }

        // thisFinder.grid[field.row][field.col] = true;
        // console.log('chuuw sto!!!!!!');
        // fieldElement.classList.add(classNames.finder.active);
        // console.log(fieldElement);
      }
      thisFinder.grid[field.row][field.col] = true;
      console.log('chuuw sto!!!!!!');
      fieldElement.classList.add(classNames.finder.active);
      console.log(fieldElement);

    }

  }

}

export default Finder;