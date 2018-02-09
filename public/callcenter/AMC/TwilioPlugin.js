
//Pre-document ready, set softphone height.
ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(),{height:300});

$(document).ready(function () {

    var Config = {};
    var localStorage = window.localStorage;
    var inpHost = window.location.origin;

    ContactCanvas.Channel.enableClickToDial(ContactCanvas.Commons.getSequenceID(), function(){console.log("Click to Dial Enabled");});
    //ContactCanvas.Channel.registerClickToDialEvent(ContactCanvas.Commons.getSequenceID(), clickToDialCallback);


    var iconPath = {};
    iconPath.pluginIconPath = inpHost + "/img/twilio.png";
    ContactCanvas.Channel.addPluginImage(ContactCanvas.Commons.getSequenceID(), iconPath, null);



    //ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function);
    //ContactCanvas.Channel.registerForLogoutEvents(ContactCanvas.Commons.getSequenceID(), function);
    //ContactCanvas.Channel.registerContextualControls(ContactCanvas.Commons.getSequenceID(), function);
})