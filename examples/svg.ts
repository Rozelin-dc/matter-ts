const svg = {
  title: 'Concave SVG Paths',
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

      ;[
        './svg/iconmonstr-check-mark-8-icon.svg',
        './svg/iconmonstr-paperclip-2-icon.svg',
        './svg/iconmonstr-puzzle-icon.svg',
        './svg/iconmonstr-user-icon.svg',
      ].forEach(function (path, i) {
        loadSvg(path).then(function (root) {
          const color = Matter.Common.choose([
            '#f19648',
            '#f5d259',
            '#f55a3c',
            '#063e7b',
            '#ececd1',
          ])

          const vertexSets = select(root, 'path').map(function (path) {
            return Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 30), 0.4, 0.4)
          })

          Matter.Composite.add(
            world,
            Matter.Bodies.fromVertices(
              100 + i * 150,
              200 + i * 50,
              vertexSets,
              {
                render: {
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 1,
                },
              },
              true
            )
          )
        })
      })

      loadSvg('./svg/svg.svg').then(function (root) {
        const color = Matter.Common.choose([
          '#f19648',
          '#f5d259',
          '#f55a3c',
          '#063e7b',
          '#ececd1',
        ])

        const vertexSets = select(root, 'path').map(function (path) {
          return Matter.Svg.pathToVertices(path, 30)
        })

        Matter.Composite.add(
          world,
          Matter.Bodies.fromVertices(
            400,
            80,
            vertexSets,
            {
              render: {
                fillStyle: color,
                strokeStyle: color,
                lineWidth: 1,
              },
            },
            true
          )
        )
      })
    } else {
      Matter.Common.warn('Fetch is not available. Could not load SVG.')
    }

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    // add mouse control
    const mouse = Matter.Mouse.create(render.canvas),
      mouseConstraint = Matter.MouseConstraint.create(engine, {
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

export default svg
