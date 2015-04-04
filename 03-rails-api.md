##Interlude: Rails API Generation

### Why do we want to make a Rails API?

Let's take a look at the data we have.

<sub>By the way, access to the extensive reviews from RateBeer which formed a large part of the database of this project could not have been possible without the assistance of Professor Julian McAuley of UCSD, who was was kind enough to share the data with me. More on his research around beer and recommendations can be found here: http://snap.stanford.edu/data/web-RateBeer.html. Note, please contact me directly as you will need access to the RateBeer data which the company has asked not to share publicly. I won't be sharing the entire data set, but snippets of it which you can use to create your own fake data to play with.</sub>

The following is a snippet of the first handful of records from a `csv` file that contains only a few columns we'll care about right now: `name`, `beer_id`, `ABV`, `style`, `taste`, `profile_name` and `text`.

```
name,beer_id,brewer_id,ABV,style,appearance,aroma,palate,taste,overall,time,profile_name,text
John Harvards Simcoe IPA,63836,8481,5.4,India Pale Ale &#40;IPA&#41;,4/5,6/10,3/5,6/10,13/20,1157587200,hopdog,"On tap at the Springfield, PA location. Poured a deep and cloudy orange (almost a copper) color with a small sized off white head. Aromas or oranges and all around citric. Tastes of oranges, light caramel and a very light grapefruit finish. I too would not believe the 80+ IBUs - I found this one to have a very light bitterness with a medium sweetness to it. Light lacing left on the glass."
John Harvards Simcoe IPA,63836,8481,5.4,India Pale Ale &#40;IPA&#41;,4/5,6/10,4/5,7/10,13/20,1157241600,TomDecapolis,"On tap at the John Harvards in Springfield PA.  Pours a ruby red amber with a medium off whie creamy head that left light lacing.  Aroma of orange and various other citrus.  A little light for what I was expecting from this beers aroma...expecting more from the Simcoe.  Flavor of pine, orange, grapefruit and some malt balance.  Very light bitterness for the 80+ IBUs they said this one had."
John Harvards Cristal Pilsner,71716,8481,5,Bohemian Pilsener,4/5,5/10,3/5,6/10,14/20,958694400,PhillyBeer2112,"UPDATED: FEB 19, 2003 Springfield, PA. I've never had the Budvar Cristal but this is exactly what I imagined it to be.  A clean and refreshing, hoppy beer, med bodied with plenty of flavor.  This beer's only downfall is an unpleasant bitterness in the aftertaste."
John Harvards Fancy Lawnmower Beer,64125,8481,5.4,Kölsch,2/5,4/10,2/5,4/10,8/20,1157587200,TomDecapolis,"On tap the Springfield PA location billed as the ""Fancy Lawnmower Light"".  Pours a translucent clear yellow with a small bubbly white head.  Aroma was lightly sweet and malty, really no hop presence.  Flavor was light, grainy, grassy and malty.  Just really light in flavor and aroma overall. Watery."
John Harvards Fancy Lawnmower Beer,64125,8481,5.4,Kölsch,2/5,4/10,2/5,4/10,8/20,1157587200,hopdog,"On tap at the Springfield, PA location. Poured a lighter golden color with a very small, if any head. Aromas and tastes of grain, very lightly fruity with a light grassy finish. Lively yet thin and watery body. Oh yeah, the person seating me told me this was a new one and was a Pale Ale even though the menu he gave me listed it as a lighter beer brewed in the Kolsh style."
John Harvards Vanilla Black Velvet Stout,31544,8481,-,Sweet Stout,5/5,8/10,4/5,7/10,16/20,1077753600,egajdzis,"Springfield, PA location... Poured an opaque black color with a creamy tan head and nice lacing.  Strong vanilla and roasted malt aroma.  Creamy taste of coffee, chocolate and vanilla. The bartender told me this was an imperial stout at about 8%.  She didn't convince me, there was no alcohol to be found, and it was sweet as hell!  But still good."
John Harvards American Brown Ale,71714,8481,-,Brown Ale,4/5,5/10,3/5,6/10,12/20,1176076800,hopdog,"On tap at the Springfield, PA location. Listed on the beer menu as ""James Brown Ale"". Had the regular and cask version. Poured a deep brown color with an averaged sized off white head (cask had a huge head). Ill stop on the cask version here as I found it to smell and taste like buttered popcorn. The regular had aromas of nuts, light chocolate, and roast. Taste of chocolate, nuts, very light roast and caramel.   Tasted on 9/7/2006 and moved over as part of the John Harvard clean up."
John Harvards Grand Cru,71719,8481,7,Belgian Ale,2/5,6/10,3/5,7/10,14/20,1107302400,JFGrind,"Sampled @ the Springfield, PA location.   Candi Sugar dominates this Belgian Ale.  Beer was on the flat side but had a nice crimson color.   Enjoyable Belgian Ale, I did not expect John Harvards to have it in its line-up."
John Harvards Grand Cru,71719,8481,7,Belgian Ale,4/5,8/10,3/5,7/10,16/20,1102896000,egajdzis,"Springfield... Poured a hazy copper color with a medium sized, off white head that left spotty lacing on the glass.  Aroma of yeast, dried fruits, clove, banana, and cherries, with light roastiness.  Aroma was very dubbelish.  Herbal taste of dark fruits, yeast and alcohol was barely noticed.  Slick mouthfeel.  Could have been more flavorful."
```

