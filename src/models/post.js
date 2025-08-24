const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, NOW(), true)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at`,
    [user_id, content, media_url, comments_enabled],
  );

  return result.rows[0];
};

/**
 * Get post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object|null>} Post object or null
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [postId],
  );

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
};

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = false WHERE id = $1 AND user_id = $2",
    [postId, userId],
  );

  return result.rowCount > 0;
};

// TODO: Implement getFeedPosts function that returns posts from followed users
// This should include pagination and ordering by creation date
/**
 * Get feed posts for a user (posts from followed users + own posts)
 * @param {number} userId - Current user ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of feed posts
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = false) as comments_count,
            (SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = $1) as is_liked_by_user
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.is_deleted = false AND u.is_deleted = false
     AND (
       p.user_id = $1 OR 
       p.user_id IN (
         SELECT following_id FROM follows WHERE follower_id = $1
       )
     )
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  )

  return result.rows
}

// TODO: Implement updatePost function for editing posts
/**
 * Update a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated post or null
 */
const updatePost = async (postId, userId, { content, media_url, comments_enabled }) => {
  const result = await query(
    `UPDATE posts 
     SET content = COALESCE($1, content),
         media_url = COALESCE($2, media_url),
         comments_enabled = COALESCE($3, comments_enabled),
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5 AND is_deleted = false
     RETURNING id, user_id, content, media_url, comments_enabled, created_at, updated_at`,
    [content, media_url, comments_enabled, postId, userId],
  )

  return result.rows[0] || null
}

// TODO: Implement searchPosts function for content search
/**
 * Search posts by content
 * @param {string} searchTerm - Search term
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of matching posts
 */
const searchPosts = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = false) as comments_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE $1 AND p.is_deleted = false AND u.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset],
  )

  return result.rows
}

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  updatePost,
  searchPosts,
};
