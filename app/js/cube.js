//===============================
//  COLOR MAPPING
// - Assigns a color to each face of the cube
//===============================
var colorMap = { front:"red", back:"orange", top:"white", bottom:"green", left:"yellow", right:"blue" };


//===============================
//  STICKER MAPPING
// - Assigns each sticker to its initial cube
//===============================
var stickersMap = { "1-1-1" : { front: "1-1-1", top: "3-3-1", left: "5-1-3", type: "corner" },
                    "1-1-2" : { front: "1-1-2", top: "3-3-2", type: "edge" },          
                    "1-1-3" : { front: "1-1-3", top: "3-3-3", right: "6-1-1", type: "corner" },

                    "1-2-1" : { front: "1-2-1", left: "5-2-3", type: "edge" },
                    "1-2-2" : { front: "1-2-2", type: "center" },
                    "1-2-3" : { front: "1-2-3", right: "6-2-1", type: "edge" },

                    "1-3-1" : { front: "1-3-1", bottom: "4-1-1", left: "5-3-3", type: "corner" },      
                    "1-3-2" : { front: "1-3-2", bottom: "4-1-2" },
                    "1-3-3" : { front: "1-3-3", bottom: "4-1-3", right: "6-3-1", type: "corner" },

                    "2-1-1" : { top: "3-2-1", left: "5-1-2", type: "edge" },
                    "2-1-2" : { top: "3-2-2", type: "center" },
                    "2-1-3" : { top: "3-2-3", right: "6-1-2", type: "edge" },

                    "2-2-1" : { left: "5-2-2", type: "center" },
                    // 2-2-2 has no visible faces
                    "2-2-3" : { right: "6-2-2", type: "center" },

                    "2-3-1" : { bottom: "4-2-1", left: "5-3-2", type: "edge" },
                    "2-3-2" : { bottom: "4-2-2", type: "center" },
                    "2-3-3" : { bottom: "4-2-3", right: "6-3-2", type: "edge" },

                    "3-1-1" : { back: "2-3-1", top: "3-1-1", left: "5-1-1", type: "corner" },
                    "3-1-2" : { back: "2-3-2", top: "3-1-2", type: "edge" },
                    "3-1-3" : { back: "2-3-3", top: "3-1-3", right: "6-1-3", type: "corner" },

                    "3-2-1" : { back: "2-2-1", left: "5-2-1", type: "edge" },
                    "3-2-2" : { back: "2-2-2", type: "center" },
                    "3-2-3" : { back: "2-2-3", right: "6-2-3", type: "edge" },

                    "3-3-1" : { back: "2-1-1", bottom: "4-3-1", left: "5-3-1", type: "corner" },
                    "3-3-2" : { back: "2-1-2", bottom: "4-3-2", type: "edge" },
                    "3-3-3" : { back: "2-1-3", bottom: "4-3-3", right: "6-3-3", type: "corner" } };


//===============================
// CUBE ROTATION MAPS
//
// - Each rotation type has a map allowing us to know
// what will be the cube's new coordinates
// - Each cube is notated like so :
// z coordinate - y coordinate - x coordinate
//
// Exemple : bottom left cube in the back
// - back : 3-?-?
// - bottom row : 3-3-?
// - left column : 3-3-1
//
//===============================
/* Z-axis rotation ------------*/
var depthRotation = [["1-1-1", "1-1-3", "1-3-3", "1-3-1"],
                     ["2-1-1", "2-1-3", "2-3-3", "2-3-1"],
                     ["3-1-1", "3-1-3", "3-3-3", "3-3-1"],

                     ["1-2-2"],
                     ["2-2-2"],
                     ["3-2-2"],

                     ["1-1-2", "1-2-3", "1-3-2", "1-2-1"],
                     ["2-1-2", "2-2-3", "2-3-2", "2-2-1"],
                     ["3-1-2", "3-2-3", "3-3-2", "3-2-1"]];


/* X-axis rotation ------------*/
var colRotation = [["1-1-1", "1-3-1", "3-3-1", "3-1-1"],
                   ["1-1-2", "1-3-2", "3-3-2", "3-1-2"],
                   ["1-1-3", "1-3-3", "3-3-3", "3-1-3"],

                   ["2-2-1"],
                   ["2-2-2"],
                   ["2-2-3"],

                   ["1-2-1", "2-3-1", "3-2-1", "2-1-1"],
                   ["1-2-2", "2-3-2", "3-2-2", "2-1-2"],
                   ["1-2-3", "2-3-3", "3-2-3", "2-1-3"]];

