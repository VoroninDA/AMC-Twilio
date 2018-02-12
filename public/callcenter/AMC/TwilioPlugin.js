$(document).ready(function () {

    var Config = {};
    var localStorage = window.localStorage;
    var inpHost = window.location.origin;

    ContactCanvas.Channel.enableClickToDial(ContactCanvas.Commons.getSequenceID(), function(){console.log("Click to Dial Enabled");});
    //ContactCanvas.Channel.registerClickToDialEvent(ContactCanvas.Commons.getSequenceID(), clickToDialCallback);


    var iconPath = {};
    iconPath.pluginIconPath = inpHost + "/callcenter/AMC/img/twilio.png";
    ContactCanvas.Channel.addPluginImage(ContactCanvas.Commons.getSequenceID(), iconPath, null);

    //ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function);
    //ContactCanvas.Channel.registerForLogoutEvents(ContactCanvas.Commons.getSequenceID(), function);
    ContactCanvas.Channel.registerContextualControls(ContactCanvas.Commons.getSequenceID(), alert("1"));

    ContactCanvas.Channel.initializationComplete(ContactCanvas.Commons.getSequenceID(), {}, function (data) {
        Config = data.response.data.config;
        ContactCanvas.Channel.addContextualAccessList(ContactCanvas.Commons.getSequenceID(),{ contactsList : []});
    });

//for interaction state changes, please see the workflow and phone controller.

    setHeightOfSoftphone();

})
workerJS.on('reservation.created',
                 function(res){
                        console.log('AMC LOG');
                        console.log(res);
                        console.log('AMC LOG');
                    }, false);