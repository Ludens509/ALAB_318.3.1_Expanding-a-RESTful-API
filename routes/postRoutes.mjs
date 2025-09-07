import express from 'express';
import posts from '../data/posts.mjs';
import users from '../data/users.mjs';
import comments from '../data/comments.mjs';

const router = express.Router();


//post an item Route
//@route POST /api/posts
//@desc Make a posts
//@access Public
router.post('/', (req, res) => {
    const { userId, title, content } = req.body;
    if (userId && title && content) {
        if (posts.find((post) => { post.title == title })) {
            res.json({ msg: `🩻 Error - Post title already exist` });
            return;
        }

        const post = {
            id: posts[posts.length - 1].id + 1,
            userId: userId,
            title: title,
            content: content
        }
        posts.push(post);
        res.json(post);
    } else return res.status(400).json({ msg: ' Please include a title and a content' })


})

//@route GET /api/posts:id
//@desc Get one posts
//@access Public
router.route('/:id').get((req, res) => {
    const post = posts.find((post) => post.id == req.params.id);
    if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post);
    // optional
    /*if(post) res.json(posts)
        else next();
     */
})
    .patch((req, res, next) => {
        const data = req.body;
        const post = posts.find((post, i) => {

            if (post.id == req.params.id) {
                for (const item in data) {
                    posts[i][item] = data[item];
                }
                return true;
            }

        });
        if (post) {
            res.json(post);
        } else next();

    })
    .delete((req, res, next) => {
        const post = posts.find((post, i) => {
            if (post.id == req.params.id) {
                posts.splice(i, 1);
                return true;
            }

        })
        if (post) {
            res.json(posts);
            res.json({ msg: "Post Deleted" });
        } else next();
    });

//Show One posts Route

//Get all posts Route
//@route GET /api/posts or /api/posts?userId=<VALUE>
//@desc Get all posts or posts by userId
//@access Public
router.get('/', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const user = users.find((user) => user.id == userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userPosts = posts.filter((post) => post.userId == userId);
        if (userPosts.length === 0) {
            return res.status(404).json({ msg: 'No posts found for this user' });
        }
        return res.json(userPosts);
    }
    res.json(posts);
})



//@route GET /api/posts or /api/posts?userId=<VALUE>
//@desc Get all posts or posts by userId
//@access Public
router.get('/', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const user = users.find((user) => user.id == userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userPosts = posts.filter((post) => post.userId == userId);
        if (userPosts.length === 0) {
            return res.status(404).json({ msg: 'No posts found for this user' });
        }
        return res.json(userPosts);
    }
    res.json(posts);
})


//@route GET /api/posts/:id/comments
//@desc Retrieves all comments made on the post with the specified id.
//@access public
router.get('/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
    }

    const postComments = comments.filter((comment) => comment.postId === postId);
    if (postComments.length === 0) {
        return res.status(404).json({ msg: 'No comments found for this post' });
    }

    res.json(postComments);
});

// @route   /posts/:id/comments?userId=<VALUE>
// @desc    Retrieves all comments made on the post with the specified id by a user with the specified userId.Get all comments by a user with optional postId filter
// @access  Public

router.get('/:id/comments', (req, res) => {
    const postId = req.params.id;
    const userId = req.query.userId ? parseInt(req.query.userId) : null;

    //check if post exist
    const post = posts.find((post) => post.id == postId);
    if (!post) { return res.status(404).json({ msg: "post not found" }) }

    // filter comment by postId
    let postComments = comments.filter((comment)=> comment.postId == postId);

    if(userId !== null){
        const user = users.find((user) => user.id === userId);
        if (!user) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        postComments = postComments.filter((comment) => comment.userId === userId);
    }

    if (postComments.length === 0) {
        return res.status(404).json({ 
            msg: userId ? 'No comments found for this upost by the specified user' : 'No comments found for this post'
        });
    }
    
});
export default router;