/* Y-axis rotation ------------*/
var rowRotation = [["1-1-1", "1-1-3", "3-1-3", "3-1-1"],
                   ["1-2-1", "1-2-3", "3-2-3", "3-2-1"],
                   ["1-3-1", "1-3-3", "3-3-3", "3-3-1"],

                   ["2-1-2"],
                   ["2-2-2"],
                   ["2-3-2"],

                   ["1-1-2", "2-1-3", "3-1-2", "2-1-1"],
                   ["1-2-2", "2-2-3", "3-2-2", "2-2-1"],
                   ["1-3-2", "2-3-3", "3-3-2", "2-3-1"]];


//===============================
//  STICKER ROTATION MAPS
//
// - Each rotation type has a map allowing us to know
// what will be the cube's new coordinates.
// - Each sticker is notated like so :
// ID of its face - y coordinate - x coordinate
// 
// 1 = front, 2 = back, 3 = top, 4 = bottom, 5 = left, 6 = right
// The numbering is relative to each face.
//
// Exemple : center-top sticker on the left face of the cube
// - left face : 5-?-?
// - top row : 5-1-?
// - center column : 5-1-2
//
// ! The back face's numbering is irregular. It is notated with
// the back face in front of us after a X-axis rotation of the cube.
//
// Exemple : facing the front, upper-right sticker on the back face of the cube
// - back face : 2-?-?
// - top row, ie bottom row when facing the back : 2-3-?
// - right column : 2-1-3
//
//===============================
/* Z-axis rotation ------------*/
var depthStickerRotation = [["3-3-1", "6-1-1", "4-1-3", "5-3-3"],    // faces involved : top, right, bottom, left
                            ["3-3-2", "6-2-1", "4-1-2", "5-2-3"],
                            ["3-3-3", "6-3-1", "4-1-1", "5-1-3"],

                            ["3-2-1", "6-1-2", "4-2-3", "5-3-2"],
                            ["3-2-2", "6-2-2", "4-2-2", "5-2-2"],
                            ["3-2-3", "6-3-2", "4-2-1", "5-1-2"],

                            ["3-1-1", "6-1-3", "4-3-3", "5-3-1"],
                            ["3-1-2", "6-2-3", "4-3-2", "5-2-1"],
                            ["3-1-3", "6-3-3", "4-3-1", "5-1-1"],

                            // Faces in the Z rotation axis
                            ["1-1-1", "1-1-3", "1-3-3", "1-3-1"],    // front face corners
                            ["1-1-2", "1-2-3", "1-3-2", "1-2-1"],    // front face edges
                            ["2-3-1", "2-3-3", "2-1-3", "2-1-1"],    // back face corners
                            ["2-3-2", "2-2-3", "2-1-2", "2-2-1"],    // back face edges

                            // Center faces
                            ["1-2-2"],
                            ["2-2-2"]];

/* X-axis rotation ------------*/
var colStickerRotation = [["1-1-1", "4-1-1", "2-1-1", "3-1-1"],      // faces involved : front, bottom, back, top
                          ["1-1-2", "4-1-2", "2-1-2", "3-1-2"],
                          ["1-1-3", "4-1-3", "2-1-3", "3-1-3"],

                          ["1-2-1", "4-2-1", "2-2-1", "3-2-1"],
                          ["1-2-2", "4-2-2", "2-2-2", "3-2-2"],
                          ["1-2-3", "4-2-3", "2-2-3", "3-2-3"],

                          ["1-3-1", "4-3-1", "2-3-1", "3-3-1"],
                          ["1-3-2", "4-3-2", "2-3-2", "3-3-2"],
                          ["1-3-3", "4-3-3", "2-3-3", "3-3-3"],

                          // Faces in the X rotation axis
                          ["5-1-3", "5-3-3", "5-3-1", "5-1-1"],      // left face corners
                          ["5-2-3", "5-3-2", "5-2-1", "5-1-2"],      // left face edges
                          ["6-1-1", "6-3-1", "6-3-3", "6-1-3"],      // right face corners
                          ["6-2-1", "6-3-2", "6-2-3", "6-1-2"],      // right face edges

                          // Center faces
                          ["5-2-2"],
                          ["6-2-2"]];

