var pageviews, df, data, options;

pageviews = [5340, 8993, 7837, 12454, 17495, 22434, 23453, 25445, 22455, 28995, 32957, 30445, 37953, 46497, 53387];

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
        },
        points: {
            radius: 3
        }
    },
    grid: {
        clickable: true,
        hoverable: true,
        tooltip: true,
        borderWidth: 0,
        color: '#bdc3c7'
    },
    points: { radius: 3 },
    'xaxis, yaxis': {
        font: {
            size: 11,
            lineHeight: 13
        }
    },
    xaxis: {
        mode: "time",
        minTickSize: [2, "month"],
        // timeformat: "%b '%y",
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

$.plot("#trafficChart", data, options);
