const events = {
  title: 'Events',
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

    // an example of using composite events on the world
    Matter.Events.on(world, 'afterAdd', function (_event) {
      // do something with event.object
    })

    let lastTime = Matter.Common.now()

    // an example of using beforeUpdate event on an engine
    Matter.Events.on(engine, 'beforeUpdate', function (event) {
      const engine = event.source

      // apply random forces every 5 secs
      if (Matter.Common.now() - lastTime >= 5000) {
        shakeScene(engine)

        // update last time
        lastTime = Matter.Common.now()
      }
    })

    // an example of using collisionStart event on an engine
    Matter.Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs

      // change object colours to show those starting a collision
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i]
        pair.bodyA.render.fillStyle = '#333'
        pair.bodyB.render.fillStyle = '#333'
      }
    })

    // an example of using collisionActive event on an engine
    Matter.Events.on(engine, 'collisionActive', function (event) {
      const pairs = event.pairs

      // change object colours to show those in an active collision (e.g. resting contact)
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i]
        pair.bodyA.render.fillStyle = '#333'
        pair.bodyB.render.fillStyle = '#333'
      }
    })

    // an example of using collisionEnd event on an engine
    Matter.Events.on(engine, 'collisionEnd', function (event) {
      const pairs = event.pairs

      // change object colours to show those ending a collision
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i]

        pair.bodyA.render.fillStyle = '#222'
        pair.bodyB.render.fillStyle = '#222'
      }
    })

    const bodyStyle = { fillStyle: '#222' }

    // scene code
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(400, 0, 800, 50, {
        isStatic: true,
        render: bodyStyle,
      }),
      Matter.Bodies.rectangle(400, 600, 800, 50, {
        isStatic: true,
        render: bodyStyle,
      }),
      Matter.Bodies.rectangle(800, 300, 50, 600, {
        isStatic: true,
        render: bodyStyle,
      }),
      Matter.Bodies.rectangle(0, 300, 50, 600, {
        isStatic: true,
        render: bodyStyle,
      }),
    ])

    const stack = Matter.Composites.stack(
      70,
      100,
      9,
      4,
      50,
      50,
      function (x, y) {
        return Matter.Bodies.circle(x, y, 15, {
          restitution: 1,
          render: bodyStyle,
        })
      }
    )

    Matter.Composite.add(world, stack)

    const shakeScene = function (
      engine: ReturnType<typeof Matter.Engine.create>
    ) {
      const timeScale = 1000 / 60 / engine.timing.lastDelta
      const bodies = Matter.Composite.allBodies(engine.world)

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i]

        if (!body.isStatic && body.position.y >= 500) {
          // scale force for mass and time applied
          const forceMagnitude = 0.03 * body.mass * timeScale

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

    // an example of using mouse events on a mouse
    Matter.Events.on(mouseConstraint, 'mousedown', function (event) {
      const mousePosition = event.mouse.position
      console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y)
      shakeScene(engine)
    })

    // an example of using mouse events on a mouse
    Matter.Events.on(mouseConstraint, 'mouseup', function (event) {
      const mousePosition = event.mouse.position
      console.log('mouseup at ' + mousePosition.x + ' ' + mousePosition.y)
    })

    // an example of using mouse events on a mouse
    Matter.Events.on(mouseConstraint, 'startdrag', function (event) {
      console.log('startdrag', event)
    })

    // an example of using mouse events on a mouse
    Matter.Events.on(mouseConstraint, 'enddrag', function (event) {
      console.log('enddrag', event)
    })

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

export default events
