import { classNames, select, templates } from '../settings.js';

class Finder {
  
  constructor (element) {
    const thisFinder = this;
    // save reference to finder page div
    thisFinder.element = element;
    thisFinder.step = 1;
    thisFinder.start = null;
    thisFinder.finish = null;

    thisFinder.grid ={};
    for(let row = 1; row <=10; row++){//"magick number" dobrze wywalić liczby do property np const const maxRow = 10; tworzy sietkę dla naszych potrzeb
      thisFinder.grid[row] = {};
      for(let col = 1; col <=10; col++) {
        thisFinder.grid[row][col]= false;
      }
    }
    this.render(element);
  }

  render(element) {
    const thisFinder = this; //bez tego ani nie idzie musi być bo nie ma do czego przypisać
    thisFinder.dom = {}; // i to też!!!!!!!!!!!
    thisFinder.dom.wrapper = element;
    let pageData = {}; //będzie null safety ustawia nam napisy na button
    switch (thisFinder.step) {
    case 1:
      pageData = {title: 'DRAW ROUTES', btnText: 'Finish drowing'};
      break;
    case 2:
      pageData = {title: 'Pick start and finish', btnText: 'Compute'};
      break;
    case 3:
      pageData = {title: 'The best route is', btnText: 'Start again'};
      break;
    }

    const generatedHTML = templates.finderContent(pageData); // generuje nam batona z tekstem odpowiendnik stanem
    thisFinder.dom.wrapper.innerHTML = generatedHTML;

    let html = ''; // generuje grid czyli 100 div w siatce 10 na 10
    for (let row = 1; row <= 10; row++){
      html += '<div class="style-row">';
      for(let col = 1; col <= 10; col++){
        let activeClass = thisFinder.grid[row][col] ? 'active' : ''; // dodanie active do true i pusty string do false
        html += '<div class="field ' + activeClass +'" data-row="' + row + '" data-col="' + col + '"></div>'; // poprawiony zapisa i od razu przy true dopisuje klasę activ ułatwia to wyświetlanie siarki w drugim etapie
      }
      html += '</div>';
    }
    thisFinder.element.querySelector(select.finder.grid).innerHTML = html; // tutaj wyswietla je nam na akranie
    this.fieldClick();
  }

  changeStep(newStep) { // obsługuje nam przejścia miedzy etapami
    const thisFinder = this;
    thisFinder.step = newStep;
    thisFinder.render(this.element);
  }
  
  fieldClick () {// obsługa kliknięcia naszego pola w div w grid                        
    const thisFinder = this;
    // switch bo szybciej i czyściej
    switch (thisFinder.step) {
    case 1:
      thisFinder.element.querySelector(select.finder.mainBtn).addEventListener('click', function(e) { // obsługa change step i przejście do nstępnego etapu
        e.preventDefault();
        let gridValueCheck = Object.values(thisFinder.grid).map(col => Object.values(col)).flat(); //spłaszcza tablice i sprawdza czy est pierwszy kliknięty
        let gridOnlyTrueValues = gridValueCheck.filter((value) => {
          return value;
        });

        // let gridOnlyTrueValues = gridValueCheck.filter(value => value); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! potrenować
        /*   let gridOnlyTrueValues = gridValueCheck.filter((value) => {
          return value === true;
        }); */
        if(gridOnlyTrueValues.length >= 2){
          thisFinder.changeStep(2);
        } else {
          alert ('No rout selected!');
        }
      });
     
      thisFinder.element.querySelector(select.finder.grid).addEventListener('click', function(e) { // obsługa grid i wyrenderowanie zaznaczonych pół po kliknięciu podświetla się pole i do okoła kolene mozliwe ruchy
        e.preventDefault();
        if(e.target.classList.contains(classNames.finder.field)) {
          thisFinder.toggleField(e.target);
        }
      });
      break;
    case 2:
      // dodać logikę do wskazania startu trasy i zakończenia (musi mieć walidacę czy jest na odpowiednik kafelku z statusem true jeśli nie komunikat ze wybrany kafelek jest poza trasą)
      thisFinder.element.querySelector(select.finder.mainBtn).addEventListener('click', function(e) { // obsługa change step i przejście do nstępnego etapu
        e.preventDefault();
        if(thisFinder.start && thisFinder.finish){
          thisFinder.changeStep(3);
        } else {
          alert ('Start & Finish not selected');
        }
      });

      thisFinder.element.querySelector(select.finder.grid).addEventListener('click', function(e) { // obsługa grid i wyrenderowanie zaznaczonych pół po kliknięciu podświetla się pole i do okoła kolene mozliwe ruchy
        e.preventDefault();
        if(e.target.classList.contains(classNames.finder.field)) {
          thisFinder.setStartandStop(e.target);
        }
      });


      break;
    case 3:
      // logikę do obliczania całe trasy. Wyświetlenie najkrótszej trasy na grid. guzik do wyczyszczenia i przejscie do początku działanie aplikacji
      //wyczyścić grid czyli ustawić wszystko na false
      thisFinder.element.querySelector(select.finder.mainBtn).addEventListener('click', function(e) { // obsługa change step i przejście do nstępnego etapu
        e.preventDefault();
        thisFinder.changeStep(1);
      });
      //---------------------> tutaj
      thisFinder.compiut();
      break;
    }
  }

