/*
    Renders the graphs, map, animations, calendar, etc.
    on the dashboard ('index.html').
*/

$(function () {

    setTimeout(function() {
        $('.alert-top').slideDown().animateCss('bounceInLeft');
    }, 3000);

    var ds, pageviews, visits, uniques, bounce, x, data, options, date, d, m, y, events;

    // Returns a random number between min and max
    function randRange (min, max) { return Math.random() * (max - min) + min; }

    // Returns a random integer between min and max
    function randRangeInt (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // Returns an array of n random integers between min and max
    function randVals (min, max, n) {
        var vals = [];
        for (i=0; i<n; i++)
            vals.push(randRangeInt(min, max));
        return vals;
    }

    // Multiplies each element of array n with a random number
    // between min and max
    function randMul(arr, min, max) {
        return arr.map(function(n) { return Math.floor(n * randRange(min, max)); });
    }

    // Creating random traffic data set

    // Pageviews
    pageviews = {
        yearly: [11726,8340,9993,7837,6454,9495,13434,12453,14445,18455,19995,18957],
        monthly: randVals(450, 700, 30),
        weekly: randVals(550, 700, 7)
    };

    visits = {
        yearly: randMul(pageviews.yearly, 0.39, 0.5),
        monthly: randMul(pageviews.monthly, 0.39, 0.5),
        weekly: randMul(pageviews.weekly, 0.39, 0.5)
    };

    uniques = {
        yearly: randMul(pageviews.yearly, 0.16, 0.25),
        monthly: randMul(pageviews.monthly, 0.16, 0.25),
        weekly: randMul(pageviews.weekly, 0.16, 0.25)
    };

    bounce = {
        yearly: randVals(50, 60, 12),
        monthly: randVals(45, 70, 30),
        weekly: randVals(45, 70, 7)
    };


    // Creating out dataset in format [ [timestamp, value],... ] with values above
    ds = {
        pageviews: { yearly: [], monthly: [] },
        visits: { yearly: [], monthly: [] }
    };


    for (i=1; i<=12; i++) {
        x = new Date();
        x.setDate(1);
        x.setMonth(x.getMonth()-(12-i));
        ds.pageviews.yearly.push([x.getTime() , pageviews.yearly[i-1]]);
        ds.visits.yearly.push([x.getTime() , visits.yearly[i-1]]);
    }

    for (var i=1; i<=30; i++) {
        x = new Date();
        x.setDate(x.getDate()-(30-i));
        ds.pageviews.monthly.push([x.getTime() , pageviews.monthly[i-1]]);
        ds.visits.monthly.push([x.getTime() , visits.monthly[i-1]]);
    }

    data = [
        {
            data: ds.pageviews.yearly,

            lines: { show: true, lineWidth: 1},
            curvedLines: { apply:true },
            hoverable: false
        },
        {
            label: 'Pageviews',
            data: ds.pageviews.yearly,
            points: { show: true }
        },
        {
            data: ds.visits.yearly,
            lines: { show: true, lineWidth: 1},

            curvedLines: { apply:true },
            hoverable: false
        },
        {
            data: ds.visits.yearly,
            label: 'Visits',
            points: { show: true }
        }
    ];

    options = {
        // These are the colors used in the traffic flot chart
        // They are in the order of - line-color-1, point-color-1, line-color-2, point-color-2, ...
        colors: ['#ecf0f1', '#bdc3c7', '#3498db', '#2980b9'],
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
            content: "%y in %x.1",
            defaultTheme: false,
            shifts: {
                x: 0,
                y: 20
            },
            xDateFormat: "%b '%y"
        }
    };

    // Drawing the traffic flot chart with the proper parameters
    $.plot("#trafficChartYearly", data, options);

    data[0].data = data[1].data = ds.pageviews.monthly;
    data[2].data = data[3].data = ds.visits.monthly;
    $.plot("#trafficChartMonthly", data, options);


    // Updating the default colors of line graphs in peity.js
    $.fn.peity.defaults.line.fill = 'rgba(189, 195, 199, 0.2)';
    $.fn.peity.defaults.line.stroke = 'rgb(189, 195, 199)';

    // Inserting the traffic data into the peity chart elements
    $("#visitsPiety").html(visits.yearly.join(','));
    $("#uniquesPiety").html(uniques.yearly.join(','));
    $("#pageviewsPiety").html(pageviews.yearly.join(','));
    $("#bouncePiety").html(bounce.yearly.join(','));

    // Render the peity charts
    $(".line").peity("line");

    $(window).resize(function() { $(".line").peity("line"); });


    var donut = Morris.Donut({
        element: 'browser-donut',
        resize: true,
        data: [
            {label: "Chrome", value: 48},
            {label: "Firefox", value: 21},
            {label: "Safari", value: 11},
            {label: "Internet Explorer", value: 12},
            {label: "Others", value: 8}
        ],
        colors: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#ecf0f1'],
        formatter: function (y, data) { return + y + "%" }
    });



    // USA user base graph
    $("#us-subscribers-map").mapael({
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
                        label: "Under 500 subscribers"
                    },
                    {
                        min: 500,
                        max: 1000,
                        attrs: { fill: "#D4D7DA" },
                        label: "Between 500-1k subscribers"
                    },
                    {
                        min: 1000,
                        attrs: { fill: "#808B96" },
                        label: "Above 1k subscribers"
                    }
                ]
            }
        },
        areas: {
            'AZ': { value: 627, tooltip: {content: "Arizona - 627 subscribers"} },
            'AK': { value: 27, tooltip: {content: "Alaska - 27 subscribers"} },
            'AR': { value: 736, tooltip: {content: "Arkansas - 736 subscribers"} },
            'CA': { value: 1132, tooltip: {content: "California - 1132 subscribers"} },
            'GA': { value: 356, tooltip: {content: "Georgia - 356 subscribers"} },
            'IL': { value: 542, tooltip: {content: "Illinois - 542 subscribers"} },
            'NE': { value: 1283, tooltip: {content : "Nebraska - 1283 subscribers"} },
            'NM': { value: 87, tooltip: {content : "New Mexico - 87 subscribers"} },
            'NY': { value: 789, tooltip: {content : "New York - 789 subscribers"} },
            'MT': { value: 87, tooltip: {content : "Montana - 87 subscribers"} },
            'SF': { value: 289, tooltip: {content : "San Francisco - 289 subscribers"} },
            'TX': { value: 203, tooltip: {content : "Texas - 203 subscribers"} },
            'OK': { value: 245, tooltip: {content: "Oklahoma - 245 subscribers"} },
            'WA': { value: 1453, tooltip: {content: "Washington - 1453 subscribers"} }
        }
    });

    // Calendar

    // Setting up the events data for the calendar
    date = new Date();
    d = date.getDate();
    m = date.getMonth();
    y = date.getFullYear();

    events = [
        {
            title: 'All Day Event',
            start: new Date(y, m, 1)
        },
        {
            title: 'Long Event',
            start: new Date(y, m, d-5),
            end: new Date(y, m, d-2)
        },
        {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d-3, 16, 0),
            allDay: false
        },
        {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d+4, 16, 0),
            allDay: false
        },
        {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        },
        {
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        },
        {
            title: 'Birthday Party',
            start: new Date(y, m, d+1, 19, 0),
            end: new Date(y, m, d+1, 22, 30),
            allDay: false
        },
        {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }
    ];

    // Rendering the calendar
    $('#calendar').fullCalendar({
        height: 280,
        selectable: true,
        selectHelper: true,
        editable: true,
        header: {
            left: 'title',
            center: '',
            right: 'month,agendaWeek,agendaDay prev,next'
        },
        events: events
    });

    // Initializing the NanoScroller
    $(".nano").nanoScroller();

});
