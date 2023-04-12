import { injectable, inject } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { AuthorsRepository } from './AuthorsRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
class AuthorsPresenter extends MessagesPresenter {
  @inject(AuthorsRepository)
  authorsRepository

  newAuthorName = null

  newBookName = null

  load = async () => {
    await this.authorsRepository.load()
  }

  get viewModel() {
    const authorsPm = this.authorsRepository.authorsPm
    if (authorsPm?.success && this.showAuthorsList) {
      return authorsPm.authors.map((author) => {
        return { visibleAuthor: `(${author.name}) | (${author.bookNamesByAuthor.join(',')})` }
      })
    } else {
      return []
    }
  }

  get showAuthorsList() {
    return this.authorsRepository.showAuthors
  }

  constructor() {
    super()
    makeObservable(this, {
      viewModel: computed,
      showAuthorsList: computed
    })
  }

  toggleShowAuthors = () => {
    this.authorsRepository.showAuthors = !this.authorsRepository.showAuthors
  }

  addBook = () => {
    this.authorsRepository.addBookToStaging(this.newBookName)
  }

  addAuthor = async () => {
    const authorPm = await this.authorsRepository.addAuthor(this.newAuthorName)
    await this.load()

    if (this.authorsRepository.authorsPm.authors.length > 4 && this.authorsRepository.showAuthors === true) {
      this.authorsRepository.showAuthors = false
    }
    this.unpackRepositoryPmToVm(authorPm, 'Author successfully added')
  }

  reset = () => {
    this.newAuthorName = ''
  }
}
export { AuthorsPresenter }
