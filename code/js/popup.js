/* global chrome */
/* global document */

function setClickHandler(link) {
    var location = link.href;
    link.onclick = function () {
        console.log('clicked link in popup');
        chrome.tabs.create({active: true, url: location});
    };
}

;(function() {
  console.log('POPUP SCRIPT WORKS!');

  // here we use SHARED message handlers, so all the contexts support the same
  // commands. but this is NOT typical messaging system usage, since you usually
  // want each context to handle different commands. for this you don't need
  // handlers factory as used below. simply create individual `handlers` object
  // for each context and pass it to msg.init() call. in case you don't need the
  // context to support any commands, but want the context to cooperate with the
  // rest of the extension via messaging system (you want to know when new
  // instance of given context is created / destroyed, or you want to be able to
  // issue command requests from this context), you may simply omit the
  // `hadnlers` parameter for good when invoking msg.init()
  var handlers = require('./modules/handlers').create('popup');
  var msg = require('./modules/msg').init('popup', handlers);
  var form = require('./modules/form');
  var runner = require('./modules/runner');

  form.init(runner.go.bind(runner, msg));

  chrome.tabs.query({
      'active': true,
      lastFocusedWindow: true
  }, function (tabs) {
    // Make links open in a new tab
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
      console.log("setting click handler for", links[i]);
      setClickHandler(links[i]);
    }

    document.getElementById('title').value = tabs[0].title;
    document.getElementById('url').value = tabs[0].url;
  });
})();
