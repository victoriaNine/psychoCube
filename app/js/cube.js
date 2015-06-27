//===============================
//  COLOR MAPPING
// - Assigns a color to each face of the cube
//===============================
var colorMap = { front:"red", back:"orange", top:"white", bottom:"green", left:"yellow", right:"blue" };


//===============================
//  CUBE POSITIONING
// - Assigns each cube its position
// Dynamically generated by the setCubePosition function
//===============================
var cubePositions = {};


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
                    // 2-2-2 isn't visible and has no stickers
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
function setCubePositions() {
  for(var z = 1; z <= 3; z++) {
    for(var y = 1; y <= 3; y++) {
      for(var x = 1; x <= 3; x++) {
        var translateX = x * 9 - 9;
        var translateY = y * 9 - 9;
        var translateZ = z * -9 + 18;

        cubePositions[z+"-"+y+"-"+x] = "translate3d("+translateX+"em, "+translateY+"em, "+translateZ+"em)";
      }
    }
  }
}

function buildCube(callback) {
  // Empty the Psycho-Cube (useful in case it's being reinitialized)
  $("#psychoCube").empty();

  // For each dimension of the cube
  for(var z = 1; z <= 3; z++) {
    for(var y = 1; y <= 3; y++) {
      for(var x = 1; x <= 3; x++) {
        // Using the cube prototype, create a cube with the current loops' indexes as its ID
        var id = "cube"+z+"-"+y+"-"+x;
        var newCube = $("<div id=\""+id+"\">").addClass("cube");
        $protoCube.children().clone().appendTo(newCube);

        // Using the pyramid prototype, create a pyramid element for the stickers
        var protoPyramid = $("<div>").addClass("shape pyramid");
        $protoPyramid.children().clone().appendTo(protoPyramid);

        // Create a pyramid for each orientation/color couple
        var frontPyramid = protoPyramid.clone().addClass("color-"+colorMap.front);
        var backPyramid = protoPyramid.clone().addClass("color-"+colorMap.back);
        var topPyramid = protoPyramid.clone().addClass("color-"+colorMap.top);
        var bottomPyramid = protoPyramid.clone().addClass("color-"+colorMap.bottom);
        var leftPyramid = protoPyramid.clone().addClass("color-"+colorMap.left);
        var rightPyramid = protoPyramid.clone().addClass("color-"+colorMap.right);

        // If the game is starting a new game
        if($isNewGame) {
          // Set the initial cube and stickers values
          var cubeStickers = stickersMap[z+"-"+y+"-"+x]; // Fetch the current cube's sticker map
          var coordArray;
          var stickerData = {}; // Create an object to store the cube's stickers' data

          // If the cube has any stickers (in other words, not you cube 2-2-2)
          if(cubeStickers) {
            // If the cube has a front sticker
            if(cubeStickers.front) {
              // Add the cube's front sticker's coordinates to the front pyramid
              frontPyramid.addClass("pyramid-front");

              // Split the coordinates in an array and add them to the pyramid's data
              coordArray = cubeStickers.front.split("-");
              frontPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              // Add the pyramid's data to its cube
              stickerData.front = frontPyramid.data();
            }
            // If the cube has a back sticker
            if(cubeStickers.back) {
              // Add the cube's back sticker's coordinates to the back pyramid
              backPyramid.addClass("pyramid-back");

              // Split the coordinates in an array and add them to the pyramid's data
              coordArray = cubeStickers.back.split("-");
              backPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              // Add the pyramid's data to its cube
              stickerData.back = backPyramid.data();
            }
            // If the cube has a top sticker
            if(cubeStickers.top) {
              // Add the cube's top sticker's coordinates to the top pyramid
              topPyramid.addClass("pyramid-top");

              // Split the coordinates in an array and add them to the pyramid's data
              coordArray = cubeStickers.top.split("-");
              topPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              // Add the pyramid's data to its cube
              stickerData.top = topPyramid.data();
            }
            // If the cube has a bottom sticker
            if(cubeStickers.bottom) {
              // Add the cube's front sticker's coordinates to the bottom pyramid
              bottomPyramid.addClass("pyramid-bottom");

              // Split the coordinates in an array and add them to the pyramid's data
              coordArray = cubeStickers.bottom.split("-");
              bottomPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              // Add the pyramid's data to its cube
              stickerData.bottom = bottomPyramid.data();
            }
            // If the cube has a left sticker
            if(cubeStickers.left) {
              // Add the cube's front sticker's coordinates to the left pyramid
              leftPyramid.addClass("pyramid-left");

              // Split the coordinates in an array and add them to the pyramid's data
              coordArray = cubeStickers.left.split("-");
              leftPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              // Add the pyramid's data to its cube
              stickerData.left = leftPyramid.data();
            }
            // If the cube has a right sticker
            if(cubeStickers.right) {
              // Add the cube's front sticker's coordinates to the right pyramid
              rightPyramid.addClass("pyramid-right");

              // Split the coordinates in an array and add them to the pyramid's data
              coordArray = cubeStickers.right.split("-");
              rightPyramid.data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

              // Add the pyramid's data to its cube
              stickerData.right = rightPyramid.data();
            }
          }

          // Add to the cube's data its coordinates and all of its pyramids' data
          newCube.data({ "z": z, "y": y, "x": x, "stickerData":stickerData });
        }
        // If the player has a game save
        else {
          // Load the values from the saved game data
          var coord = $game.cubes[id];
          newCube.data(coord);

          // And add the cube and its pyramids their saved data following the same pattern as above
          var stickerData = newCube.data("stickerData");

          if(stickerData) {
            var data, stickerCoord;

            if(stickerData.front) {
              data = stickerData.front;
              stickerCoord = data["face"]+"-"+data["y"]+"-"+data["x"];

              frontPyramid.data(data);
              frontPyramid.addClass(getOrientation(stickerCoord));
            }

            if(stickerData.back) {
              data = stickerData.back;
              stickerCoord = data["face"]+"-"+data["y"]+"-"+data["x"];

              backPyramid.data(data);
              backPyramid.addClass(getOrientation(stickerCoord));
            }

            if(stickerData.top) {
              data = stickerData.top;
              stickerCoord = data["face"]+"-"+data["y"]+"-"+data["x"];

              topPyramid.data(data);
              topPyramid.addClass(getOrientation(stickerCoord));
            }

            if(stickerData.bottom) {
              data = stickerData.bottom;
              stickerCoord = data["face"]+"-"+data["y"]+"-"+data["x"];

              bottomPyramid.data(data);
              bottomPyramid.addClass(getOrientation(stickerCoord));
            }

            if(stickerData.left) {
              data = stickerData.left;
              stickerCoord = data["face"]+"-"+data["y"]+"-"+data["x"];

              leftPyramid.data(data);
              leftPyramid.addClass(getOrientation(stickerCoord));
            }

            if(stickerData.right) {
              data = stickerData.right;
              stickerCoord = data["face"]+"-"+data["y"]+"-"+data["x"];

              rightPyramid.data(data);
              rightPyramid.addClass(getOrientation(stickerCoord));
            }
          }
        }

        // Set the cube in position
        TweenMax.set(newCube, { transform: cubePositions[newCube.data("z")+"-"+newCube.data("y")+"-"+newCube.data("x")] });

        if(z == 1) frontPyramid.appendTo(newCube);    // If the cube is in the front, add a front pyramid
        if(z == 3) backPyramid.appendTo(newCube);     // If the cube is in the back, add a back pyramid
        if(y == 1) topPyramid.appendTo(newCube);      // If the cube is on top, add a top pyramid
        if(y == 3) bottomPyramid.appendTo(newCube);   // If the cube is at the bottom, add a bottom pyramid
        if(x == 1) leftPyramid.appendTo(newCube);     // If the cube is on the left, add a left pyramid
        if(x == 3) rightPyramid.appendTo(newCube);    // If the cube is on the right, add a right pyramid

        // Add the newly created cube to the Rubik's Cube
        newCube.appendTo("#psychoCube");
      }
    }
  }

  // When everything is done, call the callback function
  callback();
}

