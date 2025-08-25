const {
	likePost,
	unlikePost,
	hasUserLikedPost,
	getPostLikes,
	getUserLikes,
	getPostLikeCount,
} = require("../models/like")
const { getPostById } = require("../models/post")

// TODO: Implement likes controller
// This controller should handle:
// - Liking posts
// - Unliking posts
// - Getting likes for a post
// - Getting posts liked by a user

const logger = require("../utils/logger");

// TODO: Implement likePost function
const like = async (req, res) => {
	try {
		const { post_id } = req.params
		console.log(post_id)
		const userId = req.user.id

		// Check if post exists
		const post = await getPostById(post_id)
		if (!post) {
			return res.status(404).json({ error: "Post not found" })
		}

		// Check if user already liked the post
		const alreadyLiked = await hasUserLikedPost(userId, post_id)
		if (alreadyLiked) {
			return res.status(400).json({ error: "Post already liked" })
		}

		// Create like
		const like = await likePost(userId, post_id)
		const likeCount = await getPostLikeCount(post_id)

		logger.verbose(`User ${userId} liked post ${post_id}`)

		res.status(201).json({
			message: "Post liked successfully",
			like,
			likes_count: likeCount,
		})
	} catch (error) {
		logger.critical("Like post error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement unlikePost function
const unlike = async (req, res) => {
	try {
		const { post_id } = req.params
		const userId = req.user.id

		// Check if user has liked the post
		const hasLiked = await hasUserLikedPost(userId, Number.parseInt(post_id))
		if (!hasLiked) {
			return res.status(400).json({ error: "Post not liked by user" })
		}

		// Remove like
		const success = await unlikePost(userId, Number.parseInt(post_id))
		if (!success) {
			return res.status(404).json({ error: "Like not found" })
		}

		const likeCount = await getPostLikeCount(Number.parseInt(post_id))

		logger.verbose(`User ${userId} unliked post ${post_id}`)

		res.json({
			message: "Post unliked successfully",
			likes_count: likeCount,
		})
	} catch (error) {
		logger.critical("Unlike post error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement getPostLikes function
const getPostLikesController = async (req, res) => {
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

		const likes = await getPostLikes(Number.parseInt(post_id), limit, offset)
		const totalCount = await getPostLikeCount(Number.parseInt(post_id))

		res.json({
			likes,
			total_count: totalCount,
			pagination: {
				page,
				limit,
				hasMore: likes.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Get post likes error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement getUserLikes function
const getUserLikesController = async (req, res) => {
	try {
		const { user_id } = req.params
		const page = Number.parseInt(req.query.page) || 1
		const limit = Number.parseInt(req.query.limit) || 20
		const offset = (page - 1) * limit

		const likedPosts = await getUserLikes(Number.parseInt(user_id), limit, offset)

		res.json({
			liked_posts: likedPosts,
			pagination: {
				page,
				limit,
				hasMore: likedPosts.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Get user likes error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

/**
 * Get current user's liked posts
 */
const getMyLikes = async (req, res) => {
	try {
		const userId = req.user.id
		const page = Number.parseInt(req.query.page) || 1
		const limit = Number.parseInt(req.query.limit) || 20
		const offset = (page - 1) * limit

		const likedPosts = await getUserLikes(userId, limit, offset)

		res.json({
			liked_posts: likedPosts,
			pagination: {
				page,
				limit,
				hasMore: likedPosts.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Get my likes error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	// Functions will be implemented here
	like,
	unlike,
	getPostLikesController,
	getUserLikesController,
	getMyLikes,
};
