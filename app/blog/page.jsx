'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogGrid, BlogList, BlogSearch } from '@/components/blog/BlogComponents'
import { searchBlogs, filterBlogsByCategory, filterBlogsByTag, sortBlogs } from '@/lib/blog'

export default function BlogPage() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({ category: '', tag: '' })
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/blogs?published=true')
            if (!response.ok) {
                throw new Error('Failed to fetch blogs')
            }
            const data = await response.json()
            setBlogs(data.blogs || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
    }

    // Apply filters and sorting
    let filteredBlogs = blogs

    if (searchQuery) {
        filteredBlogs = searchBlogs(filteredBlogs, searchQuery)
    }

    if (filters.category) {
        filteredBlogs = filterBlogsByCategory(filteredBlogs, filters.category)
    }

    if (filters.tag) {
        filteredBlogs = filterBlogsByTag(filteredBlogs, filters.tag)
    }

    filteredBlogs = sortBlogs(filteredBlogs, sortBy, sortOrder)

    // Get featured blog (first published blog)
    const featuredBlog = filteredBlogs.find(blog => blog.published)
    const otherBlogs = filteredBlogs.filter(blog => blog.id !== featuredBlog?.id)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading blogs...</p>
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
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blogs</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={fetchBlogs}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover insights, tutorials, and stories about technology, design, and innovation.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <BlogSearch
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    filters={filters}
                />

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <span className="text-sm text-gray-600">
                            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'} found
                        </span>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-')
                                    setSortBy(newSortBy)
                                    setSortOrder(newSortOrder)
                                }}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="title-asc">Title A-Z</option>
                                <option value="title-desc">Title Z-A</option>
                                <option value="views-desc">Most Views</option>
                                <option value="likes-desc">Most Likes</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">View:</span>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Blog Content */}
                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Blog Posts Found</h2>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || filters.category || filters.tag
                                ? 'Try adjusting your search criteria or filters.'
                                : 'No blog posts have been published yet.'}
                        </p>
                        <Link
                            href="/blog/create"
                            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create First Post
                        </Link>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <BlogGrid blogs={otherBlogs} featuredBlog={featuredBlog} />
                        ) : (
                            <BlogList blogs={filteredBlogs} />
                        )}
                    </>
                )}

                {/* Create Post Button */}
                <div className="mt-12 text-center">
                    <Link
                        href="/blog/create"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Write New Post
                    </Link>
                </div>
            </div>
        </div>
    )
}
