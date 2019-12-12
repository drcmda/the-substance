import React, { forwardRef, useRef } from "react"
import { useFrame } from "react-three-fiber"
import lerp from "lerp"
import { useParallax } from "./Parallax"
import "./materials/MeshUVZoomMaterial"

const Plane = forwardRef(({ color = "white", shift = 1, opacity = 1, args, map, ...props }, ref) => {
  const { scrollTop, viewport, pages, offsetFactor } = useParallax()
  const material = useRef()
  let last = scrollTop.current
  useFrame(() => {
    material.current.scale = lerp(material.current.scale, (offsetFactor - scrollTop.current / (pages * viewport.height - viewport.height)) * 2, 0.1)
    material.current.shift = lerp(material.current.shift, (scrollTop.current - last) / shift, 0.1)
    last = scrollTop.current
  })
  return (
    <mesh ref={ref} {...props}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshUVZoomMaterial ref={material} attach="material" color={color} map={map} transparent opacity={opacity} />
    </mesh>
  )
})

export default Plane
