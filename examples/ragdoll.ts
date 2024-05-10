const ragdoll = {
  title: 'Ragdoll',
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
      },
    })
    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // create stairs
    const stairCount = (render.bounds.max.y - render.bounds.min.y) / 50

    const stack = Matter.Composites.stack(
      0,
      0,
      stairCount + 2,
      1,
      0,
      0,
      function (x, y, column) {
        return Matter.Bodies.rectangle(x - 50, y + column * 50, 100, 1000, {
          isStatic: true,
          render: {
            fillStyle: '#060a19',
            strokeStyle: '#ffffff',
            lineWidth: 1,
          },
        })
      }
    )

    // create obstacles
    const obstacles = Matter.Composites.stack(
      300,
      0,
      15,
      3,
      10,
      10,
      function (x, y, _column) {
        const sides = Math.round(Matter.Common.random(1, 8))
        const options = {
          render: {
            fillStyle: Matter.Common.choose([
              '#f19648',
              '#f5d259',
              '#f55a3c',
              '#063e7b',
              '#ececd1',
            ]),
          },
        }

        switch (Math.round(Matter.Common.random(0, 1))) {
          case 0:
            if (Matter.Common.random() < 0.8) {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(25, 50),
                Matter.Common.random(25, 50),
                options
              )
            } else {
              return Matter.Bodies.rectangle(
                x,
                y,
                Matter.Common.random(80, 120),
                Matter.Common.random(25, 30),
                options
              )
            }
          case 1:
            return Matter.Bodies.polygon(
              x,
              y,
              sides,
              Matter.Common.random(25, 50),
              options
            )
        }
      }
    )

    const ragdolls = Matter.Composite.create()

    for (let i = 0; i < 1; i += 1) {
      const ragdoll = createRagdoll(200, -1000 * i, 1.3)

      Matter.Composite.add(ragdolls, ragdoll)
    }

    Matter.Composite.add(world, [stack, obstacles, ragdolls])

    let timeScaleTarget = 1
    let lastTime = Matter.Common.now()

    Matter.Events.on(engine, 'afterUpdate', function (event) {
      const timeScale = (event.delta || 1000 / 60) / 1000

      // tween the timescale for slow-mo
      if (mouse.button === -1) {
        engine.timing.timeScale +=
          (timeScaleTarget - engine.timing.timeScale) * 3 * timeScale
      } else {
        engine.timing.timeScale = 1
      }

      // every 2 sec (real time)
      if (Matter.Common.now() - lastTime >= 2000) {
        // flip the timescale
        if (timeScaleTarget < 1) {
          timeScaleTarget = 1
        } else {
          timeScaleTarget = 0.05
        }

        // update last time
        lastTime = Matter.Common.now()
      }

      for (let i = 0; i < stack.bodies.length; i += 1) {
        const body = stack.bodies[i]

        // animate stairs
        Matter.Body.translate(body, {
          x: -30 * timeScale,
          y: -30 * timeScale,
        })

        // loop stairs when they go off screen
        if (body.position.x < -50) {
          Matter.Body.setPosition(body, {
            x: 50 * (stack.bodies.length - 1),
            y:
              25 +
              render.bounds.max.y +
              (body.bounds.max.y - body.bounds.min.y) * 0.5,
          })

          Matter.Body.setVelocity(body, {
            x: 0,
            y: 0,
          })
        }
      }

      for (let i = 0; i < ragdolls.composites.length; i += 1) {
        const ragdoll = ragdolls.composites[i]
        const bounds = Matter.Composite.bounds(ragdoll)

        // move ragdolls back to the top of the screen
        if (bounds.min.y > render.bounds.max.y + 100) {
          Matter.Composite.translate(ragdoll, {
            x: -bounds.min.x * 0.9,
            y: -render.bounds.max.y - 400,
          })
        }
      }

      for (let i = 0; i < obstacles.bodies.length; i += 1) {
        const body = obstacles.bodies[i]
        const bounds = body.bounds

        // move obstacles back to the top of the screen
        if (bounds.min.y > render.bounds.max.y + 100) {
          Matter.Body.translate(body, {
            x: -bounds.min.x,
            y: -render.bounds.max.y - 300,
          })
        }
      }
    })

    // add mouse control and make the mouse revolute
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.6,
        length: 0,
        angularStiffness: 0,
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

export default ragdoll

