import { FontLoader, Vector3, TextBufferGeometry } from "three"
import React, { useCallback, useRef } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import usePromise from "react-promise-suspense"
import lerp from "lerp"
import { useParallax } from "./Parallax"

function Text({ children, size = 1, left, right, top, bottom, color = "white", opacity = 1, height = 0.01, layers = 0, font = "/MOONGET_Heavy.blob", ...props }) {
  const data = useLoader(FontLoader, font)
  const geom = usePromise(() => new Promise(res => res(new TextBufferGeometry(children, { font: data, size: 1, height, curveSegments: 32 }))), [children])
  const onUpdate = useCallback(
    self => {
      const box = new Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(box)
      self.position.x = left ? 0 : right ? -box.x : -box.x / 2
      self.position.y = top ? 0 : bottom ? -box.y : -box.y / 2
    },
    [left, right, top, bottom]
  )

  const { scrollTop } = useParallax()
  const ref = useRef()
  let last = scrollTop.current
  useFrame(() => {
    ref.current.shift = lerp(ref.current.shift, (scrollTop.current - last) / 200, 0.1)
    last = scrollTop.current
  })

  return (
    <group {...props} scale={[size, size, 0.1]}>
      <mesh geometry={geom} onUpdate={onUpdate} frustumCulled={false}>
        <meshUVZoomMaterial ref={ref} attach="material" color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

const MultilineText = ({ text, size = 1, lineHeight = 1, position = [0, 0, 0], ...props }) =>
  text.split("\n").map((text, index) => <Text key={index} size={size} {...props} position={[position[0], position[1] - index * lineHeight, position[2]]} children={text} />)

export { Text, MultilineText }
