var currentX, prevX;
var dirX, prevDirX;
var currentY, prevY;
var dirY, prevDirY;

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