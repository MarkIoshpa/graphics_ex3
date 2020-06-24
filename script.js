// Graphics Homework 3

var camera = 300;
const WIDTH = 800, HEIGHT = 800;

// On page load
$(document).ready(function() {
  var data = null;
  var canvas = $("canvas");
  var context = canvas[0].getContext('2d');
  var shapeSelected = $( 'input[name=shapeRadioBtn]:checked' ).val();
  var scale = $( 'input[name=scale]' ).val();
  var axis = $( 'select[name=axis]' ).val();
  var rotation = $( 'input[name=rotation]' ).val();
  var projection = $( 'input[name=projection]' ).val();
  var hidden = $( 'input[name=hidden]' ).is(":checked") ? true : false;

  // Choose type of transformation
  $('input[name=shapeRadioBtn]').change(function(){
      shapeSelected = $( 'input[name=shapeRadioBtn]:checked' ).val();
  });

  $('input[name=scale]').change(function(){
      scale = $( 'input[name=scale]' ).val();
  });

  $('select[name=axis]').change(function(){
    axis = $( 'select[name=axis]' ).val();
  });

  $('input[name=rotation]').change(function(){
    rotation = $( 'input[name=rotation]' ).val();
  });

  $('input[name=projection]').change(function(){
    projection = $( 'input[name=projection]' ).val();
  });

  $('input[name=hidden]').click(function(){
    if($(this).is(":checked")){
      hidden = true
    }
    else if($(this).is(":not(:checked)")){
      hidden = false
    }
  });

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
function drawGeometry(context, object, scaling = {x:1, y:1, z:1}) {
  for (var i = 0; i < object.polygons.length; i++) {
    var p1 = object.vertices[object.polygons[i][0]]
    var p2 = object.vertices[object.polygons[i][1]]
    var p3 = object.vertices[object.polygons[i][2]]
    var newP1 = {x: p1[0] * scaling.x, y: p1[1] * scaling.y, z: p1[2] * scaling.z}
    var newP2 = {x: p2[0] * scaling.x, y: p2[1] * scaling.y, z: p2[2] * scaling.z}
    var newP3 = {x: p3[0] * scaling.x, y: p3[1] * scaling.y, z: p3[2] * scaling.z}
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
  var x1 = Math.round(p1.x / ( 1 +  p1.z / camera ))
  var y1 = Math.round(p1.y / ( 1 +  p1.z / camera ))
  var x2 = Math.round(p2.x / ( 1 +  p2.z / camera ))
  var y2 = Math.round(p2.y / ( 1 +  p2.z / camera ))

  drawLine(context, x1 + WIDTH/2, y1 + HEIGHT/2, x2 + WIDTH/2, y2 + HEIGHT/2);
}