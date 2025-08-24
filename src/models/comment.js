const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 * TODO: Implement this model for the comment functionality
 */

// TODO: Implement createComment function
/**
 * Create a new comment
 * @param {Object} commentData - Comment data
 * @returns {Promise<Object>} Created comment
 */
const createComment = async ({ user_id, post_id, content }) => {
	const result = await query(
		`INSERT INTO comments (user_id, post_id, content, created_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING id, user_id, post_id, content, created_at`,
		[user_id, post_id, content],
	)
	return result.rows[0]
}

/**
 * Get comment count for a post
 * @param {number} postId - Post ID
 * @returns {Promise<number>} Number of comments
 */
const getPostCommentCount = async (postId) => {
	const result = await query(
		`SELECT COUNT(*) as count 
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1 AND c.is_deleted = FALSE AND u.is_deleted = FALSE`,
		[postId],
	)
	return Number.parseInt(result.rows[0].count)
}

// TODO: Implement updateComment 
/**
 * Update a comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {string} content - New content
 * @returns {Promise<Object|null>} Updated comment or null
 */
const updateComment = async (commentId, userId, content) => {
	const result = await query(
		`UPDATE comments 
     SET content = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3 AND is_deleted = FALSE
     RETURNING id, user_id, post_id, content, created_at, updated_at`,
		[content, commentId, userId],
	)
	return result.rows[0] || null
}

// TODO: Implement deleteComment function
/**
 * Delete a comment (soft delete)
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deleteComment = async (commentId, userId) => {
	const result = await query(
		`UPDATE comments 
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE`,
		[commentId, userId],
	)
	return result.rowCount > 0
}

// TODO: Implement getPostComments function
/**
 * Get comments for a post
 * @param {number} postId - Post ID
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of comments
 */
const getPostComments = async (postId, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT c.id, c.user_id, c.post_id, c.content, c.created_at, c.updated_at,
            u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1 AND c.is_deleted = FALSE AND u.is_deleted = FALSE
     ORDER BY c.created_at ASC
     LIMIT $2 OFFSET $3`,
		[postId, limit, offset],
	)
	return result.rows
}

// TODO: Implement getCommentById function
/**
 * Get comment by ID
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object|null>} Comment or null
 */
const getCommentById = async (commentId) => {
	const result = await query(
		`SELECT c.id, c.user_id, c.post_id, c.content, c.created_at, c.updated_at,
            u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1 AND c.is_deleted = FALSE AND u.is_deleted = FALSE`,
		[commentId],
	)
	return result.rows[0] || null
}

module.exports = {
	// Functions will be implemented here
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
	getPostCommentCount,
};
