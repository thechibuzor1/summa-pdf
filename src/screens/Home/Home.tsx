import React from 'react'
import Header from './components/Header'
import Body from './components/Body'
import SummaryHistory from './components/SummaryHistory'

function Home() {
  return (
     <div className='flex flex-col min-h-screen'>
     <Header/>
     <Body/>
     {
        localStorage.getItem("authToken") &&
        <SummaryHistory />
      }
     <p className="text-[12px] text-center text-gray-500 mt-4">Group8 CSC419 project</p>
 
     </div>
  )
}

export default Home