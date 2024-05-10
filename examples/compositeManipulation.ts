const compositeManipulation = {
  title: 'Composite Manipulation',
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
    Matter.Composite.add(world, [
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    const stack = Matter.Composites.stack(
      200,
      200,
      4,
      4,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 40, 40)
      }
    )

    Matter.Composite.add(world, stack)

    engine.gravity.y = 0

    Matter.Events.on(engine, 'afterUpdate', function (event) {
      const time = engine.timing.timestamp,
        timeScale = (event.delta || 1000 / 60) / 1000

      Matter.Composite.translate(stack, {
        x: Math.sin(time * 0.001) * 10 * timeScale,
        y: 0,
      })

      Matter.Composite.rotate(
        stack,
        Math.sin(time * 0.001) * 0.75 * timeScale,
        {
          x: 300,
          y: 300,
        }
      )

      const scale = 1 + Math.sin(time * 0.001) * 0.75 * timeScale

      Matter.Composite.scale(stack, scale, scale, {
        x: 300,
        y: 300,
      })
    })

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

export default compositeManipulation
