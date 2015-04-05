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

That wasn't too bad! It just took a little bit of figuring out how to make the API call. The actual data manipulation was fairly straightforward. Now we have a nice visual of our data. Just by glancing at our chart, we can see that Chimay Blue has 30% more reviews than Chimay Rouge and the next closest brewer is Lagunitas. Pretty interesting. What else can we do?

Well, we started this whole journey by looking at scatter plots, so why don't we finish up with one? We'll plot some user beer preferences. Our API doesn't provide us the ability to see let alone manipulate, user data just yet, so we have to write that functionality in.

What do we want our API url to look like? There are probably a number of ways to do this, but the following is a straightforward one that comes to mind:

`http://localhost:3000/api/v1/ratings/1?compare=2`

This way we can have access to both `id`s of the users we want to compare, 1 and 2, in this case. Here's another example:

`http://localhost:3000/api/v1/ratings/1200?compare=18`

That API call will return ideally return a comparison of users with `id`s of 1200 and 18.

First, let's update our `config/routes.rb` file to allow for this. Note that I'm going to limit the `users` route to the show action:

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :beers, only: [:index]
      resources :styles, only: [:index]
      resources :ratings, only: [:show]
    end
  end
end
```

Now we need to add a `RatingsController` in `app/controllers/api/v1/ratings_controller.rb`:

```ruby
class Api::V1::RatingsController < ApplicationController
  def show
  end
end
```

Let's leave it mostly empty before we figure out what to to next. We'll have to do a few things now. Grab the beers that both have reviewed in common and return a json of those. We'll have to grab one user's data and then grab another's and see which beers they have in common that they have reviewed. Since a user `has_many beers through reviews`, we can simply return the intersection of the beers reviewed with another user.

```
(1) Take two users
(2) Get a list of beers they have reviewed in common
(3) Get the ratings of each of those beers by each user and return those
```

Great. Now let's update our RatingsController to do just that. We'll probably want to refactor a lot of this later on, but for now, let's get it to work!:

```ruby
class Api::V1::RatingsController < ApplicationController
  def show
    user1 = User.find(params[:id])
    user2 = User.find(params[:compare])
    beers_in_common = user1.beers & user2.beers
    @beers_in_common_with_ratings = Array.new
    beers_in_common.each do |beer|
      user1_rating = beer.reviews.find_by(user_id: user1.id).taste
      user2_rating = beer.reviews.find_by(user_id: user2.id).taste
      @beers_in_common_with_ratings << {name: beer.name, user1_rating: user1_rating, user2_rating: user2_rating}
    end
    render json: @beers_in_common_with_ratings, callback: params['callback']
  end
end
```

Here's what we're doing. We're grabbing two user objects and then intersection the arrays of beers they have in common (the `&` operator returns the intersection of two arrays). Then we're generating a json friendly data structure called `@beers_in_common_with_ratings` that stores each of the intersected beer's respective user ratings. What does `http://localhost:3000/api/v1/ratings/1?compare=2` look like now?. Let's see!

![alt](http://i.imgur.com/MLNW1l1.png)

Great! Now we have enough data to make a scatter plot, so let's get to work! This is what the Javascript of the scatter plot in Part 2 of this tutorial looked like:

```javascript
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
```

Using the API knowledge we gained earlier, let's start updating this Javascript:

```javascript
var url = "http://localhost:3000/api/v1/ratings/1?compare=2.jsonp?callback=?";

$.getJSON(url, function (json) {
    .
    .
    .
```

Because we have a comparison and a callback in our API url, we'll have to do a bit of data manipulation on the `RatingsController` side:

```ruby
class Api::V1::RatingsController < ApplicationController
  def show
    params[:format] = "jsonp"
    user1 = User.find(params[:id])
    user2 = User.find(params[:compare].split(".").first)
    beers_in_common = user1.beers & user2.beers
    @beers_in_common_with_ratings = Array.new
    beers_in_common.each do |beer|
      user1_rating = beer.reviews.find_by(user_id: user1.id).taste
      user2_rating = beer.reviews.find_by(user_id: user2.id).taste
      @beers_in_common_with_ratings << {name: beer.name, user1_rating: user1_rating, user2_rating: user2_rating}
    end
    render json: @beers_in_common_with_ratings, callback: params[:compare].split("=").last
  end
end
```

Now we can manipulate the data we got back:

```javascript
var url = "http://localhost:3000/api/v1/ratings/1?compare=2.jsonp?callback=?";

$.getJSON(url, function (json) {
    var ratings = new Array;
    var count = json.ratings.length;
    for (i = 0; i < count; i++) {
        ratings.push([json.ratings[i].user1_rating, json.ratings[i].user2_rating]);
    }
    .
    .
    .
            series: [{
                name: 'Beer Data',
                color: 'rgba(223, 83, 83, .5)',
                data: ratings
            }]
        });
    });
});
```

Let's take a look at this work on the scatter plot!:

![alt](http://i.imgur.com/DA0gD25.png)

Nice! Right now we're just comparing user with `id` of 1 and user with id of `2` but later on we could make our Javascript more dynamic by allowing us to enter in which users we want to compare.

Thanks for going through this tutorial! Hope it sheds some light on the power of Highcharts, Javascript and Rails APIs.
