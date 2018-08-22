chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "currentdata") {
            var pagedata = request.serverdata;
            var tab = request.currenttab;
            var localHref = window.location.href;
            // add data to page
            if (pagedata&&pagedata.content!=undefined) {
                // if(localHref.indexOf(pagedata.url)>=0){
                //The loop determines whether the target tag of the data source has a checkbox type and is initialized to false first.
                for (var i = 0; i < pagedata.content.length; i++) {
                    if (pagedata.content[i].id) {
                        ctrl = $("#" + pagedata.content[i].id);
                    } else if (pagedata.content[i].name) {
                        ctrl = $("[name=" + pagedata.content[i].name + "]");
                    } else if (pagedata.content[i].path) {
                        ctrl = $(pagedata.content[i].path);
                    }
                    if (ctrl[0] != undefined) {
                        if ((ctrl[0].type === "checkbox" || ctrl[0].type === "radio")) {
                            for (var k = 0; k < ctrl.length; k++) {
                                ctrl[k].checked = false;
                            }
                        }
                    }
                }
                //The loop determines whether the target tag of the data source has a checkbox type and is initialized to false first.---end
                for (var i = 0; i < pagedata.content.length; i++) {
                    if (pagedata.content[i].id) {
                        ctrl = $("#" + pagedata.content[i].id);
                    } else if (pagedata.content[i].name) {
                        ctrl = $("[name=" + pagedata.content[i].name + "]");
                    } else if (pagedata.content[i].path) {
                        ctrl = $(pagedata.content[i].path);
                    }
                    // If it is single or multiple choice
                    if (ctrl[0] != undefined) {
                        if (ctrl[0].type === 'checkbox' || ctrl[0].type === 'radio') {
                            // If the name is the same and more than one is multiple choice, find and select
                            if (ctrl.length > 1) {
                                for (var j = 0; j < ctrl.length; j++) {
                                    if ((ctrl[j].value === pagedata.content[i].value)) {
                                        ctrl[j].checked = true;
                                    }
                                }
                            } else {
                                // If only one is directly selected
                                ctrl.prop("checked", true);
                            }
                        } else {
                            // Other assignments
                                ctrl.val(pagedata.content[i].value);
                        }
                    }

                }
                // } 
            }

            //Notify other pages
            chrome.runtime.sendMessage({
                action: "copyover",
                key: pagedata.sectionKey
            });
        } else if (request.action === "searchurl") {
            chrome.runtime.sendMessage({
                action: "geturl",
                url: window.location.href
            });
        } else if (request.action === "saveCurrentCheck") {
            chrome.runtime.sendMessage({
                action: "saveCheck",
                source: request.checkData
            });
        } else if (request.action === "triggerfunc") {
           window.postMessage(request.currentdata, window.location.href);
        }
    }
);

// Url does not match
// 　　　　 data: {'orderinfo': sss},
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == 'nosearchurl') {
        alert('Invalid url!');
    }
    if(request.action == 'noData'){
        alert('Data is null!');
    }
});

// Listening event trigger
$(function () {
    if (document.getElementById('ChromeExtensionData') != null) {
        document.getElementById('ChromeExtensionData').addEventListener('myCustomEvent', function () {
            var localHref = window.location.href;
            var eventData = $("#ChromeExtensionData").val();
            var eventDatajson = '{"source":' + eventData + ',"sourceUrl": "' + localHref + '"}';
            try {
                eventDatajson = JSON.parse(eventDatajson);
                chrome.runtime.sendMessage({
                    action: "server",
                    source: eventDatajson.source,
                },function(e){
                    alert('data has been copied');
                });
            } catch (error) {
                alert('incorrect data');
            }
          
        });
    }
})