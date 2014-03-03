---
layout: main
title: Documentation
---

<link href="{{ site.baseurl }}/css/pty.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

# Network Chart

<div class="row">
    <div class="col-md-12">
        <div id="chart01"></div>
    </div>
</div>


<script>
    var width = parseInt(d3.select('#chart01').style('width'), 10),
        height = 400;

	var chart01 = pty.chart.network()
		.width(width)
		.height(height)
        .nodeRadius(10)
        .nodeLabel(function(d) { return d.name; })
        .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; })
        .nodeURL(function(d) { return '{{site.baseurl}}/pages/' + d.id; });

	d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

		if (error) { return error; }

		d3.select('#chart01').data([data]).call(chart01);
	});
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Data Structure</h3>

The network chart requires a data object with three attributes: root, nodes and links. The nodes should have an `id` and the number of connection with other nodes `numcn`. The `id` will be used to retrieve additional nodes on click. The number of connections is necessary to determine whether the node has additional connections or not.

The links represent the connections between nodes. They should have the `from` and `to` attributes, that should contain the id of the connected nodes. The network chart will discard duplicated links. Links from `A` to `B` or from `B` to `A` will be considered equal.

The `root` attribute indicates which is the central node. For instance, a valid data structure will be:

{% highlight json %}
{
  "root": "A",
  "nodes": [
    {"id": "A", "name": "Mr. A",  "type": "persona",     "numcn": 3},
    {"id": "B", "name": "Miss B", "type": "persona",     "numcn": 3},
    {"id": "C", "name": "C Corp", "type": "institucion", "numcn": 2},
    {"id": "D", "name": "Dr. D",  "type": "persona",     "numcn": 5}
  ],
  "links": [
    {"from": "A", "to": "B"},
    {"from": "A", "to": "C"},
    {"from": "A", "to": "D"},
    {"from": "B", "to": "D"},
    {"from": "C", "to": "D"}
  ]
}
{% endhighlight %}


<h3><span class="glyphicon glyphicon-bookmark"></span> Default settings</h3>

The following script initiates a force chart using the data contained in the file `A.json`. By default, the central node is colored with aqua-light with and surrounded by a grey stroke. The other nodes are light green and change color when the cursor is on them. A grey stroke around a non-central node indicates that the node has neighbors that are not displayed (as they are not linked to the central node). A different style is used weither the link connects to the central node or not. All the nodes can be dragged.

{% highlight javascript %}
// Container DIV
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

<div id="example01" class="example"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network();

        d3.select('div#example01')
            .data([data])
            .call(chart);
    });
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Setting the chart size</h3>

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

<div id="example02" class="example"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        var chart = pty.chart.network()
            .width(600)
            .height(300);

        d3.select('div#example02')
            .data([data])
            .call(chart);
    });
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Setting the radius of the nodes</h3>

The radius of the nodes can be set using the option `.nodeRadius()`. The default value is 20.

{% highlight javascript %}
// Create a chart with custom node radius
var chart = pty.chart.network()
    .nodeRadius(25);

d3.select('div#example03')
    .data([data])
    .call(chart);
{% endhighlight %}

<div id="example03" class="example"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network()
            .nodeRadius(25);

        d3.select('div#example03')
            .data([data])
            .call(chart);
    });
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Setting the node class</h3>

Set the styles for circles of class `persona` and `institucion`.
{% highlight css %}
.network-chart circle.persona {
    fill: #C44D58;
}

.network-chart circle.institucion {
    fill: #556270;
}

.network-chart circle.candidato {
    fill: white;
}
{% endhighlight %}

Set the function to determine the node class using the attributes of each node element.

{% highlight javascript %}
// Create a chart and set the class for the nodes
var chart = pty.chart.network()
    .nodeClass(function(d) { return d.type; });

d3.select('div#example04')
    .data([data])
    .call(chart);
{% endhighlight %}

<div>
    <style>
        .network-chart circle.persona {
            fill: #C44D58;
        }

        .network-chart circle.institucion {
            fill: #556270;
        }

        .network-chart circle.candidato {
            fill: white;
        }
    </style>
</div>

<div id="example04" class="example"></div>

<script>
    d3.json('{{ site.baseurl }}/data/E.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network()
            .nodeClass(function(d) { return d.type; });

        d3.select('div#example04')
            .data([data])
            .call(chart);
    });
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Adding a Legend</h3>

To add a legend, the user has to provide a list of all the node types as follows and submit the list to `.legendItems()`.

{% highlight javascript %}
     var legend = [
        {name: 'Persona',     type: 'persona'},
        {name: 'Candidato',   type: 'candidato'},
        {name: 'Institución', type: 'institucion'}
    ];

    var chart01 = pty.chart.network()
        .legendItems(legend);
{% endhighlight %}

The style of the circles representing each node type in the legend has to be set separately form the style for the nodes in the graph. This allows for instance to draw a stroke around the legend circles in order to differentiate them from the background without altering the style of the nodes of the graph.

