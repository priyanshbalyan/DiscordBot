const fs = require('fs');

exports.run = (e, params, discordie) => {
	//params:  tagcommand tagname tagdata
			var gid = e.message.guild.id;
			var tagdata = JSON.parse(fs.readFileSync("./tagdata.json"));
			
			if(!tagdata.hasOwnProperty(gid))
				tagdata[gid] = {};// "3276186378936":{ "tagname":{"value":"adasdadad", "user":"Raiden"} }
			
			switch(params[0]){
				case "create":
					//console.log(params[1])
					if(tagdata[gid].hasOwnProperty(params[1]))
						return e.message.channel.sendMessage('Tag \"'+params[1]+'\" already exists.');
					else if(["create","delete","list","info","help"].indexOf(params[1]) != -1)
						return e.message.channel.sendMessage("Can't create a tag with a reserved keyword as a name.");
					else{
						tagdata[gid][params[1]] = {"value": params.slice(2).join(" "), "user": e.message.author};
						e.message.channel.sendMessage('Tag \"'+params[1]+'\" successfully created.');
					}
					break;

				case "delete":
					if(tagdata[gid].hasOwnProperty(params[1])){
						if(tagdata[gid][params[1]].user.id == e.message.author.id
							|| e.message.author.can(2 | 4 | 16 | 32 | 268435456, e.message.guild)){
							delete tagdata[gid][params[1]];
							e.message.channel.sendMessage("Tag deleted.");
						}else
							e.message.channel.sendMessage("You don't own this tag.");
					}
					else
						e.message.channel.sendMessage("No matching tag found.")
					break;

				case "list":
					e.message.channel.sendMessage("All tags : "+Object.keys(tagdata[gid]).join(", "));
					break;

				case "info":
					if(tagdata[gid].hasOwnProperty(params[1]))
						e.message.channel.sendMessage("Owned by : "+tagdata[gid][params[1]].user.username+"#"+tagdata[gid][params[1]].user.discriminator);
					else
						e.message.channel.sendMessage("No matching tag found");
					break;

				case undefined:
				case "help":
					var embed = {
						"color":123134,
						"fields":[
							{"name":"create ``<tagname> <tagcontent>``", "value":"Creates a new tag."},
							{"name":"delete ``<tagname>``", "value":"Deletes an existing tag."},
							{"name":"info ``<tagname>``", "value":"Gets userinfo on the tag"},
							{"name":"list", "value":"Lists all the tags available in the database."},
						]
					};
					e.message.channel.sendMessage(" ",false,embed);
					break;

				default: 
					if(tagdata[gid].hasOwnProperty(params[0]))
						e.message.channel.sendMessage(tagdata[gid][params[0]].value);
					else
						e.message.channel.sendMessage("No matching tag found.");
			}
			
			fs.writeFile("./tagdata.json", JSON.stringify(tagdata, null, 4), err => {
				if(err) console.log(err);
			});
	
}