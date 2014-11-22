var alreadyIn = false;
(function (){
    if(alreadyIn){
        return true;
    }
    alreadyIn = true;
    var $ = window.jQuery;//pre-requisite
    var vid = $('[data-youtube-id]');
    vid = vid && vid[0];

    var isPlaying = false;

    vid.onplay = function(){
        isPlaying = true;
    };

    vid.onpause = vid.onended = function(){
        isPlaying = false;
    };

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        var vid = $('[data-youtube-id]')[0];
        switch(request){
            case 'playPause':
                if(isPlaying){
                    vid.pause();
                }
                vid.play();
                break;
            case 'smallBack':
                vid.currentTime-=1;
                break;
            case 'smallForward':
                vid.currentTime+=1;
                break;
            case 'bigBack':
                vid.currentTime-=5;
                break;
            case 'bigForward':
                vid.currentTime+=5;
                break;
            case 'replay':
                vid.currentTime=0;
                break;
            default :
                return;
        }
    });

    //notify background page
    return vid ? true : false;
})();