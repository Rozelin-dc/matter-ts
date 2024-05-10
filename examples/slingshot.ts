const slingshot = {
  title: 'Slingshot',
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
    const ground = Matter.Bodies.rectangle(395, 600, 815, 50, {
      isStatic: true,
      render: { fillStyle: '#060a19' },
    })
    const rockOptions = { density: 0.004 }
    let rock = Matter.Bodies.polygon(170, 450, 8, 20, rockOptions)
    const anchor = { x: 170, y: 450 }
    const elastic = Matter.Constraint.create({
      pointA: anchor,
      bodyB: rock,
      length: 0.01,
      damping: 0.01,
      stiffness: 0.05,
    })

    const pyramid = Matter.Composites.pyramid(
      500,
      300,
      9,
      10,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 25, 40)
      }
    )

    const ground2 = Matter.Bodies.rectangle(610, 250, 200, 20, {
      isStatic: true,
      render: { fillStyle: '#060a19' },
    })

    const pyramid2 = Matter.Composites.pyramid(
      550,
      0,
      5,
      10,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 25, 40)
      }
    )

    Matter.Composite.add(engine.world, [
      ground,
      pyramid,
      ground2,
      pyramid2,
      rock,
      elastic,
    ])

    Matter.Events.on(engine, 'afterUpdate', function () {
      if (
        mouseConstraint.mouse.button === -1 &&
        (rock.position.x > 190 || rock.position.y < 430)
      ) {
        // Limit maximum speed of current rock.
        if (Matter.Body.getSpeed(rock) > 45) {
          Matter.Body.setSpeed(rock, 45)
        }

        // Release current rock and add a new one.
        rock = Matter.Bodies.polygon(170, 450, 7, 20, rockOptions)
        Matter.Composite.add(engine.world, rock)
        elastic.bodyB = rock
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

export default slingshot
