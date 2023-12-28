import SettingsContainer from './components/SettingsContainer'

function App(): JSX.Element {
  return (
    <main className="w-screen h-screen bg-secondary p-4 flex flex-col gap-4">
      <h1 className="font-semibold text-lg text-primary">Conversor de imagens .heic para .jpeg</h1>
      <SettingsContainer />
    </main>
  )
}

export default App
