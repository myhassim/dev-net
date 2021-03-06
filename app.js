// Figma
// https://www.figma.com/file/UlDc2L5xSIKOQKXm1Q69uS/Untitled?node-id=0%3A1 home
// https://www.figma.com/file/kMMxw9RjTrrIgvDXfIzNtc/Untitled?node-id=0%3A1 sign up
// https://www.figma.com/file/D2gYAvIDCX6r8kZQwbEFg3/Untitled User
// requires
 require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const methodOverride = require('method-override')
const User = require('./models/User.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const dbUrl = process.env.LOCAL_DB||process.env.PRODUCTION_DB
const port = process.env.PORT || 3000
const flash = require('connect-flash')
// connect to data base
mongoose.connect(
	dbUrl,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	},
	() => console.log('DB Connected')
)
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

//passport config
app.use(
	require('express-session')({
		secret: 'qwertyuiopasdfghjklzxcvbnm',
		resave: false,
		saveUninitialized: false
	})
)

//passport strategy
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(flash())

//set locals
const setLocals = (req, res, next) => {
	res.locals.success =req.flash('success')
	res.locals.error =req.flash('error')

	res.locals.currentUser = req.user
	next()
}

app.use(setLocals)
//Root route
app.get('/', (req, res) => {
	res.redirect('/users')
})
// Routes
const userRoutes = require('./routes/users')
const projectRoutes = require('./routes/projects')
const sessionRoutes = require('./routes/sessions')

app.use('/users', userRoutes)
app.use('/users/:id/projects', projectRoutes)
app.use('/session', sessionRoutes)

//sever start
app.listen(port, () => console.log('sever has started'))
