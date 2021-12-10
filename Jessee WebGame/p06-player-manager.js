/*=================================================

PART 6: Player management and game physics

This is the most important file in our game from
the player's perspective. Here we will calculate 
their ships positions, the bullets movement 
and all user input from keyboard and mouse.

Since we will reuse some functions from our
last lesson, let's import our previous file.

We will also import our socket lesson, to be able 
to send data through sockets. We will just use one
socket method here.

=================================================*/

var World = require('./p05-world.js');

/*=================================================

As before, lets put all our values in small
objects. That makes easier to remember where
each data is stored.

=================================================*/

var player = {

/*=================================================

Each player can either be in or out of the
user interface. That's where the player will
begin the game and where it's able to customize
their ship.

=================================================*/

  ui: true,

/*=================================================

To keep track of the mouse, we need a few values.

=================================================*/

  mouseX: 0, mouseY: 0,
  mouseIsOver: false,

/*=================================================

To track the keyboard, we just need an object.

=================================================*/

  keys: {},

/*=================================================

Here we store the player customization values.

=================================================*/

  attack: 50,
  speed: 50,
  control: 50,

/*=================================================

And each player will have a list of their bullets.

=================================================*/

  bullets: [],

/*=================================================

Each player will have his ship, with lots of
dimensions and movement values.

=================================================*/

  ship: {
    x: World.map.width / 2,  /* positions (x,y) */
    y: World.map.height / 2,
    w: 1.4, h: 1.5, /* width and height */

    /* Attack: */
    delay: 30,     /* delay between shots */
    cdelay: 0,     /* current delay */

    /* Speed: */
    cspeed: 0,     /* current speed */
    max: 0.0008,   /* maximum speed */
    motor: 0.0001, /* acceleration force */
    brake: 0.98,   /* speed reduction */
    vx: 0, vy: 0,  /* decomposed velocities (x,y) */

    /* Control: */
    a: 0,         /* current angle */
    va: 0,        /* current turning speed */
    turn: 0.015,   /* turning force */ 
    momento: 0.8, /* turning reduction */

  } /* close ship */

}; /* close player */

/*================================================

Now let's export our player manager,
it will have a list to store our players.

=================================================*/

