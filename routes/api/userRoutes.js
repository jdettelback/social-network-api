const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
}   = require('../../controllers/userController');
// const {
//     getThoughts, getSingleThought, createThought, updateThought, deleteThought
// } = require('../../controllers/thoughtController');

// api/users
router.route('/')
    .get(getUsers)
    .post(createUser)

// api/users/:userId
router.route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);

// api/users/:userId/thoughts/:thoughtId
//router.route('/:userId/thoughts/:thoughtId').delete(deleteThought);

//api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend);

//api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(deleteFriend);

module.exports = router;