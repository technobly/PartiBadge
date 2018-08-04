var particle = new Particle();
var token;
var device;
var eventStream;
var $app = $("#app");

var codeUrl = "https://raw.githubusercontent.com/particle-iot/parti-badge/master/firmware";
var appFiles = [
  "src/parti-badge.ino",
  "src/parti-badge.h",
  "src/simonsays/simon.h",
  "src/music/tones.h",
  "src/music/notes.h",
  "src/music/roll.h",
  "src/keylogger/keylogger.h",
  "src/images/humidity.h",
  "src/images/konami.h",
  "src/images/spark.h",
  "src/images/temp.h",
  "src/events/events.h",
  "src/animations/animations.h",
  "src/WearerInfo/WearerInfo.cpp",
  "src/WearerInfo/WearerInfo.h",
  "project.properties",
];

var libraryUrl = "https://raw.githubusercontent.com/technobly/PartiBadge/master/lib/Arduboy2/";
var library1 = [
  libraryUrl+"Arduboy2.h",
  libraryUrl+"Arduboy2Audio.h",
  libraryUrl+"Arduboy2Beep.h",
  libraryUrl+"Arduboy2Core.h",
  libraryUrl+"Sprites.h",
  libraryUrl+"SpritesB.h",
  libraryUrl+"SpritesCommon.h",
  libraryUrl+"Arduboy2.cpp",
  libraryUrl+"Arduboy2Audio.cpp",
  libraryUrl+"Arduboy2Beep.cpp",
  libraryUrl+"Arduboy2Core.cpp",
  libraryUrl+"Sprites.cpp",
  libraryUrl+"SpritesB.cpp",
  libraryUrl+"ab_logo.c",
  libraryUrl+"glcdfont.c"
];

var gameUrl = "https://raw.githubusercontent.com/technobly/PartiBadge/master/lib/Arduboy2/";
var game1 = [
  gameUrl+"ArduBreakout.ino"
];
var game2 = [
  gameUrl+"CyanCatCandyWorld.ino",
  gameUrl+"Tinyfont.cpp",
  gameUrl+"Tinyfont.h",
  gameUrl+"TinyfontSprite.c"
];

var templates = {
  loginForm: _.template($("#template-login-form").text()),
  selectDevice: _.template($("#template-select-device").text()),
  error: _.template($("#template-error").text()),
  mainUI: _.template($("#main-ui").text()),
};

function getToken() {
  token = localStorage.getItem('particle-token');
  return token;
}

function setToken(newToken) {
  token = newToken;
  localStorage.setItem('particle-token', token);
}

function getDevice() {
  device = localStorage.getItem('particle-device');
  return device;
}

function setDevice(newDevice) {
  device = newDevice;
  localStorage.setItem('particle-device', device);
}


function login() {
  if (!getToken()) {
    $app.html(templates.loginForm());
    $('#login-form').on('submit', function (event) {
      event.preventDefault();
      particleLogin()
    });
  } else {
    selectDeviceForm();
  }
}

function particleLogin() {
  var $username = $('#username');
  var $password = $('#password');
  var $submit = $('#login');
  var $errorMessage = $('#error-message');

  $username.prop('disabled', true);
  $password.prop('disabled', true);
  $submit.prop('disabled', true);

  var username = $username.val();
  var password = $password.val();

  particle.login({ username: username, password: password })
  .then(function (data) {
    setToken(data.body.access_token);
    selectDeviceForm();
  }, function (err) {
    var message = err.body && err.body.error_description || "User credentials are invalid";
    $errorMessage.html(message);

    $username.prop('disabled', false);
    $password.prop('disabled', false);
    $submit.prop('disabled', false);
  });
}

function selectDeviceForm(force) {
  if (force || !getDevice()) {
    particle.listDevices({ auth: token })
    .then(function (data) {
      var devices = data.body;
      $app.html(templates.selectDevice({ devices: devices}));
      $('[data-toggle="select"]').select2();

      $("#select-device").on("submit", function (event) {
        event.preventDefault();
        setDevice($("#device").val());
        mainUI();
      });
    })
    .catch(function (err) {
      showError();
    });
  } else {
    mainUI();
  }
}

function mainUI() {
  $app.html(templates.mainUI());

  var $flashButton = $("#flash-button");
  var $game1Button = $("#game1-button");
  var $game2Button = $("#game2-button");
  // var $game3Button = $("#game3-button");
  // var $game4Button = $("#game4-button");
  // var $game5Button = $("#game5-button");
  var $readButton = $("#read-button");
  var $logoutButton = $("#logout-button");
  $flashButton.on('click', flashApp);
  $game1Button.on('click', flashGame1);
  $game2Button.on('click', flashGame2);
  // $game3Button.on('click', flashGame3);
  // $game4Button.on('click', flashGame4);
  // $game5Button.on('click', flashGame5);
  $readButton.on('click', readTemp);
  $logoutButton.on('click', logout);
}

