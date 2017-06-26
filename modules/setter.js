const fs = require('fs');
const Utilities = require('./utilities.js');
var currentstarred = "";

module.exports = {
	set:function(e, Discordie, settings, params){
		if(!settings.hasOwnProperty(e.message.guild.id))
				settings[e.message.guild.id] = { welcomech:null, starboardch:null, deletech:null };
		if(e.message.author.can(Discordie.Permissions.General.MANAGE_CHANNELS, e.message.guild))
			switch(params[0]){
				case "deletelog": settings[e.message.guild.id].deletech = e.message.channel.id;
					e.message.channel.sendMessage("Deleted messages logging successfully set in <#"+e.message.channel.id+">.");
					break;

				case "starboard": settings[e.message.guild.id].starboardch = e.message.channel.id;
					e.message.channel.sendMessage("Starboard successfully set in <#"+e.message.channel.id+">.");
					break;

				case "welcome": settings[e.message.guild.id].welcomech = e.message.channel.id;
					e.message.channel.sendMessage("Welcome messages successfully set in <#"+e.message.channel.id+">.");
					break;

				case "reset" :  settings[e.message.guild.id].deletech = null;
								settings[e.message.guild.id].welcomech = null;
								settings[e.message.guild.id].starboardch = null;
					e.message.channel.sendMessage("Settings reset.");
					break;

				default: 
					var embed = {
						color:123134,
						"fields":[
							{"name":'set welcome', "value":"Sets the channel for welcome greetings when new members are added."},
							{"name":'set deletelog', "value":"Sets the channel for deleted messages logging."},
							{"name":'set starboard', "value":"Sets the channel for starboard feature of the bot. Add a star reaction to a message to make the bot post it in starboard channel. (Requires 2 stars for the bot to post messages.)"},
							{"name":'set reset', "value":"Resets the guild settings."},
						]
					};
					e.message.channel.sendMessage(" ",false,embed);
					break;

			}
		else console.log("user doesnt have perms");

		fs.writeFile("./settings.json", JSON.stringify(settings), err => {
			if(err) console.log(err);
		});
	},

	welcome:function(e, discordie, settings){
		if(settings.hasOwnProperty(e.guild.id) && settings[e.guild.id].welcomech){
			var channel = discordie.Channels.get(settings[e.guild.id].welcomech);
			channel.sendMessage("Welcome! "+e.member.mention+" to "+e.guild.name);
		}
	},

	deletelog:function(e, discordie, settings){
		if(e.message && settings.hasOwnProperty(e.message.guild.id) && settings[e.message.guild.id].deletech){
			var channel = discordie.Channels.get(settings[e.message.guild.id].deletech);
			channel.sendMessage(" ", false, Utilities.fembed(e, "delete"));
		}
	},

	starboard:function(e, discordie, settings){
		if(e.message && settings.hasOwnProperty(e.message.guild.id) && settings[e.message.guild.id].starboardch){
			console.log(JSON.stringify(e.message.reactions))
			if(e.message.reactions[0].emoji.name == "⭐" && currentstarred != e.message.id && e.message.reactions[0].count > 1){
					var channel = discordie.Channels.get(settings[e.message.guild.id].starboardch)
					channel.sendMessage(":star: in <#"+e.message.channel.id+">",false, Utilities.fembed(e, "starred"));
					currentstarred = e.message.id;
			}
		}
	}
};