/*=================================================

Our goal is to build a space shooter!
If you wanna take a look at the final game,
just click the [ start ▶ ] button above.

At any time during this tutorial you can change
the code to test how it works. Don't worry if you
break it, you can always undo with ctrl+z or just
navigate back to the original repl.it to reset.

We are gonna use three languages, HTML, CSS and JS. 
If you are not familiar with then, please 
take some time to learn the basics:
https://www.w3schools.com/html/
https://www.w3schools.com/css/
https://www.w3schools.com/js/

We will use JS to control both our client and our
server. On the client side, the browser will handle 
the JS code. On the server side, let's use
Node.js to run our scripts.
https://nodejs.org

Again, if you never heard of Node.js, please 
take some time to learn how it work. 
Remember, you don't need to install anything, 
since we are using repl.it.  
https://www.w3schools.com/nodejs/

This tutorial aims to build the game from scratch,
but we are going to use two libraries that
will let us focus on the game stuff:

Express is a web framework that will handle the
http server, static files, mime types, 404, etc.
https://expressjs.com/

Socket.io enables real-time bidirectional communication.
In other words: we will use sockets to
exchange data between server and client 
without reloading the page.
https://socket.io/docs/

Now that we are familiar with our tools,
let's put'em to good use. 

=================================================

PART 1: The main server JS file "index.js"

This file is our "main" file, everything starts
here. Outside repl we would need to install
nodejs and use a terminal or a prompt to run 
this file with the following command:
> node index.js

The first thing we will write is our server.
Without a server we cannot have a multiplayer game. 

Here we will write the main loop, and
import all that we need on the back-end.
So let's get everything started.

Below we use the Node.js module system to import
our two back-end libraries:

=================================================*/

var express  = require('express');
var io = require('socket.io');

/*=================================================

Now lets import our own server lesson files. 
I'm gonna explain how each of this files 
work on the next lessons. 

=================================================*/

var Http     = require('./p04-http-server.js');
var Map      = require('./p05-world.js');
var Player   = require('./p06-player-manager.js');
var Socket   = require('./p07-server-sockets.js');

var httpServer = Http.server(express);
Socket.connect(httpServer, io);
