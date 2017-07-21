exports.run = (e, params, discordie) => {
	if(params != ""){
		let regex = /(<:([^>]+):(\d+)>)/ig;
		match = regex.exec(e.message.content);
		console.log(match);
		if(match){
			var emojiurl = e.message.guild.getEmojiURL(match[3]);
			e.message.channel.sendMessage("Emoji Name: "+match[2]+"\n"+emojiurl);
		}else
			e.message.channel.sendMessage("No custom emoji detected.");
	}
	else
		e.message.channel.sendMessage("The correct usage is ``]emote :emoji:``");
}