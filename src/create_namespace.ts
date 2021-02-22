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
  branch: string
): string {
  return `${appName}-${branch}`.substr(0, 41).replace(/[^\w]|_/, '-')
}
