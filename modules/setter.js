const fs = require('fs');
const Utilities = require('./utilities.js');
var currentstarred = "";

function enotif(e, flag, str){
	color = flag==1 ? 123134 : 0xe91e63;
	var embed = {
		"color":color,
		"description":str
	};
	e.message.channel.sendMessage(" ", false, embed).then().catch(console.error);
}

module.exports = {

	welcome:function(e, discordie, settings){
		if(settings.hasOwnProperty(e.guild.id) && settings[e.guild.id].welcomech){
			var channel = discordie.Channels.get(settings[e.guild.id].welcomech);
			channel.sendMessage(e.member.mention+"Welcome "+" to "+e.guild.name +" !");
		}
	},

	deletelog:function(e, discordie, settings){
		//if guild has set delete channel
		if(e.message && settings.hasOwnProperty(e.message.guild.id) && settings[e.message.guild.id].deletech){
			var channel = discordie.Channels.get(settings[e.message.guild.id].deletech);
			channel.sendMessage(" ", false, Utilities.fembed(e, "delete"));
		}
	},

	starboard:function(e, discordie, settings){
		//if starboard is set in the guild
		if(e.message && settings.hasOwnProperty(e.message.guild.id) && settings[e.message.guild.id].starboardch){
			console.log(JSON.stringify(e.message.reactions))
			//if the reaction is a star
			if(e.message.reactions[0].emoji.name.charCodeAt() == 11088 && currentstarred != e.message.id && e.message.reactions[0].count > 0){
					var channel = discordie.Channels.get(settings[e.message.guild.id].starboardch)
					channel.sendMessage(":star: in <#"+e.message.channel.id+"> ID:"+e.message.id,false, Utilities.fembed(e, "starred"));
					currentstarred = e.message.id;
			}
		}
	}

};