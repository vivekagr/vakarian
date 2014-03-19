// Initializes the graphs on the dashboard

$(function() {

    var pageviews, visits, uniques, bounce, df, data, options;

    function randrange (min, max) { return Math.random() * (max - min) + min; }

    // Traffic data points
    pageviews = [3478,5340,8993,7837,12454,17495,22434,23453,25445,22455,28995,32957,30445,37953,46497,44286];
    visits = pageviews.map(function(x) { return Math.floor(x * randrange(0.29, 0.39)); });
    uniques = pageviews.map(function(x) { return Math.floor(x * randrange(0.16, 0.25)); });
    bounce = (function() {
        var val = [];
        for (var i=0; i<pageviews.length; i++)
            val.push(randrange(0.45, 0.8) * 100);
        return val;
    })();

    // Creating out dataset in format [ [timestamp, value],... ] with values from above array
    df = [];
    for (var i=1; i<=pageviews.length; i++) {
        var x = new Date();
        x.setDate(1);
        x.setMonth(x.getMonth()-(pageviews.length-i));
        df.push([x.getTime() , pageviews[i-1]]);
    }

    data = [
        {
            data: df,
            lines: { show: true, lineWidth: 2},
            curvedLines: { apply:true },
            hoverable: false
        },
        {
            data: df,
            points: { show: true }
        }
    ];

    options = {
        colors: ['#2c3e50'],
        series: {
            curvedLines: { active: true },
            lines: {
                fill: true,
                fillColor: {
                    colors: [{ opacity: 0.6 }, { opacity: 0.6 }]
                }
            }
        },
        grid: {
            clickable: true,
            hoverable: true,
            tooltip: true,
            borderWidth: 0,
            color: '#bdc3c7'
        },
        points: { radius: 1 },
        xaxis: {
            mode: "time",
            minTickSize: [2, "month"],
            timeformat: "%b '%y",
            font: {
                color: "#34495e",
                family: "'Open Sans', sans-serif",
                weight: 600
            }
        },
        yaxis: {
            font: {
                color: "#34495e",
                family: "'Open Sans', sans-serif",
                weight: 400
            }
        },
        tooltip: true,
        tooltipOpts: {
            content: "%y pageviews in %x.1",
            defaultTheme: false,
            shifts: {
                x: 0,
                y: 20
            },
            xDateFormat: "%b '%y"
        }
    };

    // Drawing the traffic flot chart with the proper parameters
    $.plot("#trafficChart", data, options);


    // Updating the default colors of line graphs in peity.js
    $.fn.peity.defaults.line.fill = 'rgba(189, 195, 199, 0.2)';
    $.fn.peity.defaults.line.stroke = 'rgb(189, 195, 199)';

    // Inserting the traffic data into the peity chart elements
    $("#visitsPiety").html(visits.join(','));
    $("#uniquesPiety").html(uniques.join(','));
    $("#pageviewsPiety").html(pageviews.join(','));
    $("#bouncePiety").html(bounce.join(','));

    // Render the peity charts
    $(".line").peity("line");

    $(window).resize(function() { $(".line").peity("line"); });


    // Browser donut chart
    Morris.Donut({
        element: 'browser-donut',
        data: [
            {label: "Chrome", value: 48},
            {label: "Firefox", value: 21},
            {label: "Safari", value: 11},
            {label: "Internet Explorer", value: 12},
            {label: "Others", value: 8}
        ],
        colors: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#ecf0f1']
    });


    // USA customer base graph
    $("#us-cust-map").mapael({
        map: {
            name: "usa_states",
            defaultArea: {
                attrs : {
                    fill: "#ecf0f1",
                    stroke : "#fff"
                },
                attrsHover : {
                    fill: "#34495e",
                    "stroke-width" : 0,
                    animDuration: 150
                }
            }
        },
        legend: {
            area: {
                display: true,
                marginBottom: 8,
                slices: [
                    {
                        max: 500,
                        attrs: { fill: "#E1E3E4" },
                        label: "Under 5k customers"
                    },
                    {
                        min: 500,
                        max: 1000,
                        attrs: { fill: "#D4D7DA" },
                        label: "Between 500-1k customers"
                    },
                    {
                        min: 1000,
                        attrs: { fill: "#808B96" },
                        label: "Above 1k customers"
                    }
                ]
            }
        },
        areas: {
            'AZ': { value: 627, tooltip: {content: "Arizona - 627 customers"} },
            'AK': { value: 27, tooltip: {content: "Alaska - 27 customers"} },
            'AR': { value: 736, tooltip: {content: "Arkansas - 736 customers"} },
            'CA': { value: 1132, tooltip: {content: "California - 1132 customers"} },
            'GA': { value: 356, tooltip: {content: "Georgia - 356 customers"} },
            'IL': { value: 542, tooltip: {content: "Illinois - 542 customers"} },
            'NE': { value: 1283, tooltip: {content : "Nebraska - 1283 customers"} },
            'NM': { value: 87, tooltip: {content : "New Mexico - 87 customers"} },
            'NY': { value: 789, tooltip: {content : "New York - 789 customers"} },
            'MT': { value: 87, tooltip: {content : "Montana - 87 customers"} },
            'SF': { value: 289, tooltip: {content : "San Francisco - 289 customers"} },
            'TX': { value: 203, tooltip: {content : "Texas - 203 customers"} },
            'OK': { value: 245, tooltip: {content: "Oklahoma - 245 customers"} },
            'WA': { value: 1453, tooltip: {content: "Washington - 1453 customers"} }
        }
    });

});