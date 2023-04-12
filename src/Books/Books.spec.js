import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { SingleBooksResultStub } from '../TestTools/SingleBooksResultStub'
import { GetSuccessfulBookAddedStub } from '../TestTools/GetSuccessfulBookAddedStub'
import { BooksPresenter } from './BooksPresenter'
import { BookListPresenter } from './BookList/BookListPresenter'
import { BooksRepository } from './BooksRepository'

let appTestHarness = null
let dataGateway = null
let booksPresenter = null
let bookListPresenter = null
let booksRepository = null

describe('books', () => {
  beforeEach(() => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    dataGateway = appTestHarness.container.get(Types.IDataGateway)
    booksRepository = appTestHarness.container.get(BooksRepository)
    booksPresenter = appTestHarness.container.get(BooksPresenter)
    bookListPresenter = appTestHarness.container.get(BookListPresenter)
  })

  describe('loading', async () => {
    it('should show book list', async () => {
      booksRepository.userModel.email = 'a@b.com'
      dataGateway.get = jest.fn().mockImplementation((path) => {
        if (path === `/books?emailOwnerId=a@b.com`) return SingleBooksResultStub()
      })
      booksPresenter = appTestHarness.container.get(BooksPresenter)

      await booksPresenter.load()

      expect(bookListPresenter.viewModel).toEqual([
        { visibleName: 'Wind in the willows' },
        { visibleName: 'I, Robot' },
        { visibleName: 'The Hobbit' },
        { visibleName: 'Wind In The Willows 2' }
      ])
    })
  })
  describe('saving', () => {
    beforeEach(async () => {
      dataGateway.post = jest.fn().mockImplementation((path) => {
        if (path === `/books`) return GetSuccessfulBookAddedStub(15)
      })
      booksPresenter.newBookName = 'newBookName'
      await booksPresenter.addBook()
    })

    it('should reload books list', async () => {
      booksRepository.userModel.email = 'a@b.com'
      const newBookStub = SingleBooksResultStub()
      newBookStub.result.push({
        bookId: 999,
        name: 'NewBook',
        emailOwnerId: 'a@b.com',
        devOwnerId: 'pete@logicroom.co'
      })
      dataGateway.get = jest.fn().mockImplementation((path) => {
        if (path === `/books?emailOwnerId=a@b.com`) return newBookStub
      })

      await booksPresenter.load()

      expect(bookListPresenter.viewModel).toEqual([
        { visibleName: 'Wind in the willows' },
        { visibleName: 'I, Robot' },
        { visibleName: 'The Hobbit' },
        { visibleName: 'Wind In The Willows 2' },
        { visibleName: newBookStub.result[4].name }
      ])
    })

    it('should update books message', async () => {
      expect(booksPresenter.messagesRepository.appMessages).toEqual(['Book added'])
    })

    it('should show lastAddedBook', async () => {
      expect(booksPresenter.lastAddedBook).toEqual('newBookName')
    })
  })
})
