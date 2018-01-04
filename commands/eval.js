const Config = require('../config.json');

function cleancode(text){
	if(typeof(text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g,"@"+String.fromCharCode(8203));
	return text;
}

exports.run = (e, params, discordie) => {
	if(e.message.author.id !== Config.SELF_ID) return;

	try{
		const code = e.message.content.replace(Config.DEFAULT_PREFIX+"eval ","");
		//console.log(code);
		let evaled = eval(code);
		if(typeof(evaled) !== "string")
			evaled = require("util").inspect(evaled);

		e.message.channel.sendMessage("```js\n"+cleancode(evaled)+"\n```",false);
	}catch(err){
		e.message.channel.sendMessage("```xl\n"+cleancode(err)+"\n```",false);
	}
}