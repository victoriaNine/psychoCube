var currentX, prevX;
var dirX, prevDirX;
var currentY, prevY;
var dirY, prevDirY;

var depthRotation = [["1-1-1", "1-1-3", "1-3-3", "1-3-1"],
                     ["2-1-1", "2-1-3", "2-3-3", "2-3-1"],
                     ["3-1-1", "3-1-3", "3-3-3", "3-3-1"],

                     ["1-2-2"],
                     ["2-2-2"],
                     ["3-2-2"],

                     ["1-1-2", "1-2-3", "1-3-2", "1-2-1"],
                     ["2-1-2", "2-2-3", "2-3-2", "2-2-1"],
                     ["3-1-2", "3-2-3", "3-3-2", "3-2-1"]];

var rowRotation = [["1-1-1", "1-1-3", "3-1-3", "3-1-1"],
                   ["1-2-1", "1-2-3", "3-2-3", "3-2-1"],
                   ["1-3-1", "1-3-3", "3-3-3", "3-3-1"],

                   ["2-1-2"],
                   ["2-2-2"],
                   ["2-3-2"],

                   ["1-1-2", "2-1-3", "3-1-2", "2-1-1"],
                   ["1-2-2", "2-2-3", "3-2-2", "2-2-1"],
                   ["1-3-2", "2-3-3", "3-3-2", "2-3-1"]];

var colRotation = [["1-1-1", "1-3-1", "3-3-1", "3-1-1"],
                   ["1-1-2", "1-3-2", "3-3-2", "3-1-2"],
                   ["1-1-3", "1-3-3", "3-3-3", "3-1-3"],

                   ["2-2-1"],
                   ["2-2-2"],
                   ["2-2-3"],

                   ["1-2-1", "2-3-1", "3-2-1", "2-1-1"],
                   ["1-2-2", "2-3-2", "3-2-2", "2-1-2"],
                   ["1-2-3", "2-3-3", "3-2-3", "2-1-3"]];

var depthFaceRotation = [["3-3-1", "6-1-1", "4-1-3", "5-3-3"],    // faces involved : top, right, bottom, left
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
                         ["2-3-3", "2-3-1", "2-1-1", "2-1-3"],    // back face corners
                         ["2-3-2", "2-2-1", "2-1-2", "2-2-3"],    // back face edges

                         // Center faces
                         ["1-2-2"],
                         ["2-2-2"]];

