import { useEffect } from 'react'
import { analyticsScripts } from '@/lib/analytics-config'

export function Analytics() {
  useEffect(() => {
    const scriptElements = analyticsScripts
      .filter(script => script.enabled)
      .map(script => {
        const element = document.createElement('script')
        
        element.src = script.src
        element.id = `analytics-script-${script.id}`
        
        if (script.async) element.async = true
        if (script.defer) element.defer = true
        
        if (script.attributes) {
          Object.entries(script.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value)
          })
        }
        
        return element
      })
    
    scriptElements.forEach(element => {
      document.body.appendChild(element)
    })
    
    return () => {
      scriptElements.forEach(element => {
        const scriptElement = document.getElementById(element.id)
        if (scriptElement) {
          scriptElement.remove()
        }
      })
    }
  }, [])
  
  return null
}


