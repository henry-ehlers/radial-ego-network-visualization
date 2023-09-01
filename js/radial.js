// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#radial")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const dataset = "mouse.visual_cortex_1";
  const ego = "1";
  
  const promises = [
      d3.json('./data/' + dataset + "." + ego + '.edges.json'),
      d3.json('./data/' + dataset + "." + ego + '.nodes.json')
  ];

function color(hop) {
    switch (hop) {
        case 0:
            return 'black';
        case 1:
            return 'red';
        case 2:
            return 'blue';
        case 3:
            return 'turquoise';
        case 4:
            return 'pink';
        case 5: 
            return 'green';
    }
}

Promise.all(promises).then(function(promisedData){
    data = {
        links: promisedData[0],
        nodes: promisedData[1]
    }

    //
    let ego = data.nodes[0].ego;
    data.links = data.links.filter(d => (d.source != ego && d.target != ego));


    // Initialize the links
    var link = svg.append('g')
        .style("stroke", "#aaa")
        .attr("stroke-opacity", 1)
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
        .attr("stroke-width", d => d.weight);

    // Initialize the nodes
    var node = svg.append('g')
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
        .attr("r", 4)
        .style("fill", d => color(d.hop))
    console.log(data.nodes)

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()              // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
        )
        .force("r", d3.forceRadial(d => d.hop * 75, width/2, height/2).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        //.force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }

}).catch(function(error) {
    console.log(error);
});
