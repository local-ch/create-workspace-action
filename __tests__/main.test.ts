import {createNamespace} from '../src/create_namespace'

import axios from 'axios'
jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let namespaceName: string
const guild = 'nodejs'
const url = 'https://k8s-workspaces.test/api/v1/namespaces/'

beforeEach(() => {
  mockedAxios.post.mockResolvedValue({
    data: {
      state: 'success',
      self_destruct: '2021-03-08',
      name: namespaceName
    }
  })
})

describe('Happy Path', () => {
  namespaceName = 'jest-test-namespace-name'

  test('happy path', async () => {
    const workspaceName = await createNamespace(namespaceName, guild, url)
    expect(workspaceName).toEqual(namespaceName)
  })
})

describe('When namespace name is too long', () => {
  namespaceName =
    'test-app-pro-1234-this-is-a-brutally-long-namespace-name-which-exeeds-all-limitations'

  it('reduces the size of namespace name to suit limitations', async () => {
    await createNamespace(namespaceName, guild, url)
    expect(mockedAxios.post).toHaveBeenCalledWith(url, {
      name: namespaceName.substr(0, 42),
      guild
    })
  })
})
