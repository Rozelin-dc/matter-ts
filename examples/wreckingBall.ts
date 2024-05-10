const wreckingBall = {
  title: 'Wrecking Ball',
  for: '>=1.0.5',
  init: function () {
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
        showAngleIndicator: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const rows = 10
    const yy = 600 - 25 - 40 * rows

    const stack = Matter.Composites.stack(
      400,
      yy,
      5,
      rows,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 40, 40)
      }
    )

    Matter.Composite.add(world, [
      stack,
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    const ball = Matter.Bodies.circle(100, 400, 50, {
      density: 0.04,
      frictionAir: 0.005,
    })

    Matter.Composite.add(world, ball)
    Matter.Composite.add(
      world,
      Matter.Constraint.create({
        pointA: { x: 300, y: 100 },
        bodyB: ball,
      })
    )

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

export default wreckingBall
