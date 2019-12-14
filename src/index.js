import ReactDOM from "react-dom"
import React, { Suspense, useEffect, useRef } from "react"
import { Canvas, Dom, useLoader, useFrame } from "react-three-fiber"
import { TextureLoader, LinearFilter } from "three"
import lerp from "lerp"
import { Text, MultilineText } from "./components/Text"
import Diamonds from "./diamonds/Diamonds"
import Plane from "./components/Plane"
import Parallax, { useParallax } from "./components/Parallax"
import state from "./store"
import "./styles.css"

function Startup() {
  const ref = useRef()
  useFrame(() => (ref.current.material.opacity = lerp(ref.current.material.opacity, 0, 0.025)))
  return <Plane ref={ref} color="#0e0e0f" position={[0, 0, 200]} scale={[100, 100, 1]} />
}

function Content() {
  const textures = useLoader(TextureLoader, state.paragraphs.map(({ image }) => image))
  const images = textures.map(texture => ((texture.minFilter = LinearFilter), texture))
  const { width, zoom, viewport, margin, mobile } = useParallax()
  return (
    <>
      <Parallax factor={1} offset={0}>
        <Parallax factor={1} offset={-0.25}>
          <Text left size={width * 0.08} position={[-viewport.width / zoom / 5, (-viewport.height + viewport.height*0.35) / zoom / 5, -1]} color="#d40749">
          {"MOKSHA"}
          </Text>
        </Parallax>
        <Parallax factor={0.8} offset={-0.22}>
          <Dom position={[-viewport.width / zoom / 5, -viewport.height / zoom / 5, -1]}>
          It was the year 2076. The substance had arrived.
          </Dom>
        </Parallax>
      </Parallax>
      <Parallax factor={1.2} offset={5.7}>
        <MultilineText top left size={width * 0.15} lineHeight={width / 5} position={[-width / 3.5, 0, -1]} color="#2fe8c3" text={"four\nzero\nzero"} />
      </Parallax>
      {state.paragraphs.map(({ offset, factor, header, aspect, text }, index) => {
        const size = aspect < 1 && !mobile ? 0.65 : 1
        const alignRight = (viewport.width / zoom - width * size - margin) / 2
        const pixelWidth = width * zoom * size
        const left = !(index % 2)
        const color = index % 2 ? "#D40749" : "#2FE8C3"
        return (
          <Parallax key={index} factor={factor} offset={offset}>
            <group position={[left ? -alignRight : alignRight, 0, 0]}>
              <Plane map={images[index]} args={[1, 1, 32, 32]} shift={200} size={size} aspect={aspect} scale={[width * size, (width * size) / aspect, 1]} frustumCulled={false} />
              <Dom
                prepend
                style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: left ? "left" : "right" }}
                position={[left || mobile ? (-width * size) / 2 : 0, (-width * size) / 2 / aspect - 0.4, 1]}>
                {text}
              </Dom>
              <Text left={left} right={!left} size={width * 0.04} color={color} top position={[((left ? -width : width) * size) / 2, (width * size) / aspect / 2 + 0.5, -1]}>
                {header}
              </Text>
              <Parallax factor={0.2} offset={offset}>
                <Text opacity={0.5} size={width * 0.1} color="#1A1E2A" position={[((left ? width : -width) / 2) * size, (width * size) / aspect / 1.5, -10]}>
                  {"0" + (index + 1)}
                </Text>
              </Parallax>
            </group>
          </Parallax>
        )
      })}
      {state.stripes.map(({ offset, color, height }, index) => (
        <Parallax key={index} factor={-1.5} offset={offset}>
          <Plane args={[50, height, 32, 32]} shift={-4} color={color} rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]} />
        </Parallax>
      ))}
      <Parallax factor={1.25} offset={8}>
        <Dom className="bottom-left" position={[-viewport.width / zoom / 2, -viewport.height / zoom / 2, 0]}>
          Culture is not your friend.
        </Dom>
      </Parallax>
    </>
  )
}

function App() {
  const scrollArea = useRef()
  useEffect(() => void (state.scrollTop.current = scrollArea.current.scrollTop), [])
  return (
    <>
      <Canvas concurrent pixelRatio={1} orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
        <Suspense fallback={<Dom center className="loading" children="Loading..." />}>
          <Content />
          <Diamonds />
          <Startup />
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={e => (state.scrollTop.current = e.target.scrollTop)}>
        {new Array(state.pages).fill().map((_, index) => (
          <div key={index} id={"0" + index} style={{ height: "100vh" }} />
        ))}
      </div>
      <div className="frame">
        <h1 className="frame__title">Scroll, Refraction and Shader Effects</h1>
        <div className="frame__links">
          <a className="frame__link" href="http://tympanus.net/Tutorials/PhysicsMenu/">Previous demo</a>
          <a className="frame__link" href="https://tympanus.net/codrops/?p=45441">Article</a>
          <a className="frame__link" href="https://github.com/drcmda/the-substance">GitHub</a>
        </div>
        <div className="frame__nav">
          <a className="frame__link" href="#00" children="intro" />
          <a className="frame__link" href="#01" children="01" />
          <a className="frame__link" href="#02" children="02" />
          <a className="frame__link" href="#03" children="03" />
          <a className="frame__link" href="#04" children="04" />
          <a className="frame__link" href="#05" children="05" />
          <a className="frame__link" href="#07" children="06" />
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
