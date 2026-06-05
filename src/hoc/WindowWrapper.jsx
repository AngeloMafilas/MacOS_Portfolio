import React, { useRef } from 'react'
import useWindowsStore from '../store/window'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable);

const WindowWrapper = (Component, windowKey) => {
    const WrappedComponent = (props) => {
        const { focusWindow, windows } = useWindowsStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        useGSAP(() => {
            if (isOpen && ref.current) {
                gsap.set(ref.current, {
                    xPercent: -50,
                    left: '50%',
                    top: '10%',
                });

                Draggable.create(ref.current, {
                    type: "x,y",
                    trigger: ".window-header",
                    bounds: "body",
                    edgeResistance: 0.65,
                    onPress: () => {
                        focusWindow(windowKey);
                    }
                });

                gsap.fromTo(ref.current,
                    { scale: 0.88, opacity: 0, y: 20 },
                    {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'back.out(1.5)',
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
                className="absolute shadow-2xl pointer-events-auto w-fit"
                style={{ zIndex }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    focusWindow(windowKey);
                }}
                onWheel={(e) => {
                    e.stopPropagation();
                    focusWindow(windowKey);
                }}
            >
                <Component {...props} />
            </section>
        )
    }
    return WrappedComponent;
}

export default WindowWrapper