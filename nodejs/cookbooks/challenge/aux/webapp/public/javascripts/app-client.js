(function() {
  var get_new_msg_interval_id, process_server_reply;

  process_server_reply = function(data) {
    var chat_div, echo_span, nick1;
    if ((data.echo != null) && data.echo !== "") {
      echo_span = $('<span>', {
        "class": 'echo-log'
      }).text("" + data.echo);
      $('#chat-log').append($('<div>').text("You: ").append(echo_span));
    }
    if ((data.msg != null) && data.msg !== "") {
      nick1 = $('#user1').text();
      $('#chat-log').append($('<div>').text("" + nick1 + ": " + data.msg));
      chat_div = document.getElementById("chat-log");
      chat_div.scrollTop = chat_div.scrollHeight;
    }
    if ((data.nick != null) && data.nick !== "") $("#user-nick").text(data.nick);
    if ((data.nick1 != null) && data.nick1 !== "") $("#user1").text(data.nick1);
    if ((data.subject != null) && data.subject !== "") {
      return $("#room-subj").html(data.subject);
    }
  };

  $('document').ready(function(event) {
    $(".hideonload").hide();
    return true;
  });

  $('.clickable').click(function(event) {
    $(event.target).hide().next().show().find('input[type="text"]').focus();
    return true;
  });

  $('#nick-form').submit(function(event) {
    var new_nick;
    new_nick = $('#nick-input').val();
    $.post('chat/nick', {
      nick: new_nick
    }, function(data) {
      $('#nick-span').hide();
      $('#user-nick').show();
      return process_server_reply(data);
    });
    return false;
  });

  $('#subj-form').submit(function(event) {
    var new_subj;
    new_subj = $('#subj-input').val();
    $.post('chat/sub', {
      subject: new_subj
    }, function(data) {
      $('#subj-span').hide();
      $('#room-subj').show();
      return process_server_reply(data);
    });
    return false;
  });

  $('#chat-form').submit(function(event) {
    var text_to_send;
    text_to_send = $('#chat-input-text').val();
    $('#chat-input-text').val('');
    $.post('chat/msg', {
      message: text_to_send
    }, process_server_reply);
    return false;
  });

  get_new_msg_interval_id = window.setInterval(function() {
    return $.get('chat/msg', process_server_reply);
  }, 1000);

}).call(this);
