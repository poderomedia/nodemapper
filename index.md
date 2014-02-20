---
layout: main
title: Panama
---

<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>

<body> 
  <p> Bla</p>
<div>
	<style>
		.node {
  		stroke: #fff;
  		stroke-width: 1.5px;
		}

		.link {
  		stroke: #999;
  		stroke-opacity: .6;
		}
	</style>
</div>


<script type="text/javascript">
	var data1 = {
		nodes: [
			{name: 'A', value: 12, type: 'persona'},
			{name: 'B', value: 8, type: 'persona'},
			{name: 'C', value: 2, type: 'institucion'},
			{name: 'D', value: 20, type: 'persona'}
		],
		links: [
			{"source":0,"target":1,"value":2},
			{"source":0,"target":2,"value":2},
			{"source":0,"target":3,"value":1},
			{"source":1,"target":3,"value":1},
			{"source":2,"target":3,"value":3}
		]
	};

	var data2 = {
		nodes: [
			{name: 'D', value: 20, type: 'persona'},
			{name: 'E', value: 12, type: 'persona'},
			{name: 'F', value: 8, type: 'persona'}
		],
		links: [
			{"source":0,"target":1,"value":2},
			{"source":0,"target":2,"value":2},
			{"source":1,"target":2,"value":2}
			
		]
	};

	var data = data1;



var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(80)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);





  force.nodes(data.nodes)
      .links(data.links)
      .start();

  var link = svg.selectAll(".link")
      .data(data.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(data.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d){return 5*Math.sqrt(d.value)})
      .style("fill", function(d) { 
      	if(d.type === 'institucion'){return 'red'}
        else {return 'blue'};
      })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  d3.selectAll("circle").on("click",function(d){
     d3.select("body").append("p").text("Hola");
     var who = d.name
     console.log(who + " es un cara de oso");
     svg.append("circle").attr("class","node").attr("r",10).style("fill","black").call(force.start)
     node.push({name: 'G', value: 12, type: 'persona'})
  })

</script>
</body>