const jwt = require("jsonwebtoken")
const config = require("../config/config")
const { validationResult } = require("express-validator")
const validations = require("../utils/validator")
const { authController } = require("../controllers")
const Play = require("../models/Play")
const User = require("../models/User")

module.exports = {
    get: {
        getCreatePlay(req, res) {
            res.render('theaters/create', {
                titleText: 'Create Theater',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
            })
        },
       async details(req, res) {
        const play = await Play.findById(req.params.id).lean()
        const token = req.cookies[config.development.cookie]
        const decodedObject = jwt.verify(token, config.development.privateKey)
        const id = decodedObject.userID
    
        const likes = await Play.findById(req.params.id)
        const user =  await User.findById(id)
        
        res.render('theaters/details',{
            titleText: 'Details page',
            ...play,
            isLoggedIn: req.isLoggedIn,
            username: req.username,
            creator: play.creator == user._id ? true : false,
            isLiked: likes.usersLikes.includes(user._id)
        })   
        },
        async like(req, res) {
            const token = req.cookies[config.development.cookie]
            const decodedObject = jwt.verify(token, config.development.privateKey)
            const id = decodedObject.userID    
            const playID = req.params.id
            await Play.findByIdAndUpdate(playID, {
                $addToSet: {
                    usersLikes: id
                }
            })
            await User.findByIdAndUpdate(id, {
                $addToSet: {
                    likedPlays: playID
                }
            })
            res.redirect(`/details/${playID}`)
        },
        async edit(req, res) {
            const play = await Play.findById(req.params.id).lean()    
            const checked = play.isPublic === true ? 'checked' : ''
        
            res.render('theaters/edit', {
                titleText: 'Edit Theater',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                ...play,
                isChecked: checked
            })
        },
        async delete(req, res) {
            await Play.findByIdAndDelete(req.params.id)
            res.redirect('/')
        }
    },
    post: {
    async createPlay(req, res) {
      const token = req.cookies[config.development.cookie]
      const decodedObject = jwt.verify(token, config.development.privateKey)
      const id = decodedObject.userID

      const { title, description, imageUrl, isPublic } = req.body
      const isChecked = isPublic === "on"

      const date = (new Date() + "").slice(0, 24)

      const errors = validationResult(req)
      const err = errors.array()
      if (err[5].value === "" || err[6].value === "" || err[7].value === "") {
        res.render("theaters/create", {
          title: "Create Theater",
          isLoggedIn: req.isLoggedIn,
          username: req.username,
          message: "All fields are required",
        })
        return
      }
      new Play({
        title,
        description,
        imageUrl,
        isPublic: isChecked,
        createdAt: date,
        creator: id,
      }).save()
      res.redirect("/")
    },
    async edit(req, res) {
    const { title, description, imageUrl, isPublic } = req.body    
    const play = await Play.findById(req.params.id).lean()   
    const isChecked = isPublic === 'on'
    const checked = isChecked ? 'checked' : ''
    const id = req.params.id
    
    const errors = validationResult(req) 
    const err = errors.array()    
    if(err[5].value === '' || err[6].value === '' || err[7].value === '') {         
        res.render('theaters/edit', {
             title: "Edit Theater",
             isLoggedIn: req.isLoggedIn,
             username: req.username,
             ...play,
             message: 'All fields are required',
             isChecked: checked
        })
        return
    }
    await Play.findByIdAndUpdate({_id: id}, { title, description, imageUrl, isPublic: isChecked })
    res.redirect(`/details/${id}`)
  }
 }
}
