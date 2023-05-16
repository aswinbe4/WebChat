$(document).ready(function() {
    function getMessages() {
        $.ajax({
            url: '/get_messages',
            type: 'GET',
            success: function(response) {
                var messages = response.messages;
                $('#messages').empty();
                for (var i = 0; i < messages.length; i++) {
                    var message = messages[i];
                    var messageElement = $('<div class="message"><p class="username">' + message.username + '</p><p class="content">' + message.message + '</p><p class="summary"></p></div>');
                    var summaryButton = $('<button class="summary-button">Summarize</button>');
                    summaryButton.click(function() {
                        var summary = $(this).siblings('.summary');
                        summary.slideToggle();
                    });
                    messageElement.append(summaryButton);
                    $('#messages').append(messageElement);
                }
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            }
        });
    }

    getMessages();

    $('#chat-form').submit(function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var message = $('#message').val();
        if (username.trim() === '' || message.trim() === '') {
            return;
        }
        $.ajax({
            url: '/send_message',
            type: 'POST',
            data: {username: username, message: message},
            success: function(response) {
                $('#message').val('');
                getMessages();
            }
        });
    });

    $('#clear-chat').click(function() {
        $.ajax({
            url: '/clear_chat',
            type: 'POST',
            success: function(response) {
                getMessages();
            }
        });
    });
});
