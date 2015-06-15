var currentX, prevX;
var dirX, prevDirX;
var currentY, prevY;
var dirY, prevDirY;

var defaultAngle = "rotateX(-10deg) rotateY(25deg) rotateZ(10deg) scale3d(1,1,1)";

function startCameraRotation() {
  if(!$("body").hasClass("selecting") && !$("body").hasClass("paused"))
    $("body").addClass("moving");
}

function stopCameraRotation() {
  if($("body").hasClass("moving")) {
    $("body").removeClass("moving");
    
    // Reinitialize the cursor coordinates
    prevX = null;
    prevY = null;
  }
}

function setCameraRotation(e) {
  if($("body").hasClass("moving")) {
    // Get the current camera angle
    var transformValues = getCurrentTransform($("#scene")[0]);
    var rotateX = transformValues.rotateX;
    var rotateY = transformValues.rotateY;

    // For mobile devices, check the touch events instead to detect the camera movements
    if(mobileCheck()) e = e.originalEvent.touches[0];

    // X-axis : calculate delta value since the last up/down movement
    currentX = e.pageY;
    if(!prevX) prevX = currentX;
    var deltaX = Math.abs(prevX - currentX);
    
    // Determine the movement's direction
    if(currentX > prevX) dirX = 1;
    else if(currentX < prevX) dirX = -1;

    // Y-axis : calculate delta value since the last left/right movement
    currentY = e.pageX;
    if(!prevY) prevY = currentY;
    var deltaY = Math.abs(prevY - currentY);
    
    // Determine the movement's direction
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
    
    // Save the new positions for next camera movements
    prevX = currentX;
    prevY = currentY;

    // Update it with the mousewheel's delta value
    var newRotateX = rotateX + deltaX * dirX * -1; // Inverted up/down controls
    var newRotateY = rotateY + deltaY * dirY;

    // Update the inline style string
    var newTransform = "rotateX("+newRotateX+"deg) rotateY("+newRotateY+"deg) rotateZ("+transformValues.rotateZ+"deg) scale3d("+transformValues.scale+")";
    $("#scene").css("transform",newTransform);
  }
}

function setCameraZoom(e) {
  e.preventDefault();
  if($("body").hasClass("paused")) return;

  // Get the current camera zoom
  var transformValues = getCurrentTransform($("#scene")[0]);
  var scale = parseFloat(transformValues.scale);

  // Update it with the mousewheel's delta value
  var delta = e.originalEvent.wheelDelta / 1000 * -1; // Inverted zoom in/out controls
  var newScale = scale + delta;

  // Setting min/max zoom values
  if(newScale < .5) newScale = .5;
  if(newScale > 1.5) newScale = 1.5;

  // Update the inline style string
  var newScaleString = newScale+","+newScale+","+newScale;
  var newTransform = "rotateX("+transformValues.rotateX+"deg) rotateY("+transformValues.rotateY+"deg) rotateZ("+transformValues.rotateZ+"deg) scale3d("+newScaleString+")";
  $("#scene").css("transform", newTransform);
}

function getCurrentTransform(element) {
  // Fetching the inline style string
  var transform = element.style.transform;

  // Fetching the rotateX value in the string
  var rotateX = transform.slice(transform.indexOf("rotateX("), transform.length);
  rotateX = rotateX.replace("rotateX(", "");
  rotateX = rotateX.slice(0, rotateX.indexOf(")"));
  rotateX = parseFloat(rotateX);
  if(!rotateX || isNaN(rotateX)) rotateX = 0;

  // Fetching the rotateY value in the string
  var rotateY = transform.slice(transform.indexOf("rotateY("), transform.length);
  rotateY = rotateY.replace("rotateY(", "");
  rotateY = rotateY.slice(0, rotateY.indexOf(")"));
  rotateY = parseFloat(rotateY);
  if(!rotateY || isNaN(rotateY)) rotateY = 0;

  // Fetching the rotateZ value in the string
  var rotateZ = transform.slice(transform.indexOf("rotateZ("), transform.length);
  rotateZ = rotateZ.replace("rotateZ(", "");
  rotateZ = rotateZ.slice(0, rotateZ.indexOf(")"));
  rotateZ = parseFloat(rotateZ);
  if(!rotateZ || isNaN(rotateZ)) rotateZ = 0;

  // Fetching the scale3d value in the string
  var scale = transform.slice(transform.indexOf("scale3d("), transform.length);
  scale = scale.replace("scale3d(", "");
  scale = scale.slice(0, scale.indexOf(")"));
  if(!scale) scale = "1, 1, 1";

  // Fetching the translate3d value in the string
  var translate = transform.slice(transform.indexOf("translate3d("), transform.length);
  translate = translate.replace("translate3d(", "");
  translate = translate.slice(0, translate.indexOf(")"));
  if(!translate) translate = "0, 0, 0";

  // Returning all values inside an object
  return {
    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
    scale: scale,
    translate: translate
  };
}