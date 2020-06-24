// Graphics Homework 3

var camera = 300;
var projection = "perspective";
var delta = 45;
const WIDTH = 1000, HEIGHT = 1000;

// On page load
$(document).ready(function() {
  var data = null;
  var canvas = $("canvas");
  var context = canvas[0].getContext('2d');
  var scale = $( 'input[name=scale]' ).val();
  var axis = $( 'select[name=axis]' ).val();
  var rotation = $( 'input[name=rotation]' ).val();
  var hidden = $( 'input[name=hidden]' ).is(":checked") ? true : false;
  projection = $( 'select[name=projection]' ).val();
  camera = $( 'input[name=camera]' ).val();
  delta = $( 'input[name=delta]' ).val();

  $('input[name=scale]').change(function(){
      scale = $( 'input[name=scale]' ).val();
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawGeometry(context, data.cube, {x: scale, y: scale, z: scale});
      drawGeometry(context, data.pyramid, {x: scale, y: scale, z: scale});
  });

  $('select[name=axis]').change(function(){
    axis = $( 'select[name=axis]' ).val();
  });

  $('input[name=rotation]').change(function(){
    rotation = $( 'input[name=rotation]' ).val();
  });

  $('input[name=camera]').change(function(){
    camera = $( 'input[name=camera]' ).val();
  });

  $('input[name=delta]').change(function(){
    delta = $( 'input[name=delta]' ).val();
  });

  $('select[name=projection]').change(function(){
    projection = $( 'select[name=projection]' ).val();
    context.clearRect(0, 0, WIDTH, HEIGHT);
    drawGeometry(context, data.cube);
    drawGeometry(context, data.pyramid);
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
  var x1, y1, x2, y2

  switch(projection) {
    case "Orthographic":
      x1 = p1.x;
      y1 = p1.y;
      x2 = p2.x;
      y2 = p2.y;
      break;

    case "Oblique":
      x1 = Math.round(p1.x + p1.z / 2 * Math.cos(delta))
      y1 = Math.round(p1.y + p1.z / 2 * Math.sin(delta))
      x2 = Math.round(p2.x + p2.z / 2 * Math.cos(delta))
      y2 = Math.round(p2.y + p2.z / 2 * Math.sin(delta))
      break;

    default:  // Default projection is perspective
      x1 = Math.round(p1.x / ( 1 +  p1.z / camera ))
      y1 = Math.round(p1.y / ( 1 +  p1.z / camera ))
      x2 = Math.round(p2.x / ( 1 +  p2.z / camera ))
      y2 = Math.round(p2.y / ( 1 +  p2.z / camera ))
      break;
  }

  drawLine(context, x1 + WIDTH/2, y1 + HEIGHT/2, x2 + WIDTH/2, y2 + HEIGHT/2);
}