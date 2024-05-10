const views = {
  title: 'Views',
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
        hasBounds: true,
        showAngleIndicator: true,
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

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

    // add bodies
    const stack = Matter.Composites.stack(20, 20, 10, 4, 0, 0, function (x, y) {
      switch (Math.round(Matter.Common.random(0, 1))) {
        case 0:
          if (Matter.Common.random() < 0.8) {
            return Matter.Bodies.rectangle(
              x,
              y,
              Matter.Common.random(20, 50),
              Matter.Common.random(20, 50)
            )
          } else {
            return Matter.Bodies.rectangle(
              x,
              y,
              Matter.Common.random(80, 120),
              Matter.Common.random(20, 30)
            )
          }
        case 1:
          let sides = Math.round(Matter.Common.random(1, 8))
          sides = sides === 3 ? 4 : sides
          return Matter.Bodies.polygon(
            x,
            y,
            sides,
            Matter.Common.random(20, 50)
          )
      }
    })

    Matter.Composite.add(world, [
      stack,
      // walls
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ])

    // get the centre of the viewport
    const viewportCentre = {
      x: render.options.width * 0.5,
      y: render.options.height * 0.5,
    }

    // create limits for the viewport
    const extents = {
      min: { x: -300, y: -300 },
      max: { x: 1100, y: 900 },
    }

    // keep track of current bounds scale (view zoom)
    let boundsScaleTarget = 1
    const boundsScale = {
      x: 1,
      y: 1,
    }

    // use a render event to control our view
    Matter.Events.on(render, 'beforeRender', function () {
      const mouse = mouseConstraint.mouse

      // mouse wheel controls zoom
      let scaleFactor = mouse.wheelDelta * -0.1
      if (scaleFactor !== 0) {
        if (
          (scaleFactor < 0 && boundsScale.x >= 0.6) ||
          (scaleFactor > 0 && boundsScale.x <= 1.4)
        ) {
          boundsScaleTarget += scaleFactor
        }
      }

      // if scale has changed
      if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
        // smoothly tween scale factor
        scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2
        boundsScale.x += scaleFactor
        boundsScale.y += scaleFactor

        // scale the render bounds
        render.bounds.max.x =
          render.bounds.min.x + render.options.width * boundsScale.x
        render.bounds.max.y =
          render.bounds.min.y + render.options.height * boundsScale.y

        // translate so zoom is from centre of view
        const translate = {
          x: render.options.width * scaleFactor * -0.5,
          y: render.options.height * scaleFactor * -0.5,
        }

        Matter.Bounds.translate(render.bounds, translate)

        // update mouse
        Matter.Mouse.setScale(mouse, boundsScale)
        Matter.Mouse.setOffset(mouse, render.bounds.min)
      }

      // get vector from mouse relative to centre of viewport
      const deltaCentre = Matter.Vector.sub(mouse.absolute, viewportCentre)
      const centreDist = Matter.Vector.magnitude(deltaCentre)

      // translate the view if mouse has moved over 50px from the centre of viewport
      if (centreDist > 50) {
        // create a vector to translate the view, allowing the user to control view speed
        const direction = Matter.Vector.normalise(deltaCentre)
        const speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002)

        const translate = Matter.Vector.mult(direction, speed)

        // prevent the view moving outside the extents
        if (render.bounds.min.x + translate.x < extents.min.x) {
          translate.x = extents.min.x - render.bounds.min.x
        }

        if (render.bounds.max.x + translate.x > extents.max.x) {
          translate.x = extents.max.x - render.bounds.max.x
        }

        if (render.bounds.min.y + translate.y < extents.min.y) {
          translate.y = extents.min.y - render.bounds.min.y
        }

        if (render.bounds.max.y + translate.y > extents.max.y) {
          translate.y = extents.max.y - render.bounds.max.y
        }

        // move the view
        Matter.Bounds.translate(render.bounds, translate)

        // we must update the mouse too
        Matter.Mouse.setOffset(mouse, render.bounds.min)
      }
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

export default views