module.exports = {
  list: {},

/*================================================

When a new player connects, we have to make
a new deep copy of our player variable and
give it his unique id. To achieve this deep
copy we use JSON. Read more about it here:
https://www.w3schools.com/js/js_json.asp

=================================================*/

  newPlayer: function (id, socket) {
    var p = JSON.parse(JSON.stringify(player));
    p.id = id;
    p.socket = socket;
    return p;
  },

/*================================================

We need a way for the user to custimze his ship.
Let's create a funtion to do just that.
This function will receive the data value 
from the socket.

When a player customize his ship, we receive his
customization data with sockets. This function just
puts all values received over the ones stored.

The pratical effect is the same as: 

  this.attack  = data.attack;
  this.speed   = data.speed;
  this.control = data.control;

Read more about the assign method here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

=================================================*/

  customize: function (p, data) {
    Object.assign(p, data);
  },

/*================================================

When a player click one of our buttons he will either
enter or leave the user interface. All we got to do 
is to set our "ui" flag to the data "state" value.

=================================================*/

  ui: function (p, data) {
    p.ui = data.state;
  },

/*================================================

We'll keep track of every key state inside the 
"keys" parameter.

=================================================*/

  keyPress: function(p, data){
	  p.keys[data.inputId] = data.state;
	},

/*================================================

To keep track of the mouse position we have two
functions. One will just store whether the mouse
is over the game screen.

=================================================*/

  mouseOver: function (p, data) {
    p.mouseIsOver = data.state;
  },

/*================================================

And the other will save the player cursor position.
If we receive a mouseMove event we know that the
mouse is over the screen, 
so we can flag mouseIsOver to true.

=================================================*/

  mouseMove: function (p, data) {
    p.mouseX = data.x;
    p.mouseY = data.y;
    p.mouseIsOver = true;
  },

/*================================================

Now let's make out ships move!
Again I'm gonna create a "s" variable just for
code brevity. 

=================================================*/

  move: function (p) {
    var s = p.ship;

/*================================================

We need to adjust the speed customization value
that goes from 0 to 100. That's way too much.
So we just multiply it by a very small number.

=================================================*/

    var speedBonus = (p.speed * 0.00015);

/*================================================

If the player is pressing up and his speed is
smaller than the maximum speed, we make it move.
We add a quarter of the bonus to the maximum speed.

To calculate the current speed we add the motor
and the bonus value to the current speed.

=================================================*/

    if (p.keys['up'] && s.cspeed < s.max + (speedBonus/4)) {
      s.cspeed += (s.motor + speedBonus);
    } 

/*================================================

If the player is not pressing up or his speed is
greater than the maximum speed, we make it break.

To calculate the break speed we multiply the 
current speed by the brake value. This works
beacuse our break value is smaller than one.

=================================================*/

    else {
      s.cspeed *= s.brake;
      
/*================================================

We also need to reduce the composite velocities.

=================================================*/

      s.vx *= s.brake;
      s.vy *= s.brake;

    } /* close else */

/*================================================

To calculate our composite velocities we need some
trigonomery. If you are not familiar with sine and 
cosine functions, you can learn a lot here:
https://en.wikipedia.org/wiki/Trigonometric_functions

=================================================*/

    s.vx += s.cspeed * Math.sin(s.a);
    s.vy += s.cspeed * Math.cos(s.a);

/*================================================

Now we just need to add our velocities to the
ship position.

=================================================*/

    s.x += s.vx;
    s.y += s.vy;

  }, /* close move function */


/*================================================

Now let's make the turning mechanics. 
I'll create a pi2 variable for code brevity.

=================================================*/

  turn: function (p) {
    var s = p.ship;
    var pi2 = Math.PI*2;

/*================================================

Let's calculate the angle that the ship will rotate.
Again we will reduce the bonus value that's between
1 and 100, just like we did for the speed bonus.
We add this reduced value to the ship's default turn.

=================================================*/

    var turnAngle = s.turn + (p.control * 0.001);

/*================================================

The player can control with keys or mouse movement.
If the mouse is NOT over the game canvas we will use
the keyboard input. 

=================================================*/

    if (!p.mouseIsOver) { 

/*================================================

If one of the control keys is pressed we will receive
this data in our keyPress function and store in 
the keys object; If it's set to true, that means
we can add our turnAngle value to our velocity angle.

=================================================*/

      if (p.keys['left'])  s.va = turnAngle * -1;

/*================================================

To turn around the other way we just need to
multiply by -1;

=================================================*/

      if (p.keys['right']) s.va = turnAngle;

/*================================================

If no turn keys are pressed we want our ship to
stop spinning.

=================================================*/

      else s.va *= s.momento;

    } /* close if mouse not over statement  */

/*================================================

If the mouse is over the game canvas we will use
the cursor position. 

To calculate the mouse angle (ma) we will use the 
"atan2" method. Read more about it:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2

This will give us a number from -PI to PI (3.1416...). 
To keep it positive, lets add PI*2 if it's negative;

=================================================*/

    else {

      var ma = Math.atan2(p.mouseY,p.mouseX);
      if (ma < 0) ma += pi2;
      
/*================================================

Since our ship starts poiting north, we need to
remove 90 degrees or PI/2 from our ship angle (sa).
And to keep it between -PI*2 and PI*2 we will use the 
remainder or modulo oretaror (%). Again, to
keep it positive, lets add PI*2 if it's negative,
this will keep out value between 0 and PI * 2.

=================================================*/

      var sa = (s.a - (Math.PI/2)) % pi2;
      if (sa < 0) sa += pi2;

/*================================================

Now we an easily calculate the angle between the
mouse and the ship (d) with a subtraction.
Let's use "Math.abs" to remove the negative sign.

=================================================*/

      var d = Math.abs(ma - sa);

/*================================================

But there's a catch, for example if the ship angle
is close to PI * 2 and the mouse angle is close
to 0, the value of "d" will be large
even though their angles are really close.

To avoid that we just check if "d" is too large.
If so we add 180 degrees to each angle and
re-calculate the angle "d".

=================================================*/

      if (d > Math.PI) {
        ma = (ma + Math.PI) % pi2;
        sa = (sa + Math.PI) % pi2;
        d = Math.abs(ma - sa);
      }

/*================================================

Now we can define the turning speed to follow the
mouse cursor. If the our "d" angle is really small
the ship is already pointing towards the cursor.
So we don't want no velocity.

=================================================*/

      if (d < turnAngle) s.va = 0;

/*================================================

To check if we need to turn clockwise or not we
just need to check is the difference between our
angles is positive. If it isn't we just use
a negative value for our velocity.

=================================================*/

      else {
        if (ma - sa > 0) s.va = turnAngle;
        else s.va = turnAngle * -1;
      }

    } /* close else statement */

/*================================================

Now we just need to add our velocity angle to
the ship current angle.

=================================================*/

    s.a += s.va;

  }, /* close turn function */


/*================================================

Time to shoot some asteroids!

=================================================*/

  shoot: function(p) {
    var s = p.ship;
    
/*================================================

To control the shooting speed we are going to 
use our player current delay counter. 
It will go down every loop call.

=================================================*/

    s.cdelay -= 1;

/*================================================

If the player is not on the user interface screen
and is pressing any shoot key and the
current delay is smaller than 0, we shoot.

=================================================*/

    if (!p.ui && p.keys['shoot'] && s.cdelay < 0) {
/*================================================

To allow the player to shoot again we need set our
current delay to a value greater than 0.
Let's use our default delay time, but we gonna
subtract some time. 

Let's make this reduction time scale with the
player attack so the more attack the player
has the faster he will be able to shoot.

=================================================*/

      s.cdelay = s.delay - (p.attack*0.25);

/*================================================

The first place our bullet will appear must be
at the point in front of our ship, not the center.
Let's calculate this offset so we can add it to
the ship position.

=================================================*/

      var offset = {
        x: (s.h / 2) * Math.sin(s.a),
        y: (s.h / 2) * Math.cos(s.a)
      };
/*================================================

Now we can create our first bullet. As I said
we add the offset to both x and y positions.

=================================================*/

      var bullet = {
        x: s.x + offset.x,
        y: s.y + offset.y,

/*================================================

We can add a small fraction of our attack bonus to
our bullet radius to make them more menacing.

=================================================*/

        r: 0.08 + (p.attack*0.002),

/*================================================

Now we need to calculate the bullet speed.
Fist we need a vector pointing to the same direction
as our ship. We already have that, it's the same
as the offset we just calculated before.
Let's just tune it down a little, we don't want
our bullet too fast.

We also need to account for the ship speed and 
add it to the bullet speed. This will simulate
the inertia.

=================================================*/

        vx: (offset.x * 0.5) + s.vx,
        vy: (offset.y * 0.5) + s.vy,

/*================================================

We don't want our bullet to run forever, so we will
add a life time. This will limit the shooting range.

We want our attack to reach about half of our screen
width and we are gonna increase this range with a
fraction of the player attack value.

=================================================*/

        life: 20 + (p.attack*0.2)

      }; /* close bullet */

/*================================================

Now that we hane our pretty bullet we can add it
to the player bullet list.

=================================================*/

      p.bullets.push(bullet);

    } /* close if shoot statement */
    
/*================================================

Now let's move our bullets and check if they 
are hitting something.

We will use the second parameter of the forEach
method, it will provide us the item current index.

If you wanna take another look at that forEach
explanation, it's right here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

=================================================*/

    p.bullets.forEach(function(b, bulletIndex) {

/*================================================

Like with our asteroids, we just need to add the
x and y velocities, keep the map limit and
we are good to go.

=================================================*/

      b.x += b.vx;
      b.y += b.vy;
      World.limit(b);
      
/*================================================

Our bullet is getting older!

=================================================*/

      b.life--;
      
/*================================================

If our bullet life has ended we need to remove it
from the list. The splice method is explained here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

=================================================*/

      if (b.life < 0) {
        p.bullets.splice(bulletIndex, 1);
      } 
      
/*================================================

If our bullet life is alive it can hit any asteroid.
We need to check each one of them.

=================================================*/
      
      else {
        World.asteroidsList.forEach(function(a, asteroidIndex) {

/*================================================

We re-use our collide function to check for the
bullets collision. If there's hit we spawn the
smaller asteroids and remove both the bullet
and the asteroid from their respective lists.

=================================================*/

          if (World.collide(a, b)) {
            World.smallAsteroids(a);
            World.asteroidsList.splice(asteroidIndex, 1);
            p.bullets.splice(bulletIndex, 1);
          }

        }); /* close forEach asteroid  */

      } /* close else alive statement  */

    }); /* close forEach bullet */

  }, /* close shoot function */


/*================================================

Our last playerManager method is very similar to
the buildPack function from our last session.
It will calculate the new positions of our ships
and bullets and create a pack with all this data.
We'll also send this pack to all of our players in
the server main loop in our next lesson. 

=================================================*/

  buildPack: function () {
    var playersPack = [];

/*================================================

Since our player list is an object we are going to
use the for in loop. Read more about it here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in

=================================================*/
    
    for (var i in this.list) {
      var p = this.list[i];
      var s = p.ship;

/*================================================

If the player is not on the user interface screen
we calculate their movement and re-use our limit function.

=================================================*/

      if (!p.ui) {
        this.move(p);
        this.turn(p);
        World.limit(p.ship);
      }
      
/*================================================

If the player is on the user interface screen
we make the ship keep spinning on it's place.
It will spin faster if the player increases the
control slider, but not as fast as before.

=================================================*/

      else {
        s.a += (s.turn + (p.control * 0.001)) * 0.4;
        s.cspeed = 0;
        s.vx = 0;
        s.vy = 0;
      }

/*================================================

Now we calculate the shots and bullets position.

=================================================*/

      this.shoot(p);

/*================================================

And finnaly we copy all our player data that we 
need to share inside our pack. 

=================================================*/

      playersPack.push({
        id: p.id,          /* unique id */
        ui: p.ui,          /* user interface screen */
        x: s.x, y: s.y,    /* position */
        w: s.w, h: s.h,    /* dimensions */
        a: s.a,            /* angle */
        r: s.r,            /* radius */
        bullets: p.bullets,/* bullets list */
        attack:  p.attack, /* customization */
        speed:   p.speed,
        control: p.control
      });

    } /* close for player loop */

/*================================================

After the end of the loop, we can send the pack 
to our main loop in lesson 1;

=================================================*/

    return playersPack;

  } /* close buildData function */

}; /* close module.exports */


/*================================================

That was a lot, right! Well it was all of our game
physics and player management in one file. 
Take a break, drink some water and eat a cake,
you deserve it!
Now let's end our back-end code with the socket
communication, open "p07-server-sockets.js"

=================================================*/