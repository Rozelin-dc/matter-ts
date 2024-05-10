const cloth = {
  title: 'Cloth',
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
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // see cloth function defined later in this file
    const cloth = createCloth(200, 200, 20, 12, 5, 5, false, 8)

    for (let i = 0; i < 20; i++) {
      cloth.bodies[i].isStatic = true
    }

    Matter.Composite.add(world, [
      cloth,
      Matter.Bodies.circle(300, 500, 80, {
        isStatic: true,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(500, 480, 80, 80, {
        isStatic: true,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(400, 609, 800, 50, { isStatic: true }),
    ])

    // add mouse control
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.98,
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

export default cloth

/**
 * Creates a simple cloth like object.
 * @method createCloth
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
 * @return A new composite cloth
 */
const createCloth = function (
  xx: number,
  yy: number,
  columns: number,
  rows: number,
  columnGap: number,
  rowGap: number,
  crossBrace: boolean,
  particleRadius: number,
  particleOptions?: Parameters<typeof Matter.Bodies.circle>[3],
  constraintOptions?: Parameters<typeof Matter.Composites.mesh>[4]
) {
  const group = Matter.Body.nextGroup(true)
  particleOptions = Matter.Common.extend(
    {
      inertia: Infinity,
      friction: 0.00001,
      collisionFilter: { group: group },
      render: { visible: false },
    },
    particleOptions
  )
  constraintOptions = Matter.Common.extend(
    { stiffness: 0.06, render: { type: 'line', anchors: false } },
    constraintOptions
  )

  const cloth = Matter.Composites.stack(
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

  Matter.Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions)

  cloth.label = 'Cloth Body'

  return cloth
}
