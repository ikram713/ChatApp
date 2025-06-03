const users = [];
// Add a user to the users array
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Get the current user by ID
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves the chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}


// Get all users in a room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};