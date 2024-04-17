import Common from '../core/Common'
import { IVector } from './Vector'

/**
 * The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
 *
 * To use this module you also need the SVGPathSeg polyfill: https://github.com/progers/pathseg
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Svg {
  /**
   * Converts an SVG path into an array of vector points.
   * If the input path forms a concave shape, you must decompose the result into convex parts before use.
   * See `Bodies.fromVertices` which provides support for this.
   * Note that this function is not guaranteed to support complex paths (such as those with holes).
   * You must load the `pathseg.js` polyfill on newer browsers.
   * @method pathToVertices
   * @param path
   * @param sampleLength
   * @return points
   */
  public static pathToVertices(
    path: SVGPathElement,
    sampleLength: number = 15
  ): IVector[] {
    if (typeof window !== 'undefined' && !('SVGPathSeg' in window)) {
      Common.warn(
        'Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.'
      )
    }

    // https://github.com/wout/svg.topoly.js/blob/master/svg.topoly.js
    let lastPoint: IVector
    let x: number
    let y: number
    const points: IVector[] = []

    const addPoint = (px: number, py: number, pathSegType: number) => {
      // all odd-numbered path types are relative except PATHSEG_CLOSEPATH (1)
      const isRelative = pathSegType % 2 === 1 && pathSegType > 1

      let lx: number
      let ly: number
      // when the last point doesn't equal the current point add the current point
      if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
        if (lastPoint && isRelative) {
          lx = lastPoint.x
          ly = lastPoint.y
        } else {
          lx = 0
          ly = 0
        }

        const point: IVector = {
          x: lx + px,
          y: ly + py,
        }
        // set last point
        if (isRelative || !lastPoint) {
          lastPoint = point
        }
        points.push(point)

        x = lx + px
        y = ly + py
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addSegmentPoint = (segment: any) => {
      const segType = segment.pathSegTypeAsLetter.toUpperCase()

      // skip path ends
      if (segType === 'Z') {
        return
      }

      // map segment to x and y
      switch (segType) {
        case 'M':
        case 'L':
        case 'T':
        case 'C':
        case 'S':
        case 'Q':
          x = segment.x
          y = segment.y
          break
        case 'H':
          x = segment.x
          break
        case 'V':
          y = segment.y
          break
      }

      addPoint(x, y, segment.pathSegType)
    }

    // ensure path is absolute
    Svg._svgPathToAbsolute(path)

    // get total length
    const total = path.getTotalLength()

    // queue segments
    const segments = []
    // @ts-ignore
    for (let i = 0; i < path.pathSegList.numberOfItems; i += 1) {
      // @ts-ignore
      segments.push(path.pathSegList.getItem(i))
    }

    const segmentsQueue = segments.concat()

    let lastSegment
    // sample through path
    while (length < total) {
      // get segment at position
      // @ts-ignore
      const segmentIndex = path.getPathSegAtLength(length)
      const segment = segments[segmentIndex]

      // new segment
      if (segment != lastSegment) {
        while (segmentsQueue.length && segmentsQueue[0] != segment) {
          addSegmentPoint(segmentsQueue.shift())
        }
        lastSegment = segment
      }

      // add points in between when curving
      // TODO: adaptive sampling
      switch (segment.pathSegTypeAsLetter.toUpperCase()) {
        case 'C':
        case 'T':
        case 'S':
        case 'Q':
        case 'A':
          const point = path.getPointAtLength(length)
          addPoint(point.x, point.y, 0)
          break
      }

      // increment by sample value
      // eslint-disable-next-line no-global-assign
      length += sampleLength
    }

    // add remaining segments not passed by sampling
    for (let i = 0, il = segmentsQueue.length; i < il; ++i)
      addSegmentPoint(segmentsQueue[i])

    return points
  }

  protected static _svgPathToAbsolute(path: SVGPathElement): void {
    // http://phrogz.net/convert-svg-path-to-all-absolute-commands
    // Copyright (c) Gavin Kistner
    // http://phrogz.net/js/_ReuseLicense.txt
    // Modifications: tidy formatting and naming
    let x = 0
    let y = 0
    let x0 = 0
    let y0 = 0
    let x1: number
    let y1: number
    let x2: number
    let y2: number
    // @ts-ignore
    const segs = path.pathSegList
    const len: number = segs.numberOfItems

    for (let i = 0; i < len; ++i) {
      const seg = segs.getItem(i)
      const segType = seg.pathSegTypeAsLetter

      if (/[MLHVCSQTA]/.test(segType)) {
        if ('x' in seg) {
          x = seg.x
        }
        if ('y' in seg) {
          y = seg.y
        }
      } else {
        if ('x1' in seg) {
          x1 = x + seg.x1
        }
        if ('x2' in seg) {
          x2 = x + seg.x2
        }
        if ('y1' in seg) {
          y1 = y + seg.y1
        }
        if ('y2' in seg) {
          y2 = y + seg.y2
        }
        if ('x' in seg) {
          x += seg.x
        }
        if ('y' in seg) {
          y += seg.y
        }

        switch (segType) {
          case 'm':
            // @ts-ignore
            segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i)
            break
          case 'l':
            // @ts-ignore
            segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i)
            break
          case 'h':
            // @ts-ignore
            segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i)
            break
          case 'v':
            // @ts-ignore
            segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i)
            break
          case 'c':
            segs.replaceItem(
              // @ts-ignore
              path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2),
              i
            )
            break
          case 's':
            segs.replaceItem(
              // @ts-ignore
              path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2),
              i
            )
            break
          case 'q':
            segs.replaceItem(
              // @ts-ignore
              path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1),
              i
            )
            break
          case 't':
            segs.replaceItem(
              // @ts-ignore
              path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y),
              i
            )
            break
          case 'a':
            segs.replaceItem(
              // @ts-ignore
              path.createSVGPathSegArcAbs(
                x,
                y,
                seg.r1,
                seg.r2,
                seg.angle,
                seg.largeArcFlag,
                seg.sweepFlag
              ),
              i
            )
            break
          case 'z':
          case 'Z':
            x = x0
            y = y0
            break
        }
      }

      if (segType == 'M' || segType == 'm') {
        x0 = x
        y0 = y
      }
    }
  }
}
