---
layout: main
title: Node A
---

<link href="{{ site.baseurl }}/css/pty.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<link href="{{ site.baseurl }}/css/font-awesome.min.css" rel="stylesheet">

<div class="row">
    <div class="col-md-12">
        <div id="demo"></div>
    </div>
</div>

<script>
d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

    if (error) { return error; }

    var width  = 640,
        height = 480;

    var legend = [
        {name: 'Persona',     type: 'persona'},
        {name: 'Candidato',   type: 'candidato'},
        {name: 'Institución', type: 'institucion'}
    ];

    var chart01 = pty.chart.network()
        .width(width)
        .height(height)
        .nodeRadius(15)
        .nodeLabel(function(d) { return d.name; })
        .nodeClass(function(d) { return d.type; })
        .nodeDescription(function(d) { return d.description; })
        .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; })
        .nodeURL(function(d) { return '{{site.baseurl}}/pages/' + d.id; })
        .legendItems(legend);

    d3.select('div#demo').data([data]).call(chart01);
});
</script>