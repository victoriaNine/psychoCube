var currentX, prevX;
var dirX, prevDirX;
var currentY, prevY;
var dirY, prevDirY;

/*var depthRotation = [["1-1-1", "1-1-3", "1-3-3", "1-3-1"],
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
                   ["1-2-3", "2-3-3", "3-2-3", "2-1-3"]];*/

var sideRotation = [["3-3-1", "6-1-1", "4-1-3", "5-3-3"],
                    ["3-3-2", "6-2-1", "4-1-2", "5-2-3"],
                    ["3-3-3", "6-3-1", "4-1-1", "5-1-3"],

                    ["3-2-1", "6-1-2", "4-2-3", "5-3-2"],
                    ["3-2-2", "6-2-2", "4-2-2", "5-2-2"],
                    ["3-2-3", "6-3-2", "4-2-1", "5-1-2"],

                    ["3-1-1", "6-1-3", "4-3-3", "5-3-1"],
                    ["3-1-2", "6-2-3", "4-3-2", "5-2-1"],
                    ["3-1-3", "6-3-3", "4-3-1", "5-1-1"]];

var rowRotation = [["1-1-1", "6-1-1", "2-3-3", "5-1-1"],
                   ["1-1-2", "6-1-2", "2-3-2", "5-1-2"],
                   ["1-1-3", "6-1-3", "2-3-1", "5-1-3"],

                   ["1-2-1", "6-2-1", "2-2-3", "5-2-1"],
                   ["1-2-2", "6-2-2", "2-2-2", "5-2-2"],
                   ["1-2-3", "6-2-3", "2-2-1", "5-2-3"],

                   ["1-3-1", "6-3-1", "2-1-3", "5-3-1"],
                   ["1-3-2", "6-3-2", "2-1-2", "5-3-2"],
                   ["1-3-3", "6-3-3", "2-1-1", "5-3-3"]];

var colRotation = [["1-1-1", "4-1-1", "2-1-1", "3-1-1"],
                   ["1-1-2", "4-1-2", "2-1-2", "3-1-2"],
                   ["1-1-3", "4-1-3", "2-1-3", "3-1-3"],

                   ["1-2-1", "4-2-1", "2-2-1", "3-2-1"],
                   ["1-2-2", "4-2-2", "2-2-2", "3-2-2"],
                   ["1-2-3", "4-2-3", "2-2-3", "3-2-3"],

                   ["1-3-1", "4-3-1", "2-3-1", "3-3-1"],
                   ["1-3-2", "4-3-2", "2-3-2", "3-3-2"],
                   ["1-3-3", "4-3-3", "2-3-3", "3-3-3"]]; 

var faceDependancies = [["1-1-1", "3-3-1", "5-1-3"],
                        ["1-1-2", "3-3-2"],
                        ["1-1-3", "3-3-3", "6-1-1"],

                        ["1-2-1", "5-2-3"],
                        ["1-2-3", "6-2-1"],

                        ["1-3-1", "4-1-1", "5-3-3"],
                        ["1-3-2", "4-1-2"],
                        ["1-3-3", "4-1-3", "6-3-1"],

                        ["5-1-2", "3-2-1"],
                        ["6-1-2", "3-2-3"],

                        ["5-3-2", "4-2-1"],
                        ["6-3-2", "4-2-3"],

                        ["1-2-2"],
                        ["2-2-2"],
                        ["3-2-2"],
                        ["4-2-2"],
                        ["5-2-2"],
                        ["6-2-2"],

                        ["2-3-3", "3-1-3", "6-1-3"],
                        ["2-3-2", "3-1-2"],
                        ["2-3-1", "3-1-1", "5-1-1"],

                        ["2-2-3", "6-2-3"],
                        ["2-2-1", "5-2-1"],

                        ["2-1-3", "4-3-3", "6-3-3"],
                        ["2-1-2", "4-3-2"],
                        ["2-1-1", "4-3-1", "5-3-1"]];

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

