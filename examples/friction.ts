const friction = {
  title: 'Friction',
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
        showVelocity: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    Matter.Composite.add(world, [
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(300, 180, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(300, 70, 40, 40, { friction: 0.001 }),
    ])

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(300, 350, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(300, 250, 40, 40, { friction: 0.0005 }),
    ])

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(300, 520, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(300, 430, 40, 40, { friction: 0 }),
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

export default friction
