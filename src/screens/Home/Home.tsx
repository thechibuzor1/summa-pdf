import React from 'react'
import Header from './components/Header'
import Body from './components/Body'
import Scanning from '../../components/Scanning'
import SummaryCard from '../../components/SummaryCard'
import SummaryHistory from './components/SummaryHistory'

function Home() {
  return (
     <div className='flex flex-col min-h-screen'>
     <Header/>
     <Body/>
     <SummaryHistory />
     </div>
  )
}

export default Home