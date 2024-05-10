const concave = {
  title: 'Concave',
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
    Matter.Composite.add(world, [
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    const arrow = Matter.Vertices.fromPath(
        '40 0 40 20 100 20 100 80 40 80 40 100 0 50'
      ),
      chevron = Matter.Vertices.fromPath(
        '100 0 75 50 100 100 25 100 0 50 25 0'
      ),
      star = Matter.Vertices.fromPath(
        '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'
      ),
      horseShoe = Matter.Vertices.fromPath(
        '35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7'
      )

    const stack = Matter.Composites.stack(
      50,
      50,
      6,
      4,
      10,
      10,
      function (x, y) {
        const color = Matter.Common.choose([
          '#f19648',
          '#f5d259',
          '#f55a3c',
          '#063e7b',
          '#ececd1',
        ])
        return Matter.Bodies.fromVertices(
          x,
          y,
          Matter.Common.choose([arrow, chevron, star, horseShoe]),
          {
            render: {
              fillStyle: color,
              strokeStyle: color,
              lineWidth: 1,
            },
          },
          true
        )
      }
    )

    Matter.Composite.add(world, stack)

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

export default concave
