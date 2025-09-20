'use client'

import Image from 'next/image'
import { WheelPanel } from '@/types/wheel'

interface WheelResultProps {
  result: WheelPanel
  raycastResult?: WheelPanel | null
}

export function WheelResult({ result, raycastResult }: WheelResultProps) {
  // Usar el resultado del raycasting si está disponible, sino usar el resultado matemático
  const displayResult = raycastResult || result

  return (
    <div className='animate-pulse rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
      <h3 className='mb-4 text-xl font-bold text-white'>🎉 ¡Resultado!</h3>

      <div className='text-center'>
        <div className='mb-4'>
          {displayResult.texture ? (
            <div style={{ position: "relative" }} className='mx-auto mb-3 size-16 overflow-hidden rounded-full border-4 border-white/30'>
              <Image
                src={displayResult.texture}
                alt={displayResult.text}
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='mx-auto mb-3 size-16 rounded-full border-4 border-white/30' style={{ backgroundColor: displayResult.color }} />
          )}
          <h4 className='text-2xl font-bold text-white'>{displayResult.text}</h4>
        </div>

        <div className='rounded-lg bg-white/5 p-4'>
          <p className='text-sm text-gray-300'>
            ¡Felicidades! Has ganado: <span className='font-semibold text-white'>{displayResult.text}</span>
          </p>
        </div>

        {/* <div className='mt-4 text-xs text-gray-400'>
          Panel ID: {displayResult.id}
        </div> */}

        {/* Indicador del método de detección */}
        {/* <div className='mt-3 text-xs text-gray-400'>
          Método: {raycastResult ? '🎯 Raycasting 3D' : '📐 Cálculo Matemático'}
        </div> */}
      </div>
    </div>
  )
}
