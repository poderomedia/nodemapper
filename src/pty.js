/* globals d3:false */

var pty = {
    version: '0.1.0'  // semver
};

// Charting Module
pty.chart = {};

// Network Chart
// -------------

pty.chart.network = function() {

    // Chart Attributes
    var me = {
        width: 400,
        height: 400,
        nodeRadius: 20,
        charge: function(d, i) { return -4e3; },
        friction: 0.5,
        linkStrength: 0.2,
        linkDistance: 120,
        nodeClass: function(d, i) { return ''; },
        nodeBaseURL: function(d) { return ''; },
        nodeURL: function(d) { return ''; },
        nodeLabel: function(d, i) { return ''; },
        fixCenter: true,
    };

    var initialData = false;

    // Charting Function
    function chart(selection) {
        selection.each(function(data) {

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]);

            // Data Preprocessing
            // ------------------

            if (!initialData) {
                data.nodes.forEach(function(d) { d.__first = true; });
                data.links.forEach(function(d) { d.__first = true; });
                initialData = true;
            }

            var idx = {},
                dataNodes = [],
                k = 0;

            // Identify unique nodes and construct a dictionary of indices
            data.nodes.forEach(function(d) {
                if (!idx.hasOwnProperty(d.id)) {
                    idx[d.id] = k;
                    k += 1;
                    dataNodes.push(d);
                }
            });

            dataNodes.forEach( function(d) {
                d.internalcn = 0;
            });

            // Identify unique links and set the source and target of each one
            k = 0;
            var idxLinks = {}, dataLinks = [];

            data.links.forEach(function(d) {

                d.source = Math.min(idx[d.from], idx[d.to]);
                d.target = Math.max(idx[d.from], idx[d.to]);
                d.linkID = d.source + '-' + d.target;

                if (!idxLinks.hasOwnProperty(d.linkID)) {
                    idxLinks[d.linkID] = k;
                    dataLinks.push(d);
                    dataNodes[idx[d.from]].internalcn += 1;
                    dataNodes[idx[d.to]].internalcn += 1;
                    k += 1;
                }
            });

            dataNodes.forEach( function(d) {
                d.isclick = (d.internalcn < d.numcn);
            });

            // Fix the center node
            dataNodes.forEach(function(d) {
                if (d.id === data.root) {
                    d.x = me.width / 2;
                    d.y = me.height / 2;
                    d.fixed = me.fixCenter;
                }
            });

            //Zoom
            var zooming = d3.behavior.zoom()
            .scaleExtent([0, 10])
            .on("zoom", zoomed);

            function zoomed() {
             plotcontainer.attr("transform", "scale(" + d3.event.scale + ")");
            }


            function onClick(d, i) {
                d3.json(me.nodeBaseURL(d), function(error, data) {
                    var olddata;

                    if (!error) {
                        olddata = div.data()[0];
                        olddata.nodes = olddata.nodes.concat(data.nodes);
                        olddata.links = olddata.links.concat(data.links);

                        div.data([olddata]).call(chart);
                    }
                });
                d.isclick = false;
            }

            // Initialization
            // --------------

            // Initialize the SVG element
            var svgEnter = svg.enter().append('svg')
                .attr('width', me.width)
                .attr('height', me.height)
                .call(chart.init);

            var g = svg.select('g.network-chart'),
                gplot = g.append('g'),
                plotcontainer = g.select('g.graph'),
                glinks = g.select('g.links'),
                gnodes = g.select('g.nodes'),
                glabels = g.select('g.labels'),
                gbrand = g.select('g.brand'),
                gNodeUrl = g.select('g.url-container'),
                nodeUrlLabel = gNodeUrl.select('text.url-container'),
                nodeUrlLink = gNodeUrl.select('a.url-container'),
                grefresh = g.select('g.refresh-button');
                gZoomContainer = g.select('g.zoom-container');

                var l = 1.5;

                var rect = svgEnter.append("rect")
                            .attr('x',100)
                            .attr("width", 40)
                            .attr("height", 40)
                            .style("fill", "green")
                            .style("pointer-events", "fill")
                            .on('click', function() {
                                plotcontainer.attr('transform','scale(' + l + ')translate(' + [-me.width*0.125,-me.height*0.125] + ')');
                                l = l+0.5;
                            });


            // Force layout
            // ------------

            var force = d3.layout.force()
                .charge(me.charge)
                .friction(me.friction)
                .linkStrength(me.linkStrength)
                .size([me.width, me.height]);

            force.nodes(dataNodes)
                .links(dataLinks)
                .start();

            // Initialize the node label to have the root node information

            var nodeRoot = dataNodes.filter(function(d) { return d.id === data.root; }).pop();

            if (!svgEnter.empty()) {
                nodeUrlLink.attr('xlink:href', me.nodeURL(nodeRoot));
                nodeUrlLabel.text(me.nodeLabel(nodeRoot));
            }

            // Graphic Elements
            // ----------------

            // Links
            // -----

            var links = glinks.selectAll('line.link')
                .data(force.links(), function(d) { return d.linkID; });

            links.enter().append('line')
                .attr('class', 'link')
                .classed('center-link', function(d) {
                    return (d.from === data.root) || (d.to === data.root);
                });

            // Remove unused links
            links.exit().remove();

            // Nodes
            // -----

            var circles = gnodes.selectAll('circle.node')
                .data(force.nodes(), function(d) { return d.id; });

            // Update
            circles.classed('node-clickable', function(d) { return d.isclick; });

            circles.enter().append('circle')
                .attr('class', function(d, i) {
                    return me.nodeClass(d, i) + ' node';
                })
                .attr('r', me.nodeRadius)
                .classed('node', true)
                .classed('node-center', function(d) { return d.id === data.root; })
                .classed('node-clickable', function(d) { return (d.id !== data.root) && (d.isclick); })
                .on('mouseover', function(d) {
                    d3.select(this).classed('node-highlight', true);
                })
                .on('mouseout', function(d) {
                    d3.select(this).classed('node-highlight', false);
                })
                .on('click', function(d, i) {

                    if (d3.select(this).classed('node-clickable')) {
                        onClick(d, i);
                    }

                    // Update the link and label
                    nodeUrlLink.attr('xlink:href', me.nodeURL(d));
                    nodeUrlLabel.text('' + me.nodeLabel(d));
                });

            circles.call(force.drag);

            circles.exit()
                .transition()
                .delay(300)
                .duration(2000)
                .attr('cy', me.width)
                .remove();

            // Labels
            // ------

            var words = glabels.selectAll('text.node-label')
                .data(force.nodes(), function(d) { return d.id; });

            words.enter().append('text')
                .text(me.nodeLabel)
                .attr('x', function(d, i) { return d.x + me.nodeRadius; })
                .attr('y', function(d, i) { return d.y - me.nodeRadius; })
                .attr('class', 'node-label');

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

                words
                    .attr('x', function(d, i) { return d.x + me.nodeRadius; })
                    .attr('y', function(d, i) { return d.y - me.nodeRadius; });

            });

            //Other elements
            //--------------

            grefresh.on('click', function() {
                    var firstData = {
                        root: data.root,
                        nodes: data.nodes.filter(function(d) { return d.__first; }),
                        links: data.links.filter(function(d) { return d.__first; })
                    };
                    div.data([firstData]).call(chart);
               });

            gZoomContainer.select('.zoom-in-button').call(zooming);

            gZoomContainer.select('.zoom-out-button').on('click', function() { console.log('Zooming out!'); });



        });
    }


    chart.init = function(selection) {
        selection.each(function(data) {

            var initial = selection;

            var svgEnter = d3.select(this),
                gcont = svgEnter.append('g').attr('class', 'network-chart');

            // Add a background group and rectangle
            gcont.append('g')
                .attr('class', 'background')
                .append('rect')
                .attr('width', me.width)
                .attr('height', me.height)
                .attr('class', 'background');

            var graphcont = gcont.append('g').attr('class','graph');
            graphcont.append('g').attr('class', 'links');
            graphcont.append('g').attr('class', 'nodes');
            graphcont.append('g').attr('class', 'labels');

            //Refresh button
            var gRefreshButton = gcont.append('g')
                                .attr('class','refresh-button')
                                .attr('transform', 'translate(' +  [10, 10] +')');

            var RefreshCircle = gRefreshButton.append('circle')
                                .attr('class','refresh-button')
                                .attr('cx',10)
                                .attr('cy',10)
                                .attr('r',10)
                                .attr('stroke','black')
                                .attr('stroke-width',2)
                                .attr('cursor','pointer');

            var RefreshIcon = gRefreshButton.append('text')
                                .attr('class','refresh-button-arrow')
                                .attr('x',4)
                                .attr('y',15)
                                .attr('cursor','pointer')
                                .attr('font-family', 'FontAwesome')
                                .text('\uf0e2' );

            //Zoom button


            var gZoom = gcont.append('g')
                            .attr('class','zoom-container')
                            .attr('transform', 'translate(' + [13,70] + ')');

            var gZoomIn = gZoom.append('text')
                            .attr('class','zoom-in-button')
                            .attr('cursor','pointer')
                            .attr('font-family','FontAwesome')
                            .attr('font-size',17)
                            .text('\uf0fe');

            var gZoomOut = gZoom.append('text')
                            .attr('class','zoom-out-button')
                            .attr('cursor','pointer')
                            .attr('y',30)
                            .attr('font-family','FontAwesome')
                            .attr('font-size',17)
                            .text('\uf146');

            // Brand
            // -----
            var gBrand = gcont.append('g')
                .attr('class', 'brand')
                .attr('transform', 'translate(' + [me.width - 4, me.height - 4] + ')');

            var brandLabel = gBrand.append('a')
                .attr('xlink:href', 'http://www.masega.co')
                .append('text')
                .attr('class', 'masega-brand')
                .attr('text-anchor', 'end')
                .text('masega.co');

            var gNodeUrl = gcont.append('g')
                .attr('class','url-container')
                .attr('transform','translate(' + [10, me.height - 8] +')');

            var gNodeLink = gNodeUrl.append('a')
                .attr('class', 'url-container');

            gNodeLink
                .append('text')
                .attr('class', 'url-container-icon')
                .text('\uf0c1');

            gNodeLink
                .append('text')
                .attr('x', 20)
                .attr('class', 'url-container')
                .text('');

        });
    };


    // Accessor Methods

    // Generate Accessor Methods
    function createAccessor(attr) {
        return function(value) {
            if (!arguments.length) { return me[attr]; }
            me[attr] = value;
            return chart;
        };
    }

    for (var attr in me) {
        if ((!chart[attr]) && (me.hasOwnProperty(attr))) {
            chart[attr] = createAccessor(attr);
        }
    }

    return chart;
};