function resetCube() {
  // For each cube
  $(".cube").each(function() {
    // Determine the initial coordinates using the cube's ID
    var id = this.id.replace("cube","");
    var initCoord = id.split("-");

    // Update the cube's data and class name with the initial coordinates
    $(this).data({ "z": parseInt(initCoord[0]), "y": parseInt(initCoord[1]), "x": parseInt(initCoord[2]) });
    $(this).attr("class","cube "+this.id);

    // Fetch the cube's sticker map
    var cubeStickers = stickersMap[id];
    // For each of the cube's stickers
    $(this).find(".pyramid").each(function() {
      var sticker = this;

      // Fetch the current orientation and coordinates of the sticker
      var currentOrientation = getOrientation($(sticker).data("face"));

      // Fetch its initial ones
      var initValue = getInitialOrientation(sticker, cubeStickers);
      var initOrientation = initValue.replace("pyramid-","");

      // Update its data with its original coordinates
      $(sticker).data({ "face": parseInt(initCoord[0]), "y": parseInt(initCoord[1]), "x": parseInt(initCoord[2]) });

      // And pass the data to its parent cube
      var parentCube = $(sticker).parent();
      parentCube.data("stickerData")[initOrientation] = $(sticker).data();

      // Update the sticker's classes
      $(sticker).removeClass(currentOrientation).addClass(initValue);
    });
  });

  // Reset the actions
  $actionArray = [];
  $actionIndex = 0;
}

