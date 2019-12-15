import React, { forwardRef, useRef } from "react"
import { useFrame } from "react-three-fiber"
import lerp from "lerp"
import "./CustomMaterial"
import { useBlock } from "../blocks"
import state from "../store"

const Plane = forwardRef(({ color = "white", shift = 1, opacity = 1, args, map, ...props }, ref) => {
  const { viewportHeight, offsetFactor } = useBlock()
  const material = useRef()
  let last = state.top.current
  useFrame(() => {
    const { pages, top } = state
    material.current.scale = lerp(material.current.scale, offsetFactor - top.current / ((pages - 1) * viewportHeight), 0.1)
    material.current.shift = lerp(material.current.shift, (top.current - last) / shift, 0.1)
    last = top.current
  })
  return (
    <mesh ref={ref} {...props}>
      <planeBufferGeometry attach="geometry" args={args} />
      <customMaterial ref={material} attach="material" color={color} map={map} transparent opacity={opacity} />
    </mesh>
  )
})

export default Plane
