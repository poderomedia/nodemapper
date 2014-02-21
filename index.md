---
layout: main
title: Panama
---

<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>

<div class="col-md-12">
<div id="example04" class="example"></div>
</div>
</div>


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

            d.isclick = false;

            var dataurl = "../data/"+d.id+".json";


            d3.json(dataurl, function(error, data) {

                if (!error) {

                var olddata = d3.select('div#example04').data()[0];

                olddata.nodes = olddata.nodes.concat(data.nodes);
                olddata.links = olddata.links.concat(data.links);

                d3.select('div#example04')
                    .data([olddata])
                    .call(chart01);}
            });
        })
        .nodeClass(function(d) { return d.type; });

        d3.select('div#example04').data([data]).call(chart01);
    });

</script>
</body>