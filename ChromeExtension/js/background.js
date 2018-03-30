 window.serverdata = [];
 chrome.browserAction.onClicked.addListener(function (tab){
   var pagedata = null;
  //  找到目标数据源
   pagedata = window.serverdata.find((res) => res.source.find( (item) => item.url.indexOf(tab.url) != -1));
   pagedata = pagedata.source.find((res) => res.url.indexOf(tab.url) != -1);
  //  传输页面所需数据
  if(pagedata != undefined){
    chrome.tabs.sendMessage(tab.id, {action:"paste",currenttab: tab, serverdata: pagedata}, function(respond){
    }); 
  }
 })
//  接收数据源 替换或添加到serverdata
 chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.action === "server") {
          var flag = true;
          for(var i = 0;i<window.serverdata.length;i++){
            if(window.serverdata[i].sourceUrl === request.source.sourceUrl){
              window.serverdata[i] = request.source;
                flag = false;
            }
          }
          if(flag){
            window.serverdata.push(request.source);
          }
      }
  }
);
