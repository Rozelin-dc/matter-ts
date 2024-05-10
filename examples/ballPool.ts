const ballPool = {
  title: 'Ball Pool',
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
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(400, 600, 1200, 50.5, {
        isStatic: true,
        render: { fillStyle: '#060a19' },
      }),
    ])

    const stack = Matter.Composites.stack(
      100,
      0,
      10,
      8,
      10,
      10,
      function (x, y) {
        return Matter.Bodies.circle(x, y, Matter.Common.random(15, 30), {
          restitution: 0.6,
          friction: 0.1,
        })
      }
    )

    Matter.Composite.add(world, [
      stack,
      Matter.Bodies.polygon(200, 460, 3, 60),
      Matter.Bodies.polygon(400, 460, 5, 60),
      Matter.Bodies.rectangle(600, 460, 80, 80),
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

    // wrapping using matter-wrap plugin
    const allBodies = Matter.Composite.allBodies(world)

    for (let i = 0; i < allBodies.length; i += 1) {
      // @ts-ignore
      allBodies[i].plugin.wrap = {
        min: { x: render.bounds.min.x - 100, y: render.bounds.min.y },
        max: { x: render.bounds.max.x + 100, y: render.bounds.max.y },
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

export default ballPool