/* Y-axis rotation ------------*/
var rowStickerRotation = [["1-1-1", "6-1-1", "2-3-3", "5-1-1"],      // faces involved : front, right, back, left
                          ["1-1-2", "6-1-2", "2-3-2", "5-1-2"],
                          ["1-1-3", "6-1-3", "2-3-1", "5-1-3"],

                          ["1-2-1", "6-2-1", "2-2-3", "5-2-1"],
                          ["1-2-2", "6-2-2", "2-2-2", "5-2-2"],
                          ["1-2-3", "6-2-3", "2-2-1", "5-2-3"],

                          ["1-3-1", "6-3-1", "2-1-3", "5-3-1"],
                          ["1-3-2", "6-3-2", "2-1-2", "5-3-2"],
                          ["1-3-3", "6-3-3", "2-1-1", "5-3-3"],

                          // Faces in the Y rotation axis
                          ["3-3-1", "3-3-3", "3-1-3", "3-1-1"],      // top face corners
                          ["3-3-2", "3-2-3", "3-1-2", "3-2-1"],      // top face edges
                          ["4-1-1", "4-3-1", "4-3-3", "4-1-3"],      // bottom face corners
                          ["4-1-2", "4-2-3", "4-3-2", "4-2-1"],      // botom face edges

                          // Center faces
                          ["3-2-2"],
                          ["4-2-2"]];


//===============================
// CUBE SETUP
//===============================
function buildCube(callback) {
  $("#psychoCube").empty();

  for(var z = 1; z <= 3; z++) {
    for(var y = 1; y <= 3; y++) {
      for(var x = 1; x <= 3; x++) {
        var id = "cube"+z+"-"+y+"-"+x;
        var newCube = $("<div id=\""+id+"\">").addClass("cube");
        $protoCube.children().clone().appendTo(newCube);

        var protoPyramid = $("<div>").addClass("shape pyramid");
        $protoPyramid.children().clone().appendTo(protoPyramid);

        var frontPyramid = protoPyramid.clone().addClass("color-"+colorMap.front);
        var backPyramid = protoPyramid.clone().addClass("color-"+colorMap.back);
        var topPyramid = protoPyramid.clone().addClass("color-"+colorMap.top);
        var bottomPyramid = protoPyramid.clone().addClass("color-"+colorMap.bottom);
        var leftPyramid = protoPyramid.clone().addClass("color-"+colorMap.left);
        var rightPyramid = protoPyramid.clone().addClass("color-"+colorMap.right);

        if($isNewGame) {
          // Set initial cube and stickers values
          var cubeStickers = stickersMap[z+"-"+y+"-"+x];
          var coordArray;
          var stickerData = {};

          if(cubeStickers) {
            if(cubeStickers.front) {
              frontPyramid.addClass("pyramid-front sticker"+cubeStickers.front);

              coordArray = cubeStickers.front.split("-");
              frontPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              stickerData.front = frontPyramid.data();
            }
            if(cubeStickers.back) {
              backPyramid.addClass("pyramid-back sticker"+cubeStickers.back);

              coordArray = cubeStickers.back.split("-");
              backPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              stickerData.back = backPyramid.data();
            }
            if(cubeStickers.top) {
              topPyramid.addClass("pyramid-top sticker"+cubeStickers.top);

              coordArray = cubeStickers.top.split("-");
              topPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              stickerData.top = topPyramid.data();
            }
            if(cubeStickers.bottom) {
              bottomPyramid.addClass("pyramid-bottom sticker"+cubeStickers.bottom);

              coordArray = cubeStickers.bottom.split("-");
              bottomPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              stickerData.bottom = bottomPyramid.data();
            }
            if(cubeStickers.left) {
              leftPyramid.addClass("pyramid-left sticker"+cubeStickers.left);

              coordArray = cubeStickers.left.split("-");
              leftPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              stickerData.left = leftPyramid.data();
            }
            if(cubeStickers.right) {
              rightPyramid.addClass("pyramid-right sticker"+cubeStickers.right);

              coordArray = cubeStickers.right.split("-");
              rightPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              stickerData.right = rightPyramid.data();
            }
          }

          newCube.addClass("cube"+z+"-"+y+"-"+x);
          newCube.data({ "z": z, "y": y, "x": x, "stickerData":stickerData });
        }
        else {
          // Load the values from the saved game data
          var coord = $game.cubes[id];
          newCube.data(coord);

          newCube.addClass("cube"+newCube.data("z")+"-"+newCube.data("y")+"-"+newCube.data("x"));
          var stickerData = newCube.data("stickerData");

          if(stickerData) {
            var data, stickerId;

            if(stickerData.front) {
              data = stickerData.front;
              stickerId = data["face"]+"-"+data["y"]+"-"+data["x"];

              frontPyramid.data(data);
              frontPyramid.addClass(getOrientation(stickerId)+" sticker"+stickerId);
            }

            if(stickerData.back) {
              data = stickerData.back;
              stickerId = data["face"]+"-"+data["y"]+"-"+data["x"];

              backPyramid.data(data);
              backPyramid.addClass(getOrientation(stickerId)+" sticker"+stickerId);
            }

            if(stickerData.top) {
              data = stickerData.top;
              stickerId = data["face"]+"-"+data["y"]+"-"+data["x"];

              topPyramid.data(data);
              topPyramid.addClass(getOrientation(stickerId)+" sticker"+stickerId);
            }

            if(stickerData.bottom) {
              data = stickerData.bottom;
              stickerId = data["face"]+"-"+data["y"]+"-"+data["x"];

              bottomPyramid.data(data);
              bottomPyramid.addClass(getOrientation(stickerId)+" sticker"+stickerId);
            }

            if(stickerData.left) {
              data = stickerData.left;
              stickerId = data["face"]+"-"+data["y"]+"-"+data["x"];

              leftPyramid.data(data);
              leftPyramid.addClass(getOrientation(stickerId)+" sticker"+stickerId);
            }

            if(stickerData.right) {
              data = stickerData.right;
              stickerId = data["face"]+"-"+data["y"]+"-"+data["x"];

              rightPyramid.data(data);
              rightPyramid.addClass(getOrientation(stickerId)+" sticker"+stickerId);
            }
          }
        }

        if(z == 1) frontPyramid.appendTo(newCube);
        if(z == 3) backPyramid.appendTo(newCube);
        if(y == 1) topPyramid.appendTo(newCube);
        if(y == 3) bottomPyramid.appendTo(newCube);
        if(x == 1) leftPyramid.appendTo(newCube);
        if(x == 3) rightPyramid.appendTo(newCube);

        newCube.appendTo("#psychoCube");
      }
    }
  }

  callback();
}

