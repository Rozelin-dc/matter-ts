/**
 * Initialise and start the browser demo / compare tool.
 *
 * For a simpler, minimal Matter.js example see:
 * https://github.com/liabru/matter-js/wiki/Getting-started
 *
 * The source for examples can be found at `/examples/`.
 *
 * @module Index
 */
import pathseg from 'pathseg'
import * as MatterToolsTypes from '@rozelin/matter-tools'
const MatterTools = MatterToolsTypes.default

import Matter from '../../../src/matter'
import Examples from '../../../examples'
import { compare } from './Compare'
import { demo } from './Demo'

// browser globals
window.pathseg = pathseg
window.MatterTools = MatterTools
window.Matter = Matter

// prepare examples
const examples: MatterToolsTypes.Demo.IDemoExample[] = Matter.Common.keys(
  Examples
).map((id) => {
  return {
    id: id,
    sourceLink:
      'https://github.com/Rozelin-dc/matter-ts/blob/main/examples/' +
      id +
      '.js',
    name: Examples[id as keyof typeof Examples].title,
    init: Examples[id as keyof typeof Examples],
    instance: null,
  }
})

// start the requested tool
const isCompare = window.location.search.indexOf('compare') >= 0
const isDev = __MATTER_IS_DEV__
if (isCompare) {
  compare(examples, isDev)
} else {
  demo(examples, isDev)
}
