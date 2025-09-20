import React, { useRef, useState, useCallback, memo } from 'react'
import { WheelConfiguration } from '@/hooks/useWheelPersistence'

interface WheelConfigManagerProps {
  config: WheelConfiguration
  onDownloadConfig: () => boolean
  onLoadConfigFromFile: (file: File) => Promise<boolean>
  onResetToDefault: () => void
  onClearStorage: () => boolean
  getConfigInfo: () => {
    hasLocalStorage: boolean
    panelCount: number
    lastUpdated: string
    version: string
  }
}

export const WheelConfigManager = memo(({
  config,
  onDownloadConfig,
  onLoadConfigFromFile,
  onResetToDefault,
  onClearStorage,
  getConfigInfo,
}: WheelConfigManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const configInfo = getConfigInfo()

  const showMessage = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }, [])

  const handleDownload = useCallback(() => {
    const success = onDownloadConfig()
    if (success) {
      showMessage('success', '✅ Configuración descargada exitosamente')
    } else {
      showMessage('error', '❌ Error al descargar la configuración')
    }
  }, [onDownloadConfig, showMessage])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      showMessage('error', '❌ Por favor selecciona un archivo JSON válido')
      return
    }

    setIsLoading(true)
    try {
      const success = await onLoadConfigFromFile(file)
      if (success) {
        showMessage('success', '✅ Configuración cargada exitosamente')
      } else {
        showMessage('error', '❌ Error al cargar la configuración. Verifica que el archivo sea válido.')
      }
    } catch (error) {
      showMessage('error', '❌ Error inesperado al cargar el archivo')
    } finally {
      setIsLoading(false)
      // Limpiar el input para permitir cargar el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [onLoadConfigFromFile, showMessage])

  const handleReset = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres restablecer la configuración a los valores por defecto? Esta acción no se puede deshacer.')) {
      onResetToDefault()
      showMessage('info', '🔄 Configuración restablecida a valores por defecto')
    }
  }, [onResetToDefault, showMessage])

  const handleClearStorage = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todos los datos guardados? Esta acción no se puede deshacer.')) {
      const success = onClearStorage()
      if (success) {
        showMessage('info', '🗑️ Datos locales limpiados exitosamente')
      } else {
        showMessage('error', '❌ Error al limpiar los datos locales')
      }
    }
  }, [onClearStorage, showMessage])

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Fecha inválida'
    }
  }, [])

  return (
    <div className='rounded-2xl bg-white/10 p-6 backdrop-blur-sm'>
      <h3 className='mb-4 text-xl font-bold text-white'>💾 Gestión de Configuraciones</h3>

      {/* Mensaje de estado */}
      {message && (
        <div className={`mb-4 rounded-lg border p-3 text-sm font-medium ${message.type === 'success' ? 'border-green-400/30 bg-green-500/20 text-green-300' :
          message.type === 'error' ? 'border-red-400/30 bg-red-500/20 text-red-300' :
            'border-blue-400/30 bg-blue-500/20 text-blue-300'
          }`}>
          {message.text}
        </div>
      )}

      {/* Información de la configuración actual */}
      <div className='mb-6 rounded-lg bg-white/5 p-4'>
        <h4 className='mb-3 text-lg font-semibold text-white'>📊 Información Actual</h4>
        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-300'>Paneles:</span>
            <span className='font-semibold text-white'>{configInfo.panelCount}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-300'>Versión:</span>
            <span className='font-semibold text-white'>{configInfo.version}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-300'>Duración:</span>
            <span className='font-semibold text-white'>{config.spinDuration}s</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-300'>Controles:</span>
            <span className={`font-semibold ${config.enableOrbitControls ? 'text-green-400' : 'text-gray-400'}`}>
              {config.enableOrbitControls ? 'Activados' : 'Desactivados'}
            </span>
          </div>
          <div className='col-span-2'>
            <div className='flex justify-between'>
              <span className='text-gray-300'>Última actualización:</span>
              <span className='font-semibold text-white'>{formatDate(configInfo.lastUpdated)}</span>
            </div>
          </div>
          <div className='col-span-2'>
            <div className='flex justify-between'>
              <span className='text-gray-300'>Guardado local:</span>
              <span className={`font-semibold ${configInfo.hasLocalStorage ? 'text-green-400' : 'text-gray-400'}`}>
                {configInfo.hasLocalStorage ? '✅ Sí' : '❌ No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className='space-y-3'>
        {/* Descargar configuración */}
        <button
          onClick={handleDownload}
          className='w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700'
        >
          📥 Descargar Configuración JSON
        </button>

        {/* Cargar configuración */}
        <div>
          <input
            ref={fileInputRef}
            type='file'
            accept='.json'
            onChange={handleFileSelect}
            className='hidden'
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`w-full rounded-lg px-4 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 ${isLoading
              ? 'cursor-not-allowed bg-gray-500'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 hover:from-green-600 hover:to-green-700'
              }`}
          >
            {isLoading ? '⏳ Cargando...' : '📤 Cargar Configuración JSON'}
          </button>
        </div>

        {/* Resetear configuración */}
        <button
          onClick={handleReset}
          className='w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-orange-700'
        >
          🔄 Restablecer a Valores por Defecto
        </button>

        {/* Limpiar almacenamiento local */}
        <button
          onClick={handleClearStorage}
          className='w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700'
        >
          🗑️ Limpiar Datos Locales
        </button>
      </div>

      {/* Información adicional */}
      <div className='mt-6 rounded-lg bg-white/5 p-4'>
        <h4 className='mb-2 text-sm font-semibold text-white'>ℹ️ Información</h4>
        <ul className='space-y-1 text-xs text-gray-300'>
          <li>• La configuración se guarda automáticamente en localStorage</li>
          <li>• Los archivos JSON incluyen todos los atributos modificables</li>
          <li>• Puedes compartir configuraciones exportando/importando archivos</li>
          <li>• El reset elimina todas las personalizaciones</li>
          <li>• Limpiar datos locales elimina la configuración guardada</li>
        </ul>
      </div>
    </div>
  )
})

WheelConfigManager.displayName = 'WheelConfigManager'
