var $game;
var $isNewGame = false;
var $startTime;
var $currentTime;
var $updateTimer;
var $ready = false;

var defaultTransform = "rotateX(-10deg) rotateY(25deg) rotateZ(10deg) scale3d(1,1,1)";

$(document).ready(function() {
  if(getLocalStorage("game"))
    $game = getLocalStorage("game");
  else {
    $game = { totalTime: 0, cubes: {} };
    $isNewGame = true;
  }

  var timeline = new TimelineMax();
  timeline.set($(".scene"), { opacity:0, transform:"matrix(1, 0, 0, 1, 0, 0)" });

  buildCube(function() {
    timeline.to($(".scene"), 1, { opacity:1, transform:defaultTransform, ease:Power4.easeOut, clearProps:"all",
      onComplete:function() {
        $(".scene").css("transform", defaultTransform);
        startGame();
      }
    });
  });
});

function startGame() {
  addControls();

  $startTime = Math.ceil(new Date().getTime() / 1000);
  $updateTimer = setInterval(function() {
    $currentTime = Math.ceil(new Date().getTime() / 1000);
  }, 1000);

  $ready = true;
}

function saveGame() {
  if(!$ready) return;

  clearInterval($updateTimer);
  $game.totalTime += $currentTime - $startTime;

  $(".cube").each(function(i) {
    $game.cubes[this.id] = $(this).data();
  });

  setLocalStorage("game", $game);
}

function addControls() {
  $(window).on('mousedown touchstart', startRotation).on('mouseup touchend', stopRotation).on('mousemove touchmove', setRotation).on("mousewheel", setScale);

  $("#reset").on("click touchstart", function() {
  TweenMax.to($(".scene"), 1, { transform:defaultTransform, ease:Power4.easeOut, clearProps:"all",
      onComplete:function() {
        $(".scene").css("transform", defaultTransform);
      }
    });
  });
}

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

  $(".scene").find("#protoCube, #protoPyramid").remove();
  callback();
}

//===============================
// LOCAL STORAGE
//===============================
function setLocalStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getLocalStorage(key)        { return JSON.parse(localStorage.getItem(key)); }