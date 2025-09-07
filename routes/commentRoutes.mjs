import express from 'express';
import posts from '../data/posts.mjs';
import users from '../data/users.mjs';
import comments from '../data/comments.mjs';

const router = express.Router();



router.route('/').get((req, res) => {
    res.json(comments);
    // res.json({ msg: "work fine" });
})
    .post((req, res, next) => {
        const { userId, postId, body } = req.body;

        if (userId && postId && body) {
            // Check if both post and user exist
            const postExists = posts.find((post) => post.id == postId);
            const userExists = users.find((user) => user.id == userId);

            if (!postExists) {
                return res.status(404).json({ error: "Post not found" });
            }
            if (!userExists) {
                return res.status(404).json({ error: "User not found" });
            }

            const newComment = {
                id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
                userId: userId,
                postId: postId,
                body: body
            }
            comments.push(newComment);
            res.json(newComment);

        } else return res.status(404).json({ error: "Please include a userId, postId " })


    })

router.route('/:id').get((req, res) => {
    const commentId = req.params.id;

    const comment = comments.find((comment) => comment.id == commentId);
    if (!comment) {
        res.status(400).json({ error: "comment Not found" })
    }

    res.json(comment);
})
    .patch((req, res) => {
        const commentId = req.params.id;
        const data = req.body;
        const comment = comments.find((comment, i) => {
            if (comment.id == commentId) {
                for (const key in data) {
                    comments[i][key] = data[key];
                }
                return true;
            }
        });
        if (comment) {
             res.json(comment);
        }else return res.status(400).json({ error: "comment Not found" })
       

    })

    .delete((req, res,next) => {
        const commentId = req.params.id;
        const comment = comments.find((comment,i)=>{
            if(comment.id == commentId){
                comments.splice(i,1);
                return true;
            }
        } )
        if (comment){
            res.json(comment);
        }else return next();
    })

    //@route GET  /api/comments?userId=<VALUE>
//@desc Retrieves comments by the user with the specified userId
//@access Public
router
.route('/')
.get((req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const comment = comments.find((comment) => comment.userId == userId);
        if (!comment) {
            return res.status(404).json({ msg: 'User Id not found' });
        }
       
        return res.json(comment);
    }
})
.get((req, res) => {
    const postId = req.query.postId;
    if (postId) {
        const filteredComment = comments.filter((comment) => comment.postId == postId);
        if (!filteredComment) {
            return res.status(404).json({ msg: 'Post Id not found' });
        }
       
        return res.json(filteredComment);
    }
})




export default router;