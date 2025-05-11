import React from 'react'
import Banner from '../pages/home/Banner'
import Deal from '../pages/home/Deal'
import Chat from '../pages/home/Chat'

import Section1 from '../pages/home/Section1'
function Home() {
    return (
        <div className="container">
            <Banner />
            <Section1 />
            <Deal/>
            <Chat />
        </div>
    )
}

export default Home