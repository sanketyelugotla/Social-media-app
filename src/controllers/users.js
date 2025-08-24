const {
	followUser,
	unfollowUser,
	isFollowing,
	getFollowing,
	getFollowers,
	getFollowCounts,
	findUsersByName,
	getUserProfile,
	getUserById,
} = require("../models/user")

// TODO: Implement users controller
// This controller should handle:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

const logger = require("../utils/logger");

// TODO: Implement follow function
const follow = async (req, res) => {
	try {
		const { user_id } = req.params
		const followerId = req.user.id
		const followingId = Number.parseInt(user_id)

		// Check if trying to follow self
		if (followerId === followingId) {
			return res.status(400).json({ error: "Cannot follow yourself" })
		}

		// Check if user exists
		const userToFollow = await getUserById(followingId)
		if (!userToFollow) {
			return res.status(404).json({ error: "User not found" })
		}

		// Check if already following
		const alreadyFollowing = await isFollowing(followerId, followingId)
		if (alreadyFollowing) {
			return res.status(400).json({ error: "Already following this user" })
		}

		// Create follow relationship
		await followUser(followerId, followingId)

		logger.verbose(`User ${followerId} followed user ${followingId}`)

		res.status(201).json({
			message: "Successfully followed user",
			user: userToFollow,
		})
	} catch (error) {
		logger.critical("Follow user error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement unfollow function
const unfollow = async (req, res) => {
	try {
		const { user_id } = req.params
		const followerId = req.user.id
		const followingId = Number.parseInt(user_id)

		// Check if trying to unfollow self
		if (followerId === followingId) {
			return res.status(400).json({ error: "Cannot unfollow yourself" })
		}

		// Check if currently following
		const currentlyFollowing = await isFollowing(followerId, followingId)
		if (!currentlyFollowing) {
			return res.status(400).json({ error: "Not following this user" })
		}

		// Remove follow relationship
		const success = await unfollowUser(followerId, followingId)
		if (!success) {
			return res.status(404).json({ error: "Follow relationship not found" })
		}

		logger.verbose(`User ${followerId} unfollowed user ${followingId}`)

		res.json({ message: "Successfully unfollowed user" })
	} catch (error) {
		logger.critical("Unfollow user error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement getMyFollowing function
const getMyFollowing = async (req, res) => {
	try {
		const userId = req.user.id
		const page = Number.parseInt(req.query.page) || 1
		const limit = Number.parseInt(req.query.limit) || 20
		const offset = (page - 1) * limit

		const following = await getFollowing(userId, limit, offset)

		res.json({
			following,
			pagination: {
				page,
				limit,
				hasMore: following.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Get following error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// TODO: Implement getMyFollowers function
const getMyFollowers = async (req, res) => {
	try {
		const userId = req.user.id
		const page = Number.parseInt(req.query.page) || 1
		const limit = Number.parseInt(req.query.limit) || 20
		const offset = (page - 1) * limit

		const followers = await getFollowers(userId, limit, offset)

		res.json({
			followers,
			pagination: {
				page,
				limit,
				hasMore: followers.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Get followers error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// User stats for following and followers count
const getMyStats = async (req, res) => {
	try {
		const userId = req.user.id
		const stats = await getFollowCounts(userId)

		res.json({
			stats: {
				following_count: Number.parseInt(stats.following_count),
				followers_count: Number.parseInt(stats.followers_count),
			},
		})
	} catch (error) {
		logger.critical("Get stats error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// Function for searching users includes partial name searching
const searchUsers = async (req, res) => {
	try {
		const { q: searchTerm } = req.query
		const page = Number.parseInt(req.query.page) || 1
		const limit = Number.parseInt(req.query.limit) || 20
		const offset = (page - 1) * limit

		if (!searchTerm || searchTerm.trim().length < 2) {
			return res.status(400).json({ error: "Search term must be at least 2 characters" })
		}

		const users = await findUsersByName(searchTerm.trim(), limit, offset)

		res.json({
			users,
			pagination: {
				page,
				limit,
				hasMore: users.length === limit,
			},
		})
	} catch (error) {
		logger.critical("Search users error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// Function for getting user profile by user id
const getUserProfileById = async (req, res) => {
	try {
		const { user_id } = req.params
		const currentUserId = req.user.id

		const profile = await getUserProfile(Number.parseInt(user_id))
		if (!profile) {
			return res.status(404).json({ error: "User not found" })
		}

		// Check if current user is following this user
		const isFollowingUser = await isFollowing(currentUserId, Number.parseInt(user_id))

		res.json({
			user: {
				...profile,
				is_following: isFollowingUser,
			},
		})
	} catch (error) {
		logger.critical("Get user profile error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	// Functions will be implemented here
	follow,
	unfollow,
	getMyFollowing,
	getMyFollowers,
	getMyStats,
	searchUsers,
	getUserProfileById,
};
