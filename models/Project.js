const mongoose = require('mongoose')
//Schema
const ProjectSchema = mongoose.Schema({
	title: { type: String, required: true },
	thumbnail: String,
	url: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
})
// export model
module.exports = mongoose.model('Project', ProjectSchema)