function randomizeCube() {
  var randomActions = 20; // Number of random turns
  var delay = 200; // For the animation, delay between each turn

  var doRandomAction = function() {
    // Determine the action's properties randomly
    var axis = ["z", "x", "y"][Math.floor(Math.random()*3)];
    var coord = Math.floor(Math.random()*3);
    var direction = Math.random() > .5 ? 1 : -1;

    // Create the action object and apply the corresponding rotation to the cube;
    var action = { axis: axis, coord: coord, direction: direction };
    rotateCube(action.axis, action.coord, action.direction);
  }

  // Generate the random actions with a delay between them
  for(var i = 0; i < randomActions; i++) {
    setTimeout(doRandomAction, i*delay);
  }

  // Return the generator's parameters for further reference
  return { randomActions: randomActions, delay: delay };
}


//===============================
// CUBE ROTATION
function rotateCube(axis, coord, direction) {
//===============================
  // Look up all cubes corresponding to the coordinate in the given axis
  var range = findRange(axis, coord);

  // For each cube in that range
  $(range).each(function() {
    // Determine which rotation map to check depending on the rotation axis
    var axisName = (axis == "x") ? "column" : (axis == "y") ? "row" : "depth";

    // Update the cube's coordinates
    updateCoord(axisName, this.id, direction);

    // Tween the cube to its new position
    TweenMax.to("#"+this.id, .4, { transform: cubePositions[$(this).data("z")+"-"+$(this).data("y")+"-"+$(this).data("x")], ease: Power2.easeInOut });

    // Update the cube's stickers with their new coordinates
    $(this).find(".pyramid").each(function() {
      updateSticker(axisName, this, direction);
    });
  })
}


//===============================
// CUBES
//===============================
function updateCoord(type, id, direction) {
  // Get the array corresponding to the rotation type
  var rotationArray = (type == "depth") ? depthRotation :
                      (type == "row") ? rowRotation : colRotation;

  // Find the current coordinates of the cube in the array
  var currentCoord = getCoord(type, id);

  // Get the cube's current step in the rotation
  // And determine its new one based on the rotation's direction
  var rotationStep = currentCoord[1];
  var newRotationStep = rotationStep + 1 * direction;

  // Adjust the step to the min and max values of the array to allow a loop rotation
  if(newRotationStep > rotationArray[currentCoord[0]].length - 1) newRotationStep = 0;
  if(newRotationStep < 0) newRotationStep = rotationArray[currentCoord[0]].length - 1;

  // Determine the cube's new coordinates based on its new step in the rotation
  var newCoord = rotationArray[currentCoord[0]][newRotationStep];
  // And update its data with it
  var coordArray = newCoord.split("-");
  $("#"+id).data({ "z": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });
}

function getCoord(type, id) {
  // Get the array corresponding to the rotation type
  var rotationArray = (type == "depth") ? depthRotation :
                      (type == "row") ? rowRotation : colRotation;

  // Fetch the cube's current coordinates
  var currentCoord = $("#"+id).data("z")+"-"+$("#"+id).data("y")+"-"+$("#"+id).data("x");

  // Looking for these coordinates in the rotation array
  var rotationSeries, rotationStep;
  for(var i = 0; i < rotationArray.length; i++) {
    var lookup = rotationArray[i].indexOf(currentCoord);

    // When found, fetch the current position
    if(lookup != -1) {
      rotationSeries = i;
      rotationStep = lookup;
    }
  }

  // Returning the position of the coordinates in an array
  return [rotationSeries, rotationStep];
}

