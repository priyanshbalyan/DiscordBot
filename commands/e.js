const fs = require('fs');
request = require('request');
let Jimp = require('jimp');

exports.run = (e, params, discordie) => {	
	if(e.message.author.id !== discordie.User.id) return;  //Not selfbot
	try{
		e.message.delete();
	}catch(err){console.log(err)}
	
	switch(params[0]){	

		case "add":
			let uri = params[2];
			let path = './emojis/'+params[1]+'.png';

			request.head(uri, function(err, res, body){
				if(!err){
					console.log('content-type:', res.headers['content-type']);
					console.log('content-length:', res.headers['content-length']);
					request(uri).pipe(fs.createWriteStream(path)).on('close', ()=>{
						console.log("Download complete!");
						Jimp.read(path, (err, image)=>{
							image.resize(32,32)
								 .write(path);
							console.log("Emoji resized");
						});
					});
					e.message.channel.sendMessage("Emoji added to collection.").then(m=>m.delete(3000));
				}else
					console.log(err.message);
			});
		break;

		default: 
			e.message.channel.uploadFile("./emojis/"+params[0]+".png").then().catch(err=>{
				console.log(err);
				e.message.delete();
			});

	}
}