var rowFaceRotation = [["1-1-1", "6-1-1", "2-3-3", "5-1-1"],      // faces involved : front, right, back, left
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

var colFaceRotation = [["1-1-1", "4-1-1", "2-1-1", "3-1-1"],      // faces involved : front, bottom, back, top
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

var facesMap = { "1-1-1" : { front: "1-1-1", top: "3-3-1", left: "5-1-3" },
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

function startRotation() { if(!$("body").hasClass("selecting") && !$("body").hasClass("paused")) $("body").addClass("moving"); }
function stopRotation() {
  if($("body").hasClass("moving")) {
    $("body").removeClass("moving");
    prevX = null;
    prevY = null;
  }
}

function setRotation(e) {
  if($("body").hasClass("moving")) {
    var transform = $("#scene")[0].style.transform;
    var transformValues = getCurrentTransform($("#scene")[0]);
    var rotateX = transformValues[0];
    var rotateY = transformValues[1];

    if(mobileCheck()) e = e.originalEvent.touches[0];

    currentX = e.pageY;
    if(!prevX) prevX = currentX;
    var deltaX = Math.abs(prevX - currentX);
    
    if(currentX > prevX) dirX = 1;
    else if(currentX < prevX) dirX = -1;

    currentY = e.pageX;
    if(!prevY) prevY = currentY;
    var deltaY = Math.abs(prevY - currentY);
    
    if(currentY > prevY) dirY = 1;
    else if(currentY < prevY) dirY = -1;
    
    // Chrome mouseover bug fix
    if(prevDirX == undefined) {
      deltaX = 0;
      prevDirX = 0;
    }

    if(prevDirY == undefined) {
      deltaY = 0;
      prevDirY = 0;
    }
    
    prevX = currentX;
    prevY = currentY;

    // Inverted Y-axis controls
    var newRotateX = rotateX + deltaX * dirX*-1;
    var newRotateY = rotateY + deltaY * dirY;

    var newTransform = "rotateX("+newRotateX+"deg) rotateY("+newRotateY+"deg) rotateZ("+transformValues[2]+"deg) scale3d("+transformValues[3]+")";

    $("#scene").css("transform",newTransform);
  }
}

function setScale(e) {
  e.preventDefault();
  if($("body").hasClass("paused")) return;

  var transformValues = getCurrentTransform($("#scene")[0]);
  var scale = parseFloat(transformValues[3]);

  var delta = e.originalEvent.wheelDelta / 1000;
  var newScale = scale + delta;

  if(newScale < .5) newScale = .5;
  if(newScale > 1.5) newScale = 1.5;

  var newScaleString = newScale+","+newScale+","+newScale;
  var newTransform = "rotateX("+transformValues[0]+"deg) rotateY("+transformValues[1]+"deg) rotateZ("+transformValues[2]+"deg) scale3d("+newScaleString+")";

  $("#scene").css("transform", newTransform);
}

function getCurrentTransform(element) {
  var transform = element.style.transform;

  var rotateX = transform.slice(transform.indexOf("rotateX("), transform.length);
  rotateX = rotateX.replace("rotateX(", "");
  rotateX = rotateX.slice(0, rotateX.indexOf(")"));
  rotateX = parseFloat(rotateX);
  if(!rotateX || isNaN(rotateX)) rotateX = 0;

  var rotateY = transform.slice(transform.indexOf("rotateY("), transform.length);
  rotateY = rotateY.replace("rotateY(", "");
  rotateY = rotateY.slice(0, rotateY.indexOf(")"));
  rotateY = parseFloat(rotateY);
  if(!rotateY || isNaN(rotateY)) rotateY = 0;

  var rotateZ = transform.slice(transform.indexOf("rotateZ("), transform.length);
  rotateZ = rotateZ.replace("rotateZ(", "");
  rotateZ = rotateZ.slice(0, rotateZ.indexOf(")"));
  rotateZ = parseFloat(rotateZ);
  if(!rotateZ || isNaN(rotateZ)) rotateZ = 0;

  var scale = transform.slice(transform.indexOf("scale3d("), transform.length);
  scale = scale.replace("scale3d(", "");
  scale = scale.slice(0, scale.indexOf(")"));
  if(!scale) scale = "1, 1, 1";

  var translate = transform.slice(transform.indexOf("translate3d("), transform.length);
  translate = translate.replace("translate3d(", "");
  translate = translate.slice(0, translate.indexOf(")"));
  if(!translate) translate = "0, 0, 0";

  return [rotateX, rotateY, rotateZ, scale, translate];
}

function getPosition(cube) {
  var translate = getCSSstyle(cube.id, "transform");
  translate = translate.replace("translate3d(", "");
  translate = translate.slice(0, translate.indexOf(")"));

  var array = [];

  for(var i = 0; i < 3; i++) {
    var value = parseFloat(translate);
    translate = translate.replace(parseFloat(translate),"");
    translate = translate.replace("em, ","");
    array.push(value);
  }

  return array;
}

function rotateCube(axis, coord, direction) {
  var range = findCube(axis, coord);

  $(range).each(function() {
    var axisName = (axis == "x") ? "row" : (axis == "y") ? "column" : "depth";
    updateCoord(axisName, this.id, direction);

    var currentClass = this.className.match(/cube([0-9])\-([0-9])\-([0-9])/)[0];
    var newClass = "cube"+$(this).data("z")+"-"+$(this).data("x")+"-"+$(this).data("y");
    $(this).removeClass(currentClass).addClass(newClass);

    $(this).find(".pyramid").each(function() {
      updateFace(axisName, this, direction);
    });
  })
}


// CUBES
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
  $("#"+id).data({ "z": parseInt(coordArray[0]), "x": parseInt(coordArray[1]), "y": parseInt(coordArray[2]) });
}

function getCoord(type, id, initialPosition) {
  var typeArray = (type == "depth") ? depthRotation :
                  (type == "row") ? rowRotation : colRotation;

  var rotationIndex;
  var coordIndex;

  var currentCoord = $("#"+id).data("z")+"-"+$("#"+id).data("x")+"-"+$("#"+id).data("y");
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

// FACES
function updateFace(type, face, direction) {
  var typeArray = (type == "depth") ? depthFaceRotation :
                  (type == "row") ? rowFaceRotation : colFaceRotation;

  var currentCoord = getFace(type, face);

  var rotationState = currentCoord[1];
  var newRotationState = rotationState + 1 * direction;

  if(newRotationState > typeArray[currentCoord[0]].length - 1) newRotationState = 0;
  if(newRotationState < 0) newRotationState = typeArray[currentCoord[0]].length - 1;
  var newCoord = typeArray[currentCoord[0]][newRotationState];

  var currentFace = face.className.match(/face([0-9])\-([0-9])\-([0-9])/)[0];
  var newFace = "face"+newCoord;
  $(face).removeClass(currentFace).addClass(newFace);

  var classes = face.className.split(" ");
  var currentOrientation = classes.filter(function(className) { if(className.indexOf("pyramid-") >= 0) return true; })[0];

  var newOrientation = (function() {
    var orientation;

    if(newCoord.charAt(0) == 1) orientation = "front";
    if(newCoord.charAt(0) == 2) orientation = "back";
    if(newCoord.charAt(0) == 3) orientation = "top";
    if(newCoord.charAt(0) == 4) orientation = "bottom";
    if(newCoord.charAt(0) == 5) orientation = "left";
    if(newCoord.charAt(0) == 6) orientation = "right";

    return "pyramid-"+orientation;
  })();

  $(face).removeClass(currentOrientation).addClass(newOrientation);
}

function getFace(type, face) {
  var typeArray = (type == "depth") ? depthFaceRotation :
                  (type == "row") ? rowFaceRotation : colFaceRotation;

  var rotationIndex;
  var faceIndex;

  var currentFace = face.className.match(/face([0-9])\-([0-9])\-([0-9])/)[0];
  currentFace = currentFace.replace("face","");

  var lookup = -1;
  for(var i = 0; i < typeArray.length; i++) {
    var lookup = typeArray[i].indexOf(currentFace);

    if(lookup != -1) {
      rotationIndex = i;
      faceIndex = lookup;
    }
  }

  return [rotationIndex, faceIndex];
}

function findCube(data, value) {
  var cubeArray = [];

  $(".cube").each(function() {
    if($(this).data(data) == value) cubeArray.push(this);
  });

  return cubeArray;
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