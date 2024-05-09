const terrain = {
  title: 'Terrain',
  for: '>=1.0.5',
  init: function () {
    // provide concave decomposition support library
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Matter.Common.setDecomp(require('poly-decomp'))

    // create engine
    const engine = Matter.Engine.create()
    const world = engine.world

    // create renderer
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    if (typeof fetch !== 'undefined') {
      const select = function (root: Document, selector: string) {
        return Array.prototype.slice.call(root.querySelectorAll(selector))
      }

      const loadSvg = function (url: string) {
        return fetch(url)
          .then(function (response) {
            return response.text()
          })
          .then(function (raw) {
            return new window.DOMParser().parseFromString(raw, 'image/svg+xml')
          })
      }

      loadSvg('./svg/terrain.svg').then(function (root) {
        const paths = select(root, 'path')

        const vertexSets = paths.map(function (path) {
          return Matter.Svg.pathToVertices(path, 30)
        })

        const terrain = Matter.Bodies.fromVertices(
          400,
          350,
          vertexSets,
          {
            isStatic: true,
            render: {
              fillStyle: '#060a19',
              strokeStyle: '#060a19',
              lineWidth: 1,
            },
          },
          true
        )

        Matter.Composite.add(world, terrain)

        const bodyOptions = {
          frictionAir: 0,
          friction: 0.0001,
          restitution: 0.6,
        }

        Matter.Composite.add(
          world,
          Matter.Composites.stack(80, 100, 20, 20, 10, 10, function (x, y) {
            if (Matter.Query.point([terrain], { x: x, y: y }).length === 0) {
              return Matter.Bodies.polygon(x, y, 5, 12, bodyOptions)
            }
          })
        )
      })
    } else {
      Matter.Common.warn('Fetch is not available. Could not load SVG.')
    }

    // add mouse control
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })

    Matter.Composite.add(world, mouseConstraint)

    // keep the mouse in sync with rendering
    render.mouse = mouse

    // fit the render viewport to the scene
    Matter.Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    })

    // context for MatterTools.Demo
    return {
      engine: engine,
      runner: runner,
      render: render,
      canvas: render.canvas,
      stop: function () {
        Matter.Render.stop(render)
        Matter.Runner.stop(runner)
      },
    }
  },
}

export default terrain
