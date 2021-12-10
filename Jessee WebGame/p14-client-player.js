/*=================================================

PART 14: Drawing all the players

This is our last lesson, all we need to do in order
to finish our game is our client "player" global
variable to hold all the players data.

=================================================*/

var player = {

/*=================================================

Now all we have to do is to draw our players.

=================================================*/

  draw: function() {
    player.list.forEach(function (p) {

/*=================================================

If the received data "id" is the same as our client
"id" that means that's our player's ship.

=================================================*/

      if (p.id == player.id) {


/*=================================================

If the player is customizing his ship, let's place
the camera down a little bit.

=================================================*/

        if (p.ui) {
          draw.camera.position.x = p.x;
          draw.camera.position.y = p.y - 4;
          draw.camera.position.z = 4;
        }

/*=================================================

If the player is navigating we move the camera 
to keep it above our ship, this way our ship will 
always be on the screen center.

=================================================*/

        else {
          draw.camera.position.x = p.x;
          draw.camera.position.y = p.y;
          draw.camera.position.z = 10;
        }

/*=================================================

Let's create a custom color for our ship based on
the customization values. 

=================================================*/

        var playerColor = draw.color(p);

/*=================================================

Now we can draw the player ship and his bullets
with our beautyful custom color.

=================================================*/

        draw.ship(p, playerColor);
        draw.bullets(p.bullets, playerColor);

      } /* close if same id */
      
/*=================================================

If it's an friend's ship, and it's not on the 
interface screen, we will draw it's ship and
bullets with a green color.

=================================================*/
      
      else if (!p.ui) {
        draw.ship(p,'green');
        draw.bullets(p.bullets, 'green');
      }

    }); /* close forEach player */

  } /* close draw players function */

}; /* close player global var */


/*=================================================

And we are finished! There are a lot of features
we could implement next, like a scoreboard,
we could share our ships colors, create an input
for player names, ship collisions, sounds, etc.

I've build a 3D version of the spaceship and 
asterois in this replit that inspired me 
to write this tutotrial: 
https://repl.it/@rafaelcastrocouto/Space-shooter

If this tutorial receives good feedback I might
implement them on a "Web Game Tutorial Volume 2"
For now that's all, thanks a lot for your time,
I really hope you liked this journey.

If you want to learn more of the web game coding
universe, with more tutorials like this, please
give me some feedback at twitter@racascou

Cheers! Bye bye ✋😊

=================================================*/