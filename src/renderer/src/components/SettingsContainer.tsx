import { Download, FolderInput, FolderOutput } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
// import { Separator } from './ui/separator'
import { useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
// import DataConversionContainer from './DataConversionContainer'

const { ipcRenderer } = window.electron

export default function SettingsContainer(): JSX.Element {
  const [outputDir, setOutputDir] = useState<string>('')
  const [inputDir, setInputDir] = useState<string>('')
  const [conversionStatus, setConversionStatus] = useState<boolean>(false)
  const getPath = (type: 'output' | 'input'): void => {
    ipcRenderer.send('get-path', type)

    ipcRenderer.once('newTest', (_, path) => {
      type === 'output' ? setOutputDir(path) : setInputDir(path)
    })
  }

  const start = (): void => {
    setConversionStatus(true)
    try {
      ipcRenderer.send('start-conversion')

      ipcRenderer.once('conversion-finished', (_, success) => {
        if (success) {
          setConversionStatus(false)
        } else {
          setConversionStatus(true)
        }
      })
    } catch (err) {
      setConversionStatus(false)
    }
  }
  return (
    // <ResizablePanel defaultSize={50} minSize={30}>
    <ScrollArea className="w-full h-full p-3">
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-col gap-2">
          <Label>Selecione a pasta das imagens</Label>
          <Input placeholder="Pasta" readOnly value={outputDir} />
          <Button
            className="flex gap-3 border border-primary text-primary"
            variant={'secondary'}
            onClick={() => getPath('output')}
          >
            Selecionar Pasta <FolderOutput />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Selecione a pasta onde as imagens geradas serão depositadas</Label>
          <Input placeholder="Pasta" readOnly value={inputDir} />
          <Button
            className="flex gap-3 border border-primary text-primary"
            variant={'secondary'}
            onClick={() => getPath('input')}
          >
            Selecionar Pasta <FolderInput />
          </Button>
        </div>

        <Button className="flex gap-3" onClick={start} disabled={conversionStatus}>
          Iniciar conversão <Download />
        </Button>

        {/* <Separator className="bg-slate-500" />

        <DataConversionContainer /> */}
      </div>
    </ScrollArea>
    // </ResizablePanel>
  )
}
