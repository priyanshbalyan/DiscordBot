let fs = require('fs');

let recordtime = 10;
let recordeddata = [];
let recordinguser = null;
let recordreply = null;

exports.run = (e, params, discordie) => {
	
	switch(params[0]){
		case "record":
			if(recordinguser) return e.message.reply("Already recording");
	
			const vch = e.message.author.getVoiceChannel(e.message.guild);
			if(!vch) return e.message.reply("You need to be in a voice channel for this.");

			vch.join().then(info => {	
				recordreply = e.message.reply.bind(e.message);
				e.message.channel.sendMessage("Recording audio for "+recordtime);
				recordeddata = [];
				recordinguser = e.message.author.id;
				starttime = Date.now();

				recordtimer = setTimeout(()=>{
					play(info, discordie);
					e.message.reply("Playing");
				}, recordtime*1000);
			});
			break;

		case "stop":
			e.message.reply("Stopped");
			stopplaying = true;
			recordinguser = false;
			if(recordtimer){
				clearTimeout(recordtimer);
				recordtimer = null;
			}
			discordie.User.getVoiceChannel(e.message.guild).leave();
			break;

		default:
			let embed = {
				"description":"This command record's user's voice for 10 seconds and then plays it back (User needs to be in a voice channel first)",
				"fields":[
					{"name":"record", "value":"Start recording voice"},
					{"name":"stop", "value":"Stop playback"}
				]
			};
			e.message.channel.sendMessage("",false,embed);
	}

	discordie.Dispatcher.on("VOICE_CONNECTED", e=>{
		e.voiceConnection.getDecoder().onPacket = (packet) => {
			const user = e.voiceConnection.ssrcToUser(packet.ssrc);
			if(!user) return;
			if(user.id != recordinguser) return;
			packet.playbackTime = Date.now() - starttime;
			recordeddata.push(packet);

			const name = user ? user.username: "<unknown>";
			console.log("recording "+packet.chunk.length+" bytes from "+name+" @ "+packet.timestamp);
		}
	});

}

let stopplaying = false;

function play(info, discordie){
	stopplaying = false;
	starttime = Date.now();

	if(!discordie.VoiceConnections.length) return console.log("Voice not connected.");

	if(!info) info = discordie.VoiceConnections[0];
	let voiceConnection = info.voiceConnection;

	let encoder = voiceConnection.getEncoder({ frameDuration: 20, proxy: true });

	function sendPacket(){
		let packet = recordeddata[0];
		if(!packet && recordreply) recordreply("Finished playing");
		if(!packet || stopplaying){
			recordinguser = null;
			return;
		}
		let currenttime = (Date.now() - starttime);
		let nexttime = packet.playbackTime - currenttime;
		setTimeout(sendPacket, nexttime);

		if(currenttime < nexttime) return;

		recordeddata.shift(packet);
		let numsamples = opus_packet_get_samples_per_frame(packet.chunk);
		console.log("Playing ", packet.chunk.length, numsamples);
		encoder.enqueue(packet.chunk, numsamples);
	}
	sendPacket();
}



//------------- OPUS helper functions 

const Constants = {
	OPUS_BAD_ARG: -1,
	OPUS_INVALID_PACKET: -4
};

function opus_packet_get_samples_per_frame(packet, sampleRate){
	sampleRate = sampleRate || 48000;

	let audioSize;
	if (packet[0] & 0x80) {
		audiosize = ((packet[0] >> 3) & 0x3);
		audiosize = (sampleRate << audiosize) / 400;
	} else if ((packet[0] & 0x60) == 0x60)
		audiosize = (packet[0] & 0x08) ? sampleRate / 50 : sampleRate / 100;
	else {
		audiosize = ((packet[0] >> 3) & 0x3);
		if (audiosize == 3)
			audiosize = sampleRate * 60 / 1000;
		else
			audiosize = (sampleRate << audiosize) / 100;
	}
	return audiosize;
}

function opus_packet_get_nb_frames(packet){
	let count;
	if (packet.length < 1) return Constants.OPUS_BAD_ARG;
  	count = packet[0] & 0x3;

  	if (count == 0) return 1;
  	else if (count != 3) return 2;
  	else if (packet.length < 2) return Constants.OPUS_INVALID_PACKET;
  	else return packet[1] & 0x3F;
}

function opus_packet_get_nb_samples(packet, sampleRate){
	sampleRate = sampleRate || 48000;
	
	let count = opus_packet_get_nb_frames(packet);
	if(count < 0) return count;

	let samples = count * opus_packet_get_nb_frames(packet, sampleRate);
	if(samples * 25 > sampleRate * 3)
		return Constants.OPUS_INVALID_PACKET;
	return samples;
}