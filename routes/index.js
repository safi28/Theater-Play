const { Router } = require("express")
const router = Router()
const { authController } = require("../controllers")
const Play = require('../models/Play')

router.get("/", authController.getUserStatus, async (req, res, next) => {  
    const limit = req.isLoggedIn ? 0 : 3
    const criteria = req.isLoggedIn ? { createdAt: '-1' } : { usersLikes: '-1'}
    const plays = await Play.find({ isPublic: true }).limit(limit).sort(criteria).lean()  
          
    res.render('index', {
        titleText: 'Home Page',
        isLoggedIn: req.isLoggedIn,
        plays
    })
})
router.get('/sort/likes', authController.getUserStatus, authController.authAccess, async(req, res) => {
    const criteria = { usersLikes: '-1'}
    const plays = await Play.find().sort(criteria).lean()
    
    res.render('index', {
        titleText: 'Home Page',
        isLoggedIn: req.isLoggedIn,
        plays
    })
})
router.get('/sort/date', authController.getUserStatus, authController.authAccess, async(req, res) => {
    const criteria = { createdAt: '-1' }
    const plays = await Play.find().sort(criteria).lean()
    res.render('index', {
        titleText: 'Home Page',
        isLoggedIn: req.isLoggedIn,
        plays
    })
})
router.get("*", authController.getUserStatus, (req, res) => {
    res.render("errors/404", {
        titleText: "Error Page",
        isLoggedIn: req.isLoggedIn,
    });
});

module.exports = router