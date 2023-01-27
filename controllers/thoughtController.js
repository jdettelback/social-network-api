const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find({})
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
        };
        console.log(thoughtObj);
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log("problem getting thoughts");
        return res.status(500).json(err);
      });
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .select("-__v")
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log("problem getting thought");
        res.status(500).json(err);
      });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json("problem creating thought"));
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: { _id: thought._id } } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought deleted but no user found with this id",
            })
          : res.json({ message: "Thought and user updated" })
      )
      .catch((err) => res.status(500).json("problem deleting thought"));
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json("problem updating thought"));
  },

  addReaction(req, res) {
    console.log("addReaction");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json("problem adding reaction"));
  },

  deleteReaction(req, res) {
    console.log("deleteReaction");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json("problem deleting reaction"));
  },
};
