$(document).ready(function () {

    ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function(){
        $("#loginform").show();
    }, null);

});