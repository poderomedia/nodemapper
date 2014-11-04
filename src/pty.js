/* globals d3:false */

var pty = {
    version: '0.2.2'  // semver
};

// SVG Transformations
// -------------------
pty.svg = {};

// SVG Translation
pty.svg.translate = function(dx, dy) {
    if ((arguments.length === 1) && (dx.length === 2)) {
        dy = dx[1]; dx = dx[0];
    }

    return 'translate(' + [dx, dy] + ')';
};

// SVG Scale
pty.svg.scale = function(sx, sy) {
    if (arguments.length < 2) { sy = sx; }
    return 'scale(' + [sx, sy] + ')';
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
        friction: 0.6,
        linkStrength: 0.2,
        linkDistance: 120,
        nodeClass: function(d, i) { return ''; },
        nodeBaseURL: function(d) { return ''; },
        nodeURL: function(d) { return ''; },
        nodeLabel: function(d, i) { return ''; },
        fixCenter: true,
        duration: 2000,
        delay: 200,
        zoomExtent: [0.5, 8],
        controlsPosition: [10, 10],
        refreshCallback: true,
        zoomInCallback: true,
        zoomOutCallback: true,
        embedCallback: false,
        fullscreenCallback: false,
        zoomBehavior: d3.behavior.zoom(),
        legendItems: false,
        legend: {width: 80, margin: {top: 15, right: 10}}
    };

    // Flag to know if the network chart has been drawn
    var initialData = false;
    // Flag to know if we are in fullscreen mode
    var isScreenFull = false;
    // Charting Function
    function chart(selection) {
        selection.each(function(data) {

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]),
                svgEnter = svg.enter().append('svg').call(chart.init);

            var gContainer = svg.select('g.network-chart'),
                gBackground = gContainer.select('g.background'),
                gLegend = gContainer.select('g.legend'),
                gControls = gContainer.select('g.controls'),
                gZoomCont = gContainer.select('g.zoom-container'),
                gChart = gZoomCont.select('g.network'),
                gLinks = gChart.select('g.links'),
                gNodes = gChart.select('g.nodes'),
                gLabels = gChart.select('g.labels'),
                gNodeUrl = gControls.select('g.url-container'),
                nodeUrlLabel = gNodeUrl.select('text.url-container'),
                nodeUrlLink = gNodeUrl.select('a.url-container');

            // Controls
            var gControlRefresh = gControls.select('g.control-item.refresh'),
                gControlZoomIn = gControls.select('g.control-item.zoom-in'),
                gControlZoomOut = gControls.select('g.control-item.zoom-out'),
                gControlEmbed = gControls.select('g.control-item.embed'),
                gControlFullscreen = gControls.select('g.control-item.fullscreen');

            // Process the data to remove duplicate links
            var networkData = chart.parseNetworkData(data);

            // Toggle the icon on fullscreen
            if (isScreenFull) {
                gControlFullscreen.select('text').text('\uf066');
            } else {
                gControlFullscreen.select('text').text('\uf065');
            }

            // Zoom Behavior
            // ------------

            // Mouse zoom callback
            function onZoom() {
                var d = d3.event.translate,
                    s = d3.event.scale;
                gChart.attr('transform', pty.svg.translate(d) + pty.svg.scale(s));
            }

            // Configure the zoom behavior
            me.zoomBehavior
                .scaleExtent(me.zoomExtent)
                .on('zoom', onZoom);

            // Apply the current zoom scale and translation
            gChart
                .attr('transform', pty.svg.translate(me.zoomBehavior.translate()) + pty.svg.scale(me.zoomBehavior.scale()));


            // Bind the zoom behavior to the background rectangle
            gBackground.select('rect.background').call(me.zoomBehavior);

            // The click callback requests the network of the clicked node
            function onClick(d, i) {
                d3.json(me.nodeBaseURL(d), function(error, nodeData) {
                    var olddata;

                    if (!error) {
                        olddata = div.data()[0];
                        olddata.nodes = olddata.nodes.concat(nodeData.nodes);
                        olddata.links = olddata.links.concat(nodeData.links);

                        div.data([olddata]).call(chart);
                    }
                });

                d.isclick = false;
            }


            // Force layout
            // ------------

            // Configure and start the force layout
            var force = d3.layout.force()
                .charge(me.charge)
                .friction(me.friction)
                .linkStrength(me.linkStrength)
                .size([me.width, me.height])
                .nodes(networkData.nodes)
                .links(networkData.links)
                .start();

            for (var k = 0; k < 250; k += 1) {
                if (force.alpha() > 0.05) {
                    force.tick();
                }
            }

            // Set the label to the root node
            if (!svgEnter.empty()) {
                nodeUrlLink.attr('xlink:href', me.nodeURL(networkData.rootNode));
                nodeUrlLabel.text(me.nodeLabel(networkData.rootNode));
            }

            // Graphic Elements
            // ----------------

            // Links
            // -----

            var links = gLinks.selectAll('line.link')
                .data(force.links(), function(d) { return d.linkID; });

            links.enter().append('line')
                .attr('class', 'link')
                .classed('center-link', function(d) {
                    return (d.from === networkData.root) || (d.to === networkData.root);
                });

            // Remove unused links
            links.exit().remove();

            // Nodes
            // -----

            var circles = gNodes.selectAll('circle.node')
                .data(force.nodes(), function(d) { return d.id; });

            // Update
            circles.classed('node-clickable', function(d) { return d.isclick; });

            circles.enter().append('circle')
                .attr('class', function(d, i) { return me.nodeClass(d, i) + ' node'; })
                .attr('r', me.nodeRadius)
                .classed('node', true)
                .classed('node-center', function(d) { return d.id === data.root; })
                .classed('node-clickable', function(d) { return (d.id !== data.root) && (d.isclick); })
                .on('mouseover', function(d) { d3.select(this).classed('node-highlight', true); })
                .on('mouseout', function(d) { d3.select(this).classed('node-highlight', false); })
                .on('click', function(d, i) {
                    if (d3.select(this).classed('node-clickable')) { onClick(d, i); }
                    // Update the title and link of the lower left label
                    nodeUrlLink.attr('xlink:href', me.nodeURL(d));
                    nodeUrlLabel.text('' + me.nodeLabel(d));
                });

            // Add the class has-conflict if the attribute exists
            circles.classed('has-conflict', function(d) {
                return ((d.hasOwnProperty('has_conflict')) && (d.has_conflict === true));
            });

            circles.call(force.drag);

            // Drop the circles on exit
            circles.exit().transition()
                .delay(me.delay)
                .duration(me.duration)
                .attr('cy', me.width)
                .remove();

            // Labels
            // ------

            // Select the labels
            var nodeLabels = gLabels.selectAll('text.node-label')
                .data(force.nodes(), function(d) { return d.id; });

            // Append the text elements on enter
            nodeLabels.enter().append('text')
                .text(me.nodeLabel)
                .attr('x', function(d, i) { return d.x + me.nodeRadius; })
                .attr('y', function(d, i) { return d.y - me.nodeRadius; })
                .attr('class', 'node-label');

            // Remove the labels on exit
            nodeLabels.exit().remove();

            // Update the position of nodes, labels and links on each tick event
            // of the force layout.
            force.on('tick', function() {
                links
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                circles
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });

                nodeLabels
                    .attr('x', function(d, i) { return d.x + me.nodeRadius; })
                    .attr('y', function(d, i) { return d.y - me.nodeRadius; });
            });

            // Control Callbacks
            //------------------

            // Refresh
            gControlRefresh
                .on('mouseover', function(d) { d3.select(this).classed('control-highlight','true'); })
                .on('mouseout', function(d) { d3.select(this).classed('control-highlight','false'); })
                .on('click', function() {
                    var firstData = {
                        root: data.root,
                        nodes: data.nodes.filter(function(d) { return d.__first; }),
                        links: data.links.filter(function(d) { return d.__first; })
                    };
                    div.data([firstData]).call(chart);
                });

            // Zoom In
            gControlZoomIn
                .on('mouseover', function(d) { d3.select(this).classed('control-highlight','true'); })
                .on('mouseout', function(d) { d3.select(this).classed('control-highlight','false'); })
                .on('click', function() {
                    // Compute the new zoom level and update the zoom behavior
                    var newScale = d3.min([me.zoomBehavior.scale() + 0.2, me.zoomExtent[1]]),
                        translate = pty.svg.translate(me.zoomBehavior.translate());

                    me.zoomBehavior.scale(newScale);

                    // Scale the chart group
                    gChart.transition().duration(me.duration)
                        .attr('transform', translate + pty.svg.scale(newScale));
                });

            // Zoom Out
            gControlZoomOut
                .on('mouseover', function(d) { d3.select(this).classed('control-highlight','true'); })
                .on('mouseout', function(d) { d3.select(this).classed('control-highlight','false'); })
                .on('click', function() {
                    // Compute the new zoom level and update the zoom behavior
                    var newScale = d3.max([me.zoomBehavior.scale() - 0.2, me.zoomExtent[0]]),
                        translate = pty.svg.translate(me.zoomBehavior.translate());

                    me.zoomBehavior.scale(newScale);

                    // Scale the chart group
                    gChart.transition().duration(me.duration)
                        .attr('transform', translate + pty.svg.scale(newScale));
                });

            // Embed
            if (me.embedCallback) {
                gControlEmbed
                .on('mouseover', function(d) { d3.select(this).classed('control-highlight','true'); })
                .on('mouseout', function(d) { d3.select(this).classed('control-highlight','false'); })
                .on('click', me.embedCallback);
            } else {
                gControlEmbed.remove();
            }

            // Fullscreen
            if (me.fullscreenCallback) {
                gControlFullscreen
                .on('mouseover', function(d) { d3.select(this).classed('control-highlight','true'); })
                .on('mouseout', function(d) { d3.select(this).classed('control-highlight','false'); })
                .on('click',  function() {
                    isScreenFull = !isScreenFull;
                    d3.select(this).call(me.fullscreenCallback);
                });
            } else {
                gControlFullscreen.remove();
            }
        });
    }


    chart.init = function(selection) {
        selection.each(function(data) {

            var svgEnter = d3.select(this),
                gContainer = svgEnter.append('g').attr('class', 'network-chart'),
                gBackground = gContainer.append('g').attr('class', 'background'),
                gBrand = gContainer.append('g').attr('class', 'brand'),
                gZoomCont = gContainer.append('g').attr('class', 'zoom-container'),
                gControls = gContainer.append('g').attr('class', 'controls'),
                gChart = gZoomCont.append('g').attr('class', 'network'),
                gLegend = gContainer.append('g').attr('class','legend');

            // Set the SVG element width and height
            svgEnter.attr('width', me.width).attr('height', me.height);

            // Background
            gBackground.append('rect')
                .attr('width', me.width)
                .attr('height', me.height)
                .attr('class', 'background');

            // Nodes, Links and Labels
            gChart.append('g').attr('class', 'links');
            gChart.append('g').attr('class', 'nodes');
            gChart.append('g').attr('class', 'labels');

            // Controls
            // --------

            gControls
                .attr('transform', pty.svg.translate(me.controlsPosition));

            // Refresh Button
            var controls = [
                {name: 'refresh',    icon: '\uf0e2', callback: me.refreshCallback},
                {name: 'zoom-in',    icon: '\uf067', callback: me.zoomInCallback},
                {name: 'zoom-out',   icon: '\uf068', callback: me.zoomOutCallback},
                {name: 'embed',      icon: '\uf121', callback: me.embedCallback},
                {name: 'fullscreen', icon: '\uf065', callback: me.fullscreenCallback}
            ];

            var activeControls = controls.filter(function(d) {
                return d.callback;
            });

            // Controls Scale
            var yScale = d3.scale.ordinal()
                .domain(d3.range(activeControls.length))
                .rangeBands([0, 30 * activeControls.length], 0.1);

            var bgSize = yScale.rangeBand();

            var gControlItem = gControls.selectAll('g.control-item')
                .data(activeControls);

            gControlItem.enter().append('g')
                .attr('class', function(d) { return 'control-item ' + d.name; })
                .attr('transform', function(d, i) { return pty.svg.translate(0, yScale(i)); });

            gControlItem.append('rect')
                .attr('width', bgSize)
                .attr('height', bgSize)
                .attr('rx', 0.25 * bgSize)
                .attr('ry', 0.25 * bgSize);

            var iconLabel = gControlItem.append('text')
                .attr('class', function(d) { return d.name; })
                .attr('font-family', 'FontAwesome')
                .attr('fill', 'white')
                .text(function(d) { return d.icon; });

            iconLabel
                .attr('x', function() { return 0.5 * (bgSize - this.getBBox().width) - 1; })
                .attr('y', function() { return 0.5 * (bgSize + this.getBBox().height) - 2; });

            // Brand
            // -----
            gBrand.attr('transform', pty.svg.translate(me.width - 4, me.height - 4));

            var brandLabel = gBrand.append('a')
                .attr('xlink:href', 'http://www.masega.co')
                .append('text')
                .attr('class', 'masega-brand')
                .attr('text-anchor', 'end')
                .text('masega.co');

            // Node Label and Link
            // -------------------
            var gNodeUrl = gControls.append('g')
                .attr('class','url-container')
                .attr('transform', pty.svg.translate(10, me.height - 16));

            // Link
            var gNodeLink = gNodeUrl.append('a')
                .attr('class', 'url-container');

            // Icon
            gNodeLink.append('text')
                .attr('class', 'url-container-icon')
                .text('\uf0c1');

            // Label
            gNodeLink.append('text')
                .attr('x', 20)
                .attr('class', 'url-container')
                .text('');

            // Legend
            var legendX = me.width - me.legend.width - me.legend.margin.right,
                legendY = me.legend.margin.top;

            gLegend.attr('transform', pty.svg.translate(legendX, legendY));

            var gLegendItems = gLegend.selectAll('g.legend-item')
                .data(me.legendItems);

            var legendScale = d3.scale.ordinal()
                .domain(d3.range(me.legendItems.length))
                .rangePoints([0, 15 * me.legendItems.length]);

            gLegendItems.enter().append('g')
                .attr('class', 'legend-item')
                .attr('transform', function(d, i) {
                    return pty.svg.translate(0, legendScale(i));
                });

            gLegendItems.append('circle')
                .attr('r', 6)
                .attr('class', function(d) { return d.type; });

            var legendItemLabel = gLegendItems.append('text')
                .attr('class', 'legend-label')
                .attr('x', 10)
                .text(function(d) { return d.name; });

            legendItemLabel
                .attr('y', function() { return 0.35 * this.getBBox().height; });

        });
    };

    chart.parseNetworkData = function(jsonData) {

        var data = {
            root: jsonData.root,
            rootNode: null,
            nodes: [],
            links: []
        };

        if (!initialData) {
            jsonData.nodes.forEach(function(d) { d.__first = true; });
            jsonData.links.forEach(function(d) { d.__first = true; });
            initialData = true;
        }

        var idxNodes = {},
            idxLinks = {},
            k = 0;

        // Identify unique nodes and construct a dictionary of indices
        jsonData.nodes.forEach(function(d) {
            if (!idxNodes.hasOwnProperty(d.id)) {
                idxNodes[d.id] = k;
                k += 1;
                data.nodes.push(d);
            }
        });

        data.nodes.forEach( function(d) { d.internalcn = 0; });

        // Identify unique links and set the source and target of each one
        k = 0;
        jsonData.links.forEach(function(d) {

            d.source = Math.min(idxNodes[d.from], idxNodes[d.to]);
            d.target = Math.max(idxNodes[d.from], idxNodes[d.to]);
            d.linkID = d.source + '-' + d.target;

            if (!idxLinks.hasOwnProperty(d.linkID)) {
                idxLinks[d.linkID] = k;
                data.links.push(d);
                data.nodes[idxNodes[d.from]].internalcn += 1;
                data.nodes[idxNodes[d.to]].internalcn += 1;
                k += 1;
            }
        });

        data.nodes.forEach( function(d) { d.isclick = (d.internalcn < d.numcn); });

        // Set the position of the root node and fix it to the center
        data.nodes.forEach(function(d) {
            if (d.id === data.root) {
                d.x = me.width / 2;
                d.y = me.height / 2;
                d.fixed = me.fixCenter;
                data.rootNode = d;
            }
        });

        return data;
    };

    // Accessor Methods
    // ----------------

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