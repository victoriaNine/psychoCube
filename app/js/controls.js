var currentX, prevX;
var dirX, prevDirX;
var currentY, prevY;
var dirY, prevDirY;

var colRotation = [["1-1-1", "1-3-1", "3-3-1", "3-1-1"],
                   ["1-1-2", "1-3-2", "3-3-2", "3-1-2"],
                   ["1-1-3", "1-3-3", "3-3-3", "3-1-3"],

                   ["2-2-1"],
                   ["2-2-2"],
                   ["2-2-3"],

                   ["1-2-1", "2-3-1", "3-2-1", "2-1-1"],
                   ["1-2-2", "2-3-2", "3-2-2", "2-1-2"],
                   ["1-2-3", "2-3-3", "3-2-3", "2-1-3"]];

var rowRotation = [["1-1-1", "1-1-3", "3-1-3", "3-1-1"],
                   ["1-2-1", "1-2-3", "3-2-3", "3-2-1"],
                   ["1-3-1", "1-3-3", "3-3-3", "3-3-1"],

                   ["2-1-2"],
                   ["2-2-2"],
                   ["2-3-2"],

                   ["1-1-2", "2-1-3", "3-1-2", "2-1-1"],
                   ["1-2-2", "2-2-3", "3-2-2", "2-2-1"],
                   ["1-3-2", "2-3-3", "3-3-2", "2-3-1"]];

function startRotation() { $("body").addClass("moving"); }
function stopRotation() {
  if($("body").hasClass("moving")) {
    $("body").removeClass("moving");
    prevX = null;
    prevY = null;
  }
}

function debugMode(state) {
  if(state == true) $("html").addClass("debug");
  else if(state == false) $("html").removeClass("debug");
  else $("html").toggleClass("debug");
}

function setRotation(e) {
  if($("body").hasClass("moving")) {
    var transform = $(".scene")[0].style.transform;

    var transformValues = getCurrentTransform($(".scene")[0]);
    var rotateX = transformValues[0];
    var rotateY = transformValues[1];

    currentX = e.pageY || e.originalEvent.touches[0].pageY;
    if(!prevX) prevX = currentX;
    var deltaX = Math.abs(prevX - currentX);
    
    if(currentX > prevX) dirX = 1;
    else if(currentX < prevX) dirX = -1;

    currentY = e.pageX || e.originalEvent.touches[0].pageX;
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

    $(".scene").css("transform",newTransform);
  }
}

function setScale(e) {
  e.preventDefault();

  var transformValues = getCurrentTransform($(".scene")[0]);
  var scale = parseFloat(transformValues[3]);

  var delta = e.originalEvent.wheelDelta / 1000;
  var newScale = scale + delta;

  if(newScale < .1) newScale = .1;
  if(newScale > 1) newScale = 1;

  var newScaleString = newScale+","+newScale+","+newScale;
  var newTransform = "rotateX("+transformValues[0]+"deg) rotateY("+transformValues[1]+"deg) rotateZ("+transformValues[2]+"deg) scale3d("+newScaleString+")";

  $(".scene").css("transform", newTransform);
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

function rotateRow(rowNb, direction) {
  var row = findCube("x", rowNb);
  
  console.log("========");
  $(row).each(function() {
    var transform = getCurrentTransform(this);
    var newRotateY = transform[1] + 90 * direction;
    if(Math.abs(newRotateY) == 360) newRotateY = 0;

    var currentPosition = getPosition(this)[0]+"em, "+getPosition(this)[1]+"em, "+getPosition(this)[2]+"em";
    var newTransform = "rotateX("+transform[0]+"deg) rotateY("+newRotateY+"deg) rotateZ("+transform[2]+"deg) translate3d("+currentPosition+")";
    $(this).css("transform", newTransform);

    updateCoord("row", this.id, direction);
  })
}

function rotateColumn(columnNb, direction) {
  var column = findCube("y", columnNb);

  console.log("========");
  $(column).each(function() {
    var transform = getCurrentTransform(this);
    var newRotateX = transform[0] + 90 * direction * -1; // Inverted Y-axis controls
    if(Math.abs(newRotateX) == 360) newRotateX = 0;

    var currentPosition = getPosition(this)[0]+"em, "+getPosition(this)[1]+"em, "+getPosition(this)[2]+"em";
    var newTransform = "rotateX("+newRotateX+"deg) rotateY("+transform[1]+"deg) rotateZ("+transform[2]+"deg) translate3d("+currentPosition+")";
    $(this).css("transform", newTransform);

    updateCoord("column", this.id, direction);
  })
}

function findCube(data, value) {
  var cubeArray = [];

  $(".cube").each(function() {
    if($(this).data(data) == value) cubeArray.push(this);
  });

  return cubeArray;
}

function getCoord(type, id) {
  var typeArray = (type == "row") ? rowRotation : colRotation;
  var rotationIndex;
  var coordIndex;

  var currentCoord = $("#"+id).data("z")+"-"+$("#"+id).data("x")+"-"+$("#"+id).data("y");
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

function updateCoord(type, id, direction) {
  var typeArray = (type == "row") ? rowRotation : colRotation;
  var currentCoord = getCoord(type, id);

  var rotationState = currentCoord[1];
  var newRotationState = rotationState + 1 * direction;
  if(newRotationState > typeArray[currentCoord[0]].length - 1) newRotationState = 0;
  if(newRotationState < 0) newRotationState = typeArray[currentCoord[0]].length - 1;

  console.log("------")
  console.log($("#"+id).data());

  var newCoord = typeArray[currentCoord[0]][newRotationState];
  var coordArray = newCoord.split("-");
  $("#"+id).data({ "z": parseInt(coordArray[0]), "x": parseInt(coordArray[1]), "y": parseInt(coordArray[2]) });

  console.log($("#"+id).data());
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