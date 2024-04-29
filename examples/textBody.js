var Example = Example || {}

Example.textBody = function () {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies

  // create engine
  var engine = Engine.create(),
    world = engine.world

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      showAngleIndicator: true,
    },
  })

  Render.run(render)

  // create runner
  var runner = Runner.create()
  Runner.run(runner, engine)

  // add bodies
  var stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
    var texts = [
      'Hello',
      'World',
      'Foo',
      'Bar',
      'Fizz',
      'Buzz',
      'line\nbreak\ntext',
      'line\nbreak\ntext\nsample2',
    ]
    var colors = [
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FF00FF',
      '#00FFFF',
      '#FFFF00',
    ]
    var aligns = ['left', 'center', 'right', 'start', 'end']
    return Bodies.text(x, y, Common.choose(texts), {
      render: {
        text: { color: Common.choose(colors), align: Common.choose(aligns) },
      },
    })
  })

  Composite.add(world, stack)

  Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
  ])

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })

  Composite.add(world, mouseConstraint)

  // keep the mouse in sync with rendering
  render.mouse = mouse

  // fit the render viewport to the scene
  Render.lookAt(render, {
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
}

Example.textBody.title = 'Text Bodies'
Example.textBody.for = '>=1.1.0'

if (typeof module !== 'undefined') {
  module.exports = Example.textBody
}
