'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatRelativeDate, getReadingTime, truncateText } from '@/lib/blog'

export function BlogCard({ blog, featured = false }) {
  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg ${featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}>
      <div className="relative h-48 md:h-64">
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{blog.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(blog.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>{getReadingTime(blog.content)}</span>
        </div>

        <h2 className={`font-bold text-gray-900 mb-3 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}>
          <Link
            href={`/blog/${blog.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {blog.title}
          </Link>
        </h2>

        <p className={`text-gray-600 mb-4 ${featured ? 'text-lg' : 'text-base'
          }`}>
          {truncateText(blog.excerpt || blog.content, featured ? 200 : 120)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
          {blog.tags.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{blog.tags.length - 3} more
            </span>
          )}
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read More
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

export function BlogGrid({ blogs, featuredBlog }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredBlog && (
        <BlogCard blog={featuredBlog} featured={true} />
      )}
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export function BlogList({ blogs }) {
  return (
    <div className="space-y-6">
      {blogs.map((blog) => (
        <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-48 md:h-full">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{blog.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(blog.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{getReadingTime(blog.content)}</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {blog.title}
                </Link>
              </h2>

              <p className="text-gray-600 mb-4">
                {truncateText(blog.excerpt || blog.content, 200)}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${blog.slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Read More
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export function BlogSearch({ onSearch, onFilterChange, filters }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const categories = ['technology', 'design', 'business', 'lifestyle', 'tutorial']
  const popularTags = ['react', 'three.js', 'tutorial', 'webgl', 'javascript', 'next.js']

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilterChange({ category, tag: selectedTag })
  }

  const handleTagChange = (tag) => {
    setSelectedTag(tag)
    onFilterChange({ category: selectedCategory, tag })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTagChange('')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
