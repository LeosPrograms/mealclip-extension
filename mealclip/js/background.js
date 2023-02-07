// chrome.storage.local.get("keepSharing", function(fetchedData) {
//   while (fetchedData.keepSharing == true) {
//
//
//
//   }
// });




// $(document).ready(function() { 

// 	if (document.title.toLowerCase().indexOf('recipe') >= 0) {
// 		alert('recipe on this page')
// 	};

// });
chrome.browserAction.onClicked.addListener(function(tab) {

		chrome.tabs.executeScript({
		  file: 'js/jquery.min.js'
		});

		chrome.tabs.executeScript({
			file: 'js/bundle.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/jsPDF.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/start.js'
		});

		chrome.tabs.executeScript({
			file: 'js/getIngredients.js'
		});

		chrome.tabs.executeScript({
			file: 'js/getInstructions.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/draggable.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/openRecipe.js'
		});		

});



chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

	if (tab.title.toLowerCase().indexOf('recipe') >= 0 && tab.title.indexOf('Google Search') < 0 && tab.title.indexOf('Bing') < 0 && tab.title.indexOf('DuckDuckGo') < 0) {
	  

		chrome.tabs.executeScript({
		  file: 'js/jquery.min.js'
		});

		chrome.tabs.executeScript({
			file: 'js/bundle.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/jsPDF.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/start.js'
		});

		chrome.tabs.executeScript({
		  file: 'js/draggable.js'
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


	};

  }
})