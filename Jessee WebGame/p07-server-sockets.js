/*=================================================

PART 7: Server sockets communication

This is where we handle our socket events, like the
player connection and all of our inputs.

Let's begin importing our two previous lessons.

=================================================*/

var World = require('./p05-world.js');
var PlayerManager = require('./p06-player-manager.js');

/*=================================================

Now let's create a function to handle our users
connection. The first thing I do is to log, just
to make sure it's working!

=================================================*/

var connected = function (socket) {
	console.log("Player id "+socket.id+" has joined");

/*=================================================

It's working, that means we need to create a new
player with his ship and all that stuff from our
last lesson.

=================================================*/

	var p = PlayerManager.newPlayer(socket.id);

/*=================================================

Now we add our player to the players list.

=================================================*/

	PlayerManager.list[socket.id] = p;

/*=================================================

We need to send the player info, the asteroids list
and our map values.

=================================================*/

  var playerData = {
    player: p,
    world: World.map
  };

/*=================================================

With socket.emit we will send this initial data only 
to the player. Here is a great list of socket metohds:
https://socket.io/docs/emit-cheatsheet/

=================================================*/

  socket.emit('initialData', playerData);

/*=================================================

Now let's bind each function we created in our last
lesson with the respective socket event.
This way the socket will listen to any of this events
that the player might send us.
We also pass on to our function the player values "p" 
and the received data.

=================================================*/

  ['keyPress','mouseMove','mouseOver','customize','ui'].forEach(function (event) {
    socket.on(event, function (data) {
      PlayerManager[event](p,data); 
    });
  });


/*=================================================

If a player disconnects we log and delete.

=================================================*/

  socket.on('disconnect', function () {
    console.log("Player id "+ socket.id +" has left");
    delete PlayerManager.list[socket.id];
  });

}; /* close connected function */

/*=================================================

Now we can export our socket connect function, 
it will start the Socket.io library and
create our socket server binding it to our http server.

=================================================*/

module.exports = {
  connect: function (httpServer, io) {
    var serverSocket = io(httpServer);

/*=================================================

All our sockets will listen for "connection" events 
and run our connected function.

=================================================*/

    serverSocket.sockets.on('connection', connected);

/*=================================================

Now let's create out main server loop.
Every loop we will send the players data and the 
asteroids data to every socket conneted.

=================================================*/

    var loop = function () {
      serverSocket.emit('newPositions', {
        asteroids: World.buildPack(),
        players: PlayerManager.buildPack()
      });
    };

/*=================================================

Now we can start our main server loop.
To match most screens frequency, it will run 
in a fixed interval of 60Hz, that means 60 times per
second. That's roughly sixteen miliseconds:

  1 second = 1000ms; 
  1000/60 = 16.666ms 

Learn more about time events:
https://www.w3schools.com/js/js_timing.asp

=============================================*/

    setInterval(loop, (1000/60) /* miliseconds */ );

  } /* close connect function */

}; /* close module.exports */

/*================================================

This wans't so hard, right! We are done with our
server. All back-end is done, congratulations!
Now let's start out client side JS.
Go on an open our next file "p08-client-socket.js"

=================================================*/