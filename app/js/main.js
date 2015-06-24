window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

var support = {animations : Modernizr.cssanimations},
  animEndEventNames = {'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend'},
  animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
  onEndAnimation = function(el, callback) {
    var onEndCallbackFn = function(ev) {
      if(support.animations) {
        if(ev.target != this) return;
        this.removeEventListener(animEndEventName, onEndCallbackFn);
      }
      if(callback && typeof callback === 'function') callback.call();
    };
    if(support.animations) el.addEventListener(animEndEventName, onEndCallbackFn);
    else onEndCallbackFn();
  },
  eventtype = mobileCheck() ? 'touchend' : 'click';

var $game;
var $isNewGame = false;
var $isReady = false;

var $playerName = "";
var $finishDate = null;
var $totalTime;
var $saveCount = 0;

var $actionArray = [];
var $actionIndex = 0;
var $totalActions = 0;

var $currentTime;
var $startTotalTime;
var $updateTimer = null;

var $protoCube;
var $protoPyramid;
var $listenersAdded;


//===============================
// MAIN INITIALIZATION
$(document).ready(function() {
//===============================
  if(mobileCheck()) $("html").addClass("isMobile");
  if(phoneCheck()) $("html").addClass("isPhone");
  if(tabletCheck()) $("html").addClass("isTablet");

  if(navigator.appName == "Microsoft Internet Explorer") {
      var agent = navigator.userAgent;

      if(agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null) {
          var version = parseFloat(RegExp.$1);
          $("html").addClass("ie"+version);
      }
  };

  // Save the cube and pyramid prototypes in variables and remove them from the DOM
  $protoCube = $("#protoCube").clone();
  $protoPyramid = $("#protoPyramid").clone();
  $("#scene").find("#protoCube, #protoPyramid").remove();

  var load = function() {
    // If the player has a game save
    if(getLocalStorage("psychoCube_Game")) {
      // Fetch the data from the local storage
      $game = getLocalStorage("psychoCube_Game");

      initGame();
    }
    // If not, initialize it with a "new game" flag on
    else initGame(true);
  }

  // Sidebar animation
  var timeline = new TimelineMax({ onComplete: function() { clearProps(this); } });
  timeline.set("#sidebar button", { transition:"none" });
  timeline.from("#sidebar", .5, { opacity:0, left:"-18em", ease:Power4.easeOut });
  timeline.staggerFrom("#sidebar button", .2, { transform:"rotateX(90deg)" }, .1);

  // Add a scrollbar to the menu (for smaller screen sizes)
  $("#menu").mCustomScrollbar({ theme:"minimal", autoHideScrollbar: true });

  // Disable the glow FX by default and load the game
  glowFX();
  load();
});

function initGame(isNewGame, reinit) {
  $isReady = false;

  // If the game is being reinitialized (ie. the player pressed "new cube")
  if(reinit) {
    // Reset the timer
    clearInterval($updateTimer);
    // Remove any possible "pause" flag
    if($("body").hasClass("paused")) $("body").removeClass("paused");
  }

  // If the player is starting a new game, initialize the game data
  // And set the "new game" flag
  if(isNewGame) {
    $game = { playerName: "", finishDate: null, totalTime: 0, saveCount: 0, totalActions: 0, actionIndex: 0, actions: [], cubes: {} };
    $isNewGame = true;
  }

  // Set the current game instance data
  $playerName = $game.playerName;
  $finishDate = $game.finishDate;
  $saveCount = $game.saveCount;

  $actionIndex = $game.actionIndex;
  $actionArray = $game.actions;
  $totalActions = $game.totalActions;

  $totalTime = $game.totalTime; // Start the timer at the time the player left off
  $currentTime = 0; // Initialize the play time

  $("#currentTime .value").html("--:--:--");
  $("#totalTime .value").html(getFormatedTime($totalTime));

  // Check if the history buttons should be enabled
  checkHistoryButtons();

  var cubeSetup = function(timeline) {
    buildCube(function() {
      // Set the camera to the default viewing angle and fade the cube in
      timeline.to("#scene", 1, { opacity:1, transform:defaultAngle, ease:Power4.easeOut, clearProps:"all",
        onComplete: function() { $("#scene").css("transform", defaultAngle); }
      });

      // Start a new game
      newGame();
    });
  }

  var timeline = new TimelineMax();
  if(reinit) {
    // If the game is being reinitialized, tween the camera to its initial angle and make the cube fade
    // Before building the new cube
    timeline.to("#scene", 1, { opacity:0, transform:"matrix(1, 0, 0, 1, 0, 0)" });
    timeline.call(cubeSetup, [timeline]);
  }
  else {
    // If this is the first initialization, set the camera to its initial angle and the cube's opacity to zero
    // So that it fades in while being built
    timeline.set("#scene", { opacity:0, transform:"matrix(1, 0, 0, 1, 0, 0)" });
    cubeSetup(timeline);
  }
}


