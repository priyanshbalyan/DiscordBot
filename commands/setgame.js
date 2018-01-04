const Config = require('../config.json');

exports.run = (e, params, discordie) => {
    if (e.message.author.id !== Config.SELF_ID) return;
    var game = { type:0, "name": params.join(" ") };
    discordie.User.setGame(null, game);
    e.message.channel.sendMessage('Set playing status to ' + params.join(' '));
}