recipeTitle = document.title.split("|")[0].split(" - ")[0].split("•")[0].split(" – ")[0].split("::")[0]

if ($('.recipease-all').length == 0) {
  $('body').prepend('<div class="recipease-all" id="mydiv"> <div class="rounded-quick" id="mydivheader">'+
    '<button id="getRecipe"> </button> <button id="saveRecipe">save</button> '+
    '<button id="recipease-delete">X</button> <button id="recipease-minimize"> &nbsp; </button> '+
    '<h1 id="mealClip">MealClip</h1> </div> <div id="recipease-container"></div></div>')  

  open = false

  $('#getRecipe').click( function() {
    if (open) {
      $('#recipease-recipe').hide('300')

      $('#mydivheader').animate({
        width: 30,
      }, 300, function() {
        // Animation complete.
      });

      $('#mydivheader')
        .delay(20)
        .queue(function (next) { 
          // $(this).toggleClass('rounded')
            $('#mydivheader').toggleClass('rounded-quick')
          next(); 
        });
      // $('#mydivheader').css({"border-bottom-right-radius": "30px", "border-bottom-left-radius": "30px"})
      $('#recipease-minimize').hide();
      $('#recipease-delete').hide();
      $('#mealClip').hide();
      $('#saveRecipe').hide();

      positionBoth = $('#mydiv').offset()
      $('#mydiv').toggleClass('absolute')
      $('#mydiv').offset(positionBoth)
      $('#getRecipe').css('transform', 'rotate(0deg)')

      $('#recipease-ingredients').html('')
      $('#recipease-instructions').html('')

      open = false
    }
    else {
      $('#getRecipe').css('transform', 'rotate(90deg)')

      instructions = tryEachInTechnique()
      $('#recipease-container').html("<pre id='recipease-recipe'><h1 contenteditable='true'>" + recipeTitle + "</h1><div contenteditable='true' class='paragraph' id='recipease-ingredients'><h2>INGREDIENTS</h2><span id='recipease-html1'><div>" + ingredients + "</div></span></div><div class='paragraph' id='recipease-instructions' contenteditable='true'><h2>INSTRUCTIONS</h2><span id='recipease-html2'><div>" + instructions + "</div></span></div></pre>")
      $('#recipease-recipe').show('300');

      $('#mealClip').show('300');
      $('#saveRecipe').show('300');

      $('#mydivheader').toggleClass('rounded-quick')
      // $('#mydivheader')
      //   .delay(50)
      //   .queue(function (next) { 
      //     $(this).toggleClass('rounded')
      //     // $(this).css({"border-bottom-right-radius": "0px", "border-bottom-left-radius": "0px"}); 
      //     next(); 
      //   });
      // $('#mydivheader').css({"border-bottom-right-radius": "0px", "border-bottom-left-radius": "0px"})

      $('#mydivheader').animate({
        width: 756,
      }, 300, function() {
        // Animation complete.
      });

      positionBoth = $('#mydiv').offset()
      $('#mydiv').toggleClass('absolute')
      $('#mydiv').offset(positionBoth)

      $('#mydivheader')
        .delay(100)
        .queue(function (next) { 
          $('#recipease-minimize').show('100');
          $('#recipease-delete').show('100');
        next(); 
      });



      $('#saveRecipe').click(function() {

        // html2canvas(document.querySelector(".recipease-all")).then(canvas => {
        //     document.body.prepend(canvas)
        // });

        var doc = new jsPDF();

        // We'll make our own renderer to skip this editor
        var specialElementHandlers = {
          '#editor': function(element, renderer){
            return true;
          },
          '.controls': function(element, renderer){
            return true;
          }
        };

        // All units are in the set measurement for the document
        // This can be changed to "pt" (points), "mm" (Default), "cm", "in"

        var doc = new jsPDF();

        // var options = {
        //   pagesplit: true
        // };

        doc.setFont("helvetica");
        doc.setFontType("normal");

        doc.setFontSize("18");

        jsPDFTitle = doc.splitTextToSize($('#recipease-recipe > h1').text(), 180)
        doc.text(105, 25, jsPDFTitle, null, null, 'center');

        doc.setFontSize("14");

        doc.text(25, 50, 'INGREDIENTS');
        doc.text(110, 50, 'INSTRUCTIONS');

        doc.setFontSize("12");

        jsPDFIngredients = "\n" + $('#recipease-html1').html().replace(/<br>/g, "\n\n").replace(/<div>/g, "").replace(/<\/div>/g, "").replace(/&nbsp;/g, "")
        jsPDFInstructions = "\n" + $('#recipease-html2').html().replace(/<br>/g, "\n\n").replace(/<div>/g, "").replace(/<\/div>/g, "").replace(/&nbsp;/g, "")

        if (jsPDFIngredients.length > 800) {
          sliced = jsPDFIngredients.slice(800)
          one = jsPDFIngredients.replace(sliced, '')
          two = sliced
          fixedOne = doc.splitTextToSize(one, 80)
          doc.text(25, 55, fixedOne);
          doc.addPage()
          fixedTwo = doc.splitTextToSize(two, 80)
          doc.text(25, 15, fixedTwo);
        }
        else {
          jsPDFIngredients = doc.splitTextToSize(jsPDFIngredients, 80)
          doc.text(25, 55, jsPDFIngredients);
        };

        doc.setPage(1)

        if (jsPDFInstructions.length > 1200) {
          sliced = jsPDFInstructions.slice(1200)
          one = jsPDFInstructions.replace(sliced, '') + "\n\n\ncontinued on next page..."
          two = sliced
          fixedOne = doc.splitTextToSize(one, 80)
          doc.text(110, 55, fixedOne);
          doc.addPage()
          doc.setPage(2)
          fixedTwo = doc.splitTextToSize(two, 80)
          doc.text(110, 15, fixedTwo);
        }
        else {
          jsPDFInstructions = doc.splitTextToSize(jsPDFInstructions, 80)
          doc.text(110, 55, jsPDFInstructions);
        };

        doc.save(recipeTitle + '.pdf');

      });
      
      open = true
    };
  })


  $('#recipease-minimize').click(function(){
    $('#mydivheader').css('width', '756px')

    // $('#mydivheader')
    //   .delay(50)
    //   .queue(function (next) { 
    //     $(this).css({"border-bottom-right-radius": "30px", "border-bottom-left-radius": "30px"}); 
    //     next(); 
    //   });
    $('#mydivheader').toggleClass('rounded')

    positionBoth = $('#mydiv').offset()
    $('#mydiv').toggleClass('absolute')
    $('#mydiv').offset(positionBoth)

    $('#recipease-recipe').slideToggle('100')
    $('#saveRecipe').toggle('100')
    $('#recipease-delete').toggle('100')
    $('#getRecipe').toggle('100')
  })

  $('#recipease-delete').click(function(){
    $('.recipease-all').remove()
  })





  //Make the DIV element draggagle:
  dragElement(document.getElementById(("mydiv")));

  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
};