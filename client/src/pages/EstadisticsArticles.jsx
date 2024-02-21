import React from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import ArticlesRanking from '../components/Estadistics/articlesEstadistics/ArticlesRanking'

const EstadisticsArticles = () => {
  return (
    <div>
      <NavBarComponent/>
      
      <div className='flex flex-col items-center justify-center'>
             <div>
                <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Productos</p>
            </div>
            <div className='mt-4'>
                <ArticlesRanking/>
            </div>
         </div>
    </div>
  )
}

export default EstadisticsArticles
