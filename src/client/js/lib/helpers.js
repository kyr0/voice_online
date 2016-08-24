var _ = require('lodash');
var axios = require('axios');

// only get the CSRF token on requests where it is needed
axios.interceptors.request.use(function(config) {
    config = _addTokenToAxiosHeader(config, document.cookie);
    return config;
});

function _addTokenToAxiosHeader(config, passedCookies) {
    if (!_csrfSafeMethod(config.method)) {
        config.headers = {'X-CSRFToken': getCookie('csrftoken', passedCookies)};
    }
    return config;
}

function getCookie(desiredCookie, passedCookies) {
    var foundCookie = null;
    if (passedCookies && passedCookies !== '') {
        var cookies = passedCookies.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = _.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, desiredCookie.length + 1) === (desiredCookie + '=')) {
                foundCookie = decodeURIComponent(cookie.substring(desiredCookie.length + 1));
                break;
            }
        }
    }
    return foundCookie;
}

function _csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method.toUpperCase()));
}


module.exports = {
    // exports for testing
    _addTokenToAxiosHeader: _addTokenToAxiosHeader,
    _csrfSafeMethod: _csrfSafeMethod,

    // API
    getCookie: getCookie,
    axios: axios
};