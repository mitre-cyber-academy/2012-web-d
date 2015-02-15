process_server_reply = (data) ->
    if data.echo? and data.echo isnt ""
      echo_span = $('<span>', {class: 'echo-log'}).text("#{data.echo}")
      $('#chat-log').append $('<div>').text("You: ").append(echo_span)
    if data.msg? and data.msg isnt ""
      nick1 = $('#user1').text()
      $('#chat-log').append $('<div>').text("#{nick1}: #{data.msg}")
      chat_div = document.getElementById("chat-log")
      chat_div.scrollTop = chat_div.scrollHeight
    if data.nick? and data.nick isnt ""
      $("#user-nick").text(data.nick)
    if data.nick1? and data.nick1 isnt ""
      $("#user1").text(data.nick1)
    if data.subject? and data.subject isnt ""
      $("#room-subj").html(data.subject)

$('document').ready (event) ->
  $(".hideonload").hide()
  return true

$('.clickable').click (event) ->
  $(event.target).hide().next().show().find('input[type="text"]').focus()
  return true

$('#nick-form').submit (event) ->
  new_nick = $('#nick-input').val()
  $.post 'chat/nick', {nick: new_nick}, (data) ->
    $('#nick-span').hide()
    $('#user-nick').show()
    process_server_reply data
  return false

$('#subj-form').submit (event) ->
  new_subj = $('#subj-input').val()
  $.post 'chat/sub', {subject: new_subj}, (data) ->
    $('#subj-span').hide()
    $('#room-subj').show()
    process_server_reply data
  return false

$('#chat-form').submit (event) ->
  text_to_send = $('#chat-input-text').val()
  $('#chat-input-text').val('')
  $.post 'chat/msg', {message: text_to_send}, process_server_reply
  return false

get_new_msg_interval_id = window.setInterval () ->
  $.get 'chat/msg', process_server_reply
, 1000
