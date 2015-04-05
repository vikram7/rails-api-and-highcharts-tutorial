#Wiring up Highcharts with a Rails API

In the [last section](03-rails-api.md), we made a simple API that delivered beer review related data in JSON format. Now let's figure out how to take that JSON format and visualize it.

The primary question we'll try to answer here is this: How do we pass JSON data to Highcharts?

Well, let's break this problem down. First we'll have to hit our API to grab the data we care about. Since this happens on the client side, we'll use Javascript to do so. Here's the pseudocoded version of what we're going to have to do

```
(1) Write Javascript code to hit Rails API
(2) Grab Rails API JSON response and parse at how we need it
(3) Pass parsed data to Highcharts chart
```

[Show errors involved in trying to hit the API. Cross site thing]

Update Beers index controller:

```ruby
class Api::V1::BeersController < ApplicationController
  def index
    @beers = Beer.order("reviews_count desc")
    render json: @beers, callback: params['callback']
  end
end
```

Let's just try to get `Oooh, it worked!` to pop up on the screen if our `.getJSON` is successful:

```javascript
var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
  alert("Oooh, it worked!");
});
```

[Screenshot]

Perfect! Now let's see the name of the first beer!

```javascript
var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
  alert(json.beers[0].name);
});
```

[Screenshot]

Finally. Looks like we're making some progress and can start building our charts. What's next? Let's figure out how to print the top 10 beers by number of reviews (or `reviews_count`). Let's grab the [Column with Rotated Labels](http://www.highcharts.com/demo/column-rotated-labels) chart on the Highcharts website and replicate it for our data.

```javascript
$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'World\'s largest cities per 2014'
        },
        subtitle: {
            text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
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
                text: 'Population (millions)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
        },
        series: [{
            name: 'Population',
            data: [
                ['Shanghai', 23.7],
                ['Lagos', 16.1],
                ['Instanbul', 14.2],
                ['Karachi', 14.0],
                ['Mumbai', 12.5],
                ['Moscow', 12.1],
                ['São Paulo', 11.8],
                ['Beijing', 11.7],
                ['Guangzhou', 11.1],
                ['Delhi', 11.1],
                ['Shenzhen', 10.5],
                ['Seoul', 10.4],
                ['Jakarta', 10.0],
                ['Kinshasa', 9.3],
                ['Tianjin', 9.3],
                ['Tokyo', 9.0],
                ['Cairo', 8.9],
                ['Dhaka', 8.9],
                ['Mexico City', 8.9],
                ['Lima', 8.9]
            ],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
});
```

The above Javascript generates the following chart:

![alt](http://i.imgur.com/UWpBV87.png)

Let's start by just doing the easy stuff, like changing the labels. Then we can wrap that code in our API request and adjust the data accordingly:

```javascript
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
            pointFormat: 'Number of Reviews: <b>{point.y:.1f}</b>'
        },
        series: [{
            name: 'Population',
            data: [
                ['Shanghai', 23.7],
                ['Lagos', 16.1],
                ['Instanbul', 14.2],
                ['Karachi', 14.0],
                ['Mumbai', 12.5],
                ['Moscow', 12.1],
                ['São Paulo', 11.8],
                ['Beijing', 11.7],
                ['Guangzhou', 11.1],
                ['Delhi', 11.1],
            ],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
});
```

![img](http://i.imgur.com/W2yql92.png)

We just renamed some of the labels (*y* axis label, for example) and removed some of the cities from the list. Now we need to replace the city data with beer data. We can wrap our above code in our API request and pass the data we care about to `data`:

```javascript
var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
    $(function () {
        $('#container').highcharts({
        .
        .
        .
});
```

We need to create an array of arrays in the format that's required by Highcharts. Our data will look something like this:

```
[["Beer1", 3000], ["Beer2", 2000], ["Beer3", 1500], etc.]
```

To get the data to look like that, we'll do a bit of data manipulation in Javascript. We will loop through `json` to generate an array of arrays:

```javascript
var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
    var beersAndReviews = new Array;
    for (i = 0; i < 10; i++) {
        beersAndReviews.push([json.beers[i].name, json.beers[i].reviews_count])
    }
    $(function () {
        $('#container').highcharts({
        .
        .
        .
```

Once we're certain that `beersAndReviews` contains the top 10 beers by reviews, we can update the `series` part of our code:

```javascript
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
```

After our update, let's load up our chart:

![alt](http://i.imgur.com/e2dxR2W.png)

That wasn't too bad! And just by glancing at our chart, we can see that Chimay Blue has 30% more reviews than Chimay Rouge and the next closest brewer is Lagunitas. Pretty interesting. What else can we do?


