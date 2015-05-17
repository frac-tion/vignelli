var ID_PREFIX = "#line";
var BUS_PREFIX = "#bus";
var random = 0;
d3.xml('map.svg', "image/svg+xml", ready);

function ready(error, xml) {
  //Adding our svg file to HTML document
  d3.select('body').node().appendChild(xml.documentElement);
  d3.select("svg").attr("id", "svg");
  createBus("3a", 0);
  //should have a timeout
  createBus("16a", 100);
  createBus("16a", 10000);
  createBus("16b", 500);
  createBus("3b", 600);
}

function createBus(line, time) {
  time = time || 0;
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
  marker.transition()
    .duration(10000)
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
