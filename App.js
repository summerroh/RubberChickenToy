import React, { useState } from 'react';
import Loading from './Loading';
import Chicken from './Chicken';6

function App() {
  const [isLoading, setIsLoading] = useState(false)

  if ( isLoading ) {
  return <Loading />
  }

  else{
    return <Chicken />
  }
}

export default App;