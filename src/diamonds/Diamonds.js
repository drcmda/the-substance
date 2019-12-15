import { WebGLRenderTarget, Object3D } from "three"
import React, { useRef, useMemo } from "react"
import { useLoader, useThree, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import lerp from "lerp"
import BackfaceMaterial from "./BackfaceMaterial"
import RefractionMaterial from "./RefractionMaterial"
import { useBlock } from "../blocks"
import state from "../store"

const dummy = new Object3D()
export default function Diamonds() {
  const gltf = useLoader(GLTFLoader, "/diamond.glb")
  useMemo(() => gltf.scene.children[0].geometry.center(), [])

  const { size, gl, scene, camera, clock } = useThree()
  const { contentMaxWidth, sectionHeight, mobile } = useBlock()
  const model = useRef()
  const ratio = gl.getPixelRatio()

  const [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial] = useMemo(() => {
    const envFbo = new WebGLRenderTarget(size.width * ratio, size.height * ratio)
    const backfaceFbo = new WebGLRenderTarget(size.width * ratio, size.height * ratio)
    const backfaceMaterial = new BackfaceMaterial()
    const refractionMaterial = new RefractionMaterial({
      envMap: envFbo.texture,
      backfaceMap: backfaceFbo.texture,
      resolution: [size.width * ratio, size.height * ratio]
    })
    return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial]
  }, [size, ratio])

  useFrame(() => {
    state.diamonds.forEach((data, i) => {
      const t = clock.getElapsedTime() / 2
      const { x, offset, scale, factor } = data
      const s = (contentMaxWidth / 35) * scale
      data.pos.set(mobile ? 0 : x, lerp(data.pos.y, -sectionHeight * offset * factor + (state.top.current / state.zoom) * factor, 0.1), 0)
      dummy.position.copy(data.pos)
      if (i === state.diamonds.length - 1) dummy.rotation.set(0, t, 0)
      else dummy.rotation.set(t, t, t)
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      model.current.setMatrixAt(i, dummy.matrix)
      model.current.instanceMatrix.needsUpdate = true
    })

    gl.autoClear = false
    camera.layers.set(0)
    gl.setRenderTarget(envFbo)
    gl.clearColor()
    gl.render(scene, camera)
    gl.clearDepth()
    camera.layers.set(1)
    model.current.material = backfaceMaterial
    gl.setRenderTarget(backfaceFbo)
    gl.clearDepth()
    gl.render(scene, camera)
    camera.layers.set(0)
    gl.setRenderTarget(null)
    gl.render(scene, camera)
    gl.clearDepth()
    camera.layers.set(1)
    model.current.material = refractionMaterial
    gl.render(scene, camera)
  }, 1)

  return (
    <instancedMesh ref={model} layers={1} args={[null, null, state.diamonds.length]} position={[0, 0, 50]}>
      <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
    </instancedMesh>
  )
}
