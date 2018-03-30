chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "paste") {
            var pagedata = request.serverdata;
            var tab = request.currenttab;
            var localHref=window.location.href;
            // 添加数据到页面
                if(pagedata){
                    if(localHref.indexOf(pagedata.url)>=0){
                        //循环判断数据源的目标标签有没有checkbox类型的有就先初始化为false
                        for(var i=0;i<pagedata.data.length;i++){
                            if(pagedata.data[i].id){
                              ctrl=$("#"+pagedata.data[i].id);
                            }
                            else if(pagedata.data[i].name){
                              ctrl=$("[name="+pagedata.data[i].name+"]");                    
                            }
                            else if(pagedata.data[i].path){
                                ctrl=$(pagedata.data[i].path);           
                            }   
                            if((ctrl[0].type==="checkbox" || ctrl[0].type==="radio")){
                                for(var k =0;k<ctrl.length;k++){
                                    ctrl[k].checked=false;
                                }

                            }
                        }
                         //循环判断数据源的目标标签有没有checkbox类型的有就先初始化为false---end
                        for(var i=0;i<pagedata.data.length;i++){
                            if(pagedata.data[i].id){
                              ctrl=$("#"+pagedata.data[i].id);
                            }
                            else if(pagedata.data[i].name){
                              ctrl=$("[name="+pagedata.data[i].name+"]");                    
                            }
                            else if(pagedata.data[i].path){
                                ctrl=$(pagedata.data[i].path);           
                            }          
                            // 如果为单选或者多选
                            if(ctrl[0].type === 'checkbox'|| ctrl[0].type === 'radio'){
                                // 如果name相同并有多个是多选，找到并选中
                                if(ctrl.length>1){
                                  for(var j =0;j<ctrl.length;j++){
                                    if(ctrl[j].value === pagedata.data[i].value){
                                        ctrl[j].checked=true;
                                    }
                                  }
                                }else{
                                    // 如果只有一个直接选中
                                    ctrl.prop("checked",true);
                                }
                            }else{
                                // 其他的赋值
                                ctrl.val(pagedata.data[i].value);
                            }                      
                        }
                    } 
                }
        } 
    }
);
// 监听事件触发
$(function () {
    if( document.getElementById('ChromeExtensionData') != null){
        document.getElementById('ChromeExtensionData').addEventListener('myCustomEvent', function() {
            var localHref=window.location.href;
            var eventData =$("#ChromeExtensionData").val();
            var eventDatajson = '{"source":'+eventData+',"sourceUrl": "'+localHref+'"}';
            eventDatajson = JSON.parse(eventDatajson);
            chrome.runtime.sendMessage({
                action: "server",
                source: eventDatajson
            });
          });
    }
  })