//===============================
// NEW GAME, SAVE GAME & GAME COMPLETED
//===============================
function newGame() {
  // If the player is starting a new game, randomize the cube...
  if($isNewGame) {
    var randomCube = randomizeCube();
    var randomActions = randomCube.randomActions;
    var randomDelay = randomCube.delay;
  }

  // ... and wait until the animation is finished
  // If the player is loading a game save, start right away
  var delay = $isNewGame ? (randomActions * randomDelay) : 0;
  setTimeout(function() {
    checkFocus(function() {
      // Add the listeners and start the timer
      addListeners();

      $startTotalTime = $game.totalTime;
      $updateTimer = setInterval(updateTimer, 1000);
      $isReady = true;
    });
  }, delay);
}

function saveGame() {
  if(!$isReady) return;
  $game.playerName = $playerName;
  $game.finishDate = $finishDate;
  $game.totalTime = $totalTime;
  $game.saveCount = $saveCount;

  $game.totalActions = $totalActions;
  $game.actionIndex = $actionIndex;
  $game.actions = $actionArray;

  // Fetch each cube's data and put it in the save data
  $(".cube").each(function() { $game.cubes[this.id] = $(this).data(); });

  // Save the game in the local storage
  setLocalStorage("psychoCube_Game", $game);
}

function gameComplete() {
  // Stop the timer and get the current date
  clearInterval($updateTimer);
  $finishDate = new Date();

  $("#screen_gameComplete .panel").eq(1).find(".value").html($totalTime);
  $("#screen_gameComplete .panel").eq(2).find(".value").html($totalActions);
  $("#screen_gameComplete .panel").eq(3).find(".value").html($saveCount);

  // Show the end screen
  toggleScreen("gameComplete", true);

  $("#bt_confirm").click(function() {
    // If the player name has been entered
    if($("#input_playerName").val().length > 0) {
      $playerName = $("#input_playerName").val();

      // Save the game a last time and put the data in the high scores
      saveGame();
      saveScore();
    }
    else {
      // Visual feedback for the player
      $("#input_playerName").prop("disabled", true);
      setTimeout(function() { $("#input_playerName").prop("disabled", false); }, 1000);
    }
  });
}

function saveScore() {
  var newScore = { playerName: $game.playerName,
                   finishDate: $game.finishDate,
                   totalTime: $game.totalTime,
                   saveCount: $game.saveCount,
                   totalActions: $game.totalActions };

  var highScores = getLocalStorage("psychoCube_HighScores") || [[], [], [], [], [], [], [], [], [], []];
  var newRecord = false;

  // Add the new score to the high scores array at the right rank
  for(var i = 0; i < highScores.length; i++) {
    if(highScores[i].totalTime == undefined || newScore.totalTime < highScores[i].totalTime) {
      for(var j = highScores.length - 2; j >= i; j--) {
        highScores[j+1] = highScores[j];
      }

      highScores[i] = newScore;
      setLocalStorage("psychoCube_HighScores", highScores);
      if(i == 0) newRecord = true; // If it tops the first rank, it's a new record
      break;
    }
  }

  // Delete the game save to allow new games
  removeLocalStorage("psychoCube_Game");

  // Fade the end screen and show the results screen
  toggleScreen("gameComplete", false);
  showHighScores();
}

