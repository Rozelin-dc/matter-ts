const avalanche = {
  title: 'Avalanche',
  for: '>=1.0.5',
  init: function () {
    try {
      if (typeof MatterWrap !== 'undefined') {
        // either use by name from plugin registry (Browser global)
        Matter.use('matter-wrap')
      } else {
        // or require and use the plugin directly (Node.js, Webpack etc.)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        Matter.use(require('matter-wrap'))
      }
    } catch (e) {
      // could not require the plugin or install needed
    }

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
    const stack = Matter.Composites.stack(20, 20, 20, 5, 0, 0, function (x, y) {
      return Matter.Bodies.circle(x, y, Matter.Common.random(10, 20), {
        friction: 0.00001,
        restitution: 0.5,
        density: 0.001,
      })
    })

    Matter.Composite.add(world, stack)

    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(200, 150, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(500, 350, 700, 20, {
        isStatic: true,
        angle: -Math.PI * 0.06,
        render: { fillStyle: '#060a19' },
      }),
      Matter.Bodies.rectangle(340, 580, 700, 20, {
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
    Matter.Render.lookAt(render, Matter.Composite.allBodies(world))

    // wrapping using matter-wrap plugin
    for (let i = 0; i < stack.bodies.length; i += 1) {
      // @ts-ignore
      stack.bodies[i].plugin.wrap = {
        min: { x: render.bounds.min.x, y: render.bounds.min.y },
        max: { x: render.bounds.max.x, y: render.bounds.max.y },
      }
    }

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

export default avalanche
