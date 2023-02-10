const mongoose = require("mongoose")

const WorkerSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name : {type : String, required:true },
        image : { data:Buffer, contentType : String }
    },
    { collection: 'Workers' }
)
module.exports = WorkerSample = mongoose.model('UserData',WorkerSchema)