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

  $protoCube = $("#protoCube").clone();
  $protoPyramid = $("#protoPyramid").clone();
  $("#scene").find("#protoCube, #protoPyramid").remove();

  var load = function() {
    if(getLocalStorage("psychoCube_Game")) {
      $game = getLocalStorage("psychoCube_Game");

      $playerName = $game.playerName;
      $finishDate = $game.finishDate;
      $saveCount = $game.saveCount;

      $actionIndex = $game.actionIndex;
      $actionArray = $game.actions;
      $totalActions = $game.totalActions;

      initGame();
    }
    else initGame(true);
  }

  var timeline = new TimelineMax({
    onComplete: function() {
        clearProps(this);
    }
  });
  timeline.set("#sidebar button", { transition:"none" });
  timeline.from("#sidebar", .5, { opacity:0, left:"-18em", ease:Power4.easeOut });
  timeline.staggerFrom("#sidebar button", .2, { transform:"rotateX(90deg)" }, .1);

  $("#menu").mCustomScrollbar({ theme:"minimal", autoHideScrollbar: true });


  /*var checkViewport = function() {
    if(window.innerHeight < $("#bt_soundSwitch").offset().top) {
      $(".content").mCustomScrollbar("update");
    }
    else {
      $(".content").mCustomScrollbar("disable");
    }
  }
  $(window).resize(function() {
    WIDTH = 
  });*/

  glowMode();
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

  if(isNewGame) {
    $game = { playerName: "", finishDate: null, totalTime: 0, saveCount: 0, totalActions: 0, actionIndex: 0, actions: [], cubes: {} };
    $isNewGame = true;
  }

  $totalTime = $game.totalTime;
  $currentTime = 0;

  $("#currentTime .value").html("--:--:--");
  $("#totalTime .value").html(getFormatedTime($totalTime));

  var cubeSetup = function(timeline) {
    buildCube(function() {
      timeline.to("#scene", 1, { opacity:1, transform:defaultAngle, ease:Power4.easeOut, clearProps:"all",
        onComplete: function() { $("#scene").css("transform", defaultAngle); }
      });

      newGame();
    });
  }

  var timeline = new TimelineMax();
  if(reinit) {
    timeline.to("#scene", 1, { opacity:0, transform:"matrix(1, 0, 0, 1, 0, 0)" });
    timeline.call(cubeSetup, [timeline]);
  }
  else {
    timeline.set("#scene", { opacity:0, transform:"matrix(1, 0, 0, 1, 0, 0)" });
    cubeSetup(timeline);
  }
}


