const Config = require('../config.json');

exports.run = (e, params, discordie) => {
    if (e.message.author.id !== Config.SELF_ID) return;
    discordie.User.setUsername(params.join(" "));
    e.message.channel.sendMessage('Username set to ' + params.join(' '));
}