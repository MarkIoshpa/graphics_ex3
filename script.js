// Graphics Homework 3

var camera = 300;
var projection = "perspective";
var delta = 45;
var scale = 1;
const WIDTH = 1000, HEIGHT = 700;

// On page load
$(document).ready(function() {
  var data = null;
  var source = null;
  var canvas = $("canvas");
  var context = canvas[0].getContext('2d');
  var axis = $( 'select[name=axis]' ).val();
  var rotation = $( 'input[name=rotation]' ).val();
  var hidden = $( 'input[name=hidden]' ).is(":checked") ? true : false;
  scale = $( 'input[name=scale]' ).val();
  projection = $( 'select[name=projection]' ).val();
  camera = $( 'input[name=camera]' ).val();
  delta = $( 'input[name=delta]' ).val();

  $('input[name=scale]').change(function(){
      scale = $( 'input[name=scale]' ).val();
      redraw(context, data);
  });

  $('select[name=axis]').change(function(){
    axis = $( 'select[name=axis]' ).val();
  });

  $('input[name=rotation]').change(function(){
    rotation = $( 'input[name=rotation]' ).val();
  });

  $('input[name=camera]').change(function(){
    camera = $( 'input[name=camera]' ).val();
    redraw(context, data);
  });

  $('input[name=delta]').change(function(){
    delta = $( 'input[name=delta]' ).val();
    redraw(context, data);
  });

  $('select[name=projection]').change(function(){
    projection = $( 'select[name=projection]' ).val();
    redraw(context, data);
  });

  $('input[name=hidden]').click(function(){
    if($(this).is(":checked")){
      hidden = true;
    }
    else if($(this).is(":not(:checked)")){
      hidden = false;
    }
  });

  // Upload graphics data file
  $('input[type=file]').on('change', event => {
    reader = new FileReader();
    reader.onload = event => {
      context.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas on new file load
      try {
        data = JSON.parse(event.target.result);
        source = JSON.parse(event.target.result);
        drawObject(context, data);
      } catch (error) {
        data = null;
        alert("Failed to read the graphics data file!\n\n" + error);
      }
    }
    reader.readAsText(event.target.files[0]);
  });

  // Reset canvas to original file
  $( "#reset-button" ).click(function() {
    data = JSON.parse(JSON.stringify(source));
    $( 'input[name=scale]' ).val(1);
    scale = 1;
    redraw(context, data);
  });

  // Rotation
  $( "#rotate-button" ).click(function() {
    rotateObject(context, data.cube, rotation, axis);
    rotateObject(context, data.pyramid, rotation, axis);
    redraw(context, data);
  });
})

// Rotates 3D object a number of degrees specified by rotation, around the specified axis
function rotateObject(context, object, rotation, axis) {
  let radian = rotation * Math.PI/180;

  switch(axis) {
    case "X":
      transformObject(object, [[1, 0, 0],[0, Math.cos(radian), Math.sin(radian)], [0, -Math.sin(radian), Math.cos(radian)]]);
      break;

    case "Y":
      transformObject(object, [[Math.cos(radian), 0, -Math.sin(radian)],[0, 1, 0], [Math.sin(radian), 0, Math.cos(radian)]]);
      break;

    case "Z":
      transformObject(object, [[Math.cos(radian), Math.sin(radian), 0],[-Math.sin(radian), Math.cos(radian), 0], [0, 0, 1]]);
      break;

    default:
      break;
  }
}

// Applies transformation to all points in object vertices
function transformObject(object, matrix) {
  for(let i = 0; i < object.vertices.length; i++)
    transform(object.vertices[i], matrix);
}

// Draw cube and pyramid from file data
function drawObject(context, data) {
  let errorArray = [];

  if(typeof(data.pyramid) === "undefined") {
    alert("File doesn't contain pyramid!");
    return;
  }

  if(typeof(data.cube) === "undefined") {
    alert("File doesn't contain cube!");
    return;
  }

  if(validate(data.pyramid, "Pyramid", errorArray) && validate(data.cube, "Cube", errorArray)) {
    redraw(context, data);
  }
  else {
    alert("File contains errors!\n\n" + errorArray + '.');
  }
}

// Draws 3d object according to specified vertices and polygons
// Optional parameter transform can be used to perform additional transformations
function drawGeometry(context, object) {
  for (let i = 0; i < object.polygons.length; i++) {
    let p1 = object.vertices[object.polygons[i][0]];
    let p2 = object.vertices[object.polygons[i][1]];
    let p3 = object.vertices[object.polygons[i][2]];
    let newP1 = {x: p1[0] * scale, y: p1[1] * scale, z: p1[2] * scale};
    let newP2 = {x: p2[0] * scale, y: p2[1] * scale, z: p2[2] * scale};
    let newP3 = {x: p3[0] * scale, y: p3[1] * scale, z: p3[2] * scale};
    
    if(object.polygons[i].length === 4) {
      let p4 = object.vertices[object.polygons[i][3]];
      let newP4 = {x: p4[0] * scale, y: p4[1] * scale, z: p4[2] * scale};
      drawPolygon3d(context, newP1, newP2, newP3, newP4);
    }
    else {
      drawPolygon3d(context, newP1, newP2, newP3);
    }
  }
}

// Draw polygon with 3 or 4 points
function drawPolygon(context, x1, y1, x2, y2, x3, y3, x4=null, y4=null) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  if(x4 !== null && y4 !== null)
    context.lineTo(x4, y4);
  context.closePath();
  context.stroke();
  context.fillStyle = "white";
  context.fill();
}

