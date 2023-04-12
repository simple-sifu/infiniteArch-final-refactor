import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
class BooksRepository {
  baseUrl

  @inject(Types.IDataGateway)
  dataGateway

  @inject(UserModel)
  userModel

  @inject(Config)
  config

  booksPm = null
  stagedBookNames = []

  constructor() {
    makeObservable(this, {
      booksPm: observable,
      stagedBookNames: observable
    })
  }

  load = async () => {
    const booksDto = await this.dataGateway.get(`/books?emailOwnerId=${this.userModel.email}`)
    if (booksDto?.success) {
      this.booksPm = {
        success: booksDto.success,
        books: booksDto.result.map((book) => {
          return book
        })
      }
    }
    return this.booksPm
  }

  get = async (bookId) => {
    const path = `/book?emailOwnerId=${this.userModel.email}&bookId=${bookId}`
    const bookDto = await this.dataGateway.get(path)
    if (bookDto?.success) {
      return {
        success: bookDto.success,
        name: bookDto.result[0].name
      }
    }
  }

  // fetch bookNames from bookIds concurrently using Promise.all
  getAll = async (bookIds) => {
    const booksObj = {}
    await Promise.all(
      bookIds.map(async (bookId) => {
        const bookDto = await this.get(bookId)
        booksObj[bookId] = bookDto.name
      })
    )
    return booksObj
  }

  addBook = async (name) => {
    const requestDto = {
      name: name,
      emailOwnerId: 'a@b.com'
    }
    let responseDto = await this.dataGateway.post(`/books`, requestDto)
    const responseMsg = MessagePacking.unpackServerDtoToPm(responseDto)
    responseMsg.bookId = responseDto.result.bookId
    return responseMsg
  }

  addStagedBooks = async () => {
    const bookIds = []
    for (let bookName of this.stagedBookNames) {
      const addBookDto = await this.addBook(bookName)
      if (addBookDto.success) {
        bookIds.push(addBookDto.bookId)
      }
    }

    // clear out staging area
    // changes to booksPm will trigger viewModel in BookListPresenter
    this.stagedBookNames = []
    this.booksPm = {
      success: true,
      books: []
    }

    return bookIds
  }

  addBookToStaging = (bookName) => {
    this.stagedBookNames.push(bookName)
    const books = this.stagedBookNames.map((stagedBookName) => {
      return { name: stagedBookName }
    })

    // changes to booksPm will trigger viewModel in BookListPresenter
    this.booksPm = {
      success: true,
      books
    }
  }

  reset = () => {
    this.booksPm = null
  }
}

export { BooksRepository }
