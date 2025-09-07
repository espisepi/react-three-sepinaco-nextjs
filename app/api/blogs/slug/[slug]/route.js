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

// GET /api/blogs/slug/[slug] - Get a specific blog by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params
    const blog = blogs.find(b => b.slug === slug)

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
