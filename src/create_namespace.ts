import axios from 'axios'

export async function createNamespace(
  name: string,
  guild: string,
  url: string
): Promise<string> {
  const {status, data} = await axios.post(url, {name, guild})

  if (status < 200 || status >= 300) {
    throw new Error(`Received non-ok status message from webservice: ${status}`)
  }
  return data.name
}

export function calculateNamespaceIdentifier(
  appName: string,
  branch: string,
  revision: string
): string {
  const appIdentifier = `${appName}-${branch}`.substr(0, 34)
  return `${appIdentifier}-${revision.substr(0, 7)}`
}
