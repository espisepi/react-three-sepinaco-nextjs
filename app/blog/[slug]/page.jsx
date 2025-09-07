'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlogPost, RelatedPosts, BlogNavigation } from '@/components/blog/BlogPost'
import { filterBlogsByCategory, filterBlogsByTag } from '@/lib/blog'

export default function BlogPostPage({ params }) {
    const [blog, setBlog] = useState(null)
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [previousBlog, setPreviousBlog] = useState(null)
    const [nextBlog, setNextBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        fetchBlogPost()
    }, [params.slug])

    const fetchBlogPost = async () => {
        try {
            setLoading(true)

            // Fetch the specific blog post
            const response = await fetch(`/api/blogs/slug/${params.slug}`)

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Blog post not found')
                }
                throw new Error('Failed to fetch blog post')
            }

            const blogData = await response.json()
            setBlog(blogData)

            // Fetch all blogs for related posts and navigation
            const allBlogsResponse = await fetch('/api/blogs?published=true')
            if (allBlogsResponse.ok) {
                const allBlogsData = await allBlogsResponse.json()
                const allBlogs = allBlogsData.blogs || []

                // Find related blogs (same category or tags)
                const related = allBlogs.filter(b =>
                    b.id !== blogData.id &&
                    (b.category === blogData.category ||
                        b.tags.some(tag => blogData.tags.includes(tag)))
                )
                setRelatedBlogs(related.slice(0, 6))

                // Find previous and next blogs
                const sortedBlogs = allBlogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                const currentIndex = sortedBlogs.findIndex(b => b.id === blogData.id)

                if (currentIndex > 0) {
                    setPreviousBlog(sortedBlogs[currentIndex - 1])
                }
                if (currentIndex < sortedBlogs.length - 1) {
                    setNextBlog(sortedBlogs[currentIndex + 1])
                }
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!blog) return

        if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`/api/blogs/${blog.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete blog post')
            }

            router.push('/blog')
        } catch (error) {
            alert('Error deleting blog post: ' + error.message)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading blog post...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/blog')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Blog
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Admin Actions */}
                <div className="mb-6 flex justify-end space-x-4">
                    <button
                        onClick={() => router.push(`/blog/edit/${blog.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Edit Post
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                        Delete Post
                    </button>
                </div>

                {/* Blog Post */}
                <BlogPost blog={blog} />

                {/* Related Posts */}
                <RelatedPosts currentBlog={blog} relatedBlogs={relatedBlogs} />

                {/* Navigation */}
                <BlogNavigation previousBlog={previousBlog} nextBlog={nextBlog} />
            </div>
        </div>
    )
}
