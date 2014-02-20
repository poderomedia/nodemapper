---
layout: main
title: Documentation
---
<div>
	<style>
		.highlight{
			fill: #aaa;
		}
		.link {
  			stroke: #999;
  			stroke-opacity: .8;
  			stroke-width: 5;
		}
		.minorlink {
			stroke: #999;
			stroke-opacity: .2;
			stroke-width: 3;
		}
		.center{
			fill: #aaa;
			stroke: #555;
			stroke-width: 6;
		}

        .persona {
            stroke: red;
            stroke-width: 2;
        }
	</style>
</div>

<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<script>


</script>

<h1>Network Chart Documentation</h1>

<a href="#" id="add-nodes">Add</a>
<div id="chart01"></div>

<script>
    // var data = data1
	var chart01 = pty.chart.network()
		.width(300)
		.height(500)
		.onClick(function(d) {
            d3.json('../data/D.json', function(error, data) {

                var olddata = d3.select('#chart01').data()[0];

                olddata.nodes = olddata.nodes.concat(data.nodes);
                olddata.links = olddata.links.concat(data.links);

                d3.select('#chart01')
                    .data([olddata])
                    .call(chart01);
            });
        })
        .nodeClass(function(d) { return d.type; });

	d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

		if (error) { return error; }

        // console.log(data);

		d3.select('#chart01')
			.data([data])
			.call(chart01);
	});

</script>