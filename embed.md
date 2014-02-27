---
layout: embed
title: Embed
---

<link href="{{ site.baseurl }}/css/pty.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

<div id="chart01"></div>

<script>
    d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

        if (error) { return error; }

        var width = 640,
            height = 480;

        var chart01 = pty.chart.network()
            .width(width)
            .height(height)
            .nodeRadius(15)
            .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; });
            // .onClick(function(d) {

            //     d.isclick = false;

            //     var dataurl = "../data/" + d.id + ".json";


            //     d3.json(dataurl, function(error, data) {

            //         if (!error) {

            //         var olddata = d3.select('div#chart01').data()[0];

            //         olddata.nodes = olddata.nodes.concat(data.nodes);
            //         olddata.links = olddata.links.concat(data.links);

            //         d3.select('div#chart01')
            //             .data([olddata])
            //             .call(chart01);}
            //     });
            // });

        d3.select('div#chart01').data([data]).call(chart01);
    });
</script>