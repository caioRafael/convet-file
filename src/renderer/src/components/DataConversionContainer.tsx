import { useEffect, useState } from 'react'

const { ipcRenderer } = window.electron

interface IFilesCount {
  detectedFiles: number
  convertedFiles: number
  errorConversion: number
}

export default function DataConversionContainer(): JSX.Element {
  const [filesCount, setFilesCount] = useState<IFilesCount>()
  useEffect(() => {
    setInterval(() => {
      ipcRenderer.send('count-files')

      ipcRenderer.once('return-count', (_, count) => {
        setFilesCount(count)
      })

      return () => {
        ipcRenderer.removeAllListeners('count-files')
      }
    }, 1000)
  }, [])
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-primary">Imagens econtrados:</h1>
          <h1 className="font-bold text-2xl">{filesCount?.detectedFiles || 0}</h1>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-green-500">Images convertidos:</h1>
          <h1 className="font-bold text-2xl">{filesCount?.convertedFiles || 0}</h1>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-red-500">Erros de conversão:</h1>
          <h1 className="font-bold text-2xl">{filesCount?.errorConversion || 0}</h1>
        </div>
      </div>
    </>
  )
}
