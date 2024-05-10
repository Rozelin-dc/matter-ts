const collisionFiltering = {
  title: 'Collision Filtering',
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
        wireframes: false,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // define our categories (as bit fields, there are up to 32 available)
    const defaultCategory = 0x0001
    const redCategory = 0x0002
    const greenCategory = 0x0004
    const blueCategory = 0x0008

    const colorA = '#f55a3c'
    const colorB = '#063e7b'
    const colorC = '#f5d259'

    // add floor
    Matter.Composite.add(
      world,
      Matter.Bodies.rectangle(400, 600, 900, 50, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          lineWidth: 1,
        },
      })
    )

    // create a stack with varying body categories (but these bodies can all collide with each other)
    Matter.Composite.add(
      world,
      Matter.Composites.stack(
        275,
        100,
        5,
        9,
        10,
        10,
        function (x, y, _column, row) {
          let category = redCategory
          let color = colorA

          if (row > 5) {
            category = blueCategory
            color = colorB
          } else if (row > 2) {
            category = greenCategory
            color = colorC
          }

          return Matter.Bodies.circle(x, y, 20, {
            collisionFilter: {
              category: category,
            },
            render: {
              strokeStyle: color,
              fillStyle: 'transparent',
              lineWidth: 1,
            },
          })
        }
      )
    )

    // this body will only collide with the walls and the green bodies
    Matter.Composite.add(
      world,
      Matter.Bodies.circle(310, 40, 30, {
        collisionFilter: {
          mask: defaultCategory | greenCategory,
        },
        render: {
          fillStyle: colorC,
        },
      })
    )

    // this body will only collide with the walls and the red bodies
    Matter.Composite.add(
      world,
      Matter.Bodies.circle(400, 40, 30, {
        collisionFilter: {
          mask: defaultCategory | redCategory,
        },
        render: {
          fillStyle: colorA,
        },
      })
    )

    // this body will only collide with the walls and the blue bodies
    Matter.Composite.add(
      world,
      Matter.Bodies.circle(480, 40, 30, {
        collisionFilter: {
          mask: defaultCategory | blueCategory,
        },
        render: {
          fillStyle: colorB,
        },
      })
    )

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

    // red category objects should not be draggable with the mouse
    mouseConstraint.collisionFilter.mask =
      defaultCategory | blueCategory | greenCategory

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

export default collisionFiltering
