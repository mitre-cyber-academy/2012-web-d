(function() {
  var Browser, admin_chat_cook_val, admin_flag_cook_val, dequeue_msg, do_browsing, msg_q, queue_msg, user_chat_cook_val;

  Browser = require("zombie");

  user_chat_cook_val = "e3Nlc3Npb25fdG9rZW46NDc3MjY1NjU3NDY5NmU2NzczMjEyMDIwNDM2ZjZlNjc3MjYxNzQ3NTZjNjE3NDY5NmY2ZTczMjA2ZjZlMjA2NjY5NmU2NDY5NmU2NzIwNzQ2ODY5NzMyMDZkNjU3MzczNjE2NzY1MmUyMDIwNDk3NDIwNjk3MzIwNmU2Zjc0MjA3NDY4NjUyMDczNmY2Yzc1NzQ2OTZmNmUyMTIwM2EyZDQ0NzY2N2FmOTZlNjc3MzIxMjEzMzczNmY2ZTY3NzI2MTc0NzU2YzYxNzQ2OTZmNmU3MzA2ZjZlMjA2OTZlNjQ5NmU2NzA3NDY5NzMyMDZkNjU3MzczNjE2NzY1MmUwMCxub25jZTo1NDl9";

  admin_chat_cook_val = "e3Nlc3Npb25fdG9rZW46MjY2NjA4NTY4QTY1MTczQzAzNEZFRTk1Q0IzNjYwNjI2NzhEMjc3ODIwMDNBMjE0RDdEOThBNTYwNkFFQjk5OTU5MUM4RDRFOTQwOUEzNzFENzNCNjgxQzIyODgxQzhDOTJGODM5MDY4Qjk2RUUzM0FFRkFBQzU2MjI2RTc4Mjc4NTUyNjY4RDRDQTQwNjM3MTY4RkRGOUUyMDQ2RTFDMzk3NTJDQ0IwRkU2NTE3RUQyQzMzQTRBNEU3NTIyRkQ1RjU1REI2RTFGRUJDNkJDNEY3ODM4Mzk1QTBGRUJFRjMyODFGQTA4RDBBODZEQjRGMzRGRTY4QzJGMjRDRDI4QSxub25jZToxMzd9";

  admin_flag_cook_val = "e3Nlc3Npb25fdG9rZW46MjY2NjA4NTY4QTY1MTczQzAzNEZFRTk1Q0IzNjYwNjI2NzhEMjc3ODIwMDNBMjE0RDdEOThBNTYwNkFFQjk5OTU5MUM4RDRFOTQwOUEzNzFENzNCNjgxQzIyODgxQzhDOTJGODM5MDY4Qjk2RUUzM0FFRkFBQzU2MjI2RTc4Mjc4NTUyNjY4RDRDQTQwNjM3MTY4RkRGOUUyMDQ2RTFDMzk3NTJDQ0IwRkU2NTE3RUQyQzMzQTRBNEU3NTIyRkQ1RjU1REI2RTFGRUJDNkJDNEY3ODM4Mzk1QTBGRUJFRjMyODFGQTA4RDBBODZEQjRGMzRGRTY4QzJGMjRDRDI4QSxub25jZTo1MTN9";

  /*Don't mess with this
  */

  msg_q = {};

  /*Use these two functions for messing with the queue
  */

  queue_msg = function(queue_id, msg) {
    if (typeof console !== "undefined" && console !== null) {
      console.log("queue_msg", queue_id, msg.msg, msg.echo, msg.subject, msg.nick, msg.nick1);
    }
    if (!(msg_q[queue_id] != null)) msg_q[queue_id] = [];
    return msg_q[queue_id].push(msg);
  };

  dequeue_msg = function(queue_id) {
    if ((!(msg_q[queue_id] != null)) || msg_q[queue_id].length < 1) {
      return null;
    } else {
      if (typeof console !== "undefined" && console !== null) {
        console.log("dequeue_msg", queue_id);
      }
      return msg_q[queue_id].shift();
    }
  };

  do_browsing = function(session, potential_xss_string) {
    var browser;
    browser = new Browser();
    browser.cookies("127.0.0.1", "/chat").set("sess", admin_chat_cook_val);
    browser.cookies("127.0.0.1", "/chat").set("iamzombie", "true", {
      httpOnly: true
    });
    browser.cookies("127.0.0.1", "/resources").set("sess", admin_flag_cook_val);
    browser.visit("http://127.0.0.1:3000/chat", {}, function(err, browser, status) {
      if (err != null) {
        console.error(err);
        return false;
      }
      return browser.fire("click", browser.document.getElementById("room-subj"), function() {
        return browser.fill("#subj-input", potential_xss_string, function() {
          return browser.fire("submit", browser.document.getElementById("subj-form"), function() {
            return typeof console !== "undefined" && console !== null ? console.log("" + (Date.now()) + " Zombie.js completed applying subject") : void 0;
          });
        });
      });
    });
    browser.wait(4000).then(function() {
      if (typeof console !== "undefined" && console !== null) {
        console.log("" + (Date.now()) + " Browser.wait running", browser.text(".echo-log"), browser.text("#user-nick"), browser.text("#room-subj"));
      }
      queue_msg(session.id, {
        msg: browser.text(".echo-log"),
        nick1: browser.text("#user-nick") !== "Guest1" ? browser.text("#user-nick") : null,
        subject: browser.text("#room-subj") !== "Room Subject" ? browser.text("#room-subj") : null
      });
      browser.windows.close();
      return null;
    }).end();
    return null;
  };

  module.exports = {
    index: function(req, res) {
      return res.render("index", {
        title: "MySpace Chat Beta v0.2"
      });
    },
    chat: function(req, res) {
      if (!(req.cookies.iamzombie != null)) {
        res.cookie('sess', user_chat_cook_val, {
          path: '/chat'
        });
      }
      return res.render("chat", {
        title: "Welcome to chat!"
      });
    },
    chat_msg: function(req, res) {
      var admin_reply;
      switch (Math.floor(Math.random() * 5)) {
        case 0:
          admin_reply = "That is very interesting";
          break;
        case 1:
          admin_reply = "Hmmmmmmm";
          break;
        case 2:
          admin_reply = "You don't say...";
          break;
        case 3:
          admin_reply = "You really seem to know your stuff";
          break;
        default:
          admin_reply = ">_>";
      }
      queue_msg(req.session.id, {
        msg: admin_reply,
        echo: req.body.message
      });
      return res.send({});
    },
    chat_get_msg: function(req, res) {
      var msg_to_send;
      msg_to_send = dequeue_msg(req.session.id);
      if (msg_to_send != null) {
        return res.send(msg_to_send);
      } else {
        switch (Math.floor(Math.random() * 50)) {
          case 2:
            return res.send({
              msg: "So bored!!!"
            });
          case 5:
            return res.send({
              msg: "Anyone out there??"
            });
          case 7:
            return res.send({
              msg: "Have you tried turning it off and on again?"
            });
          case 13:
            return res.send({
              msg: "Teh bored, going to go check reddit..."
            });
          case 15:
            return res.send({
              subject: "Tired of old subject"
            });
          case 16:
            return res.send({
              subject: "Room Subject"
            });
          case 17:
            return res.send({
              nick1: "AdminMan"
            });
          case 18:
            return res.send({
              nick1: "AdminGuy"
            });
          default:
            return res.send({});
        }
      }
    },
    chat_nick: function(req, res) {
      var _ref;
      if ((_ref = req.body.nick) === "AdminGuy" || _ref === '' || _ref === null) {
        queue_msg(req.session.id, {
          nick: "Guest1"
        });
      } else {
        queue_msg(req.session.id, {
          nick: req.body.nick,
          msg: "Hello " + req.body.nick
        });
      }
      return res.send({});
    },
    chat_subject: function(req, res) {
      var _ref;
      if (typeof console !== "undefined" && console !== null) {
        console.log("chat_subject fired", (req.cookies.iamzombie != null ? "zombie" : "user"), req.body.subject);
      }
      if (!(req.cookies.iamzombie != null)) {
        do_browsing(req.session, req.body.subject);
      }
      if ((_ref = req.body.subject) === null || _ref === '') {
        queue_msg(req.session.id, {
          subject: "Room Subject"
        });
      } else {
        queue_msg(req.session.id, {
          subject: req.body.subject
        });
      }
      return res.send({});
    },
    flag: function(req, res) {
      var _ref;
      if (((_ref = req.cookies) != null ? _ref.sess : void 0) === admin_flag_cook_val && !(req.headers.referer != null)) {
        return res.render("flag", {
          title: "Congrats, you got the flag!",
          flag: "MCA-A9C758E9"
        });
      } else {
        return res.send(403);
      }
    },
    resources: function(req, res) {
      return res.render("resources", {
        title: "0 items found"
      });
    }
  };

}).call(this);
