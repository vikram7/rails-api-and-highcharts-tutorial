$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Ronda Rousey',
            data: [5, 5, 5]
        }, {
            name: 'Jon Jones',
            data: [8, 7, 8]
        }]
    });
});
