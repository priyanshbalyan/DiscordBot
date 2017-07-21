var Utilities = require('../modules/utilities.js');

exports.run = (e, params, discordie) => {
	Utilities.fembed(e, "Your random number is " + Math.round(Math.random()*100));
}