import { NextResponse } from 'next/server'

// In-memory storage for demo purposes
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

// GET /api/blogs/[id] - Get a specific blog by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    const blog = blogs.find(b => b.id === parseInt(id))

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[id] - Update a specific blog
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, excerpt, author, published, tags, featuredImage } = body

    const blogIndex = blogs.findIndex(b => b.id === parseInt(id))
    
    if (blogIndex === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Update blog
    const updatedBlog = {
      ...blogs[blogIndex],
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt && { excerpt }),
      ...(author && { author }),
      ...(published !== undefined && { published }),
      ...(tags && { tags }),
      ...(featuredImage && { featuredImage }),
      updatedAt: new Date().toISOString()
    }

    // Update slug if title changed
    if (title && title !== blogs[blogIndex].title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
      
      // Check if slug already exists
      const existingSlug = blogs.find(blog => blog.slug === slug && blog.id !== parseInt(id))
      updatedBlog.slug = existingSlug ? `${slug}-${id}` : slug
    }

    blogs[blogIndex] = updatedBlog

    return NextResponse.json(updatedBlog)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[id] - Delete a specific blog
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const blogIndex = blogs.findIndex(b => b.id === parseInt(id))

    if (blogIndex === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    blogs.splice(blogIndex, 1)

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
