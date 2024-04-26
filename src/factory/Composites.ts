import Body, { IBody } from '../body/Body'
import Composite, { IComposite } from '../body/Composite'
import Constraint, {
  ConstraintOptions,
  IConstraint,
} from '../constraint/Constraint'
import Common, { DeepPartial } from '../core/Common'
import Bodies from './Bodies'

/**
 * The `Matter.Composites` module contains factory methods for creating composite bodies
 * with commonly used configurations (such as stacks and chains).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Composites {
  /**
   * Create a new composite containing bodies created in the callback in a grid arrangement.
   * This function uses the body's bounds to prevent overlaps.
   * @method stack
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param columns
   * @param rows
   * @param columnGap
   * @param rowGap
   * @param callback
   * @return A new composite containing objects created in the callback
   */
  public static stack(
    x: number,
    y: number,
    columns: number,
    rows: number,
    columnGap: number,
    rowGap: number,
    callback: (
      currentX: number,
      currentY: number,
      column: number,
      row: number,
      lastBody: IBody | undefined,
      i: number
    ) => IBody | void
  ): IComposite {
    const stack = Composite.create({ label: 'Stack' })
    let currentX = x
    let currentY = y
    let lastBody: IBody | undefined
    let i = 0

    for (let row = 0; row < rows; row++) {
      let maxHeight = 0

      for (let column = 0; column < columns; column++) {
        const body = callback(currentX, currentY, column, row, lastBody, i)

        if (body) {
          const bodyHeight = body.bounds.max.y - body.bounds.min.y
          const bodyWidth = body.bounds.max.x - body.bounds.min.x

          if (bodyHeight > maxHeight) {
            maxHeight = bodyHeight
          }

          Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 })

          currentX = body.bounds.max.x + columnGap

          Composite.addBody(stack, body)

          lastBody = body
          i += 1
        } else {
          currentX += columnGap
        }
      }

      currentY += maxHeight + rowGap
      currentX = x
    }

    return stack
  }

  /**
   * Chains all bodies in the given composite together using constraints.
   * @method chain
   * @param composite
   * @param xOffsetA
   * @param yOffsetA
   * @param xOffsetB
   * @param yOffsetB
   * @param options
   * @return A new composite containing objects chained together with constraints
   */
  public static chain(
    composite: IComposite,
    xOffsetA: number,
    yOffsetA: number,
    xOffsetB: number,
    yOffsetB: number,
    options?: Partial<IConstraint>
  ): IComposite {
    const bodies = composite.bodies

    for (let i = 1; i < bodies.length; i++) {
      const bodyA = bodies[i - 1]
      const bodyB = bodies[i]
      const bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y
      const bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x
      const bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y
      const bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x

      const defaults: Partial<IConstraint> = {
        bodyA: bodyA,
        pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
        bodyB: bodyB,
        pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB },
      }

      const constraint = Common.extend(defaults, options)

      Composite.addConstraint(composite, Constraint.create(constraint))
    }

    composite.label += ' Chain'

    return composite
  }

  /**
   * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
   * @method mesh
   * @param composite
   * @param columns
   * @param rows
   * @param crossBrace
   * @param options
   * @return The composite containing objects meshed together with constraints
   */
  public static mesh(
    composite: IComposite,
    columns: number,
    rows: number,
    crossBrace: boolean,
    options?: ConstraintOptions
  ): IComposite {
    const bodies = composite.bodies

    for (let row = 0; row < rows; row++) {
      for (let col = 1; col < columns; col++) {
        const bodyA = bodies[col - 1 + row * columns]
        const bodyB = bodies[col + row * columns]
        Composite.addConstraint(
          composite,
          Constraint.create(
            Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)
          )
        )
      }

      if (row > 0) {
        for (let col = 0; col < columns; col++) {
          const bodyA = bodies[col + (row - 1) * columns]
          const bodyB = bodies[col + row * columns]
          Composite.addConstraint(
            composite,
            Constraint.create(
              Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)
            )
          )

          if (crossBrace && col > 0) {
            const bodyC = bodies[col - 1 + (row - 1) * columns]
            Composite.addConstraint(
              composite,
              Constraint.create(
                Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)
              )
            )
          }

          if (crossBrace && col < columns - 1) {
            const bodyC = bodies[col + 1 + (row - 1) * columns]
            Composite.addConstraint(
              composite,
              Constraint.create(
                Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)
              )
            )
          }
        }
      }
    }

    composite.label += ' Mesh'

    return composite
  }

  /**
   * Create a new composite containing bodies created in the callback in a pyramid arrangement.
   * This function uses the body's bounds to prevent overlaps.
   * @method pyramid
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param columns
   * @param rows
   * @param columnGap
   * @param rowGap
   * @param callback
   * @return A new composite containing objects created in the callback
   */
  public static pyramid(
    x: number,
    y: number,
    columns: number,
    rows: number,
    columnGap: number,
    rowGap: number,
    callback: (
      stackX: number,
      stackY: number,
      column: number,
      row: number,
      lastBody: IBody | undefined,
      i: number
    ) => IBody
  ): IComposite {
    return Composites.stack(
      x,
      y,
      columns,
      rows,
      columnGap,
      rowGap,
      (_stackX, stackY, column, row, lastBody, i) => {
        const actualRows = Math.min(rows, Math.ceil(columns / 2))
        const lastBodyWidth = lastBody
          ? lastBody.bounds.max.x - lastBody.bounds.min.x
          : 0

        if (row > actualRows) {
          return
        }

        // reverse row order
        row = actualRows - row

        const start = row
        const end = columns - 1 - row

        if (column < start || column > end) {
          return
        }

        // retroactively fix the first body's position, since width was unknown
        if (i === 1 && lastBody) {
          Body.translate(lastBody, {
            x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth,
            y: 0,
          })
        }

        const xOffset = lastBody ? column * lastBodyWidth : 0

        return callback(
          x + xOffset + column * columnGap,
          stackY,
          column,
          row,
          lastBody,
          i
        )
      }
    )
  }

  /**
   * This has now moved to the [newtonsCradle example](https://github.com/liabru/matter-js/blob/master/examples/newtonsCradle.js), follow that instead as this function is deprecated here.
   * @deprecated moved to newtonsCradle example
   * @method newtonsCradle
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param number
   * @param size
   * @param length
   * @return A new composite newtonsCradle body
   */
  public static newtonsCradle(
    x: number,
    y: number,
    number: number,
    size: number,
    length: number
  ): IComposite {
    const newtonsCradle = Composite.create({ label: 'Newtons Cradle' })

    for (let i = 0; i < number; i++) {
      const separation = 1.9
      const circle = Bodies.circle(
        x + i * (size * separation),
        y + length,
        size,
        {
          inertia: Infinity,
          restitution: 1,
          friction: 0,
          frictionAir: 0.0001,
          slop: 1,
        }
      )
      const constraint = Constraint.create({
        pointA: { x: x + i * (size * separation), y: y },
        bodyB: circle,
      })

      Composite.addBody(newtonsCradle, circle)
      Composite.addConstraint(newtonsCradle, constraint)
    }

    return newtonsCradle
  }

  /**
   * This has now moved to the [car example](https://github.com/liabru/matter-js/blob/master/examples/car.js), follow that instead as this function is deprecated here.
   * @deprecated moved to car example
   * @method car
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param width
   * @param height
   * @param wheelSize
   * @return A new composite car body
   */
  public static car(
    x: number,
    y: number,
    width: number,
    height: number,
    wheelSize: number
  ): IComposite {
    const group = Body.nextGroup(true)
    const wheelBase = 20
    const wheelAOffset = -width * 0.5 + wheelBase
    const wheelBOffset = width * 0.5 - wheelBase
    const wheelYOffset = 0

    const car = Composite.create({ label: 'Car' })
    const body = Bodies.rectangle(x, y, width, height, {
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
      },
      density: 0.0002,
    })

    const wheelA = Bodies.circle(
      x + wheelAOffset,
      y + wheelYOffset,
      wheelSize,
      {
        collisionFilter: {
          group: group,
        },
        friction: 0.8,
      }
    )

    const wheelB = Bodies.circle(
      x + wheelBOffset,
      y + wheelYOffset,
      wheelSize,
      {
        collisionFilter: {
          group: group,
        },
        friction: 0.8,
      }
    )

    const axelA = Constraint.create({
      bodyB: body,
      pointB: { x: wheelAOffset, y: wheelYOffset },
      bodyA: wheelA,
      stiffness: 1,
      length: 0,
    })

    const axelB = Constraint.create({
      bodyB: body,
      pointB: { x: wheelBOffset, y: wheelYOffset },
      bodyA: wheelB,
      stiffness: 1,
      length: 0,
    })

    Composite.addBody(car, body)
    Composite.addBody(car, wheelA)
    Composite.addBody(car, wheelB)
    Composite.addConstraint(car, axelA)
    Composite.addConstraint(car, axelB)

    return car
  }

  /**
   * This has now moved to the [softBody example](https://github.com/liabru/matter-js/blob/master/examples/softBody.js)
   * and the [cloth example](https://github.com/liabru/matter-js/blob/master/examples/cloth.js), follow those instead as this function is deprecated here.
   * @deprecated moved to softBody and cloth examples
   * @method softBody
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param columns
   * @param rows
   * @param columnGap
   * @param rowGap
   * @param crossBrace
   * @param particleRadius
   * @param particleOptions
   * @param constraintOptions
   * @return A new composite softBody
   */
  public static softBody(
    x: number,
    y: number,
    columns: number,
    rows: number,
    columnGap: number,
    rowGap: number,
    crossBrace: boolean,
    particleRadius: number,
    particleOptions: DeepPartial<IBody>,
    constraintOptions: ConstraintOptions
  ): IComposite {
    particleOptions = Common.extend({ inertia: Infinity }, particleOptions)
    constraintOptions = Common.extend(
      { stiffness: 0.2, render: { type: 'line', anchors: false } },
      constraintOptions
    )

    const softBody = Composites.stack(
      x,
      y,
      columns,
      rows,
      columnGap,
      rowGap,
      (stackX, stackY) => {
        return Bodies.circle(stackX, stackY, particleRadius, particleOptions)
      }
    )

    Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions)

    softBody.label = 'Soft Body'

    return softBody
  }
}

(() => {
  Common.deprecated(
    Composites as Object as Record<string, Function>,
    'newtonsCradle',
    'Composites.newtonsCradle ➤ moved to newtonsCradle example'
  )
  Common.deprecated(
    Composites as Object as Record<string, Function>,
    'car',
    'Composites.car ➤ moved to car example'
  )
  Common.deprecated(
    Composites as Object as Record<string, Function>,
    'softBody',
    'Composites.softBody ➤ moved to softBody and cloth examples'
  )
})()