// Draw polygon while applying 3d projection
function drawPolygon3d(context, p1, p2, p3, p4=null) {
  var x1, y1, x2, y2, x3, y3, x4, y4;

  switch(projection) {
    case "Orthographic":
      x1 = p1.x;
      y1 = p1.y;
      x2 = p2.x;
      y2 = p2.y;
      x3 = p3.x;
      y3 = p3.y;
      if(p4 !== null) {
        x4 = p4.x;
        y4 = p4.y;
      }
      break;

    case "Oblique":
      let radian = delta * Math.PI/180;
      x1 = Math.round(p1.x + p1.z / 2 * Math.cos(radian));
      y1 = Math.round(p1.y + p1.z / 2 * Math.sin(radian));
      x2 = Math.round(p2.x + p2.z / 2 * Math.cos(radian));
      y2 = Math.round(p2.y + p2.z / 2 * Math.sin(radian));
      x3 = Math.round(p3.x + p3.z / 2 * Math.cos(radian));
      y3 = Math.round(p3.y + p3.z / 2 * Math.sin(radian));
      if(p4 !== null) {
        x4 = Math.round(p4.x + p4.z / 2 * Math.cos(radian));
        y4 = Math.round(p4.y + p4.z / 2 * Math.sin(radian));
      }
      break;

    default:  // Default projection is perspective
      x1 = Math.round(p1.x / ( 1 +  p1.z / camera ));
      y1 = Math.round(p1.y / ( 1 +  p1.z / camera ));
      x2 = Math.round(p2.x / ( 1 +  p2.z / camera ));
      y2 = Math.round(p2.y / ( 1 +  p2.z / camera ));
      x3 = Math.round(p3.x / ( 1 +  p3.z / camera ));
      y3 = Math.round(p3.y / ( 1 +  p3.z / camera ));
      if(p4 !== null) {
        x4 = Math.round(p4.x / ( 1 +  p4.z / camera ));
        y4 = Math.round(p4.y / ( 1 +  p4.z / camera ));
      }
      break;
  }

  if(p4 !== null)
    drawPolygon(context, x1 + WIDTH/2, y1 + HEIGHT/2, x2 + WIDTH/2, y2 + HEIGHT/2, x3 + WIDTH/2, y3 + HEIGHT/2, x4 + WIDTH/2, y4 + HEIGHT/2); 
  else
    drawPolygon(context, x1 + WIDTH/2, y1 + HEIGHT/2, x2 + WIDTH/2, y2 + HEIGHT/2, x3 + WIDTH/2, y3 + HEIGHT/2);
}

// Redraws the cube and pyramid
function redraw(context, data) {
  if(data === null)
    return;

  context.clearRect(0, 0, WIDTH, HEIGHT);
  sortByZ(data.cube);
  sortByZ(data.pyramid);
  drawGeometry(context, data.cube);
  drawGeometry(context, data.pyramid);
}

// Sort polygons by their Z
function sortByZ(object) {
  object.polygons.sort((a, b) => {
    let averageAz, averageBz
    if(a.length === 3) {
      averageAz = (object.vertices[a[0]][2] + object.vertices[a[1]][2] + object.vertices[a[2]][2])/3
    }
    else if(a.length === 4) {
      averageAz = (object.vertices[a[0]][2] + object.vertices[a[1]][2] + object.vertices[a[2]][2] + object.vertices[a[3]][2])/4
    }
    if(b.length === 3) {
      averageBz = (object.vertices[b[0]][2] + object.vertices[b[1]][2] + object.vertices[b[2]][2])/3
    }
    else if(b.length === 4) {
      averageBz = (object.vertices[b[0]][2] + object.vertices[b[1]][2] + object.vertices[b[2]][2] + object.vertices[b[3]][2])/4
    }

    return averageBz - averageAz

  })
}

// Performs the transform operation on a point
function transform(point, matrix) {
  let result = multiplyMatrixByVector(matrix, [point[0], point[1], point[2]]);
  point[0] = result[0];
  point[1] = result[1];
  point[2] = result[2];
}

// multiplyMatrixByVector returns an array representing the vector that results from multiplying matrix m by vector v
function multiplyMatrixByVector(m, v) {
  result = new Array(m.length);
  for (let i = 0; i < m.length; i++) {
      result[i] = 0;
      for (let j = 0; j < v.length; j++) {
          result[i] += m[i][j] * v[j];
      }
  }
  return result;
}

// Validates that object contains all required fields, writes missing field errors into errorArray
function validate(object, objectName, errorArray) {
  let errorFlag = true; // true if no errors
  
  if(typeof(object.vertices) === "undefined") {
    errorArray.push("\n" + objectName + " missing vertices field");
    errorFlag = false;
  }

  if(typeof(object.polygons) === "undefined") {
    errorArray.push("\n" + objectName + " missing polygons field");
    errorFlag = false;
  }

  if(!Array.isArray(object.vertices)) {
    errorArray.push("\n" + objectName + " vertices isn't an array");
    errorFlag = false;
  }
  else {
    for(let i = 0; i < object.vertices.length; i++) {
      if((!Array.isArray(object.vertices[i])) || (object.vertices[i].length !== 3)) {
        errorArray.push("\n" + objectName + " vertices contains invalid point coordinate on " + i + " position");
        errorFlag = false;
      }
    }
  }

  if(!Array.isArray(object.polygons)) {
    errorArray.push("\n" + objectName + " polygons isn't an array");
    errorFlag = false;
  }
  else {
    for(let i = 0; i < object.polygons.length; i++) {
      if((!Array.isArray(object.polygons[i])) || (object.polygons[i].length < 3)) {
        errorArray.push("\n" + objectName + " polygons contains polygon on " + i + " position that doesn't have at least 3 vertex indices");
        errorFlag = false;
      }
    }  
  }

  return errorFlag;
}