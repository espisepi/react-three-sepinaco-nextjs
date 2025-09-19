'use client'

import { WheelPanel } from '@/types/wheel'

interface WheelResultProps {
    result: WheelPanel
}

export function WheelResult({ result }: WheelResultProps) {
    return (
        <div className='animate-pulse rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='text-xl font-bold text-white mb-4'>🎉 ¡Resultado!</h3>

            <div className='text-center'>
                <div className='mb-4'>
                    <div className='mx-auto mb-3 size-16 rounded-full border-4 border-white/30' style={{ backgroundColor: result.color }} />
                    <h4 className='text-2xl font-bold text-white'>{result.text}</h4>
                </div>

                <div className='bg-white/5 rounded-lg p-4'>
                    <p className='text-sm text-gray-300'>
                        ¡Felicidades! Has ganado: <span className='font-semibold text-white'>{result.text}</span>
                    </p>
                </div>

                <div className='mt-4 text-xs text-gray-400'>
                    Panel ID: {result.id}
                </div>
            </div>
        </div>
    )
}
