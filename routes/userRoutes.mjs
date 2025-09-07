import express from 'express';
import users from '../data/users.mjs';
import posts from '../data/posts.mjs';

const router = express.Router();

//Get all users Route
//@route GET /api/users
//@desc Get all users
//@access Public
router
    .route('/')
    .get((req, res) => {
        res.json(users);
    })
    .post((req, res) => {
        const { name, email, username } = req.body;

        if (name && email && username) {
            //check users if exists
            if (users.find((user) => ( user.username == username ))) {
                res.json({ err: "User already exists" });
                return;
            }

            const user = {
                id: users[users.length - 1].id + 1,//find the lat users id and add 1
                name,
                username,
                email,
            }
            users.push(user);
            res.json(user);

        } else return res.status(400).json({ msg: 'Please include a name, email and body' });
    });

//@route GET /api/users:id
//@desc Get one users
//@access Public
router.route('/:id').get((req, res) => {
    const user = users.find((user) => user.id == req.params.id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' })
    }
    res.json(user);
})
    .patch((req, res, next) => {
        const data = req.body;
        const user = users.find((user, i) => {
            if (user.id == req.params.id) {
                for (const key in data) {
                    users[i][key] = data[key];
                }
                return true;
            }
        });
        if (user) {
            res.json(user);
        } else next();
    })
    
    .delete((req, res, next) => {
        const user = users.find((user, i) => {
            if (user.id = req.params.id) {
                users.splice(i, 1);
                return true;
            }
        })
        if (user) {
            res.json(users);
        } else next();
    })


//@route GET /api/users/:id/posts
//@desc Retrieves all posts by a user with the specified id.
//@access public
router.get('/:id/posts', (req, res, next) => {
    const userId = req.params.id;
    const user = users.find((user) => user.id == userId);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const userPosts = posts.filter((post) => post.userId == userId);
    if (userPosts.length === 0) {
        return res.status(404).json({ msg: 'No posts found for this user' });
    }
    res.json(userPosts);
});


export default router;