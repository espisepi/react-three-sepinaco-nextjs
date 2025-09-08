'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef, ReactNode } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

interface CommonProps {
  color?: string
}

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  orbit?: boolean
}

export const Common = ({ color }: CommonProps) => (
  <Suspense fallback={null}>
    {/* @ts-ignore - Three.js JSX elements */}
    {color && <color attach='background' args={[color]} />}
    {/* @ts-ignore - Three.js JSX elements */}
    <ambientLight />
    {/* @ts-ignore - Three.js JSX elements */}
    <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
    {/* @ts-ignore - Three.js JSX elements */}
    <pointLight position={[-10, -10, -10]} color='blue' decay={0.2} />
    <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
  </Suspense>
)

const View = forwardRef<HTMLDivElement, ViewProps>(({ children, orbit, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => localRef.current!)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef as React.MutableRefObject<HTMLElement>}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
