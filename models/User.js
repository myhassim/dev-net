const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')
//Schema
const UserSchema = mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	avatar: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' },
	stars: { type: Number, default: 0 },
	password: String ,
	status: { type: String, default: 'common' },
	awards: [],
	projects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project'
		}
	]
})
UserSchema.plugin(passportLocalMongoose)
// export model
module.exports = mongoose.model('User', UserSchema)
