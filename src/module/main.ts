import Body from '../body/Body'
import Composite from '../body/Composite'
import World from '../body/World'
import Collision from '../collision/Collision'
import Contact from '../collision/Contact'
import Detector from '../collision/Detector'
import Grid from '../collision/Grid'
import Pair from '../collision/Pair'
import Pairs from '../collision/Pairs'
import Query from '../collision/Query'
import Resolver from '../collision/Resolver'
import SAT from '../collision/SAT'
import Constraint from '../constraint/Constraint'
import MouseConstraint from '../constraint/MouseConstraint'
import Common from '../core/Common'
import Engine from '../core/Engine'
import Events from '../core/Events'
import Matter from '../core/Matter'
import Mouse from '../core/Mouse'
import Plugin from '../core/Plugin'
import Runner from '../core/Runner'
import Sleeping from '../core/Sleeping'
import Bodies from '../factory/Bodies'
import Composites from '../factory/Composites'
import Axes from '../geometry/Axes'
import Bounds from '../geometry/Bounds'
import Svg from '../geometry/Svg'
import Vector from '../geometry/Vector'
import Vertices from '../geometry/Vertices'
import Render from '../render/Render'

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
