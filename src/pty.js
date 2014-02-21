var pty = {
    version: '0.1.0',  // semver
    chart: {}
};

pty.chart.network = function() {

    // Chart Attributes
    var width = 400;
    var height = 400;
    var radius = 10;
    var onClick = function(d, i) {};
    var nodeClass = function(d, i) { return ''; };

    // Charting Function
    function chart(selection) {
        selection.each(function(data) {

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]);

            var idx = {};
            var dataNodes = [];

            var k = 0;
            data.nodes.forEach(function(d) {
                if (!idx.hasOwnProperty(d.id)) {
                    idx[d.id] = k;
                    k += 1;
                    dataNodes.push(d);
                }
            });


            var idxLinks = {};
            var dataLinks = [];
            k = 0;
            data.links.forEach(function(d) {

                d.source = Math.min(idx[d.from], idx[d.to]);
                d.target = Math.max(idx[d.from], idx[d.to]);
                d.linkID = d.source + '-' + d.target;

                if (!idxLinks.hasOwnProperty(d.linkID)) {
                    idxLinks[d.linkID] = k;
                    dataLinks.push(d);
                    k += 1;
                }
            });

            //console.log(dataLinks);

            var svgEnter = svg.enter().append('svg')
                .attr('width', width)
                .attr('height', height);

            svgEnter
                .append('g')
                .attr('class', 'network-chart');

            var g = svg.select('g.network-chart');

            var force = d3.layout.force()
                .charge(-5000)
                .size([width, height]);

            force.nodes(dataNodes)
                .links(dataLinks)
               // .linkDistance(200)
                .start();


            // Links
            var links = g.selectAll('line.link')
                .data(force.links(), function(d) { return d.linkID; });

            links.transition()
                .attr('stroke', 'blue');

            links.enter().append('line')
                .attr('class', function(d) {
                    if(d.from === data.root) { return 'link'; }
                    else { return 'link'; }
                } )
                .attr('stroke', 'red');

            links.exit().remove();

            // Circles
            var circles = g.selectAll('circle.node')
                .data(force.nodes(), function(d) { return d.id; });

            circles.transition()
                .attr('fill', 'blue');

            circles.enter()
                .append('circle')
                .attr('class', 'node')
                .attr('r', radius)
                .classed('node', true)
                .classed('center', function(d) { return d.id === data.root; })
                //.classed('isclick',function(d) {return d.isclick; })
                .attr('fill', 'red')
                .on('click', function(d) { if(d.isclick) {if(d.id !== data.root) { onClick(); } }}) //Ok, no se hacer AND,...
                .on('mouseover', function(d) { d3.select(this).classed('highlight', true); })
                .on('mouseout', function(d) { d3.select(this).classed('highlight', false); });


            circles.call(force.drag);

            circles.exit().remove();

            //Labels
            var words = g.selectAll('text')
                .data(force.nodes(), function(d) { return d.id; });

            words.transition();

            words.enter()
                .append('text')
                .text(function(d) { return d.name})
                .attr('text-anchor','start')
                .attr('x',function(d) { return d.x + 10; })
                .attr('y', function(d) { return d.y -10; })
                .attr('width',10)
                .attr('height',10)
                .attr('fill','black');

            words.exit().remove();


            // Force On Tick
            force.on('tick', function() {
                links
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                circles
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });

                words.attr('x', function(d) { return d.x + 10; })
                            .attr('y', function(d) { return d.y - 10; });

            });

        });
    }


    // Accessor Methods

    chart.width = function(value) {
        if (arguments.length === 0) { return width; }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (arguments.length === 0) { return width; }
        width = value;
        return chart;
    };

    chart.nodeClass = function(value) {
        if (arguments.length === 0) { return nodeClass; }
        nodeClass = value;
        return chart;
    };

    chart.edgeClass = function(value) {
        if (arguments.length === 0) { return edgeClass; }
        edgeClass = value;
        return chart;
    };

    chart.onClick = function(value) {
        if (arguments.length === 0) { return onClick; }
        onClick = value;
        return chart;
    };

    return chart;
};