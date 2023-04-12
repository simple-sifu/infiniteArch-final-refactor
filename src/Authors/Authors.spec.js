import { Types } from '../Core/Types'
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub'
import { GetSuccessfulBookAddedStub } from '../TestTools/GetSuccessfulBookAddedStub'
import { GetSuccessfulAuthorAddedStub } from '../TestTools/GetSuccessfulAuthorAddedStub'
import { SingleBookResultStub } from '../TestTools/SingleBookResultStub'
import { SingleAuthorsResultStub } from '../TestTools/SingleAuthorsResultStub'
import { FiveAuthorsResultStub } from '../TestTools/FiveAuthorsResultStub'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { AuthorsPresenter } from './AuthorsPresenter'
// import { BookListPresenter } from '../Books/BookList/BookListPresenter'
import { BooksRepository } from '../Books/BooksRepository'

let appTestHarness = null
let dataGateway = null
let authorsPresenter = null
// let bookListPresenter = null
let booksRepository = null
let dynamicBookNamesStack = null
let dynamicBookIdStack = null

describe('authors', () => {
  beforeEach(async () => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    appTestHarness.bootStrap(() => {})
    await appTestHarness.setupLogin(GetSuccessfulUserLoginStub, 'login')
    authorsPresenter = appTestHarness.container.get(AuthorsPresenter)
    // bookListPresenter = appTestHarness.container.get(BookListPresenter)
    booksRepository = appTestHarness.container.get(BooksRepository)
    dataGateway = appTestHarness.container.get(Types.IDataGateway)
    dynamicBookNamesStack = ['book7', 'book6', 'book5', 'book4', 'book3', 'book2', 'book1']
    dynamicBookIdStack = [7, 6, 5, 4, 3, 2, 1]

    // add author or book
    dataGateway.post.mockImplementation((path) => {
      if (path.indexOf('/books') !== -1) {
        return Promise.resolve(GetSuccessfulBookAddedStub(dynamicBookIdStack.pop()))
      } else if (path.indexOf('/authors') !== -1) {
        return Promise.resolve(GetSuccessfulAuthorAddedStub())
      }
    })
    // load author list or get specific book
    dataGateway.get.mockImplementation((path) => {
      if (path.indexOf('/authors') !== -1) {
        return Promise.resolve(SingleAuthorsResultStub())
      } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
        return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
      }
    })
  })

  describe('loading', async () => {
    it('should load list author and books into ViewModel', async () => {
      await authorsPresenter.load()

      expect(authorsPresenter.viewModel).toEqual([
        { visibleAuthor: '(Isaac Asimov) | (book1,book2)' },
        { visibleAuthor: '(Kenneth Graeme) | (book3)' }
      ])
    })

    it('should show author list (toggle) when has authors', async () => {
      // defaults to true
      expect(authorsPresenter.showAuthorsList).toEqual(true)

      await authorsPresenter.load()

      // still true after load
      expect(authorsPresenter.authorsRepository.authorsPm.authors.length).toBe(2)
      expect(authorsPresenter.showAuthorsList).toEqual(true)
    })

    it('should hide author list (toggle) when has more than 4 authors', async () => {
      authorsPresenter.newAuthorName = 'newAuthor'
      booksRepository.stagedBookNames = ['book1', 'book2', 'book3', 'book4', 'book5']
      dataGateway.get.mockImplementation((path) => {
        if (path.indexOf('/authors') !== -1) {
          return Promise.resolve(FiveAuthorsResultStub())
        } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
          return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
        }
      })

      await authorsPresenter.addAuthor()

      // 5 authors
      expect(authorsPresenter.authorsRepository.authorsPm.authors.length).toBe(5)
      expect(authorsPresenter.showAuthorsList).toEqual(false)
    })
  })

  describe('saving', () => {
    it('should allow single author to be added and will reload authors list', async () => {
      dataGateway.get.mockImplementation((path) => {
        if (path.indexOf('/authors') !== -1) {
          return Promise.resolve(SingleAuthorsResultStub())
        } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
          return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
        }
      })
      authorsPresenter.newAuthorName = 'newAuthor'
      booksRepository.stagedBookNames = ['book1', 'book2', 'book3']

      await authorsPresenter.addAuthor()

      expect(dataGateway.post).toBeCalledWith('/authors', {
        bookIds: [1, 2, 3],
        emailOwnerId: 'a@b.com',
        latLon: [1, 2],
        name: 'newAuthor'
      })
      expect(authorsPresenter.viewModel).toEqual([
        { visibleAuthor: '(Isaac Asimov) | (book1,book2)' },
        { visibleAuthor: '(Kenneth Graeme) | (book3)' }
      ])
    })

    it('should allow books to be staged and then save authors and books to api', async () => {
      dataGateway.get.mockImplementation((path) => {
        if (path.indexOf('/authors') !== -1) {
          return Promise.resolve(SingleAuthorsResultStub())
        } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
          return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
        }
      })

      authorsPresenter.newBookName = 'newBookName1'
      authorsPresenter.addBook()
      authorsPresenter.newBookName = 'newBookName2'
      authorsPresenter.addBook()

      expect(authorsPresenter.authorsRepository.booksRepository.stagedBookNames).toEqual([
        'newBookName1',
        'newBookName2'
      ])

      authorsPresenter.newAuthorName = 'newAuthor1'

      await authorsPresenter.addAuthor()

      expect(dataGateway.post).lastCalledWith('/authors', {
        bookIds: [1, 2],
        emailOwnerId: 'a@b.com',
        latLon: [1, 2],
        name: 'newAuthor1'
      })
    })
  })
})
