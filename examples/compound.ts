const compound = {
  title: 'Compound Bodies',
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
        showConvexHulls: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    let size = 200
    let x = 200
    let y = 200
    const partA = Matter.Bodies.rectangle(x, y, size, size / 5)
    const partB = Matter.Bodies.rectangle(x, y, size / 5, size, {
      render: partA.render,
    })

    const compoundBodyA = Matter.Body.create({
      parts: [partA, partB],
    })

    size = 150
    x = 400
    y = 300

    const partC = Matter.Bodies.circle(x, y, 30)
    const partD = Matter.Bodies.circle(x + size, y, 30)
    const partE = Matter.Bodies.circle(x + size, y + size, 30)
    const partF = Matter.Bodies.circle(x, y + size, 30)

    const compoundBodyB = Matter.Body.create({
      parts: [partC, partD, partE, partF],
    })

    const constraint = Matter.Constraint.create({
      pointA: { x: 400, y: 100 },
      bodyB: compoundBodyB,
      pointB: { x: 0, y: 0 },
    })

    Matter.Composite.add(world, [
      compoundBodyA,
      compoundBodyB,
      constraint,
      Matter.Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
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

export default compound
