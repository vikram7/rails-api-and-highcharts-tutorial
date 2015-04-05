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

```
var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
  alert("Oooh, it worked!");
});
```

[Screenshot]

Perfect! Now let's see the name of the first beer!

```
var url = "http://localhost:3000/api/v1/beers.jsonp?callback=?";

$.getJSON(url, function (json) {
  alert(json.beers[0].name);
});
```

[Screenshot]

Finally. Looks like we're making some progress and can start building our charts. What's next?
