import { useEffect, memo, useMemo } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

const ParticlesBG = memo(() => {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
    await loadSlim(engine)
    })
  }, [])

  const particlesLoaded = (container) => {
   console.log(container)
  };

  const options = useMemo(
    () => ({
      fullScreen: { enable: true },
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: false,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 7,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 120,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed:  1.3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  )

  
    return (
      <Particles
        id="tsparticles"
        // particlesLoaded={particlesLoaded} // Apenas para debug
        options={options}
      />
    )
  
})

export default ParticlesBG