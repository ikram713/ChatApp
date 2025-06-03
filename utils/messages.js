const moment = require('moment');
function formatMessage(username, message) {
    const time = new Date().toLocaleTimeString();
    return {
        username,
        text: message,
        time : moment().format('h:mm a')
    };
}

module.exports = formatMessage;