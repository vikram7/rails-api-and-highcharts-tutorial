var url = "http://localhost:3000/api/v1/ratings/1?compare=2.jsonp?callback=?";

$.getJSON(url, function (json) {
    var ratings = new Array;
    var count = json.ratings.length;
    for (i = 0; i < count; i++) {
        ratings.push([json.ratings[i].user1_rating, json.ratings[i].user2_rating]);
    }
    $(function () {
        $('#container').highcharts({
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Comparing Beer Preferences of Two Users'
            },
            subtitle: {
                text: 'Source: Ratebeer'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'User1'
                },
                startOnTick: false,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'User2'
                },
                startOnTick: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: 'user1: {point.x}, user2: {point.y}'
                    }
                }
            },
            series: [{
                name: 'Beer Data',
                color: 'rgba(223, 83, 83, .5)',
                data: ratings
            }]
        });
    });
});
