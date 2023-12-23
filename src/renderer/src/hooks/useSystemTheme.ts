import { useEffect, useState } from 'react'

export const useSystemTheme = () => {
  const getDarkThemeMediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(
    getDarkThemeMediaQuery().matches ? 'dark' : 'light'
  )

  useEffect(() => {
    const onChangeTheme = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    const mq = getDarkThemeMediaQuery()
    mq.addEventListener('change', onChangeTheme)
    return () => mq.removeEventListener('change', onChangeTheme)
  }, [])

  return {
    systemTheme
  }
}
