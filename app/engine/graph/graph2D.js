const d3 = require("d3");
const { remote } = require('electron')
const { Menu, MenuItem } = remote


const width = screen.width;
const height = screen.height;
const radius = (width * 2) / 70;
const linkWidth = radius / 10;
const highlight_color = "#111"; //this color will be used when user clicks on one node.
const default_link_color = "#888";
const nominal_stroke = 1.5; //stroke width
const default_border_color = "#00AFB7"
const highlight_trans = 0.1;
const firstSelectNodeColor = "#FF5733";
const secondSelectNodeColor = "#333FFF";



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


var auxClickedNodeMenu;
var firstNodeClick = null;
var secondNodeClick = null;


var edges_value_copy;
var nodes_value_copy;

const menu = new Menu()
menu.append(new MenuItem({
    label: 'Select source', click() {

        if (firstNodeClick != null) {
            circle.style("stroke", function (o) {
                return isSelected(o, default_border_color);
            });
            text.style("font-weight", function (o) {
                return "normal";
            });
        }
        firstNodeClick = auxClickedNodeMenu;
        if (secondNodeClick != null)
            if (firstNodeClick.Id == secondNodeClick.Id)
                secondNodeClick = null;

        circle.style("stroke", function (o) {
            return isSelected(o, default_border_color)
        });
        text.style("font-weight", function (o) {
            return (o.Id == firstNodeClick.Id) ? "bold" : "normal";
        });
    }
}))
//menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({
    label: 'Select destiny', click() {

        if (secondNodeClick != null) {
            circle.style("stroke", function (o) {
                return isConnected(o, default_border_color);
            });
            text.style("font-weight", function (o) {
                return "normal";
            });
        }

        secondNodeClick = auxClickedNodeMenu;
        if (firstNodeClick != null)
            if (firstNodeClick.Id == secondNodeClick.Id)
                firstNodeClick = null;

        circle.style("stroke", function (o) {
            return (o.Id == secondNodeClick.Id) ? secondSelectNodeColor : default_border_color;
        });
        text.style("font-weight", function (o) {
            return (o.Id == secondNodeClick.Id) ? "bold" : "normal";
        });
    }
}))

menu.append(new MenuItem({


    label: 'Remove flags', click() {
        firstNodeClick = null;
        secondNodeClick = null;
        auxClickedNodeMenu = null;
        circle.style("stroke", function (o) {
            return default_border_color;
        });
        text.style("font-weight", function (o) {
            return "normal";
        });
    }
}))





exec();

async function exec() {
    nodes_value = await server.getNodes();
    //nodes_value_copy = JSON.parse(nodes_value);

    edges_value = await server.getEdges();
    //edges_value_copy = JSON.parse(edges_value);

    //console.log(edges_value)
    //console.log("result: " + JSON.stringify(getNext(46, 40,JSON.parse(edges_value), [])))
    //console.log("result: " + JSON.stringify(getNext(40, 46,JSON.parse(edges_value), [])))

    createGraph(assignPosition(JSON.parse(nodes_value)), JSON.parse(edges_value))
}


function getNext(source, destiny, edges, acum) {

    for (var i = 0; i < edges.length; i++) {
        console.log("compare " + edges[i] + " with source: " + source + " destiny " + destiny)
        if (edges[i].source == source && edges[i].target == destiny) { //aqui esta el problema
            console.log("finish")
            //acum.push({ "source": edges[i].source, "target": edges[i].target })
            acum[edges[i].source + "," + edges[i].target] = true
            acum[edges[i].source] = true
            acum[edges[i].target] = true
            //console.log("finish")
            return acum;
        } else if (edges[i].source == source) {
            acum[source + "," + edges[i].target] = true
            acum[source] = true
            acum[edges[i].target] = true
            //acum.push({ "source": source, "target": edges[i].target })
            return getNext(edges[i].target, destiny, edges, acum);
        }
        return null;
    }
}



/** 
 *  This function collects best features from d3.js examples
 *  for more imformation you can check the oficial page https://d3js.org/
*/

