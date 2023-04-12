import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { BooksRepository } from './BooksRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
class BooksPresenter extends MessagesPresenter {
  @inject(BooksRepository)
  booksRepository

  newBookName = null

  lastAddedBook = null

  load = async () => {
    await this.booksRepository.load()
  }

  get viewModel() {
    return this.booksRepository.booksPm
  }

  constructor() {
    super()
    makeObservable(this, {
      viewModel: computed,
      lastAddedBook: observable
    })
  }

  addBook = async () => {
    const bookPm = await this.booksRepository.addBook(this.newBookName)
    if (bookPm.success) {
      this.lastAddedBook = this.newBookName
      this.load()
      this.unpackRepositoryPmToVm(bookPm, 'Book added')
    }
  }

  reset = () => {
    this.newBookName = ''
  }
}
export { BooksPresenter }
