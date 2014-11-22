// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var videoControllerModule = (function () {
    this.playPause = function () {
        chrome.tabs.sendMessage(currentTabId, 'playPause');
    };

    this.smallBack = function () {
        chrome.tabs.sendMessage(currentTabId, 'smallBack');
    };

    this.smallForward = function () {
        chrome.tabs.sendMessage(currentTabId, 'smallForward');
    };

    this.bigBack = function () {
        chrome.tabs.sendMessage(currentTabId, 'bigBack');
    };

    this.bigForward = function () {
        chrome.tabs.sendMessage(currentTabId, 'bigForward');
    };

    this.replay = function () {
        chrome.tabs.sendMessage(currentTabId, 'replay');
    };
    return this;
})();


var currentTabId = -1,
    currentTabIndex = -1;


window.onload = function () {
    var injectToVideoTab = function (tabId, tabIndex) {
        chrome.tabs.executeScript(tabId, {file: 'js/jquery-2.1.1.min.js'}, function (resultArrayJquery) {
            if (resultArrayJquery[0]) {
                chrome.tabs.executeScript(tabId, {file: 'js/videoObjController.js'}, function (resultArrayController) {
                    if (resultArrayController[0]) {
                        currentTabId = tabId;
                        currentTabIndex = tabIndex;
                    }
                    else {
                        //too bad...
                        console.log('Could not inject video controller');
                    }
                });
            }
            else {
                //too bad...
                console.log('Could not inject jQuery');
            }
        });
    };

    var resetVideoElement = function () {
        currentTabId = currentTabIndex = -1;
    };

    var getYouTubeTab = function () {
        chrome.tabs.query({url: '*://*.youtube.com/watch*'}, function (tabs) {
            if (tabs && tabs.length > 0) {
                var tab = tabs[tabs.length - 1];
                injectToVideoTab(tab.id, tab.index);
            }
            else {
                resetVideoElement();
            }
        });
    };


    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status !== 'complete') {
            return;
        }
        //handle only relevant tabs >= currentTabId
        //our tab was changed
        if (tab.index === currentTabIndex) {
            //still watching a video, not actions are need to be made
            chrome.tabs.query({index: tab.index, url: '*://*.youtube.com/watch*'}, function (tabs) {
                if (!tabs || !tabs.length > 0) {
                    getYouTubeTab()
                }
            });
        }
        else if (tab.index > currentTabIndex) {
            //new tab url is youtube
            chrome.tabs.query({index: tab.index, url: '*://*.youtube.com/watch*'}, function (tabs) {
                if (tabs && tabs.length > 0) {
                    injectToVideoTab(tab.id, tab.index);
                }
            });
        }
    });

    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        //oh oh, need to find a new youtube video
        if (tabId === currentTabId) {
            getYouTubeTab();
        }
    });


    //###### Start Here ######//
    getYouTubeTab();

    this.check = videoControllerModule;
};