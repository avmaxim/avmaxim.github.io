

/*  validateEmail
    Valid emails conform to the rules stated in the  "email scrubbing standards" document
    In summary, email addresses must be formated as user@domain.suffix.
    Only one @ allowed; @ cannot have a period adjacent to it.
    max of 100 characters on either side of the @ sign.
    User and Domain and suffix can contain only standard alphaNumeric characters (plus: _ - .)
    Optional flagging of spam traps addresses as invalid.
    Inputs:
    *  emailIn - is the address to be validated
    *  errMsg - the error message to be displayed
    *  scrubSpamTraps - will test the user portion to assure the address is not a common spam trap
                        Note: the error message will read: "We do not send to: <user>@...." instead of that provided by errMsg.
    Returns:  true|false (is email valid?) AND sets var emailErrMsg when scrubSpamTrays = Y and value encountered
*/
var emailErrMsgVar = '';
var spamTrapRegx = /^((mailto@)|(abuse@)|(admin@)|(alerts@)|(allstaff@)|(all-staff@)|(arin@)|(blackhole@)|(blacklist@)|(bulkmail@)|(contact@)|(devnull@)|(domain@)|(domreg@)|(domtech@)|(email@)|(ftp@)|(general@)|(help@)|(honeypot@)|(hostmaster@)|(hr@)|(info@)|(information@)|(it@)|(jobs@)|(mailer-daemon@)|(maps@)|(marketing@)|(news@)|(noc@)(nospam@)|(postmaster@)|(privacy@)|(question@)|(rbl@)|(remarks@)|(root@)|(route@)|(sales@)|(security@)|(spam@)|(spamtrap@)|(staffall@)|(support@)|(techsupport@)|(test@)|(usenet@)|(uucp@)|(webmaster@)|(webteam@)|(www@))/ig;

function validateEmail(emailIn, scrubSpamTraps){
    var emailIsValid = true;
    emailErrMsgVar = '';
    
    if(debug){ alert('In validateEmail: ' + emailIn  + ':'  +  scrubSpamTraps + ':'); }
    var regx = /^([A-Za-z0-9_\-\.]){1,100}\@([A-Za-z0-9_\-\.]){1,95}\.([A-Za-z]{2,4})$/;
    if(regx.test(emailIn) == false) { emailIsValid = false; }
    var reg = /(^\.)|(\.\@)|(\@\.)|(\.\.)/;
    if(reg.test(emailIn) == true) { emailIsValid = false; }
    if(scrubSpamTraps){
        if(spamTrapRegx.test(emailIn) == true) { 
            r2 = /\@/;
            var userDomain = new Array;
            userDomain = emailIn.split(r2);
            violation = userDomain[0];
            emailErrMsgVar = 'We do not send to: ' + violation + '@....';
            emailIsValid = false; 
        }
    }
    if(debug){alert('setResult(' + emailIsValid + ', ' +   emailErrMsgVar); }
    return emailIsValid;
}

/**
 * pull out domains for folks that may work for chase in some shape.
 
 */
function isInvalidDomain(email){

    var invalidDomains = ['@jpmc.com','@chase.com','@jpmchase.com','@jpmorgan.com','@jpmorganchase.com','@wamu.com'];

    var domainStart = email.indexOf('@');
    var emailDomain = email.substring(domainStart);
    
    var invalid = false;
    
    for(var i = 0; i < invalidDomains.length; i++) {

        if(emailDomain == invalidDomains[i]) {
           invalid = true;
        }

    }

    return invalid;
}

/* trim 
   * str = any string 
   returns the string input with surrounding white space removed
*/
function trim(str){
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/*
    A more browser agnostic approach to the getElementById() js.js function
    See: Javascript Basics Part 13; By Mark Kahn
     htmlgoodies.com/primers/jsp/article.php/3624446
*/
function getElement(id){
    if(document.getElementById){
        getElement = function(id){ return document.getElementById(id); }; //browserType="modern"; 
    }else if(document.all){
        getElement = function(id){ return document.all[id]; }; //browserType="oldIE"; 
    }else if(document.layers){
        getElement = function(id){ return document.layers[id]; }; //browserType="oldNetScape"; 
    }else{
        getElement = function() {  return null; }; //browserType="oldNoSupport";
    }
    // When we get here, the getElement function has been replaced.
    // So we return the result of the new function.

    return getElement(id);
}