function resetCube() {
  $(".cube").each(function() {
    var id = this.id.replace("cube","");
    var initCoord = id.split("-");

    $(this).data({ "z": parseInt(initCoord[0]), "y": parseInt(initCoord[1]), "x": parseInt(initCoord[2]) });
    $(this).attr("class","cube "+this.id);

    var cubeStickers = stickersMap[id];
    $(this).find(".pyramid").each(function() {
      var sticker = this;

      var currentOrientation = getOrientation($(sticker).data("face"));
      var currentSticker = "sticker"+$(sticker).data("face")+"-"+$(sticker).data("y")+"-"+$(sticker).data("x");

      var initValues = getInitialOrientation(sticker, cubeStickers);
      var initOrientation = initValues[0].replace("pyramid-","");
      var initCoord = initValues[1].replace("sticker","").split("-");

      $(sticker).data({ "face": parseInt(initCoord[0]), "y": parseInt(initCoord[1]), "x": parseInt(initCoord[2]) });

      var parentCube = $(sticker).parent();
      parentCube.data("stickerData")[initOrientation] = $(sticker).data();

      $(sticker).removeClass(currentOrientation).addClass(initValues[0]);
      $(sticker).removeClass(currentSticker).addClass(initValues[1]);
    });
  });

  $actionArray = [];
  $actionIndex = 0;
}

function randomizeCube() {
  var randomActions = 20;
  var delay = 100;

  var doRandomAction = function() {
    var axis = ["z", "x", "y"];
    var coord = Math.floor(Math.random()*3);
    var direction = Math.random() > .5 ? 1 : -1;

    var action = { axis: axis[Math.floor(Math.random()*3)], coord: coord, direction: direction };
    rotateCube(action.axis, action.coord, action.direction);
  }

  for(var i = 0; i < randomActions; i++) {
    setTimeout(doRandomAction, i*delay);
  }

  return { randomActions: randomActions, delay: delay };
}


//===============================
// CUBE ROTATION
function rotateCube(axis, coord, direction) {
//===============================
  var range = findRange(axis, coord);

  $(range).each(function() {
    var axisName = (axis == "x") ? "column" : (axis == "y") ? "row" : "depth";

    var currentClass = "cube"+$(this).data("z")+"-"+$(this).data("y")+"-"+$(this).data("x");
    updateCoord(axisName, this.id, direction);

    var newClass = "cube"+$(this).data("z")+"-"+$(this).data("y")+"-"+$(this).data("x");
    $(this).removeClass(currentClass).addClass(newClass);

    $(this).find(".pyramid").each(function() {
      updateSticker(axisName, this, direction);
    });
  })
}


