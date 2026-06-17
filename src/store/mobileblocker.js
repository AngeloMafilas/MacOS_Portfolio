import { useState, useEffect } from 'react'

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handleChange = (e) => setIsMobile(e.matches)

    setIsMobile(mql.matches)
    mql.addEventListener('change', handleChange)

    return () => mql.removeEventListener('change', handleChange)
  }, [breakpoint])

  return isMobile
}

export default useIsMobile