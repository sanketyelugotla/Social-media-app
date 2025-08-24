const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { validateFollowUser, validateSearchUsers } = require("../middleware/validation")
const {
    follow,
    unfollow,
    getMyFollowing,
    getMyFollowers,
    getMyStats,
    searchUsers,
    getUserProfileById,
} = require("../controllers/users")


const router = express.Router();

/**
 * User-related routes
 * TODO: Implement user routes when follow functionality is added
 */

// TODO: POST /api/users/follow - Follow a user
router.post("/:user_id/follow", authenticateToken, validateFollowUser, follow)

// TODO: DELETE /api/users/unfollow - Unfollow a user
router.delete("/:user_id/unfollow", authenticateToken, validateFollowUser, unfollow)

// TODO: GET /api/users/following - Get users that current user follows
router.get("/following", authenticateToken, getMyFollowing)

// TODO: GET /api/users/followers - Get users that follow current user
router.get("/followers", authenticateToken, getMyFollowers)

// TODO: GET /api/users/stats - Get follow stats for current user
router.get("/stats", authenticateToken, getMyStats)

// TODO: POST /api/users/search - Find users by name
router.get("/search", authenticateToken, validateSearchUsers, searchUsers)

router.get("/:user_id", authenticateToken, getUserProfileById)

module.exports = router;
