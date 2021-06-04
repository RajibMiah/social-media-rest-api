const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../../models/user')

//TODO::update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = bcrypt.hash(req.body.password, salt)
            } catch (err) {
                res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body})
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json('You can update only your account')
    }

})
//TODO::delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete({_id: req.params.id})
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json('You can  delete only your account')
    }
})

//TODO::GET A USER
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})


//TODO::FOLLOW A USER
router.put('/:id/follow', async (req, res) => {
    if (req.body.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.params.id}})
                await currentUser.updateOne({$push: {followings: req.body.userId}})
                res.status(200).json('You has been followed')
            } else {
                res.status(403).json('You already follow this user')
            }
        } catch (err) {
            res.status(50).json(err)
        }
    } else {
        res.status(403).json('you can not follow yourself')
    }
})

//TODO::UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.params.id}})
                await currentUser.updateOne({$pull: {followings: req.body.userId}})
                res.status(200).json('unfollow successful ')
            } else {
                res.status(403).json('You are not followed yet')
            }
        } catch (err) {
            res.status(50).json(err)
        }
    } else {
        res.status(403).json('you can not unfollow yourself')
    }
})

module.exports = router