import { injectable, inject } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { BooksRepository } from '../BooksRepository'

@injectable()
class BookListPresenter {
  @inject(BooksRepository)
  booksRepository

  get viewModel() {
    const booksPm = this.booksRepository.booksPm
    if (booksPm?.success) {
      return booksPm.books.map((book) => {
        return { visibleName: book.name }
      })
    } else {
      return []
    }
  }

  constructor() {
    makeObservable(this, {
      viewModel: computed
    })
  }
}
export { BookListPresenter }
