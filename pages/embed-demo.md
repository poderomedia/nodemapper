---
layout: main
title: Embed Demo
---

<link href="{{ site.baseurl }}/css/pty.css" rel="stylesheet">
<script src="{{ site.baseurl }}/js/lib/d3.min.js"></script>
<script src="{{ site.baseurl }}/src/pty.js"></script>
<link href="{{ site.baseurl }}/css/font-awesome.min.css" rel="stylesheet">

<script src="{{ site.baseurl }}/js/lib/underscore.js"></script>

# {{ page.title }}

<!-- Modal -->
<div class="modal fade" id="embed-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">Embed the Network Chart</h4>
            </div>
            <!-- Modal Body -->
            <div class="modal-body">
                <form role="form" class="form">
                    <div class="form-group">
                        <label class="" for="embed-width">Width</label>
                        <input type="text" class="form-control" id="embed-width" value="600">
                    </div>
                    <div class="form-group">
                        <label class="" for="embed-height">Height</label>
                        <input type="text" class="form-control" id="embed-height" value="400">
                    </div>
                    <div class="form-group">
                        Copy the following code in your page to embed the visualization.
                        <textarea class="form-control" id="embed-code"></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div id="demo"></div>
    </div>
</div>

<script>

// Define templates for the url and text area content
var urlTpl = _.template('{{site.baseurl}}/embed/<%= id %>.html'),
    embedTpl = _.template('<embed type="text/html" src="<%= src %>" width="<%= width %>" height="<%= height %>">');

// Update the embed code when the width or height changes
function updateEmbed(url) {
    var embedData = {
        width: d3.select('#embed-width').node().value,
        height: d3.select('#embed-height').node().value,
        src: url
    };

    d3.select('#embed-code').node().value = embedTpl(embedData);
}

d3.json('{{ site.baseurl }}/data/A.json', function(error, data) {

    if (error) { return error; }

    var width = parseInt(d3.select('#demo').style('width'), 10),
        height = 400;

    var embedUrl = '{{site.baseurl}}/embed/' + data.root + '.html';

    var chart01 = pty.chart.network()
        .width(width)
        .height(height)
        .nodeRadius(15)
        .nodeLabel(function(d) { return d.name; })
        .nodeBaseURL(function(d) { return '{{site.baseurl}}/data/' + d.id + '.json'; })
        .nodeURL(function(d) { return '{{site.baseurl}}/pages/' + d.id; })
        .embedCallback(function() { $('#embed-modal').modal(); });

    d3.select('div#demo').data([data]).call(chart01);

    // Fill the embed code the first time and listen for changes in the width and height
    updateEmbed(embedUrl);
    d3.select('#embed-width').on('change', function() { updateEmbed(embedUrl); });
    d3.select('#embed-height').on('change', function() { updateEmbed(embedUrl); });
});
</script>


