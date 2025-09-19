'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { WheelControls, WheelResult } from '@/features/wheel-of-fortune/components'
import { WheelPanel } from '@/types/wheel'

const WheelScene = dynamic(() => import('@/features/wheel-of-fortune/components/canvas/WheelScene').then((mod) => mod.WheelScene), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function WheelOfFortunePage() {
  const [panels, setPanels] = useState<WheelPanel[]>([
    { id: '1', text: 'Premio 1', color: '#FF6B6B' },
    { id: '2', text: 'Premio 2', color: '#4ECDC4' },
    { id: '3', text: 'Premio 3', color: '#45B7D1' },
    { id: '4', text: 'Premio 4', color: '#96CEB4' },
    { id: '5', text: 'Premio 5', color: '#FFEAA7' },
    { id: '6', text: 'Premio 6', color: '#DDA0DD' },
  ])
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<WheelPanel | null>(null)
  const [spinDuration, setSpinDuration] = useState(3) // Duración en segundos
  const [currentPanel, setCurrentPanel] = useState<WheelPanel | null>(null) // Panel actual que apunta el puntero

  const handleSpin = () => {
    if (isSpinning || panels.length === 0) return
    setIsSpinning(true)
    setResult(null)
  }

  const handleSpinComplete = (selectedPanel: WheelPanel) => {
    setIsSpinning(false)
    setResult(selectedPanel)
  }

  const handleCurrentPanelChange = (panel: WheelPanel | null) => {
    setCurrentPanel(panel)
  }

  const addPanel = () => {
    const newId = (panels.length + 1).toString()
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3']
    const newPanel: WheelPanel = {
      id: newId,
      text: `Premio ${newId}`,
      color: colors[panels.length % colors.length]
    }
    setPanels([...panels, newPanel])
  }

  const removePanel = (id: string) => {
    if (panels.length <= 1) return
    setPanels(panels.filter(panel => panel.id !== id))
  }

  const updatePanel = (id: string, text: string) => {
    setPanels(panels.map(panel =>
      panel.id === id ? { ...panel, text } : panel
    ))
  }

  const updatePanelColor = (id: string, color: string) => {
    setPanels(panels.map(panel =>
      panel.id === id ? { ...panel, color } : panel
    ))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-5xl font-bold text-white mb-4'>🎰 Ruleta de la Suerte</h1>
          <p className='text-xl text-gray-300'>Gira la ruleta y descubre tu premio</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 3D Wheel */}
          <div className='lg:col-span-2'>
            <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
              <View className='flex h-96 w-full flex-col items-center justify-center'>
                <Suspense fallback={null}>
                  <WheelScene
                    panels={panels}
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    spinDuration={spinDuration}
                    onCurrentPanelChange={handleCurrentPanelChange}
                  />
                  <Common color={'#1a1a2e'} />
                </Suspense>
              </View>
            </div>
          </div>

          {/* Controls */}
          <div className='space-y-6'>
            <WheelControls
              panels={panels}
              isSpinning={isSpinning}
              onSpin={handleSpin}
              onAddPanel={addPanel}
              onRemovePanel={removePanel}
              onUpdatePanel={updatePanel}
              onUpdatePanelColor={updatePanelColor}
              spinDuration={spinDuration}
              onSpinDurationChange={setSpinDuration}
            />

            {/* Panel actual que apunta el puntero */}
            {currentPanel && (
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>🎯 Panel Actual</h3>
                <div className='text-center'>
                  <div
                    className='inline-block px-4 py-2 rounded-lg text-white font-semibold'
                    style={{ backgroundColor: currentPanel.color }}
                  >
                    {currentPanel.text}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <WheelResult result={result} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
