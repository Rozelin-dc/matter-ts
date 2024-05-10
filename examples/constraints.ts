const constraints = {
  title: 'Constraints',
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

    // add stiff global constraint
    let body = Matter.Bodies.polygon(150, 200, 5, 30)

    let constraint = Matter.Constraint.create({
      pointA: { x: 150, y: 100 },
      bodyB: body,
      pointB: { x: -10, y: -10 },
    })

    Matter.Composite.add(world, [body, constraint])

    // add soft global constraint
    body = Matter.Bodies.polygon(280, 100, 3, 30)

    constraint = Matter.Constraint.create({
      pointA: { x: 280, y: 120 },
      bodyB: body,
      pointB: { x: -10, y: -7 },
      stiffness: 0.001,
    })

    Matter.Composite.add(world, [body, constraint])

    // add damped soft global constraint
    body = Matter.Bodies.polygon(400, 100, 4, 30)

    constraint = Matter.Constraint.create({
      pointA: { x: 400, y: 120 },
      bodyB: body,
      pointB: { x: -10, y: -10 },
      stiffness: 0.001,
      damping: 0.05,
    })

    Matter.Composite.add(world, [body, constraint])

    // add revolute constraint
    body = Matter.Bodies.rectangle(600, 200, 200, 20)
    let ball = Matter.Bodies.circle(550, 150, 20)

    constraint = Matter.Constraint.create({
      pointA: { x: 600, y: 200 },
      bodyB: body,
      length: 0,
    })

    Matter.Composite.add(world, [body, ball, constraint])

    // add revolute multi-body constraint
    body = Matter.Bodies.rectangle(500, 400, 100, 20, {
      collisionFilter: { group: -1 },
    })
    ball = Matter.Bodies.circle(600, 400, 20, {
      collisionFilter: { group: -1 },
    })

    constraint = Matter.Constraint.create({
      bodyA: body,
      bodyB: ball,
    })

    Matter.Composite.add(world, [body, ball, constraint])

    // add stiff multi-body constraint
    let bodyA = Matter.Bodies.polygon(100, 400, 6, 20)
    let bodyB = Matter.Bodies.polygon(200, 400, 1, 50)

    constraint = Matter.Constraint.create({
      bodyA: bodyA,
      pointA: { x: -10, y: -10 },
      bodyB: bodyB,
      pointB: { x: -10, y: -10 },
    })

    Matter.Composite.add(world, [bodyA, bodyB, constraint])

    // add soft global constraint
    bodyA = Matter.Bodies.polygon(300, 400, 4, 20)
    bodyB = Matter.Bodies.polygon(400, 400, 3, 30)

    constraint = Matter.Constraint.create({
      bodyA: bodyA,
      pointA: { x: -10, y: -10 },
      bodyB: bodyB,
      pointB: { x: -10, y: -7 },
      stiffness: 0.001,
    })

    Matter.Composite.add(world, [bodyA, bodyB, constraint])

    // add damped soft global constraint
    bodyA = Matter.Bodies.polygon(500, 400, 6, 30)
    bodyB = Matter.Bodies.polygon(600, 400, 7, 60)

    constraint = Matter.Constraint.create({
      bodyA: bodyA,
      pointA: { x: -10, y: -10 },
      bodyB: bodyB,
      pointB: { x: -10, y: -10 },
      stiffness: 0.001,
      damping: 0.1,
    })

    Matter.Composite.add(world, [bodyA, bodyB, constraint])

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
        // allow bodies on mouse to rotate
        angularStiffness: 0,
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

export default constraints