function rotateDepth(depthNb, direction) {
  var depth = findCube("z", depthNb);

  $(depth).each(function() {
    /*if(depthNb == 1) $(this).css("transform-origin", "13.5em 13.5em -9em"); // 1-2-2
    if(depthNb == 2) $(this).css("transform-origin", "13.5em 13.5em 0em"); // 2-2-2
    if(depthNb == 3) $(this).css("transform-origin", "13.5em 13.5em 9em"); // 3-2-2*/

    var initCoord = getCoord("depth", this.id, true);
    updateCoord("depth", this.id, direction);
    var newCoord = getCoord("depth", this.id);

    var coordDelta = (newCoord[1] - initCoord[1]) * -1;

    var transform = getCurrentTransform(this);
    var newRotateZ = transform[2];
    var newRotateX = transform[0];
    var newRotateY = transform[1];

    //newRotateZ = 90 * direction * coordDelta;
    newRotateZ += 90 * direction;
    
    setRotate(this, newRotateZ, newRotateX, newRotateY);
  })
}

function rotateRow(rowNb, direction) {
  var row = findCube("x", rowNb);
  
  console.log("======");
  $(row).each(function() {
    /*if(rowNb == 1) $(this).css("transform-origin", "13.5em 9em 0em"); // 2-1-2
    if(rowNb == 2) $(this).css("transform-origin", "13.5em 13.5em 0em"); // 2-2-2
    if(rowNb == 3) $(this).css("transform-origin", "13.5em 18em 0em"); // 2-3-2*/

    var initCoord = getCoord("row", this.id, true);
    updateCoord("row", this.id, direction);
    var newCoord = getCoord("row", this.id);

    var coordDelta = (newCoord[1] - initCoord[1]) * -1;

    var transform = getCurrentTransform(this);
    var newRotateZ = transform[2];
    var newRotateX = transform[0];
    var newRotateY = transform[1];

    //newRotateY = 90 * direction * coordDelta;
    newRotateY += 90 * direction;
    
    setRotate(this, newRotateZ, newRotateX, newRotateY);
  });
}

function rotateCol(columnNb, direction) {
  var column = findCube("y", columnNb);

  $(column).each(function() {
    /*if(columnNb == 1) $(this).css("transform-origin", "9em 13.5em 0em"); // 2-2-1
    if(columnNb == 2) $(this).css("transform-origin", "13.5em 13.5em 0em"); // 2-2-2
    if(columnNb == 3) $(this).css("transform-origin", "18em 13.5em 0em"); // 2-2-3*/

    var initCoord = getCoord("column", this.id, true);
    updateCoord("column", this.id, direction);
    var newCoord = getCoord("column", this.id);

    var coordDelta = (newCoord[1] - initCoord[1]) * -1;

    var transform = getCurrentTransform(this);
    var newRotateZ = transform[2];
    var newRotateX = transform[0];
    var newRotateY = transform[1];

    //newRotateX = 90 * direction * coordDelta;
    newRotateX += 90 * direction * -1; // Inverted Y-axis controls

    setRotate(this, newRotateZ, newRotateX, newRotateY);
  })
}

function setRotate(element, z, x, y) {
  if(Math.abs(z) % 360 == 0) z = 0;
  if(Math.abs(x) % 360 == 0) x = 0;
  if(Math.abs(y) % 360 == 0) y = 0;

  var currentPosition = getPosition(element)[0]+"em, "+getPosition(element)[1]+"em, "+getPosition(element)[2]+"em";
  var newTransform = "rotateX("+x+"deg) rotateY("+y+"deg) rotateZ("+z+"deg) translate3d("+currentPosition+")";
  $(element).css("transform", newTransform);

  var rotationName = $actionArray[$actionIndex-1] ? $actionArray[$actionIndex-1].type+"Move" : "";
  $(element).removeClass("depthMove rowMove columnMove").addClass(rotationName);

  setTimeout(function() {
    //$(element).removeClass(element.classList[1]).addClass("cube"+$(element).data("z")+"-"+$(element).data("x")+"-"+$(element).data("y"));
    //$(element).css("transform","");
  }, 200);
}

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