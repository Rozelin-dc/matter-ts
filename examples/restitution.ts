const restitution = {
  title: 'Restitution',
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
    const rest = 0.9
    const space = 600 / 5

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(100 + space * 0, 150, 50, 50, {
        restitution: rest,
      }),
      Matter.Bodies.rectangle(100 + space * 1, 150, 50, 50, {
        restitution: rest,
        angle: -Math.PI * 0.15,
      }),
      Matter.Bodies.rectangle(100 + space * 2, 150, 50, 50, {
        restitution: rest,
        angle: -Math.PI * 0.25,
      }),
      Matter.Bodies.circle(100 + space * 3, 150, 25, { restitution: rest }),
      Matter.Bodies.rectangle(100 + space * 5, 150, 180, 20, {
        restitution: rest,
        angle: -Math.PI * 0.5,
      }),
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

export default restitution
