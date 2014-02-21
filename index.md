---
layout: main
title: Panama
---

<link href="{{ site.baseurl }}/css/index.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>

<div class="row">
    <div class="col-md-12">
        <div id="demo"></div>
    </div>
</div>


<script>
d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

    if (error) { return error; }

    var width = parseInt(d3.select('#demo').style('width'), 10),
        height = 400;

    var chart01 = pty.chart.network()
        .width(width)
        .height(height)
        .nodeRadius(15)
        .nodeLabel(function(d) { return d.name; })
        .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; });

    d3.select('div#demo').data([data]).call(chart01);
});
</script>