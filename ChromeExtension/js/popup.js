$(function () {
    var url;
    var currentdata;
    var urlId;
    // when popup.html open,send message    ---   conscript
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        url = tabs[0].url;
        urlId = tabs[0].id;
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "searchurl"
        }, function (response) {});
    });
    $('#allPaste').on('change', '.pasteDataInput', function () {
        var selectdatas = $(this).val();
        var $now = $(this);
        var windowUrlAndSelect = chrome.extension.getBackgroundPage().urlAndSelect;
        var urlAndChecked = '{"urlId":' + urlId + ',"nowUrl":"' + url + '","checkedData": "' + selectdatas + '"}';
        urlAndChecked = JSON.parse(urlAndChecked);
        if (windowUrlAndSelect.length > 0) {
            var haveNowUrl = windowUrlAndSelect.find((urlItem) => urlItem.urlId == urlId && urlItem.nowUrl == url);
            if (haveNowUrl == null || haveNowUrl == undefined) {
                windowUrlAndSelect.push(urlAndChecked);
            } else {
                var nowUrlIndex = windowUrlAndSelect.indexOf(haveNowUrl);
                windowUrlAndSelect.splice(nowUrlIndex, 1, urlAndChecked);
            }
        } else {
            windowUrlAndSelect.push(urlAndChecked);
        }

        var detailscurrentdata = currentdata.data.find((item) => item.sectionKey == $(this).val());
        chrome.extension.getBackgroundPage().currentdata = detailscurrentdata;
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "currentdata",
                serverdata: detailscurrentdata
            }, function (response) {
                $now.parent().addClass('item-green');
            });
        });
    })


    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

        if (request.action == 'geturl') {
            url = request.url;
            var datasource = chrome.extension.getBackgroundPage().serverdata;
            currentdata = datasource.find(item => item.url == url);
            if (currentdata != undefined && currentdata != null && currentdata.data) {
                if (currentdata.data.length > 1) {
                    $('#allPaste').css('display', 'block');
                    for (var i = 0; i < currentdata.data.length; i++) {
                        if (currentdata.data[i].sectionKey != undefined && currentdata.data[i].sectionKey != null && !isNull(currentdata.data[i].sectionKey)) {
                            if (currentdata.data[i].isCopied) {
                                $('#allPaste').append("<li class='item-green'><input name='pasteData' class='pasteDataInput' type='radio' value=" + currentdata.data[i].sectionKey + " id=" + currentdata.data[i].sectionKey + "><label for=" + currentdata.data[i].sectionKey + ">" + currentdata.data[i].mark + "</label>");
                            } else {
                                $('#allPaste').append("<li><input name='pasteData' class='pasteDataInput' type='radio' value=" + currentdata.data[i].sectionKey + " id=" + currentdata.data[i].sectionKey + "><label for=" + currentdata.data[i].sectionKey + ">" + currentdata.data[i].mark + "</label>");
                            }
                        }
                    }
                    seletuldata();
                } else {
                    if (currentdata.data.length == 1) {
                        onlyselect();
                    } else {
                        chrome.tabs.query({
                            active: true,
                            currentWindow: true
                        }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                action: "noData"
                            }, function (response) {});
                        });
                    }
                }

            } else {
                Mismatchurl();
            }
        }
    });

    function onlyselect() {
        if (currentdata != undefined && currentdata.data.length == 1) {

            var detailscurrentdata = currentdata.data[0];
            chrome.extension.getBackgroundPage().currentdata = detailscurrentdata;
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "currentdata",
                    serverdata: detailscurrentdata
                }, function (response) {
                    $('.successshow').css('display', 'inline-block');
                });
            });
        }
    }

    function isNull(str) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }


    function Mismatchurl() {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "nosearchurl"
            }, function (response) {});
        });
    }


    function seletuldata() {
        var selectdata = chrome.extension.getBackgroundPage().urlAndSelect.find((urlItem) => urlItem.urlId == urlId && urlItem.nowUrl == url);
        if (selectdata && selectdata.checkedData && selectdata.checkedData != -1) {
            $("[value=" + selectdata.checkedData + "]").prop('checked', 'checked');

        }
    }
});