const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();


const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log('Username:', username , "Room:", room);


// Join chat room
socket.emit('joinRoom', { username, room });



socket.on('message', (message) => {
    console.log('New message:', message);
    outputMessage(message);

    // Scroll down to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('message', msg);

    // Clear input field
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users); 

});





// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                        <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);                    
}



// Add room name to DOM
function outputRoomName(room) {
    const roomName = document.getElementById('room-name');
    roomName.innerText = room;
}


// Add users to DOM 
function outputUsers(users) {
    const userList = document.getElementById('users');
    userList.innerHTML = ''; // Clear existing users

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}