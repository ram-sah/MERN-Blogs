import React from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector(state => state.theme)
  return (
    <div className={theme} >
      <div className='bg-white text-gray-500 dark:text-gray-200 dark:bg-slate-800 min-h-screen'>
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider
