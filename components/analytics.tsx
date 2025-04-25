'use client';

import { useEffect } from 'react';
import { analyticsScripts } from '@/lib/analytics-config';

/**
 * Analytics component for loading external tracking scripts
 * Scripts are configured in lib/analytics-config.ts
 */
export function Analytics() {
  useEffect(() => {
    // Load all enabled scripts from configuration
    const scriptElements = analyticsScripts
      .filter(script => script.enabled)
      .map(script => {
        const element = document.createElement('script');
        
        // Set core properties
        element.src = script.src;
        element.id = `analytics-script-${script.id}`;
        
        // Set optional properties
        if (script.async) element.async = true;
        if (script.defer) element.defer = true;
        
        // Set any additional attributes
        if (script.attributes) {
          Object.entries(script.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
          });
        }
        
        return element;
      });
    
    // Append all scripts to document
    scriptElements.forEach(element => {
      document.body.appendChild(element);
    });
    
    // Cleanup function to remove scripts on unmount if needed
    return () => {
      scriptElements.forEach(element => {
        const scriptElement = document.getElementById(element.id);
        if (scriptElement) {
          scriptElement.remove();
        }
      });
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 