const mongoose = require('mongoose')

const User = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		// quote: { type: String }, //issi db mei user ka information store karte jaayenge...wiating for problem statement
	},
	{ collection: 'user-data' }
)

const model = mongoose.model('UserData', User)

module.exports = model