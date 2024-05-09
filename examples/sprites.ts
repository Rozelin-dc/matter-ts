const sprites = {
  title: 'Sprites',
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
        wireframes: false,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const offset = 10,
      options = {
        isStatic: true,
      }

    world.bodies = []

    // these static walls will not be rendered in this sprites example, see options
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
      Matter.Bodies.rectangle(
        400,
        600 + offset,
        800.5 + 2 * offset,
        50.5,
        options
      ),
      Matter.Bodies.rectangle(
        800 + offset,
        300,
        50.5,
        600.5 + 2 * offset,
        options
      ),
      Matter.Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options),
    ])

    const stack = Matter.Composites.stack(20, 20, 10, 4, 0, 0, function (x, y) {
      if (Matter.Common.random() > 0.35) {
        return Matter.Bodies.rectangle(x, y, 64, 64, {
          render: {
            strokeStyle: '#ffffff',
            sprite: {
              texture: './img/box.png',
            },
          },
        })
      } else {
        return Matter.Bodies.circle(x, y, 46, {
          density: 0.0005,
          frictionAir: 0.06,
          restitution: 0.3,
          friction: 0.01,
          render: {
            sprite: {
              texture: './img/ball.png',
            },
          },
        })
      }
    })

    Matter.Composite.add(world, stack)

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

export default sprites
