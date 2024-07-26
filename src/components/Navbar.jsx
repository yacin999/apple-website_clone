import React from 'react'
import { appleImg, bagImg, searchImg } from "../utils"


const Navbar = () => {
  return (
    <header className='w-full py-5 sm:px-10 px-5 flex juftify-between items-center'>
      <nav className='flex w-full screen-max-width'>
        <img 
          src={appleImg}
          alt='Apple'
          width={14}
          height={18}
        />
        <div>
          {["Phones", "Macbooks", "Tablets"].map((nav)=> (
            <div key={nav}>{nav}</div>
          ))}
        </div>

        <div>
          <img 
            src={searchImg} 
            alt='search'
            width={18}
            height={18}
          />
          <img 
            src={bagImg} 
            alt='bag'
            width={18}
            height={18}
          />
        </div>
      </nav>
    </header>
  )
}

export default Navbar