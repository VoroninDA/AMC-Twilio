function setHeightOfSoftphone()
{
    var heightObj = getHeight();
    
    ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(),heightObj, null);
}

var currentHeight = 0;

function getHeight()
{
    //var profile = getLocalStorageProfile();
    height = 300;

    /*if(profile.phoneNumber)
    {
        var phoneData = getPhoneNumberData(profile.phoneNumber);
       
        height += 130;
        height +=  getCadHeight(phoneData);
    }
    if(profile.outPhoneNumber)
    {
        height+= 130;
    }

    if(profile.warmTransferCallID)
    {
        height+= 130;
    }
    if(profile.conferenceCallID && !profile.conferenceCallCompleted)
    {
        height+= 130;
    }
    else if(profile.conferenceCallID && profile.conferenceCallCompleted)
    {
        height += 210;
    }
    */
    currentHeight = height;
    return { height : height};
}