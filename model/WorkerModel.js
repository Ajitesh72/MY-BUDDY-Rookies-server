const mongoose = require('mongoose')

const WorkerModel = new mongoose.Schema(
	{
		// name: { type: String, required: true },
		// email: { type: String, required: true, unique: true },
		// password: { type: String,
		// 	 required: true 
		// 	},
        // role:{type:String,required:true},
        // applicationStatus:{type:String,required:true},  //i.e it will be accepted by me or mehdi
		// image : { data:Buffer, contentType : String,required:false }
		// // quote: { type: String }, //issi db mei user ka information store karte jaayenge...wiating for problem statement
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        applicationStatus:{ type:Boolean,required:true},  //i.e it will be accepted by me or mehdi and if accepted then only he can addwork or browse work
        requestStatus:{ type:Boolean,required:true},  //i.e it will be true on submiting application it will be accepted by me or mehdi
        role:{type:String,required:true},
		profession:{type:String},
		about:{type:String},
		image : { data:Buffer, contentType : String }
	},
	{ collection: 'Worker-data' }
)

const model = mongoose.model('WorkerData', WorkerModel)

module.exports = model