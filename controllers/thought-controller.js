const { Thought, User } = require('../models');

const thoughtController = {
    //Get all thoughts
    getAllThought(req, res) {
        Thought.find({})
            .then(dbthoughtData => res.json(dbthoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //Get one thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then(dbthoughtData => {
                if (!dbthoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' })
                    return;
                }
                res.json(dbthoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //Create a new thought
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: _id } }, { new: true })
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err))
    },
    // Update thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbthoughtData => {
                if (!dbthoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' })
                    return;
                }
                res.json(dbthoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    // Delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbthoughtData => res.json(dbthoughtData))
            .catch(err => res.json(err));
    },
    // Add Reaction to thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body } }, { new: true, runValidators: true })
            .then(dbthoughtData => {
                if (!dbthoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' })
                    return;
                }
                res.json(dbthoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    // Remove Reaction from thought
    removeReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: body } }, { new: true })
            .then(dbthoughtData => {
                if (!dbthoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' })
                    return;
                }
                res.json(dbthoughtData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = thoughtController;