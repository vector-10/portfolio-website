import React from 'react'

const Contact = () => {
  return (
    <div className='contact-section h-60 w-11/12'>
      <div className='awards-header h-28 px-28 py-16 mb-20 '>
        <h1 className='introduce text-4xl font-bold block-text'>Contact Me</h1>
        <p className='text-md introduce1'>Im actively seeking Job opportunities and Collaborations. If you have any, contact me.</p>
      </div>

     <div className='flex items-center justify-center md:w-1/2'>
     <form className='w-full max-w-lg'>
        <div className='flex flex-wrap mb-6'>
          {/* name */}
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label className='block uppercase text-gray-700 text-xs font-bold mb-2'>
            Name
            </label>
            <input type="text" placeholder="name" className='appearance-none block w-full text-gray-700 border px-3 py-3 mb-3 focus:outline-none focus:bg-white'/>
          </div>
          {/* email */}
          <div className='w-full md:w-1/2 px-3'>
          <label className='block uppercase text-gray-700 text-xs font-bold mb-2'>
            Email
            </label>
            <input type="email" placeholder="email" className='appearance-none block w-full  text-gray-700 border px-3 py-3 mb-3 focus:outline-none focus:bg-white'/>            
          </div>
        </div>

        <div class="flex flex-wrap  mb-6">
        <div className='w-full px-3'>
          <label className='block uppercase text-gray-700 text-xs font-bold mb-2 '>
            Message
            </label>
            <input type="email" placeholder="message" className='appearance-none block w-full  text-gray-700 border py-3 px-3 mb-3 focus:outline-none focus:bg-white'/>            
          </div>    
          {/* button       */}
          <button class="shadow bg-orange-500 hover:bg-orange-600 text-white py-2 px-4  " type="button">
            Send Mail
          </button>
        </div>
      </form>
     </div>
    </div>
  )
}

export default Contact