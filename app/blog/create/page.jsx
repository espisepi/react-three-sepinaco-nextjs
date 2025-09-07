'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlogForm } from '@/components/blog/BlogForm'
import { createBlogPost } from '@/lib/blog'

export default function CreateBlogPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (formData) => {
        try {
            setIsSubmitting(true)

            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create blog post')
            }

            const newBlog = await response.json()

            // Redirect to the new blog post
            router.push(`/blog/${newBlog.slug}`)
        } catch (error) {
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        router.push('/blog')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BlogForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isEditing={false}
                />
            </div>
        </div>
    )
}
