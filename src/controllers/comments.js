// TODO: Implement comments controller
// This controller should handle:
// - Creating comments on posts
// - Editing user's own comments
// - Deleting user's own comments
// - Getting comments for a post
// - Pagination for comments

const {
	createComment,
	updateComment,
	deleteComment,
	getCommentById,
	getPostComments,
	getPostCommentCount,
} = require("../models/comment")
const { getPostById } = require("../models/post")
const logger = require("../utils/logger");

// TODO: Implement createComment function
const create = async (req, res) => {
	try {
		const { post_id, content } = req.validatedData
		const userId = req.user.id

		// Check if post exists and comments are enabled
		const post = await getPostById(post_id)
		if (!post) {
			return res.status(404).json({ error: "Post not found" })
		}

		if (!post.comments_enabled) {
			return res.status(403).json({ error: "Comments are disabled for this post" })
		}

		// Create comment
		const comment = await createComment({
			user_id: userId,
			post_id,
			content,
		})

		// Get comment with user details
		const fullComment = await getCommentById(comment.id)

		logger.verbose(`User ${userId} commented on post ${post_id}`)

		res.status(201).json({
			message: "Comment created successfully",
			comment: fullComment,
		})
	} catch (error) {
		logger.critical("Create comment error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement updateComment function
const update = async (req, res) => {
	try {
		const { comment_id } = req.params
		const { content } = req.validatedData
		const userId = req.user.id

		// Check if comment exists and belongs to user
		const existingComment = await getCommentById(Number.parseInt(comment_id))
		if (!existingComment) {
			return res.status(404).json({ error: "Comment not found" })
		}

		if (existingComment.user_id !== userId) {
			return res.status(403).json({ error: "Not authorized to update this comment" })
		}

		// Update comment
		const updatedComment = await updateComment(Number.parseInt(comment_id), userId, content)
		if (!updatedComment) {
			return res.status(404).json({ error: "Comment not found or already deleted" })
		}

		// Get updated comment with user details
		const fullComment = await getCommentById(Number.parseInt(comment_id))

		logger.verbose(`User ${userId} updated comment ${comment_id}`)

		res.json({
			message: "Comment updated successfully",
			comment: fullComment,
		})
	} catch (error) {
		logger.critical("Update comment error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement deleteComment function
const remove = async (req, res) => {
	try {
		const { comment_id } = req.params
		const userId = req.user.id

		// Check if comment exists and belongs to user
		const existingComment = await getCommentById(Number.parseInt(comment_id))
		if (!existingComment) {
			return res.status(404).json({ error: "Comment not found" })
		}

		if (existingComment.user_id !== userId) {
			return res.status(403).json({ error: "Not authorized to delete this comment" })
		}

		// Delete comment
		const success = await deleteComment(Number.parseInt(comment_id), userId)
		if (!success) {
			return res.status(404).json({ error: "Comment not found or already deleted" })
		}

		const commentCount = await getPostCommentCount(existingComment.post_id)

		logger.verbose(`User ${userId} deleted comment ${comment_id}`)

		res.json({
			message: "Comment deleted successfully",
			comments_count: commentCount,
		})
	} catch (error) {
		logger.critical("Delete comment error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement getPostComments function
const getPostCommentsController = async (req, res) => {
	try {
		const { post_id } = req.params
		const page = Number.parseInt(req.query.page) || 1
		const limit = Number.parseInt(req.query.limit) || 20
		const offset = (page - 1) * limit

		// Check if post exists
		const post = await getPostById(Number.parseInt(post_id))
		if (!post) {
			return res.status(404).json({ error: "Post not found" })
		}

		const comments = await getPostComments(Number.parseInt(post_id), limit, offset)
		const totalCount = await getPostCommentCount(Number.parseInt(post_id))

		res.json({
			comments,
			total_count: totalCount,
			comments_enabled: post.comments_enabled,
			pagination: {
				page,
				limit,
				hasMore: comments.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Get post comments error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}


module.exports = {
	// Functions will be implemented here
	create,
	update,
	remove,
	getPostCommentsController,
};
