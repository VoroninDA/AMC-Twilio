$(document).ready(function () {
debugger;
    ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function(){
        $("#loginform").show();
    }, null);

});