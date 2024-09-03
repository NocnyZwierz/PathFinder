import { classNames, select, templates } from '../settings.js';

class Finder {
  
  constructor (element) {
    const thisFinder = this;
    // save reference to finder page div
    thisFinder.element = element;
    thisFinder.step = 1;
    

    this.render(element);

    thisFinder.grid ={};
    for(let row = 1; row <=10; row++){//"magick number" dobrze wywalić liczby do property np const const maxRow = 10;
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
        if(e.target.classList.contains(classNames.finder.field)) {
          thisFinder.toggleField(e.target);
        }
      });
      //tutaj jeszcze dodać funkconalność podświetlające pola gdzie można kliknąć, przy walidaci można ustawić pola dostępne do kliknięcia
      break;
    case 2:
      //dwie pętle przechodzące przez nasz obiekt co jest stworzony w konstruktorzę żeby pobrać które pole jest true a które falce.
      // dodać logikę do wskazania startu trasy i zakończenia (musi mieć walidacę czy jest na odpowiednik kafelku z statusem true jeśli nie komunikat ze wybrany kafelek jest poza trasą)
      break;
    case 3:
      // logikę do obliczania całe trasy. Wyświetlenie najkrótszej trasy na grid. guzik do wyczyszczenia i przejscie do początku działanie aplikacji
      //dodatkowa tablica na start stop żeby większyć wydaność aplikaci.
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
    if(thisFinder.grid[field.row][field.col]) {
      this.grid[field.row][field.col] = false;
      //sprawdzic przed usunieciem czy mozna go usunac (czy przylega do wiecej niż 1 pola active)      
      fieldElement.classList.remove(classNames.finder.active);
      this.deleteNextAction(field);
      //dodanie klasy nextAction do elementu kliknietego (usuniecie zaznaczenia)

    
    } else {
      const gridValue = Object.values(thisFinder.grid).map(col => Object.values(col)).flat(); // przy wyborze pierszego kafelka
      console.log(gridValue);
      if(gridValue.includes(true)) {
        const edgeFields = [];
        if(field.col > 1) edgeFields.push(thisFinder.grid[field.row][field.col-1]);
        if(field.col < 10) edgeFields.push(thisFinder.grid[field.row][parseInt(field.col)+1]);
        if(field.row > 1) edgeFields.push(thisFinder.grid[field.row-1][field.col]);
        if(field.row < 10) edgeFields.push(thisFinder.grid[parseInt(field.row)+1][field.col]);

        if(!edgeFields.includes(true)){
          alert('A new field should touch at least one that is already selected!');
          return;
        }
      }
      thisFinder.grid[field.row][field.col] = true;
      fieldElement.classList.add(classNames.finder.active);
      fieldElement.classList.remove(classNames.finder.nextAction);

      this.setNexAction(field);

    }
  }

  setNexAction (field) {
    if(field.col > 1) {
      let elementCandidate = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-1}"]`); //bez przecinków i spacji bo nie działa
      if (!elementCandidate.classList.contains('active')) {
        elementCandidate.classList.add(classNames.finder.nextAction);
      }
    }
    
    if(field.col < 10) { 
      let elementCandidate = document.querySelector(`[data-row="${field.row}"][data-col="${parseInt(field.col)+1}"]`);
      if (!elementCandidate.classList.contains('active')) {
        elementCandidate.classList.add(classNames.finder.nextAction);
      }
    }

    if(field.row > 1) {
      let elementCandidate = document.querySelector(`[data-row="${field.row-1}"][data-col="${field.col}"]`);
      if (!elementCandidate.classList.contains('active')) {
        elementCandidate.classList.add(classNames.finder.nextAction);
      }
    }

    if(field.row < 10) {
      let elementCandidate = document.querySelector(`[data-row="${parseInt(field.row)+1}"][data-col="${field.col}"]`);
      if (!elementCandidate.classList.contains('active')) {
        elementCandidate.classList.add(classNames.finder.nextAction);
      }
    }
  }

  getEdges(field) {
    const edges = {};
    edges.top = document.querySelector(`[data-row="${field.row-1}"][data-col="${field.col}"]`);
    edges.right = document.querySelector(`[data-row="${field.row}"][data-col="${parseInt(field.col)+1}"]`);
    edges.bottom = document.querySelector(`[data-row="${parseInt(field.row)+1}"][data-col ="${field.col}"]`);
    edges.left = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-1}"]`);
    return edges;
  }
  
  shouldRemoveNextAction(candidateField) {
    let edges = this.getEdges(candidateField);
    console.log(edges);
    console.log((edges.top && edges.top.classList.contains('active')));
    console.log((edges.right && edges.right.classList.contains('active')));

    console.log((edges.bottom && edges.bottom.classList.contains('active')));

    console.log((edges.left && edges.left.classList.contains('active')));

    return (
      (edges.top && edges.top.classList.contains('active')) ||
    (edges.right && edges.right.classList.contains('active')) ||
    (edges.bottom && edges.bottom.classList.contains('active')) ||
    (edges.left && edges.left.classList.contains('active')) 
    );  
  }

  deleteNextAction (field) {
    if(field.col > 1) {
      let elementCandidate = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-1}"]`); //bez przecinków i spacji bo nie działa
      
      // let elementCandidateTop = document.querySelector(`[data-row="${field.row-1}"][data-col="${field.col-1}"]`);
      // let elementCandidateRigth = document.querySelector(`[data-row="${field.row}"][data-col="${field.col}"]`);
      // let elementCandidateBottom = document.querySelector(`[data-row="${parseInt(field.row)+1}"][data-col="${field.col-1}"]`);
      // let elementCandidateLeft = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-2}"]`);
      let candidateField = {
        row: field.row,
        col: field.col-1
      };
      // let elementCandidateEdges = this.getEdges(candidateField);      
      if (!this.shouldRemoveNextAction(candidateField)) {
        elementCandidate.classList.remove(classNames.finder.nextAction);
      }
    }

    if(field.col < 10) { 
      
      let candidateField = {
        row: field.row,
        col: parseInt(field.col)+1
      };

      let elementCandidate = document.querySelector(`[data-row="${field.row}"][data-col="${parseInt(field.col)+1}"]`);
      if (!this.shouldRemoveNextAction(candidateField)) {
      
        elementCandidate.classList.remove(classNames.finder.nextAction);
      }
    }

    if(field.row > 1) {
      let candidateField = {
        row: field.row -1,
        col: field.col
      };


      let elementCandidate = document.querySelector(`[data-row="${field.row-1}"][data-col="${field.col}"]`);
      if (!this.shouldRemoveNextAction(candidateField)) {
        elementCandidate.classList.remove(classNames.finder.nextAction);
      }
    }

    if(field.row < 10) {
      let candidateField = {
        row: parseInt(field.row) + 1,
        col: field.col
      };

      let elementCandidate = document.querySelector(`[data-row="${parseInt(field.row)+1}"][data-col="${field.col}"]`);
      if (!this.shouldRemoveNextAction(candidateField)) {
        elementCandidate.classList.remove(classNames.finder.nextAction);
      }
    }
  }


}

export default Finder;