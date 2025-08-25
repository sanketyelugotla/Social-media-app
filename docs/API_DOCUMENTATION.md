# Toddle Social Media API Documentation

Complete REST API documentation for the social media platform backend.

## Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
\`\`\`
authorization: <your_jwt_token>
\`\`\`

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
\`\`\`json
{
"username": "sanket",
"email": "sanket@gmail.com",
"password": "password123",
"full_name": "sanket"
}
\`\`\`

**Response (201):**
\`\`\`json
{
"message": "User registered successfully",
"user": {
"id": 1,
"username": "sanket",
"email": "sanket@gmail.com",
"full_name": "sanket"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

### Login User

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
\`\`\`json
{
"username": "sanket",
"password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
"message": "Login successful",
"user": {
"id": 1,
"username": "sanket",
"email": "sanket@gmail.com",
"full_name": "sanket"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

### Get Profile

**GET** `/auth/profile` 🔒

Get current user's profile information.

**Response (200):**
\`\`\`json
{
"user": {
"id": 1,
"username": "testuser",
"email": "test@example.com",
"full_name": "Test User",
"created_at": "2024-01-15T10:30:00.000Z"
}
}
\`\`\`

---

## Users & Following Endpoints

### Search Users

**GET** `/users/search?q={query}&page={page}&limit={limit}` 🔒

Search for users by username or full name.

**Query Parameters:**

- `q` (required): Search term (min 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response (200):**
\`\`\`json
{
"users": [
{
"id": 2,
"username": "johndoe",
"full_name": "John Doe",
"created_at": "2024-01-15T10:30:00.000Z"
}
],
"pagination": {
"page": 1,
"limit": 20,
"hasMore": false
}
}
\`\`\`

### Follow User

**POST** `/users/{user_id}/follow` 🔒

Follow another user.

**Response (201):**
\`\`\`json
{
"message": "Successfully followed user",
"user": {
"id": 2,
"username": "johndoe",
"full_name": "John Doe"
}
}
\`\`\`

### Unfollow User

**DELETE** `/users/{user_id}/unfollow` 🔒

Unfollow a user.

**Response (200):**
\`\`\`json
{
"message": "Successfully unfollowed user"
}
\`\`\`

### Get Following

**GET** `/users/following?page={page}&limit={limit}` 🔒

Get list of users you're following.

**Response (200):**
\`\`\`json
{
"following": [
{
"id": 2,
"username": "johndoe",
"full_name": "John Doe",
"created_at": "2024-01-15T10:30:00.000Z",
"followed_at": "2024-01-16T14:20:00.000Z"
}
],
"pagination": {
"page": 1,
"limit": 20,
"hasMore": false
}
}
\`\`\`

### Get Followers

**GET** `/users/followers?page={page}&limit={limit}` 🔒

Get list of users following you.

**Response (200):**
\`\`\`json
{
"followers": [
{
"id": 3,
"username": "janedoe",
"full_name": "Jane Doe",
"created_at": "2024-01-15T10:30:00.000Z",
"followed_at": "2024-01-17T09:15:00.000Z"
}
],
"pagination": {
"page": 1,
"limit": 20,
"hasMore": false
}
}
\`\`\`

### Get Follow Stats

**GET** `/users/stats` 🔒

Get your follow statistics.

**Response (200):**
\`\`\`json
{
"stats": {
"following_count": 5,
"followers_count": 12
}
}
\`\`\`

### Get User Profile

**GET** `/users/{user_id}` 🔒

Get another user's profile with follow status.

**Response (200):**
\`\`\`json
{
"user": {
"id": 2,
"username": "johndoe",
"email": "john@example.com",
"full_name": "John Doe",
"created_at": "2024-01-15T10:30:00.000Z",
"following_count": 8,
"followers_count": 15,
"is_following": true
}
}
\`\`\`

---

## Posts Endpoints

### Create Post

**POST** `/posts` 🔒

Create a new post.

**Request Body:**
\`\`\`json
{
"content": "This is my new post!",
"media_url": "https://example.com/image.jpg",
"comments_enabled": true
}
\`\`\`

**Response (201):**
\`\`\`json
{
"message": "Post created successfully",
"post": {
"id": 1,
"user_id": 1,
"content": "This is my new post!",
"media_url": "https://example.com/image.jpg",
"comments_enabled": true,
"created_at": "2024-01-18T15:30:00.000Z",
"scheduled_at": "2024-01-18T15:30:00.000Z"
}
}
\`\`\`

Create a new scheduled post.

**Request Body:**
\`\`\`json
{
"content": "This is my new post!",
"media_url": "https://example.com/image.jpg",
"comments_enabled": true,
"scheduled_at": "2024-01-18T16:30:00.000Z"
}
\`\`\`

**Response (201):**
\`\`\`json
{
"message": "Post created successfully",
"post": {
"id": 1,
"user_id": 1,
"content": "This is my new post!",
"media_url": "https://example.com/image.jpg",
"comments_enabled": true,
"created_at": "2024-01-18T15:30:00.000Z"
"scheduled_at": "2024-01-18T16:30:00.000Z"
}
}
\`\`\`

### Get Feed

**GET** `/posts/feed?page={page}&limit={limit}` 🔒

Get personalized feed (posts from followed users + your posts).

**Response (200):**
\`\`\`json
{
"posts": [
{
"id": 1,
"user_id": 2,
"content": "Hello world!",
"media_url": null,
"comments_enabled": true,
"created_at": "2024-01-18T15:30:00.000Z",
"username": "johndoe",
"full_name": "John Doe",
"likes_count": 5,
"comments_count": 2,
"is_liked_by_user": false
}
],
"pagination": {
"page": 1,
"limit": 20,
"hasMore": true
}
}
\`\`\`

### Search Posts

**GET** `/posts/search?q={query}&page={page}&limit={limit}`

Search posts by content.

**Query Parameters:**

- `q` (required): Search term (min 2 characters)

**Response (200):**
\`\`\`json
{
"posts": [
{
"id": 3,
"user_id": 2,
"content": "Post containing search term",
"media_url": null,
"comments_enabled": true,
"created_at": "2024-01-18T14:00:00.000Z",
"username": "johndoe",
"full_name": "John Doe",
"likes_count": 3,
"comments_count": 1
}
],
"search_term": "search term",
"pagination": {
"page": 1,
"limit": 20,
"hasMore": false
}
}
\`\`\`

### Get My Posts

**GET** `/posts/my?page={page}&limit={limit}` 🔒

Get your own posts.


### Get Post by ID

**GET** `/posts/{post_id}`

Get a single post by ID.

### Update Post

**PUT** `/posts/{post_id}` 🔒

Update your own post.

**Request Body:**
\`\`\`json
{
"content": "Updated post content",
"comments_enabled": false
}
\`\`\`

### Delete Post

**DELETE** `/posts/{post_id}` 🔒

Delete your own post.

### Get User Posts

**GET** `/posts/user/{user_id}?page={page}&limit={limit}`

Get posts by a specific user.

---

## Likes Endpoints

### Like Post

**POST** `/likes/{post_id}` 🔒

Like a post.

**Response (201):**
\`\`\`json
{
"message": "Post liked successfully",
"like": {
"id": 1,
"user_id": 1,
"post_id": 1,
"created_at": "2024-01-18T16:00:00.000Z"
},
"likes_count": 6
}
\`\`\`

### Unlike Post

**DELETE** `/likes/{post_id}` 🔒

Remove like from a post.

**Response (200):**
\`\`\`json
{
"message": "Post unliked successfully",
"likes_count": 5
}
\`\`\`

### Get Post Likes

**GET** `/likes/post/{post_id}?page={page}&limit={limit}` 🔒

Get users who liked a post.

**Response (200):**
\`\`\`json
{
"likes": [
{
"id": 1,
"created_at": "2024-01-18T16:00:00.000Z",
"user_id": 2,
"username": "johndoe",
"full_name": "John Doe"
}
],
"total_count": 5,
"pagination": {
"page": 1,
"limit": 20,
"hasMore": false
}
}
\`\`\`

### Get Posts Liked by User

**GET** `/likes/user/{user_id}?page={page}&limit={limit}` 🔒

Get posts liked by a user.

---

## Comments Endpoints

### Create Comment

**POST** `/comments/{post_id}` 🔒

Create a comment on a post.

**Request Body:**
\`\`\`json
{
"content": "Great post!"
}
\`\`\`

**Response (201):**
\`\`\`json
{
"message": "Comment created successfully",
"comment": {
"id": 1,
"user_id": 1,
"post_id": 1,
"content": "Great post!",
"created_at": "2024-01-18T16:30:00.000Z",
"username": "testuser",
"full_name": "Test User"
},
"comments_count": 3
}
\`\`\`

### Update Comment

**PUT** `/comments/{comment_id}` 🔒

Update your own comment.

**Request Body:**
\`\`\`json
{
"content": "Updated comment content"
}
\`\`\`

### Delete Comment

**DELETE** `/comments/{comment_id}` 🔒

Delete your own comment.

**Response (200):**
\`\`\`json
{
"message": "Comment deleted successfully",
"comments_count": 2
}
\`\`\`

### Get Post Comments

**GET** `/comments/post/{post_id}?page={page}&limit={limit}` 🔒

Get comments for a post.

**Response (200):**
\`\`\`json
{
"comments": [
{
"id": 1,
"user_id": 2,
"post_id": 1,
"content": "Great post!",
"created_at": "2024-01-18T16:30:00.000Z",
"updated_at": "2024-01-18T16:30:00.000Z",
"username": "johndoe",
"full_name": "John Doe"
}
],
"total_count": 3,
"comments_enabled": true,
"pagination": {
"page": 1,
"limit": 20,
"hasMore": false
}
}
\`\`\`

### Get User Comments

**GET** `/comments/user/{user_id}?page={page}&limit={limit}` 🔒

Get comments by a user.

### Get My Comments

**GET** `/comments/my-comments?page={page}&limit={limit}` 🔒

Get your own comments.

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request

\`\`\`json
{
"error": "Validation failed",
"details": ["Username is required", "Password must be at least 6 characters"]
}
\`\`\`

### 401 Unauthorized

\`\`\`json
{
"error": "Access denied. No token provided."
}
\`\`\`

### 403 Forbidden

\`\`\`json
{
"error": "Not authorized to perform this action"
}
\`\`\`

### 404 Not Found

\`\`\`json
{
"error": "Resource not found"
}
\`\`\`

### 500 Internal Server Error

\`\`\`json
{
"error": "Internal server error"
}
\`\`\`

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **100 requests per 15 minutes** per IP address
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

---

## Pagination

Most list endpoints support pagination:

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
\`\`\`json
{
"data": [...],
"pagination": {
"page": 1,
"limit": 20,
"hasMore": true
}
}
\`\`\`

---

## Testing

1. **Import Postman Collection**: Import `docs/api-collection.json` into Postman
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:3000`
   - `token`: Your JWT token after login
3. **Test Workflow**:
   1. Register a new user
   2. Login and copy the token
   3. Set the token in Postman environment
   4. Test other endpoints

🔒 = Requires Authentication
