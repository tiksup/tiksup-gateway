import { readdirSync } from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'

const routesLoader = (app) => {
  const dirsPath = join(process.cwd(), 'routes')

  readdirSync(dirsPath).forEach(async (file) => {
    if (file !== 'routeLoader.js' && file.endsWith('.js')) {
      const pathName = file.replace('.js', '')
      const filePath = join(dirsPath, file)

      // Convertir la ruta absoluta a URL file://
      const fileURL = pathToFileURL(filePath).href

      const path = await import(fileURL) // Usar la URL file:// aquí

      app.use(`/${pathName.toLowerCase()}`, path.default)
    }
  })
}

export default routesLoader
