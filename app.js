window.addEventListener('load', function() {
  var webAuth = new auth0.WebAuth({
    clientID: AUTH0_CLIENT_ID, 
    domain: AUTH0_DOMAIN,
    scope: 'openid profile email',
    responseType: 'token',
    redirectUri: AUTH0_CALLBACK_URL
  });

  document.getElementById('btn-login').addEventListener('click', function() {
    webAuth.authorize();
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
    logout();
  });

  webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
    if (err) {
      return console.error(err);
    }
    if (authResult) {
      webAuth.client.userInfo(authResult.accessToken, (err, profile) => {
        if (err) {
          // Remove expired token (if any)
          localStorage.removeItem('token');
          // Remove expired profile (if any)
          localStorage.removeItem('profile');
          return alert('There was an error getting the profile: ' + err.message);
        } else {
          localStorage.setItem('token', authResult.accessToken);
          localStorage.setItem('profile', JSON.stringify(profile));
          showUserProfile(profile);
        }
        window.location.hash = "";
      });
    }
  });

  var checkAuth = function() {
    var token = localStorage.getItem('token');
    if (token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      showUserProfile(user_profile);
    } // else: not authorized
  };

  var showUserProfile = function(profile) {
    document.getElementById('login').style.display = "none";
    document.getElementById('logged').style.display = "inline-block";
    document.getElementById('avatar').src = profile.picture;
    document.getElementById('email').textContent = profile.email;
    document.getElementById('nickname').textContent = profile.nickname;
    console.log("Full Contact details", profile.user_metadata.fullcontact);
  };

  var logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  checkAuth();
});