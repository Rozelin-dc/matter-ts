const raycasting = {
  title: 'Raycasting',
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
    const stack = Matter.Composites.stack(20, 20, 12, 4, 0, 0, function (x, y) {
      switch (Math.round(Matter.Common.random(0, 1))) {
        case 0:
          if (Matter.Common.random() < 0.8) {
            return Matter.Bodies.rectangle(
              x,
              y,
              Matter.Common.random(20, 50),
              Matter.Common.random(20, 50)
            )
          } else {
            return Matter.Bodies.rectangle(
              x,
              y,
              Matter.Common.random(80, 120),
              Matter.Common.random(20, 30)
            )
          }
        case 1:
          let sides = Math.round(Matter.Common.random(1, 8))
          sides = sides === 3 ? 4 : sides
          return Matter.Bodies.polygon(
            x,
            y,
            sides,
            Matter.Common.random(20, 50)
          )
      }
    })

    // for testing raycasting on concave bodies
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Matter.Common.setDecomp(require('poly-decomp'))

    const star = Matter.Vertices.fromPath(
        '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'
      ),
      concave = Matter.Bodies.fromVertices(200, 200, star)

    Matter.Composite.add(world, [
      stack,
      concave,
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    let collisions: ReturnType<typeof Matter.Collision.create>[] = []
    const startPoint = { x: 400, y: 100 }

    Matter.Events.on(engine, 'afterUpdate', function () {
      const mouse = mouseConstraint.mouse
      const bodies = Matter.Composite.allBodies(engine.world)
      const endPoint = mouse.position || { x: 100, y: 600 }

      collisions = Matter.Query.ray(bodies, startPoint, endPoint)
    })

    Matter.Events.on(render, 'afterRender', function () {
      const mouse = mouseConstraint.mouse
      const context = render.context
      const endPoint = mouse.position || { x: 100, y: 600 }

      Matter.Render.startViewTransform(render)

      context.beginPath()
      context.moveTo(startPoint.x, startPoint.y)
      context.lineTo(endPoint.x, endPoint.y)
      if (collisions.length > 0) {
        context.strokeStyle = '#fff'
      } else {
        context.strokeStyle = '#555'
      }
      context.lineWidth = 0.5
      context.stroke()

      for (let i = 0; i < collisions.length; i++) {
        const collision = collisions[i]
        context.rect(
          collision.bodyA.position.x - 4.5,
          collision.bodyA.position.y - 4.5,
          8,
          8
        )
      }

      context.fillStyle = 'rgba(255,165,0,0.7)'
      context.fill()

      Matter.Render.endViewTransform(render)
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

export default raycasting
