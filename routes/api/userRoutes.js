const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
}   = require('../../controllers/user-controller');

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/:userId/thoughts/:thoughtId').delete(deleteThought);

router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;