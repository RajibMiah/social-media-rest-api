const router = require('express').Router()
const User = require('../../models/user')
const bcrypt = require('bcrypt')


//Register
router.post('/register', async (req, res) => {

    try {
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        // create new user
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword,

        })

        //save user and give response
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

//Login
router.post('/login', async (req, res) => {
    try {
        const user =  User.findOne({
            email: req.body.email
        })
        !user && res.status(404).json("user is not found")
        const validatePassword = await bcrypt.compare(req.body.password,user.password)
        !validatePassword && req.status(400).json('wrong password')
        res.status(200).json(user)
    } catch (err) {
       return res.status(500).json(err)
    }
})

module.exports = router