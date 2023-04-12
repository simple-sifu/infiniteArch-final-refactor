import { injectable, inject } from 'inversify'
import { Config } from './Config'
import { UserModel } from '../Authentication/UserModel'

@injectable()
class HttpGateway {
  @inject(Config)
  config

  @inject(UserModel)
  userModel

  get = async (path) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}: ${response.statusText}, for fetch request: GET ${response.url}`
      throw new Error(message)
    }
    const dto = response.json()
    return dto
  }

  post = async (path, requestDto) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'POST',
      body: JSON.stringify(requestDto),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}: ${response.statusText}, for fetch request: POST ${response.url}`
      throw new Error(message)
    }
    const dto = response.json()
    return dto
  }

  delete = async (path) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}: ${response.statusText}, for fetch request: DELETE ${response.url}`
      throw new Error(message)
    }
    const dto = response.json()
    return dto
  }
}
export { HttpGateway }
