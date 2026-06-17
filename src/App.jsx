import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navbar, Welcome, Dock, Desktop } from "./components";
import { Draggable } from 'gsap/Draggable';
import gsap from 'gsap';
import { Terminal, Safari, Resume, Finder, TextFile, ImageFile, Contact } from "./windows";
import Splash from './components/Splash';
import useIsMobile from './store/mobileblocker'
import MobileBlocker from './components/constants/MobileBlocker'

gsap.registerPlugin(Draggable); 

const App = () => {
  const [started, setStarted] = useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      <AnimatePresence>
        {!started && <Splash onComplete={() => setStarted(true)} />}
      </AnimatePresence>

if (isMobile) return <MobileBlocker />

      {started && (
        <main>
          <Navbar />
          <Welcome />
          <Desktop />
          <Dock />

          <Terminal />
          <Safari />
          <Resume />
          <Finder />
          <TextFile />
          <ImageFile />
          <Contact />
        </main>
      )}
    </>
  );
}

export default App