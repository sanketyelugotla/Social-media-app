const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 * TODO: Implement this model for the like functionality
 */

// TODO: Implement likePost function
/**
 * Like a post
 * @param {number} userId - ID of user liking the post
 * @param {number} postId - ID of post to like
 * @returns {Promise<Object>} Created like
 */
const likePost = async (userId, postId) => {
	const result = await query(
		`INSERT INTO likes (user_id, post_id, created_at)
     VALUES ($1, $2, NOW())
     RETURNING id, user_id, post_id, created_at`,
		[userId, postId],
	)
	return result.rows[0]
}

// TODO: Implement unlikePost function
/**
 * Unlike a post
 * @param {number} userId - ID of user unliking the post
 * @param {number} postId - ID of post to unlike
 * @returns {Promise<boolean>} Success status
 */
const unlikePost = async (userId, postId) => {
	const result = await query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`, [userId, postId])
	return result.rowCount > 0
}

// TODO: Implement getPostLikes function
/**
 * Get likes for a post with user details
 * @param {number} postId - Post ID
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of likes with user info
 */
const getPostLikes = async (postId, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT l.id, l.created_at, u.id as user_id, u.username, u.full_name
     FROM likes l
     JOIN users u ON l.user_id = u.id
     WHERE l.post_id = $1 AND u.is_deleted = FALSE
     ORDER BY l.created_at DESC
     LIMIT $2 OFFSET $3`,
		[postId, limit, offset],
	)
	return result.rows
}

/**
 * Get like count for a post
 * @param {number} postId - Post ID
 * @returns {Promise<number>} Number of likes
 */
const getPostLikeCount = async (postId) => {
	const result = await query(`SELECT COUNT(*) as count FROM likes WHERE post_id = $1`, [postId])
	return Number.parseInt(result.rows[0].count)
}

// TODO: Implement getUserLikes function
/**
 * Get posts liked by a user
 * @param {number} userId - User ID
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of liked posts
 */
const getUserLikes = async (userId, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT p.id, p.content, p.media_url, p.created_at, p.comments_enabled,
            u.id as author_id, u.username as author_username, u.full_name as author_name,
            l.created_at as liked_at,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) as comments_count
     FROM likes l
     JOIN posts p ON l.post_id = p.id
     JOIN users u ON p.user_id = u.id
     WHERE l.user_id = $1 AND p.is_deleted = FALSE AND u.is_deleted = FALSE
     ORDER BY l.created_at DESC
     LIMIT $2 OFFSET $3`,
		[userId, limit, offset],
	)
	return result.rows
}

// TODO: Implement hasUserLikedPost function
/**
 * Check if user has liked a post
 * @param {number} userId - User ID
 * @param {number} postId - Post ID
 * @returns {Promise<boolean>} Like status
 */
const hasUserLikedPost = async (userId, postId) => {
	const result = await query(`SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`, [userId, postId])
	return result.rows.length > 0
}

module.exports = {
	// Functions will be implemented here
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
	getPostLikeCount,
};
