$(function() {

    // Adding the validator for credit card expiry date check
    $.fn.bootstrapValidator.validators.creditCardExpiry = {
        validate: function(validator, $field, options) {

            // We do not want to validate against en empty
            // field, let the notEmpty validator do that job
            if (!$field.val())
                return true;

            function normalizeYear(year){
                // Century fix
                var YEARS_AHEAD = 20;
                if (year < 100){
                    var nowYear = new Date().getFullYear();
                    year += Math.floor(nowYear/100) * 100;
                    if (year > nowYear + YEARS_AHEAD) {
                        year -= 100;
                    } else if (year <= nowYear - 100 + YEARS_AHEAD) {
                        year += 100;
                    }
                }
                return year;
            }

            var match, exp, now, currentMonth;

            match = $field.val().match(/^\s*(0?[1-9]|1[0-2])\/(\d\d|\d{4})\s*$/);

            if (!match) {
                return false;
            }

            exp = new Date(normalizeYear(1*match[2]), 1*match[1]-1, 1).valueOf();

            now = new Date();

            currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).valueOf();

            return exp > currentMonth;

        }
    };

    // Initializing validation on the demo fields form
    $('#validationDemoForm').bootstrapValidator({
        // For more setting options, see http://bootstrapvalidator.com/settings/

        // Enable live validation
        live: 'enabled',

        // We are using ionicons icons but glyphicons
        // or font-awesome icons can be used as well
        feedbackIcons: {
            valid: 'ion-ios7-checkmark-outline',
            invalid: 'ion-ios7-close-outline',
            validating: 'ion-ios7-reloading'
        },

        // Define field validations
        // To know more about the different validators, visit -
        // http://bootstrapvalidator.com/validators/
        fields: {
            'required-text': { message: 'This field is required' },
            email: {
                validators: {
                    notEmpty: { message: 'Email address is required' },
                    emailAddress: { message: 'This is not a valid email address' }
                }
            },
            password: {
                validators: {
                    notEmpty: { message: 'Password is required' },
                    identical: {
                        field: 'confirm-password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            },
            'confirm-password': {
                validators: {
                    notEmpty: { message: 'Password confirmation is required' },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            },
            number: {
                validators: {
                    notEmpty: { message: 'Integer is required' },
                    integer: { message: 'This is not an integer' }
                }
            },
            zip: {
                validators: {
                    notEmpty: { message: 'ZIP code is required' },
                    zipCode: { message: 'This is not a valid ZIP code', country: 'US' }
                }
            },
            phone: {
                validators: {
                    notEmpty: { message: 'Phone number is required' },
                    phone: { message: 'This is not a valid phone number', country: 'US' }
                }
            },
            url: {
                validators: {
                    notEmpty: { message: 'URL is required' },
                    uri: { message: 'This is not a valid URL' }
                }
            },
            'ip-address': {
                validators: {
                    notEmpty: { message: 'IP address is required' },
                    ip: { message: 'This is not a valid IP address' }
                }
            },
            isbn: {
                validators: {
                    notEmpty: { message: 'ISBN is required' },
                    isbn: { message: 'This is not a valid ISBN' }
                }
            }
        }
    });

    // Initializing validation on the sample credit card form
    $('#creditCardForm').bootstrapValidator({
        live: 'enabled',
        fields: {
            'credit-card-name': { message: 'Card Holder\'s Name is required' },
            'credit-card-num': {
                validators: {
                    notEmpty: { message: 'Credit Card Number is required' },
                    creditCard: { message: 'Invalid Credit Card number' }
                }
            },
            'credit-card-expiry': {
                validators: {
                    notEmpty: { message: 'Credit Card Expiry is required' },
                    creditCardExpiry: { message: 'Invalid Expiry Date' }
                }
            },
            'credit-card-cvv': {
                validators: {
                    notEmpty: { message: 'CVV code is required' },
                    cvv: {
                        creditCardField: 'credit-card-num',
                        message: 'Invalid CVV code'
                    }
                }
            }
        }
    });


    $('#registrationForm').bootstrapValidator({
        live: 'enabled',
        fields: {
            'registration-name': { message: 'Please enter your full name' },
            'registration-username': { message: 'Please enter your desired username' },
            'registration-email': {
                validators: {
                    notEmpty: { message: 'Email address is required' },
                    emailAddress: { message: 'This is not a valid email address' }
                }
            },
            'registration-password': {
                validators: {
                    notEmpty: { message: 'Password is required' },
                    identical: {
                        field: 'registration-confirm-password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            },
            'registration-confirm-password': {
                validators: {
                    notEmpty: { message: 'Password confirmation is required' },
                    identical: {
                        field: 'registration-password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }
    });

});
