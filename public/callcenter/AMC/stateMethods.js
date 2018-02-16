
// #region state methods.


function processReadyStatus() {
    var profile = getLocalStorageProfile();

    setVisiblityOfElement("divIncomingCall", true);
    setVisiblityOfElement("divLoginPanel", false);

    //check if the phone number is alrady available in the profile.
    //if yes then use that number or generate new number.
    var phoneNumber = null;
    if (profile.phoneNumber) {
        phoneNumber = profile.phoneNumber;
    }
    else {
        var phoneNumberData = getNextPhoneNumberData();
        displayCADData(phoneNumberData);
        phoneNumber = Object.keys(phoneNumberData)[0];
        profile.startTime = new Date().getTime() / 1000;
        unholdInboundCall(false);
    }
    profile.phoneNumber = phoneNumber;
    profile.activeCall = true;

    if(!profile.inboundInteractionID )
    {
        profile.inboundInteractionID = ContactCanvas.Commons.getSequenceID();
    }

    if(!profile.inboundScenarioId )
    {
        profile.inboundScenarioId = ContactCanvas.Commons.getSequenceID();
    }


    $('#tbPhoneNumberID').val(phoneNumber);
    setTitleAndValue('tbPhoneNumberSideId',phoneNumber, phoneNumber);

    if (profile.activeCall && profile.callAnswered) {
        // $("#AnswerCallId").hide();
        $("#divIncomingCallAnswer").hide(); 
        $("#divIncomingCallOptions").show();
        $("#DropCallId").show();
    }
    else {
        // $("#AnswerCallId").show();
        $("#divIncomingCallAnswer").show(); 
        $("#divIncomingCallOptions").hide();
        $("#DropCallId").hide();
    }


    setLocalStorageProfile(profile);

    startCallCounter();

    setAnAlertingInteraction(phoneNumber);

    ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
        presence: "On an interaction"
    }, null);

}


function processOnInteractionState() {

    //check if the call ins incoming or outgoing 
    //depending on that make a proper call.

    var profile = getLocalStorageProfile();
    if (profile.outPhoneNumber) {
        displayOutgoingPhoneDetails(profile.outPhoneNumber);
    }
    if (profile.phoneNumber) {
        displayIncomingCallDetails();
    }
    if(profile.warmTransferCallID)
    {
        displayWarmTransferCallDetails(profile.warmTransferCallID);
    }
    if(profile.conferenceCallID && !profile.conferenceCallCompleted)
    {
        displayConferenceCall(profile.conferenceCallID);
    }
    else if(profile.conferenceCallID && profile.conferenceCallCompleted)
    {
        completeConferenceCall();
    }

}

function afterDropCallProcessState() {
    var profile = getLocalStorageProfile();
    if ((profile.phoneNumber && !profile.outPhoneNumber)
        || (!profile.phoneNumber && profile.outPhoneNumber)
    || (!profile.phoneNumber && !profile.outPhoneNumber)) {
        if (profile.CurrentPresence != undefined && profile.CurrentPresence.presence != undefined && profile.CurrentPresence.presence.includes("Not Ready")) {
            ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
                presence: "Not Ready"
            }, null);
        }
        else if (profile.CurrentPresence != undefined && profile.CurrentPresence.presence != undefined && profile.CurrentPresence.presence.includes("Ready")) {
            ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
                presence: "Ready"
            }, null);
        }
        else {
            ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
                presence: "ACW"
            }, null);
        }

    }
}

function setAnAlertingInteraction(phoneNumber) {
    console.log("called setAnAlertingInteraction");
    var profile = getLocalStorageProfile();

    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    var cadDataInbound = getPhoneNumberCadData(phoneNumber);
    if(cadDataInbound)
    {
        Object.keys(cadDataInbound).forEach(function(key) {
           
            var val = cadDataInbound[key];
            details.setField(key,"","",val);
        });
    }

    details.setPhone("", "", phoneNumber);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Inbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Alerting;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.inboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.inboundScenarioId,
    }, function (msg) {
    });
}

function setConnectedInboundState(phoneNumber)
{
    console.log("called setConnectedInboundState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");

    var cadDataInbound = getPhoneNumberCadData(phoneNumber);
    if(cadDataInbound)
    {
        Object.keys(cadDataInbound).forEach(function(key) {
           
            var val = cadDataInbound[key];
            details.setField(key,"","",val);
        });
    }
    
    details.setPhone("", "", phoneNumber);


    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Inbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Connected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.inboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.inboundScenarioId
    }, function (msg) {
    });
}

function setOnHoldInboundState(phoneNumber)
{
    console.log("called setOnHoldInboundState");

    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");

    var cadDataInbound = getPhoneNumberCadData(phoneNumber);
    if(cadDataInbound)
    {
        Object.keys(cadDataInbound).forEach(function(key) {
           
            var val = cadDataInbound[key];
            details.setField(key,"","",val);
        });
    }

    details.setPhone("", "", phoneNumber);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Inbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.OnHold;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.inboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.inboundScenarioId
    }, function (msg) {
    });

}

