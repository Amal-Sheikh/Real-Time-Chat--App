const socket = io('http://localhost:8000'); // Ensure this matches your server

const append = (message, position) => {
    // ysha hum keh rhy k msg ko bnaoo or usk andr jaisay likhaty hai usko bnao
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

const form = document.getElementById('send-container');
const messageInp = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

form.addEventListener('submit', (e) => {
    // yaha hum ke ray hai k msg  box k andr likho or uskio display krwaao
    e.preventDefault();
    // const message = messageInput.value;: This gets the text that the
    //  user typed in the input field and stores it in the variable message.
    const message = messageInp.value;
    append(`You: ${message}`, "right");
    socket.emit('send', message);
    messageInp.value = ''; // This clears the input field after sending the message.

});


const name = prompt("Enter Your Name to join");
//  This sends the user's name to the server to indicate that a new user has joined.
socket.emit('new-user-joined', name);

// : This listens for the user-joined event from the server. When this event is received,
//  it runs the function inside.
socket.on('user-joined', name => {
    append(`${name} joined the chat`, "right");
});

socket.on('receive', data => {
    // This appends the received message to the chat, displaying it on the left side along with the sender's name.
    append(`${data.name}: ${data.message}`, "left");
});

socket.on('left', name => {
    // This appends the received message to the chat, displaying it on the left side along with the sender's name.
    append(`${name} left the chat`, left);
});




