$(function () {

    function setupChart(selector, type, data, options) {
        /* Renders the chart.js charts and re-renders on window resize. */

        var renderedOnce = false; // Keeping track whether the the chart has been rendered once

        function render() {
            var el = $(selector);

            // Setting width and height attributes since Chart.js uses those
            el.attr('width', el.parent().width());
            el.attr('height', el.height());

            // Disabling the animation if the chart has been rendered once
            if (renderedOnce) {
                options.animation = false;
            } else {
                renderedOnce = true;
            }

            // Initializing the chart
            new Chart(el.get(0).getContext("2d"))[type](data, options);
        }

        render();
        $(window).resize(render);
    }


    // Line Chart

    var lineChartData, lineChartOptions;

    lineChartData = {
        labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                data : [65,59,90,81,56,55,40,82,65,34,93,23]
            },
            {
                fillColor : "rgba(57, 79, 100, 0.8)",
                strokeColor : "rgba(57, 79, 100, 1)",
                pointColor : "rgba(57, 79, 100, 1)",
                pointStrokeColor : "#fff",
                data : [28,48,40,62,96,48,82,45,72,40,50,34]
            }
        ]
    };

    lineChartOptions = {
        scaleFontFamily : "'Open Sans', sans-serif",
        scaleFontSize : 12,
        scaleShowGridLines: false,
        scaleShowLabels : false
    };

    setupChart("#lineChart", "Line", lineChartData, lineChartOptions);


    // Bar Chart

    var barChartData;

    barChartData = {
        labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
        datasets : [
            {
                fillColor: "rgba(52, 152, 219, 0.6)",
                strokeColor: "rgba(52, 152, 219, 0.6)",
                barStrokeWidth: 0,
                data : [65,59,90,81,56,55,40,82,65,34,93,23]
            },
            {
                fillColor : "rgba(26, 188, 156, 0.6)",
                strokeColor : "rgba(26, 188, 156, 0.6)",
                data : [28,48,40,62,96,48,82,45,72,40,50,34]
            }
        ]
    };

    setupChart("#barChart", "Bar", barChartData, {});


    // Radar chart

    var radarChartData = {
        labels : ["Eating","Drinking","Sleeping","Designing","Coding","Partying","Running"],
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                data : [65,59,90,81,56,55,40]
            },
            {
                fillColor : "rgba(57, 79, 100, 0.6)",
                strokeColor : "rgba(57, 79, 100, 1)",
                pointColor : "rgba(57, 79, 100, 1)",
                pointStrokeColor : "#fff",
                data : [28,48,40,19,96,27,100]
            }
        ]
    };

    setupChart("#radarChart", "Radar", radarChartData, {});


    // Polar Chart

    var polarChartData = [
        {
            value : 30,
            color: "#D97041"
        },
        {
            value : 90,
            color: "#1abc9c"
        },
        {
            value : 24,
            color: "#21323D"
        },
        {
            value : 58,
            color: "#e74c3c"
        },
        {
            value : 82,
            color: "#3498db"
        },
        {
            value : 8,
            color: "#584A5E"
        }
    ];

    setupChart("#polarChart", "PolarArea", polarChartData, {});


    // Pie Chart

    var pieChartData = [
        {
            value: 30,
            color: "#ecf0f1"
        },
        {
            value : 50,
            color : "#34495e"
        },
        {
            value : 100,
            color : "#16a085"
        }
    ];

    setupChart("#pieChart", "Pie", pieChartData, {});


    // Doughnut Chart

    var doughnutChartData = [
        {
            value: 30,
            color:"#3498db"
        },
        {
            value : 50,
            color : "#E2EAE9"
        },
        {
            value : 100,
            color : "#27ae60"
        },
        {
            value : 40,
            color : "#949FB1"
        },
        {
            value : 120,
            color : "#4D5360"
        }

    ];

    setupChart("#doughnutChart", "Doughnut", doughnutChartData, {});

});
