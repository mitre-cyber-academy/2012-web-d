(function() {
  var app, express, http, routes;
  express = require("express");
  routes = require("./routes");
  http = require("http");
  app = express();
  app.configure(function() {
    app.set("port", process.env.PORT || 3000);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: "2433804vsdfnoeignlsd",
      key: "ignorethis",
      cookie: {
        path: "/chat",
        httpOnly: true
      }
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
  });
  app.configure("development", function() {
    return app.use(express.errorHandler());
  });
  app.get("/", routes.index);
  app.get("/chat", routes.chat);
  app.post("/chat/msg", routes.chat_msg);
  app.get("/chat/msg", routes.chat_get_msg);
  app.post("/chat/nick", routes.chat_nick);
  app.post("/chat/sub", routes.chat_subject);
  app.get("/resources/flag", routes.flag);
  app.get("/resources", routes.resources);
  http.createServer(app).listen(app.get("port"), function() {
    return console.log("Express server listening on port " + app.get("port"));
  });
}).call(this);
