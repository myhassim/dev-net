const express = require('express')
const User = require('../models/User.js')
const passport = require('passport')
const { isCurrentUser } = require('../middleware/index')
const router = express.Router()
// ========================
// USER ROUTES
// ========================
//Get all users
router.get('/', (req, res) => {
	User.find({})
		.then((users) => {
			res.status(200).render('users/index', { users: users })
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})
//add new project form
router.get('/new', (req, res) => {
	res.render('users/add')
})
//add a new user
router.post('/', (req, res) => {
	if (req.body.avatar == '') {
		req.body.avatar = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
	}
	const { password, ...newUser } = req.body
	User.register(newUser, password)
		.then((newUser) => {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/users')
			})
		})
		.catch((err) => {
			res.status(422).json(err)
		})
})

//get 1 user
router.get('/:id', (req, res) => {
	User.findById(req.params.id)
		.populate('projects')
		.then((user) => {
			res.status(200).render('users/user', { user: user })
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})
//update user form
router.get('/:id/edit', isCurrentUser, (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			res.status(200).render('users/edit', { user: user })
			console.log(user)
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})
//update users
router.put('/:id', isCurrentUser, (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(() => {
			res.status(200).redirect(`/users/${req.params.id}`)
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})
//delete users
router.delete('/:id', isCurrentUser, (req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then((deletedUser) => {
			Project.deleteMany({ _id: { $in: deletedUser.projects } }).then(() => {
				res.status(200).redirect('/users')
			})
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})
//export module
module.exports = router