  toggleField(fieldElement) { // 
    const thisFinder = this;
    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col'),
    };
    if(thisFinder.grid[field.row][field.col]) {
      if (!this.canRemoveActive(field)) { //warunek do sprawdzenia czy można usunać kafelek zapobiega przerwaniu trasy
        fieldElement.classList.remove(classNames.finder.active);
        fieldElement.classList.add(classNames.finder.nextAction);
        this.grid[field.row][field.col] = false;
      } else {
        alert ('Can\'t delete field');
      }
      this.deleteNextAction(field);
          
    } else {
      const gridValue = Object.values(thisFinder.grid).map(col => Object.values(col)).flat(); // przy wyborze pierszego kafelka
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

  setNexAction (field) { //podświetla następne możliwe zaznaczenia pola
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

  getEdges(field) { //wyszukania sąsiednich pól pole wyzej niżej na prawo i lewo
    const edges = {};
    edges.top = document.querySelector(`[data-row="${field.row-1}"][data-col="${field.col}"]`);
    edges.right = document.querySelector(`[data-row="${field.row}"][data-col="${parseInt(field.col)+1}"]`);
    edges.bottom = document.querySelector(`[data-row="${parseInt(field.row)+1}"][data-col ="${field.col}"]`);
    edges.left = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-1}"]`);
    return edges;
  }
  
  shouldRemoveNextAction(candidateField) { // sprawdzenie czy odpowiedni kafelek zawiera w sobie klasę active czy będzie null bo znajduje się poza grid
    let edges = this.getEdges(candidateField);

    // console.log(edges);
    // console.log((edges.top && edges.top.classList.contains('active')));
    // console.log((edges.right && edges.right.classList.contains('active')));
    // console.log((edges.bottom && edges.bottom.classList.contains('active')));
    // console.log((edges.left && edges.left.classList.contains('active'))); // pomocne przy debagowaniu

    return (
      (edges.top && edges.top.classList.contains('active')) ||
      (edges.right && edges.right.classList.contains('active')) ||
      (edges.bottom && edges.bottom.classList.contains('active')) ||
      (edges.left && edges.left.classList.contains('active')) 
    );  
  }

  // canRemoveActive (candidateField) { // pierwotny pomysł na zabezpieczenie przed przerwaniem scieżki
  //   let edges = this.getEdges(candidateField);
  //   let fieldActive = 0;
  //   console.log(fieldActive, 'ile spełnia warunki');

  //   if (edges.top && edges.top.classList.contains('active')) {
  //     fieldActive += 1;
  //     console.log('top czy jest spełniony');
  //   }
    
  //   if (edges.right && edges.right.classList.contains('active')) {
  //     fieldActive += 1;
  //     console.log('right czy jest spełniony');
  //   }

    
  //   if (edges.bottom && edges.bottom.classList.contains('active')) {
  //     fieldActive += 1;
  //     console.log('bottom czy jest spełniony');
  //   }

    
  //   if (edges.left && edges.left.classList.contains('active')) {
  //     fieldActive += 1;
  //     console.log('left czy jest spełniony');
  //   }
  //   console.log(fieldActive);
  //   return fieldActive >= 2;
  // }

  canRemoveActive(candidateField) { // uproszczony zapis z chat to co jest wyżej
    let edges = this.getEdges(candidateField);
    let directions = ['top', 'right', 'bottom', 'left'];
    let fieldActive = directions.reduce((count, dir) => {
      return edges[dir] && edges[dir].classList.contains('active') ? count + 1 : count;
    }, 0);
    return fieldActive >= 2;
  }

  deleteNextAction (field) { // usubięcie podswietlenia następnego możliwego ruchy
    const thisFinder = this; 
    if(field.col > 1) {
      let elementCandidate = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-1}"]`); //bez przecinków i spacji bo nie działa
      // let elementCandidateTop = document.querySelector(`[data-row="${field.row-1}"][data-col="${field.col-1}"]`); //pierwszy pomysł na sprawdzania sąsiadujacych pól czy mają active
      // let elementCandidateRigth = document.querySelector(`[data-row="${field.row}"][data-col="${field.col}"]`);
      // let elementCandidateBottom = document.querySelector(`[data-row="${parseInt(field.row)+1}"][data-col="${field.col-1}"]`);
      // let elementCandidateLeft = document.querySelector(`[data-row="${field.row}"][data-col="${field.col-2}"]`);
      let candidateField = {
        row: field.row,
        col: field.col-1
      };    
      if (!this.shouldRemoveNextAction(candidateField)) {
        elementCandidate.classList.remove(classNames.finder.nextAction);
      }
    }

    if(field.col < 10) { // opisac co za co odpowiada
      
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

    const noActiveFields = !Object.values(thisFinder.grid).some(row => // Sprawdź, czy nie zostały już żadne aktywne kafelki pomgół chcat przy debagowaniu bez tego zostaje podświetlony na niebiesko po tym jak był odkliknietuy
      Object.values(row).some(value => value === true)
    );

    if (noActiveFields) {
      let elementCandidate = document.querySelector(`[data-row="${field.row}"][data-col="${field.col}"]`);
      if (elementCandidate) {
        elementCandidate.classList.remove(classNames.finder.nextAction); // Usunięcie nextAction, gdy ostatni kafelek jest odznaczony
      }
    }

  }
  
  setStartandStop (fieldElement) {
    if(this.start && this.finish) {
      alert('Start & finish are selecter! Please continue.');
      return;
    }

    if(fieldElement.classList.contains(classNames.finder.active)) { 
      if(!this.start){
        const startField = {
          row: fieldElement.getAttribute('data-row'),
          col: fieldElement.getAttribute('data-col'),
        };
        fieldElement.classList.add(classNames.finder.start);
        // fieldElement.classList.remove(classNames.finder.active); // zmieniłem klasy css i już to nie nie jest potrzebne
        this.start = startField;
      } else {
        if(!fieldElement.classList.contains('start')) {
          const finisField = {
            row: fieldElement.getAttribute('data-row'),
            col: fieldElement.getAttribute('data-col'),
          };
          fieldElement.classList.add(classNames.finder.finish);
          // fieldElement.classList.remove(classNames.finder.active); // zmieniłem klasy css i już to nie nie jest potrzebne
          this.finish = finisField;
        } else {
          alert('This element is already marked as start!');
        }
      }
    } else {
      alert('The element is not a part of the path');
    }
  }

  compiut() {
    //  1 dodać wyświetlenie diva
    document.querySelector('#infoDiv').style.display='flex';
    

  }
}

export default Finder;