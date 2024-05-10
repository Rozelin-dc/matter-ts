const softBody = {
  title: 'Soft Body',
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
        showAngleIndicator: false,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const particleOptions = {
      friction: 0.05,
      frictionStatic: 0.1,
      render: { visible: true },
    }

    Matter.Composite.add(world, [
      // see softBody function defined later in this file
      createSoftBody(250, 100, 5, 5, 0, 0, true, 18, particleOptions),
      createSoftBody(400, 300, 8, 3, 0, 0, true, 15, particleOptions),
      createSoftBody(250, 400, 4, 4, 0, 0, true, 15, particleOptions),
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
        stiffness: 0.9,
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

export default softBody

/**
 * Creates a simple soft body like object.
 * @method createSoftBody
 * @param xx
 * @param yy
 * @param columns
 * @param rows
 * @param columnGap
 * @param rowGap
 * @param crossBrace
 * @param particleRadius
 * @param particleOptions
 * @param constraintOptions
 * @return A new composite softBody
 */
const createSoftBody = function (
  xx: number,
  yy: number,
  columns: number,
  rows: number,
  columnGap: number,
  rowGap: number,
  crossBrace: boolean,
  particleRadius: number,
  particleOptions: Parameters<typeof Matter.Body.create>[0] = {},
  constraintOptions: Parameters<typeof Matter.Constraint.create>[0] = {}
) {
  particleOptions = Matter.Common.extend({ inertia: Infinity }, particleOptions)
  constraintOptions = Matter.Common.extend(
    { stiffness: 0.2, render: { type: 'line', anchors: false } },
    constraintOptions
  )

  const softBody = Matter.Composites.stack(
    xx,
    yy,
    columns,
    rows,
    columnGap,
    rowGap,
    function (x, y) {
      return Matter.Bodies.circle(x, y, particleRadius, particleOptions)
    }
  )

  Matter.Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions)

  softBody.label = 'Soft Body'

  return softBody
}
