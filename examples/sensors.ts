const sensors = {
  title: 'Sensors',
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
        wireframes: false,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const colorA = '#f55a3c'
    const colorB = '#f5d259'

    const collider = Matter.Bodies.rectangle(400, 300, 500, 50, {
      isSensor: true,
      isStatic: true,
      render: {
        strokeStyle: colorA,
        fillStyle: 'transparent',
        lineWidth: 1,
      },
    })

    Matter.Composite.add(world, [
      collider,
      Matter.Bodies.rectangle(400, 600, 800, 50, {
        isStatic: true,
        render: {
          fillStyle: '#060a19',
          lineWidth: 0,
        },
      }),
    ])

    Matter.Composite.add(
      world,
      Matter.Bodies.circle(400, 40, 30, {
        render: {
          strokeStyle: colorB,
          fillStyle: 'transparent',
          lineWidth: 1,
        },
      })
    )

    Matter.Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs

      for (let i = 0, j = pairs.length; i != j; ++i) {
        const pair = pairs[i]

        if (pair.bodyA === collider) {
          pair.bodyB.render.strokeStyle = colorA
        } else if (pair.bodyB === collider) {
          pair.bodyA.render.strokeStyle = colorA
        }
      }
    })

    Matter.Events.on(engine, 'collisionEnd', function (event) {
      const pairs = event.pairs

      for (let i = 0, j = pairs.length; i != j; ++i) {
        const pair = pairs[i]

        if (pair.bodyA === collider) {
          pair.bodyB.render.strokeStyle = colorB
        } else if (pair.bodyB === collider) {
          pair.bodyA.render.strokeStyle = colorB
        }
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

export default sensors