function findRange(axis, value) {
  var cubeArray = [];

  // For each cube
  $(".cube").each(function() {
    // If its designated axis coordinate has the value passed in the arguments
    // Push it into the cube array
    if($(this).data(axis) == value) cubeArray.push(this);
  });

  return cubeArray;
}


//===============================
// STICKERS
//===============================
function updateSticker(type, sticker, direction) {
  // Get the array corresponding to the rotation type
  var rotationArray = (type == "depth") ? depthStickerRotation :
                      (type == "row") ? rowStickerRotation : colStickerRotation;

  // Find the current coordinates of the sticker in the array                
  var currentCoord = getSticker(type, sticker);

  // Get the sticker's current step in the rotation
  // And determine its new one based on the rotation's direction
  var rotationStep = currentCoord[1];
  var newRotationStep = rotationStep + 1 * direction;

  // Adjust the step to the min and max values of the array to allow a loop rotation
  if(newRotationStep > rotationArray[currentCoord[0]].length - 1) newRotationStep = 0;
  if(newRotationStep < 0) newRotationStep = rotationArray[currentCoord[0]].length - 1;

  // Determine the sticker's new coordinates based on its new step in the rotation
  var newCoord = rotationArray[currentCoord[0]][newRotationStep];

  // Determine the sticker's current and new orientation based on its coordinates
  var currentOrientation = getOrientation($(sticker).data("face"));
  var newOrientation = getOrientation(newCoord);
  // And update its class name
  $(sticker).removeClass(currentOrientation).addClass(newOrientation);

  // Update the sticker's data with its new coordinates
  var coordArray = newCoord.split("-");
  $(sticker).data({ "face": parseInt(coordArray[0]), "y": parseInt(coordArray[1]), "x": parseInt(coordArray[2]) });

  // And pass it to its parent cube
  var parentCube = $(sticker).parent();
  // Using the sticker's initial orientation to retrieve it in the cube's data
  var initOrientation = getInitialOrientation(sticker)[0].replace("pyramid-","");
  parentCube.data("stickerData")[initOrientation] = $(sticker).data();
}

function getSticker(type, sticker) {
  // Get the array corresponding to the rotation type
  var rotationArray = (type == "depth") ? depthStickerRotation :
                      (type == "row") ? rowStickerRotation : colStickerRotation;

  // Fetch the sticker's current coordinates
  var currentCoord = $(sticker).data("face")+"-"+$(sticker).data("y")+"-"+$(sticker).data("x");

  // Looking for these coordinates in the rotation array
  var rotationSeries, rotationStep;
  for(var i = 0; i < rotationArray.length; i++) {
    var lookup = rotationArray[i].indexOf(currentCoord);

    // When found, fetch the current position
    if(lookup != -1) {
      rotationSeries = i;
      rotationStep = lookup;
    }
  }

  // Returning the position of the coordinates in an array
  return [rotationSeries, rotationStep];
}

function getOrientation(stickerCoord) {
  var orientation;
  // Parse the sticker's coordinates in a string
  stickerCoord = stickerCoord.toString();

  // Determine the orientation of the sticker based on its coordinates
  if(stickerCoord.charAt(0) == 1) orientation = "front";
  if(stickerCoord.charAt(0) == 2) orientation = "back";
  if(stickerCoord.charAt(0) == 3) orientation = "top";
  if(stickerCoord.charAt(0) == 4) orientation = "bottom";
  if(stickerCoord.charAt(0) == 5) orientation = "left";
  if(stickerCoord.charAt(0) == 6) orientation = "right";

  return "pyramid-"+orientation;
}

function getInitialOrientation(sticker) {
  var orientation, coord;

  // For each color
  for(face in colorMap) {
    // If the sticker being checked is of that color
    if(sticker.classList.contains("color-"+colorMap[face])) {
      // Return the orientation corresponding to that color
      orientation = face;
    }
  }

  return "pyramid-"+orientation;
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