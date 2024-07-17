import Body, { IBody, IBodyTextRender } from '../body/Body'
import Common, { DeepPartial } from '../core/Common'
import Bounds from '../geometry/Bounds'
import Vector, { IVector } from '../geometry/Vector'
import Vertices from '../geometry/Vertices'

/**
 * The `Matter.Bodies` module contains factory methods for creating rigid body models
 * with commonly used body configurations (such as rectangles, circles and other polygons).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Bodies {
  /**
   * Creates a new rigid body model with a rectangle hull.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method rectangle
   * @param x
   * @param y
   * @param width
   * @param height
   * @param options
   * @return A new rectangle body
   */
  public static rectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options: DeepPartial<IBody> = {}
  ): IBody {
    const rectangle = {
      label: 'Rectangle Body',
      position: { x: x, y: y },
      vertices: Vertices.fromPath(
        'L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height
      ),
    }

    if (options.chamfer) {
      const chamfer = options.chamfer
      rectangle.vertices = Vertices.chamfer(
        rectangle.vertices,
        chamfer.radius,
        chamfer.quality,
        chamfer.qualityMin,
        chamfer.qualityMax
      )
      delete options.chamfer
    }

    return Body.create(
      Common.extend<DeepPartial<IBody>>({}, rectangle, options)
    )
  }

  /**
   * Creates a new rigid body model with a trapezoid hull.
   * The `slope` is parameterised as a fraction of `width` and must be < 1 to form a valid trapezoid.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method trapezoid
   * @param x
   * @param y
   * @param width
   * @param height
   * @param slope Must be a number < 1.
   * @param options
   * @return A new trapezoid body
   */
  public static trapezoid(
    x: number,
    y: number,
    width: number,
    height: number,
    slope: number,
    options: DeepPartial<IBody> = {}
  ): IBody {
    if (slope >= 1) {
      Common.warn('Bodies.trapezoid: slope parameter must be < 1.')
    }

    slope *= 0.5
    const roof = (1 - slope * 2) * width

    const x1 = width * slope
    const x2 = x1 + roof
    const x3 = x2 + x1
    let verticesPath: string

    if (slope < 0.5) {
      verticesPath =
        'L 0 0 L ' +
        x1 +
        ' ' +
        -height +
        ' L ' +
        x2 +
        ' ' +
        -height +
        ' L ' +
        x3 +
        ' 0'
    } else {
      verticesPath = 'L 0 0 L ' + x2 + ' ' + -height + ' L ' + x3 + ' 0'
    }

    const trapezoid = {
      label: 'Trapezoid Body',
      position: { x: x, y: y },
      vertices: Vertices.fromPath(verticesPath),
    }

    if (options.chamfer) {
      const chamfer = options.chamfer
      trapezoid.vertices = Vertices.chamfer(
        trapezoid.vertices,
        chamfer.radius,
        chamfer.quality,
        chamfer.qualityMin,
        chamfer.qualityMax
      )
      delete options.chamfer
    }

    return Body.create(
      Common.extend<DeepPartial<IBody>>({}, trapezoid, options)
    )
  }

  /**
   * Creates a new rigid body model with a circle hull.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method circle
   * @param x
   * @param y
   * @param radius
   * @param options
   * @param maxSides
   * @return A new circle body
   */
  public static circle(
    x: number,
    y: number,
    radius: number,
    options: DeepPartial<IBody> = {},
    maxSides: number = 25
  ): IBody {
    const circle = {
      label: 'Circle Body',
      circleRadius: radius,
    }

    // approximate circles with polygons until true circles implemented in SAT
    let sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)))

    // optimisation: always use even number of sides (half the number of unique axes)
    if (sides % 2 === 1) {
      sides += 1
    }

    return Bodies.polygon(
      x,
      y,
      sides,
      radius,
      Common.extend<DeepPartial<IBody>>({}, circle, options)
    )
  }

  /**
   * Creates a new rigid body model with a regular polygon hull with the given number of sides.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method polygon
   * @param x
   * @param y
   * @param sides
   * @param radius
   * @param options
   * @return A new regular polygon body
   */
  public static polygon(
    x: number,
    y: number,
    sides: number,
    radius: number,
    options: DeepPartial<IBody> = {}
  ): IBody {
    if (sides < 3) {
      return Bodies.circle(x, y, radius, options)
    }

    const theta = (2 * Math.PI) / sides
    let path = ''
    const offset = theta * 0.5

    for (let i = 0; i < sides; i += 1) {
      const angle = offset + i * theta
      const xx = Math.cos(angle) * radius
      const yy = Math.sin(angle) * radius

      path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' '
    }

    const polygon = {
      label: 'Polygon Body',
      position: { x: x, y: y },
      vertices: Vertices.fromPath(path),
    }

    if (options.chamfer) {
      const chamfer = options.chamfer
      polygon.vertices = Vertices.chamfer(
        polygon.vertices,
        chamfer.radius,
        chamfer.quality,
        chamfer.qualityMin,
        chamfer.qualityMax
      )
      delete options.chamfer
    }

    return Body.create(Common.extend<DeepPartial<IBody>>({}, polygon, options))
  }

  /**
   * Creates a new rectangle body that fits the letters of the given text.
   * @method text
   * @param x
   * @param y
   * @param text
   * @param options
   * @return A new rectangle body with the given text
   */
  public static text(
    x: number,
    y: number,
    text: string,
    options: DeepPartial<Omit<IBody, 'render'>> & {
      render?: DeepPartial<IBodyTextRender>
    } = {}
  ): IBody {
    const defaultTextRender: IBodyTextRender['text'] = {
      content: text,
      font: 'Arial',
      align: 'center',
      color: '#000000',
      size: 16,
      isBold: false,
      isStroke: false,
      paddingX: 0,
      paddingY: 0,
    }
    const textRender = Common.extend(defaultTextRender, options.render?.text)
    textRender.content = text

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to create canvas context')
    }
    context.font = `${textRender.isBold ? 'bold' : ''} ${textRender.size}px ${textRender.font}`
    context.textAlign = textRender.align
    const textWidth =
      Bodies.measureMaxTextWidth(text, textRender.font, textRender.size) +
      textRender.paddingX * 2
    const textHeight =
      text.split('\n').length * textRender.size + textRender.paddingY * 2

    return Bodies.rectangle(x, y, textWidth, textHeight, {
      ...options,
      render: { ...options.render, text: textRender },
    })
  }

  /**
   * Measure max text width for a given font.
   * @method measureMaxTextWidth
   * @param text
   * @param font
   * @param size
   */
  public static measureMaxTextWidth(
    text: string,
    font: string,
    size: number
  ): number {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to create canvas context')
    }
    context.font = `${size}px ${font}`
    const lines = text.split('\n')
    let maxWidth = 0
    for (const line of lines) {
      const width = context.measureText(line).width
      if (width > maxWidth) {
        maxWidth = width
      }
    }
    return maxWidth
  }

  /**
   * Utility to create a compound body based on set(s) of vertices.
   *
   * _Note:_ To optionally enable automatic concave vertices decomposition the [poly-decomp](https://github.com/schteppe/poly-decomp.js)
   * package must be first installed and provided see `Common.setDecomp`, otherwise the convex hull of each vertex set will be used.
   *
   * The resulting vertices are reorientated about their centre of mass,
   * and offset such that `body.position` corresponds to this point.
   *
   * The resulting offset may be found if needed by subtracting `body.bounds` from the original input bounds.
   * To later move the centre of mass see `Body.setCentre`.
   *
   * Note that automatic conconcave decomposition results are not always optimal.
   * For best results, simplify the input vertices as much as possible first.
   * By default this function applies some addtional simplification to help.
   *
   * Some outputs may also require further manual processing afterwards to be robust.
   * In particular some parts may need to be overlapped to avoid collision gaps.
   * Thin parts and sharp points should be avoided or removed where possible.
   *
   * The options parameter object specifies any `Matter.Body` properties you wish to override the defaults.
   *
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method fromVertices
   * @param x
   * @param y
   * @param vertexSets One or more arrays of vertex points e.g. `[[{ x: 0, y: 0 }...], ...]`.
   * @param options The body options.
   * @param flagInternal Optionally marks internal edges with `isInternal`.
   * @param removeCollinear Threshold when simplifying vertices along the same edge.
   * @param minimumArea Threshold when removing small parts.
   * @param removeDuplicatePoints Threshold when simplifying nearby vertices.
   */
  public static fromVertices(
    x: number,
    y: number,
    vertexSets: IVector[] | IVector[][],
    options: DeepPartial<IBody> = {},
    flagInternal: boolean = false,
    removeCollinear: number | false = 0.01,
    minimumArea: number = 10,
    removeDuplicatePoints: number | false = 0.01
  ): IBody {
    const decomp = Common.getDecomp()
    // check decomp is as expected
    const canDecomp = Boolean(decomp && decomp.quickDecomp)

    const parts: { position: IVector; vertices: IVector[] }[] = []

    // ensure vertexSets is an array of arrays
    if (!Common.isArray(vertexSets[0])) {
      vertexSets = [vertexSets as IVector[]]
    }

    for (let v = 0; v < vertexSets.length; v += 1) {
      let vertices = (vertexSets as IVector[][])[v]
      const isConvex = Vertices.isConvex(vertices)
      const isConcave = !isConvex

      if (isConcave && !canDecomp) {
        Common.warnOnce(
          // eslint-disable-next-line quotes
          "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
        )
      }

      if (isConvex || !canDecomp) {
        if (isConvex) {
          vertices = Vertices.clockwiseSort(vertices)
        } else {
          // fallback to convex hull when decomposition is not possible
          vertices = Vertices.hull(vertices)
        }

        parts.push({
          position: { x: x, y: y },
          vertices: vertices,
        })
      } else {
        // initialise a decomposition
        const concave = vertices.map(function (vertex) {
          return [vertex.x, vertex.y]
        })

        // vertices are concave and simple, we can decompose into parts
        decomp.makeCCW(concave)
        if (removeCollinear !== false) {
          decomp.removeCollinearPoints(concave, removeCollinear)
        }
        if (removeDuplicatePoints !== false && decomp.removeDuplicatePoints) {
          decomp.removeDuplicatePoints(concave, removeDuplicatePoints)
        }

        // use the quick decomposition algorithm (Bayazit)
        const decomposed = decomp.quickDecomp(concave)

        // for each decomposed chunk
        for (let i = 0; i < decomposed.length; i++) {
          const chunk: [number, number][] = decomposed[i]

          // convert vertices into the correct structure
          const chunkVertices: IVector[] = chunk.map((vertices) => {
            return {
              x: vertices[0],
              y: vertices[1],
            }
          })

          // skip small chunks
          if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea) {
            continue
          }

          // create a compound part
          parts.push({
            position: Vertices.centre(chunkVertices),
            vertices: chunkVertices,
          })
        }
      }
    }

    const bodies: IBody[] = []
    // create body parts
    for (let i = 0; i < parts.length; i++) {
      bodies.push(Body.create(Common.extend(parts[i], options)))
    }

    // flag internal edges (coincident part edges)
    if (flagInternal) {
      const coincident_max_dist = 5

      for (let i = 0; i < bodies.length; i++) {
        const partA = bodies[i]

        for (let j = i + 1; j < bodies.length; j++) {
          const partB = bodies[j]

          if (Bounds.overlaps(partA.bounds, partB.bounds)) {
            const pav = partA.vertices
            const pbv = partB.vertices

            // iterate vertices of both parts
            for (let k = 0; k < partA.vertices.length; k++) {
              for (let z = 0; z < partB.vertices.length; z++) {
                // find distances between the vertices
                const da = Vector.magnitudeSquared(
                  Vector.sub(pav[(k + 1) % pav.length], pbv[z])
                )
                const db = Vector.magnitudeSquared(
                  Vector.sub(pav[k], pbv[(z + 1) % pbv.length])
                )

                // if both vertices are very close, consider the edge concident (internal)
                if (da < coincident_max_dist && db < coincident_max_dist) {
                  pav[k].isInternal = true
                  pbv[z].isInternal = true
                }
              }
            }
          }
        }
      }
    }

    if (bodies.length > 1) {
      // create the parent body to be returned, that contains generated compound parts
      const body = Body.create(
        Common.extend({ parts: bodies.slice(0) }, options)
      )

      // offset such that body.position is at the centre off mass
      Body.setPosition(body, { x: x, y: y })

      return body
    } else {
      return bodies[0]
    }
  }
}
