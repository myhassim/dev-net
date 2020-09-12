const express = require('express')
const passport = require('passport')

const router = express.Router()
//register rout
router.get('/new', (req, res) => {
	res.render('users/login')
})
// handle log in
router.post(
	'/',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/session/new'
	}),
	(req, res) => {}
)
// log out
router.delete('/', (req, res) => {
	req.logOut()
	res.redirect('/')
})

module.exports = router
