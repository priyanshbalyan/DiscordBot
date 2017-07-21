const fs = require('fs');

function enotif(e, flag, str){
	color = flag==1 ? 123134 : 0xe91e63;
	var embed = {
		"color":color,
		"description":str
	};
	e.message.channel.sendMessage(" ", false, embed).then().catch(console.error);
}

exports.run = (e, params, discordie) => {

	let settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));

	if(!settings.hasOwnProperty(e.message.guild.id))
			settings[e.message.guild.id] = { welcomech:null, starboardch:null, deletech:null, selfroles:[]};
	
	if(e.message.author.can(16, e.message.guild))   //MANAGE_CHANNELS perm
			switch(params[0]){
				case "deletelog": settings[e.message.guild.id].deletech = e.message.channel.id;
					enotif(e,1,"Deleted messages logging successfully set in <#"+e.message.channel.id+">.");
					break;

				case "starboard": settings[e.message.guild.id].starboardch = e.message.channel.id;
					enotif(e,1,"Starboard successfully set in <#"+e.message.channel.id+">.");
					break;

				case "welcome": settings[e.message.guild.id].welcomech = e.message.channel.id;
					enotif(e, 1, "Welcome messages successfully set in <#"+e.message.channel.id+">.");
					break;

				case "selfrole":
					params.shift();
					var param = params.join(" ").toLowerCase();

					if(!e.message.author.can(268435456, e.message.guild)) return;  //MANAGE_ROLES permission
					if(!discordie.User.can(268435456, e.message.guild)){ 
						enotif(e, 0, "I don't have enough permissions to add a self assignable role. ``Required Perm: MANAGE_ROLES``");
						return; 
					}
					
					role = e.message.guild.roles.find(r=>r.name.toLowerCase() == param);
					
					if(!role){ 
						enotif(e, 0, "Can't find a role with that name."); 
						return; 
					}

					if(!settings[e.message.guild.id].selfroles.find(r=>r.toLowerCase()==param)){
						settings[e.message.guild.id].selfroles.push(role.name);
						enotif(e, 1, "Added **"+role.name+"** to the list of self-assignable roles.");
					}else
						enotif(e, 0, "Role is already self-assignable.");
					break;

				case "removerole":
					if(!e.message.author.can(268435456, e.message.guild)) return;
					params.shift();
					if(settings[e.message.guild.id].selfroles.find(r=>r.toLowerCase()==params.join(" ").toLowerCase())){
						settings[e.message.guild.id].selfroles.splice(settings[e.message.guild.id].selfroles.indexOf(params.join(" "),1));
						enotif(e, 1, "Role removed.");
					}else
						enotif(e, 0, "No matching role found in the list");
					break;

				case "reset" :  
						settings[e.message.guild.id].deletech = null;
						settings[e.message.guild.id].welcomech = null;
						settings[e.message.guild.id].starboardch = null;

						enotif(e, 1, "Settings reset.");
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

		fs.writeFile("./settings.json", JSON.stringify(settings, null, 4), err => {
			if(err) console.log(err);
		});
}