const User = require("../models/User")
const config = require("../config/config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const authCookie = config.development.cookie
const privateKey = config.development.privateKey

const generateToken = (data) => {
  const token = jwt.sign(data, privateKey)
  return token
}
const signUp = async (req, res) => {
  const { username, password } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  new User({ username, password: hashedPassword }).save()
  return true
}

const signIn = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username: username })
  const status = await bcrypt.compare(password, user.password)

   if (status) {
    const token = generateToken({
      userID: user._id,
      username: user.username,
    })
    return res.cookie(authCookie, token)
  } else {
    return res.render('auth/login', {
    title: "Login Page",
    isLoggedIn: req.isLoggedIn,
    message: 'Password is incorrect'
   })
  }
}
const getUserStatus = (req, res, next) => {
  const token = req.cookies[authCookie]
  if (!token) {
    req.isLoggedIn = false
  }
  try {
    jwt.verify(token, privateKey)
    req.isLoggedIn = true
  } catch (e) {
    req.isLoggedIn = false
  }
  next()
}
const authAccess = (req, res, next) => {
  const token = req.cookies[authCookie]
  if (!token) {
   return res.redirect("/")
  }
  try {
    jwt.verify(token, privateKey)
    next()
  } catch (e) {
    return res.redirect("/")
  }
}
const guestAccess = (req, res, next) => {
    const token = req.cookies[authCookie]
    if(token) {
        return res.redirect('/')
    }
    next()
}
const getUsername = (req, res, next) => {
  const token = req.cookies[authCookie]
  if (token) {
    const decodedObject = jwt.verify(token, privateKey)
    req.username = decodedObject.username
  }
  next()
}

module.exports = {
  signUp,
  signIn,
  getUserStatus,
  authAccess,
  getUsername,
  guestAccess
}
