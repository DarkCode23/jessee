/*================================================

PART 9: User interface

To make our user interface work we will create 
three methods. Two of them will let the user
enter and leave the UI. The last one will
allow him to customize his ship.

As before we will define it as a global variable
to make it accessible to our other client files.

=================================================*/

var ui = {
  
/*================================================

First lets make a list of all our user interface
DOM elements, so we can control them with JS.
Read mode about the DOM here: 
https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction

We have 2 categories to list: 

 - the sliders container <div class="sliders">
 - each slider <input type="slider">

 - the mobile buttons container <div class="mobile">
 - and each button <input type="button">

Let's get them with the "querySelector" method.
https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector

=================================================*/

  sliders: document.querySelector('.sliders'),

  attack:  document.querySelector('input[name=attack]'),
  speed:   document.querySelector('input[name=speed]'),
  control: document.querySelector('input[name=control]'),

  mobile:  document.querySelector('.mobile'),

  play:    document.querySelector('input[name=play]'),
  edit:    document.querySelector('input[name=edit]'),
  shoot:   document.querySelector('input[name=shoot]'),

/*================================================

That was easy! Now let's create a method for
our user to leave the UI screen and start playing.
We need to emit the data to our server, hide the
sliders and show our Edit button

=================================================*/

  toggle: function (state) {
    socket.emit('ui', {state: state});
    ui.sliders.classList.toggle('hidden');
    ui.mobile.classList.toggle('hidden');
  },


/*================================================

Now let's create the method that will allow 
the ship customization.

=================================================*/

  customize: function () {

/*================================================

First let's store the current slider name.

=================================================*/

    var sliderName = this.name;

/*================================================

Now let's list all our current bonus values.

=================================================*/

    var bonus = {
      attack:  Number(ui.attack.value),
      speed:   Number(ui.speed.value),
      control: Number(ui.control.value)
    };

/*================================================

The maximum bonus points is 150, that's 3 times
our default input value (50). Let's sum up all user
customization bonus and check if the player has any
extra points.

=================================================*/

    var sum = bonus.attack + bonus.speed + bonus.control;
    var extraPoints = (sum - 150);

/*================================================

For each slider that is not the one being 
manipulated we are going to subtract those extra
points. But since we have two sliders to edit, 
we are going to divide this value by two.
Then we move each slider our new calculated bonus 
value.

=================================================*/

    for (var name in bonus) {
      if (name !== sliderName) {
        bonus[name] -= (extraPoints/2);
        ui[name].value = bonus[name];
      }
    }

/*================================================

Now let's assign this bonus values to our player
and send the customization data to the server.

=================================================*/

    Object.assign(player, bonus);
    socket.emit('customize', bonus);

  }, /* close customize function */

/*================================================

Now let's start listening to the user inputs.

=================================================*/

  start: function () {

/*================================================

First we attach the "ui.toggle" method to the our
play button. It will be triggered when clicked
and will allow the player to leave the user
interface and start playing.

=================================================*/

    ui.play.addEventListener('click', function () {
      ui.toggle(false);
    });

/*================================================

Next we attach the "toggle" method to the our
Edit button. It will allow the player to get
back to the ui.

=================================================*/

    ui.edit.addEventListener('click', function () {
      ui.toggle(true);
    });

/*================================================

Now we make our shoot button do it's thing.

=================================================*/

    ui.shoot.addEventListener('mousedown', function () {
      socket.emit('keyPress', {
          inputId: 'shoot',
          state: true
        });
    });

    ui.shoot.addEventListener('mouseup', function () {
      socket.emit('keyPress', {
          inputId: 'shoot',
          state: false
        });
    });

/*================================================

For each slider we are going to listen to
three events: "change", "mousemove", "keyup".

All of them will trigger the "ui.customize" function
we just created.

=================================================*/

    ['attack','speed','control'].forEach(function (slider) {
      ['change','mousemove','keyup'].forEach(function (event) {
        ui[slider].addEventListener(event, ui.customize);
      });
    });

  } /* close start function */

}; /* close ui global var */


/*================================================

That's the end of our user interface lesson!
Next we are going to learn how to respond to the
user keyboard events. Go on and open our next
lesson: "p10-client-keyboard"

=================================================*/