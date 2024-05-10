const manipulation = {
  title: 'Manipulation',
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
        showCollisions: true,
        showConvexHulls: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const bodyA = Matter.Bodies.rectangle(100, 300, 50, 50, {
      isStatic: true,
      render: { fillStyle: '#060a19' },
    })
    const bodyB = Matter.Bodies.rectangle(200, 200, 50, 50)
    const bodyC = Matter.Bodies.rectangle(300, 200, 50, 50)
    const bodyD = Matter.Bodies.rectangle(400, 200, 50, 50)
    const bodyE = Matter.Bodies.rectangle(550, 200, 50, 50)
    const bodyF = Matter.Bodies.rectangle(700, 200, 50, 50)
    const bodyG = Matter.Bodies.circle(400, 100, 25, {
      render: { fillStyle: '#060a19' },
    })

    // add compound body
    const partA = Matter.Bodies.rectangle(600, 200, 120 * 0.8, 50 * 0.8, {
      render: { fillStyle: '#060a19' },
    })
    const partB = Matter.Bodies.rectangle(660, 200, 50 * 0.8, 190 * 0.8, {
      render: { fillStyle: '#060a19' },
    })
    const compound = Matter.Body.create({
      parts: [partA, partB],
      isStatic: true,
    })

    Matter.Body.setPosition(compound, { x: 600, y: 300 })

    Matter.Composite.add(world, [
      bodyA,
      bodyB,
      bodyC,
      bodyD,
      bodyE,
      bodyF,
      bodyG,
      compound,
    ])

    Matter.Composite.add(world, [
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    let lastTime = 0
    let scaleRate = 0.6

    Matter.Events.on(engine, 'beforeUpdate', function (event) {
      const timeScale = (event.delta || 1000 / 60) / 1000

      if (scaleRate > 0) {
        Matter.Body.scale(
          bodyF,
          1 + scaleRate * timeScale,
          1 + scaleRate * timeScale
        )

        // modify bodyE vertices
        bodyE.vertices[0].x -= 0.2 * timeScale
        bodyE.vertices[0].y -= 0.2 * timeScale
        bodyE.vertices[1].x += 0.2 * timeScale
        bodyE.vertices[1].y -= 0.2 * timeScale
        Matter.Body.setVertices(bodyE, bodyE.vertices)
      }

      // make bodyA move up and down
      const py = 300 + 100 * Math.sin(engine.timing.timestamp * 0.002)

      // manual update velocity required for older releases
      if (Matter.version === '0.18.0') {
        Matter.Body.setVelocity(bodyA, { x: 0, y: py - bodyA.position.y })
        Matter.Body.setVelocity(compound, { x: 0, y: py - compound.position.y })
        Matter.Body.setAngularVelocity(compound, 1 * Math.PI * timeScale)
      }

      // move body and update velocity
      Matter.Body.setPosition(bodyA, { x: 100, y: py }, true)

      // move compound body move up and down and update velocity
      Matter.Body.setPosition(compound, { x: 600, y: py }, true)

      // rotate compound body and update angular velocity
      Matter.Body.rotate(compound, 1 * Math.PI * timeScale, undefined, true)

      // after first 0.8 sec (simulation time)
      if (engine.timing.timestamp >= 800) {
        Matter.Body.setStatic(bodyG, true)
      }

      // every 1.5 sec (simulation time)
      if (engine.timing.timestamp - lastTime >= 1500) {
        Matter.Body.setVelocity(bodyB, { x: 0, y: -10 })
        Matter.Body.setAngle(bodyC, -Math.PI * 0.26)
        Matter.Body.setAngularVelocity(bodyD, 0.2)

        // stop scaling
        scaleRate = 0

        // update last time
        lastTime = engine.timing.timestamp
      }
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

export default manipulation
