---
layout: embed
title: Embed
---
<div>
<link href="{{ site.baseurl }}/css/pty.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</div>

<div class="row">
    <div class="col-md-12">
        <div id="chart01"></div>
    </div>
</div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        if (error) { return error; }

        var width = 640,
            height = 480;

        var chart01 = pty.chart.network()
            .width(width)
            .height(height)
            .nodeRadius(15)
            .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; })
            .textBox({
                x: 10,
                y: 300,
                width: 300,
                height: 200
            });

        d3.select('div#chart01').data([data]).call(chart01);
    });
</script>