{% highlight javascript %}
// Legend
    .legend {

        .persona {
            fill: #75507b;
            stroke: @grey-light;
            stroke-width: 1;
        }

        .candidato {
            fill: #729fcf;
            stroke: @grey-light;
            stroke-width: 1;
        }

        .institucion {
            fill: #8ae234;
            stroke: @grey-light;
            stroke-width: 1;
        }

        text {
            font-size: 11px;
            fill: @grey-light;
        }
    }
{% endhighlight %}

<div>
    <style type="text/css">
// Legend
    .legend {

        .persona {
            fill: #75507b;
            stroke: @grey-light;
            stroke-width: 1;
        }

        .candidato {
            fill: #729fcf;
            stroke: @grey-light;
            stroke-width: 1;
        }

        .institucion {
            fill: #8ae234;
            stroke: @grey-light;
            stroke-width: 1;
        }

        text {
            font-size: 11px;
            fill: @grey-light;
        }
    }

    </style>
</div>

<div id="example05" class="example"></div>

<script>

    var legend = [
        {name: 'Persona',     type: 'persona'},
        {name: 'Candidato',   type: 'candidato'},
        {name: 'Institución', type: 'institucion'}
    ];

    d3.json('{{ site.baseurl }}/data/E.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network()
            .nodeClass(function(d) { return d.type; })
            .legendItems(legend);

        d3.select('div#example05')
            .data([data])
            .call(chart);
    });
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Adding Labels</h3>

{% highlight javascript %}
var chart = pty.chart.network()
    .nodeLabel(function(d) { return d.name; });

d3.select('div#example05')
    .data([data])
    .call(chart);
{% endhighlight %}

<div class="example" id="example06"></div>

<script>

    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        // Create a chart with the default options
        var chart = pty.chart.network()
            .nodeLabel(function(d) { return d.name; });

        d3.select('div#example06')
            .data([data])
            .call(chart);
    });
</script>


<h3><span class="glyphicon glyphicon-bookmark"></span> Basic Settings of the Force Layout</h3>

The user can change the values of the charge, friction, link distance and link strength using the options `.charge()`, `.friction()`, `.linkDistance()` and `linkStrength()` respectively. These are standard properties of the force layout and a complete documentation can be found in the [D3 force layout documentation](https://github.com/mbostock/d3/wiki/Force-Layout). By default, the central node is initially pinned to the center and stays pinned to any location it is dragged to. This can be changed with the option `.fixCenter(false)`.

<h3><span class="glyphicon glyphicon-bookmark" class=""></span> Adding new nodes on click</h3>

In the following example, nodes `B` and `D` have neighbors that are not displayed initially, because they are not connected to the central node `A`. If the `nodeBaseURL` attribute is set, clicking on `B` will retrieve the nodes from `data/B.json` and add them to the chart.

{% highlight javascript %}
// Set the function to generate the URL of each node
var chart = pty.chart.network()
    .nodeBaseURL(function(d) { return 'data/' + d.id + '.json'; });

// Bind the container div to the data and invoke the chart
d3.select('div#chart')
    .data([data])
    .call(chart);
{% endhighlight %}

<div id="example07" class="example"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        if (error) { return error; }

        var width = 600,
            height = 400;

        var chart01 = pty.chart.network()
            .width(width)
            .height(height)
            .nodeRadius(15)
            .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; });


        d3.select('div#example07').data([data]).call(chart01);
    });
</script>


<h3><span class="glyphicon glyphicon-bookmark" class=""></span> Setting link to a new entity</h3>

In the following example, when the user clicks on a node, a link appears on the bottom left of the chart. The text corresponds to the `.nodeLabel()` while the link can be set using `.nodeURL()`.

{% highlight javascript %}
// Set the function to generate the URL of each node
var chart = pty.chart.network()
    .nodeLabel(function(d) { return d.name; })
    .nodeURL(function(d) { return '{{site.baseurl}}/pages/' + d.id; });

// Bind the container div to the data and invoke the chart
d3.select('div#chart')
    .data([data])
    .call(chart);
{% endhighlight %}

<div id="example08" class="example"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        if (error) { return error; }

        var width = 600,
            height = 400;

        var chart02 = pty.chart.network()
            .width(width)
            .height(height)
            .nodeRadius(15)
            .nodeLabel(function(d) { return d.name; })
            .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; })
            .nodeURL(function(d) { return '{{site.baseurl}}/pages/' + d.id; });


        d3.select('div#example08').data([data]).call(chart02);
    });
</script>

<h3><span class="glyphicon glyphicon-bookmark"></span> Embed</h3>

Create a page containing a single network chart (see [here]({{site.baseurl}}/embed) for instance) and insert the `embed` tag with appropiate values.

{% highlight html %}
<embed type="text/html" src="{{ site.baseurl }}/embed" width="640" height="480">
{% endhighlight %}

<embed type="text/html" src="{{ site.baseurl }}/embed" width="640" height="480">


