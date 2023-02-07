ingredientsItems = [" quart", "gallon", "pound ", " cloves", "3/4 ", "2/3 ", "1/4 ", "1/3 ", "1/2 ", " lb", " lbs", "ounce", " oz", " cup", " cups", "tbsp", "tsp", "teaspoons", "teaspoon", "tablespoons", "tablespoon", "¾", "½", "¼"]
function recipeScore(text) {
  score = 0
  for (var i = ingredientsItems.length - 1; i >= 0; i--) {
    if (text.toLowerCase().indexOf(ingredientsItems[i]) >= 0) {
      // console.log(text + " contains "/ + ingredientsItems[i])
      score ++
    };
    // if ($.isNumeric(text.split(' ')[0])) {
    //   score ++
    // };
  };
  return score
}

// function to determine whether ingredients have been found
function foundIngredients(ingredients) {
  console.log("-=-=-=-=-=-=-=-=-=- " + ingredients)
  if (ingredients != undefined && ingredients.length > 0) {return true}
  else {return false};
}

// function that will try each method from most reliable to least reliable
function tryEachTechnique() {
  // BASIC LIST
  var ingList = basicList()
  if (foundIngredients(ingList)) {
    return ingList
  };
  // LIST BY CONTENT
  var ingList = contentList()
  if (foundIngredients(ingList)) {
    return ingList
  };
  // LIST OF PARAGRAPHS
  var ingList = parList()
  if (foundIngredients(ingList)) {
    return ingList
  };

  // // PARAGRAPH BY CONTENT
  // var ingList = parContent()
  // if (foundIngredients(ingList)) {
  //   return ingList
  // };

}










// BASIC LISTS
// return all lists that are siblings of "Ingredients"
function basicList() {
  var potentialIngredientsLists = $("*").filter(function() {
    return $(this).text().toLowerCase().indexOf("ingredients") == 0
  }).parent().find("ul, ol")[0]//.css("background", "red");  

  if (potentialIngredientsLists==undefined) {return false};

  outputFormat = ""

  for (var i = 0; i < potentialIngredientsLists.length; i++) {
    outputFormat += (potentialIngredientsLists[i].innerText) + " \n "
  };

  // console.log(outputFormat)
  return outputFormat
}










// CONTENT LISTS
function contentList() {
  console.log("content list")

  fitsIngrWords = $("*").filter(function() {

    // determines it isn't instructions
    badCharacters = [undefined, "", ".", " "]
    noBadCharacters = true

    children = $(this).children()

    for (var i = 0; i < children.length; i++) {
      if (children[i] != undefined && children[i].innerText != undefined) {
        endChar = children[i].innerText[children[i].innerText.length-1]
        if (badCharacters.includes(endChar)) {
          noBadCharacters = false
        };
        if (children[i].innerText.split(/((\.|\?|\!)\s[A-Z])/g).length > 5) {
          // console.log(children[i].innerText.split(/((\.|\?|\!)\s[A-Z])/g))
          noBadCharacters = false
        };
      };
    };

    if (noBadCharacters && $(this).is('ul, ol')) {
      return recipeScore($(this).text()) > 2 && $(this).children('li').length > 1
    };
  })

  console.log(fitsIngrWords)

  if (fitsIngrWords==undefined) {return undefined};

  outputFormat = ""

  for (var i = 0; i < fitsIngrWords.length; i++) {
    outputFormat += (fitsIngrWords[i].innerText) + " <br>"
    // console.log(fitsIngrWords[i].innerText)
  };

  // console.log(outputFormat)
  return outputFormat

}










