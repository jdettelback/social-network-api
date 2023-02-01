const { ObjectId } = require("mongoose").Types;
const { User, Thoughts } = require("../models");

module.exports = {
  // api/thoughts/  get all thoughts
  getThoughts(req, res) {
    Thoughts.find({})
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

  // api/thoughts/:id  get single thought
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.id })
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

  // api/thoughts/  create thought(post)
  createThought(req, res) {
    Thoughts.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json("problem creating thought" + err));
      console.log(req.body);
  },

  // api/thoughts/:id  update thought(put)
  deleteThought(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought deleted but no user found with this id",
            })
          : res.json({ message: "Thought and user deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json("problem deleting thought")});
  },

  // api/thoughts/:id  update thought(put)
  updateThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id" })
          : res.json({message: 'thought updated'})
      )
      .catch((err) => res.status(500).json("problem updating thought"));
  },

  // api/thoughts/:thoughtId/reactions  add reaction(post)
  addReaction(req, res) {
    console.log("addReaction");
    console.log(req.body);
    console.log(req.params.thoughtId);
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
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

  // api/thought/:thoughtId/reactions/:reactionId  delete reaction(delete)
  deleteReaction(req, res) {
    console.log("deleteReaction");
    console.log(req.body);
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: { $in: [req.params.reactionId] } } } },
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
