import React, { useRef } from 'react'
import { dockApps } from './constants'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Dock = () => {
  const dockRef = useRef(null);

  const toggleApp = (app) => {
    //TODO: Implement app toggle functionality
    console.log("Toggling app:", app);
  }

  useGSAP(() => {
    const icons = gsap.utils.toArray('.dock-icon-wrapper');
    
    icons.forEach((icon) => {
      const img = icon.querySelector('img');
      const tooltip = icon.querySelector('.tooltip');
      
      icon.addEventListener('mouseenter', () => {
        gsap.to(img, {
          y: -15,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(tooltip, {
          opacity: 1,
          y: -10,
          duration: 0.2
        });
      });

      icon.addEventListener('mouseleave', () => {
        gsap.to(img, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.in'
        });
        gsap.to(tooltip, {
          opacity: 0,
          y: 0,
          duration: 0.2
        });
      });
    });
  }, { scope: dockRef });
  
  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="dock-icon-wrapper relative flex flex-col items-center"> 
            {/* Tooltip */}
            <div className="tooltip absolute -top-10 opacity-0 pointer-events-none whitespace-nowrap z-50">
              {name}
            </div>

            <button 
              type="button" 
              className="dock-icon" 
              aria-label={name}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img 
                src={`/images/${icon}`} 
                alt={name} 
                loading="lazy"
                className={`w-full h-full object-contain ${canOpen ? '' : 'opacity-50'}`} 
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dock