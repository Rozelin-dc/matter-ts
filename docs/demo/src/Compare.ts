/**
 * A Matter.js version comparison testbed based on MatterTools.
 *
 * Tool to interactively compare engine results of
 * development version against the previous release.
 *
 * USAGE: [host]?compare[=frames]#[example]
 *  e.g. http://localhost:8000/?compare=120#mixed
 *
 * @module Compare
 */

import * as MatterToolsTypes from '@rozelin/matter-tools'
import * as _MatterBuildTypes from 'matter-build'
import * as MatterDevTypes from '../../../src/matter'

const MatterTools = MatterToolsTypes.default
const MatterDev = MatterDevTypes.default
const MatterBuildTypes: typeof MatterDevTypes = _MatterBuildTypes
const MatterBuild = MatterBuildTypes.default

export const compare = function (
  examples: MatterToolsTypes.Demo.IDemoExample[],
  isDev: boolean
) {
  // create primary demo for dev build
  const demo = MatterTools.Demo.create({
    toolbar: {
      title:
        'matter-ts ・ ' +
        (isDev ? 'dev' : '') +
        ' ・ comparing to ' +
        MatterBuild.version,
      url: 'https://github.com/Rozelin-dc/matter-ts',
      reset: true,
      source: true,
      inspector: false,
      tools: false,
      fullscreen: true,
      exampleSelect: true,
    },
    // tools disabled to keep sync between instances
    tools: {
      inspector: false,
      gui: false,
    },
    inline: false,
    preventZoom: true,
    resetOnOrientation: true,
    startExample: false,
    examples: examples,
  })

  // create secondary demo for release build
  const demoBuild = MatterTools.Demo.create({
    toolbar: {
      title: 'matter-ts-compare-build',
      url: null,
      reset: false,
      source: false,
      inspector: false,
      tools: false,
      fullscreen: false,
      exampleSelect: false,
    },
    // tools disabled to keep sync between instances
    tools: {
      inspector: false,
      gui: false,
    },
    inline: false,
    preventZoom: true,
    resetOnOrientation: true,
    startExample: false,
    examples: examples.map(function (example) {
      return MatterBuild.Common.extend({}, example)
    }),
  })

  /**
   * NOTE: For the actual example code, refer to the source files in `/examples/`.
   * The code below is tooling for Matter.js maintainers to compare versions of Matter.
   */

  // build version should not run itself
  // @ts-ignore
  MatterBuild.Runner.run = function () {}
  MatterBuild.Render.run = function () {}

  // maintain original references to patched methods
  // @ts-ignore
  MatterDev.Runner._tick = MatterDev.Runner.tick
  // @ts-ignore
  MatterDev.Render._world = MatterDev.Render.world
  // @ts-ignore
  MatterBuild.Mouse._setElement = MatterBuild.Mouse.setElement

  // patch MatterTools to control both demo versions simultaneously
  // @ts-ignore
  MatterTools.Demo._setExample = MatterTools.Demo.setExample
  MatterTools.Demo.setExample = function (_demo, example) {
    // @ts-ignore
    MatterBuild.Common._nextId = MatterBuild.Common._seed = 0
    // @ts-ignore
    MatterDev.Common._nextId = MatterDev.Common._seed = 0

    // @ts-ignore
    MatterBuild.Plugin._registry = MatterDev.Plugin._registry
    // @ts-ignore
    MatterBuild.use.apply(null, MatterDev.used)

    window.Matter = MatterDev
    // @ts-ignore
    MatterTools.Demo._setExample(
      demo,
      demo.examples.find(function (e) {
        return e.name === example?.name
      })
    )

    const maxTicks = parseFloat(window.location.search.split('=')[1])
    let ticks = 0

    MatterDev.Runner.tick = function (runner, engine, time) {
      if (ticks === -1) {
        return
      }

      if (ticks >= maxTicks) {
        console.info(
          'Demo.Compare: ran ' +
            ticks +
            ' ticks, timestamp is now ' +
            engine.timing.timestamp.toFixed(2)
        )

        ticks = -1

        return
      }

      ticks += 1

      const demoBuildInstance = demoBuild.example!.instance!
      runner.isFixed = demoBuildInstance.runner.isFixed = true
      runner.delta = demoBuildInstance.runner.delta = 1000 / 60

      window.Matter = MatterBuild
      MatterBuild.Runner.tick(
        demoBuildInstance.runner,
        demoBuildInstance.engine,
        time
      )
      window.Matter = MatterDev
      // @ts-ignore
      return MatterDev.Runner._tick(runner, engine, time)
    }

    MatterDev.Render.world = function (render) {
      window.Matter = MatterBuild
      MatterBuild.Render.world(demoBuild.example!.instance!.render)
      window.Matter = MatterDev
      // @ts-ignore
      return MatterDev.Render._world(render)
    }

    MatterBuild.Mouse.setElement = function (mouse) {
      // @ts-ignore
      return MatterBuild.Mouse._setElement(
        mouse,
        demo.example!.instance!.render.canvas
      )
    }

    window.Matter = MatterBuild
    // @ts-ignore
    MatterTools.Demo._setExample(
      demoBuild,
      demoBuild.examples.find(function (e) {
        return e.name === example?.name
      })
    )

    window.Matter = MatterDev
  }

  // reset both engine versions simultaneously
  // @ts-ignore
  MatterTools.Demo._reset = MatterTools.Demo.reset
  MatterTools.Demo.reset = function (_demo) {
    // @ts-ignore
    MatterBuild.Common._nextId = MatterBuild.Common._seed = 0
    // @ts-ignore
    MatterDev.Common._nextId = MatterDev.Common._seed = 0

    window.Matter = MatterBuild
    // @ts-ignore
    MatterTools.Demo._reset(demoBuild)

    window.Matter = MatterDev
    // @ts-ignore
    MatterTools.Demo._reset(demo)
  }

  if (demo.dom.root) {
    document.body.appendChild(demo.dom.root)
  }
  if (demoBuild.dom.root) {
    document.body.appendChild(demoBuild.dom.root)
  }

  MatterTools.Demo.start(demo)

  document.title = 'Matter.ts Compare' + (isDev ? ' ・ Dev' : '')

  console.info(
    'Demo.Compare: matter-ts@' +
      MatterDev.version +
      ' with matter-ts@' +
      MatterBuild.version
  )
}
