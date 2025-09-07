// Blog data model and utility functions

export const BlogStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

export const BlogCategory = {
  TECHNOLOGY: 'technology',
  DESIGN: 'design',
  BUSINESS: 'business',
  LIFESTYLE: 'lifestyle',
  TUTORIAL: 'tutorial'
}

/**
 * Blog post data structure
 * @typedef {Object} BlogPost
 * @property {number} id - Unique identifier
 * @property {string} title - Blog post title
 * @property {string} content - Full blog post content
 * @property {string} excerpt - Short description/excerpt
 * @property {string} author - Author name
 * @property {string} createdAt - Creation timestamp (ISO string)
 * @property {string} updatedAt - Last update timestamp (ISO string)
 * @property {boolean} published - Whether the post is published
 * @property {string[]} tags - Array of tags
 * @property {string} slug - URL-friendly slug
 * @property {string} featuredImage - Path to featured image
 * @property {string} category - Blog category
 * @property {number} views - Number of views
 * @property {number} likes - Number of likes
 */

/**
 * Create a new blog post object
 * @param {Object} data - Blog post data
 * @returns {BlogPost} New blog post object
 */
export function createBlogPost(data) {
  const now = new Date().toISOString()
  
  return {
    id: data.id || Date.now(),
    title: data.title || '',
    content: data.content || '',
    excerpt: data.excerpt || '',
    author: data.author || 'Anonymous',
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    published: data.published !== undefined ? data.published : true,
    tags: data.tags || [],
    slug: data.slug || generateSlug(data.title),
    featuredImage: data.featuredImage || '/img/1.png',
    category: data.category || BlogCategory.TECHNOLOGY,
    views: data.views || 0,
    likes: data.likes || 0
  }
}

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The title to convert to slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(title) {
  if (!title) return ''
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale = 'en-US') {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date for relative display (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative date string
 */
export function formatRelativeDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Extract reading time estimate
 * @param {string} content - Blog post content
 * @returns {string} Reading time estimate
 */
export function getReadingTime(content) {
  if (!content) return '0 min read'
  
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  
  return `${readingTime} min read`
}

/**
 * Validate blog post data
 * @param {Object} data - Blog post data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateBlogPost(data) {
  const errors = []
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required')
  }
  
  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }
  
  if (data.excerpt && data.excerpt.length > 500) {
    errors.push('Excerpt must be less than 500 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Search blogs by query
 * @param {BlogPost[]} blogs - Array of blog posts
 * @param {string} query - Search query
 * @returns {BlogPost[]} Filtered blog posts
 */
export function searchBlogs(blogs, query) {
  if (!query || query.trim().length === 0) return blogs
  
  const lowercaseQuery = query.toLowerCase()
  
  return blogs.filter(blog => 
    blog.title.toLowerCase().includes(lowercaseQuery) ||
    blog.content.toLowerCase().includes(lowercaseQuery) ||
    blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
    blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    blog.author.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Filter blogs by category
 * @param {BlogPost[]} blogs - Array of blog posts
 * @param {string} category - Category to filter by
 * @returns {BlogPost[]} Filtered blog posts
 */
export function filterBlogsByCategory(blogs, category) {
  if (!category) return blogs
  return blogs.filter(blog => blog.category === category)
}

/**
 * Filter blogs by tag
 * @param {BlogPost[]} blogs - Array of blog posts
 * @param {string} tag - Tag to filter by
 * @returns {BlogPost[]} Filtered blog posts
 */
export function filterBlogsByTag(blogs, tag) {
  if (!tag) return blogs
  return blogs.filter(blog => 
    blog.tags.some(blogTag => 
      blogTag.toLowerCase().includes(tag.toLowerCase())
    )
  )
}

/**
 * Sort blogs by different criteria
 * @param {BlogPost[]} blogs - Array of blog posts
 * @param {string} sortBy - Sort criteria ('date', 'title', 'views', 'likes')
 * @param {string} order - Sort order ('asc', 'desc')
 * @returns {BlogPost[]} Sorted blog posts
 */
export function sortBlogs(blogs, sortBy = 'date', order = 'desc') {
  const sortedBlogs = [...blogs]
  
  sortedBlogs.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'views':
        comparison = a.views - b.views
        break
      case 'likes':
        comparison = a.likes - b.likes
        break
      default:
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
    }
    
    return order === 'desc' ? -comparison : comparison
  })
  
  return sortedBlogs
}