function setDisconnectedInboundState(phoneNumber)
{
    console.log("called setDisconnectedInboundState");

    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");

    var cadDataInbound = getPhoneNumberCadData(phoneNumber);
    if(cadDataInbound)
    {
        Object.keys(cadDataInbound).forEach(function(key) {
           
            var val = cadDataInbound[key];
            details.setField(key,"","",val);
        });
    }
    
    details.setPhone("", "", phoneNumber);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Inbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Disconnected;

    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.inboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.inboundScenarioId
    }, function (msg) {
    });

}

function setConnectedOutboundState(outPhoneNumber) {
    console.log("called setConnectedOutboundState");


    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", outPhoneNumber);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Outbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Connected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.outboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.outboundScenarioId
    }, function (msg) {
    });
}

function setOnHoldOutboundState(outPhoneNumber){
    console.log("called setOnHoldOutboundState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", outPhoneNumber);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Outbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.OnHold;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.outboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.outboundScenarioId
    }, function (msg) {
    });
}

function setDisconnectedOutboundState(outPhoneNumber)
{
    console.log("called setDisconnectedOutboundState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", outPhoneNumber);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Outbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Disconnected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.outboundInteractionID,
        interactionDirection: direction,
        scenarioId: profile.outboundScenarioId
    }, function (msg) {
    });
}

function setConnectedWarmTrnasferState(warmTransferCallID)
{
    console.log("called setConnectedWarmTrnasferState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", warmTransferCallID);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Internal; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Connected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.warmTransferInteractionId,
        interactionDirection: direction,
        scenarioId: profile.isInboundWarmTransfer? profile.inboundScenarioId:profile.outboundScenarioId
    }, function (msg) {
    });
}

function setOnHoldWarmTrnasferState(warmTransferCallID)
{
    console.log("called setConnectedWarmTrnasferState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", warmTransferCallID);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Internal; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.OnHold;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.warmTransferInteractionId,
        interactionDirection: direction,
        scenarioId: profile.isInboundWarmTransfer? profile.inboundScenarioId:profile.outboundScenarioId
    }, function (msg) {
    });
}

function setDisonnectedWarmTrnasferState(warmTransferCallID)
{
    console.log("called setConnectedWarmTrnasferState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", warmTransferCallID);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Internal; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Disconnected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.warmTransferInteractionId,
        interactionDirection: direction,
        scenarioId: profile.isInboundWarmTransfer? profile.inboundScenarioId:profile.outboundScenarioId
    }, function (msg) {
    });
}

function setConnectedConferenceState(conferenceCallId)
{
    console.log("called setConnectedConferenceState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", conferenceCallId);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Internal; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Connected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.conferenceInteractionId,
        interactionDirection: direction,
        scenarioId: profile.isConferenceFromInboundCall? profile.inboundScenarioId:profile.outboundScenarioId
    }, function (msg) {
    });
}

function setOnholdConferenceState(conferenceCallId)
{
    console.log("called setConnectedConferenceState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", conferenceCallId);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Internal; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.OnHoldl;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.conferenceInteractionId,
        interactionDirection: direction,
        scenarioId: profile.isConferenceFromInboundCall? profile.inboundScenarioId:profile.outboundScenarioId
    }, function (msg) {
    });
}

function setDisconnectedConferenceState(conferenceCallId)
{
    console.log("called setConnectedConferenceState");
    var profile = getLocalStorageProfile();
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    details.setPhone("", "", conferenceCallId);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Internal; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Disconnected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: profile.conferenceInteractionId,
        interactionDirection: direction,
        scenarioId: profile.isConferenceFromInboundCall? profile.inboundScenarioId:profile.outboundScenarioId
    }, function (msg) {
    });
}

function processPresence(res) {
    var profile = getLocalStorageProfile();
    var newPresence = res.request.data;

    if (!profile.CurrentPresence) {
        profile.CurrentPresence = {};
        setLocalStorageProfile(profile);
    }
    profile = getLocalStorageProfile();
    if (!isThePresenceSame(newPresence, profile.CurrentPresence)) {
        if (newPresence.presence === "Ready") {
            setTimeout(processReadyStatus, nextCallWaitPeriod);

        }

        if (newPresence.presence === "On an interaction" || newPresence.presence.includes("Pending")) {

            processOnInteractionState();
        }
        profile = getLocalStorageProfile();
        profile.CurrentPresence.presence = newPresence.presence;
        profile.CurrentPresence.reason = newPresence.reason;
        setLocalStorageProfile(profile);
        if (newPresence.presence != "Ready") {
            ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), newPresence);
        }
    }
    else {
        if (newPresence.presence === "On an interaction" || newPresence.presence.includes("Pending")) {

            processOnInteractionState();
        }
    }
}

// #endregion.
