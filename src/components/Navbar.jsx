import React from 'react'
import { navIcons, navLinks } from './constants'
// import dayjs from 'dayjs'


const Navbar = () => {
  return (
    <nav>
        <div>
            <img src="/images/logo.svg" alt="logo" />
            <p className='font-georama text-lg font-semibold'>Angelo's Portfolio</p>
            <ul>
                {navLinks.map(({id, name})=>(
                    <li key={id}>
                        <p >{name}</p>
                    </li>
                ))
            }
            </ul>
        </div>
        <div>
            <ul>
                {navIcons.map(({id,img})=>(
                    <li key={id}>
                        <img src={img} className='icon-hover' alt="icon" />
                    </li>
                ))}
            </ul>
            <time>{new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</time>
        </div>
    </nav>
  )
}

export default Navbar