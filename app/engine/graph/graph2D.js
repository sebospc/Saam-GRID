const d3 = require("d3");
const colors = require("nice-color-palettes")


const width = screen.width;
var height = screen.height;
var radius = (width * 2) / 100;
const linkWidth = radius / 10;
const highlight_color = "#111"; //this color will be used when user clicks on one node.
const default_link_color = "#888";
const nominal_stroke = 1.5; //stroke width
const default_border_color = "#00AFB7"
const highlight_trans = 0.1;
const firstSelectNodeColor = "#FF5733";
const secondSelectNodeColor = "#333FFF";
const padding = 60;


var focus_node = null, highlight_node = null; //this variables will be used to occult the nodes.



var svg = d3.select('svg')
  .attr("width", width)
  .attr("height", height);
var zoom_handler;
var node;
var circle;
var text;
var link;
var linkedByIndex = {};
var g = svg.append("g").attr("class", "everything");
var drag_handler;
var keysArr = [];
var zones = [];

var firstNodeClick = null;
var secondNodeClick = null;
height -= padding;

class type {
  constructor(y1, y2) {
    this.y1 = y1;
    this.y2 = y2;
    this.x = width / 2;
    this.xLeft = this.x;
    this.xRight = this.x;
    this.y = (y2 - y1) / 2 + y1;
    this.yUp = this.y;
    this.yDown = this.y;
    this.left = true;
    this.up = true;
  }

  getX(rad) {
    var value;
    if (this.left) {
      value = this.xLeft -= rad * 2;
      this.left = false;
      if (!(value > rad && value < width - rad))
        value = this.xLeft = this.x;
    } else {
      value = this.xRight;
      this.xRight += rad * 2;
      this.left = true;
      if (!(value > rad && value < width - rad))
        value = this.xRight = this.x;
    }


    return value;
  }

  getY(rad) {
    var value;
    if (this.up) {
      value = this.yUp -= rad * 2;
      this.up = false;
      if (!(value > this.y1 + rad && value < this.y2 - rad))
        value = this.yUp = this.y;
    } else {
      value = this.yDown += rad * 2;
      this.up = true;
      if (!(value > this.y1 + rad && value < this.y2 - rad))
        value = this.yDown = this.y;


    }

    return this.y = (this.y2 - this.y1) / 2 + this.y1;
  }

  isContainedInx(x,rad){
    return x > rad && x < width-rad;
  }
  isContainedIny(y,rad){
    return y > this.y1+rad && y < this.y2-rad;
  }

}

init();

async function init() {
  //nodes = await requestCall('GET', '/getNodes', { "fileName": "SAPV_node", "infoName": "infoSAPV", "variablesFileName": "TraceabilityTree_SAPV" }, {});
  nodes = await requestCall('GET', '/getNodes', {"fileName":"ejemplocooler_node","infoName":"infoCooler","variablesFileName":"Workbook1"}, {});
  //edges = await requestCall('GET', '/getEdges', { "fileName": "SAPV_edge" }, {})
  edges = await requestCall('GET', '/getEdges', {"fileName":"ejemplocooler_edge"}, {})
  var types = [0, 1, 2, 3];

  createGraph(assignPosition(nodes, types), edges);
}


function assignPosition(nodes, types) {
  const heightPerZone = height / types.length;
  var i = 0;
  
  for (const num of types) {
    var y1 = (heightPerZone) * i + padding;
    g.append("rect")//relaciones
      .attr("y", y1)
      .attr("x", 0)
      .attr("height", heightPerZone)
      .attr("width", width)
      .style('fill', colors[i][i % 4]);
    zones.push(new type(y1, y1 + heightPerZone))
    i++;
  }


  //nodes.forEach((item) =>{
  //  var rad;
  //  rad = ("" + item.Label).length * 4 + 10;
  //  if(rad > radius)
  //    radius = rad;
  //})

  nodes.forEach((item) => {
    item.radius = (radius > ("" + item.Label).length * 4 + 10) ? radius : ("" + item.Label).length * 4 + 10;
  });

  nodes.forEach((item) => {
    item.fx = zones[item.type].getX(item.radius)
    item.fy = zones[item.type].getY(item.radius)

    //keysArr is used to define the columns in the modal.js
    if (item.type == 1)
      keysArr.push(item.Label)
  })
  //(radius > ("" + d.Label).length * 4 + 10) ? radius : ("" + d.Label).length * 4 + 10;
  return nodes;
}


/** 
 *  This function collects best features from d3.js examples
 *  for more imformation you can check the oficial page https://d3js.org/
*/

