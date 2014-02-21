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

## Default Settings

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, dignissimos, soluta, dolore ipsa culpa voluptas laboriosam odit ipsam expedita eaque officia nam veniam impedit iure iusto labore incidunt architecto libero quae quo. Ea, dicta, officiis, ab delectus tenetur quis sapiente vero eligendi odit facilis quas adipisci fugiat aperiam quam voluptates.

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


## Setting the Chart Size

Lorem ipsum dolor sit amet, `consectetur` adipisicing elit. Molestiae, dignissimos, soluta, dolore ipsa culpa voluptas laboriosam odit ipsam expedita eaque officia nam veniam impedit iure iusto labore incidunt architecto libero quae quo. Ea, dicta, officiis, ab delectus tenetur quis sapiente vero eligendi odit facilis quas adipisci fugiat aperiam quam voluptates.

{% highlight javascript %}
// Create a chart with the default options
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

        // Create a chart with the default options
        var chart = pty.chart.network()
            .width(600)
            .height(300);

        d3.select('div#example02')
            .data([data])
            .call(chart);
    });
</script>
