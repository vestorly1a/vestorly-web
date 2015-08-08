/**
 * This is a class that helps us do the queries to Vestorly's API.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function Vestorly() {
  this.sessionKey_ = null;
};

Vestorly.USERNAME = encodeURIComponent('hackathon04@gmail.com');

Vestorly.PASSWORD = encodeURIComponent('T4ZXmdYv');

Vestorly.CREDENTIALS = {
  username: Vestorly.USERNAME,
  password: Vestorly.PASSWORD
};

Vestorly.BASE_URL = 'https://staging.vestorly.com/api/v2';

Vestorly.prototype.getSessionKey = function() {
  $.post(Vestorly.BASE_URL + '/sessions?username=hackathon04%40gmail.com&password=T4ZXmdYv',
        {},
        bind(this, function(response, status) {
    this.sessionKey_ = response['vestorly-auth'];
  }));
};


