##Interlude: Rails API Generation

### The Rails API Roadmap?

Creating a Rails API is very similar to creating a Rails app. We will be following a very similar roadmap, but the data delivered from our controllers will be JSON data.

Here's a roadmap of how we will take the above data and deliver it in JSON format:

```
1. Install the Rails API gem
2. Generate a new Rails API app and update our Gemfile.
3. Create our backend database and write associated migrations.
4. Update the `routes.rb` file to contain routes we care about.
5. Write a seed file to populate our database.
6. See what our data looks like when we hit our API.
7. Implement ActiveModel Serializers to generate custom JSON data
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
styles = ["IPA", "Stout", "Lager", "Wheat Beer"]

styles.each do |style|
  Style.create!(name: style)
end

style = Style.find_by(name: "IPA")
Beer.create!(name: "Heady Topper", style_id: style.id)
Beer.create!(name: "Pretty Things IPA", style_id: style.id)

style = Style.find_by(name: "Stout")
Beer.create!(name: "Guinness", style_id: style.id)
Beer.create!(name: "Chocolate Stout", style_id: style.id)

style = Style.find_by(name: "Lager")
Beer.create!(name: "Brooklyn Lager", style_id: style.id)
Beer.create!(name: "Yuengling", style_id: style.id)

style = Style.find_by(name: "Wheat Beer")
Beer.create!(name: "Hefeweizen", style_id: style.id)
Beer.create!(name: "Dunkelweizen", style_id: style.id)
```

We've now seeded our database with some styles and beers. Play around in `rails console` to see look at various associations!

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

![alt](http://i.imgur.com/nrPOSzr.png)

Styles index page:

![alt](http://i.imgur.com/RzfiNaY.png)

Great! Our beers and styles are being delivered as JSON to their respective api/v1 index pages. Append `.json` to the end of each page and see what happens. Keep that in mind for the future!

####ActiveModel Serializers

Say we wanted to deliver the total number of beers by style when we access `/api/v1/styles`. How would we do that? We can take advantage of a tool called [ActiveModel Serializers](https://github.com/rails-api/active_model_serializers).

[Explanation of ActiveModel Serializers], see [json api org](http://jsonapi.org/)

We can pass a beers count directly into the Styles JSON when our user accesses `/api/v1/styles`. But first, we need to add a `serializers` directory to `app`. So let's make one for `Style` first:

`touch app/serializers/style_serializer.rb`

```ruby
class StyleSerializer < ActiveModel::Serializer
  embed :ids

  attributes :id, :name, :beers_count

  def beers_count
    object.beers.count
  end
end
```

Let's take a look at `/app/v1/styles` now!:

![alt](http://i.imgur.com/lAiLlEc.png)

Note that we're only delivering the *attributes* that we have specifically stated in our `Style` serializer: **id**, **name**, and **beers_count**. This is why we don't see the timestamps like we did before. We are being quite willful here and determining which attributes we want to pass on.

That seems like something we can chart, right? The *x*-axis would be the name of the style and the *y*-axis would be the number of beers of that particular style in the database.

ActiveModel Serializers seem pretty powerful! What else can we do? Well, we don't have a whole lot of data to play around with, but what if we had more?

Let's take a look at the data we have.

**By the way**, access to the extensive reviews from RateBeer which formed a large part of the database of this project could not have been possible without the assistance of Professor Julian McAuley of UCSD, who was was kind enough to share the data with me. More on his research around beer and recommendations can be found here: http://snap.stanford.edu/data/web-RateBeer.html. Note, please contact me directly as you will need access to the RateBeer data which the company has asked not to share publicly. I won't be sharing the entire data set, but snippets of it which you can use to create your own fake data to play with.

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

Normally it's not the best idea to drop databases and delete migrations, but since we don't really have any mission critical data, I'm going to be doing that right here. My seed data is comprehensive, so it's worth taking a moment and cleaning up what I need exactly. What tables will I need and what will their columns and associations be?

```
(1) Beer: id, name, style_id, abv
    has_many reviews, belongs_to style

(2) Style: id, name
    has_many beers

(3) User: id, profile_name
    has_many reviews, has_many beers through reviews

(4) Review: id, beer_id, user_id, taste, text
    belongs_to beer, belongs_to user
```

Those are all the models we'll need:

```ruby
class Beer < ActiveRecord::Base
  belongs_to :style
  has_many :reviews

  validates :name, presence: true, uniqueness: true
  validates :style, presence: true
end
```

```ruby
class Style < ActiveRecord::Base
  has_many :beers

  validates :name, presence: true, uniqueness: true
end
```

```ruby
class User < ActiveRecord::Base
  has_many :reviews
  has_many :beers, through: :reviews

  validates :profile_name, presence: true, uniqueness: true
end
```

```ruby
class Review < ActiveRecord::Base
  belongs_to :beer
  belongs_to :user

  validates :beer, presence: true
  validates :taste, presence: true
end
```

And these are the migrations we'll need:

```ruby
class CreateBeers < ActiveRecord::Migration
  def change
    create_table :beers do |t|
      t.string :name, null: false
      t.integer :style_id, null: false
      t.float :abv

      t.timestamps
    end

    add_index :beers, :name, unique: true
  end
end
```

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

```ruby
class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :profile_name, null: false

      t.timestamps
    end

    add_index :users, :profile_name, unique: true
  end
end
```

```ruby
class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.integer :beer_id, null: false
      t.integer :user_id, null: false
      t.float :taste, null: false
      t.text :text

      t.timestamps
    end

    add_index :reviews, :beer_id
    add_index :reviews, :user_id
  end
end
```

And here is the code to seed (`db/seeds.rb`) our database from a larger version of the CSV snippet provided above:

```ruby
require 'csv'

file = File.read('db/data/Ratebeer.csv')
csv = CSV.parse(file, :headers => true, :header_converters => :symbol)

count = 1
csv.each do |row|
  puts "Creating style with name: #{row[:style]}"
  style = Style.find_or_create_by!(name: row[:style])

  puts "Creating user with profile_name: #{row[:profile_name]}"
  if !User.find_by(profile_name: row[:profile_name])
    user = User.create!(profile_name: row[:profile_name])
  else
    user = User.find_by(profile_name: row[:profile_name])
  end

  puts "Creating beer with name: #{row[:name]}"
  beer = Beer.find_or_initialize_by(row.to_hash.slice(:name, :abv))
  beer.style = style
  beer.save!

  puts "Creating review"
  review = user.reviews.find_or_initialize_by(beer: beer)
  review_attrs = row.to_hash.slice(:taste, :text)
  review.update_attributes!(review_attrs)

  puts "Completed Row #:#{count}"
  count += 1
end
```



* Routes:

```html
users/compare/vikram7/atsheehan
users/compare/atsheehan/vikram7
```



See how valuable JSON data is in a format that we can do something with? Now let's actually chart some data!

