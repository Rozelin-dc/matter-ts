import * as MatterTypes from '../src/matter'

declare global {
  const Matter: typeof MatterTypes.default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MatterWrap: any
}
