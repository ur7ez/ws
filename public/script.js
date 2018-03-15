let socket = new WebSocket('ws://localhost:8080');
let timeout, typing = false;

socket.addEventListener('message', function (event) {
    let msg = JSON.parse(event.data);
    if (msg.type === 'message') {
        $('#chat_wrapper').append(`<div>${msg.data}</div>`)
    } else if (msg.type === 'typing') {
        if (msg.data === 'started') {
            $('#chat_wrapper').append(`<div class="typing">...</div>`)
        } else if (msg.data === 'stopped') {
            $('#chat_wrapper').find('.typing').first().remove();
        }
    }
});

sendMessage = () => {
    let msg = $('#newMessage');
    let message = {
        type: 'message',
        data: msg.val().trim()
    };
    if (message.data.length > 0) {
        msg.val('').focus();
        socket.send(JSON.stringify({
            type: 'typing',
            data: 'stopped'
        }));
        typing = false;
        socket.send(JSON.stringify(message));
        $('#chat_wrapper').append(`<div class="my">${message.data}</div>`)
    }
};

$(document).on('click', '#sendNewMessage', sendMessage);

$(document).on('keypress', '#newMessage', (event) => {
    clearTimeout(timeout);
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
        return;
    }
    if (typing === false) {
        socket.send(JSON.stringify({
            type: 'typing',
            data: 'started'
        }));
        typing = true;
    }

    timeout = setTimeout(() => {
        socket.send(JSON.stringify({
            type: 'typing',
            data: 'stopped'
        }));
        typing = false;
    }, 2000);
});