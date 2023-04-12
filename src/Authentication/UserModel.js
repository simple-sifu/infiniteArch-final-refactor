import { injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'

@injectable()
class UserModel {
  email = null

  token = null

  constructor() {
    makeObservable(this, {
      email: observable,
      token: observable
    })
  }
}
export { UserModel }
