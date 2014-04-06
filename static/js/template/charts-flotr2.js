$(function () {

    Flotr.defaultOptions.mouse.lineColor = '#3498db';

    // Line Chart
    function drawLineChart () {
        var d1, d2, i;

        d1 = [
            [0, 3],
            [4, 8],
            [6, 6],
            [8, 5],
            [9, 13],
            [11, 15],
            [12, 12],
            [13, 12],
            [13.5, 11]
        ];
        d2 = [];

        // Generate first data set
        for (i = 0; i < 14; i += 0.5) {
            d2.push([i, Math.sin(i)]);
        }

        Flotr.draw(document.getElementById("flotr2Line"), [ d1, d2 ], {
            colors: ['#2980b9', '#1abc9c'],
            shadowSize: 0,
            fontColor: '#34495e',
            xaxis: {
                minorTickFreq: 0,
                color: '#95a5a6'
            },
            yaxis: {
                color: '#95a5a6'
            },
            grid: {
                minorVerticalLines: true,
                outlineWidth: 1,
                color: '#ecf0f1',
                labelMargin: 7
            },
            mouse: {
                track: true
            }
        });
    }


    // Basic Axis Example Chart
    function drawAxisChart () {
        var d1, d2, d3, d4, d5, i, ticks;

        d1 = [];
        d2 = [];
        d3 = [];
        d4 = [];
        d5 = [];
        ticks = [
            [ 0, "Lower"],
            10,
            20,
            30,
            [40, "Upper"]
        ];

        for(i = 0; i <= 10; i += 0.1){
            d1.push([i, 4 + Math.pow(i,1.5)]);
            d2.push([i, Math.pow(i,3)]);
            d3.push([i, i*5+3*Math.sin(i*4)]);
            d4.push([i, i]);
            if( i.toFixed(1)%1 == 0 ){
                d5.push([i, 2*i]);
            }
        }

        d3[30][1] = null;
        d3[31][1] = null;

        function ticksFn (n) { return '('+n+')'; }

        Flotr.draw(document.getElementById('flotr2BasicAxis'), [
            { data : d1, label : 'y = 4 + x^(1.5)', lines : { fill : true, fillOpacity: 0.15 } },
            { data : d2, label : 'y = x^3'},
            { data : d3, label : 'y = 5x + 3sin(4x)'},
            { data : d4, label : 'y = x'},
            { data : d5, label : 'y = 2x', lines : { show : true }, points : { show : true } }
        ], {
            colors: ['#bdc3c7', '#2980b9', '#1abc9c', '#34495e', '#c0392b'],
            shadowSize: 0,
            xaxis : {
                noTicks : 7,              // Display 7 ticks.
                tickFormatter : ticksFn,  // Displays tick values between brackets.
                min : 1,                  // Part of the series is not displayed.
                max : 7.5,                // Part of the series is not displayed.
                color: '#95a5a6'
            },
            yaxis : {
                ticks : ticks,            // Set Y-Axis ticks
                max : 40,                 // Maximum value along Y-Axis
                color: '#95a5a6'
            },
            grid : {
                verticalLines : false,
                outlineWidth: 0,
                color: '#34495e',
                labelMargin: 7
            },
            legend : {
                position : 'nw',
                labelBoxBorderColor: '#ecf0f1',
                backgroundColor: '#ecf0f1',
                labelBoxWidth: 20,
                labelBoxHeight: 12
            },
            mouse: {
                track: true
            }
        });
    }


    // Bar Chart
    function drawBarChart () {
        var d1, d2, i, horizontal, point;

        d1 = [];
        d2 = [];

        horizontal = false;

        for (i = 0; i < 10; i++) {

            if (horizontal) {
                point = [Math.ceil(Math.random()*10), i];
            } else {
                point = [i, Math.ceil(Math.random()*10)];
            }

            d1.push(point);

            if (horizontal) {
                point = [Math.ceil(Math.random()*10), i+0.5];
            } else {
                point = [i+0.5, Math.ceil(Math.random()*10)];
            }

            d2.push(point);
        }

        Flotr.draw(
            document.getElementById('flotr2Bar'),
            [d1, d2],
            {
                colors: ['#16a085', '#34495e'],
                bars : {
                    show : true,
                    horizontal : horizontal,
                    shadowSize : 0,
                    barWidth : 0.5,
                    lineWidth: 0.8,
                    fillOpacity: 1
                },
                mouse : {
                    track : true,
                    relative : true
                },
                xaxis: {
                    color: '#95a5a6'
                },
                yaxis : {
                    min : 0,
                    autoscaleMargin : 1,
                    color: '#95a5a6'
                },
                grid: {
                    outlineWidth: 1,
                    color: '#ecf0f1'
                }
            }
        );
    }


    // Candle
    function drawCandle () {
        var d1, i, a, b, c,
            price = 3.206;

        d1 = [];

        for (i = 0; i < 50; i++) {
            a = Math.random();
            b = Math.random();
            c = (Math.random() * (a + b)) - b;
            d1.push([i, price, price + a, price - b, price + c]);
            price = price + c;
        }

        Flotr.draw(document.getElementById('flotr2Candle'), [ d1 ], {
            candles: {
                show : true,
                candleWidth : 0.6,
                shadowSize : 0,
                fillOpacity: 0.9,
                upFillColor: '#16a085',
                downFillColor: '#c0392b'
            },
            colors: ['#16a085', '#34495e'],
            xaxis: {
                noTicks : 10,
                color: '#95a5a6'
            },
            yaxis: {
                color: '#95a5a6'
            },
            grid: {
                outlineWidth: 1,
                color: '#ecf0f1'
            }
        });
    }


    // Stacked Bars Chart

    function drawStackedBarChart () {
        var d1, d2, d3, i;

        d1 = [];
        d2 = [];
        d3 = [];

        for (i = -10; i < 10; i++) {
            d1.push([i, Math.random()]);
            d2.push([i, Math.random()]);
            d3.push([i, Math.random()]);
        }

        Flotr.draw(document.getElementById('flotr2Stacked'),[
            { data : d1, label : 'Serie 1' },
            { data : d2, label : 'Serie 2' },
            { data : d3, label : 'Serie 3' }
        ], {
            colors: ['#2980b9', '#1abc9c', '#34495e'],
            legend : {
                position : 'nw',
                labelBoxMargin: 20,
                labelBoxBorderColor: '#ecf0f1',
                backgroundColor: '#ecf0f1',
                labelBoxWidth: 20,
                labelBoxHeight: 12
            },
            bars : {
                show : true,
                stacked : true,
                horizontal : false,
                barWidth : 0.6,
                lineWidth : 1,
                shadowSize : 0,
                fillOpacity: 0.9
            },
            grid : {
                verticalLines: false,
                outlineWidth: 0,
                color: '#34495e'
            },
            xaxis: {
                color: '#95a5a6'
            },
            yaxis: {
                color: '#95a5a6'
            }
        });
    }



    // Pie Chart
    function drawPieChart () {
        var d1, d2, d3, d4;

        d1 = [[0, 4]];
        d2 = [[0, 3]];
        d3 = [[0, 1.03]];
        d4 = [[0, 3.5]];

        Flotr.draw(document.getElementById('flotr2Pie'), [
            { data : d1, label : 'Comedy' },
            { data : d2, label : 'Action' },
            { data : d3, label : 'Romance',
                pie : {
                    explode : 50
                }
            },
            { data : d4, label : 'Drama' }
        ], {
            HtmlText : false,
            colors: ['#16a085', '#2980b9', '#34495e', '#bdc3c7'],
            grid : {
                verticalLines : false,
                horizontalLines : false,
                outlineWidth: 0
            },
            xaxis: {
                showLabels : false
            },
            yaxis: {
                showLabels : false
            },
            pie : {
                show : true,
                explode : 6,
                shadowSize: 0,
                fillOpacity: 0.9
            },
            mouse : { track : true },
            legend : {
                position : 'se',
                labelBoxBorderColor: '#ecf0f1',
                backgroundColor: '#ecf0f1',
                labelBoxWidth: 20,
                labelBoxHeight: 12
            }
        });
    }



    // Radar Chart
    function drawRadarChart () {
        var s1 = { label : 'Actual', data : [[0, 3], [1, 8], [2, 5], [3, 5], [4, 3], [5, 9]] },
            s2 = { label : 'Target', data : [[0, 8], [1, 7], [2, 8], [3, 2], [4, 4], [5, 7]] },
            ticks;

        // Radar Labels
        ticks = [
            [0, "Statutory"],
            [1, "External"],
            [2, "Videos"],
            [3, "Yippy"],
            [4, "Management"],
            [5, "oops"]
        ];

        Flotr.draw(document.getElementById('flotr2Radar'), [ s1, s2 ], {
            colors: ['#34495e', '#1abc9c'],
            radar: { show : true},
            grid: { circular : true, minorHorizontalLines : true},
            yaxis: { min : 0, max : 10, minorTickFreq : 2},
            xaxis: { ticks : ticks},
            legend: {
                labelBoxBorderColor: '#ecf0f1',
                backgroundColor: '#ecf0f1'
            }
        });
    }



    // Bubble chart
    function drawBubbleChart () {
        var d1, d2, i, point;

        d1 = [];
        d2 = [];

        for (i = 0; i < 10; i++ ){
            point = [i, Math.ceil(Math.random()*10), Math.ceil(Math.random()*10)];
            d1.push(point);

            point = [i, Math.ceil(Math.random()*10), Math.ceil(Math.random()*10)];
            d2.push(point);
        }

        Flotr.draw(document.getElementById('flotr2Bubble'), [d1, d2], {
            colors: ['#3498db', '#1abc9c'],
            bubbles: { show : true, baseRadius : 5 },
            xaxis: { min : -4, max : 14 },
            yaxis: { min : -4, max : 14 },
            grid: { outlineWidth: 0 }
        });
    }



    // Time Series
    function drawTimeSeries () {
        var start = new Date("2009/01/01 01:00").getTime(),
            d1, i, x;

        d1 = [];

        for (i = 0; i < 100; i++) {
            x = start+(i*1000*3600*24*36.5);
            d1.push([x, i+Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10]);
        }

        var options = {
            xaxis : {
                mode : 'time',
                labelsAngle : 45
            },
            selection : {
                mode : 'x'
            },
            HtmlText : false,
            grid: { outlineWidth: 0 }
        };

        var container = document.getElementById('flotr2Time');

        // Draw graph with default options, overwriting with passed options
        function drawGraph (opts) {

            // Clone the options, so the 'options' variable always keeps intact.
            o = Flotr._.extend(Flotr._.clone(options), opts || {});

            // Return a new graph.
            return Flotr.draw(
                container,
                [ d1 ],
                o
            );
        }

        drawGraph();

        Flotr.EventAdapter.observe(container, 'flotr:select', function(area){
            // Draw selected area
            drawGraph({
                xaxis : { min : area.x1, max : area.x2, mode : 'time', labelsAngle : 45 },
                yaxis : { min : area.y1, max : area.y2 }
            });
        });

        // When graph is clicked, draw the graph with default area.
        Flotr.EventAdapter.observe(container, 'flotr:click', function () { drawGraph(); });
    }



    // Drawing all the graphs on window resize
    $(window).resize(function() {
        drawLineChart();
        drawAxisChart();
        drawCandle();
        drawBarChart();
        drawStackedBarChart();
        drawPieChart();
        drawRadarChart();
        drawBubbleChart();
        drawTimeSeries();
    });

    // Triggering window resize for initial draw
    $(window).trigger('resize');

});
