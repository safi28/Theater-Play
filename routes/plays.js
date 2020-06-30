const { Router } = require('express')
const router = Router()
const validations = require('../utils/validator')
const { authController, playController } = require("../controllers")

router.get('/create', authController.getUserStatus, authController.getUsername, authController.authAccess, playController.get.getCreatePlay)
router.post('/create', validations, authController.getUserStatus, authController.getUsername, authController.authAccess, playController.post.createPlay)
router.get('/details/:id', authController.getUserStatus, authController.authAccess, playController.get.details)
router.get('/like/:id', playController.get.like)
router.get('/edit/:id', authController.getUserStatus, authController.authAccess, playController.get.edit)
router.post('/edit/:id',validations, authController.authAccess, authController.getUserStatus, playController.post.edit)
router.get('/delete/:id', authController.authAccess, playController.get.delete)
module.exports = router