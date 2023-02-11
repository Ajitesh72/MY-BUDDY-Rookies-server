const mongoose = require('mongoose')

const WorkerModel = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String,
			//  required: true 
			},
        role:{type:String,required:true},
        applicationStatus:{type:String,required:true},  //i.e it will be accepted by me or mehdi
		image : { data:Buffer, contentType : String }
		// quote: { type: String }, //issi db mei user ka information store karte jaayenge...wiating for problem statement
	},
	{ collection: 'Worker-data' }
)

const model = mongoose.model('WorkerData', WorkerModel)

module.exports = model