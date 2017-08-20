const fs = require('fs');
var currentstarred = "";

function enotif(e, flag, str) {
    color = flag == 1 ? 123134 : 0xe91e63;
    var embed = {
        "color": color,
        "description": str
    };
    e.message.channel.sendMessage(" ", false, embed).then().catch(console.error);
}

function fembed(e, str) {
    var data = {
        "description": e.message.content,
        "color": 123134,
        "author": {
            "name": e.message.author.username,
            "url": e.message.author.avatarURL,
            "icon_url": e.message.author.avatarURL
        },
        "footer": {
            "text": "Deleted"
        },
        "timestamp": e.message.timestamp
    };
    //console.log(e.message.attachments[0]);
    if (e.message.attachments.length > 0)
        if (str == "delete") data.description = e.message.content + "(Deleted attachment)";
        else data["image"] = { "url": e.message.attachments[0].url };

    if (e.message.embeds.length > 0) return e.message.embeds[0];

    if (str == "delete") { data.footer.text = "Deleted"; return data; }
    if (str == "starred") { data.footer.text = "Starred"; return data; }

    e.message.channel.sendMessage(" ", false, { "description": str });
}

module.exports = {

    welcome: function(e, discordie, settings) {
        if (settings.hasOwnProperty(e.guild.id) && settings[e.guild.id].welcomech) {
            var channel = discordie.Channels.get(settings[e.guild.id].welcomech);
            channel.sendMessage(e.member.mention + "Welcome " + " to " + e.guild.name + " !");
        }
    },

    goodbye: function(e, discordie, settings) {
        if (settings.hasOwnProperty(e.guild.id) && settings[e.guild.id].leavech) {
            var channel = discordie.Channels.get(settings[e.guild.id].leavech);
            channel.sendMessage(e.user.username+"#"+e.user.discriminator+" left the guild.");
        }
    },

    deletelog: function(e, discordie, settings) {
        //if guild has set delete channel
        if (e.message 
        	&& settings.hasOwnProperty(e.message.guild.id) 
        	&& settings[e.message.guild.id].deletech 
        	&& e.message.author.bot == false 
        	&& !e.message.content.startsWith("]spoil")) {
            var channel = discordie.Channels.get(settings[e.message.guild.id].deletech);
            channel.sendMessage(" ", false, fembed(e, "delete"));
        }
    },

    starboard: function(e, discordie, settings) {
        //if starboard is set in the guild
        if (e.message 
        	&& settings.hasOwnProperty(e.message.guild.id) 
        	&& settings[e.message.guild.id].starboardch) {
            console.log(JSON.stringify(e.message.reactions))
                //if the reaction is a star
            if (e.emoji.name.charCodeAt() == 11088 && currentstarred != e.message.id && e.message.reactions[0].count > 0) {
                var channel = discordie.Channels.get(settings[e.message.guild.id].starboardch)
                channel.sendMessage(":star: in <#" + e.message.channel.id + "> ID:" + e.message.id, false, fembed(e, "starred"));
                currentstarred = e.message.id;
            }
        }
    }

};