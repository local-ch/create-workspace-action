import axios from 'axios'

export async function createNamespace(
  name: string,
  guild: string,
  url: string
): Promise<string> {
  const {data} = await axios.post(url, {
    // when branch name is too long, API throws an error.
    name: name.substr(0, 42),
    guild
  })
  return data.name
}