function showHighScores() {
  var highScores = getLocalStorage("psychoCube_HighScores") || [[], [], [], [], [], [], [], [], [], []];

  for(var i = 0; i < highScores.length; i++) {
    if(highScores[i].length == 0) break;

    var nb = $("<span>").addClass("col col1").html((i+1) > 9 ? (i+1) : "0"+(i+1));
    var playerName = $("<span>").addClass("col col2").html(highScores[i].playerName);
    var finishDate = $("<span>").addClass("col col3").html(getFormatedDate(highScores[i].finishDate));
    var totalTime = $("<span>").addClass("col col4").html(getFormatedTime(highScores[i].totalTime));
    var totalActions = $("<span>").addClass("col col5").html(highScores[i].totalActions);
    var saveCount = $("<span>").addClass("col col6").html(highScores[i].saveCount);

    $("#screen_highScores .row").eq(i+1).empty().append(nb, playerName, finishDate, totalTime, totalActions, saveCount);
  }

  toggleScreen("highScores", true);
}

function toggleScreen(screenName, state) {
  pause();

  var screen = $("#screen_"+screenName);

  if(state == true) screen.addClass("active");
  else if(state == false) screen.removeClass("active");
  else screen.toggleClass("active");
}


//===============================
// EVENT LISTENERS
function addListeners() {
//===============================
  /* Cube controls ------------*/
  $(".cube").on(eventtype, rotationMenu);
  // No need to re-add the other listeners if the game has already been initialized once
  if($listenersAdded) return;

  /* Rotation menu mouse controls ------------*/
  $("#rotationMenu .item").on(eventtype, rotate);

  /* Camera controls ------------*/
  $("#tridiv").on("mousedown touchstart", startCameraRotation).on("mouseup touchend", stopCameraRotation).on("mousemove touchmove", setCameraRotation).on("mousewheel", setCameraZoom);
  $("#bt_resetCamera").on(eventtype, function() {
    TweenMax.to($("#scene"), 1, { transform:defaultAngle, ease:Power4.easeOut, clearProps:"all",
      onComplete:function() {
        $("#scene").css("transform", defaultAngle);
      }
    });
  });

  /* Side menu buttons ------------*/
  $("#bt_pause").on(eventtype, togglePause);
  $("#bt_undo").on(eventtype, undo);
  $("#bt_redo").on(eventtype, redo);

  $("#bt_saveGame").on(eventtype, function() {
    if(!$isReady) return;
    // Save the game and increment the save counter
    saveGame();
    $saveCount++;

    // Visual feedback for the player
    $("#bt_saveGame").prop("disabled", true).html("Game saved");
    setTimeout(function() { $("#bt_saveGame").prop("disabled", false).html("Save game"); }, 1000);
  });

  $("#bt_newCube").on(eventtype, function() { if($isReady) initGame(true, true); });
  $("#bt_glowSwitch").on(eventtype, glowFX);

  $("#bt_highScores").on(eventtype, function() { toggleScreen("highScores", true); });
  $("#bt_about").on(eventtype, function() { toggleScreen("about", true); });

  $("#bt_resetCube").on(eventtype, resetCube);

  $("#screen_highScores .close").on(eventtype, function() {
    toggleScreen("highScores", false);

    // If the player has just finished a party, start a new game when exiting
    if($finishedDate) initGame(true, true);
  });

  /* Keyboard controls ------------*/
  $(window).on("keydown", function(e) {
    if(!$isReady || $("body").hasClass("paused")) return;

    var noKeyModifier = (e.shiftKey == false) && (e.ctrlKey == false) && (e.altKey == false);

    // Rotation menu
    var action;

    if(e.which == 70 && e.shiftKey)                                 // SHIFT + F : front counterclockwise
      action = { axis: "z", coord: 1, direction: -1 };
    else if(e.which == 70)                                          // F : front clockwise
      action = { axis: "z", coord: 1, direction: 1 };
    if(e.which == 83 && e.shiftKey)                                 // SHIFT + S : standing counterclockwise
      action = { axis: "z", coord: 2, direction: -1 };
    else if(e.which == 83 && noKeyModifier)                         // S : standing clockwise
      action = { axis: "z", coord: 2, direction: 1 };
    if(e.which == 66 && e.shiftKey)                                 // SHIFT + B : back counterclockwise (inverted for notation coherence)
      action = { axis: "z", coord: 3, direction: 1 };
    else if(e.which == 66)                                          // B : back clockwise (inverted for notation coherence)
      action = { axis: "z", coord: 3, direction: -1 };

    if(e.which == 85 && e.shiftKey)                                 // SHIFT + U : up counterclockwise (inverted for notation coherence)
      action = { axis: "y", coord: 1, direction: 1 };
    else if(e.which == 85)                                          // U : up clockwise (inverted for notation coherence)
      action = { axis: "y", coord: 1, direction: -1 };
    if(e.which == 69 && e.shiftKey)                                 // SHIFT + E : equator counterclockwise
      action = { axis: "y", coord: 2, direction: -1 };
    else if(e.which == 69)                                          // E : equator clockwise
      action = { axis: "y", coord: 2, direction: 1 };
    if(e.which == 68 && e.shiftKey)                                 // SHIFT + D : down counterclockwise
      action = { axis: "y", coord: 3, direction: -1 };
    else if(e.which == 68)                                          // D : down clockwise
      action = { axis: "y", coord: 3, direction: 1 };

    if(e.which == 76 && e.shiftKey)                                 // SHIFT + L : left counterclockwise
      action = { axis: "x", coord: 1, direction: -1 };
    else if(e.which == 76)                                          // L : left clockwise
      action = { axis: "x", coord: 1, direction: 1 };
    if(e.which == 77 && e.shiftKey)                                 // SHIFT + M : middle counterclockwise
      action = { axis: "x", coord: 2, direction: -1 };
    else if(e.which == 77)                                          // M : middle clockwise
      action = { axis: "x", coord: 2, direction: 1 };
    if(e.which == 82 && e.shiftKey)                                 // SHIFT + R : right counterclockwise (inverted for notation coherence)
      action = { axis: "x", coord: 3, direction: -1 };
    else if(e.which == 82  && noKeyModifier)                        // R : right clockwise (inverted for notation coherence)
      action = { axis: "x", coord: 3, direction: 1 };

    // If an action was determined based on the keyboard input
    // Rotate the cube and stop analyzing the event
    if(action) rotate(null, action); return;
    
    // Side menu
    if(e.which == 82 && e.altKey)                                   // ALT + R : Reset camera
      $("#bt_resetCamera").trigger(eventtype);
    if(e.which == 90 && e.altKey)                                   // ALT + Z : Undo
      $("#bt_undo").trigger(eventtype);
    if(e.which == 89 && e.altKey)                                   // ALT + Y : Redo
      $("#bt_redo").trigger(eventtype);
    if(e.which == 32)                                               // Spacebar : Pause
      $("#bt_pause").trigger(eventtype);
    if(e.which == 83 && e.altKey)                                   // ALT + S : Save game
      $("#bt_saveGame").trigger(eventtype);
    if(e.which == 78 && e.altKey)                                   // ALT + N : New cube
      $("#bt_newCube").trigger(eventtype);
  });

  /* Pause the game when the window is inactive ------------*/
  $(window).on("blur", pause);

  /* Ask the player to confirm before closing the window ------------*/
  $(window).on("beforeunload", function(e) {
    var askConfirmation = false;

    // If there is a game save
    if(getLocalStorage("psychoCube_Game")) {
      // Check if any progress has been made since it was loaded
      // If that's the case, prompt the player
      if($totalActions != $game.totalActions) askConfirmation = true;
    }
    // If the player has never saved before
    else {
      // Check if any action has been made
      // If that's the case, prompt the player
      if($totalActions > 0) askConfirmation = true;
    }

    if(!askConfirmation) return;

    var confirmationMessage = "Your progress hasn't been saved. Do you really wish to leave?";
    (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
    return confirmationMessage;                                // Gecko and WebKit
  });

  // Add a flag when the listeners have been added
  $listenersAdded = true;
}


//===============================
// TIMER
//===============================
function updateTimer() {
  $currentTime++;
  $totalTime = $startTotalTime + $currentTime;

  $("#currentTime .value").html(getFormatedTime($currentTime));
  $("#totalTime .value").html(getFormatedTime($totalTime));
}

function getFormatedTime(seconds) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds / 60) % 60;
  var s = seconds % 60;

  if(h < 10) h = "0"+h;
  if(m < 10) m = "0"+m;
  if(s < 10) s = "0"+s;

  var timeString = h+":"+m+":"+s;
  return timeString;
}

