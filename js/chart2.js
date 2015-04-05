var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
    var beersAndReviews = new Array;
    for (i = 0; i < 10; i++) {
        beersAndReviews.push([json.beers[i].name, json.beers[i].reviews_count]);
    }
    $(function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Popular Beers by Number of Reviews'
            },
            subtitle: {
                text: 'Source: Ratebeer'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Reviews'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Number of Reviews: <b>{point.y}</b>'
            },
            series: [{
                name: 'Beer',
                data: beersAndReviews,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y}',
                    y: 10,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        });
    });
});
