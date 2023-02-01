const { ObjectId } = require("mongoose").Types;
const { User, Thoughts } = require("../models");

module.exports = {
  // api/users  get all users
  getUsers(req, res) {
    User.find({})
      .then(async (users) => {
        const userObj = {
          users,
        };
        console.log(userObj);
        return res.json(userObj);
      })
      .catch((err) => {
        console.log("problem getting users");
        return res.status(500).json("problem getting users");
      });
  },

  // api/users/:id  get single user
  getSingleUser(req, res) {
    console.log(req.params.userId);
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then(async (user) => {
        console.log(user + " is user");
        !user
          ? res.status(404).json({ message: "No user found with this id" })
          : res.status(200).json(user);
      }
      )
      .catch((err) => {
        console.log(err + "problem getting single user");
        res.status(500).json("problem getting single user");
      });
  },

  // api/users  create user(post)
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json("problem creating user:" + err));
    console.log(req.body);
  },

  // api/users/:id  delete user(post)
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id" })
          : Thoughts.deleteMany({ _id: { $in: user.thoughts } })
        )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: "User deleted but no thoughts found with this id",
            })
          : res.json({ message: "User and thoughts deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json("problem deleting user")}
      );
  },

  // api/users/:id  update user(put)
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json("problem updating user"));
  },

  // api/users/:userId/friends/:friendId  add friend
  addFriend(req, res) {
    console.log(req.params.userId);
    console.log(req.params.friendId);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json("problem adding friend");
      });
  },

  // api/users/:userId/friends/:friendId  delete friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json("problem deleting friend"));
  },
};
