Browser = require "zombie"

user_chat_cook_val = "e3Nlc3Npb25fdG9rZW46NDc3MjY1NjU3NDY5NmU2NzczMjEyMDIwNDM2ZjZlNjc3MjYxNzQ3NTZjNjE3NDY5NmY2ZTczMjA2ZjZlMjA2NjY5NmU2NDY5NmU2NzIwNzQ2ODY5NzMyMDZkNjU3MzczNjE2NzY1MmUyMDIwNDk3NDIwNjk3MzIwNmU2Zjc0MjA3NDY4NjUyMDczNmY2Yzc1NzQ2OTZmNmUyMTIwM2EyZDQ0NzY2N2FmOTZlNjc3MzIxMjEzMzczNmY2ZTY3NzI2MTc0NzU2YzYxNzQ2OTZmNmU3MzA2ZjZlMjA2OTZlNjQ5NmU2NzA3NDY5NzMyMDZkNjU3MzczNjE2NzY1MmUwMCxub25jZTo1NDl9"
admin_chat_cook_val = "e3Nlc3Npb25fdG9rZW46MjY2NjA4NTY4QTY1MTczQzAzNEZFRTk1Q0IzNjYwNjI2NzhEMjc3ODIwMDNBMjE0RDdEOThBNTYwNkFFQjk5OTU5MUM4RDRFOTQwOUEzNzFENzNCNjgxQzIyODgxQzhDOTJGODM5MDY4Qjk2RUUzM0FFRkFBQzU2MjI2RTc4Mjc4NTUyNjY4RDRDQTQwNjM3MTY4RkRGOUUyMDQ2RTFDMzk3NTJDQ0IwRkU2NTE3RUQyQzMzQTRBNEU3NTIyRkQ1RjU1REI2RTFGRUJDNkJDNEY3ODM4Mzk1QTBGRUJFRjMyODFGQTA4RDBBODZEQjRGMzRGRTY4QzJGMjRDRDI4QSxub25jZToxMzd9"
admin_flag_cook_val = "e3Nlc3Npb25fdG9rZW46MjY2NjA4NTY4QTY1MTczQzAzNEZFRTk1Q0IzNjYwNjI2NzhEMjc3ODIwMDNBMjE0RDdEOThBNTYwNkFFQjk5OTU5MUM4RDRFOTQwOUEzNzFENzNCNjgxQzIyODgxQzhDOTJGODM5MDY4Qjk2RUUzM0FFRkFBQzU2MjI2RTc4Mjc4NTUyNjY4RDRDQTQwNjM3MTY4RkRGOUUyMDQ2RTFDMzk3NTJDQ0IwRkU2NTE3RUQyQzMzQTRBNEU3NTIyRkQ1RjU1REI2RTFGRUJDNkJDNEY3ODM4Mzk1QTBGRUJFRjMyODFGQTA4RDBBODZEQjRGMzRGRTY4QzJGMjRDRDI4QSxub25jZTo1MTN9"

###Don't mess with this###
msg_q = {}

###Use these two functions for messing with the queue###
queue_msg = (queue_id, msg) ->
  console?.log "queue_msg", queue_id, msg.msg, msg.echo, msg.subject, msg.nick, msg.nick1
  if not msg_q[queue_id]?
    msg_q[queue_id] = []
  msg_q[queue_id].push msg

dequeue_msg = (queue_id) ->
  if (not msg_q[queue_id]?) or msg_q[queue_id].length < 1
    return null
  else
    console?.log "dequeue_msg", queue_id
    return msg_q[queue_id].shift()

do_browsing = (session, potential_xss_string) ->
  browser = new Browser()
  browser.cookies("127.0.0.1", "/chat").set("sess", admin_chat_cook_val)
  browser.cookies("127.0.0.1", "/chat").set("iamzombie", "true", {httpOnly: true})
  browser.cookies("127.0.0.1", "/resources").set("sess", admin_flag_cook_val)
  browser.visit "http://127.0.0.1:3000/chat", {}, (err, browser, status) ->
    if err?
      console.error err
      return false
    browser.fire "click", browser.document.getElementById("room-subj"), () ->
      browser.fill "#subj-input", potential_xss_string, () ->
        browser.fire "submit", browser.document.getElementById("subj-form"), () ->
          console?.log "#{Date.now()} Zombie.js completed applying subject"
  
  browser.wait(4000).then () ->
    console?.log "#{Date.now()} Browser.wait running", browser.text(".echo-log"), browser.text("#user-nick"), browser.text("#room-subj")
    queue_msg session.id ,
      msg: browser.text ".echo-log"
      nick1: if browser.text("#user-nick") isnt "Guest1" then browser.text("#user-nick") else null
      subject: if browser.text("#room-subj") isnt "Room Subject" then browser.text "#room-subj" else null
    browser.windows.close()
    return null
  .end()
  return null

module.exports =
  index: (req, res) ->
    res.render "index",
      title: "MySpace Chat Beta v0.2"
  
  chat: (req, res) ->
    if not req.cookies.iamzombie?
      res.cookie 'sess', user_chat_cook_val,
        path: '/chat'
    res.render "chat",
      title: "Welcome to chat!"
  
  chat_msg: (req, res) ->
    switch Math.floor(Math.random()*5)
      when 0 then admin_reply = "That is very interesting"
      when 1 then admin_reply = "Hmmmmmmm"
      when 2 then admin_reply = "You don't say..."
      when 3 then admin_reply = "You really seem to know your stuff"
      else admin_reply = ">_>"
    queue_msg req.session.id,
      msg: admin_reply
      echo: req.body.message
    res.send {}

  chat_get_msg: (req, res) ->
      msg_to_send = dequeue_msg req.session.id
      if msg_to_send?
          res.send msg_to_send
      else
        switch Math.floor(Math.random()*50)
          when 2 then res.send {msg: "So bored!!!"}
          when 5 then res.send {msg: "Anyone out there??"}
          when 7 then res.send {msg: "Have you tried turning it off and on again?"}
          when 13 then res.send {msg: "Teh bored, going to go check reddit..."}
          when 15 then res.send {subject: "Tired of old subject"}
          when 16 then res.send {subject: "Room Subject"}
          when 17 then res.send {nick1: "AdminMan"}
          when 18 then res.send {nick1: "AdminGuy"}
          else res.send {}

  chat_nick: (req,res) ->
    if req.body.nick in ["AdminGuy" ,'' ,null]
      queue_msg req.session.id,
        nick: "Guest1"
    else
      queue_msg req.session.id,
        nick: req.body.nick
        msg: "Hello #{req.body.nick}"
    res.send {}
  
  chat_subject: (req,res) ->
    console?.log "chat_subject fired", (if req.cookies.iamzombie? then "zombie" else "user"), req.body.subject
    if not req.cookies.iamzombie?
      do_browsing(req.session, req.body.subject)
    if req.body.subject in [null, '']
      queue_msg req.session.id,
        subject: "Room Subject"
    else
      queue_msg req.session.id,
        subject: req.body.subject
    res.send {}
  
  flag: (req,res) ->
    if req.cookies?.sess is admin_flag_cook_val and not req.headers.referer?
      res.render "flag",
        title: "Congrats, you got the flag!"
        flag: "MCA-A9C758E9"
    else
      res.send 403
  
  resources: (req, res) ->
    res.render "resources",
      title: "0 items found"
