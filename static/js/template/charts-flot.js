// Realtime Graph

// We use an inline data source in the example, usually data would
// be fetched from a server

var data = [],
    totalPoints = 300;

function getRandomData() {

    if (data.length > 0)
        data = data.slice(1);

    // Do a random walk
    while (data.length < totalPoints) {

        var prev = data.length > 0 ? data[data.length - 1] : 50,
            y = prev + Math.random() * 10 - 5;

        if (y < 0) {
            y = 0;
        } else if (y > 100) {
            y = 100;
        }

        data.push(y);
    }

    // Zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]])
    }

    return res;
}

// Set up the control widget
var updateInterval = 30;
$("#updateInterval").val(updateInterval).change(function () {
    var v = $(this).val();
    if (v && !isNaN(+v)) {
        updateInterval = +v;
        if (updateInterval < 1) {
            updateInterval = 1;
        } else if (updateInterval > 2000) {
            updateInterval = 2000;
        }
        $(this).val("" + updateInterval);
    }
});

var realtimePlot = $.plot("#realtime", [ getRandomData() ], {
    colors: ['#2980b9'],
    border: false,
    series: {
        shadowSize: 0,	// Drawing is faster without shadows
        lines: {
            fill: true,
            fillColor: {
                colors: [{ opacity: 0.2 }, { opacity: 0.2 }]
            }
        }
    },
    grid: {
        color: "#bdc3c7",
        borderWidth: 1,
        borderColor: "#bdc3c7"
    },
    yaxis: {
        min: 0,
        max: 100
    },
    xaxis: {
        show: false
    }
});

function update() {
    realtimePlot.setData([getRandomData()]);

    // Since the axes don't change, we don't need to call realtimePlot.setupGrid()
    realtimePlot.draw();
    setTimeout(update, updateInterval);
}

update();


// Interactive Chart

var sin = [],
    cos = [];

for (var i = 0; i < 14; i += 0.5) {
    sin.push([i, Math.sin(i)]);
    cos.push([i, Math.cos(i)]);
}

$.plot("#interactive", [
    { data: sin, label: "sin(x)"},
    { data: cos, label: "cos(x)"}
], {
    colors: ['#ecf0f1', '#34495e'],
    series: {
        lines: {
            show: true
        },
        points: {
            show: true
        }
    },
    grid: {
        hoverable: true,
        clickable: true,
        color: "#bdc3c7",
        borderWidth: 1,
        borderColor: "#bdc3c7"
    },
    points: { radius: 2 },
    yaxis: {
        min: -1.2,
        max: 1.2
    },
    tooltip: true,
    tooltipOpts: {
        content: "%s of %x = %y",
        defaultTheme: false,
        shifts: {
            x: 0,
            y: 20
        },
        xDateFormat: "%b '%y"
    }
});


// Stacked Charts with simplestack plugin

var stackedOptions = {
    series: {
        curvedLines: { active: true },
        stack: true,
        group: true,
        groupInterval: 1,
        lines: {
            show: true,
            fill: true,
            lineWidth: 1
        },
        shadowSize: 0
    },
    grid: {
        color: "#bdc3c7",
        borderWidth: 1,
        borderColor: "#bdc3c7"
    }
};

var stackedData = [
    {
        x: function(n) { return n; },
        y: function(n) { return Math.random() * 10 - 5.; }
    }, {
        x: function(n) { return n; },
        y: function(n) { return Math.random() * 10; }
    }, {
        x: function(n) {
            var d;
            d = new Date();
            d.setDate(n + Math.random());
            return d;
        },
        y: function(n) { return Math.random() * 10 - 5.; }
    }
].map(function(f) {
        return ['A', 'B', 'C', 'D'].map(function(s) {
            var _i, _results;
            return {
                label: s,
                data: (function() {
                    _results = [];
                    for (_i = 1; _i <= 30; _i++){ _results.push(_i); }
                    return _results;
                }).apply(this).map(function(n) {
                        return [f.x(n), f.y(n)];
                    })
            };
        });
    });

$.plot($('#stacked'), $.extend(true, [], stackedData[1]), stackedOptions);


// Donut

var donutData = [26, 47, 17, 82, 39],
    series = Math.floor(Math.random() * 6) + 3;

$.plot($('#flotDonutChart'), donutData, {
    colors: ["rgba(22,160,133,0.8);", "rgba(52,152,219,0.8)", "rgba(241,196,15,0.8)", "rgba(52,73,94,0.9)", "rgba(192,57,43,0.8)"],
    series: {
        pie: {
            innerRadius: 0.6,
            show: true
        },
        grid: {
            hoverable: true,
            clickable: true
        }
    }
});