function getFormatedDate(date) {
  var dateData = new Date(date);
  var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var dateString = dateData.getDate() > 9 ? dateData.getDate() : "0"+dateData.getDate();
  dateString += " "+monthName[dateData.getMonth()];
  dateString += " "+dateData.getFullYear();
  dateString += " - ";
  dateString += dateData.getHours() > 9 ? dateData.getHours()+":" : "0"+dateData.getHours()+":";
  dateString += dateData.getMinutes() > 9 ? dateData.getMinutes() : "0"+dateData.getMinutes();

  return dateString;
}

function pause() {
  if($("body").hasClass("paused") || !$isReady) return;

  clearInterval($updateTimer);
  $("#bt_pause").html("Resume");
  $("#bt_undo, #bt_redo").prop("disabled", true);
  $("body").addClass("paused");

  // Cancel any cube selection
  cancelSelection();
}

function resume() {
  if(!$("body").hasClass("paused") || !$isReady) return;

  $updateTimer = setInterval(updateTimer, 1000);
  $("#bt_pause").html("Pause");
  checkHistoryButtons(); // Check if the history buttons should be enabled
  $("body").removeClass("paused");
}

function togglePause() {
  if($("body").hasClass("paused")) resume();
  else pause();
}


//===============================
// ROTATION MENU
//===============================
function rotationMenu(e) {
  var target = e.currentTarget;
  // If the cube selection has been cancelled or the game is paused, cancel the request
  if(cancelSelection(e) || $("body").hasClass("paused")) return;

  // For mobile devices, check the touch events instead to detect the cube selection
  if(mobileCheck()) e = e.originalEvent.touches[0];

  var posX = e.pageX;
  var posY = e.pageY;
  // Position the rotation menu where the player clicked
  $("#rotationMenu").css({ left:posX+"px", top:posY+"px" });

  // If a cube is being selected 
  if(!$("body").hasClass("selecting")) {
    // Open the rotation menu after it has finished moving to the designated place
    setTimeout(function() { $("#rotationMenu").addClass("open"); }, 200);
    // And add the "selecting" flag to the body
    $("body").addClass("selecting").on(eventtype, cancelSelection);
  }
  // If not, remove all "selected" flags on the cubes
  else $(".cube.selected").removeClass("selected");

  // Add the "selected" flag on the cube the player clicked on
  if($(target) != $("body")) $(target).addClass("selected");
}

