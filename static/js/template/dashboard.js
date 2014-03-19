var pageviews, visits, uniques, bounce, df, data, options;

var randrange = function(min, max) { return Math.random() * (max - min) + min; };

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

// Drawing the flot chart with the proper parameters
$.plot("#trafficChart", data, options);


// Updating the default colors of line graphs in peity.js
$.fn.peity.defaults.line.fill = 'rgba(189, 195, 199, 0.2)';
$.fn.peity.defaults.line.stroke = 'rgb(189, 195, 199)';

// Inserting the traffic data into the peity chart elements
$("#visitsPiety").html(visits.join(','));
$("#uniquesPiety").html(uniques.join(','));
$("#pageviewsPiety").html(pageviews.join(','));
$("#bouncePiety").html(bounce.join(','));

$(".line").peity("line");

$(window).resize(function() { $(".line").peity("line"); });


// Render the browser donut chart
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
