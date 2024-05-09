import pathseg from 'pathseg'
import * as MatterToolsTypes from '@rozelin/matter-tools'

import * as MatterTypes from '../../../src/matter'

declare global {
  interface Window {
    pathseg: typeof pathseg
    MatterTools: typeof MatterToolsTypes.default
    Matter: typeof MatterTypes.default
    MatterDemoInstance: MatterToolsTypes.Demo.IDemo
  }

  let __MATTER_IS_DEV__: boolean
}
