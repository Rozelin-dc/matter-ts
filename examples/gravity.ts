const gravity = {
  title: 'Reverse Gravity',
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
        showVelocity: true,
        showAngleIndicator: true,
      },
    })

    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    engine.gravity.y = -1

    const stack = Matter.Composites.stack(
      50,
      120,
      11,
      5,
      0,
      0,
      function (x, y) {
        switch (Math.round(Matter.Common.random(0, 1))) {
          case 0:
            if (Matter.Common.random() < 0.8) {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(20, 50),
                Matter.Common.random(20, 50)
              )
            } else {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(80, 120),
                Matter.Common.random(20, 30)
              )
            }
          case 1:
            return Matter.Bodies.polygon(
              x,
              y,
              Math.round(Matter.Common.random(1, 8)),
              Matter.Common.random(20, 50)
            )
        }
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

export default gravity
