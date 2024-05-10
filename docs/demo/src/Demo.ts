/**
 * A Matter.js demo and development testbed based on MatterTools.
 *
 * For a simpler, minimal Matter.js example see:
 * https://github.com/liabru/matter-js/wiki/Getting-started
 *
 * The source for examples can be found at `/examples/`.
 *
 * @module Demo
 */

import * as MatterToolsTypes from '@rozelin/matter-tools'
const MatterTools = MatterToolsTypes.default

import Matter from '../../../src/matter'
import { IRender } from '../../../src/render/Render'
import { DeepPartial } from '../../../src/core/Common'

export const demo = function (
  examples: MatterToolsTypes.Demo.IDemoExample[],
  isDev: boolean
) {
  const demo = MatterTools.Demo.create({
    toolbar: {
      title: 'matter-ts' + (isDev ? ' ・ dev' : ''),
      url: 'https://github.com/Rozelin-dc/matter-ts',
      reset: true,
      source: true,
      inspector: true,
      tools: true,
      fullscreen: true,
      exampleSelect: true,
    },
    tools: {
      inspector: true,
      gui: true,
    },
    inline: false,
    preventZoom: true,
    resetOnOrientation: true,
    routing: true,
    startExample: 'mixed',
    examples: examples,
  })

  window.MatterDemoInstance = demo

  if (demo.dom.root) {
    document.body.appendChild(demo.dom.root)
  }
  document.title = 'Matter.ts Demo' + (isDev ? ' ・ Dev' : '')

  if (isDev) {
    // add compare button
    const buttonSource = demo.dom.buttonSource
    if (buttonSource) {
      const buttonCompare = buttonSource.cloneNode(true) as typeof buttonSource

      buttonCompare.textContent = '⎄'
      buttonCompare.title = 'Compare'
      buttonCompare.href = '?compare'
      buttonCompare.target = ''
      buttonCompare.className = 'matter-btn matter-btn-compare'
      buttonCompare.addEventListener('click', function (event) {
        window.location.href = '?compare#' + demo.example?.id
        event.preventDefault()
      })

      buttonSource.parentNode?.insertBefore(
        buttonCompare,
        buttonSource.nextSibling
      )
    }

    // always show debug info
    Matter.before(
      'Render.create',
      function (renderOptions: DeepPartial<IRender>) {
        if (!renderOptions.options) {
          renderOptions.options = {}
        }
        renderOptions.options.showDebug = true
      }
    )

    // arrow key navigation of examples
    document.addEventListener('keyup', function (event) {
      const isBackKey = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
      const isForwardKey =
        event.key === 'ArrowRight' || event.key === 'ArrowDown'

      if (isBackKey || isForwardKey) {
        const direction = isBackKey ? -1 : 1
        const currentExampleIndex = demo.examples.findIndex(function (example) {
          return example.id === demo.example?.id
        })
        const nextExample =
          demo.examples[
            (demo.examples.length + currentExampleIndex + direction) %
              demo.examples.length
          ]

        MatterTools.Demo.setExample(demo, nextExample)
      }
    })
  }

  MatterTools.Demo.start(demo)
}
