/*================================================

PART 10: Keyboard input

Let's create the functions that will be triggered
when the user presses a keyboard button.

But first we need to make a list of our valid input.
We are going to allow. Here's good resource about
key codes:
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

=================================================*/

var keyboard = {

  validKeys: {
    ' ': 'shoot', //space
    'w': 'up'   ,
    'a': 'left' ,
    's': 'down' ,
    'd': 'right',
    'ArrowUp'   : 'up',
    'ArrowLeft' : 'left',
    'ArrowDown' : 'down',
    'ArrowRight': 'right',
  },

/*================================================

We want to keep track of which keys are pressed,
so let's create an object to store those values.

=================================================*/

  pressedKeys: {},

/*================================================

Now let's start our event listeners.

=================================================*/

  start: function () {

/*================================================

When a user presses a key we check if it's in our
valid keys list. 
For brevity, let's create a "k" variable.

=================================================*/

    addEventListener('keydown', function(event) {
      var k = event.key;
      if (keyboard.validKeys[k]) {

/*================================================

If it is a valid key, we set it's' pressedKeys 
value to true.

=================================================*/

      keyboard.pressedKeys[k] = true;


/*================================================

And now send the event to our server with the
socket library with the key state set to true.

=================================================*/

      socket.emit('keyPress',{
        inputId: keyboard.validKeys[k],
        state: true
      });

    }  /* close if validKeys */

  });  /* close addEventListener keydown */

/*================================================

Now we will do the same thing with the "keyup"
event, but our values will now be false;

=================================================*/

    addEventListener('keyup', function(event) {
      var k = event.key;
      if (keyboard.validKeys[k]) {
        keyboard.pressedKeys[k] = false;
        socket.emit('keyPress',{
          inputId: keyboard.validKeys[k],
          state: false
        });
      }
    });/* close addEventListener keyup */

  } /* close start function */

}; /* close keyboard global var */

/*================================================

And that's all for our keyboard inputs.
Let's build our mouse interactions in our next 
lesson "p11-client-mouse"

=================================================*/