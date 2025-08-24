const { query } = require("../utils/database");

/**
 * Follow model for managing user relationships
 * TODO: Implement this model for the follow functionality
 */

// TODO: Implement followUser function
/**
 * Follow a user
 * @param {number} followerId - ID of user who wants to follow
 * @param {number} followingId - ID of user to be followed
 * @returns {Promise<Object>} Follow relationship
 */
const followUser = async (followerId, followingId) => {
	const result = await query(
		`INSERT INTO follows (follower_id, following_id, created_at)
     VALUES ($1, $2, NOW())
     RETURNING id, follower_id, following_id, created_at`,
		[followerId, followingId],
	)
	return result.rows[0]
}

// TODO: Implement unfollowUser function
/**
 * Unfollow a user
 * @param {number} followerId - ID of user who wants to unfollow
 * @param {number} followingId - ID of user to be unfollowed
 * @returns {Promise<boolean>} Success status
 */
const unfollowUser = async (followerId, followingId) => {
	const result = await query(`DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`, [
		followerId,
		followingId,
	])
	return result.rowCount > 0
}

// TODO: Implement getFollowing function
/**
 * Get users that a user is following
 * @param {number} userId - User ID
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of users
 */
const getFollowing = async (userId, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT u.id, u.username, u.full_name, u.created_at, f.created_at as followed_at
     FROM users u
     JOIN follows f ON u.id = f.following_id
     WHERE f.follower_id = $1 AND u.is_deleted = FALSE
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
		[userId, limit, offset],
	)
	return result.rows
}

// TODO: Implement getFollowers function
/**
 * Get users that follow a user
 * @param {number} userId - User ID
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of users
 */
const getFollowers = async (userId, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT u.id, u.username, u.full_name, u.created_at, f.created_at as followed_at
     FROM users u
     JOIN follows f ON u.id = f.follower_id
     WHERE f.following_id = $1 AND u.is_deleted = FALSE
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
		[userId, limit, offset],
	)
	return result.rows
}

// TODO: Implement getFollowCounts function
/**
 * Get follow counts for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Follow counts
 */
const getFollowCounts = async (userId) => {
	const result = await query(
		`SELECT 
       (SELECT COUNT(*) FROM follows WHERE follower_id = $1) as following_count,
       (SELECT COUNT(*) FROM follows WHERE following_id = $1) as followers_count`,
		[userId],
	)
	return result.rows[0]
}

/**
 * Check if user is following another user
 * @param {number} followerId - ID of potential follower
 * @param {number} followingId - ID of potential following
 * @returns {Promise<boolean>} Following status
 */
const isFollowing = async (followerId, followingId) => {
	const result = await query(`SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2`, [
		followerId,
		followingId,
	])
	return result.rows.length > 0
}

module.exports = {
	// Functions will be implemented here
	followUser,
	unfollowUser,
	getFollowing,
	getFollowers,
	getFollowCounts,
	isFollowing
};
