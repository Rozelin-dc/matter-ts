const rounded = {
  title: 'Rounded Corners (Chamfering)',
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
        showAxes: true,
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

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(200, 200, 100, 100, {
        chamfer: { radius: 20 },
      }),

      Matter.Bodies.rectangle(300, 200, 100, 100, {
        chamfer: { radius: [90, 0, 0, 0] },
      }),

      Matter.Bodies.rectangle(400, 200, 200, 200, {
        chamfer: { radius: [150, 20, 40, 20] },
      }),

      Matter.Bodies.rectangle(200, 200, 200, 200, {
        chamfer: { radius: [150, 20, 150, 20] },
      }),

      Matter.Bodies.rectangle(300, 200, 200, 50, {
        chamfer: { radius: [25, 25, 0, 0] },
      }),

      Matter.Bodies.polygon(200, 100, 8, 80, {
        chamfer: { radius: 30 },
      }),

      Matter.Bodies.polygon(300, 100, 5, 80, {
        chamfer: { radius: [10, 40, 20, 40, 10] },
      }),

      Matter.Bodies.polygon(400, 200, 3, 50, {
        chamfer: { radius: [20, 0, 20] },
      }),
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

export default rounded
