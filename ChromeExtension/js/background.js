 window.serverdata = [];
 window.urlAndSelect = [];
 window.datasourcetabsid = 0;
 window.currentdata = "";

 //  Receive data source, replace or add to serverdata
 chrome.extension.onMessage.addListener(
   function (request, sender, sendResponse) {
     if (request.action === "server") {
       for (let index = 0; index < window.urlAndSelect.length; index++) {
         window.urlAndSelect[index].checkedData = -1;
       }
       var flag;
       for (var i = 0; i < request.source.length; i++) {
         flag = true;
         for (var j = 0; j < window.serverdata.length; j++) {
           if (request.source[i].url && (request.source[i].url == window.serverdata[j].url)) {
             window.serverdata[i] = request.source[j];
             flag = false;
             break;
           }
         }
         if (flag && request.source[i].url) {
           window.serverdata.push(request.source[i]);
         }

       }
       window.datasourcetabsid = sender.tab.id;
     } else if (request.action === "copyover") {
       var item;
       window.currentdata.isCopied = true;

       for (var j = 0; j < window.serverdata.length; j++) {
         var item = window.serverdata[j].data.find((item) => item.sectionKey == window.currentdata.sectionKey);
         if (item != undefined) {
           window.serverdata[j].data.splice(window.serverdata[j].data.indexOf(item), 1, window.currentdata);
           break;
         }
       }
       chrome.tabs.query({
         active: true,
         currentWindow: true
       }, function (tabs) {
         chrome.tabs.sendMessage(window.datasourcetabsid, {
           action: "triggerfunc",
           currentdata: window.currentdata
         }, function (response) {});
       });
     }
   }
 );
 chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (window.urlAndSelect.length > 0) {
     var getNowPage = window.urlAndSelect.find((urlItem) => urlItem.urlId == tab.id && urlItem.nowUrl == tab.url);
     if (getNowPage) {
       var nowUrlIndex = window.urlAndSelect.indexOf(getNowPage);
       getNowPage.checkedData = -1;
       window.urlAndSelect.splice(nowUrlIndex, 1, getNowPage);
     }
   }
 })
 chrome.tabs.onRemoved.addListener(function (tabId, changeInfo, tab) {
   if (window.urlAndSelect.length > 0) {
     var getNowPage = window.urlAndSelect.find((urlItem) => urlItem.urlId == tabId);
     if (getNowPage) {
       var nowUrlIndex = window.urlAndSelect.indexOf(getNowPage);
       window.urlAndSelect.splice(nowUrlIndex, 1);
     }
   }
 })