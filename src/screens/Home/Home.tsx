import React from 'react'
import Header from './components/Header'
import Body from './components/Body'

function Home() {
  return (
     <div className='flex flex-col  h-screen'>
     <Header/>
     <Body/>
     </div>
  )
}

export default Home