const timescale = {
  title: 'Time Scaling',
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
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    const explosion = function (
      engine: ReturnType<typeof Matter.Engine.create>,
      delta: number
    ) {
      const timeScale = 1000 / 60 / delta
      const bodies = Matter.Composite.allBodies(engine.world)

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i]

        if (!body.isStatic && body.position.y >= 500) {
          // scale force for mass and time applied
          const forceMagnitude = 0.05 * body.mass * timeScale

          // apply the force over a single update
          Matter.Body.applyForce(body, body.position, {
            x:
              (forceMagnitude + Matter.Common.random() * forceMagnitude) *
              Matter.Common.choose([1, -1]),
            y: -forceMagnitude + Matter.Common.random() * -forceMagnitude,
          })
        }
      }
    }

    let timeScaleTarget = 1
    let lastTime = Matter.Common.now()

    Matter.Events.on(engine, 'afterUpdate', function (event) {
      const timeScale = (event.delta || 1000 / 60) / 1000

      // tween the timescale for bullet time slow-mo
      engine.timing.timeScale +=
        (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale

      // every 2 sec (real time)
      if (Matter.Common.now() - lastTime >= 2000) {
        // flip the timescale
        if (timeScaleTarget < 1) {
          timeScaleTarget = 1
        } else {
          timeScaleTarget = 0
        }

        // create some random forces
        explosion(engine, event.delta)

        // update last time
        lastTime = Matter.Common.now()
      }
    })

    const bodyOptions = {
      frictionAir: 0,
      friction: 0.0001,
      restitution: 0.8,
    }

    Matter.Composite.add(
      world,
      Matter.Composites.stack(20, 100, 15, 3, 20, 40, function (x, y) {
        return Matter.Bodies.circle(
          x,
          y,
          Matter.Common.random(10, 20),
          bodyOptions
        )
      })
    )

    Matter.Composite.add(
      world,
      Matter.Composites.stack(50, 50, 8, 3, 0, 0, function (x, y) {
        switch (Math.round(Matter.Common.random(0, 1))) {
          case 0:
            if (Matter.Common.random() < 0.8) {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(20, 50),
                Matter.Common.random(20, 50),
                bodyOptions
              )
            } else {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(80, 120),
                Matter.Common.random(20, 30),
                bodyOptions
              )
            }
          case 1:
            return Matter.Bodies.polygon(
              x,
              y,
              Math.round(Matter.Common.random(4, 8)),
              Matter.Common.random(20, 50),
              bodyOptions
            )
        }
      })
    )

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

export default timescale
