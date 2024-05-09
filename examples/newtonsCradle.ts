const newtonsCradle = {
  // eslint-disable-next-line quotes
  title: "Newton's Cradle",
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

    // see newtonsCradle function defined later in this file
    let cradle = createNewtonsCradle(280, 100, 5, 30, 200)
    Matter.Composite.add(world, cradle)
    Matter.Body.translate(cradle.bodies[0], { x: -180, y: -100 })

    cradle = createNewtonsCradle(280, 380, 7, 20, 140)
    Matter.Composite.add(world, cradle)
    Matter.Body.translate(cradle.bodies[0], { x: -140, y: -100 })

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
      min: { x: 0, y: 50 },
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

export default newtonsCradle

/**
 * Creates a composite with a Newton's Cradle setup of bodies and constraints.
 * @method createNewtonsCradle
 * @param xx
 * @param yy
 * @param number
 * @param size
 * @param length
 * @return A new composite newtonsCradle body
 */
const createNewtonsCradle = function (
  xx: number,
  yy: number,
  number: number,
  size: number,
  length: number
) {
  const newtonsCradle = Matter.Composite.create({ label: 'Newtons Cradle' })

  for (let i = 0; i < number; i++) {
    const separation = 1.9
    const circle = Matter.Bodies.circle(
      xx + i * (size * separation),
      yy + length,
      size,
      {
        inertia: Infinity,
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        slop: size * 0.02,
      }
    )
    const constraint = Matter.Constraint.create({
      pointA: { x: xx + i * (size * separation), y: yy },
      bodyB: circle,
    })

    Matter.Composite.addBody(newtonsCradle, circle)
    Matter.Composite.addConstraint(newtonsCradle, constraint)
  }

  return newtonsCradle
}
