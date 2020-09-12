const Project = require('../models/Project.js')

// middleware
const isCurrentUser = (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user._id == req.params.id) {
			return next()
		}
		return res.redirect('back')
	}
	res.redirect('/session/new')
}
const checkProjectOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Project.findById(req.params.project_id)
			.then((project) => {
				if (project.author.id.equals(req.user.id)) {
					return next()
				}
				return res.redirect('back')
			})
			.catch((err) => {
				res.json(err)
			})
	} else {
		res.redirect('/session/new')
	}
}

module.exports = { isCurrentUser, checkProjectOwnership }
