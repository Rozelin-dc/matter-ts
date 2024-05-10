const catapult = {
  title: 'Catapult',
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
        showCollisions: true,
        showVelocity: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const group = Matter.Body.nextGroup(true)

    const stack = Matter.Composites.stack(
      250,
      255,
      1,
      6,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 30, 30)
      }
    )

    const catapult = Matter.Bodies.rectangle(400, 520, 320, 20, {
      collisionFilter: { group: group },
    })

    Matter.Composite.add(world, [
      stack,
      catapult,
      Matter.Bodies.rectangle(400, 600, 800, 50.5, {
        isStatic: true,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(250, 555, 20, 50, {
        isStatic: true,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(400, 535, 20, 80, {
        isStatic: true,
        collisionFilter: { group: group },
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.circle(560, 100, 50, { density: 0.005 }),
      Matter.Constraint.create({
        bodyA: catapult,
        pointB: Matter.Vector.clone(catapult.position),
        stiffness: 1,
        length: 0,
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

export default catapult
