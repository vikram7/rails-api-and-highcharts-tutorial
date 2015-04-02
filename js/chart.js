$(function () {
    $('#container').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Comparing Random Data of Two Users'
        },
        subtitle: {
            text: 'Source: Ruby Magic'
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
            startOnTick: false
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
            name: 'Random Data',
            color: 'rgba(223, 83, 83, .5)',
            data: [[9, 87], [32, 99], [74, 89], [43, 60], [17, 86], [47, 20], [28, 75],
                   [86, 57], [66, 95], [86, 33], [0, 1], [78, 80], [66, 46], [80, 62],
                   [45, 73], [50, 18], [74, 10], [74, 21], [37, 36], [92, 47], [39, 5],
                   [53, 30], [10, 40], [12, 77], [60, 78]]
        }]
    });
});

