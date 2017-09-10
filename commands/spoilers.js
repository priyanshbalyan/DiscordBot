exports.run = (e, params, discordie) => {
	if(e.message.author.id == discordie.User.id) e.message.delete().catch(console.error); //Selfbot case
	else if(!discordie.User.can(8192, e.message.guild))
		e.message.channel.sendMessage("I don't have the permissions to delete your spoiler messages. Better delete them quick. ``Required Perm: MANAGE_MESSAGES``");
	else if(!discordie.User.can(16384, e.message.guild)) return e.message.channel.sendMessage("I don't have the permission to create spoiler tags. Better delete your message. ``Required Perm: EMBED_LINKS``");
	else
		e.message.delete().catch(err=>console.log(error));

	let re = /\s*\|\s*/;
	sparray = params.join(' ').split(re);

	if(!params || params.length < 1 || sparray.length <= 1) return e.message.channel.sendMessage("The correct usage is ``]spoilers <spoiler name> | <spoiler text>``");

	console.log(sparray);
	sparray[1] = sparray[1].split(' ').join('_');

	let embed = {
		"author":{
			"name":e.message.author.username,
			"icon_url":e.message.author.avatarURL
		},
		"description":"["+sparray[0]+"]("+sparray[1]+")"

	};
	e.message.channel.sendMessage('',false,embed);
}