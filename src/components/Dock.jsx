import React, { useRef } from 'react'
import { dockApps } from './constants'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useWindowsStore from '../store/window';

const Dock = () => {
  const { windows, openWindow, closeWindow } = useWindowsStore();
  const dockRef = useRef(null);

  const toggleApp = (id, e) => {
    // macOS Bounce Effect on Click
    const img = e.currentTarget.querySelector('img');
    gsap.to(img, {
      y: -20,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });

    const window = windows[id];
    if (window?.isOpen) {
      closeWindow(id);
    } else {
      openWindow(id);
    }
  }

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = gsap.utils.toArray('.dock-icon-wrapper');
    const MAX_DISTANCE = 150; // Larger spread for smoother ramp
    const MAX_SCALE = 0.25;   // Even more subtle magnification

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;

      icons.forEach((iconWrapper) => {
        const rect = iconWrapper.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - iconCenterX);
        
        let scale = 1;
        if (distance < MAX_DISTANCE) {
          const ratio = 1 - distance / MAX_DISTANCE;
          scale = 1 + MAX_SCALE * Math.sin(ratio * (Math.PI / 2));
        }

        const img = iconWrapper.querySelector('img');
        const tooltip = iconWrapper.querySelector('.tooltip');

        gsap.to(img, {
          scale: scale,
          y: (scale - 1) * -45, // Proportional lift
          duration: 0.15,       // Faster response for fluid feel
          overwrite: 'auto',
          ease: 'power2.out'
        });

        // Show tooltip when close
        if (distance < 30) {
          gsap.to(tooltip, { opacity: 1, y: -20, duration: 0.15, overwrite: 'auto' });
        } else {
          gsap.to(tooltip, { opacity: 0, y: 0, duration: 0.15, overwrite: 'auto' });
        }
      });
    };

    const handleMouseLeave = () => {
      icons.forEach((iconWrapper) => {
        const img = iconWrapper.querySelector('img');
        const tooltip = iconWrapper.querySelector('.tooltip');

        gsap.to(img, {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        });
        gsap.to(tooltip, { opacity: 0, y: 0, duration: 0.2 });
      });
    };

    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      dock.removeEventListener('mousemove', handleMouseMove);
      dock.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: dockRef });
  
  return (
    <section id="dock" ref={dockRef}>
      <div className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="dock-icon-wrapper relative flex flex-col items-center"> 
            <div className="tooltip absolute -top-12 opacity-0 pointer-events-none whitespace-nowrap z-50">
              {name}
            </div>

            <button 
              type="button" 
              className="dock-icon" 
              aria-label={name}
              disabled={!canOpen}
              onClick={(e) => toggleApp(id, e)}
            >
              <img 
                src={`/images/${icon}`} 
                alt={name} 
                loading="lazy"
                className={`w-full h-full object-contain pointer-events-none ${canOpen ? '' : 'opacity-50'}`} 
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dock