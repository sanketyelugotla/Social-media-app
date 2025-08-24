const validateFollowUser = (req, res, next) => {
    const { user_id } = req.params

    if (!user_id || isNaN(Number.parseInt(user_id))) {
        return res.status(400).json({ error: "Valid user ID is required" })
    }

    next()
}

const validateSearchUsers = (req, res, next) => {
    const { q } = req.query

    if (!q || typeof q !== "string" || q.trim().length < 2) {
        return res.status(400).json({ error: "Search query must be at least 2 characters" })
    }

    next()
}

const validateLikePost = (req, res, next) => {
    const { post_id } = req.body

    if (!post_id || isNaN(Number.parseInt(post_id))) {
        return res.status(400).json({ error: "Valid post ID is required" })
    }

    next()
}

const validatePostId = (req, res, next) => {
    const { post_id } = req.params

    if (!post_id || isNaN(Number.parseInt(post_id))) {
        return res.status(400).json({ error: "Valid post ID is required" })
    }

    next()
}

const validateCreateComment = (req, res, next) => {
    const { post_id, content } = req.body

    if (!post_id || isNaN(Number.parseInt(post_id))) {
        return res.status(400).json({ error: "Valid post ID is required" })
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Comment content is required" })
    }

    if (content.trim().length > 1000) {
        return res.status(400).json({ error: "Comment content must be less than 1000 characters" })
    }

    req.validatedData = {
        post_id: Number.parseInt(post_id),
        content: content.trim(),
    }

    next()
}

const validateUpdateComment = (req, res, next) => {
    const { content } = req.body

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Comment content is required" })
    }

    if (content.trim().length > 1000) {
        return res.status(400).json({ error: "Comment content must be less than 1000 characters" })
    }

    req.validatedData = {
        content: content.trim(),
    }

    next()
}

const validateCommentId = (req, res, next) => {
    const { comment_id } = req.params

    if (!comment_id || isNaN(Number.parseInt(comment_id))) {
        return res.status(400).json({ error: "Valid comment ID is required" })
    }

    next()
}

module.exports = {
    validateFollowUser,
    validateSearchUsers,
    validateLikePost,
    validatePostId,
    validateCreateComment,
    validateUpdateComment,
    validateCommentId,
}
