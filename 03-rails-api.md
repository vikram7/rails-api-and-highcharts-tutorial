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

```
1. Install the Rails API gem
2. Generate a new Rails API app and update our Gemfile.
3. Create our backend database and write associated migrations.
4. Write a seed file to populate our database.
5. Write controllers to deliver the data based on some set of requirements implementing ActiveModel Serializer.
```

Sounds complicated? It's not that bad. Let's get started.

####Install the Rails API gem

```
gem install rails-api
```

The gem has some great [documentation](https://github.com/rails-api/rails-api) that you should take a look at.

####Generate a new Rails API app and update our Gemfile.

```
rails-api new beer -T --database=postgresql
```

* Routes:

```html
users/compare/vikram7/atsheehan
users/compare/atsheehan/vikram7
```
