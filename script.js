var ID_PREFIX = "#line";
var BUS_PREFIX = "#bus";
d3.xml('map_5.svg', "image/svg+xml", ready);

function ready(error, xml) {
  //Adding our svg file to HTML document
  d3.select('body').node().appendChild(xml.documentElement);
  createBus("3a");
  //should have a timeout
  createBus("16a");
  /*setTimeout(function() {
  createBus("16a");
  }, 200);
  */
}

function createBus(line) {
  var svg = d3.select("svg");
  console.log(svg);
  var path = svg.select(ID_PREFIX + line);
  var bus = svg.select(BUS_PREFIX + line);
  var startPoint = pathStartPoint(path);
  bus.attr("transform", "translate(" + startPoint + ")");

  transition(path, bus, line);
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
    .duration(6000)
    .attrTween("transform", translateAlong(path.node()))
    .ease("linear")
    .each("end", startTransition(path, marker, line));// infinite loop
}

function startTransition(path, marker, line) {
  line = toggleLine(line);
  var svg = d3.select("svg");
  path = svg.select(ID_PREFIX + line);
  var bus = svg.select(BUS_PREFIX + line);
  //bus.attr("transform", "translate(" + startPoint + ")");
  return function() {
    bus.attr("opacity", 100);
    marker.attr("opacity", 0);
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
