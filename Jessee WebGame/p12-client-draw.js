/*================================================

PART 12: Drawing on the canvas

It's time to draw our ships and asteroids on 
the screen. To achieve that we are going to use
the canvas API.
https://www.w3schools.com/html/html5_canvas.asp

The first thing to do is to get the context, this
is where all canvas methods are stored.
We will use the '2d' context that allow us to draw
lines, arcs, images, rectangles, etc. 

The other possible values for the context are: 
"webgl" and "webgl2" that produce a 3d context
and "bitmaprenderer" that draw image bitmaps.
Maybe someday I'll alsowrite a tutorial for them.

=================================================*/

var ctx = canvas.getContext('2d');

/*================================================

Now let's create our "draw" global variable to
hold our beautyful art.

=================================================*/

var draw = {
  
/*================================================

To start simple, let's create a function to draw
a single colored line. First we project each
point to our camera then we use the canvas API
to stroke a 2px width line.

=================================================*/

  line: function (color,start,end) {
    ctx.lineWidth = 2;
    var s = draw.projectToCamera(start);
    var e = draw.projectToCamera(end);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();
    ctx.closePath();
  },

/*================================================

Easy peasy, now let's make a circle. As before,
fist we project the center point. Let's make our
circles line width equal to one pixel; 

=================================================*/

  circle: function (color, circle) {
    ctx.lineWidth = 1;
    var c = draw.projectToCamera({
      x: circle.x,
      y: circle.y
    });

/*================================================

Not let's calculate the radius projection.

=================================================*/

    var radiusPoint = draw.projectToCamera({
      x: circle.x + circle.r, y: circle.y
    });
    c.r = radiusPoint.x - c.x;

/*================================================

And let's use the canvas API to draw an full arc.

=================================================*/

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
    ctx.stroke();
    ctx.closePath();
  },

/*================================================

That was too easy, come on. Let's make something 
fancier, shall we? Let's make a function that will
draw in 3D! All we gotta do is to scale the size 
of our 3D points, I mean stars, along their Z axis.
Then we can just use the fill rectangle function.

=================================================*/

  dot: function (color, p3d) {
    ctx.fillStyle = color;
    var size = 1 + (p3d.z/5);
    var p = draw.projectToCamera(p3d);
    ctx.fillRect(p.x,p.y,size,size);
  },

/*================================================

Now you are wondering how that project function
works right? If you never heard about a projection
don't worry, I got you covered.
https://en.wikipedia.org/wiki/3D_projection

First we need a camera object with a few values;

=================================================*/

  camera: {
    position: {x: 16, y: 16, z: 10},
    rotation: {x: -Math.PI, y: 0, z: 0},
    lens: {x: 150, y: 75, z: 400}//pan XY zoom Z
  },

/*================================================

Now let's break the project function down.
I'll store the camera for brevity.

=================================================*/

  projectToCamera: function (p) {
    var c = draw.camera;

/*================================================

If our point don't have a Z axis value, let's 
assume it's equal to 0.

=================================================*/

    if (!p.z) p.z = 0;

/*================================================

First we pre-store our camera rotation cosines 
for performance reasons.

=================================================*/

    var cos = {
      x: Math.cos(c.rotation.x),
      y: Math.cos(c.rotation.y),
      z: Math.cos(c.rotation.z)
    };

/*================================================

Now we store the distance between the camera and
the point, that's a simple subtraction. 

=================================================*/

    var a = {
      x: p.x - c.position.x,
      y: p.y - c.position.y,
      z: p.z - c.position.z
    };

/*================================================

We need to project each distance, for that we need
our old friend Euler. More specifically his works
on how to orient rigid bodies.

If you love maths and wanna dive real deep, go on:
https://en.wikipedia.org/wiki/Euler_angles

If you think you already are too deep then just
keep this image in your mind:
https://en.wikipedia.org/wiki/File:EulerProjections.svg

We will first multiply each XY distance
by the cosine of the Z axis camera rotation.
Since our camera rotation is locked pointing 
down to the XY plane with no Z rotation, 
this cosine value is always equal to one,
so it won't change anything.

Then we scale our distance X by the cosine 
of the Y rotation. This is also always 
equal to one, meaning no changes are made 
to our X distances.

Next we scale the Y value by the X axis cosine.
Since we rotated our camera around the X axis,
this value will be always equal to minus one.
So our Y distances will be negated, top becomes
bottom and bottom becomes top.

=================================================*/

    var d = {
      x: a.x * cos.z * cos.y,
      y: a.y * cos.z * cos.x,

/*================================================

Now we can scale the Z distance by X and Y cosines.
This will also negate the Z values.

=================================================*/

      z: a.z * cos.x * cos.y
    };

/*================================================

That was the most complex part of this function.
I'll admit that it's hard to grasp. But if you
are still here, that means you've understood it
a little better right?

Now that everything is projected we still need to
scale the distances with our camera zoom. 
This will make the illusion that our stars that 
are further away from the camera are moving slower.
To do that we are gong to need a scale factor.

=================================================*/

    var factor = c.lens.z / d.z;

/*================================================

If our "d.z" value is equal to zero we will have a
math problem. It's not possible to divide by zero,
and here's why:
https://en.wikipedia.org/wiki/Division_by_zero

That will happen when the point has the same
Z value as the camera zoom.
In our game this wont happen because our camera
Z value is greater then all other values.

But just to keep our code error free, let's
avoid this scenario with a simple if statement 
and just set our factor to zero. That's the
engineers way of solving problems, deal with it
mathematicians 😂

=================================================*/

    if (d.z == 0) factor = 0;

/*================================================

Now we can calculate our 2d point by this factor. 
The last thing to do is add our lens XY positions 
to pan the image to the center of the screen.

=================================================*/

    var d2 = {
      x: (factor * d.x) + c.lens.x,
      y: (factor * d.y) + c.lens.y
    };

/*================================================

Now we can return our projected point to be drawn.

=================================================*/

    
    return d2;

  }, /* close projectToCamera function */

/*================================================

That was great, we can now draw all of our game
stuff, so let's draw our ship. It'll have a diamond 
shape, one triangle for the front and one for
the back. Let's give those triangle points
some names:

            X p1
           X X
          X | X
         X  |  X
        X   |   X
       X    |    X
      X     |     X
     X      |      X
 p2 X-------O------ X p3
      X     |     X
        X   |   X
          X | X
            X p4
                  
That's a pretty ship right? If you think you
can do better go on and edit this function!

=================================================*/

  ship: function(s, color) {

    ctx.lineWidth = 2;

/*================================================
                  
First lets calculate our rotation projections for
points p1 and p4, they will be translated 
vertically in relation to our ship position.

=================================================*/

    var vertical = {
      x: (s.h / 2) * Math.sin(s.a),
      y: (s.h / 2) * Math.cos(s.a)
    };

/*================================================
                  
Now lets calculate our projections for points 
p2 and p3, they will be translated 
horizontally in relation to our ship.

=================================================*/

    var horizontal = {
      x: (s.w / 2) * Math.sin(s.a+(Math.PI/2)),
      y: (s.w / 2) * Math.cos(s.a+(Math.PI/2))
    };

/*================================================
                  
In order to change the ship dimension with the
player customization, we will calcutate some
bonus dimensions. 

We will start with add a minimum value and add
the bonus values. Since the bonus value is too
big, from 0 to 100, we will scale it down with
a division. 

=================================================*/

    var attackBonus = 1.2 + (s.attack/100);
    var speedBonus = 0.2 + (s.speed/150);

/*================================================
                  
We will invert the control bonus value with a
subtraction because we want small fast ships
and large slow ships.

=================================================*/

    var controlBonus = 1.4 - (s.control/100);

/*================================================
                  
Now we have everything we need to calculate all 
of our four ship points. First let's do the 
vertical points p1 and p4.

=================================================*/

    var p1 = {
      x: s.x + (attackBonus * vertical.x),
      y: s.y + (attackBonus * vertical.y)
    };
    
    var p4 = {
      x: s.x - (speedBonus * vertical.x),
      y: s.y - (speedBonus * vertical.y)
    };

/*================================================
                  
Now we calculate our horizontal points p2 and p3.

=================================================*/

    var p2 = {
      x: s.x + (controlBonus * horizontal.x),
      y: s.y + (controlBonus * horizontal.y)
    };
    var p3 = {
      x: s.x - (controlBonus * horizontal.x),
      y: s.y - (controlBonus * horizontal.y)
    };

/*================================================
                  
And last we can draw all our ship lines.

=================================================*/

    draw.lineMirrored(color, p1, p2);
    draw.lineMirrored(color, p1, p3);
    draw.lineMirrored(color, p4, p2);
    draw.lineMirrored(color, p4, p3);

  }, /* close ship function */

/*================================================

To create the infinity illusion we will create
8 mirrored images. For this to work we have to 
make sure our camera is far enough.
It will look like this:  

  M M M
  M O M
  M M M

I see a loop there, and some mother issues 😅
So the middle image is our origin. In our loop,
that's when x and y are equal to 0.

=================================================*/

  dotMirrored: function (color, p) {
    for (var x=-1; x<=1; x++) {
      for (var y=-1; y<=1; y++) {
         var mp = {
          x: p.x+(x*world.width),
          y: p.y+(y*world.height),
          z: p.z
        };
        draw.dot(color, mp);
      }
    }
  },

/*================================================

That's a great effect, we will use it on our stars.
Let's use it on our circles as well. We will use 
this function to draw our bullets and asterois.

=================================================*/
  
  circleMirrored: function (color, c) { 
    for (var x=-1; x<=1; x++) {
      for (var y=-1; y<=1; y++) {
         var mc = {
          x: c.x+(x*world.width),
          y: c.y+(y*world.height),
          r: c.r
        };
        draw.circle(color, mc);
      }
    }
  },

/*================================================

We also need mirrored lines to apply this effect
on our ships.

=================================================*/

  lineMirrored: function (color, s, e) {
    for (var x=-1; x<=1; x++) {
      for (var y=-1; y<=1; y++) {
         var start = {
          x: s.x+(x*world.width),
          y: s.y+(y*world.height),
          z: s.z
        };
         var end = {
          x: e.x+(x*world.width),
          y: e.y+(y*world.height),
          z: e.z
        };
        draw.line(color, start, end);
      }
    }
  },

/*================================================

Now let's draw our bullets. We just need a forEach
loop and our last function.

=================================================*/

  bullets: function (bullets, color) {
    bullets.forEach(function(b) {
      draw.circleMirrored(color, b);
    });
  },

/*================================================

To create custom RGB (red, gree and blue ) colors
we will use the customization values. 
If you are not familiar with RGB take a look here:
https://en.wikipedia.org/wiki/RGB_color_model

Let's use the attack for our red channel, the 
speed for the green and the control for the blue.

Since the customization values go from 0 to 100
we need to scale them. 

=================================================*/

  color: function (p) {
        var r = p.attack*2.5;
        var g = p.speed*2.5;
        var b = p.control*2.5;
    return 'rgba('+r+','+g+','+b+',1)'
  },
  
/*================================================

Last we will make our main draw function, it will
clear the canvas with the "clearRect" method and
draw all players and asteroids.

We will create the "player.draw" method on our
next lesson and the "world.draw" will be 
implemented on lesson 13. 

=================================================*/
  
  scene: function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    world.draw();
  }
  
}; /* close draw global var */