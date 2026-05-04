import React, { useRef, useLayoutEffect } from 'react'
import useWindowsStore from '../store/window'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Draggable } from 'gsap/Draggable'

// Register the Draggable plugin
gsap.registerPlugin(Draggable);

const WindowWrapper = (Component, windowKey) => {
    return (props) => {
        const { focusWindow, windows } = useWindowsStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        useGSAP(() => {
            if (isOpen && ref.current) {
                // Preserve centering if using translate-x classes
                gsap.set(ref.current, { xPercent: -50, left: '50%' });

                // Make the window draggable
                Draggable.create(ref.current, {
                    type: "x,y",
                    bounds: window, // Restrict dragging to the viewport
                    edgeResistance: 0.65,
                    onPress: () => {
                        focusWindow(windowKey); // Bring to front when clicked/dragged
                    }
                });

                // macOS window opening effect
                gsap.fromTo(ref.current, 
                    { scale: 0.85, opacity: 0, y: 30 }, 
                    {
                        scale: 1, 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.35, 
                        ease: 'back.out(1.2)',
                        overwrite: 'auto'
                    }
                );
            }
        }, [isOpen]);

        if (!isOpen) return null;

        return (
            <section 
                id={windowKey} 
                ref={ref} 
                className="absolute shadow-2xl"
                style={{ zIndex }}
                onMouseDown={() => focusWindow(windowKey)}
            >
                <Component {...props} />
            </section>
        )
    }
}

export default WindowWrapper