// INGREDIENTS BY MULTIPLE PARAGRAPHS
function parList() {

  console.log('multiple paragraphs')

  // a test for 
  function basicTest(object) {
    if (object.html() == undefined) {return false};
    // noServes = (object.html().toLowerCase().search("serves") < 0)
    // noWeirdCharacters = (object.html().toLowerCase().search("serves") < 0) && (object.html().toLowerCase().search("ingredients") < 0) && (object.html().toLowerCase().search("directions") < 0)// && (object.html().toLowerCase().search("·") < 0)
    
    parentsOkay = object.parents('.comments, #comments').length == 0

    // check if is span and isn't part of series of spans
    okaySpan = object.is('span') && (object.next().is('span') && object.next().children().length < 1) == false && (object.parent().is('p') && object.siblings().length < 1 ) == false

    return (object.text().split(/((\.|\?|\!)\s[A-Z])/g).length == 1) && object.text().indexOf(": ") < 0 && parentsOkay && (object.is('p') || okaySpan )// && (object.is('span') && object.innerText == undefined)// && noWeirdCharacters//&& (object.html().toLowerCase().indexOf(":") >= 0 == false))
    // below is an option that allows for periods after each ingredient
    // return (object.text().sub(".", " ").split(/((\.|\?|\!)\s)|(\?|\!)|(\.$)/g).length == 1) && (object.is('p') && noServes )//&& (object.html().toLowerCase().indexOf(":") >= 0 == false))
  }

  // return paragraph-broken ingredients
  // return every p with only one sentence
  // and has at least one ingredient word
  // and everything nearby that is only one sentence
  fitsIngrWords = $("*").filter(function() {
    if (basicTest($(this))) {
      return recipeScore($(this).text()) > 0
    };
  })

  // console.log("hi")
  console.log(fitsIngrWords)

  output = []
  tempIngredients = []

  for (var i = 0; i < fitsIngrWords.length; i++) {

    line = $(fitsIngrWords[i])

    if (tempIngredients.indexOf(line[0]) < 0) {
      if (tempIngredients.length > 0) {
        output.push(tempIngredients)    
        tempIngredients = []
      };

      tempIngredients.push(line[0])
    };

    function checkPrev(current) {
      if (current.prev().length > 0) {
        previous = current.prev()
      }
      else {
        previous = current.parent().prev().children(0)
      };
      if (basicTest(previous)) {
        if (tempIngredients.indexOf(previous[0]) < 0) {
          tempIngredients.unshift(previous[0])
        };
        checkPrev(previous)
      }
      else if (previous.is('div, span, img, aside, wp-ad, script') && previous.innerText == undefined) {
        checkPrev(previous)
      }
    }

    checkPrev(line)

    function checkNext(current) {
      if (current.next().length > 0) {
        next = current.next()
      }
      else {
        next = current.parent().next().children(0)
      };
      if (basicTest(next)) {
        if (tempIngredients.indexOf(next[0]) < 0) {
          tempIngredients.push(next[0])
        };

        checkNext(next)
      }
      else if (next.is('div, span, img, aside, wp-ad, script') && next.innerText == undefined) {
        checkNext(next)
      }
    }
    checkNext(line)
  };

  output.push(tempIngredients)

  // console.log("=-=-=-=-=-=-=-=-=-=-=-=*********")
  // console.log(fitsIngrWords)
  // console.log(output)

  // tempOutput = []
  // for (var i = 0; i < output.length; i++) {
  //   for (var j = 0; j < output[j].length; j++) {
  //     tempOutput.push(output[i][j])
  //   };
  //   tempOutput.push("<br>")
  // };

  // output = tempOutput

  if (output==undefined) {return undefined};

  // console.log(output)

  outputFormat = ""

  for (var i = 0; i < output.length; i++) {
    for (var j = 0; j < output[i].length; j++) {
      outputFormat += (output[i][j].innerText) + " <br>"
    };
    outputFormat += "<br>"
  };

  console.log("lalalalalalala" + outputFormat)
  return outputFormat

}

function runIngredients() {
  ingredients = tryEachTechnique()

  // remove weird words from ingredients
  if (ingredients == undefined) {
    ingredients = "No ingredients found, but you can add them yourself by clicking inside this box."
  }
  else {
    ingredients = ingredients.replace(/ingredients/ig, '')  
  };
}

// console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
// console.log(ingredients)

// function basicFormat(ingredients) {
  // ingredients = ingredients[0].split("\n")
  // $('html').prepend("<pre style='z-index: 999, position: absolute, background: white'><h1>INGREDIENTS</h1>" + ingredients[0].innerText + "</pre>")
  // $('body').prepend("<pre style='width: 50%; z-index: 999999; position: relative; background: white'><h1>INGREDIENTS</h1>" + ingredients + "</pre>")

// }

// basicFormat(ingredients)