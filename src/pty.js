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
        // onClick: function(d, i) {},
        nodeClass: function(d, i) { return ''; },
        nodeBaseURL: function(d) { return ''; },
        chartURL: function(d) { return ''; },
        nodeLabel: function(d, i) { return ''; },
        fixCenter: true,
        initialData: {} //Implement 'DO NOTHING' if left undefined
    };


    // Charting Function
    function chart(selection) {
        selection.each(function(data) {

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]);

            // Data Preprocessing
            // ------------------

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

            function printURL(d, i) {
                var myURL = me.chartURL(d);
                console.log(myURL);
                return myURL;
            }


            // Initialization
            // --------------

            // Initialize the SVG element
            var svgEnter = svg.enter().append('svg')
                .attr('width', me.width)
                .attr('height', me.height)
                .call(chart.init);

            var g = svg.select('g.network-chart'),
                glinks = g.select('g.links'),
                gnodes = g.select('g.nodes'),
                glabels = g.select('g.labels'),
                gbrand = g.select('g.brand'),
               // gnodeURL = g.select('g.nodeURL'),
                grefresh = g.select('g.button');


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
                        gnodeurl.selectAll('text').remove();
                        gnodeurl.append('text').attr('text-anchor','start').text(printURL(d));
                    }
                    else {
                    gnodeurl.selectAll('text').remove();
                    gnodeurl.append('text').attr('text-anchor','start').text(printURL(d)); //URL does not update properly.
                }
                });



            circles.call(force.drag);

            circles.exit().remove();

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
            var gbutton = g.append('g')
               .attr('class','button')
               .attr('transform','translate(' +  [10,10] +')');

            //Refresh button
            var refreshButton = gbutton.append('circle')
                                   .attr('cx',10)
                                   .attr('cy',10)
                                   .attr('r',10)
                                   .attr('fill','white')
                                   .attr('stroke','black')
                                   .attr('stroke-width',2)
                                   .attr('cursor','pointer')
                                   .on('click', function() {

                                    d3.json(me.initialData, function(error,data) {
                                        div.data([data]).call(chart);
                                    })

                                   } );

             gbutton.append('text')
                .attr('x',4)
                .attr('y',15)
                .attr('cursor','pointer')
                .attr('font-family', 'FontAwesome')
                .text('\uf0e2' )
                .on('click', function() {

                                    d3.json(me.initialData, function(error,data) {
                                        div.data([data]).call(chart);
                                    })

                                   } );

            //Container for the url
            var gnodeurl = svgEnter.append('g')
                            .attr('class','urlcontainer')
                            .attr('transform','translate(' + [4, me.height -8 ] +')');

            gnodeurl.append('text').attr('text-anchor','start').text("Hi five!");

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

            gcont.append('g').attr('class', 'links');
            gcont.append('g').attr('class', 'nodes');
            gcont.append('g').attr('class', 'labels');

            var gbrand = gcont.append('g')
                .attr('class', 'brand')
                .attr('transform', 'translate(' + [me.width - 4, me.height - 4] + ')');

            var brandLabel = gbrand.append('a')
                .attr('xlink:href', 'http://www.masega.co')
                .append('text')
                .attr('class', 'masega-brand')
                .attr('text-anchor', 'end')
                .text('masega.co');

            // var gnodeurl = gcont.append('g')
            //                 .attr('class','urlcontainer')
            //                 .attr('transform','translate(' + [4, me.height -8 ] +')');

            // var gprintnodeurl = gnodeurl.append('a')
            //                 .attr('xlink:href', me.chartURL(this))
            //                 .append('text')
            //                 .attr('text-anchor','start')
            //                 .text("hola");

            // var gbutton = gcont.append('g')
            //    .attr('class','button')
            //    .attr('transform','translate(' +  [10,10] +')');

            // var refreshButton = gbutton.append('rect')
            //                        .attr('width',20)
            //                        .attr('height',20)
            //                        .attr('fill','black')
            //                        .on('click', function() { gcont.data([initialData]).call(chart); } );

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