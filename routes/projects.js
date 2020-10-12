const express = require('express')
const Project = require('../models/Project.js')
const { isCurrentUser, checkProjectOwnership } = require('../middleware/index')
const User = require('../models/User.js')
// ========================
// PROJECT ROUTES
// ========================
const router = express.Router({ mergeParams: true })
//add new project form
router.get('/new', isCurrentUser, (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			res.status(200).render('projects/newpost', { user: user })
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})
//add a new project
router.post('/', isCurrentUser, (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			// Join req.body with author object
			let newProject = {
				...req.body,
				author: {
					id: user._id,
					username: user.username
				}
			}
			Project.create(newProject).then((project) => {
				user
					.updateOne(
						{
							$push: { projects: project }
						},
						{ new: true }
					)
					.then((user) => {
						req.flash('success','Project crated')
						res.redirect(`/users/${req.params.id}`)
					})
			})
		})
		.catch((err) => {
			req.flash('error',err.message)
			res.status(400).json(err)
		})
})
//update project form
router.get('/:project_id/edit', checkProjectOwnership, (req, res) => {
	let userId = req.params.id
	Project.findById(req.params.project_id)
		.then((project) => {
			res.status(200).render('projects/edit', { project: project, userId: userId })
		})
		.catch((err) => {
			req.flash('error',err.message)
			res.status(400).json(err)
		})
})
//update projec routes
router.put('/:project_id', checkProjectOwnership, (req, res) => {
	Project.findByIdAndUpdate(req.params.project_id, req.body, { new: true })
		.then(() => {
			req.flash('success','Project Updated')
			res.status(200).redirect(`/users/${req.params.id}`)
		})
		.catch((err) => {
			req.flash('error',err.message)
			res.status(400).json(err)
		})
})

//delete projects
router.delete('/:project_id', checkProjectOwnership, (req, res) => {
	Project.findByIdAndDelete(req.params.project_id)
		.then((deletedProject) => {
			User.findByIdAndUpdate(req.params.id, {
				$pull: { projects: req.params.project_id }
			}).then((User) => {
				req.flash('success','Deleted')
				res.status(200).redirect(`/users/${req.params.id}`)
			})
		})
		.catch((err) => {
			req.flash('error',err.message)
			res.status(400).json(err)
		})
})

module.exports = router