function createGraph(nodes_data, links_data) {

  links_data.forEach((d) => {
    linkedByIndex[d.source + "," + d.target] = true;
  });


  //This function is for effect selectable nodes, when mouse deselect node, the opacity come to normall value
  //for more inforation you can check this page http://bl.ocks.org/eyaler/10586116
  window.addEventListener("mouseup", function (e) {
    if (focus_node !== null) {
      focus_node = null;
      if (highlight_trans < 1) {
        circle.style("opacity", 1);
        text.style("opacity", 1);
        link.style("opacity", 1);
      }
    }
  }, true);

  var simulation = d3.forceSimulation().nodes(nodes_data);




  simulation.on("tick", tickActions);

  var link_force = d3.forceLink(links_data)
    .id(function (d) { return d.Id; })
    .strength(0);
  var charge_force = d3.forceManyBody().strength(-1);
  var center_force = d3.forceCenter(width / 2, height / 2);

  drag_handler = d3.drag()
    .on("start", drag_start)
    .on("drag", drag_drag)
    .on("end", drag_end);


  simulation.force("charge_force", charge_force)
    .force("center_force", center_force)
    .force("links", link_force);

  link = g.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links_data)
    .enter().append("line")
    .attr("stroke-width", linkWidth)
    .style("stroke", default_link_color);
  node = g.selectAll(".node")
    .data(nodes_data)
    .enter()
    .append("g")
    .classed('noselect', true)
    .attr('class', 'nodes')


  //Creeation of nodes with dinamic radius.
  circle = node.append('circle')
    .classed("svgCircleType0", true)
    .attr("r", function (d) {
      return d.radius;
    })
    .style("stroke-width", nominal_stroke)
    .style("stroke", default_border_color);


  //Assign text to each node.
  text = node.append("text")
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.Label;
    }).style('fill', 'rgb(50,50,50)');



  //This function is for effect selectable nodes, when mouse deselect node, the opacity come to normall value
  //for more inforation you can check this page http://bl.ocks.org/eyaler/10586116
  assignEffectOfClick();

  //drag handler
  //d is the node 
  function drag_start(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    if(zones[d.type].isContainedInx(d3.event.x,d.radius))
    d.fx = d3.event.x;
    if(zones[d.type].isContainedIny(d3.event.y,d.radius))
    d.fy = d3.event.y;
  }

  function drag_drag(d) {
    if(zones[d.type].isContainedInx(d3.event.x,d.radius))
    d.fx = d3.event.x;
    if(zones[d.type].isContainedIny(d3.event.y,d.radius))
    d.fy = d3.event.y;
  }


  function drag_end(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
      if(zones[d.type].isContainedInx(d3.event.x,d.radius))
      d.fx = d3.event.x;
      if(zones[d.type].isContainedIny(d3.event.y,d.radius))
      d.fy = d3.event.y;
  }

  function tickActions() {
    node.attr('transform', (d) => `translate(${d.x},${d.y})`)

    link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });


  }


  zoom_handler = d3.zoom()
    .scaleExtent([1, 3])
    .translateExtent([[0, padding], [width , height ]])
    .extent([[0, padding], [width, height]])
    .on("zoom", zoom_actions);

  zoom_handler(svg);



  function zoom_actions() {
    
    g.attr("transform", d3.event.transform)
  }



}


//asign position per node


//This function is for effect selectable nodes, when mouse deselect node, the opacity come to normall value
//for more inforation you can check this page http://bl.ocks.org/eyaler/10586116
function assignEffectOfClick() {
  node.on("mouseover", function (d) {
    set_highlight(d);

  })
    .on("mousedown", function (d) {
      focus_node = d;
      set_focus(d);
      if (highlight_node === null) set_highlight(d)

    }).on("mouseout", function (d) {
      exit_highlight();
    });
  node.on("click", function (d) { d3.event.stopPropagation(); openModal(d.Label) });
  drag_handler(node);
}

function exit_highlight() {
  highlight_node = null;
  if (focus_node === null) {
    g.style("cursor", "move");
    if (highlight_color != default_border_color) {
      circle.style("stroke", function (o) { return isSelected(o, default_border_color) });
      //return (o.Id == firstNodeClick.Id)? firstSelectNodeColor: default_border_color });
      //
      text.style("font-weight", "normal");
      link.style("stroke", function (o) { return isSelected(o, default_link_color) });
    }

  }
}

function set_focus(d) {

  circle.style("opacity", function (o) {
    return isConnected(d, o) ? 1 : highlight_trans;
  });

  text.style("opacity", function (o) {
    return isConnected(d, o) ? 1 : highlight_trans;
  });

  link.style("opacity", function (o) {
    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
  });

}




function set_highlight(d) {
  svg.style("cursor", "pointer");
  if (focus_node !== null) d = focus_node;
  highlight_node = d;
  if (highlight_color != default_border_color) {
    circle.style("stroke", function (o) {
      return isConnected(d, o) ? isSelected(o, highlight_color) : isSelected(o, default_border_color);
    });
    text.style("font-weight", function (o) {
      return isConnected(d, o) ? "bold" : "normal";
    });
    link.style("stroke", function (o) {
      return o.source.Id == d.Id || o.target.Id == d.Id ? highlight_color : (default_link_color);

    });
  }
}

function isSelected(a, color) {
  if (firstNodeClick != null) {
    if (a.Id == firstNodeClick.Id) {
      return firstSelectNodeColor;
    }
  }
  if (secondNodeClick != null) {
    if (a.Id == secondNodeClick.Id) {
      return secondSelectNodeColor;
    }
  }
  return color;
}

function isConnected(a, b) {
  return linkedByIndex[(a.Id) + "," + (b.Id)] || linkedByIndex[(b.Id) + "," + (a.Id)] || a.Id == b.Id;
}



function highlight_from_routes(acum) {

  circle.style("stroke", function (o) {

    return acum[o.Id] ? highlight_color : default_border_color;
  });
  text.style("font-weight", function (o) {
    return acum[o.Id] ? "bold" : "normal";
  });
  link.style("stroke", function (o) {
    return acum[o.source.Id + "," + o.target.Id] ? highlight_color : (default_link_color);

  });
}


//this function is consumed by the button resize
function resize() {
  svg.transition().duration(200).ease(d3.easeLinear).call(zoom_handler.transform, d3.zoomIdentity.scale(1));
}

//this function is consumed by the toggle button
let disabEnabEffect = function () {
  const toast = swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 1500
  });

  var checkBox = document.getElementById("checkEffect");
  if (checkBox.checked != true) {
    node.on("mouseover", function (d) { })
      .on("mousedown", function (d) { }).on("mouseout", function (d) { });
    toast({
      type: 'success',
      title: 'Graph effects disabled'
    })
  } else {
    toast({
      type: 'success',
      title: 'Graph effects enabled'
    })
    assignEffectOfClick();
  }
}


