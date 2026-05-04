import React, { useRef } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const FONT_WEIGHTS = {
    subtitle: {min: 100, max: 400, default: 100},
    title: {min: 400, max: 900, default: 400},
    
};

const renderText = ({text, className, baseWeight = 400}) => {
    return  [...text].map((char, i) => (
        <span key={i} className={className} style={{fontVariationSettings: `wght ${baseWeight}`}}>
            {char === ' ' ? '\u00A0' : char}
        </span>
    ))
}

const setupTextHover = (container, type) => {
    if(!container) return;

    const letters = container.querySelectorAll("span");
    const {min,max,default: base} = FONT_WEIGHTS[type];
    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `"wght" ${weight}`
        });
    };

    const handleMouseMove = (e) => {
        const {left} = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const {left: l, width: w} = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l-left + w / 2));
            const intensity = Math.exp(-(distance ** 2)/2000);


            animateLetter(letter, min + (max - min) * intensity);
        })

    };

    const handleMouseLeave = () => {
        letters.forEach((letter) => animateLetter(letter, base));
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };

    


    
}

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(()=>{
        const cleanupTitle = setupTextHover(titleRef.current, "title");
        const cleanupSubtitle = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            cleanupTitle?.();
            cleanupSubtitle?.();
        };
    }, []) 

  return (
    <section id="welcome">
        <p ref={subtitleRef} className="text-3xl font-georama text-white">
            {renderText({text: "Hey, I'm Angelo Welcome to my", className: "text-white", baseWeight: 600})}
        </p>
        <h1 ref={titleRef} className="mt-7">
            {renderText({text: "portfolio", className: "text-9xl italic font-georama text-white", baseWeight: 100})}
        </h1>
        <div className='small-screen text-white/50'>
            {renderText({text: "This Portfolio is designed for desktop/tablet screens", className: "text-white/50", baseWeight: 600})}
        </div>
    </section>
  )
}

export default Welcome