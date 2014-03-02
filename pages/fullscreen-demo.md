---
layout: main
title: Fullscreen Demo
---

<link href="{{ site.baseurl }}/css/index.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<link href="{{ site.baseurl }}/css/font-awesome.min.css" rel="stylesheet">

<script src="{{ site.baseurl }}/js/lib/underscore.js"></script>

# {{ page.title }}

<div>
    <style>
        #fs-modal-chart {
            position: absolute;
            height: auto;
            padding: 0;
            background-color: white;
            left: 0;
            top: 0;
        }

        #fs-modal-chart.hidden {
            display: none;
        }
    </style>
</div>


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
        .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; })
        .nodeURL(function(d) { return '{{site.baseurl}}/pages/' + d.id; })
        .fullscreenCallback(toFullScreen);

        function toNormal() {
            chart01.width(width).height(height)
                .fullscreenCallback(toFullScreen);

            d3.select('#demo').data(d3.select('#fs-modal-chart').data()).call(chart01);
            d3.select('#fs-modal-chart').selectAll('svg').remove();
        }

        function toFullScreen() {
            chart01.width(screen.width).height(screen.height)
                .fullscreenCallback(toNormal);

            d3.select('#fs-modal-chart').data(d3.select('#demo').data()).call(chart01);
        }


    d3.select('div#demo').data([data]).call(chart01);
});
</script>

<div id="fs-modal-chart"></div>