Creating a Rails API is very similar to creating a Rails app. We will be following a very similar roadmap, but the data delivered from our controllers will be JSON data.

Here's a roadmap of how we will take the above data and deliver it in JSON format:

[UPDATE THE BELOW ORDER]
```
1. Install the Rails API gem
2. Generate a new Rails API app and update our Gemfile.
3. Create our backend database and write associated migrations.
4. Update the `routes.rb` file to contain routes we care about.
5. Write a seed file to populate our database.
6. Write controllers to deliver the data based on some set of requirements implementing ActiveModel Serializer.
```

Sounds complicated? It's not that bad. Let's get started.

####Install the Rails API gem

```
gem install rails-api
```

The gem has some great [documentation](https://github.com/rails-api/rails-api) that you should take a look at.

####Generate a new Rails API app and update our Gemfile.

```
rails-api new beer-recommender -T --database=postgresql
```

After generating a `beer-recommender` directory, `cd` into it. Let's update our Gemfile so we have everything we need:

```ruby

source 'https://rubygems.org'

gem 'rails', '4.2.1'

gem 'rails-api'

gem 'spring', :group => :development

gem 'pg'

gem 'active_model_serializers', '0.8.3'

group :test do
  gem 'shoulda-matchers', require: false
end

group :development, :test do
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'pry-rails'
  gem 'rspec-rails', '~> 3.0.0'
end
```

After running `bundle`, generate your test files with rspec by running `rails g rspec:install`.

Update your `spec/rails_helper.rb` file so that the top of the file looks like this (you are basically just adding the `require 'shoulder/matchers'` under `require 'rspec/rails'`):

```ruby
ENV["RAILS_ENV"] ||= 'test'
require 'spec_helper'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'shoulda/matchers'
```

####Create our backend database and write associated migrations

Running `rake db:create` should generate the database from the command line. Once we have a database, we should generate a beer model and associated migration just to see what the data can look like.

```ruby
class Beer < ActiveRecord::Base
  belongs_to :style

  validates :name, presence: true, uniqueness: true
  validates :style, presence: true
end
```

Yes, it looks pretty barebones, but let's just go for the basics. We'll have to update the above model later on anyways. Let's add our `Style` table as well:

```ruby
class Style < ActiveRecord::Base
  has_many :beers

  validates :name, presence: true, uniqueness: true
end
```

Now we have to write migrations for our `Beer` and `Style` tables:

`rails g migration create_beers` will generate a migration file in the `db/migrate` folder.

```ruby
class CreateBeers < ActiveRecord::Migration
  def change
    create_table :beers do |t|
      t.string :name, null: false
      t.integer :style_id, null: false

      t.timestamps
    end

    add_index :beers, :name, unique: true
  end
end
```

`rails g migration create_styles` will generate a migration file in the `db/migrate` folder.

```ruby
class CreateStyles < ActiveRecord::Migration
  def change
    create_table :styles do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :styles, :name, unique: true
  end
end
```

Ok, make sure everything looks normal in the schema file and now let's write a small seeder to seed our database:

```ruby
styles = ["IPA", "Stout", "Ale", "Lager", "Wheat Beer"]
count = 1

styles.each do |style|
  style = Style.create!(name: style)
  count += 1
  Beer.create!(name: "Beer #{count}", style_id: style.id)
  count += 1
  Beer.create!(name: "Beer #{count}", style_id: style.id)
end
```

Let's see what our database looks like in `rails console`:

```
Loading development environment (Rails 4.2.1)
[1] pry(main)> Beer.all
  Beer Load (0.6ms)  SELECT "beers".* FROM "beers"
=> [#<Beer:0x007fe7de291648 id: 1, name: "Beer 2", style_id: 1, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de2912b0 id: 2, name: "Beer 3", style_id: 1, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de291030 id: 3, name: "Beer 4", style_id: 2, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de2909a0 id: 4, name: "Beer 5", style_id: 2, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de290428 id: 5, name: "Beer 6", style_id: 3, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de28be50 id: 6, name: "Beer 7", style_id: 3, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de28b338 id: 7, name: "Beer 8", style_id: 4, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de28aaa0 id: 8, name: "Beer 9", style_id: 4, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de28a0c8 id: 9, name: "Beer 10", style_id: 5, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7de289ce0 id: 10, name: "Beer 11", style_id: 5, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>]
[2] pry(main)> Style.all
  Style Load (0.7ms)  SELECT "styles".* FROM "styles"
=> [#<Style:0x007fe7de010c48 id: 1, name: "IPA", created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Style:0x007fe7de010838 id: 2, name: "Stout", created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Style:0x007fe7de010450 id: 3, name: "Ale", created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Style:0x007fe7de00be28 id: 4, name: "Lager", created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Style:0x007fe7de00bbf8 id: 5, name: "Wheat Beer", created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>]
[3] pry(main)> Beer.first.style.name
  Beer Load (0.7ms)  SELECT  "beers".* FROM "beers"  ORDER BY "beers"."id" ASC LIMIT 1
  Style Load (0.2ms)  SELECT  "styles".* FROM "styles" WHERE "styles"."id" = $1 LIMIT 1  [["id", 1]]
=> "IPA"
[4] pry(main)> Style.first.beers
  Style Load (0.4ms)  SELECT  "styles".* FROM "styles"  ORDER BY "styles"."id" ASC LIMIT 1
  Beer Load (0.2ms)  SELECT "beers".* FROM "beers" WHERE "beers"."style_id" = $1  [["style_id", 1]]
=> [#<Beer:0x007fe7df41ac20 id: 1, name: "Beer 2", style_id: 1, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>,
 #<Beer:0x007fe7df41aa68 id: 2, name: "Beer 3", style_id: 1, created_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00, updated_at: Sat, 04 Apr 2015 20:12:44 UTC +00:00>]
```

Looks like our `Beer` and `Style` associations are in place!

####Update the `config/routes.rb` file

It will take a little bit of thinking to figure out what we want our API to deliver. The simplest thing we can update our `routes.rb` file with is the ability to be able to see our beers index and styles index pages:

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :beers, only: [:index]
      resources :styles, only: [:index]
    end
  end
end
```

Most of that should look familiar, but why are we namespacing our resources? Because we're building an API! Think about end users of an API. They likely will want a nice, clean url to hit. By namespacing to API and v1, the url they hit will look something like `http://localhost:3000/api/v1/beers` (and similarly for styles). Separating concerns of our API and the rest of our app allows us to be more flexible and modular. Additionally, if we change our API around at some point in the future, we can namespace a v2 for our resources as well.

If we namespace our api like above, we will have to update our controllers to be in `app/controllers/api/v1/<name_of_controller.rb>`. In this case, our `BeersController` will be located in `app/controllers/api/v1/beers_controller.rb`:

```ruby
class Api::V1::BeersController < ApplicationController
  def index
    @beers = Beer.all
    render json: @beers
  end
end
```

Wait, what's `render json: @beers` mean? It's pretty much what it looks like. We are grabbing all the beers in our database and then displaying them as a json when we go to `localhost:3000/api/v1/beers` or `localhost:3000/api/v1/styles`.

Similarly, let's write our `app/controllers/api/v1/styles_controller.rb` file:

```ruby
class Api::V1::StylesController < ApplicationController
  def index
    @styles = Style.all
    render json: @styles
  end
end
```

Let's run `rails server` and visit these pages and see what they look like:

Beers index page:

![alt](http://i.imgur.com/NR5gby7.png)

Styles index page:

![alt](http://i.imgur.com/bXw0qhF.png)


* Routes:

```html
users/compare/vikram7/atsheehan
users/compare/atsheehan/vikram7
```
