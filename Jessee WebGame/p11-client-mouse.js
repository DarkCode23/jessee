/*================================================

PART 11: Mouse input

Let's create the functions that will handle mouse 
button press and movement.

We will add all the mouse event listener to our 
canvas screen since we only want to capture the 
mouse input that's happening inside it.

Since we are going to use the canvas element a lot,
let's create a variable just for that.

=================================================*/

var canvas = document.querySelector('.screen');

/*================================================

Now let's create our "mouse" global variable.

=================================================*/

var mouse = { 
  start: function () {

/*================================================

When a user presses the mouse button we will emit
the same event as our keyboard control (keyPress).

The "event.button" property will tell us if the
user clicked with the left or right button.
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

=================================================*/

   canvas.addEventListener('mousedown', function(event) {
  
/*================================================

If "event.button" is equal to 0, that means the
user clicked with the left button. That means
we'll send a 'up' event to our server.

=================================================*/

      if (event.button == 0) {
        socket.emit('keyPress', {
          inputId: 'up',
          state: true
        });
      }

/*================================================

If "event.button" is equal to 2, that means the
user clicked with the right button. In this case
we send the 'shoot' event.

=================================================*/

      if (event.button == 2) {
        socket.emit('keyPress', {
          inputId: 'shoot',
          state: true
        });
      }

    }); /* close addEventListener mousedown */

/*================================================

As before we will make the same function for the
'mouseup' event, but we will set the state value
to false. 

=================================================*/

    canvas.addEventListener('mouseup', function(event) {
      if (event.button == 0) { /* left button */
        socket.emit('keyPress', {
          inputId: 'up',
          state: false
        });
      }
      if (event.button == 2) { /* right button */
        socket.emit('keyPress', {
          inputId: 'shoot',
          state: false
        });
      }
    });

/*================================================

Now let's send the mouse position to the server
when the mouse move. 

=================================================*/

    canvas.addEventListener('mousemove', function(event) {

/*================================================

Since we will use this position to rotate our 
ship that's always on the middle of the screen, 
let's subtract half of each screen dimension.

This way we will have both values equal 0 when
the mouse is on the center of the screen.

=================================================*/

      var position = {
        x: event.clientX - (innerWidth / 2),
        y: event.clientY - (innerHeight / 2)
      };

/*================================================

Now we send the mouse position to our server.

=================================================*/

      socket.emit('mouseMove', position);
      
    }); /* close addEventListener mousemove */

/*================================================

To turn on the mouse rotation when the cursor is
out of the game screen, we will send the mouse
state to our server.

=================================================*/

    canvas.addEventListener('mouseover', function (event) {
      socket.emit('mouseOver', {state: true});
    });

/*================================================

And to tuen it off we'll send the false value if 
the mouse goes out of our game screen.

=================================================*/

    canvas.addEventListener('mouseout', function (event) {
      socket.emit('mouseOver', {state: false});
    });

/*================================================

We don't want no context menus appearing over our
game screen so let's prevent this default behaviour.
https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault

=================================================*/

    canvas.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      return false;
    });
  
  } /* close start function */

}; /* close mouse global var */

/*================================================

Now the user can control his ship with the mouse.
Let's go to my favorite part of the code: 
Drawing stuff! XD

Open our next lesson "p12-client-draw.js"

=================================================*/