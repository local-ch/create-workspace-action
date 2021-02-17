import {createNamespace} from '../src/create_namespace'

import axios from 'axios'
jest.mock('axios')

describe('Create Namespace', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  let namespaceName = 'jest-test-namespace-name'
  const guild = 'nodejs'
  const url = 'https://k8s-workspaces.test/api/v1/namespaces/'
  let statusCode: number

  describe('Happy Path', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {
          state: 'success',
          self_destruct: '2021-03-08',
          name: namespaceName
        }
      })
    })

    test('happy path', async () => {
      const workspaceName = await createNamespace(namespaceName, guild, url)
      expect(workspaceName).toEqual(namespaceName)
    })
  })

  describe('When namespace name is too long', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {
          state: 'success',
          self_destruct: '2021-03-08',
          name: namespaceName
        }
      })
    })
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

  describe('When service returns a non-200 status code', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        status: 406,
        data: {
          state: 'error',
          message: 'Unknown HTTP code from k8s API, this is likely a bug'
        }
      })
    })

    it('throws an error', () => {
      expect.assertions(1)

      expect(createNamespace(namespaceName, guild, url)).rejects.toThrow('404')
    })
  })
})
