const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const {
    validateCreateComment,
    validateUpdateComment,
    validateCommentId,
    validatePostId,
} = require("../middleware/validation")
const {
    create,
    update,
    remove,
    getPostCommentsController,
    getUserCommentsController,
    getMyComments,
    
} = require("../controllers/comments")

const router = express.Router();

/**
 * Comments routes
 * TODO: Implement comment routes when comment functionality is added
 */

// TODO: POST /api/comments - Create a comment on a post
router.post("/:post_id", authenticateToken, validateCreateComment, create)

// TODO: PUT /api/comments/:comment_id - Update a comment
router.put("/:comment_id", authenticateToken, validateCommentId, validateUpdateComment, update)

// TODO: DELETE /api/comments/:comment_id - Delete a comment
router.delete("/:comment_id", authenticateToken, validateCommentId, remove)

// TODO: GET /api/comments/post/:post_id - Get comments for a post
router.get("/post/:post_id", authenticateToken, validatePostId, getPostCommentsController)

// Get comments by a user
router.get("/user/:user_id", authenticateToken, getUserCommentsController)

// Get current user's comments
router.get("/my-comments", authenticateToken, getMyComments)

module.exports = router;
