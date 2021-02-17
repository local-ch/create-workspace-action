import axios from 'axios'

export async function createNamespace(
  name: string,
  guild: string,
  url: string
): Promise<string> {
  const {status, data} = await axios.post(url, {
    // when branch name is too long, API throws an error.
    name: name.substr(0, 42),
    guild
  })

  if (status < 200 || status >= 300) {
    throw new Error(`Received non-ok status message from webservice: ${status}`)
  }
  return data.name
}
