import * as React from 'react'
import { observer } from 'mobx-react'

export const LastAddedBookComponent = observer(({ lastAddedBook }) => {
  return (
    <>
      <p>Last Added Book : {lastAddedBook}</p>
    </>
  )
})
