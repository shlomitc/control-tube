// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
//chrome.extension.onMessage.addListener(
//  function(request, sender, sendResponse) {
//  	chrome.pageAction.show(sender.tab.id);
//    sendResponse();
//  });


var $ = window.jQuery;
var vid,
    currentTabId = -1,
    currentTabIndex = -1;

window.onload = function () {


    var updateVideoElement = function () {
        vid = $('[data-youtube-id]');
    };

    var resetVideoElement = function () {
        vid = undefined;
        currentTabId = currentTabIndex = -1;
    };

    var getYouTubeTab = function () {
        chrome.tabs.query({url: '*://*.youtube.com/watch*'}, function (tabs) {
            if (tabs && tabs.length > 0) {
                currentTabId = tabs[tabs.length-1].id;
                currentTabIndex = tabs[tabs.length-1].index;
                updateVideoElement()
            }
            else {
                resetVideoElement();
            }
        });
    };



    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if(changeInfo.status!=='complete'){
            return;
        }

        //handle only relevant tabs >= currentTabId
        console.log('*** line[48] ***', tabId, changeInfo, tab);
        //our tab was changed
        if (tab.index === currentTabIndex) {
            //still watching a video, not actions are need to be made
            chrome.tabs.query({index:tab.index, url: '*://*.youtube.com/watch*'}, function(tabs){
                if (!tabs || !tabs.length > 0) {
                    getYouTubeTab()
                }
            });
        }
        else if (tab.index > currentTabIndex) {
            console.log('*** line[67] ***', tab);
            //new tab url is youtube
            chrome.tabs.query({index:tab.index, url: '*://*.youtube.com/watch*'}, function(tabs){
                if (tabs && tabs.length > 0) {
                    currentTabId = tabId;
                    currentTabIndex = tab.index;
                    updateVideoElement();
                }
            });
        }
    });

    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        console.log('*** line[70] ***', tabId, removeInfo);
        //oh oh, need to find a new youtube video
        if (tabId === currentTabId) {
            getYouTubeTab();
        }
    });



    //###### Start Here ######//
    getYouTubeTab();


};