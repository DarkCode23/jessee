/*=================================================

PART 5: Building our world

Now the first thing to do is to build our world.
To keep everything well organized, I'm going to
store all our map values, in a single object.

=================================================*/

var map = {
  width: 32,
  height: 32,
  asteroidsCount: 15
};

/*================================================

The only thing in our map that we need to build 
before any player connects are the asteroids.
So let's create a function that will do just that.

We are going to define this function 
outside the"module.exports" because we want 
to call it in our exports definition.

=================================================*/

var buildAsteroids = function () {

/*================================================

We need an empty array to store our asteroids.

=================================================*/

  var array = [];

/*================================================

Now we are going make a for loop to repeat our
asteroid creation "n" times.

=================================================*/

  for (var i = 0; i < map.asteroidsCount; i++) {

    var a = {

/*================================================

Each asteroid need to have a random position on
the map. Since "Math.random()" returns a number
from 0 to 1* we need to multiply this random
number by the dimensions we have (width and height)
to place our asteroid on a random position.

* It's actually 0.999... but it's way easier to
think it's just one.

=================================================*/

      x: Math.random() * map.width,
      y: Math.random() * map.height,

/*================================================

Now let's assign some random speed values to make
our asteroid move. First we subtract our random
value from 0.5, this will result in a random value
from -0.5 to 0.5. We need those negative values
otherwise our asteroid will only move left or down.

Then we multiply the random speed by a small number 
to make our asteroid move a little slower.

=================================================*/

      vx: (0.5 - Math.random()) * 0.05,
      vy: (0.5 - Math.random()) * 0.05,

/*================================================

The last value our asteroid need is a radius.
We start with a positive value, that will define
the minimum radius accepted (0.25). We add to
this minimum a random number from 0 to 1.5, and
we have finished creating the asteroid.

=================================================*/

      r: 0.25 + (Math.random() * 1.5)

    };  /* close asteroid */

/*================================================

Now we add our new asteroid to our array.

=================================================*/

    array.push(a)

/*================================================

Don't forget to close the for loop. And lastly we
return our array full of asteroids.

=================================================*/

  } /* close for loop */

  return array;

}; /* close buildAsteroids function */


/*================================================

Now let's export our map values, asteroids and
create a few methods.

=================================================*/

module.exports = {
  map: map,
  asteroidsList: buildAsteroids(),

/*================================================

Let's make our asteroids move!
To calculate their new positions we just need to 
add their velocity to each axis.

Note that "a += b" is the same as "a = a + b"

=================================================*/

  move: function (a) {
    a.x += a.vx;
    a.y += a.vy;
  },

/*================================================

We want our asteroids to stay inside the map limits.
I think the code here is self explainatory.

=================================================*/

  limit: function (a) {
    if (a.x < 0) a.x = map.width;
    if (a.x > map.width) a.x = 0;
    if (a.y < 0) a.y = map.height;
    if (a.y > map.height) a.y = 0;
  },

/*================================================

Our asteroids can collide with ships and their 
bullets. To achieve that let's make a function to
check for collisions.

=================================================*/

  collide: function (a, b) {

/*================================================

First we calculate the distance between the
asteroid "a" and the other object "b".

We have two distances, one for "x" and another 
for "y". Both are easiy calculated with a simple
subtraction. 

=================================================*/

    var dx = a.x - b.x;
    var dy = a.y - b.y;

/*================================================

That will provide us with the sides
of a triangle. The hypotenuse of this triangle
id our distance "d".

              (a)
               XXXXX        "d" = hypotenuse
               X    XXXXX
"y" distance   X         XXXXX
 (a.y - b.y)   X              XXXXX
               XXXXXXXXXXXXXXXXXXXXXXXX(b)
                    "x" distance
                     (a.x - b.x)

We can calculate "d" with some Pythagoras.
If you can't remember I'll refresh your memory:

  d² = x² + y² , that's the same as:

  d = Square root ( x*x + y*y )

=================================================*/

    var d = Math.sqrt((dx * dx) + (dy * dy));

/*================================================

If the final distance "d" is smaller than the 
sum of both radius (a.r + b.r), 
we can be sure that they are colliding.  

               ◜      ◝          ◜      ◝
   ◜  ◝   d                  ◜  ◝d                
     a==-------~~~~b            a=x~~~b  
   ◟  ◞                      ◟  ◞          
               ◟      ◞          ◟      ◞

=================================================*/
    
    return (d < (a.r + b.r));

  }, /* close collide function */

/*================================================

When a big asteroid is destroyed, it will spawn two
smaller and faster asteroids on the same position
of the explosion.

=================================================*/

  smallAsteroids: function (a) {

/*================================================

If the radius is greater than one it's big!

=================================================*/

    if (a.r > 1) {
      
/*================================================

Now let's loop two times, it's not pretty but
it's better than ctrl+c and ctrl+v.

=================================================*/

      for (var i = 0; i < 2; i++) {
        this.asteroidsList.push({
          x: a.x,
          y: a.y,
          vx: (0.5 - Math.random()) * 0.2,
          vy: (0.5 - Math.random()) * 0.2,
          r: 0.2 + (Math.random() * 0.4)
        });

      } /* close for loop */

    } /* close if statement */
    
  }, /* close smallAsteroids funtion */

/*================================================

Our last map method is pretty simple, it will
calculate the new positions of our asteroids
and create a pack with all this data.
We'll send this pack to all of our players in
the server main loop in lesson 7. 

=================================================*/

  buildPack: function () {
    
/*================================================

Before we build our list, let's make sure there
are asteroids to be sent. If the list is empty
that means all our asteroids are destroyed, so
we use our buildAsteroids function again.

=================================================*/
    if (!this.asteroidsList.length) {
      this.asteroidsList = buildAsteroids();
    }

/*================================================

We are going to do pretty much the same as
in the previous buildAsteroids function.
Create an empty array and loop over the current
number of asteroids. Instead of a for loop let's 
use the "forEach" method:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

=================================================*/

    var asteroidsPack = [];

    var world = this;

    this.asteroidsList.forEach(function(a) {

/*================================================

Now we use our move and limit function to calculate
new positions and make sure our asteroids are 
inside our map limits.

=================================================*/

      world.move(a);
      world.limit(a);

/*================================================

And finnaly we copy only our new positions inside
our pack. We don't need to send the velocities. 
After the end of the loop, we can send the pack 
to our main loop in lesson 1;

=================================================*/

      asteroidsPack.push({
        x: a.x, y: a.y, /* positions (x,y) */
        r: a.r          /* radius */
      });

    }); /* close forEach loop */

    return asteroidsPack;

  } /* close buildData function */

}; /* close module.exports */

/*================================================

Now that we have a galaxy full of asteroids,
let's make our ships and let our players 
shoot and destroy them! Go on to the next
lesson: "p06-player-management.js"

=================================================*/