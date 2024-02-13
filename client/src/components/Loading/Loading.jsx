import React from 'react'
import {Spinner} from "@nextui-org/react";

const Loading = ({text}) => {
  return (
    <div>
          <Spinner color="success" />
    </div>
  )
}

export default Loading