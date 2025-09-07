'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, getReadingTime } from '@/lib/blog'

export function BlogPost({ blog }) {
    if (!blog) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            {blog.featuredImage && (
                <div className="relative h-64 md:h-96">
                    <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="p-6 md:p-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                            {blog.category}
                        </span>
                        <span>{blog.author}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(blog.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{getReadingTime(blog.content)}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {blog.excerpt}
                        </p>
                    )}
                </header>

                {/* Content */}
                <div className="prose max-w-none text-gray-800 leading-relaxed">
                    <div className="whitespace-pre-wrap">
                        {blog.content}
                    </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Like ({blog.likes || 0})
                        </button>

                        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export function RelatedPosts({ currentBlog, relatedBlogs }) {
    if (!relatedBlogs || relatedBlogs.length === 0) return null

    return (
        <section className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs
                    .filter(blog => blog.id !== currentBlog.id)
                    .slice(0, 3)
                    .map((blog) => (
                        <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src={blog.featuredImage}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {blog.title}
                                    </Link>
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {formatDate(blog.createdAt)} • {getReadingTime(blog.content)}
                                </p>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                    {blog.excerpt || blog.content.substring(0, 100) + '...'}
                                </p>
                            </div>
                        </article>
                    ))}
            </div>
        </section>
    )
}

export function BlogNavigation({ previousBlog, nextBlog }) {
    return (
        <nav className="max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previousBlog && (
                    <Link
                        href={`/blog/${previousBlog.slug}`}
                        className="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Previous Post</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {previousBlog.title}
                        </h3>
                    </Link>
                )}

                {nextBlog && (
                    <Link
                        href={`/blog/${nextBlog.slug}`}
                        className="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow md:text-right"
                    >
                        <div className="flex items-center justify-end mb-2">
                            <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Next Post</span>
                            <svg className="w-4 h-4 ml-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {nextBlog.title}
                        </h3>
                    </Link>
                )}
            </div>
        </nav>
    )
}
