$(function () {

    // Piecon

    (function initPiecon() {
        var count = 0;
        Piecon.setOptions({fallback: 'force'});
        var i = setInterval(function(){
          if (++count > 100) { count = 0; }
          Piecon.setProgress(count);
        }, 400);
    })();


    // Peity Charts

    $.fn.peity.defaults.line.fill = 'rgba(189, 195, 199, 0.2)';
    $.fn.peity.defaults.line.stroke = 'rgb(52, 73, 94)';
    $.fn.peity.defaults.bar.fill = ['#3498db'];
    $.fn.peity.defaults.pie.fill = ['rgb(22, 160, 133)', 'rgb(26, 188, 156)', 'rgb(39, 174, 96)', 'rgb(46, 204, 113)'];

    $('.pie').peity("pie");
    $('.line').peity("line");
    $('.bar').peity("bar");


    // xCharts

    var data = [{"xScale":"ordinal","comp":[],"main":[{"className":".main.l1","data":[{"y":15,"x":"2012-11-19T00:00:00"},{"y":11,"x":"2012-11-20T00:00:00"},{"y":8,"x":"2012-11-21T00:00:00"},{"y":10,"x":"2012-11-22T00:00:00"},{"y":1,"x":"2012-11-23T00:00:00"},{"y":6,"x":"2012-11-24T00:00:00"},{"y":8,"x":"2012-11-25T00:00:00"}]},{"className":".main.l2","data":[{"y":29,"x":"2012-11-19T00:00:00"},{"y":33,"x":"2012-11-20T00:00:00"},{"y":13,"x":"2012-11-21T00:00:00"},{"y":16,"x":"2012-11-22T00:00:00"},{"y":7,"x":"2012-11-23T00:00:00"},{"y":18,"x":"2012-11-24T00:00:00"},{"y":8,"x":"2012-11-25T00:00:00"}]}],"type":"line-dotted","yScale":"linear"},{"xScale":"ordinal","comp":[],"main":[{"className":".main.l1","data":[{"y":12,"x":"2012-11-19T00:00:00"},{"y":18,"x":"2012-11-20T00:00:00"},{"y":8,"x":"2012-11-21T00:00:00"},{"y":7,"x":"2012-11-22T00:00:00"},{"y":6,"x":"2012-11-23T00:00:00"},{"y":12,"x":"2012-11-24T00:00:00"},{"y":8,"x":"2012-11-25T00:00:00"}]},{"className":".main.l2","data":[{"y":29,"x":"2012-11-19T00:00:00"},{"y":33,"x":"2012-11-20T00:00:00"},{"y":13,"x":"2012-11-21T00:00:00"},{"y":16,"x":"2012-11-22T00:00:00"},{"y":7,"x":"2012-11-23T00:00:00"},{"y":18,"x":"2012-11-24T00:00:00"},{"y":8,"x":"2012-11-25T00:00:00"}]}],"type":"cumulative","yScale":"linear"},{"xScale":"ordinal","comp":[],"main":[{"className":".main.l1","data":[{"y":12,"x":"2012-11-19T00:00:00"},{"y":18,"x":"2012-11-20T00:00:00"},{"y":8,"x":"2012-11-21T00:00:00"},{"y":7,"x":"2012-11-22T00:00:00"},{"y":6,"x":"2012-11-23T00:00:00"},{"y":12,"x":"2012-11-24T00:00:00"},{"y":8,"x":"2012-11-25T00:00:00"}]},{"className":".main.l2","data":[{"y":29,"x":"2012-11-19T00:00:00"},{"y":33,"x":"2012-11-20T00:00:00"},{"y":13,"x":"2012-11-21T00:00:00"},{"y":16,"x":"2012-11-22T00:00:00"},{"y":7,"x":"2012-11-23T00:00:00"},{"y":18,"x":"2012-11-24T00:00:00"},{"y":8,"x":"2012-11-25T00:00:00"}]}],"type":"bar","yScale":"linear"}];
    var order = [0, 1, 0, 2],
        i = 0,
        xFormat = d3.time.format('%A'),
        chart = new xChart('line-dotted', data[order[i]], '#xchart', {
            axisPaddingTop: 5,
            dataFormatX: function (x) {
                return new Date(x);
            },
            tickFormatX: function (x) {
                return xFormat(x);
            },
            timing: 1250
        }),
        rotateTimer,
        t = 3500;

    function updateChart(i) {
        var d = data[i];
        chart.setData(d);
        return d;
    }

    function rotateChart() {
        i += 1;
        i = (i >= order.length) ? 0 : i;
        updateChart(order[i]);
        rotateTimer = setTimeout(rotateChart, t);
    }
    rotateTimer = setTimeout(rotateChart, t);


    // Sparkline

    function drawSparklines() {

        // Bar + line composite charts
        var compositebar = $('#compositebar');
        compositebar.sparkline('html', { type: 'bar', barColor: '#aaf' });
        compositebar.sparkline([4,1,5,7,9,9,8,7,6,6,4,7,8,4,3,2,2,5,6,7],
            { composite: true, fillColor: false, lineColor: '#16a085' });


        // Line charts taking their values from the tag
        $('.sparkline').sparkline();

        // Larger line charts for the docs
        $('.largeline').sparkline('html',
            { type: 'line', height: '2.5em', width: '4em' });

        // Customized line chart
        $('#linecustom').sparkline('html',
            {height: '1.5em', width: '8em', lineColor: '#f00', fillColor: '#ffa',
            minSpotColor: false, maxSpotColor: false, spotColor: '#77f', spotRadius: 3});

        // Bar charts using inline values
        $('.sparkbar').sparkline('html', {type: 'bar'});

        $('.barformat').sparkline([1, 3, 5, 3, 8], {
            type: 'bar',
            tooltipFormat: '{{value:levels}} - {{value}}',
            tooltipValueLookups: {
                levels: $.range_map({ ':2': 'Low', '3:6': 'Medium', '7:': 'High' })
            }
        });

        // Tri-state charts using inline values
        $('.sparktristate').sparkline('html', {type: 'tristate'});
        $('.sparktristatecols').sparkline('html',
            {type: 'tristate', colorMap: {'-2': '#bdc3c7', '2': '#95a5a6'} });

        // Composite line charts, the second using values supplied via javascript
        var compositeline = $('#compositeline');
        compositeline.sparkline('html', { fillColor: false, changeRangeMin: 0, chartRangeMax: 10 });
        compositeline.sparkline([4,1,5,7,9,9,8,7,6,6,4,7,8,4,3,2,2,5,6,7],
            { composite: true, fillColor: false, lineColor: '#2980b9', changeRangeMin: 0, chartRangeMax: 10 });

        // Line charts with normal range marker
        $('#normalline').sparkline('html',
            { fillColor: false, normalRangeMin: -1, normalRangeMax: 8 });

        // Discrete charts
        $('.discrete1').sparkline('html',
            { type: 'discrete', lineColor: '#3498db', xwidth: 18 });
        $('#discrete2').sparkline('html',
            { type: 'discrete', lineColor: '#3498db', thresholdColor: '#8e44ad', thresholdValue: 4 });

        // Bullet charts
        $('.sparkbullet').sparkline('html', { type: 'bullet' });

        // Pie charts
        $('.sparkpie').sparkline('html', { type: 'pie', height: '1.0em' });

        // Box plots
        $('.sparkboxplot').sparkline('html', { type: 'box'});
        $('.sparkboxplotraw').sparkline([ 1, 3, 5, 8, 10, 15, 18 ],
            {type:'box', raw: true, showOutliers:true, target: 6});

    }

    function drawMouseSpeedDemo() {
        var mrefreshinterval = 500; // update display every 500ms
        var lastmousex=-1;
        var lastmousey=-1;
        var lastmousetime;
        var mousetravel = 0;
        var mpoints = [];
        var mpoints_max = 30;
        $('html').mousemove(function(e) {
            var mousex = e.pageX;
            var mousey = e.pageY;
            if (lastmousex > -1) {
                mousetravel += Math.max( Math.abs(mousex-lastmousex), Math.abs(mousey-lastmousey) );
            }
            lastmousex = mousex;
            lastmousey = mousey;
        });
        var mdraw = function() {
            var md = new Date();
            var timenow = md.getTime();
            if (lastmousetime && lastmousetime!=timenow) {
                var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
                mpoints.push(pps);
                if (mpoints.length > mpoints_max)
                    mpoints.splice(0,1);
                mousetravel = 0;
                $('#mousespeed').sparkline(mpoints, { width: mpoints.length*2, tooltipSuffix: ' pixels per second' });
            }
            lastmousetime = timenow;
            setTimeout(mdraw, mrefreshinterval);
        };
        // We could use setInterval instead, but I prefer to do it this way
        setTimeout(mdraw, mrefreshinterval);
    }

    // Overriding the default colors to match the theme
    $.fn.sparkline.defaults.common.lineColor = '#95a5a6';
    $.fn.sparkline.defaults.common.fillColor = '#ecf0f1';
    $.fn.sparkline.defaults.line.spotColor = '#1abc9c';
    $.fn.sparkline.defaults.line.minSpotColor = '#1abc9c';
    $.fn.sparkline.defaults.line.maxSpotColor = '#1abc9c';
    $.fn.sparkline.defaults.bar.barColor = '#1abc9c';
    $.fn.sparkline.defaults.bar.negBarColor = '#2980b9';
    $.fn.sparkline.defaults.tristate.posBarColor = '#34495e';
    $.fn.sparkline.defaults.tristate.negBarColor = '#16a085';
    $.fn.sparkline.defaults.tristate.zeroBarColor = '#2980b9';
    $.fn.sparkline.defaults.pie.sliceColors = ['#95a5a6', '#bdc3c7', '#ecf0f1'];
    $.fn.sparkline.defaults.box.boxLineColor = '#bdc3c7';
    $.fn.sparkline.defaults.box.boxFillColor = '#ecf0f1';
    $.fn.sparkline.defaults.box.whiskerColor = '#95a5a6';
    $.fn.sparkline.defaults.box.outlierLineColor = '#16a085';
    $.fn.sparkline.defaults.box.medianColor = '#2ecc71';
    $.fn.sparkline.defaults.box.targetColor = '#3498db';
    $.fn.sparkline.defaults.bullet.targetWidth = 2;
    $.fn.sparkline.defaults.bullet.targetColor = '#ecf0f1';
    $.fn.sparkline.defaults.bullet.performanceColor = '#34495e';
    $.fn.sparkline.defaults.bullet.rangeColors = ['#bdc3c7', '#95a5a6', '#7f8c8d' ];

    // Rendering the sparkline charts
    drawSparklines();
    drawMouseSpeedDemo();

});