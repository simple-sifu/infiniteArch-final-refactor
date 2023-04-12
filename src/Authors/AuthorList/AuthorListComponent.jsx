import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../../Core/Providers/Injection'
import { AuthorsPresenter } from '../AuthorsPresenter'

const AuthorListComp = observer(({ presenter }) => {
  return (
    <>
      {presenter.viewModel.map((author, i) => {
        return <div key={i}>{author.visibleAuthor}</div>
      })}
      <br />
    </>
  )
})

export const AuthorListComponent = withInjection({ presenter: AuthorsPresenter })(AuthorListComp)
