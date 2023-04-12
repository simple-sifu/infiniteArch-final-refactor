import { Container } from 'inversify'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { RouterRepository } from './Routing/RouterRepository'
import { UserModel } from './Authentication/UserModel'
import { NavigationRepository } from './Navigation/NavigationRepository'
import { BooksRepository } from './Books/BooksRepository'
import { BooksPresenter } from './Books/BooksPresenter'
import { AddBooksComponent } from './Books/AddBooks/AddBooksComponent'
import { AuthorsRepository } from './Authors/AuthorsRepository'
import { AuthorsPresenter } from './Authors/AuthorsPresenter'

export class BaseIOC {
  container

  constructor() {
    this.container = new Container({
      autoBindInjectable: true,
      defaultScope: 'Transient'
    })
  }

  buildBaseTemplate = () => {
    this.container.bind(MessagesRepository).to(MessagesRepository).inSingletonScope()
    this.container.bind(RouterRepository).to(RouterRepository).inSingletonScope()
    this.container.bind(NavigationRepository).to(NavigationRepository).inSingletonScope()
    this.container.bind(UserModel).to(UserModel).inSingletonScope()
    this.container.bind(BooksRepository).to(BooksRepository).inSingletonScope()
    this.container.bind(BooksPresenter).to(BooksPresenter).inSingletonScope()
    this.container.bind(AuthorsPresenter).to(AuthorsPresenter).inSingletonScope()
    this.container.bind(AddBooksComponent).to(AddBooksComponent).inSingletonScope()
    this.container.bind(AuthorsRepository).to(AuthorsRepository).inSingletonScope()

    return this.container
  }
}
