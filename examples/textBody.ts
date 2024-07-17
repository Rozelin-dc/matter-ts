const textBody = {
  title: 'Text Bodies',
  for: '>=1.1.0',
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
        wireframes: false,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // add bodies
    const stack = Matter.Composites.stack(20, 20, 10, 2, 0, 0, function (x, y) {
      const texts = [
        'Hello',
        'World',
        'Foo',
        'Bar',
        'Fizz',
        'Buzz',
        'line\nbreak\ntext',
        'line\nbreak\ntext\nsample2',
      ]
      const bodyColors = [
        '#115718',
        '#573316',
        '#060887',
        '#89068A',
        '#A1000A'
      ]
      const textColors = [
        '#FFFFFF',
        '#C6E3FF',
        '#90FF9F',
        '#FAA2FF',
      ]
      const aligns: CanvasTextAlign[] = [
        'left',
        'center',
        'right',
        'start',
        'end',
      ]
      return Matter.Bodies.text(x, y, Matter.Common.choose(texts), {
        render: {
          fillStyle: Matter.Common.choose(bodyColors),
          text: {
            color: Matter.Common.choose(textColors),
            align: Matter.Common.choose(aligns),
            paddingX: Matter.Common.random(10, 40),
            paddingY: Matter.Common.random(10, 40),
          },
        },
      })
    })

    Matter.Composite.add(world, stack)

    Matter.Composite.add(world, [
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

export default textBody
