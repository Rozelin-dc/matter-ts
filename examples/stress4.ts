const stress4 = {
  title: 'Stress 4',
  for: '>=1.0.5',
  init: function () {
    // create engine
    const engine = Matter.Engine.create({
      positionIterations: 25,
      velocityIterations: 35,
    })
    const world = engine.world

    // create renderer
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        showStats: true,
        showPerformance: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create({
      isFixed: true,
    })

    Matter.Runner.run(runner, engine)

    // add bodies
    const stack = function (scale: number, columns: number, rows: number) {
      return Matter.Composites.stack(
        40,
        40,
        columns,
        rows,
        0,
        0,
        function (x, y) {
          const sides = Math.round(Matter.Common.random(1, 8))

          switch (Math.round(Matter.Common.random(0, 1))) {
            case 0:
              if (Matter.Common.random() < 0.8) {
                return Matter.Bodies.rectangle(
                  x,
                  y,
                  Matter.Common.random(25, 50) * scale,
                  Matter.Common.random(25, 50) * scale
                )
              } else {
                return Matter.Bodies.rectangle(
                  x,
                  y,
                  Matter.Common.random(80, 120) * scale,
                  Matter.Common.random(25, 30) * scale
                )
              }
            case 1:
              return Matter.Bodies.polygon(
                x,
                y,
                sides,
                Matter.Common.random(25, 50) * scale
              )
          }
        }
      )
    }

    Matter.Composite.add(world, [
      stack(0.2, 61, 15),
      stack(0.3, 31, 12),
      Matter.Bodies.rectangle(400, 0, 800, 50, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(400, 600, 800, 50, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(800, 300, 50, 600, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(0, 300, 50, 600, {
        isStatic: true,
        render: { visible: false },
      }),
    ])

    // scene animation
    engine.timing.timeScale = 0.9
    engine.gravity.scale = 0.0007

    Matter.Events.on(engine, 'beforeUpdate', function () {
      engine.gravity.x = Math.cos(engine.timing.timestamp * 0.0005)
      engine.gravity.y = Math.sin(engine.timing.timestamp * 0.0005)
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

export default stress4
