import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1728463986975-cf46f96b142e?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8  flex justify-between flex-col w-full bg-red-400'>
        <img className='w-16 ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <div className='bg-white pb-7 py-5 px-4'>
          <h2 className='text-2xl font-bold'>Get Started with Uber</h2>
          <Link to='/login'className='flex items-center justify-center w-full bg-black text-white py-3 mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
export { Home }
