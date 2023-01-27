const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find({})
            .then(async (users) => {
                const userObj = {
                    users
                };
                console.log(userObj);
                return res.json(userObj);
            })
            .catch((err) => {
                console.log("problem getting users");
                return res.status(500).json(err);
            });
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
        .select('-__v')
        .then(async (user) => 
            !user 
            ? res.status(404).json({ message: 'No user found with this id' }) 
            : res.json(user)
        )
        .catch((err) => {
            console.log("problem getting single user");
            res.status(500).json(err);
        });
    },

    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json("problem creating user"));
    },

    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.id })
        .then((user) => 
            !user
            ? res.status(404).json({ message: 'No user found with this id' })
            : Thought.findOneAndRemove(
                { username: user.username },
                { $pull: { thoughts: { username: user.username } } },
                { new: true }
            )
        )
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: 'User deleted but no thoughts found with this id' })
        : res.json({ message: 'User and thoughts deleted' })
        )
        .catch((err) => res.status(500).json("problem deleting user"));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) => 
        !user
        ? res.status(404).json({ message: 'No user found with this id' }) 
        : res.json(user)
        )
        .catch((err) => res.status(500).json("problem updating user"));
}
}

