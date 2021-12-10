/*=================================================

PART 4: Our very simple HTTP server

Since we are using Express to handle our static
files, this will be a very short lesson.

We could write this server with pure Node.js,
but we would have to worry about headers, 
mime types and 404 errors. If you want to learn
how to do this by yourself, just go to:
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

In our fist lesson we imported this file with:

const Http = require('./p4-http.js');

Now we need to export the content with the
Node.js module system. 
All we have to do is to use the "module.exports" 
to make our methods publicly available.

=================================================*/

module.exports = {

/*=================================================

We just have one method in our server file, so
let's call it "server". Sorry the lack of creativity.

=================================================*/

  server: function (express) {

/*=================================================

Now we start the Express module and store it in the
"app" variable. Read more about Express here:
https://expressjs.com/en/4x/api.html

=================================================*/

    var app = express();

/*=================================================

With Node.js "http" API we are going create our
express server. Learn more about this API here:
https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/

=================================================*/

    var server = require('http').Server(app);

/*=================================================

Now we tell our Express server to mount the static
middleware. Middleware functions have access to 
the request, the response, and the next middleware 
function in the application’s cycle. 
Read more about middleware here:
http://expressjs.com/en/guide/using-middleware.html

The middleware we will use is the "static" built-in
method. It will serves static assets inside the
"__dirname", wich is our root directory.

=================================================*/

    app.use(express.static(__dirname));

/*=================================================

As I said in the HTML lesson, if a URL does not
specify a file name, the server should deliver the
"index.html" file by default.

Let's implement this behaviour with an Express 
method called "get". It routes all requests to the 
specified path with the specified callback.
In our case, the path is empty '/', meaning we do
not have a specific file name.
https://expressjs.com/en/api.html#app.get

=================================================*/

    app.get('/',function(req, res) {

/*=================================================

So, if there's no file name, send our "index.html"
file located on the root directory.
https://expressjs.com/en/api.html#res.sendFile

=================================================*/

      res.sendFile('p02-index.html', { root: __dirname });

    }); /* close app.get */

/*=================================================

In order to start our server, and listen to our
clients connections, we need to tell the
port where the requests are comming from.
One of the most common errors raised when listening is EADDRINUSE. This happens when another server is already listening on the requested port/path/handle.

Here in repl.it we don't have to worry about none
of that, all we gotta do is use the pre-defined 
enviroment variable provided (process.env.PORT)
https://expressjs.com/en/api.html#app.listen

=================================================*/

    server.listen(process.env.PORT);

/*=================================================

We need to return the server to our main server JS
because we will also use it to listen to the sockets,
in our main server file.

=================================================*/
  
    return server;
    
  } /* close server function */

};  /* close module.exports */

/*=================================================

See, that wasn't so hard! Now let's build out map,
I mean our GALAXY!!! 😆 You can open "p05-world.js".

=================================================*/

