
var couponFormScripts = {};

couponFormScripts.forSubmitBtn = '';
couponFormScripts.activeErrSpan = null;

// JIRA TSGDC-2495 has 2 input areas: top and bottom requiring adjustments so script for 1 input area works
couponFormScripts.specifyBtnUsed = function (whichBtn) {

    //Hide any previous errors displayed
    $('#email-error-top').hide();
    $('#email-error-bottom').hide();
    $('#email-error-modal').hide();

    if (!!couponFormScripts.forSubmitBtn && couponFormScripts.forSubmitBtn[0] !== '-') {
        //case: couponFormScripts.forSubmitBtn is set through couponFormScripts.activateBtnUsed()
        //ingore the parameter being passed in
        whichBtn = couponFormScripts.forSubmitBtn;
    }

    //Save which button was clicked so that related components can be used
    couponFormScripts.forSubmitBtn = '-' + whichBtn;

    //Save input to a hidden field with name/htmlID used by single input forms
    //AND clear the alternate input of any previously entered value
    var theEmailInput = '';
    if ('top' === whichBtn) {
        $('#email-bottom').val('');
        $('#email-modal').val('');
        theEmailInput = $('#email-top').val();
    } else if ('bottom' === whichBtn) {
        $('#email-top').val('');
        $('#email-modal').val('');
        theEmailInput = $('#email-bottom').val();
    } else {
        $('#email-top').val('');
        $('#email-bottom').val('');
        theEmailInput = $('#email-modal').val();
    }

    $('#email').val(theEmailInput);
    var isValid = couponFormScripts.validateForm();
    if (isValid === true) {
        document.getElementById('CouponLandingForm').submit();
    } else {
        $('#email-error' + couponFormScripts.forSubmitBtn).show();
    }
};

couponFormScripts.activateBtnUsed = function (whichBtn) {
    couponFormScripts.forSubmitBtn = whichBtn;
};

couponFormScripts.scroll = function (toID, offset) {
    if (typeof offset === 'undefined') {
        offset = 0;
    }
    $('html,body').animate({
        scrollTop: $("#" + toID).offset().top - offset
    }, 500);
    return false;
};



/*  Prior to form submission, validate
 *  1. email address is provided and syntatically correct
 *
 *  REQUIREMENTS, page using method must:
 *  1.  set the email input element's id to: email
 *  2.  have HTML element to display the email error msg with id: emailErrMsg
 *  3.  have JS var declared named: scrubSpamTraps and set to true|false
 *  4.  if scrubSpamTraps is true, have html element to display additional spam trap msg with id: longErrMsg
 */
couponFormScripts.validateForm = function () {

    // Validating Email
    var emailIn = document.getElementById('email').value;
    emailIn = trim(emailIn);
    document.getElementById('email').value = emailIn;

    var emailErrMsg = $('#email-error' + couponFormScripts.forSubmitBtn)[0];
    if (emailErrMsg === null) {
        emailErrMsg = document.getElementById('emailErrMsg');
    }
    emailErrMsg.innerHTML = '';
    if (couponFormScripts.needToggle(emailErrMsg)) {
        couponFormScripts.makeVisible(emailErrMsg, false);
    }
    if (scrubSpamTraps === true) {
        document.getElementById('longErrMsg').innerHTML = '';
    }
    var emIsValid = validateEmail(emailIn, scrubSpamTraps);
    if (emIsValid === false) {
        emailErrMsg.innerHTML = 'Please enter a valid email address.';
        if (scrubSpamTraps === true) {
            document.getElementById('longErrMsg').innerHTML = emailErrMsgVar;
        }
    } else {

        if (isInvalidDomain(emailIn)) {
            emIsValid = false;
            emailErrMsg.innerHTML = 'The e-mail address entered is not valid for this offer.';
        }
    }
    if (emIsValid === false && couponFormScripts.needToggle(emailErrMsg)) {
        couponFormScripts.makeVisible(emailErrMsg, true);
    }

    //couponFormScripts.handleOptimizely();
    //if (typeof ($.mklOpt) !== 'undefined') {
        //$.mklOpt();
    //}

    return (emIsValid);
};


/*See if the div has a class of toggleError to decide if we need to hide the error div*/
couponFormScripts.needToggle = function (someDiv) {
    var needsToggle = typeof (someDiv.className) != 'undefined' && someDiv.className != null && someDiv.className.indexOf('toggleError') > -1;
    return needsToggle;
};

/*Show or hide the div*/
couponFormScripts.makeVisible = function (someDiv, show) {
    if (show === true) {
        someDiv.style.display = 'block';
    } else {
        someDiv.style.display = 'none';
    }
};

/*remove ";jsessionid=" tail from "action" of the form tag, when it is the 1st time visit*/
couponFormScripts.adjustFormAction = function () {
    if (!!$('form').length) {
        var formActionAttr = $('form').attr('action');
        var jsessionTailIndex = formActionAttr.toLowerCase().indexOf(';jsessionid=');

        if (jsessionTailIndex >= 0) {
            $('form').attr('action', formActionAttr.substr(0, jsessionTailIndex));
        }
    }
};
