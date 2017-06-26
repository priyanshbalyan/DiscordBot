const fs = require('fs');

module.exports = {
	tag:function(e, params){
		//params:  tagcommand tagname tagdata
		var gid = e.message.guild.id;
			var tagdata = JSON.parse(fs.readFileSync("./tagdata.json"));
			if(!tagdata.hasOwnProperty(gid))
				tagdata[gid] = {"tname":null, "tdata":null, tuser:null}
			switch(params[0]){
				case "create":
					tagdata[gid].tname = params[1];
					params = params.slice(2);
					tagdata[gid].tdata = params.join(" ");
					tagdata[gid].tuser = e.message.author;
					break;

				case "delete":
					if(tagdata[gid].hasOwnProperty(params[1]))
						delete tagdata[gid].params[1];
					break;

				case "list":
					e.message.channel.sendMessage("All tags : "+Object.keys(tagdata[gid]).join(", "));
					break;

				case "info":

					break;

				case "help":

					break;

				default: 
					if(tagdata[gid].hasOwnProperty(params[1]))
						e.message.channel.sendMessage(tagname[gid][params[1]]);
					else
						e.message.channel.sendMessage("No matching tag found.");
			}
			fs.writeFile("./tagdata.json", JSON.stringify(tagdata), err => {
				if(err) console.log(err);
			});
	}
};