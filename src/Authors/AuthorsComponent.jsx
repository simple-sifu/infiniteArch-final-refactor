import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorsPresenter } from './AuthorsPresenter'
import { AuthorListComponent } from './AuthorList/AuthorListComponent'
import { AddBooksComponent } from '../Books/AddBooks/AddBooksComponent'
import { BookListComponent } from '../Books/BookList/BookListComponent'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { AddAuthorComponent } from './AddAuthor/AddAuthorComponent'
import { useValidation } from '../Core/Providers/Validation'

export const AuthorsComp = observer((props) => {
  const [, updateClientValidationMessages] = useValidation()
  let formValid = () => {
    let clientValidationMessages = []
    if (props.presenter.newAuthorName === '') clientValidationMessages.push('No author name')
    updateClientValidationMessages(clientValidationMessages)
    return clientValidationMessages.length === 0
  }

  // removed this because it could generate duplicated loads
  // React.useEffect(() => {
  //   props.presenter.load()
  // }, [])

  // removed formValid prop on AddBooksComponent
  // since it already has it defined inside addBooksComponent
  return (
    <>
      <h1>AUTHORS</h1>
      <input value="show author list" type="button" onClick={props.presenter.toggleShowAuthors} />
      <br />
      <AuthorListComponent />
      <br />
      <AddAuthorComponent presenter={props.presenter} formValid={formValid} />
      <br />
      <AddBooksComponent presenter={props.presenter} />
      <br />
      <BookListComponent />
      <br />
      <MessagesComponent />
    </>
  )
})

export const AuthorsComponent = withInjection({ presenter: AuthorsPresenter })(AuthorsComp)
