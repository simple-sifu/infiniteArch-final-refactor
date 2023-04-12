import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { BooksRepository } from '../Books/BooksRepository'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
class AuthorsRepository {
  baseUrl

  @inject(Types.IDataGateway)
  dataGateway

  @inject(BooksRepository)
  booksRepository

  @inject(UserModel)
  userModel

  @inject(Config)
  config

  authorsPm = null

  showAuthors = true

  constructor() {
    makeObservable(this, {
      authorsPm: observable,
      showAuthors: observable
    })
  }

  load = async () => {
    const dto = await this.dataGateway.get(`/authors?emailOwnerId=${this.userModel.email}`)
    if (dto?.success) {
      // 1. fetch all bookIds from all the authors
      let bookIds = []
      dto.result.forEach((author) => {
        bookIds = bookIds.concat(author.bookIds)
      })
      // 2. fetch bookNames from bookIds and get back bookNames keyed by BookIs
      const booksObj = await this.booksRepository.getAll(bookIds)
      // 3. create authors obj with author name and all corresponding bookNames
      const authors = []
      dto.result.forEach((author) => {
        const bookNamesByAuthor = author.bookIds.map((bookId) => {
          return booksObj[bookId]
        })

        authors.push({
          name: author.name,
          bookNamesByAuthor
        })
      })
      // 4. save to Programmer's Model
      this.authorsPm = {
        success: dto.success,
        authors
      }
    }
  }

  addBookToStaging = (bookName) => {
    this.booksRepository.addBookToStaging(bookName)
  }

  //
  // 1. call bookRepository to create books from staged area bookNames[] via POST request
  //    a. https://api.logicroom.co/secure-api/tommy.han.cs@gmail.com/books
  //    b. POST body
  //       {
  //        "name": "Book 3",
  //        "emailOwnerId": "a@b.com"
  //       }
  //
  // 2. reset staged area
  //
  // 3. return newBookDto (success, bookIds[])
  //
  // 4. create author via post
  //    a. https://api.logicroom.co/secure-api/tommy.han.cs@gmail.com/authors
  //    b. POST body
  //       {
  //        "name": "my private author",
  //        "emailOwnerId": "a@b.com",
  //        "latLon":[1,2],
  //        "bookIds":[1,2]
  //
  addAuthor = async (name) => {
    // create new books
    let bookIds = await this.booksRepository.addStagedBooks()
    const requestDto = {
      name: name,
      emailOwnerId: 'a@b.com',
      latLon: [1, 2],
      bookIds
    }
    let addAuthorResponseDto = await this.dataGateway.post(`/authors`, requestDto)
    return MessagePacking.unpackServerDtoToPm(addAuthorResponseDto)
  }

  reset = () => {
    this.authorsPm = 'Reset'
  }
}
export { AuthorsRepository }
