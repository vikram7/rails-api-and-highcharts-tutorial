#Making graphs manually with SVG

SVG, or Scalable Vector Graphics, an XML-based vector graphics system for the web allows for a number of benefits: SVG images can scale and zoom without degradation, they can be written with anything that supports HTML (though they are often drawn with an imaging program) and they can even be searched and indexed!

For purposes of our discussion here, we are going to stick to a discussion of basic shapes like circles and rectangles, even though SVG can be used for much more. You can read more about SVG [here](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics).

So how do we make images appear on an `html` page?

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

Great. So we'll start updating our `index.html` file with an SVG image. Let's try something simple like a line. To be able to do that, let's stop for a second and discuss the SVG coordinate system. The SVG coordinate system is a little different from the *x-y* *Cartesian* coordinate system we are familiar with. You probably saw lots of graphs like these in high school:

![alt](http://accelerateu.org/resourceguides/math/m8_38.gif)

The coordinate `(0,0)` is at the bottom left of graph, and each step forward in *x* would be a move directionally *right* and each step forward in *y* would be a move directionally *up*.

The SVG coordinate system, which we'll call the SVG *canvas*, is a bit different. While *x* refers to horizontal direction and *y* refers to vertical direction in the SVG canvas (much like the Cartesian system), the coordinate `(0,0)` differs in that it is at the top left of the coordinate system:

![alt](http://media.creativebloq.futurecdn.net/sites/creativebloq.com/files/images/2013/05/Hannah/canvas1.jpg)

Why the coordinate system starts at the top left corner is not incredibly important, but keep in mind that the *y* coordinate is reversed compared to the Cartesian system (if you are interested in reading more about the *why*, see this [link](http://gamedev.stackexchange.com/a/83571) for an explanation). This means that *y* moves vertically down on the screen when its value goes up.

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

Great! So we know how to draw a line, but can we do more? Let's try a circle. SVG is pretty convenient. We just need to define a circle by location, radius and color and we're good to go:

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

Let's add a second circle. Stop for a second and think about how we can do that.

Yep, it's that easy. Just another line of code:

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

Nice! Now we have two beautiful circles on our canvas. We can add multiple circles but you'd basically have to draw each additional shape manually to generate the image:

```html
<svg width="100" height="100">
  <line x1="0" y1="100" x2="100" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
  <line x1="0" y1="0" x2="0" y2="100" style="stroke:rgb(255,0,0);stroke-width:1" />
  <circle cx="60.0" cy="30.0" r="1" stroke="green" stroke-width="4" fill="yellow" />
  <circle cx="40.0" cy="60.0" r="1" stroke="green" stroke-width="4" fill="yellow" />
  <circle cx="50.0" cy="40.0" r="1" stroke="green" stroke-width="4" fill="yellow" />
</svg>
```

For a scatterplot, this could result in ridiculously long code. We could try to be clever and write some Ruby code to generate the html code for us based on some inputs (just using random inputs here to make a point):

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

It's a start! But that's a whole lot of work just to generate a single scatter plot. Plus it doesn't even look that nice. What if I need to make a bunch of scatter plots or want to style and color them differently? There has to be an easier way! We'll look at that easier way in the next section on Highcharts, a Javascript charting library.

The Highcharts Javascript Charting Library: [Part 2](02-highcharts.md)
