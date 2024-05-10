const bridge = {
  title: 'Bridge',
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
    const group = Matter.Body.nextGroup(true)

    const bridge = Matter.Composites.stack(
      160,
      290,
      15,
      1,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x - 20, y, 53, 20, {
          collisionFilter: { group: group },
          chamfer: { radius: 5 },
          density: 0.005,
          frictionAir: 0.05,
          render: {
            fillStyle: '#060a19',
          },
        })
      }
    )

    Matter.Composites.chain(bridge, 0.3, 0, -0.3, 0, {
      stiffness: 0.99,
      length: 0.0001,
      render: {
        visible: false,
      },
    })

    const stack = Matter.Composites.stack(250, 50, 6, 3, 0, 0, function (x, y) {
      return Matter.Bodies.rectangle(x, y, 50, 50)
    })

    Matter.Composite.add(world, [
      bridge,
      stack,
      Matter.Bodies.rectangle(30, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 },
      }),
      Matter.Bodies.rectangle(770, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 },
      }),
      Matter.Constraint.create({
        pointA: { x: 140, y: 300 },
        bodyB: bridge.bodies[0],
        pointB: { x: -25, y: 0 },
        length: 2,
        stiffness: 0.9,
      }),
      Matter.Constraint.create({
        pointA: { x: 660, y: 300 },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 25, y: 0 },
        length: 2,
        stiffness: 0.9,
      }),
    ])

    // add mouse control
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
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

export default bridge