function cancelSelection(e) {
  var check = false;
  var target = e ? e.currentTarget : null;

  // If a cube is being selected
  if($("body").hasClass("selecting")) {
    // And the player has either just clicked on that cube or an empty area, or there is no target at all
    if(!target || $(".cube.selected")[0] == target || $(e.target).closest(".cube").length == 0) {
      // Cancel the selection
      $(".cube.selected").removeClass("selected");
      $("body").removeClass("selecting").off(eventtype, cancelSelection);
      $("#rotationMenu").removeClass("open");

      check = true;
    }
  }

  return check;
}


//===============================
// ROTATION ACTIONS & HISTORY
//===============================
function rotate(e, action) {
  var cube = $(".cube.selected"); // Find the currently selected cube, if any
  var action = action || {}; // Fetch the action passed as an argument, or create an empty object to create it

  // If there's an event passed as an argument, the player is selecting a cube
  // And the action needs to be determined
  if(e) {
    // Determining the rotation to apply depending on which button the player clicked
    var target = e.currentTarget;

    if(target.id == "bt_front")
      action = { axis: "z", coord: cube.data("z"), direction: 1 };

    if(target.id == "bt_back")
      action = { axis: "z", coord: cube.data("z"), direction: -1 };

    if(target.id == "bt_left")
      action = { axis: "y", coord: cube.data("y"), direction: -1 };

    if(target.id == "bt_right") 
      action = { axis: "y", coord: cube.data("y"), direction: 1 };

    if(target.id == "bt_up")
      action = { axis: "x", coord: cube.data("x"), direction: -1 };

    if(target.id == "bt_down") 
      action = { axis: "x", coord: cube.data("x"), direction: 1 };
  }

  // Pushing the action in the history
  $actionArray[$actionIndex++] = action;
  // And removing any remaining actions following it
  if($actionIndex < $actionArray.length) $actionArray.splice(-1, $actionIndex);

  // Update the  history buttons status
  checkHistoryButtons();

  // Applying the rotation to the cube and incrementing the action counter
  rotateCube(action.axis, action.coord, action.direction);
  $totalActions++;

  if(e) cancelSelection(e); // Cancel the selection on the cube, if there was one
  if(checkCube()) gameComplete(); // Check if the cube has been solved
}

