# Social Media Backend

A complete social media platform backend built with Node.js, Express, and PostgreSQL.

## Features

- ✅ User authentication (JWT)
- ✅ User profiles and following system
- ✅ Post creation, editing, and deletion
- ✅ Content feed from followed users
- ✅ Like and unlike posts
- ✅ Comment system with CRUD operations
- ✅ User search functionality
- ✅ Trending posts
- ✅ Content search
- ✅ Comprehensive API documentation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest
- **Development**: Nodemon

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env

   ## Edit .env with your database credentials and JWT secret

   \`\`\`

4. Set up the database:
   \`\`\`bash

   ## Create database and run schema

   npm run setup-db
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Start in production mode:

   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`

## Available npm Scripts

- `npm start` - Start the application in production mode
- `npm run dev` - Start the application in development mode with nodemon
- `npm run start:verbose` - Start with verbose logging
- `npm run start:critical` - Start with critical-only logging
- `npm run setup:db` - Set up database tables

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users

- `GET /api/users/search` - Search users by name
- `POST /api/users/:user_id/follow` - Follow a user
- `DELETE /api/users/:user_id/unfollow` - Unfollow a user
- `GET /api/users/following` - Get users you're following
- `GET /api/users/followers` - Get your followers
- `GET /api/users/stats` - Get follow statistics
- `GET /api/users/:user_id` - Get user profile

### Posts

- `POST /api/posts` - Create a new post
- `GET /api/posts/feed` - Get personalized feed
- `GET /api/posts/search` - Search posts
- `GET /api/posts/my` - Get your posts
- `GET /api/posts/:post_id` - Get single post
- `PUT /api/posts/:post_id` - Update post
- `DELETE /api/posts/:post_id` - Delete post
- `GET /api/posts/user/:user_id` - Get user's posts

### Likes

- `POST /api/likes/:post_id` - Like a post
- `DELETE /api/likes/:post_id` - Unlike a post
- `GET /api/likes/post/:post_id` - Get post likes
- `GET /api/likes/user/:user_id` - Get user's liked posts
- `GET /api/likes/my-likes` - Get your liked posts

### Comments

- `POST /api/comments/"post_id` - Create a comment
- `PUT /api/comments/:comment_id` - Update comment
- `DELETE /api/comments/:comment_id` - Delete comment
- `GET /api/comments/post/:post_id` - Get post comments
- `GET /api/comments/user/:user_id` - Get user's comments
- `GET /api/comments/my-comments` - Get your comments

## Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run tests with coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

## Deployment

The application is ready for deployment on platforms like:

- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS/GCP/Azure

Make sure to:

1. Set production environment variables
2. Use a production PostgreSQL database
3. Set `NODE_ENV=production`
4. Use a strong JWT secret

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request
