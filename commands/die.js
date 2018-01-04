const Config = require('../config.json');

exports.run = (e, params, discordie) => {
	if(e.message.author.id !== Config.SELF_ID) return;
	console.log("Disconnecting...");
	discordie.disconnect();
}