import React, { useRef } from "react"
import { useFrame } from "react-three-fiber"
import lerp from "lerp"
import { useParallax } from "./Parallax"
import "./materials/MeshUVZoomMaterial"

const Image = ({ src, size, aspect, ...props }) => {
  const { scrollTop, viewport, width, pages, offsetFactor } = useParallax()
  const ref = useRef()
  let last = scrollTop.current
  useFrame(() => {
    ref.current.scale = lerp(ref.current.scale, offsetFactor - scrollTop.current / (pages * viewport.height - viewport.height), 0.1)
    ref.current.shift = lerp(ref.current.shift, (scrollTop.current - last) / 200, 0.1)
    last = scrollTop.current
  })
  return (
    <mesh scale={[width * size, (width * size) / aspect, 1]} {...props} frustumCulled={false}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
      <meshUVZoomMaterial ref={ref} attach="material" map={src} />
    </mesh>
  )
}

export default Image
