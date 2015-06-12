//===============================
// CUBE ROTATION MAPS
// - Each cube is notated like so :
// z coordinate - y coordinate - x coordinate
//
// Exemple : bottom left cube in the back
// - back : 3-?-?
// - bottom row : 3-3-?
// - left column : 3-3-1
//
// Each rotation type has a map allowing us to know
// what will be the cube's new coordinates
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
// Each rotation type has a map allowing us to know
// what will be the cube's new coordinates.
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
//  STICKER MAPPING
// - Assigns each sticker to its initial cube
//===============================
var stickersMap = { "1-1-1" : { front: "1-1-1", top: "3-3-1", left: "5-1-3" },
                    "1-1-2" : { front: "1-1-2", top: "3-3-2" },          
                    "1-1-3" : { front: "1-1-3", top: "3-3-3", right: "6-1-1" },

                    "1-2-1" : { front: "1-2-1", left: "5-2-3" },
                    "1-2-2" : { front: "1-2-2" },
                    "1-2-3" : { front: "1-2-3", right: "6-2-1" },

                    "1-3-1" : { front: "1-3-1", bottom: "4-1-1", left: "5-3-3" },      
                    "1-3-2" : { front: "1-3-2", bottom: "4-1-2" },
                    "1-3-3" : { front: "1-3-3", bottom: "4-1-3", right: "6-3-1" },

                    "2-1-1" : { top: "3-2-1", left: "5-1-2" },
                    "2-1-2" : { top: "3-2-2" },
                    "2-1-3" : { top: "3-2-3", right: "6-1-2" },

                    "2-2-1" : { left: "5-2-2" },
                    // 2-2-2 has no visible faces
                    "2-2-3" : { right: "6-2-2" },

                    "2-3-1" : { bottom: "4-2-1", left: "5-3-2" },
                    "2-3-2" : { bottom: "4-2-2" },
                    "2-3-3" : { bottom: "4-2-3", right: "6-3-2" },

                    "3-1-1" : { back: "2-3-1", top: "3-1-1", left: "5-1-1" },
                    "3-1-2" : { back: "2-3-2", top: "3-1-2" },
                    "3-1-3" : { back: "2-3-3", top: "3-1-3", right: "6-1-3" },

                    "3-2-1" : { back: "2-2-1", left: "5-2-1" },
                    "3-2-2" : { back: "2-2-2" },
                    "3-2-3" : { back: "2-2-3", right: "6-2-3" },

                    "3-3-1" : { back: "2-1-1", bottom: "4-3-1", left: "5-3-1" },
                    "3-3-2" : { back: "2-1-2", bottom: "4-3-2" },
                    "3-3-3" : { back: "2-1-3", bottom: "4-3-3", right: "6-3-3" } };


//===============================
// CUBE ROTATION
function rotateCube(axis, coord, direction) {
//===============================
  var range = findCubes(axis, coord);

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

  var rotationIndex;
  var coordIndex;

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

function findCubes(axis, value) {
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
  var initialOrientation = getInitialOrientation(sticker)[0].replace("pyramid-","");
  parentCube.data("stickerData")[initialOrientation] = $(sticker).data();
}

function getSticker(type, sticker) {
  var typeArray = (type == "depth") ? depthStickerRotation :
                  (type == "row") ? rowStickerRotation : colStickerRotation;

  var rotationIndex;
  var stickerIndex;

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
  var orientation;
  var coord;

  if(sticker.classList.contains("color-red")) {
    orientation = "front";
    if(cubeMap) coord = cubeMap.front;
  }
  if(sticker.classList.contains("color-orange")) {
    orientation = "back";
    if(cubeMap) coord = cubeMap.back;
  }
  if(sticker.classList.contains("color-white")) {
    orientation = "top";
    if(cubeMap) coord = cubeMap.top;
  }
  if(sticker.classList.contains("color-green")) {
    orientation = "bottom";
    if(cubeMap) coord = cubeMap.bottom;
  }
  if(sticker.classList.contains("color-yellow")) {
    orientation = "left";
    if(cubeMap) coord = cubeMap.left;
  }
  if(sticker.classList.contains("color-blue")) {
    orientation = "right";
    if(cubeMap) coord = cubeMap.right;
  }

  return ["pyramid-"+orientation, "sticker"+coord];
}