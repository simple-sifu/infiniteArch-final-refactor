import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { BooksPresenter } from './BooksPresenter'
import { BookListComponent } from './BookList/BookListComponent'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { AddBooksComponent } from './AddBooks/AddBooksComponent'
import { LastAddedBookComponent } from './LastAddedBookComponent'

const BooksComp = observer((props) => {
  return (
    <>
      <h1>Books</h1>
      <LastAddedBookComponent lastAddedBook={props.presenter.lastAddedBook} />
      <AddBooksComponent presenter={props.presenter} />
      <br />
      <BookListComponent />
      <MessagesComponent />
    </>
  )
})

export const BooksComponent = withInjection({ presenter: BooksPresenter })(BooksComp)
