exports.run = (e, params, discordie) => {
	var embed = {
			"color":123134,
			"author":{
				"name":"Commands available"
			},
			//"timestamp":Date.now(),
			"description":"Use ] as a prefix for these commands",
			"fields":[
				{
					"name": "New Commands",
					"value":"**yomama, google, selfrolelist, addrole, removerole, mute, unmute**"
				},
				{
					"name":"Interesting", 
					"value":"**yomama** Makes a yo mama joke\n**google** Do a google search with the given words\n**lovecalc** Calculate love between mentioned users\n**weather** Shows weather of a location\n**quote** Get a random quote\n**urban** Gets definition of a word from urban dictionary\n**rng** Get a random number\n**flipcoin** Head or Tail?\n**tag** Create ur own tag commands with this command (Use command for more info)\n**8ball** Ask 8ball anything\n**say** Make the bot say something\n"
				},
				{
					"name":"Moderation Perks", 
					"value":"**set** Set and reset features of the bot for the guild (Use command for more info)\n**kick** Kicks mentioned user out of the guild\n**ban** Bans the mentioned user from the guild\n**mute** Mutes the mentioned user for specified time\n**unmute** Unmutes the mentioned user\n**purge** Purge number of specified messages in a channel"
				},
				{
					"name":"Utilities", 
					"value":"**ping** Checks for bot ping time\n**clean** Cleans bot messages\n**avatar** Gets user avatar\n**getroles** Get roles of the mentioned user\n**getperms** Get perms for the mentioned user\n**serverinfo** Get Information for the guild\n**userinfo** Gets mentioned user's information\n**emote** Gets the direct link for an emote\n**invite** Invite this bot to your server"
				},
				{
					"name":"Roles", 
					"value":"**selfrolelist** Gets list of self-assignable roles for the guild (Has to be set before by a mod using ``set selfrole <rolename>``\n**addrole** Assigns the role to the user if its set as a self-assignable role\n**removerole** Remove the self assignable role from the user"
				}
			],
			"thumbnail":{
				"url":discordie.User.avatarURL
			}
	};
	e.message.channel.sendMessage(" ", false, embed);
}