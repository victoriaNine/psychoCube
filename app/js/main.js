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
var $startTimes;
var $currentTime;
var $totalTime;
var $updateTimer;
var $ready = false;
var $actionArray = [];
var $actionIndex = 0;

var defaultTransform = "rotateX(-10deg) rotateY(25deg) rotateZ(10deg) scale3d(1,1,1)";


//===============================
// MAIN INITIALIZATION
$(document).ready(function() {
//===============================
  if(mobileCheck()) $("html").addClass("isMobile");
  if(phoneCheck()) $("html").addClass("isPhone");
  if(tabletCheck()) $("html").addClass("isTablet");

  if(navigator.appName == 'Microsoft Internet Explorer') {
      var agent = navigator.userAgent;

      if(agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null) {
          var version = parseFloat(RegExp.$1);
          $("html").addClass("ie"+version);
      }
  };

  if(getLocalStorage("psychoCubeGame")) {
    $game = getLocalStorage("psychoCubeGame");
    $totalTime = $game.totalTime;
  }
  else {
    $game = { totalTime: 0, cubes: {} };
    $totalTime = 0;
    $isNewGame = true;
  }

  $currentTime = 0;

  $("#currentTime .value").html("-:-:-");
  $("#totalTime .value").html(getFormatedTime($totalTime));

  var timeline = new TimelineMax();
  timeline.set($("#scene"), { opacity:0, transform:"matrix(1, 0, 0, 1, 0, 0)" });

  buildCube(function() {
    timeline.to($("#scene"), 1, { opacity:1, transform:defaultTransform, ease:Power4.easeOut, clearProps:"all",
      onComplete:function() {
        $("#scene").css("transform", defaultTransform);
        newGame();
      }
    });
  });
});


//===============================
// NEW GAME & SAVE GAME
//===============================
function newGame() {
  checkFocus(function() {
    addListeners();

    $startTotalTime = $game.totalTime;
    $updateTimer = setInterval(updateTimer, 1000);

    $ready = true;
  });
}

function saveGame() {
  if(!$ready) return;
  $game.totalTime = $totalTime;

  $(".cube").each(function(i) {
    $game.cubes[this.id] = $(this).data();
  });

  setLocalStorage("psychoCubeGame", $game);
}


//===============================
// EVENT LISTENERS
function addListeners() {
//===============================
  $("#tridiv").on('mousedown touchstart', startRotation).on('mouseup touchend', stopRotation).on('mousemove touchmove', setRotation).on("mousewheel", setScale);

  $(".cube").on(eventtype, rotationMenu);
  $("#rotationMenu button").on(eventtype, rotate);

  $("#undo").on(eventtype, undo);
  $("#redo").on(eventtype, redo);

  $("#resetPosition").on(eventtype, function() {
    TweenMax.to($("#scene"), 1, { transform:defaultTransform, ease:Power4.easeOut, clearProps:"all",
      onComplete:function() {
        $("#scene").css("transform", defaultTransform);
      }
    });
  });

  $("#pause").on(eventtype, togglePause);

  $("#saveGame").on(eventtype, function() {
    saveGame();

    $("#saveGame").html("Game saved");
    setTimeout(function() { $("#saveGame").html("Save game"); }, 1000);
  });

  $("#glowSwitch").on(eventtype, glowMode);
  $("#resetCube").on(eventtype, resetCube);

  $(window).on("blur", pause);
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

function pause() {
  if($("body").hasClass("paused")) return;

  clearInterval($updateTimer);
  $("#pause").html("Resume");
  $("body").addClass("paused");
}

function resume() {
  if(!$("body").hasClass("paused")) return;

  $updateTimer = setInterval(updateTimer, 1000);
  $("#pause").html("Pause");
  $("body").removeClass("paused");
}

function togglePause() {
  if($("body").hasClass("paused")) resume();
  else pause();
}

function getFormatedTime(seconds) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds / 60) % 60;
  var s = Math.floor(seconds % 60);

  if(h < 10) h = "0"+h;
  if(m < 10) m = "0"+m;
  if(s < 10) s = "0"+s;

  var timeString = h+":"+m+":"+s;
  return timeString;
}


