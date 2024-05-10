const remove = {
  title: 'Composite Remove',
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

    let stack: ReturnType<typeof createStack> | null = null
    let lastTimestamp = 0

    const createStack = function () {
      return Matter.Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
        const sides = Math.round(Matter.Common.random(1, 8))

        // round the edges of some bodies
        let chamfer = undefined
        if (sides > 2 && Matter.Common.random() > 0.7) {
          chamfer = {
            radius: 10,
          }
        }

        switch (Math.round(Matter.Common.random(0, 1))) {
          case 0:
            if (Matter.Common.random() < 0.8) {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(25, 50),
                Matter.Common.random(25, 50),
                { chamfer: chamfer }
              )
            } else {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(80, 120),
                Matter.Common.random(25, 30),
                { chamfer: chamfer }
              )
            }
          case 1:
            return Matter.Bodies.polygon(
              x,
              y,
              sides,
              Matter.Common.random(25, 50),
              { chamfer: chamfer }
            )
        }
      })
    }

    // add and remove stacks every few updates
    Matter.Events.on(engine, 'afterUpdate', function (event) {
      // limit rate
      if (stack && event.timestamp - lastTimestamp < 800) {
        return
      }

      lastTimestamp = event.timestamp

      // remove last stack
      if (stack) {
        Matter.Composite.remove(world, stack)
      }

      // create a new stack
      stack = createStack()

      // add the new stack
      Matter.Composite.add(world, stack)
    })

    // add another stack that will not be removed
    Matter.Composite.add(world, createStack())

    Matter.Composite.add(world, [
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

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

export default remove
