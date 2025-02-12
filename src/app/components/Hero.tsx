import React from 'react'

const Hero = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-5 text-center p-4 md:p-8'>
      <h1 className='text-4xl sm:text-5xl font-bold'>
        Que es <span className='text-primary'>Timba?</span>
      </h1>
      <p className='text-lg sm:text-xl font-semibold max-w-3xl'>
        Timba es la solución perfecta y eficaz para resolver las cuentas con tus amigos 😅.
      </p>
      <ul className='flex flex-col gap-2 items-start sm:items-center md:items-start md:gap-4 mt-4'>
        <li>✅ Salva billeteras</li>
        <li>✅ Salva amistades</li>
        <li>✅ Eficiente</li>
        <li>✅ Intuitivo</li>
      </ul>
    </section>
  )
}

export default Hero
