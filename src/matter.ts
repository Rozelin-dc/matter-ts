import Body from './body/Body'
import Composite from './body/Composite'
import World from './body/World'
import Collision from './collision/Collision'
import Contact from './collision/Contact'
import Detector from './collision/Detector'
import Grid from './collision/Grid'
import Pair from './collision/Pair'
import Pairs from './collision/Pairs'
import Query from './collision/Query'
import Resolver from './collision/Resolver'
import SAT from './collision/SAT'
import Constraint from './constraint/Constraint'
import MouseConstraint from './constraint/MouseConstraint'
import Common from './core/Common'
import Engine from './core/Engine'
import Events from './core/Events'
import Matter from './core/Matter'
import Mouse from './core/Mouse'
import Plugin from './core/Plugin'
import Runner from './core/Runner'
import Sleeping from './core/Sleeping'
import Bodies from './factory/Bodies'
import Composites from './factory/Composites'
import Axes from './geometry/Axes'
import Bounds from './geometry/Bounds'
import Svg from './geometry/Svg'
import Vector from './geometry/Vector'
import Vertices from './geometry/Vertices'
import Render from './render/Render'

export * as Body from './body/Body'
export * as Composite from './body/Composite'
export * as World from './body/World'
export * as Collision from './collision/Collision'
export * as Contact from './collision/Contact'
export * as Detector from './collision/Detector'
export * as Grid from './collision/Grid'
export * as Pair from './collision/Pair'
export * as Pairs from './collision/Pairs'
export * as Query from './collision/Query'
export * as Resolver from './collision/Resolver'
export * as SAT from './collision/SAT'
export * as Constraint from './constraint/Constraint'
export * as MouseConstraint from './constraint/MouseConstraint'
export * as Common from './core/Common'
export * as Engine from './core/Engine'
export * as Events from './core/Events'
export * as Matter from './core/Matter'
export * as Mouse from './core/Mouse'
export * as Plugin from './core/Plugin'
export * as Runner from './core/Runner'
export * as Sleeping from './core/Sleeping'
export * as Bodies from './factory/Bodies'
export * as Composites from './factory/Composites'
export * as Axes from './geometry/Axes'
export * as Bounds from './geometry/Bounds'
export * as Svg from './geometry/Svg'
export * as Vector from './geometry/Vector'
export * as Vertices from './geometry/Vertices'
export * as Render from './render/Render'

export default class MatterModule extends Matter {
  public static Axes = Axes
  public static Bodies = Bodies
  public static Body = Body
  public static Bounds = Bounds
  public static Collision = Collision
  public static Common = Common
  public static Composite = Composite
  public static Composites = Composites
  public static Constraint = Constraint
  public static Contact = Contact
  public static Detector = Detector
  public static Engine = Engine
  public static Events = Events
  public static Grid = Grid
  public static Mouse = Mouse
  public static MouseConstraint = MouseConstraint
  public static Pair = Pair
  public static Pairs = Pairs
  public static Plugin = Plugin
  public static Query = Query
  public static Render = Render
  public static Resolver = Resolver
  public static Runner = Runner
  public static SAT = SAT
  public static Sleeping = Sleeping
  public static Svg = Svg
  public static Vector = Vector
  public static Vertices = Vertices
  public static World = World
}
