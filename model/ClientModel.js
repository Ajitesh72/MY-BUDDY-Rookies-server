const mongoose = require('mongoose')

const ClientModel = new mongoose.Schema(
	{   
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        applicationStatus:{ type:String,required:true},  //i.e it will be accepted by me or mehdi
        role:{type:String,required:true},
		// quote: { type: String }, //issi db mei user ka information store karte jaayenge...wiating for problem statement
	},
	{ collection: 'Client-data' }
)

const model = mongoose.model('CLientData', ClientModel)

module.exports = model