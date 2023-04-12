import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../../Core/Providers/Injection'
import { BookListPresenter } from './BookListPresenter'

export const BookListComp = observer(({ presenter }) => {
  return (
    <>
      {presenter.viewModel.map((book, i) => {
        return <div key={i}>{book.visibleName}</div>
      })}
      <br />
    </>
  )
})

export const BookListComponent = withInjection({ presenter: BookListPresenter })(BookListComp)
