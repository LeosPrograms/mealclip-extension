// function to determine whether instructions have been found
function foundInstructions(instructions) {
  // console.log("#$#$##$#$#$#$#$#$#$#" + instructions)
  if (instructions != undefined && instructions.length > 0) {return true}
  else {return false};
}

// function that will try each method from most reliable to least reliable
function tryEachInTechnique() {
  runIngredients()
  // // BASIC LIST
  // var enList = basicInList()
  // if (foundInstructions(enList)) {
  //   return enList
  // };
  // LIST BY CONTENT
  // var enList = contentInList()
  // if (foundInstructions(enList)) {
  //   return enList
  // };
  // LIST OF PARAGRAPHS
  var enList = getParagraphInstructions()
  if (foundInstructions(enList)) {
    return enList
  };

}











// FUNCTION TO DECIDE WHAT COLOR TO TURN INSTRUCTIONS
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}










// FUNCTION TO DETECT IF A SENTENCE STARTS WITH OR CONTAINS A CLAUSE THAT STARTS WITH A VERB
impish = function(text) {
  split = text.split(', ')
  output = false
  for (var i = 0; i < split.length; i++) {

    phragment = split[i]
    taggedWords = posTag(phragment)

    if (getTag(taggedWords, 0) == 'CD') {
      if (getTag(taggedWords, 1) == '.') {
        if(getTag(taggedWords, 2) == 'VB'){output = true}
      }
      else {
        if(getTag(taggedWords, 1) == 'VB'){output = true}
      };
    }
    else {
      if(getTag(taggedWords, 0)  == 'VB'){output = true}
    };

  };
  // RETURN TRUE OR FALSE
  return output
}





// FUNCTION TO TAKE TEXT AND BREAK INTO SENTENCES AND RETURN NUMBER OF IMPERATIVE SENTENCES
function countImperatives(thisText) {
  sentences = thisText.split(/([^\.\!\?]*[\.\!\?])/g)
  iScore = 0 //# of imperative sentences
  sScore = 0 //# of sentences
  for (var i = 0; i < sentences.length; i++) {
    if (sentences[i] != undefined && sentences[i] != '' && sentences[i] != '\n') {
      // console.log("NOTIMP :" + sentences[i])
      sScore ++
      if (impish(sentences[i])) {
        // console.log(sentences[i])
        iScore ++
        // console.log(sentences[i])
      }; 
    };
  };
  return [iScore, sScore]
}






// testing what will pass filter
// potentialInstructionsLists = $("*").filter(function() {
//   if ($(this).is('p, span') && (countImperatives($(this).text())[0] > 0)) {
//     console.log($(this).text())
//     return true
//   };
// })

// FUNCTION TO MAKE ARRAY OF P OBJECTS THAT HAVE CERTAIN PERCENTAGE OF IMPERATIVE-SOUNDING SENTENCES
function findImperatives() {

  potentialInstructionsLists = $("*").filter(function() {
    if ($(this).is('p, span, li')) {
      scores = countImperatives($(this).text())
      iScore = scores[0]
      sScore = scores[1]

      parentsOkay = $(this).parents('.comments, #comments').length == 0

      // console.log($(this).children().length)
      isEverything = $(this).is('span') && $(this).children().length < 4
      // console.log($(this).text())
      // console.log(iScore + " / total: " + sScore)
      // console.log("score: " + iScore / sScore)
      return (iScore / sScore) > 0.2 && isEverything == false && parentsOkay
      // return imp($(this).text())    
    };
  }) 
  // console.log(potentialInstructionsLists)
}









// FUNCTION TO DETERMINE IF AN OBJECT SHOULD BE CONSIDERED A NEIGHBOR OF ORIGINAL
function continueCheck(par) {
  // split = par.text().split(/([^\.\!\?]*[\.\!\?])/g)
  split = (par.text() + "ooo").split(/\./g)
  if (split[0] != undefined) {
    parOrSpan = par.is('p, span, li') && (split.length > 1 || par.text().split(" ")[0].toLowerCase() == "step")
    // isImage = par.is('img') || par.find('img').length
    return parOrSpan //|| isImage
  }
  else {
    return false
  };
}

// // define p groups [[group1, score], [group2, score], [group3, score]]
// groups = []