function timeoutPromise(ms) {
  return new Promise(function (fulfill, reject) {
    setTimeout(function () {
      reject(new Error("Timeout"));
    }, ms);
  });
}

function flashApp() {
  clearConsole();
  log("Compiling and flashing default app...");
  var files = {};

  var filePromises = appFiles.map(function (f) {
    return $.ajax(codeUrl + "/" + f)
    .then(function (data) {
      files[f] = new Blob([data], { type: "text/plain" });
    });
  });

  Promise.all(filePromises)
  .then(function () {
    var flashPromise = particle.flashDevice({
      deviceId: device,
      files: files,
      auth: token
    });

    // Add timeout to flash
    return Promise.race([flashPromise, timeoutPromise(30000)]);
  })
  .then(function (data) {
    var body = data.body;

    if (body.ok) {
      setTimeout(function () {
        log("Done flashing!");
      }, 5000);
    } else {
      error("Error during flash.");
      error(body.errors.join("\n"));
    }
  }, function (err) {
    if (err.message == "Timeout") {
      error("Timeout during flash. Is your device connected to the Internet (breathing cyan)?");
      return;
    }

    throw err;
  })
  .catch(function (err) {
    console.error(err);
    showError();
  });
}

function flashGame1() {
  flashGameWithArgs(library1, game1);
}
function flashGame2() {
  flashGameWithArgs(library1, game2);
}
// function flashGame3() {
//   flashGameWithArgs(library3, game3);
// }
// function flashGame4() {
//   flashGameWithArgs(library4, game4);
// }
// function flashGame5() {
//   flashGameWithArgs(library5, game5);
// }
function flashGameWithArgs(lib, game) {
  // var appFiles = event.data.lib.concat(event.data.game);
  var appFiles = lib.concat(game);
  clearConsole();
  log("Compiling and flashing game...");
  var files = {};

  var filePromises = appFiles.map(function (f) {
    return $.ajax(f)
    .then(function (data) {
      files[f] = new Blob([data], { type: "text/plain" });
    });
  });

  Promise.all(filePromises)
  .then(function () {
    var flashPromise = particle.flashDevice({
      deviceId: device,
      files: files,
      auth: token
    });

    // Add timeout to flash
    return Promise.race([flashPromise, timeoutPromise(30000)]);
  })
  .then(function (data) {
    var body = data.body;

    if (body.ok) {
      setTimeout(function () {
        log("Done flashing!");
      }, 5000);
    } else {
      error("Error during flash.");
      error(body.errors.join("\n"));
    }
  }, function (err) {
    if (err.message == "Timeout") {
      error("Timeout during flash. Is your device connected to the Internet (breathing cyan)?");
      return;
    }

    throw err;
  })
  .catch(function (err) {
    console.error(err);
    showError();
  });
}

function readTemp() {
  setupEventStream()
  .then(function () {

    clearConsole();
    log("Reading Temperature & Humidity...");

    var callPromise = particle.callFunction({
      deviceId: device,
      name: 'checkTemp',
      argument: '',
      auth: token
    });

    // The result will be an event published by the device
    // event: "tc-env-sensors" data: {"temp":79,"humidity":39}

    // Add timeout to function call
    Promise.race([callPromise, timeoutPromise(10000)])
    .catch(function (err) {
      if (err.message == "Timeout") {
        error("Timeout. Is your device connected to the Internet (breathing cyan)?");
        return;
      }
      console.error(err);
      error("Error while reading temperature and humidity!\n\nTry flashing the default app to your PartiBadge.");
    });
  });
}

function log(message) {
  printToConsole(message, 'info');
}

function error(message) {
  printToConsole(message, 'error');
}

function printToConsole(message, type, rawHtml) {
  var $el = $('<div class="' + type + '"/>');
  if (rawHtml) {
    $el.html(message);
  } else {
    $el.text(message);
  }
  $("#console").append($el);
}

function clearConsole() {
  $("#console").html('');
}

function showError() {
  $app.html(templates.error());
}

function setupEventStream() {
  if (!eventStream) {
    return particle.getEventStream({
      deviceId: device,
      auth: token
    })
    .then(function (stream) {
      eventStream = stream;

      eventStream.on('tc-error', deviceError);
      eventStream.on('tc-env-sensors', deviceData);
    });
  } else {
    return Promise.resolve();
  }
}

function deviceError(event) {
  error("PartiBadge is online but has reported an error!");
}

function deviceData(event) {
  log(event.data);
}

function logout() {
  setToken('');
  setDevice('');
  window.location.reload();
}

login();
