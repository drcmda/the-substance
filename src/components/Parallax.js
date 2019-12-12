import React, { createContext, useRef, useContext } from "react"
import { useFrame, useThree } from "react-three-fiber"
import lerp from "lerp"
import state from "./../store"

const offsetContext = createContext(0)
const Parallax = ({ children, offset, factor, zoom, ...props }) => {
  const { scrollTop, height } = useParallax()
  const group = useRef()
  useFrame(() => (group.current.position.y = lerp(group.current.position.y, (scrollTop.current / 100) * factor, 0.1)))
  return (
    <offsetContext.Provider value={offset}>
      <group {...props} position={[0, -height * offset * factor, 0]}>
        <group ref={group}>{children}</group>
      </group>
    </offsetContext.Provider>
  )
}

const useParallax = () => {
  const { sections, pages, zoom } = state
  const { size, viewport } = useThree()
  const offset = useContext(offsetContext)
  const viewportWidth = viewport.width / zoom
  const mobile = size.width < 800
  const margin = viewportWidth * (mobile ? 0.1 : 0.1)
  const width = viewportWidth * (mobile ? 0.9 : 0.6)
  const offsetFactor = (offset + 1.0) / sections
  const height = (viewport.height / 100) * ((pages - 1) / (sections - 1))
  return { ...state, mobile, margin, width, height, viewport, offset, offsetFactor }
}

export default Parallax
export { useParallax }
