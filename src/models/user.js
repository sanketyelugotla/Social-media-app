const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * User model for database operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, password, full_name],
  );

  return result.rows[0];
};

/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} User object or null
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// TODO: Implement findUsersByName function for search functionality
// This should support partial name matching and pagination
/**
 * Find users by name (partial matching)
 * @param {string} searchTerm - Search term for username or full name
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of users
 */
const findUsersByName = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT id, username, full_name, created_at
     FROM users
     WHERE (username ILIKE $1 OR full_name ILIKE $1) AND is_deleted = FALSE
     ORDER BY username
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset],
  )
  return result.rows
}

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

// TODO: Implement getUserProfile function that includes follower/following counts
/**
 * Get user profile with follow counts
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User profile with counts
 */
const getUserProfile = async (userId) => {
  const userResult = await query(`SELECT id, username, email, full_name, created_at FROM users WHERE id = $1`, [userId])

  if (userResult.rows.length === 0) {
    return null
  }

  const user = userResult.rows[0]
  const counts = await getFollowCounts(userId)

  return {
    ...user,
    ...counts,
  }
}

// TODO: Implement updateUserProfile function for profile updates


module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile
};
