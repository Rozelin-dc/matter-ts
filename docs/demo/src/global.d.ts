import pathseg from 'pathseg'
import * as MatterToolsTypes from '@rozelin/matter-tools'

import Matter from '../../../src/matter'

declare global {
  interface Window {
    pathseg: typeof pathseg
    MatterTools: typeof MatterToolsTypes.default
    Matter: typeof Matter
    MatterDemoInstance: MatterToolsTypes.Demo.IDemo
  }

  let __MATTER_IS_DEV__: boolean
}
