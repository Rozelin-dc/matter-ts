const staticFriction = {
  title: 'Static Friction',
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
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const body = Matter.Bodies.rectangle(400, 500, 200, 60, {
        isStatic: true,
        chamfer: { radius: 10 },
        render: { fillStyle: '#060a19' },
      }),
      size = 50

    const stack = Matter.Composites.stack(
      350,
      470 - 6 * size,
      1,
      6,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, size * 2, size, {
          slop: 0.5,
          friction: 1,
          frictionStatic: Infinity,
        })
      }
    )

    Matter.Composite.add(world, [
      body,
      stack,
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    Matter.Events.on(engine, 'beforeUpdate', function () {
      if (engine.timing.timestamp < 1500) {
        return
      }

      const px = 400 + 100 * Math.sin((engine.timing.timestamp - 1500) * 0.001)

      // manual update velocity required for older releases
      if (Matter.version === '0.18.0') {
        Matter.Body.setVelocity(body, { x: px - body.position.x, y: 0 })
      }

      Matter.Body.setPosition(body, { x: px, y: body.position.y }, true)
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

export default staticFriction
