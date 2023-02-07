var bgpage = chrome.extension.getBackgroundPage();

// function startInstaFollowingNow() {
//   // chrome.storage.local.set({'followInstagramers': true});
//   chrome.tabs.executeScript({
//     file: 'js/getIngredients.js'
//   });
// }

// function stopInstaFollowingNow() {
//   chrome.tabs.executeScript({
//     file: 'js/draggable.js'
//   });

//   chrome.tabs.executeScript({
//     file: 'js/openRecipe.js'
//   });  
// }

// document.getElementById('startInstaFollowing').addEventListener('click', startInstaFollowingNow);
document.getElementById('stopInstaFollowing').addEventListener('click', stopInstaFollowingNow);

chrome.tabs.executeScript({
  file: 'js/jquery.min.js'
});

chrome.tabs.executeScript({
  file: 'js/jsPDF.js'
});

chrome.tabs.executeScript({
  file: 'js/start.js'
});

// chrome.tabs.executeScript({
//   file: 'js/draggable.js'
// });

chrome.tabs.executeScript({
	file: 'js/bundle.js'
});

// chrome.tabs.executeScript({
//   file: 'js/html2canvas.min.js'
// });

// ========
  // chrome.storage.local.set({'followInstagramers': true});
  chrome.tabs.executeScript({
    file: 'js/getIngredients.js'
  });

  // chrome.storage.local.set({'followInstagramers': false });
  chrome.tabs.executeScript({
    file: 'js/getInstructions.js'
  });
// ========

  chrome.tabs.executeScript({
    file: 'js/draggable.js'
  });

  chrome.tabs.executeScript({
    file: 'js/openRecipe.js'
  });  