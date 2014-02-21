---
layout: main
title: Documentation
---

<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>

# Network Chart

<div id="chart01"></div>

<script>
    var width = 600,
        height = 400;

	var chart01 = pty.chart.network()
		.width(width)
		.height(height)
        .nodeRadius(15)
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

		d3.select('#chart01').data([data]).call(chart01);
	});

</script>