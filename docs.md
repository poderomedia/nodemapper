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
            d3.json('../data/A.json', function(error, data) {

                var olddata = d3.select('#chart01').data()[0];

                olddata.nodes = olddata.nodes.concat(data.nodes);
                olddata.links = olddata.links.concat(data.links);

                d3.select('#chart01')
                    .data([olddata])
                    .call(chart01);
            });
        })
        .nodeClass(function(d) { return d.type; });

	d3.json('{{ site.baseurl }}/data/D.json', function(error, data) {

		if (error) { return error; }

		d3.select('#chart01').data([data]).call(chart01);
	});

</script>

## Default Settings

The following script initiates a force chart using the data contained in the file A.json. By default, the central node is colored with aqua-light with and surrounded by a grey stroke. The other nodes are light green and change color when the cursor is on them. A grey stroke around a non-central node indicates that the node has neighbors that are not displayed (as they are not linked to the central node). A different style is used weither the link connects to the central node or not. All the nodes can be dragged.

{% highlight javascript %}
<div id="example01"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network();

        d3.select('div#example01')
            .data([data])
            .call(chart);
    });
</script>
{% endhighlight %}

<div id="example01"></div>

<script>
    d3.json('{{ site.baseurl }}/data/B.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network();

        d3.select('div#example01')
            .data([data])
            .call(chart);
    });
</script>


## Setting the Chart Size

The width and height of the chart can be set by using the options `.width()` and `.height()` . If omitted, the default parameters are `width = 400` and `height = 400`.


{% highlight javascript %}
// Create a chart with custom width and height
var chart = pty.chart.network()
    .width(600)
    .height(300);

d3.select('div#example02')
    .data([data])
    .call(chart);
{% endhighlight %}

<div id="example02"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        var chart = pty.chart.network()
            .width(600)
            .height(200);

        d3.select('div#example02')
            .data([data])
            .call(chart);
    });
</script>

## Setting the radius of the Nodes

The radius of the nodes can be set using the option '.nodeRadius()'. The default value is 20.

{% highlight javascript %}
        // Create a chart with custom node radius
        var chart = pty.chart.network()
            .nodeRadius(50);

        d3.select('div#example03')
            .data([data])
            .call(chart);
    });
{% endhighlight %}

<div id="example03"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network()
            .nodeRadius(50);

        d3.select('div#example03')
            .data([data])
            .call(chart);
    });
</script>

## Basic Settings of the Force Layout

The user can change the values of the charge, friction, link distance and link strength using the options `.charge()`, `.friction()`, `.linkDistance()` and `linkStrength()` respectively. By default, the central node is initially pinned to the center and stays pinned to any location it is dragged to. This can be changed with the option `.fixCenter(false)`.

## Expanding the graph

In the following example, node D has neighbors that are not displayed in the initial graph. Clicking on node D will make all his neighbors appear.

<div id="example04"></div>

<script>

    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        if (error) { return error; }

        var width = 600,
        height = 400;

    var chart01 = pty.chart.network()
        .width(width)
        .height(height)
        .nodeRadius(15)
        .onClick(function(d) {
            d3.json('../data/D.json', function(error, data) {

                var olddata = d3.select('div#example04').data()[0];

                olddata.nodes = olddata.nodes.concat(data.nodes);
                olddata.links = olddata.links.concat(data.links);

                d3.select('div#example04')
                    .data([olddata])
                    .call(chart01);
            });
        })
        .nodeClass(function(d) { return d.type; });

        d3.select('div#example04').data([data]).call(chart01);
    });

</script>