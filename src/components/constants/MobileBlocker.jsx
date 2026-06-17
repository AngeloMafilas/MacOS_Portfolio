import React from 'react'

const MobileBlocker = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 bg-black text-white">
      <h1 className="text-xl font-semibold mb-2">Laptop or Tablet Only</h1>
      <p className="text-sm text-white/70 max-w-xs">
        This portfolio is built as an interactive desktop experience and isn't optimized for phone screens. Please revisit on a laptop or tablet.
      </p>
    </div>
  )
}

export default MobileBlocker