//===============================
// NEW GAME, SAVE GAME & GAME COMPLETED
//===============================
function newGame() {
  if($isNewGame) {
    var randomCube = randomizeCube();
    var randomActions = randomCube.randomActions;
    var randomDelay = randomCube.delay;
  }

  var delay = $isNewGame ? (randomActions * randomDelay) : 0;
  setTimeout(function() {
    checkFocus(function() {
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

  $(".cube").each(function() { $game.cubes[this.id] = $(this).data(); });

  setLocalStorage("psychoCube_Game", $game);
}

function gameComplete() {
  clearInterval($updateTimer);
  $finishDate = new Date();

  $("#screen_gameComplete").addClass("active");

  $("#input_playerName").keydown(function(e) {
    if(e.which == 13) $("#input_confirm").click();
  });

  $("#bt_confirm").click(function() {
    $playerName = $("#input_playerName").val();
    saveGame();
    saveScore();
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

  for(var i = 0; i < highScores.length; i++) {
    if(highScores[i].totalTime == undefined || newScore.totalTime < highScores[i].totalTime) {
      for(var j = highScores.length - 2; j >= i; j--) {
        highScores[j+1] = highScores[j];
      }

      highScores[i] = newScore;
      setLocalStorage("psychoCube_HighScores", highScores);
      if(i == 0) newRecord = true;
      break;
    }
  }

  removeLocalStorage("psychoCube_Game");
  $("#screen_gameComplete").removeClass("active");
  //showResults();
}


//===============================
// EVENT LISTENERS
function addListeners() {
//===============================
  /* Cube controls ------------*/
  $(".cube").on(eventtype, rotationMenu);
  if($listenersAdded) return;

  /* Rotation menu mouse controls ------------*/
  $("#rotationMenu button").on(eventtype, rotate);

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
    $saveCount++;
    saveGame();

    $("#bt_saveGame").addClass("palePink").html("Game saved");
    setTimeout(function() { $("#bt_saveGame").removeClass("palePink").html("Save game"); }, 1000);
  });

  $("#bt_newCube").on(eventtype, function() { if($isReady) initGame(true, true); });
  $("#bt_glowSwitch").on(eventtype, glowMode);
  $("#bt_resetCube").on(eventtype, resetCube);

  /* Keyboard controls ------------*/
  $(window).on("keydown", function(e) {
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

    if(action) { rotate(null, action); return; } 
    
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
      // If that's the case, prompt the user
      if($totalActions != $game.totalActions) askConfirmation = true;
    }
    // If the player has never saved before
    else {
      // Check if any action has been made
      // If that's the case, prompt the user
      if($totalActions > 0) askConfirmation = true;
    }

    if(!askConfirmation) return;

    var confirmationMessage = "Your progress hasn't been saved. Do you really wish to leave?";
    (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
    return confirmationMessage;                                // Gecko and WebKit
  });

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

function pause() {
  if($("body").hasClass("paused") || !$isReady) return;

  clearInterval($updateTimer);
  $("#bt_pause").html("Resume");
  $("body").addClass("paused");
}

function resume() {
  if(!$("body").hasClass("paused") || !$isReady) return;

  $updateTimer = setInterval(updateTimer, 1000);
  $("#bt_pause").html("Pause");
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
  if(cancelSelection(e) || $("body").hasClass("paused")) return;

  if(mobileCheck()) e = e.originalEvent.touches[0];

  var posX = e.pageX;
  var posY = e.pageY;
  $("#rotationMenu").css({ left:posX+"px", top:posY+"px" });

  if(!$("body").hasClass("selecting")) {
    setTimeout(function() { $("#rotationMenu").addClass("open"); }, 200);
    $("body").addClass("selecting").on(eventtype, cancelSelection);
  }
  else
    $(".cube.selected").removeClass("selected");

  if($(target) != $("body"))
    $(target).addClass("selected");
}

function cancelSelection(e) {
  var check = false;
  var target = e.currentTarget;

  if($("body").hasClass("selecting")) {
    if($(".cube.selected")[0] == target || $(event.target).closest(".cube").length == 0) {
      $(".selected").removeClass("selected");
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
  var cube = $(".cube.selected");
  var action = action || {};

  if(e) {
    var target = e.currentTarget;

    if(target.id == "toFront")
      action = { axis: "z", coord: cube.data("z"), direction: -1 };

    if(target.id == "toBack")
      action = { axis: "z", coord: cube.data("z"), direction: 1 };

    if(target.id == "toLeft")
      action = { axis: "y", coord: cube.data("y"), direction: -1 };

    if(target.id == "toRight") 
      action = { axis: "y", coord: cube.data("y"), direction: 1 };

    if(target.id == "toUp")
      action = { axis: "x", coord: cube.data("x"), direction: -1 };

    if(target.id == "toDown") 
      action = { axis: "x", coord: cube.data("x"), direction: 1 };
  }

  $actionArray[$actionIndex++] = action;
  if($actionIndex < $actionArray.length) {
    // Remove any remaining actions following in the history
    $actionArray.splice(-1, $actionIndex);
  }

  rotateCube(action.axis, action.coord, action.direction);
  $totalActions++;

  if(e) cancelSelection(e);
  if(checkCube()) gameComplete();
}

function undo() {
  if($actionIndex < 1 || $("body").hasClass("paused")) return;
  var lastAction = $actionArray[--$actionIndex];

  rotateCube(lastAction.axis, lastAction.coord, lastAction.direction * -1);
  $totalActions++;
}

function redo() {
  if($actionIndex >= $actionArray.length || $("body").hasClass("paused")) return;
  var nextAction = $actionArray[$actionIndex++];

  rotateCube(nextAction.axis, nextAction.coord, nextAction.direction);
  $totalActions++;
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

function glowMode(state) {
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