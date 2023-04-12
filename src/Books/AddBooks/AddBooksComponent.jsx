import * as React from 'react'
import { observer } from 'mobx-react'
import { useValidation } from '../../Core/Providers/Validation'

export const AddBooksComponent = observer((props) => {
  const [inputValue, setInputValue] = React.useState('')
  const [, updateClientValidationMessages] = useValidation()

  let formValid = () => {
    let clientValidationMessages = []
    if (!props.presenter.newBookName || props.presenter.newBookName === '')
      clientValidationMessages.push('No book name')
    updateClientValidationMessages(clientValidationMessages)
    return clientValidationMessages.length === 0
  }

  const inputValueHandler = (event) => {
    setInputValue(event.target.value)
    props.presenter.newBookName = event.target.value
  }

  return (
    <div>
      <form
        className="login"
        onSubmit={(event) => {
          event.preventDefault()
          if (formValid()) {
            props.presenter.addBook()
            setInputValue('')
          }
        }}
      >
        <label>
          <input
            type="text"
            value={inputValue}
            placeholder="Enter book name"
            onChange={(event) => {
              inputValueHandler(event)
            }}
          />
          <input type="submit" value="Add Book" />
        </label>
      </form>
    </div>
  )
})
