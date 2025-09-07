import express from 'express';
import users from '../data/users.mjs';
import posts from '../data/posts.mjs';
import comments from '../data/comments.mjs';

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

//@route GET /api/users/:id/comments
//@desc Retrieves comments made by the user with the specified id.
//@access public
router.get('/:id/comments', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((user) => user.id === userId);
    
    if (!user) {
        return res.status(404).json({ msg: 'Post not found' });
    }

    const userComments = comments.filter((comment) => comment.userId === userId);
    if (userComments.length === 0) {
        return res.status(404).json({ msg: 'No comments found for this user' });
    }
    
    res.json(userComments);
});


//@route GET /users/:id/comments?postId=<VALUE>
//@desc Retrieves comments made by the user with the specified id on the post with the specified postId.
//@access public
router.get('/:id/comments/', (req, res) => {
    const postId = req.query.postId
    const userId = parseInt(req.params.id);
    const post = posts.filter((post)=> post.postId == postId)
    const user = users.find((user) => user.id === userId);
    
    if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
    }
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const userComments = comments.filter((comment) => comment.userId == userId && comment.postId ==postId);
    if (userComments.length === 0) {
        return res.status(404).json({ msg: 'No comments found for this user' });
    }
    
    res.json(userComments);
});

// @route   GET /api/users/:id/comments
// @desc    Get all comments by a user with optional postId filter
// @access  Public
router.get('/:id/comments', (req, res) => {
    const userId = parseInt(req.params.id);
    const postId = req.query.postId ? parseInt(req.query.postId) : null;

    // Check if user exists
    const user = users.find((user) => user.id === userId);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    // Filter comments by userId
    let userComments = comments.filter((comment) => comment.userId === userId);

    // If postId is provided, further filter by postId
    if (postId !== null) {
        // Check if post exists
        const post = posts.find((post) => post.id === postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        userComments = userComments.filter((comment) => comment.postId === postId);
    }

    if (userComments.length === 0) {
        return res.status(404).json({ 
            msg: postId ? 'No comments found for this user on the specified post' : 'No comments found for this user'
        });
    }

    res.json(userComments);
});

export default router;