// FUNCTION TO FIND NEXTDOOR NEIGHBORS OF IMPERATIVES
function neighbors() {
  color = getRandomColor();
  group = []
  score = 0
  unScore = 0

  // function consider(paragraph) {
  //   if (group.indexOf(paragraph) >= 0) { 
  //     group.push(paragraph);
  //     if (impish(paragraph) > 0) { 
  //       score ++ 
  //     }
  //     else {
  //       unScore ++
  //     };
  //   };
  // }

  allInstructions = []
  instructions = []

  // for each imperative p
  for (var i = 0; i < potentialInstructionsLists.length; i++) {

    // turn p color
    paragraph = $(potentialInstructionsLists[i])
    // consider(paragraph)
    
    if (instructions.indexOf(paragraph[0]) < 0) {
      // console.log("+++++++++++++++++++++++++++++++++")
      if (instructions.length > 0) {
        allInstructions.push(instructions)
        instructions = []
      };

      instructions.push(paragraph[0])
      // console.log(paragraph[0].innerText)
    };
    // paragraph.css("background", color);

    // recursively check up
    function checkPrev(current) {
      if (current.prev().length > 0) {
        previous = current.prev()
      }
      else {
        previous = current.parent().prev().children(0)
      };
      if (continueCheck(previous)) {
        // consider(previous)
        
        if (instructions.indexOf(previous[0]) < 0) {
          instructions.unshift(previous[0])
          // console.log("pre: " + previous[0].innerText)
        };
        // previous.css("background", color);
        checkPrev(previous)
      }
      else if ( previous.is('div, span, img, aside, wp-ad, script') || previous.children().first().is('img') ) {
        checkPrev(previous)
      }
    }

    // recursively check down
    function checkNext(current) {
      if (current.next().length > 0) {
        next = current.next()
      }
      else {
        next = current.parent().next().children(0)
      };
      if (continueCheck(next)) {
        // consider(next)
        if (instructions.indexOf(next[0]) < 0) {
          instructions.push(next[0])
          // console.log(next[0].innerText)
        };
        // next.css("background", color);
        checkNext(next)
      }
      else if ( next.is('div, span, img, aside, wp-ad, script') || next.children().first().is('img') ) {
        // console.log("passed because div im or aside")
        // console.log(next.first().is('img'))
        checkNext(next)
      };
    }

    // check prev and then next (recursive)
    checkPrev(paragraph)
    checkNext(paragraph)
  }; 
  // groups.push([group, score > unScore])
}

function getParagraphInstructions() {

  // CALL FUNCTIONS TO TURN INSTRUCTIONS RANDOM COLOR
  findImperatives()
  neighbors()

  allInstructions.push(instructions)

  // console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
  // console.log(allInstructions)


  // find most instrucsionsy instructions
  instructions = []
  var highest = 0
  for (var i = 0; i < allInstructions.length; i++) {
    var score = 0
    var lines = 0
    for (var j = 0; j < allInstructions[i].length; j++) {
      lines ++
      // console.log(allInstructions[i][j].innerText)
      if (countImperatives(allInstructions[i][j].innerText)[0] > 0) {
        // console.log(allInstructions[i][j].innerText)
        score += countImperatives(allInstructions[i][j].innerText)[0]
      };
    };

    // console.log(score + " / " + lines + " = " + score/lines)
    if (score > highest) {
      instructions = allInstructions[i]
      highest = score
    };
  };

  // console.log(allInstructions)

  // format instructions for output
  output = ""

  for (var i = 0; i < instructions.length; i++) {
    output += instructions[i].innerText + "\n"
  };

  // remove ingredients from instructions
  if (ingredients != undefined) {
    allIngredients = ingredients.split("\n")
    // }
    // else {
    //   allIngredients = ['']
    // };

    // console.log(allIngredients)
    // if (output.split(allIngredients[allIngredients.length-2])[1] != undefined) {
    //   output = output.split(allIngredients[allIngredients.length-2])[1]
    // };

    for (var i = 0; i < allIngredients.length; i++) {
      item = allIngredients[i].replace('<br>', '\n')

      output = output.replace(item, '')
    };

    output = output.replace(/\n/g, '<br>')

    // Replace newlines with breaks, but not three at a time
    ingredients = ingredients.replace(/\n/g, '<br>')
    ingredients = ingredients.replace(/<br> <br> <br>/g, '')
    output = output.replace(/<br><br><br>/g, '')
  };


  // console.log(allIngredients)
  // console.log(output)

  // if (ingredients == undefined) {ingredients = 'No ingredients found, but you can add them yourself by clicking inside this box.'};

  // ingredientWords = ingredients.split(" ")
  // endWord = ingredientWords[ingredientWords.length-1]
  // if (endWord != undefined && endWord.replace(/\ /g, "").length > 2) {
  //   splitter = ingredientWords[ingredientWords.length-1]
  //   splitEnd = output.split(splitter)[1]
  //   if (splitEnd != undefined) {
  //       output = splitEnd
  //   };
  // };

  // get rid of the word 'instructions'
  output = output.replace(/Instructions: /ig, '')
  output = output.replace(/instructions/ig, '')
  output = output.replace(/Instructions/ig, '')
  output = output.replace(/INSTRUCTIONS/ig, '')

  console.log("wwwwwwww")
  console.log(output)
  console.log("xxxxxxxx")

  return(output)

};








// // CONTENT LISTS
// function contentInList() {
//   console.log("content list for instructions")

//   fitsInWords = $("*").filter(function() {
//     if ($(this).is('ul, ol')) {
//       console.log($(this).text())
//       return countImperatives($(this).text())[1] > 2
//     };
//   })

//   console.log(fitsInWords)

//   if (fitsInWords==undefined) {return undefined};

//   outputFormat = ""

//   for (var i = 0; i < fitsInWords.length; i++) {
//     outputFormat += (fitsInWords[i].innerText) + "\n"
//   };

//   return fitsInWords

// }











// tryEachInTechnique()
// console.log(tryEachInTechnique())

// instructions = getParagraphInstructions()

// $('.recipease-all').append("<pre id='recipease-recipe'><h1 contenteditable='true'>" + document.title + "</h1><div contenteditable='true' class='paragraph' id='recipease-ingredients'><h2>INGREDIENTS</h2>" + ingredients + "</div><div class='paragraph' id='recipease-instructions' contenteditable='true'><h2>INSTRUCTIONS</h2>" + instructions + "</div></pre>")