function createGraph(nodes_data, links_data) {
    g.append("rect")//relaciones
        .attr("y", -height)
        .attr("x", -width * 2)
        .attr("height", height * 4)
        .attr("width", width * 6)
        .style('fill', '#F6D1D1')
    g.append("rect")//variables
        .attr("y", -height * 2)
        .attr("x", -width * 2)
        .attr("height", height * 2.4)
        .attr("width", width * 6)
        .style('fill', '#D1E6F6')
    g.append("rect")//pr
        .attr("y", height / 1.4)
        .attr("x", -width * 2)
        .attr("height", height)
        .attr("width", width * 6)
        .style('fill', '#D4F6D1')
    g.append("rect")//CR
        .attr("y", height)
        .attr("x", -width * 2)
        .attr("height", height * 2)
        .attr("width", width * 6)
        .style('fill', '#b2cefe')
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
        .on("contextmenu", function (d, i) {

            d3.event.preventDefault();
            auxClickedNodeMenu = d;

            menu.popup({ value: 3, window: remote.getCurrentWindow() })

            // react on right-clicking
        });


    //Creeation of nodes with dinamic radius.
    circle = node.append('circle')
        .classed("svgCircleType0", true)
        .attr("r", function (d) {
            return (radius > ("" + d.Label).length * 4 + 10) ? radius : ("" + d.Label).length * 4 + 10;
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


    function drag_start(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.01).restart();

        d.fx = d.x;
        d.fy = d.y;
    }

    function drag_drag(d) {
        d.fy = d3.event.y
        d.fx = d3.event.x;

    }


    function drag_end(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function tickActions() {
        node.attr('transform', d => `translate(${d.x},${d.y})`)

        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });


    }


    zoom_handler = d3.zoom()
        .scaleExtent([0.3, 3])
        .translateExtent([[-width / 2, -height / 2], [width * 1.5, height * 1.5]])
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    function zoom_actions() {
        g.attr("transform", d3.event.transform)
    }



}


//asign position per node
function assignPosition(nodes) {
    xPositionPerTypeLeft = { "xtype0": -radius, "xtype1": -radius, "xtype2": -radius, "xtype3": -radius }
    xPositionPerTypeRight = { "xtype0": radius, "xtype1": radius, "xtype2": radius, "xtype3": radius }
    nodes.forEach((item) => {
        item.fixed = "TRUE"
        left = false;
        if (Math.random() < 0.5)
            left = true
        if (item.type == 0) {
            if (left) {
                item.x = xPositionPerTypeLeft.xtype0;
                xPositionPerTypeLeft.xtype0 -= radius * 2;
            } else {
                item.x = xPositionPerTypeRight.xtype0;
                xPositionPerTypeRight.xtype0 += radius * 2;
            }
            item.y = height;
        } else if (item.type == 1) {
            if (left) {
                item.x = xPositionPerTypeLeft.xtype1;
                xPositionPerTypeLeft.xtype1 -= radius * 2;
            } else {
                item.x = xPositionPerTypeRight.xtype1;
                xPositionPerTypeRight.xtype1 += radius * 2;
            }
            item.y = height * 0.8

        } else if (item.type == 2) {
            if (left) {
                item.x = xPositionPerTypeLeft.xtype2;
                xPositionPerTypeLeft.xtype2 -= radius * 2;
            } else {
                item.x = xPositionPerTypeRight.xtype2;
                xPositionPerTypeRight.xtype2 += radius * 2;
            }
            item.y = height / 2;
        } else if (item.type == 3) {
            if (left) {
                item.x = xPositionPerTypeLeft.xtype3;
                xPositionPerTypeLeft.xtype3 -= radius * 2;
            } else {
                item.x = xPositionPerTypeRight.xtype3;
                xPositionPerTypeRight.xtype3 += radius * 2;
            }
            item.y = 0;
        }
    });
    return nodes;
}

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
    svg.transition().duration(200).ease(d3.easeLinear).call(zoom_handler.transform, d3.zoomIdentity.translate(300, 200).scale(0.6));
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

//this function is consumed by the button original model
let originalModel = function () {
    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
        location.reload();
    })
}

//this function is consumed by the button change model
let changeModel = function () {
    swal({
        title: 'Select new model',
        input: 'select',
        inputOptions: {
            "Cooler": "Cooler"
        },
        inputPlaceholder: 'Select a model',
        showCancelButton: true,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value == "Cooler") {
                    swal(
                        'Model changed',
                        'You changed to model "' + value + '"',
                        'success'
                    ).then((result) => {
                        location.reload();
                    })
                }
                return !value && resolve('Select a correct model')

            })
        }
    })
}