//===============================
// CUBE SETUP
//===============================
function buildCube(callback) {
  for(var z = 1; z <= 3; z++) {
    for(var x = 1; x <= 3; x++) {
      for(var y = 1; y <= 3; y++) {
        var id = "cube"+z+"-"+x+"-"+y;
        var newCube = $("<div id=\""+id+"\">").addClass("cube depth"+z+" row"+x+" column"+y);
        $("#protoCube").children().clone().appendTo(newCube);

        var protoPyramid = $("<div>").addClass("shape pyramid");
        $("#protoPyramid").children().clone().appendTo(protoPyramid);

        var frontPyramid = protoPyramid.clone().addClass("pyramid-front");
        var backPyramid = protoPyramid.clone().addClass("pyramid-back");
        var topPyramid = protoPyramid.clone().addClass("pyramid-top");
        var bottomPyramid = protoPyramid.clone().addClass("pyramid-bottom");
        var leftPyramid = protoPyramid.clone().addClass("pyramid-left");
        var rightPyramid = protoPyramid.clone().addClass("pyramid-right");

        if(z == 1) frontPyramid.appendTo(newCube);
        if(z == 3) backPyramid.appendTo(newCube);
        if(x == 1) topPyramid.appendTo(newCube);
        if(x == 3) bottomPyramid.appendTo(newCube);
        if(y == 1) leftPyramid.appendTo(newCube);
        if(y == 3) rightPyramid.appendTo(newCube);

        if($isNewGame) newCube.data({ "z": z, "x": x, "y": y });
        else {
          var coord = $game.cubes[id];
          newCube.data(coord);
        }

        newCube.appendTo("#psychoCube");
      }
    }
  }

  $("#scene").find("#protoCube, #protoPyramid").remove();
  callback();
}

function resetCube() {
  $(".cube").each(function() {
    var id = this.id.replace("cube","");
    var initCoord = id.split("-");

    $(this).data({ "z": parseInt(initCoord[0]), "x": parseInt(initCoord[1]), "y": parseInt(initCoord[2]) }).attr("style","");
  });
}


//===============================
// ROTATION CONTROLS
//===============================
function rotationMenu(e) {
  var target = e.currentTarget;
  if(cancelSelection(e) || $("body").hasClass("paused")) return;

  var posX = e.pageX;
  var posY = e.pageY;
  $("#rotationMenu").css({ left:posX+"px", top:posY+"px" });

  if(!$("body").hasClass("selecting")) {
    setTimeout(function() { $("#rotationMenu").addClass("open"); }, 200);
    $("body").addClass("selecting").on(eventtype, cancelSelection);

    $(window).on("keydown", rotate);
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
// ROTATION ACTIONS
//===============================
function rotate(e) {
  var target = e.currentTarget;
  var cube = $(".cube.selected");
  var action;

  if(target.id == "rowLeft" || e.which == 37) {
    rotateRow(cube.data("x"), -1);
    action = { type: "row", coord: cube.data("x"), dir: -1};
  }
  if(target.id == "rowRight" || e.which == 39) {
    rotateRow(cube.data("x"), 1);
    action = { type: "row", coord: cube.data("x"), dir: 1};
  }
  if(target.id == "colUp" || e.which == 38) {
    rotateCol(cube.data("y"), -1);
    action = { type: "col", coord: cube.data("y"), dir: -1};
  }
  if(target.id == "colDown" || e.which == 40) {
    rotateCol(cube.data("y"), 1);
    action = { type: "col", coord: cube.data("y"), dir: 1};
  }

  $actionArray[$actionIndex++] = action;
  if($actionIndex < $actionArray.length) {
    var actionsToRemove = $actionArray.length - $actionIndex;
    $actionArray.splice(-1, actionsToRemove);
  }

  if(e.which) cancelSelection(e);
  $(window).off("keydown", rotate);
}

function undo() {
  if($actionIndex < 1 || $("body").hasClass("paused")) return;
  var lastAction = $actionArray[$actionArray.length - 1];

  if(lastAction.type == "row")
    rotateRow(lastAction.coord, lastAction.dir * -1);
  else
    rotateCol(lastAction.coord, lastAction.dir * -1);

  $actionIndex--;
}

function redo() {
  if($actionIndex >= $actionArray.length  || $("body").hasClass("paused")) return;
  var nextAction = $actionArray[$actionIndex];

  if(nextAction.type == "row")
    rotateRow(nextAction.coord, nextAction.dir);
  else
    rotateCol(nextAction.coord, nextAction.dir);

  $actionIndex++;
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
  if(state == true) $("html").addClass("noGlow");
  else if(state == false) $("html").removeClass("noGlow");
  else $("html").toggleClass("noGlow");
}

debugMode();
glowMode();


//===============================
// LOCAL STORAGE
//===============================
function setLocalStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getLocalStorage(key)        { return JSON.parse(localStorage.getItem(key)); }


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