var ID_PREFIX = "#line";
var BUS_PREFIX = "#bus";
var TIME = 15000;
var SPEED = 0.2;
var random = 0;
d3.xml('map_5.svg', "image/svg+xml", ready);

function ready(error, xml) {
  //Adding our svg file to HTML document
  d3.select('body').node().appendChild(xml.documentElement);
  d3.select("svg").attr("id", "svg");
  createBus("3a", 0);
  createBus("3a", 0.33);
  createBus("3a", 0.66);

  createBus("16a", 0.25);
  createBus("16a", 0.75);
}

function createBus(line, time) {
  time = time * TIME || 0;
  setTimeout(function() {
    var svg = d3.select("svg");
    console.log(svg);
    var path = svg.select(ID_PREFIX + line);
    var newBus = clone(line);
    console.log("NewBus", newBus);
    var startPoint = pathStartPoint(path);
    newBus.attr("transform", "translate(" + startPoint + ")");

    transition(path, newBus, line);
  }, time);
}

//Get path start point for placing marker
function pathStartPoint(path) {
  var d = path.attr("d");
  var dsplitted = d.split(" ");
  console.log("d: " + d);
  return dsplitted[1].split(",");
}

function transition(path, marker, line) {
  var l = path[0][0].getTotalLength();
  console.log("My strange", l);
  marker.transition()
    .duration(l / SPEED)
    .attrTween("transform", translateAlong(path.node()))
    .ease("linear")
    .each("end", startTransition(path, marker, line));// infinite loop
}

function startTransition(path, marker, line) {
  line = toggleLine(line);
  var svg = d3.select("svg");
  path = svg.select(ID_PREFIX + line);
  var bus = clone(line);
  return function() {
    marker.remove();
    transition(path, bus, line);
  }
}

function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    console.log("i", i);
    return function(t) {
      //console.log(t);
      var p = path.getPointAtLength(t*l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

function toggleLine(line) {
  if (line.substr(0, 1) === "3")
    return (line === "3a")? "3b" : "3a";
  else
    return (line === "16a")? "16b" : "16a";
}

function clone(id) {
  var cloned = document.getElementById("bus" + id).cloneNode(true);
  cloned.id += random++;
  document.getElementById("layer1").appendChild(cloned);
  return d3.select("svg").select("#" + cloned.id);
}
