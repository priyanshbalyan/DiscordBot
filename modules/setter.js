const fs = require('fs');
const Utilities = require('./utilities.js');
var currentstarred = "";

module.exports = {
	set:function(e, Discordie, settings, params, discordie){
		if(!settings.hasOwnProperty(e.message.guild.id))
				settings[e.message.guild.id] = { welcomech:null, starboardch:null, deletech:null, selfroles:[]};
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

				case "selfrole":
					if(!e.message.author.can(268435456, e.message.guild)) return;  //MANAGE_ROLES permission
					if(!discordie.User.can(268435456, e.message.guild)){ e.message.channel.sendMessage("I don't have enough permissions to add a self assignable roles. ``Required Perm: MANAGE_ROLES``"); return; }
					params.shift();
					role = e.message.guild.roles.find(r=>r.name.toLowerCase() == params.join(" ").toLowerCase());
					if(!role)
						e.message.channel.sendMessage("Can't find a role with that name.");
					else{
						if(settings[e.message.guild.id].selfroles.indexOf(params.join(" ")) == -1)
							settings[e.message.guild.id].selfroles.push(role.name);
						e.message.channel.sendMessage("Added "+role.name+" to the list of self-assignable roles.");
					}
					break;

				case "removerole":
					if(!e.message.author.can(268435456, e.message.guild)) return;
					params.shift();
					if(settings[e.message.guild.id].selfroles.indexOf(params.join(" ")) != -1){
						settings[e.message.guild.id].selfroles.splice(settings[e.message.guild.id].selfroles.indexOf(params.join(" "),1));
						e.message.channel.sendMessage("Role removed.");
					}else
						e.message.channel.sendMessage("No matching role found in the list");
					break;

				case "reset" :  
						settings[e.message.guild.id].deletech = null;
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
							{"name":'set starboard', "value":"Sets the channel for starboard feature of the bot. Add a star reaction to a message to make the bot post it in starboard channel."},
							{"name":'set selfrole', "value":"Adds a role to a list of roles which can be self-assigned by users through the 'addrole' command. Usage: ``set selfrole <rolename>``"},
							{"name":'set removerole', "value":"Removes the role from the list of self-assignable roles."},
							{"name":'set reset', "value":"Resets the guild settings."}
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
			if(e.message.reactions[0].emoji.name == "⭐" && currentstarred != e.message.id && e.message.reactions[0].count > 0){
					var channel = discordie.Channels.get(settings[e.message.guild.id].starboardch)
					channel.sendMessage(":star: in <#"+e.message.channel.id+">",false, Utilities.fembed(e, "starred"));
					currentstarred = e.message.id;
			}
		}
	},

	addrole:function(e, params, settings){
		var param = params.join(" ").toLowerCase();
		//Check if role is in the db of self-assignable roles
		role = settings[e.message.guild.id].selfroles.find(role=>role.toLowerCase()==param);
		if(role){
			role = e.message.guild.roles.find(r=>r.name.toLowerCase()==role.toLowerCase());
			if(e.message.member.roles.find(r=>r.name==role.name)){
				e.message.channel.sendMessage("You already have the role."); return;
			}
			e.message.member.assignRole(role);
			e.message.channel.sendMessage("You now have **"+role.name+"** role.");
		}else if(e.message.guild.roles.find(r=>r.name.toLowerCase()==param))
			e.message.channel.sendMessage("The role is not self-assignable.");
	},

	removerole:function(e, params, settings){
		role = settings[e.message.guild.id].selfroles.find(role=>role.toLowerCase()==params.join(" ").toLowerCase());
		if(!e.message.member.roles.find(r=>r.name==role)){ e.message.channel.sendMessage("You don't have **"+role+"** role"); return; }
		if(role){
			role = e.message.guild.roles.find(r=>r.name.toLowerCase()==role.toLowerCase());
			e.message.member.unassignRole(role);
			e.message.channel.sendMessage("You no longer have **"+role.name+"** role.");
		}

	}

};