import axios from 'axios'

export async function createNamespace(
  name: string,
  guild: string
): Promise<string> {
  const {data} = await axios.post(
    'https://k8s-workspaces.local-stg.cloud/api/v1/namespaces',
    {
      // when branch name is too long, API throws an error.
      name: name.substr(0, 42),
      guild
    }
  )
  return data.name
}
