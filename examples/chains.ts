const chains = {
  title: 'Chains',
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
    let group = Matter.Body.nextGroup(true)

    const ropeA = Matter.Composites.stack(
      100,
      50,
      8,
      1,
      10,
      10,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 50, 20, {
          collisionFilter: { group: group },
        })
      }
    )

    Matter.Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
      stiffness: 0.8,
      length: 2,
      render: { type: 'line' },
    })
    Matter.Composite.add(
      ropeA,
      Matter.Constraint.create({
        bodyB: ropeA.bodies[0],
        pointB: { x: -25, y: 0 },
        pointA: {
          x: ropeA.bodies[0].position.x,
          y: ropeA.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    )

    group = Matter.Body.nextGroup(true)

    const ropeB = Matter.Composites.stack(
      350,
      50,
      10,
      1,
      10,
      10,
      function (x, y) {
        return Matter.Bodies.circle(x, y, 20, {
          collisionFilter: { group: group },
        })
      }
    )

    Matter.Composites.chain(ropeB, 0.5, 0, -0.5, 0, {
      stiffness: 0.8,
      length: 2,
      render: { type: 'line' },
    })
    Matter.Composite.add(
      ropeB,
      Matter.Constraint.create({
        bodyB: ropeB.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: {
          x: ropeB.bodies[0].position.x,
          y: ropeB.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    )

    group = Matter.Body.nextGroup(true)

    const ropeC = Matter.Composites.stack(
      600,
      50,
      13,
      1,
      10,
      10,
      function (x, y) {
        return Matter.Bodies.rectangle(x - 20, y, 50, 20, {
          collisionFilter: { group: group },
          chamfer: { radius: 5 },
        })
      }
    )

    Matter.Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 })
    Matter.Composite.add(
      ropeC,
      Matter.Constraint.create({
        bodyB: ropeC.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: {
          x: ropeC.bodies[0].position.x,
          y: ropeC.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    )

    Matter.Composite.add(world, [
      ropeA,
      ropeB,
      ropeC,
      Matter.Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true }),
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
      max: { x: 700, y: 600 },
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

export default chains
