$(function () {

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

});