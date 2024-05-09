const car = {
  title: 'Car',
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

    // see car function defined later in this file
    let scale = 0.9
    Matter.Composite.add(
      world,
      createCar(150, 100, 150 * scale, 30 * scale, 30 * scale)
    )

    scale = 0.8
    Matter.Composite.add(
      world,
      createCar(350, 300, 150 * scale, 30 * scale, 30 * scale)
    )

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(200, 150, 400, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(500, 350, 650, 20, {
        isStatic: true,
        angle: -Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(300, 560, 600, 20, {
        isStatic: true,
        angle: Math.PI * 0.04,
        render: { fillStyle: '#060a19' },
      }),
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

export default car

/**
 * Creates a composite with simple car setup of bodies and constraints.
 * @method createCar
 * @param xx
 * @param yy
 * @param width
 * @param height
 * @param wheelSize
 * @return A new composite car body
 */
const createCar = function (
  xx: number,
  yy: number,
  width: number,
  height: number,
  wheelSize: number
) {
  const group = Matter.Body.nextGroup(true)
  const wheelBase = 20
  const wheelAOffset = -width * 0.5 + wheelBase
  const wheelBOffset = width * 0.5 - wheelBase
  const wheelYOffset = 0

  const car = Matter.Composite.create({ label: 'Car' })
  const body = Matter.Bodies.rectangle(xx, yy, width, height, {
    collisionFilter: {
      group: group,
    },
    chamfer: {
      radius: height * 0.5,
    },
    density: 0.0002,
  })

  const wheelA = Matter.Bodies.circle(
    xx + wheelAOffset,
    yy + wheelYOffset,
    wheelSize,
    {
      collisionFilter: {
        group: group,
      },
      friction: 0.8,
    }
  )

  const wheelB = Matter.Bodies.circle(
    xx + wheelBOffset,
    yy + wheelYOffset,
    wheelSize,
    {
      collisionFilter: {
        group: group,
      },
      friction: 0.8,
    }
  )

  const axelA = Matter.Constraint.create({
    bodyB: body,
    pointB: { x: wheelAOffset, y: wheelYOffset },
    bodyA: wheelA,
    stiffness: 1,
    length: 0,
  })

  const axelB = Matter.Constraint.create({
    bodyB: body,
    pointB: { x: wheelBOffset, y: wheelYOffset },
    bodyA: wheelB,
    stiffness: 1,
    length: 0,
  })

  Matter.Composite.addBody(car, body)
  Matter.Composite.addBody(car, wheelA)
  Matter.Composite.addBody(car, wheelB)
  Matter.Composite.addConstraint(car, axelA)
  Matter.Composite.addConstraint(car, axelB)

  return car
}
