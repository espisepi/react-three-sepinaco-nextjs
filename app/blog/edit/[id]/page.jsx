'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlogForm } from '@/components/blog/BlogForm'

export default function EditBlogPage({ params }) {
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchBlog()
    }, [params.id])

    const fetchBlog = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/blogs/${params.id}`)

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Blog post not found')
                }
                throw new Error('Failed to fetch blog post')
            }

            const blogData = await response.json()
            setBlog(blogData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (formData) => {
        try {
            setIsSubmitting(true)

            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update blog post')
            }

            const updatedBlog = await response.json()

            // Redirect to the updated blog post
            router.push(`/blog/${updatedBlog.slug}`)
        } catch (error) {
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        router.push(`/blog/${blog.slug}`)
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

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                        <p className="text-gray-600 mb-6">The blog post you're trying to edit doesn't exist.</p>
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BlogForm
                    blog={blog}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isEditing={true}
                />
            </div>
        </div>
    )
}
