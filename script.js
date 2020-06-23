// Graphics Homework 3

var camera = 100;
const WIDTH = 800, HEIGHT = 800;

// On page load
$(document).ready(function() {
  var data = null;
  var canvas = $("canvas");
  var context = canvas[0].getContext('2d');

  // Upload graphics data file
  $('input[type=file]').on('change', event => {
    reader = new FileReader();
    reader.onload = event => {
      context.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas on new file load
      try {
        data = JSON.parse(event.target.result);
        drawObject(context, data);
      } catch (error) {
        data = null;
        alert("Failed to read the graphics data file!\n\n" + error);
      }
    }
    reader.readAsText(event.target.files[0]);
  });
})

// Draw cube and pyramid
function drawObject(context, data) {
  drawGeometry(context, data.cube);
  drawGeometry(context, data.pyramid);
}

// Draws 3d object according to specified vertices and polygons
// Optional parameter transform can be used to perform additional transformations
function drawGeometry(context, object, transform = {x:WIDTH/4, y:HEIGHT/4, z:0}) {
  for (var i = 0; i < object.polygons.length; i++) {
    var p1 = object.vertices[object.polygons[i][0]]
    var p2 = object.vertices[object.polygons[i][1]]
    var p3 = object.vertices[object.polygons[i][2]]
    var newP1 = {x: p1[0] + transform.x, y: p1[1] + transform.y, z: p1[2] + transform.z}
    var newP2 = {x: p2[0] + transform.x, y: p2[1] + transform.y, z: p2[2] + transform.z}
    var newP3 = {x: p3[0] + transform.x, y: p3[1] + transform.y, z: p3[2] + transform.z}
    drawLine3d(context, newP1, newP2)
    drawLine3d(context, newP2, newP3)
    drawLine3d(context, newP3, newP1)
  }
}

// Draw 2d line on canvas
function drawLine(context, startX, startY, endX, endY) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
  context.closePath();
}

// Draw 3d line on canvas
function drawLine3d(context, p1, p2) {
  var x1 = Math.round(p1.x * (camera / p1.z))
  var y1 = Math.round(p1.y * (camera / p1.z))
  var x2 = Math.round(p2.x * (camera / p2.z))
  var y2 = Math.round(p2.y * (camera / p2.z))
  drawLine(context, x1, y1, x2, y2);
}