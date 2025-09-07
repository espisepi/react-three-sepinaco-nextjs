'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

const Layout = ({ children }) => {
  const ref = useRef()
  const pathname = usePathname()

  // Don't show navigation on blog pages to avoid conflicts
  const isBlogPage = pathname?.startsWith('/blog')

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {/* Navigation */}
      {!isBlogPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Next 3D Starter
              </Link>
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/charles"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Charles
                </Link>
                <Link
                  href="/blob"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Blob
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <div className={!isBlogPage ? 'pt-16' : ''}>
        {children}
      </div>

      {/* 3D Scene - only show on non-blog pages */}
      {!isBlogPage && (
        <Scene
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
          }}
          eventSource={ref}
          eventPrefix='client'
        />
      )}
    </div>
  )
}

export { Layout }
