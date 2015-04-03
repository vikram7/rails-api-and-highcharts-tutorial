#Outline / Rough Draft

##This tutorial will cover the following

* What is SVG? How do we use it?
* What is Highcharts?
* How do I make a Rails API?
* How do I hook up a Rails API with Highcharts?

##Show final example of what we're trying to do

* Screenshot
* Outline use cases clearly
* Why do we care about looking at this data? The importance of visualization. Yes, they are cool, but there is more to it.
* Dashboards with links to other resources on them

##Making graphs manually with SVG

SVG, or Scalable Vector Graphics, an XML-based vector graphics system for the web allows for a number of benefits: SVG images can scale and zoom without degradation, they can be written with anything that supports HTML (though they are often drawn with an imaging program) and they can even be searched and indexed!

For purposes of our discussion here, we are going to stick to a discussion of basic shapes like circles and rectangles, even though SVG can be used for much more. So how do we make images appear on an `html` page?

Let's make a basic html index page called `index.html`, which we will be updating:

```html
<html>
  <body>
    <h1>My First SVG</h1>
  </body>
</html>
```

This should be pretty straight forward. We're just creating an `index.html` file that results in the following output when opening up in the browser:

![alt](http://i.imgur.com/ZIglSO8.png)

Great, so we'll start updating our `index.html` file with an SVG image. Let's try something simple like a line. To be able to do that, let's stop for a second and discuss the SVG coordinate system. The SVG coordinate system is a little different from the kind of *x-y* *Cartesian* coordinate system we are familiar with. You probably saw lots of graphs like these in high school:

![alt](http://accelerateu.org/resourceguides/math/m8_38.gif)

The coordinate `(0,0)` is at the bottom left of graph, and each step forward in *x* would be a move directionally *right* and each step forward in *y* would be a move directionally *up*.

The SVG coordinate system, which we'll call the SVG *canvas*, is a bit different. While *x* refers to horizontal direction and *y* refers to vertical direction in the SVG canvas (much like the Cartesian system), the coordinate `(0,0)` differs in that it is at the top left of the coordinate system:

![alt](http://media.creativebloq.futurecdn.net/sites/creativebloq.com/files/images/2013/05/Hannah/canvas1.jpg)

Why the coordinate system starts at the top left corner is not incredibly important, but keep in mind that the *y* coordinate is reversed compared to the Cartesian system (if you are interested in reading more about the *why*, see this [link](http://gamedev.stackexchange.com/a/83571) for an explanation). This means that *y* moves vertically down when its value goes up.

So let's actually draw something! First, we have to create an SVG canvas for us in our `index.html` file:

```html
<html>
  <body>
    <h1>My First SVG</h1>
    <svg width="100" height="100">
    </svg>
  </body>
</html>
```

What this says is we are creating a canvas with width `100` and height `100`. Within that canvas, we can draw whatever we want. A *canvas* here is just like a canvas an artist might use: a physical area to draw in.

A line is probably one of the simpler things we can draw:

```html
<html>
  <body>
    <h1>My First SVG</h1>
    <svg width="100" height="100">
      <line x1="0" y1="100" x2="100" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
    </svg>
  </body>
</html>
```

Before we discuss the code, let's see what it looks like on the screen:

![alt](http://i.imgur.com/PXEAKJ1.png)

Our code is pretty straightforward. One point is at `(0, 100)` and the line is drawn from there to `(100, 100)`. The rest of the code is for the color (red) and the thickness of the line. What if we wanted to draw a line from the top left corner of the canvas to the bottom right? First, we have to figure out the coordinates. The top left corner is `(0, 0)` and the bottom right corner is `(100, 100)`. Let's try that in our code and see how it looks:

```html
<html>
  <body>
    <h1>My First SVG</h1>
    <svg width="100" height="100">
      <line x1="0" y1="0" x2="100" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
    </svg>
  </body>
</html>
```

The above code translates into the following:

![alt](http://i.imgur.com/K4WyTEf.png)

Great! So we know how to draw a line, but how can we do more? Let's try a circle. SVG is pretty convenient. We just need to define a circle by location, radius and color and we're good to go:

```html
<html>
  <body>
    <h1>My First SVG</h1>
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="20" stroke="black" stroke-width="4" fill="blue" />
    </svg>
  </body>
</html>
```

We are defining a circle with *x* and *y* locations at point `(50, 50)` on the canvas, with a radius of 20, a border of black, stroke width of 4 and fill of the color blue, which looks like this:

![alt](http://i.imgur.com/bpq4xWV.png)

Let's add a second circle. Stop for a second and think about how we can do that. Yep, it's that easy. Just another line of code:

```html
<html>
  <body>
    <h1>My First SVG</h1>
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="20" stroke="black" stroke-width="4" fill="blue" />
      <circle cx="75" cy="75" r="20" stroke="black" stroke-width="4" fill="green" />
    </svg>
  </body>
</html>
```

And now on the screen:

![alt](http://i.imgur.com/dpJHLAc.png)

Nice! Now we have two beautiful circles on our canvas. We can add multiple circles but you'd basically have to draw each additional shape manually to generate the image. For a scatterplot, this could result in ridiculously long code:

```html
<svg width="100" height="100">
  <line x1="0" y1="100" x2="100" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
  <line x1="0" y1="0" x2="0" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
  <circle cx="60.0" cy="30.0" r="1" stroke="green" stroke-width="4" fill="yellow" />
  <circle cx="40.0" cy="60.0" r="1" stroke="green" stroke-width="4" fill="yellow" />
  <circle cx="50.0" cy="40.0" r="1" stroke="green" stroke-width="4" fill="yellow" />
</svg>
```

We could try to be clever and write some Ruby code to generate the html code for us based on some inputs (just using random inputs here to make a point):

```ruby
points = Array.new

25.times do
  x = rand(100)
  y = rand(100)
  points << [x, y]
end

svg_string = ""
points.each do |point|
  svg_string += "<circle cx=\"#{point.first}\" cy=\"#{point.last}\" r=\"1\" stroke=\"green\" stroke-width=\"1\" fill=\"yellow\" />\n"
end
```

If we stick the string generated in `svg_string` in our `index.html` file, it would look like this:

```html
<html>
  <body>
    <h1>My First SVG</h1>
    <svg width="100" height="100">
      <line x1="0" y1="100" x2="100" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
      <line x1="0" y1="0" x2="0" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
      <circle cx="9" cy="87" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="32" cy="99" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="74" cy="89" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="43" cy="60" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="17" cy="86" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="47" cy="20" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="28" cy="75" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="86" cy="57" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="66" cy="95" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="86" cy="33" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="0" cy="1" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="78" cy="80" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="66" cy="46" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="80" cy="62" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="45" cy="73" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="50" cy="18" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="74" cy="10" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="74" cy="21" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="37" cy="36" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="92" cy="47" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="39" cy="5" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="53" cy="30" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="10" cy="40" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="12" cy="77" r="1" stroke="green" stroke-width="1" fill="yellow" />
      <circle cx="60" cy="78" r="1" stroke="green" stroke-width="1" fill="yellow" />
    </svg>
  </body>
</html>
```

That would generate the following scatter plot:

![alt](http://i.imgur.com/qYzNgTB.png)

It's a start! But that's a whole lot of work just to generate a single scatter plot. Plus it doesn't even look that nice. What if I need to make many scatter plots or want to style and color them differently? There has to be an easier way!

##Enter data visualization

In fact, there are a few ways we can have data visualized pretty easily.

[Link](http://www.highcharts.com/docs/getting-started/installation) to Highcharts installation. It's got a pretty good explanation of how to get started with Highcharts. We're just going to follow the directions here as an easy point of reference. First, let's setup our `index.html` file to *require* highcharts:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="http://code.highcharts.com/highcharts.js"></script>
  </head>

  <body>

  </body>
</html>
```

Now, let's add the code per the discussion [here](http://www.highcharts.com/docs/getting-started/your-first-chart):

`index.html`:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="http://code.highcharts.com/highcharts.js"></script>
    <script src="js/chart.js"></script>
  </head>

  <body>
    <div id="container" style="width:100%; height:400px;"></div>
  </body>

</html>
```

We also create a folder called `js` where we store our javascript scripts. We'll name ours `chart.js` and place the code from the Highcharts [site]

`js/chart.js`:

```javascript
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
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
});
```

This is what our directory structure should look like:

```
.
├── index.html
├── js
│   └── chart.js

1 directory, 2 files
```

If we load up `index.html`, we should see the following chart:

![alt](http://i.imgur.com/F39z4Xt.png)

Let's look back above at our `script.js` file and see what's going on. `series` determines the data that we see in our chart. If we change our `series` in our `chart.js` file as follows with some MMA fighters and values, let's see how our chart is updated.

```javascript
        series: [{
            name: 'Ronda Rousey',
            data: [5, 5, 5]
        }, {
            name: 'Jon Jones',
            data: [8, 7, 8]
        }]
```

And the updated chart:

![alt](http://i.imgur.com/ktnUOnX.png)

Great! Seems pretty straight forward. Highcharts seems like a good option. Can we use it for a scatter plot? Navigating to [jsfiddle](http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/scatter/) on the Highcharts [demo](http://www.highcharts.com/demo/scatter) site can help us out here. Let's take a look at the code provided and see if we can adjust it for the random scatter plot we looked at with SVG:

```javascript
$(function () {
    $('#container').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
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
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Female',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]

        }, {
            name: 'Male',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
                [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
                [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
                [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
                [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
                [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
                [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
                [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
                [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
                [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
                [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
                [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
                [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
                [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
                [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
                [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
                [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
                [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
                [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
                [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
                [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
                [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
                [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
                [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
                [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
                [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
                [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
                [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
                [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
                [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
                [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
                [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
                [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
                [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
                [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
                [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
                [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
                [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
                [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
                [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
                [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
                [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
                [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
                [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
                [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
                [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
                [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
                [180.3, 83.2], [180.3, 83.2]]
        }]
    });
});
```

If we replace our `chart.js` file with the above javascript code, our page will have the following scatter plot:

![alt](http://i.imgur.com/GQDs0XM.png)

Basically, we are charting female and male height and weight distributions. Let's mess around with our data and see how our scatter plot could look. We'll delete either female or male, rename the remaining one to something else, and change the height and weight to reflect the scatter plot we generated as an SVG.

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

Here, we changed axis variable names and are pretending to compare data based on two users. We're using the same numbers that were generated randomly as our SVG example and updating the `series` data with it. Seems a little cleaner than before. Let's look at the output:

![alt](http://i.imgur.com/JYbWV5e.png)

The graph also looks a bit nicer than our SVG one! As you can tell, highcharts gives us some nice options, especially for pre-built libraries of charts. Take a look at the Highcharts [demo](http://www.highcharts.com/demo) site to see other examples you can make with the library.

* Why do we want to visualize data?
* How can we visualize data?
* Using data we have, we create a graph with HighCharts.
* can we pass json data to highcharts?
* End of this section. We can't keep doing this by hand. Say we have dynamic data. What do we do?

##Interlude: Rails API Generation

* Overview of data we have
* Turning it into a json
* Activemodel Serializer
* Rails API generation
* Routes:

```html
users/compare/vikram7/atsheehan
users/compare/atsheehan/vikram7
```

* This section can also come first under "Building a Rails API"

##Dynamic data

* Hitting the api to generate the graphics dynamically
