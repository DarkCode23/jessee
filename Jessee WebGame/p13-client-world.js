/*=================================================

PART 13: Draw the asteroids and stars

Let's build our client world. It will be a little
simpler than our server's "World".
So let us begin!

=================================================*/

var world = {
  
/*=================================================

First we will create our starfield. We can create 
our starts in the client because they don't change
the gameplay and don't need to be the same everywhere.
We need an array to store their positions.

=================================================*/

  stars: [],

/*=================================================

Time to create a bunch of starts with a random 
position in our world. Let's assign a random Z
axis values relative to our camera position.
This will give us a nice visual effect.

=================================================*/

  buildStars: function () {
    for (var i=0; i<64; i++) {
      world.stars.push({
        x: Math.random() * world.width,
        y: Math.random() * world.height,
        z: (0.5-Math.random()) * draw.camera.position.z
      });
    }
  },

/*=================================================

If the user resizes the browser window, we want
to keep our game screen fitting all available
scale. There are two possibilities for the
screen ratio: portrait and landscape.
I'll create a "c" camera variable just to keep 
the code short.

=================================================*/

  resize: function() {
    var c = draw.camera;

/*=================================================

To check for the window ratio we need to compare it 
to our game world ratio, so let's calculate them both.

=================================================*/

    var windowRatio = innerWidth / innerHeight;
    var worldRatio = world.width / world.height;

/*=================================================

If we are in portrait mode, we want our canvas to
have same width as the browser inner window. The
height will be calcutated with the ratio.

=================================================*/

    if (windowRatio < worldRatio) {
      canvas.width = innerWidth;
      canvas.height = canvas.width / worldRatio;

/*=================================================

To scale our drawings and make them fit the screen
we just have to adjust our camera lens zoom.

=================================================*/

      c.lens.z = c.position.z * (innerWidth / world.width);

    } /* close if portrait ratio */
    
/*=================================================

Now we do the same for the landscape mode.

=================================================*/

    else {
      canvas.height = innerHeight;
      canvas.width = canvas.height * worldRatio;
      c.lens.z = c.position.z * (innerHeight / world.height);
    }

/*=================================================

Last we set our camera lens to keep it on the 
center of the screen.

=================================================*/

    draw.camera.lens.x = canvas.width / 2;
    draw.camera.lens.y = canvas.height / 2;

  }, /* close resize function */

/*=================================================

So we have two things to draw in our world, the 
asteroids and the starts. Since we already
implemented the draw methods we just need to
loop through each array and choose our colors.

=================================================*/

  draw: function () {
    world.asteroids.forEach(function(a) {
      draw.circleMirrored('grey', a);
    });
    world.stars.forEach(function(s) {
      draw.dotMirrored('white', s);
    });
  },

/*=================================================

Last we start our client world. We need to call
the function we created earlier to build our 
starfield. We also call the resize function one
first time and attach it to the propper event.

=================================================*/

  start: function () {
    world.buildStars();
    world.resize();
    window.addEventListener('resize', world.resize);
  }

}; /* close world global var */