var Utilities = require('../modules/utilities.js');

exports.run = (e, params, discordie) => {
	Utilities.fembed(e, "Its " + (Math.random() > 0.5 ? "Heads" : "Tails"));
}