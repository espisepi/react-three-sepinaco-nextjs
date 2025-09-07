# Blog System Documentation

This project now includes a complete blog system similar to WordPress functionality, with both backend API routes and frontend components.

## Features

### Backend API Routes
- **GET /api/blogs** - Get all blog posts with pagination, filtering, and search
- **POST /api/blogs** - Create a new blog post
- **GET /api/blogs/[id]** - Get a specific blog post by ID
- **PUT /api/blogs/[id]** - Update a specific blog post
- **DELETE /api/blogs/[id]** - Delete a specific blog post
- **GET /api/blogs/slug/[slug]** - Get a specific blog post by slug

### Frontend Pages
- **/blog** - Main blog listing page with search, filters, and sorting
- **/blog/create** - Create new blog post form
- **/blog/edit/[id]** - Edit existing blog post form
- **/blog/[slug]** - Individual blog post view

### Components
- **BlogComponents.jsx** - Blog cards, grid, list, and search components
- **BlogForm.jsx** - Form for creating and editing blog posts
- **BlogPost.jsx** - Individual blog post display with related posts and navigation

### Data Models
- **blog.js** - Utility functions for blog data manipulation, validation, and formatting

## Blog Post Structure

Each blog post contains:
- `id` - Unique identifier
- `title` - Blog post title
- `content` - Full blog post content
- `excerpt` - Short description/excerpt
- `author` - Author name
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `published` - Whether the post is published
- `tags` - Array of tags
- `slug` - URL-friendly slug
- `featuredImage` - Path to featured image
- `category` - Blog category (technology, design, business, lifestyle, tutorial)
- `views` - Number of views
- `likes` - Number of likes

## Usage

### Creating a Blog Post
1. Navigate to `/blog/create`
2. Fill in the form with title, content, author, etc.
3. Choose whether to publish immediately
4. Submit the form

### Viewing Blog Posts
1. Navigate to `/blog` to see all published posts
2. Use search and filters to find specific posts
3. Click on any post to view the full content

### Editing Blog Posts
1. Navigate to `/blog/[slug]` for the post you want to edit
2. Click the "Edit Post" button
3. Make your changes and submit

### Managing Blog Posts
- Search by title, content, or tags
- Filter by category or tags
- Sort by date, title, views, or likes
- Switch between grid and list view

## Styling

The blog system uses Tailwind CSS with custom styles defined in `global.css`:
- Prose styles for blog content formatting
- Line clamp utilities for text truncation
- Hover effects for blog cards
- Loading animations
- Custom scrollbars

## Navigation

The main layout includes navigation to the blog system. The 3D scene is disabled on blog pages to avoid conflicts.

## Data Storage

Currently using in-memory storage for demo purposes. In production, you would replace this with a proper database like MongoDB, PostgreSQL, or any other database system.

## Future Enhancements

- User authentication and authorization
- Comments system
- Image upload functionality
- Rich text editor (WYSIWYG)
- SEO optimization
- RSS feeds
- Email notifications
- Analytics and statistics
