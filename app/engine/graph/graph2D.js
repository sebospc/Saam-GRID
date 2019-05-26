


const width = screen.width;
var height = screen.height;
var radius = (width + height) / 70;
const linkWidth = radius / 10;
const highlight_color = "#111"; //this color will be used when user clicks on one node.
const default_link_color = "#888";
const nominal_stroke = 1.5; //stroke width
const default_border_color = "#00AFB7"
const highlight_trans = 0.1;
const firstSelectNodeColor = "#FF5733";
const secondSelectNodeColor = "#333FFF";
const padding = 60;
const horizontalPadding = 10;
const verticalPadding = 3;
const coeffMovement = 5;
const scaleText = radius / 2; //Defualt scale text

var focus_node = null, highlight_node = null; //this variables will be used to occult the nodes.



var svg;
var zoom_handler;
var node;
var circle;
var text;
var link;
var linkedByIndex = {};
var g;
var drag_handler;

var zones = {};

var firstNodeClick = null;
var secondNodeClick = null;
const visualHeight = height - padding

class type {
  constructor(x1, x2, y1, y2) {
    this.y1 = y1;
    this.y2 = y2;
    this.x1 = x1;
    this.x2 = x2;

    this.x = (x2 - x1) / 2
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
      value = this.x1 + (this.xLeft -= rad * 2);
      this.left = false;
      //if (!(value > rad && value < width - rad))
      if (!this.isContainedInx(value, rad))
        value = this.xLeft = (this.x + this.x1);
    } else {
      value = this.x1 + this.xRight;
      this.xRight += rad * 2;
      this.left = true;
      if (!this.isContainedInx(value, rad))
        value = this.xRight = (this.x + this.x1);
      //if (!(value > rad && value < width - rad))

    }


    return value;
  }

  getY(rad) {
    var value;
    if (this.up) {
      value = this.yUp -= rad * 2;
      this.up = false;
      //if (!(value > this.y1 + rad && value < this.y2 - rad))
      if (!this.isContainedIny(value, rad))
        value = this.yUp = this.y;
    } else {
      value = this.yDown += rad * 2;
      this.up = true;
      //if (!(value > this.y1 + rad && value < this.y2 - rad))
      if (!this.isContainedIny(value, rad))
        value = this.yDown = this.y;
    }
    this.y = (this.y2 - this.y1) / 2 + this.y1;
    return this.y;//= (this.y2 - this.y1) / 2 + this.y1;
  }

  isContainedInx(x, rad) {
    return x > (rad + this.x1) && x < (this.x2 - rad);
  }
  isContainedIny(y, rad) {
    return y > this.y1 + rad && y < this.y2 - rad;
  }

}

svg = d3.select('svg')
  .attr("width", width)
  .attr("height", height);

g = svg.append("g").attr("class", "everything")



async function init() {


  nodes = await requestCall('GET', '/getNodes', models["models"][actualModel]["nodes"], {});
  //nodes = await requestCall('GET', '/getNodes', {"fileName":"ejemplocooler_node","infoName":"infoCooler","variablesFileName":"Workbook1"}, {});
  edges = await requestCall('GET', '/getEdges', models["models"][actualModel]["edges"], {})
  //edges = await requestCall('GET', '/getEdges', {"fileName":"ejemplocooler_edge"}, {})
  var types = [0, 1, 2];
  var subTypes = [3, 4, 5];
  createGraph(assignPosition(nodes, types, subTypes), edges);
}




function assignPosition(nodes, types, subTypes) {
  const heightPerZone = visualHeight / 4; // total sections 
  var i = 1;

  types.forEach(function (num) {
    var y1 = (heightPerZone) * i + padding;
    g.append("rect")//relaciones
      .attr("y", y1)
      .attr("x", 0)
      .attr("height", heightPerZone)
      .attr("width", width)
      .style('fill', colors[i][i % 4]);
    var y2 = y1 + heightPerZone;
    zones[num] = (new type(0, width, y1, y2))
    i++;

  });

  y1 = padding;
  const widthPerZone = width / 3;
  var j = 0;
  subTypes.forEach(function (num) {
    var x1 = widthPerZone * j + horizontalPadding;
    var x2 = widthPerZone - horizontalPadding;
    g.append("rect")//relaciones
      .attr("y", y1)
      .attr("x", x1)
      .attr("height", heightPerZone)
      .attr("width", x2)
      .style('fill', colors[i][i % 3]);
    j++;


    var y2 = y1 + heightPerZone;
    zones[num] = new type(x1, x1 + x2, y1, y2);

  })



  nodes.forEach((item) => {
    maxRadius = 0;
    array = item.Label.split(" ");
    array.forEach(function(element){
      if((element.length * 4 + 10) > maxRadius)
        maxRadius = element.length * 4 + 10
    })
    
    item.radius = maxRadius;
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
  //.on("end", drag_end);


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
    .html(function (d) {
      array = d.Label.split(" ");
      head = array[0];
      tail = array.slice(1);
      label = head;
      tail.forEach(function(element){
        label += "<tspan x=0 dy=16 >" + element + "</tspan>"
      })
      return label;
    }).style('fill', 'rgb(50,50,50)')
    




  //This function is for effect selectable nodes, when mouse deselect node, the opacity come to normall value
  //for more inforation you can check this page http://bl.ocks.org/eyaler/10586116
  assignEffectOfClick();

  //drag handler
  //d is the node 
  var currentX, currentY;
  function drag_start(d) {

    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    currentX = d.x;
    currentY = d.y;
  }

  function drag_drag(d) {

    if (zones[d.type].isContainedInx(d3.event.x, d.radius)) {
      d.fx = d3.event.x;
    } else if (d3.event.x - currentX < 0) { // move to left
      if (zones[d.type].isContainedInx(d.fx - coeffMovement, d.radius))
        d.fx -= coeffMovement;
    } else if (d3.event.x - currentX > 0) { // move to right
      if (zones[d.type].isContainedInx(d.fx + coeffMovement, d.radius))
        d.fx += coeffMovement;
    }

    if (zones[d.type].isContainedIny(d3.event.y, d.radius)) {
      d.fy = d3.event.y;
    } else if (d3.event.y - currentY < 0) { // move to up
      if (zones[d.type].isContainedIny(d.fy - coeffMovement, d.radius)) {
        d.fy -= coeffMovement;
      }

    } else if (d3.event.y - currentY > 0) { // move to down
      if (zones[d.type].isContainedIny(d.fy + coeffMovement, d.radius)) {

        d.fy += coeffMovement;
      }

    }
    currentX = d.fx;
    currentY = d.fy;
  }


  function drag_end(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    if (zones[d.type].isContainedInx(d3.event.x, d.radius))
      d.fx = d3.event.x;
    if (zones[d.type].isContainedIny(d3.event.y, d.radius))
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
    .translateExtent([[0, padding], [width, height]])
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

