import { NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, you would use a database like MongoDB, PostgreSQL, etc.
let blogs = [
  {
    id: 1,
    title: 'Welcome to Our Blog',
    content: 'This is the first blog post in our new blog system. We\'re excited to share our thoughts and experiences with you.',
    excerpt: 'Welcome to our new blog system!',
    author: 'Admin',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    published: true,
    tags: ['welcome', 'announcement'],
    slug: 'welcome-to-our-blog',
    featuredImage: '/img/1.png'
  },
  {
    id: 2,
    title: 'Getting Started with React Three Fiber',
    content: 'React Three Fiber is a powerful library that makes it easy to create 3D experiences in React. In this post, we\'ll explore the basics and show you how to get started.',
    excerpt: 'Learn the fundamentals of React Three Fiber for creating amazing 3D web experiences.',
    author: 'Developer',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
    published: true,
    tags: ['react', 'three.js', 'tutorial'],
    slug: 'getting-started-with-react-three-fiber',
    featuredImage: '/img/2.png'
  }
]

let nextId = 3

// GET /api/blogs - Get all blogs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const published = searchParams.get('published')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    let filteredBlogs = [...blogs]

    // Filter by published status
    if (published !== null) {
      filteredBlogs = filteredBlogs.filter(blog => blog.published === (published === 'true'))
    }

    // Filter by tag
    if (tag) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.tags.some(blogTag => blogTag.toLowerCase().includes(tag.toLowerCase()))
      )
    }

    // Search functionality
    if (search) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort by creation date (newest first)
    filteredBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

    return NextResponse.json({
      blogs: paginatedBlogs,
      pagination: {
        page,
        limit,
        total: filteredBlogs.length,
        totalPages: Math.ceil(filteredBlogs.length / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, excerpt, author, published = true, tags = [], featuredImage } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    // Check if slug already exists
    const existingSlug = blogs.find(blog => blog.slug === slug)
    const finalSlug = existingSlug ? `${slug}-${nextId}` : slug

    const newBlog = {
      id: nextId++,
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      author: author || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published,
      tags,
      slug: finalSlug,
      featuredImage: featuredImage || '/img/1.png'
    }

    blogs.push(newBlog)

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
