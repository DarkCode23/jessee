/*================================================

PART 8: Client socket communication

Here we will start the Socket.io client and listen
to the "initialData" and the "newPositions" sent by
the back-end.

Since we will use the "socket" variable in other
files let's define it as a global. In the client
code, there's no need to use "module.export".

=================================================*/

var socket;

/*================================================

But we start we need to make sure everything is
loaded before starting our client socket library.
To do that, let's use the "addEventListener" method
and the "load" event. 
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

=================================================*/

addEventListener('load', function () {

  socket = io();

/*================================================

Here we will receive the initial data with our
player and map data. We copy all their values to 
the client global variables that we will define 
in our next lessons.

=================================================*/

  socket.on('initialData',function(data){
    Object.assign(player, data.player);
    Object.assign(world, data.world);

/*================================================

Now that we have all the required data we can start
our client player and world. 
We will learn more about this function calls in
theis respective lessons.

=================================================*/
    
    ui.start();       /* p09-client-ui.js     */
    keyboard.start(); /* p10-client-ui.js     */
    mouse.start();    /* p11-client-ui.js     */
    world.start();    /* p13-client-world.js  */

  }); /* close socket initialData */

/*================================================

Here we will receive our players and asteroids 
packs and redraw the scene with our new data.
We will implement the draw functions on our
lesson 12.

=================================================*/

  socket.on('newPositions',function(data){
    player.list = data.players;
    world.asteroids = data.asteroids;
    draw.scene();
  });


/*================================================

If we lose our connection to the server we reload
and try again after a couple of seconds.

=================================================*/

  socket.on('disconnect',function(){
    setTimeout(function () {
      location.reload();
    }, 2000 /* miliseconds */);
  });

}); /* close load event listener */

/*================================================

Great we now can communicate with the server 
through socket, good job.
Time to build our user interface, go on and open
the next lesson "p09-client-ui.js"

=================================================*/