function undo() {
  // Fetch the previous action in the history
  var lastAction = $actionArray[--$actionIndex];

  // Apply the rotation to the cube and incrementing the action counter
  rotateCube(lastAction.axis, lastAction.coord, lastAction.direction * -1); // Reverse direction to undo the action
  $totalActions++;

  // Update the history buttons status
  checkHistoryButtons();
}

function redo() {
  // Fetch the next action in the history
  var nextAction = $actionArray[$actionIndex++];

  // Apply the rotation to the cube and incrementing the action counter
  rotateCube(nextAction.axis, nextAction.coord, nextAction.direction);
  $totalActions++;

  // Update the  history buttons status
  checkHistoryButtons();
}

function checkHistoryButtons() {
  // If there's no previous action in the history, disable the undo button
  if($actionIndex < 1) $("#bt_undo").prop("disabled", true);
  else $("#bt_undo").prop("disabled", false);

  // If there's no next action in the history, disable the redo button
  if($actionIndex >= $actionArray.length) $("#bt_redo").prop("disabled", true);
  else $("#bt_redo").prop("disabled", false);
}


//===============================
// TOOLBOX
//===============================
function checkFocus(callback) {
  var waitForFocus = function() {
    callback();
    $(window).off("focus", waitForFocus);
  };

  if(document["hasFocus"]()) callback();
  else $(window).on("focus", waitForFocus);
}

function debugMode(state) {
  if(state == true) $("html").addClass("debug");
  else if(state == false) $("html").removeClass("debug");
  else $("html").toggleClass("debug");
}

function glowFX(state) {
  if(state == true) { $("html").addClass("noGlow"); $("#bt_glowSwitch i").removeClass("fa-toggle-on").addClass("fa-toggle-off"); }
  else if(state == false) { $("html").removeClass("noGlow"); $("#bt_glowSwitch i").removeClass("fa-toggle-off").addClass("fa-toggle-on"); }
  else { $("html").toggleClass("noGlow"); $("#bt_glowSwitch i").toggleClass("fa-toggle-on fa-toggle-off"); }
}

function clearProps(timeline) {
  var targets = timeline.getChildren();
  timeline.kill();

  for (var i=0; i<targets.length; i++) {
    if(targets[i].target != null)
      TweenMax.set(targets[i].target, {clearProps:"all"});
  }
}

function getCSSstyle(selector, property, valueOnly) {
  var styleSheets = document.styleSheets;
  var classes = [];

  for(var i = 0; i < styleSheets.length; i++) {
    if(!styleSheets[i].ownerNode.attributes.href.value.match("http|//")) {
      var rules = styleSheets[i].rules || styleSheets[i].cssRules;
      if(rules) classes.push(rules);
    }
  }

  for(var i = 0; i < classes.length; i++) {
    for(var j = 0; j < classes[i].length; j++) {
        if(classes[i][j].selectorText && classes[i][j].selectorText.indexOf(selector) != -1) {
            if(property) {
              if(valueOnly) return parseFloat(classes[i][j].style[property]);
              else return classes[i][j].style[property];
            }
            else {
              if(classes[i][j].cssText) return classes[i][j].cssText
              else return classes[i][j].style.cssText;
            }
        }
    }
  }
};


//===============================
// LOCAL STORAGE
//===============================
function setLocalStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getLocalStorage(key)        { return JSON.parse(localStorage.getItem(key)); }
function removeLocalStorage(key)     { localStorage.removeItem(key); }


//===============================
// MOBILE DETECTION
// http://stackoverflow.com/a/11381730/989439
//===============================
function mobileCheck() {
  var check = false;
  (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function phoneCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function tabletCheck() {
  var check = false;
  if(!phoneCheck() && mobileCheck()) check = true;
  return check;
}


//===============================
// GOOGLE ANALYTICS
(function(b,o,i,l,e,r){
//===============================
  b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
  e=o.createElement(i);r=o.getElementsByTagName(i)[0];
  e.src='//www.google-analytics.com/analytics.js';
  r.parentNode.insertBefore(e,r)
}(window,document,'script','ga'));
ga('create','UA-43190815-1');ga('send','pageview');