const createRagdoll = function (
  x: number,
  y: number,
  scale: number = 1,
  options: Parameters<typeof Matter.Body.create>[0] = {}
) {
  const headOptions = Matter.Common.extend(
    {
      label: 'head',
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      chamfer: {
        radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale],
      },
      render: {
        fillStyle: '#FFBC42',
      },
    },
    options
  )

  const chestOptions = Matter.Common.extend(
    {
      label: 'chest',
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      chamfer: {
        radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale],
      },
      render: {
        fillStyle: '#E0A423',
      },
    },
    options
  )

  const leftArmOptions = Matter.Common.extend(
    {
      label: 'left-arm',
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: '#FFBC42',
      },
    },
    options
  )

  const leftLowerArmOptions = Matter.Common.extend<typeof options>(
    {},
    leftArmOptions,
    {
      render: {
        fillStyle: '#E59B12',
      },
    }
  )

  const rightArmOptions = Matter.Common.extend(
    {
      label: 'right-arm',
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: '#FFBC42',
      },
    },
    options
  )

  const rightLowerArmOptions = Matter.Common.extend<typeof options>(
    {},
    rightArmOptions,
    {
      render: {
        fillStyle: '#E59B12',
      },
    }
  )

  const leftLegOptions = Matter.Common.extend(
    {
      label: 'left-leg',
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: '#FFBC42',
      },
    },
    options
  )

  const leftLowerLegOptions = Matter.Common.extend<typeof options>(
    {},
    leftLegOptions,
    {
      render: {
        fillStyle: '#E59B12',
      },
    }
  )

  const rightLegOptions = Matter.Common.extend(
    {
      label: 'right-leg',
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: '#FFBC42',
      },
    },
    options
  )

  const rightLowerLegOptions = Matter.Common.extend<typeof options>(
    {},
    rightLegOptions,
    {
      render: {
        fillStyle: '#E59B12',
      },
    }
  )

  const head = Matter.Bodies.rectangle(
    x,
    y - 60 * scale,
    34 * scale,
    40 * scale,
    headOptions
  )
  const chest = Matter.Bodies.rectangle(
    x,
    y,
    55 * scale,
    80 * scale,
    chestOptions
  )
  const rightUpperArm = Matter.Bodies.rectangle(
    x + 39 * scale,
    y - 15 * scale,
    20 * scale,
    40 * scale,
    rightArmOptions
  )
  const rightLowerArm = Matter.Bodies.rectangle(
    x + 39 * scale,
    y + 25 * scale,
    20 * scale,
    60 * scale,
    rightLowerArmOptions
  )
  const leftUpperArm = Matter.Bodies.rectangle(
    x - 39 * scale,
    y - 15 * scale,
    20 * scale,
    40 * scale,
    leftArmOptions
  )
  const leftLowerArm = Matter.Bodies.rectangle(
    x - 39 * scale,
    y + 25 * scale,
    20 * scale,
    60 * scale,
    leftLowerArmOptions
  )
  const leftUpperLeg = Matter.Bodies.rectangle(
    x - 20 * scale,
    y + 57 * scale,
    20 * scale,
    40 * scale,
    leftLegOptions
  )
  const leftLowerLeg = Matter.Bodies.rectangle(
    x - 20 * scale,
    y + 97 * scale,
    20 * scale,
    60 * scale,
    leftLowerLegOptions
  )
  const rightUpperLeg = Matter.Bodies.rectangle(
    x + 20 * scale,
    y + 57 * scale,
    20 * scale,
    40 * scale,
    rightLegOptions
  )
  const rightLowerLeg = Matter.Bodies.rectangle(
    x + 20 * scale,
    y + 97 * scale,
    20 * scale,
    60 * scale,
    rightLowerLegOptions
  )

  const chestToRightUpperArm = Matter.Constraint.create({
    bodyA: chest,
    pointA: {
      x: 24 * scale,
      y: -23 * scale,
    },
    pointB: {
      x: 0,
      y: -8 * scale,
    },
    bodyB: rightUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const chestToLeftUpperArm = Matter.Constraint.create({
    bodyA: chest,
    pointA: {
      x: -24 * scale,
      y: -23 * scale,
    },
    pointB: {
      x: 0,
      y: -8 * scale,
    },
    bodyB: leftUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const chestToLeftUpperLeg = Matter.Constraint.create({
    bodyA: chest,
    pointA: {
      x: -10 * scale,
      y: 30 * scale,
    },
    pointB: {
      x: 0,
      y: -10 * scale,
    },
    bodyB: leftUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const chestToRightUpperLeg = Matter.Constraint.create({
    bodyA: chest,
    pointA: {
      x: 10 * scale,
      y: 30 * scale,
    },
    pointB: {
      x: 0,
      y: -10 * scale,
    },
    bodyB: rightUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const upperToLowerRightArm = Matter.Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: 0,
      y: 15 * scale,
    },
    pointB: {
      x: 0,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const upperToLowerLeftArm = Matter.Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: 0,
      y: 15 * scale,
    },
    pointB: {
      x: 0,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const upperToLowerLeftLeg = Matter.Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: 0,
      y: 20 * scale,
    },
    pointB: {
      x: 0,
      y: -20 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const upperToLowerRightLeg = Matter.Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: 0,
      y: 20 * scale,
    },
    pointB: {
      x: 0,
      y: -20 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const headConstraint = Matter.Constraint.create({
    bodyA: head,
    pointA: {
      x: 0,
      y: 25 * scale,
    },
    pointB: {
      x: 0,
      y: -35 * scale,
    },
    bodyB: chest,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  })

  const legToLeg = Matter.Constraint.create({
    bodyA: leftLowerLeg,
    bodyB: rightLowerLeg,
    stiffness: 0.01,
    render: {
      visible: false,
    },
  })

  const person = Matter.Composite.create({
    bodies: [
      chest,
      head,
      leftLowerArm,
      leftUpperArm,
      rightLowerArm,
      rightUpperArm,
      leftLowerLeg,
      rightLowerLeg,
      leftUpperLeg,
      rightUpperLeg,
    ],
    constraints: [
      upperToLowerLeftArm,
      upperToLowerRightArm,
      chestToLeftUpperArm,
      chestToRightUpperArm,
      headConstraint,
      upperToLowerLeftLeg,
      upperToLowerRightLeg,
      chestToLeftUpperLeg,
      chestToRightUpperLeg,
      legToLeg,
    ],
  })

  return person
}