//===============================
// CUBES
//===============================
function updateCoord(type, id, direction) {
  var typeArray = (type == "depth") ? depthRotation :
                  (type == "row") ? rowRotation : colRotation;

  var currentCoord = getCoord(type, id);

  var rotationState = currentCoord[1];
  var newRotationState = rotationState + 1 * direction;
  if(newRotationState > typeArray[currentCoord[0]].length - 1) newRotationState = 0;
  if(newRotationState < 0) newRotationState = typeArray[currentCoord[0]].length - 1;

  var newCoord = typeArray[currentCoord[0]][newRotationState];
  var coordArray = newCoord.split("-");
  $("#"+id).data({ "z": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });
}

function getCoord(type, id, initialPosition) {
  var typeArray = (type == "depth") ? depthRotation :
                  (type == "row") ? rowRotation : colRotation;

  var rotationIndex, coordIndex;

  var currentCoord = $("#"+id).data("z")+"-"+$("#"+id).data("y")+"-"+$("#"+id).data("x");
  if(initialPosition) currentCoord = id.replace("cube","");

  var lookup = -1;
  for(var i = 0; i < typeArray.length; i++) {
    var lookup = typeArray[i].indexOf(currentCoord);

    if(lookup != -1) {
      rotationIndex = i;
      coordIndex = lookup;
    }
  }

  return [rotationIndex, coordIndex];
}

function findRange(axis, value) {
  var cubeArray = [];

  $(".cube").each(function() {
    if($(this).data(axis) == value) cubeArray.push(this);
  });

  return cubeArray;
}


//===============================
// STICKERS
//===============================
function updateSticker(type, sticker, direction) {
  var typeArray = (type == "depth") ? depthStickerRotation :
                  (type == "row") ? rowStickerRotation : colStickerRotation;

  var currentCoord = getSticker(type, sticker);

  var rotationState = currentCoord[1];
  var newRotationState = rotationState + 1 * direction;

  if(newRotationState > typeArray[currentCoord[0]].length - 1) newRotationState = 0;
  if(newRotationState < 0) newRotationState = typeArray[currentCoord[0]].length - 1;
  var newCoord = typeArray[currentCoord[0]][newRotationState];

  var currentSticker = "sticker"+$(sticker).data("face")+"-"+$(sticker).data("y")+"-"+$(sticker).data("x");
  var newSticker = "sticker"+newCoord;
  $(sticker).removeClass(currentSticker).addClass(newSticker);

  var currentOrientation = getOrientation($(sticker).data("face"));
  var newOrientation = getOrientation(newCoord);

  $(sticker).removeClass(currentOrientation).addClass(newOrientation);

  var coordArray = newCoord.split("-");
  $(sticker).data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

  var parentCube = $(sticker).parent();
  var initOrientation = getInitialOrientation(sticker)[0].replace("pyramid-","");
  parentCube.data("stickerData")[initOrientation] = $(sticker).data();
}

function getSticker(type, sticker) {
  var typeArray = (type == "depth") ? depthStickerRotation :
                  (type == "row") ? rowStickerRotation : colStickerRotation;

  var rotationIndex, stickerIndex;

  var currentSticker = $(sticker).data("face")+"-"+$(sticker).data("y")+"-"+$(sticker).data("x");

  var lookup = -1;
  for(var i = 0; i < typeArray.length; i++) {
    var lookup = typeArray[i].indexOf(currentSticker);

    if(lookup != -1) {
      rotationIndex = i;
      stickerIndex = lookup;
    }
  }

  return [rotationIndex, stickerIndex];
}

function getOrientation(stickerCoord) {
  var orientation;
  stickerCoord = stickerCoord.toString();

  if(stickerCoord.charAt(0) == 1) orientation = "front";
  if(stickerCoord.charAt(0) == 2) orientation = "back";
  if(stickerCoord.charAt(0) == 3) orientation = "top";
  if(stickerCoord.charAt(0) == 4) orientation = "bottom";
  if(stickerCoord.charAt(0) == 5) orientation = "left";
  if(stickerCoord.charAt(0) == 6) orientation = "right";

  return "pyramid-"+orientation;
}

function getInitialOrientation(sticker, cubeMap) {
  var orientation, coord;

  for(face in colorMap) {
    if(sticker.classList.contains("color-"+colorMap[face])) {
      orientation = face;
      if(cubeMap) coord = cubeMap[face];
    }
  }

  return ["pyramid-"+orientation, "sticker"+coord];
}


//===============================
// CHECKING THE CUBE'S COMPLETION
function checkCube() {
//===============================
  var check = false;

  // Check each color
  for(face in colorMap) {
    // Check each sticker from that color
    $(".color-"+colorMap[face]).each(function() {

      // If the sticker isn't on the right face for its color
      // Then the cube hasn't been solved yet
      check = $(this).hasClass("pyramid-"+face);
      return check;
    });

    if(!check) break;
  }

  return check;
}