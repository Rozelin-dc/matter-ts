const doublePendulum = {
  title: 'Double Pendulum',
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
    const group = Matter.Body.nextGroup(true)
    const length = 200
    const width = 25

    const pendulum = Matter.Composites.stack(
      350,
      160,
      2,
      1,
      -20,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, length, width, {
          collisionFilter: { group: group },
          frictionAir: 0,
          chamfer: { radius: 5 },
          render: {
            fillStyle: 'transparent',
            lineWidth: 1,
          },
        })
      }
    )

    engine.gravity.scale = 0.002

    Matter.Composites.chain(pendulum, 0.45, 0, -0.45, 0, {
      stiffness: 0.9,
      length: 0,
      angularStiffness: 0.7,
      render: {
        strokeStyle: '#4a485b',
      },
    })

    Matter.Composite.add(
      pendulum,
      Matter.Constraint.create({
        bodyB: pendulum.bodies[0],
        pointB: { x: -length * 0.42, y: 0 },
        pointA: {
          x: pendulum.bodies[0].position.x - length * 0.42,
          y: pendulum.bodies[0].position.y,
        },
        stiffness: 0.9,
        length: 0,
        render: {
          strokeStyle: '#4a485b',
        },
      })
    )

    const lowerArm = pendulum.bodies[1]

    Matter.Body.rotate(lowerArm, -Math.PI * 0.3, {
      x: lowerArm.position.x - 100,
      y: lowerArm.position.y,
    })

    Matter.Composite.add(world, pendulum)

    const trail: {
      position: ReturnType<typeof Matter.Vector.create>
      speed: number
    }[] = []

    Matter.Events.on(render, 'afterRender', function () {
      trail.unshift({
        position: Matter.Vector.clone(lowerArm.position),
        speed: lowerArm.speed,
      })

      Matter.Render.startViewTransform(render)
      render.context.globalAlpha = 0.7

      for (let i = 0; i < trail.length; i += 1) {
        const point = trail[i].position
        const speed = trail[i].speed

        const hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170)
        render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)'
        render.context.fillRect(point.x, point.y, 2, 2)
      }

      render.context.globalAlpha = 1
      Matter.Render.endViewTransform(render)

      if (trail.length > 2000) {
        trail.pop()
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

export default doublePendulum
