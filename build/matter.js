/*!
 * @rozelin/matter-ts 1.0.5 by @Rozelin
 * https://github.com/Rozelin-dc/matter-tools
 * License MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) Rozelin.
 *
 * This software is a modified version of the original software licensed under
 * the MIT License. Original copyright (c) Liam Brummitt. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Matter", [], factory);
	else if(typeof exports === 'object')
		exports["Matter"] = factory();
	else
		root["Matter"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 713:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vector_1 = __importDefault(__webpack_require__(795));
const Axes_1 = __importDefault(__webpack_require__(631));
const Vertices_1 = __importDefault(__webpack_require__(547));
const Common_1 = __importDefault(__webpack_require__(120));
const Sleeping_1 = __importDefault(__webpack_require__(464));
/**
 * The `Matter.Body` module contains methods for creating and manipulating rigid bodies.
 * For creating bodies with common configurations such as rectangles, circles and other polygons see the module `Matter.Bodies`.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Body {
    /**
     * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * Vertices must be specified in clockwise order.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return body
     */
    static create(options = {}) {
        const defaults = {
            id: Common_1.default.nextId(),
            type: 'body',
            label: 'Body',
            parts: [],
            plugin: {},
            angle: 0,
            vertices: Vertices_1.default.fromPath('L 0 0 L 40 0 L 40 40 L 0 40'),
            position: { x: 0, y: 0 },
            force: { x: 0, y: 0 },
            torque: 0,
            positionImpulse: { x: 0, y: 0 },
            constraintImpulse: { x: 0, y: 0, angle: 0 },
            totalContacts: 0,
            speed: 0,
            angularSpeed: 0,
            velocity: { x: 0, y: 0 },
            angularVelocity: 0,
            isSensor: false,
            isStatic: false,
            isSleeping: false,
            sleepCounter: 0,
            motion: 0,
            sleepThreshold: 60,
            density: 0.001,
            restitution: 0,
            friction: 0.1,
            frictionStatic: 0.5,
            frictionAir: 0.01,
            collisionFilter: {
                category: 0x0001,
                mask: 0xffffffff,
                group: 0,
            },
            slop: 0.05,
            timeScale: 1,
            render: {
                visible: true,
                opacity: 1,
                sprite: {
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0,
                },
            },
            events: {},
            circleRadius: 0,
            anglePrev: 0,
            area: 0,
            mass: 0,
            inertia: 0,
            deltaTime: 1000 / 60,
            _original: null,
        };
        const body = Common_1.default.extend(defaults, options);
        Body._initProperties(body, options);
        return body;
    }
    /**
     * Initialises body properties.
     * @method _initProperties
     * @param body
     * @param options
     */
    static _initProperties(body, options = {}) {
        // init required properties (order is important)
        Body.set(body, {
            bounds: body.bounds || Bounds_1.default.create(body.vertices),
            positionPrev: body.positionPrev || Vector_1.default.clone(body.position),
            anglePrev: body.anglePrev || body.angle,
            vertices: body.vertices,
            parts: body.parts || [body],
            isStatic: body.isStatic,
            isSleeping: body.isSleeping,
            parent: body.parent || body,
        });
        Vertices_1.default.rotate(body.vertices, body.angle, body.position);
        Axes_1.default.rotate(body.axes, body.angle);
        Bounds_1.default.update(body.bounds, body.vertices, body.velocity);
        // allow options to override the automatically calculated properties
        Body.set(body, {
            axes: options.axes || body.axes,
            area: options.area || body.area,
            mass: options.mass || body.mass,
            inertia: options.inertia || body.inertia,
        });
        // render properties
        const defaultFillStyle = body.isStatic
            ? '#14151f'
            : Common_1.default.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
        const defaultStrokeStyle = body.isStatic ? '#555' : '#ccc';
        const defaultLineWidth = body.isStatic && body.render.fillStyle === null ? 1 : 0;
        body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
        body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
        body.render.lineWidth = body.render.lineWidth || defaultLineWidth;
        body.render.sprite.xOffset +=
            -(body.bounds.min.x - body.position.x) /
                (body.bounds.max.x - body.bounds.min.x);
        body.render.sprite.yOffset +=
            -(body.bounds.min.y - body.position.y) /
                (body.bounds.max.y - body.bounds.min.y);
    }
    /**
     * Returns the next unique group index for which bodies will collide.
     * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
     * See `body.collisionFilter` for more information.
     * @method nextGroup
     * @param isNonColliding
     * @return Unique group index
     */
    static nextGroup(isNonColliding = false) {
        if (isNonColliding) {
            return Body._nextNonCollidingGroupId--;
        }
        return Body._nextCollidingGroupId++;
    }
    /**
     * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
     * There are 32 available. See `body.collisionFilter` for more information.
     * @method nextCategory
     * @return Unique category bitfield
     */
    static nextCategory() {
        Body._nextCategory = Body._nextCategory << 1;
        return Body._nextCategory;
    }
    static set(body, settings, value) {
        if (typeof settings === 'string') {
            if (!value) {
                Common_1.default.warn('Body.set() need 3 arguments');
                return;
            }
            Body._setByKey(body, settings, value);
            return;
        }
        for (const property in settings) {
            // eslint-disable-next-line no-prototype-builtins
            if (!settings.hasOwnProperty(property)) {
                continue;
            }
            const v = settings[property];
            Body._setByKey(body, property, v);
        }
    }
    static _setByKey(body, key, value) {
        switch (key) {
            case 'isStatic':
                Body.setStatic(body, value);
                break;
            case 'isSleeping':
                Sleeping_1.default.set(body, value);
                break;
            case 'mass':
                Body.setMass(body, value);
                break;
            case 'density':
                Body.setDensity(body, value);
                break;
            case 'inertia':
                Body.setInertia(body, value);
                break;
            case 'vertices':
                Body.setVertices(body, value);
                break;
            case 'position':
                Body.setPosition(body, value);
                break;
            case 'angle':
                Body.setAngle(body, value);
                break;
            case 'velocity':
                Body.setVelocity(body, value);
                break;
            case 'angularVelocity':
                Body.setAngularVelocity(body, value);
                break;
            case 'speed':
                Body.setSpeed(body, value);
                break;
            case 'angularSpeed':
                Body.setAngularSpeed(body, value);
                break;
            case 'parts':
                Body.setParts(body, value);
                break;
            case 'centre':
                Body.setCentre(body, value);
                break;
            default:
                body[key] = value;
        }
    }
    /**
     * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
     * @method setStatic
     * @param body
     * @param isStatic
     */
    static setStatic(body, isStatic) {
        for (const part of body.parts) {
            if (isStatic) {
                if (!part.isStatic) {
                    part._original = {
                        restitution: part.restitution,
                        friction: part.friction,
                        mass: part.mass,
                        inertia: part.inertia,
                        density: part.density,
                        inverseMass: part.inverseMass,
                        inverseInertia: part.inverseInertia,
                    };
                }
                part.restitution = 0;
                part.friction = 1;
                part.mass = part.inertia = part.density = Infinity;
                part.inverseMass = part.inverseInertia = 0;
                part.positionPrev.x = part.position.x;
                part.positionPrev.y = part.position.y;
                part.anglePrev = part.angle;
                part.angularVelocity = 0;
                part.speed = 0;
                part.angularSpeed = 0;
                part.motion = 0;
            }
            else if (part._original) {
                part.restitution = part._original.restitution;
                part.friction = part._original.friction;
                part.mass = part._original.mass;
                part.inertia = part._original.inertia;
                part.density = part._original.density;
                part.inverseMass = part._original.inverseMass;
                part.inverseInertia = part._original.inverseInertia;
                part._original = null;
            }
            part.isStatic = isStatic;
        }
    }
    /**
     * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
     * @method setMass
     * @param body
     * @param mass
     */
    static setMass(body, mass) {
        const moment = body.inertia / (body.mass / 6);
        body.inertia = moment * (mass / 6);
        body.inverseInertia = 1 / body.inertia;
        body.mass = mass;
        body.inverseMass = 1 / body.mass;
        body.density = body.mass / body.area;
    }
    /**
     * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
     * @method setDensity
     * @param {body} body
     * @param {number} density
     */
    static setDensity(body, density) {
        Body.setMass(body, density * body.area);
        body.density = density;
    }
    /**
     * Sets the moment of inertia of the body. This is the second moment of area in two dimensions.
     * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
     * @method setInertia
     * @param body
     * @param inertia
     */
    static setInertia(body, inertia) {
        body.inertia = inertia;
        body.inverseInertia = 1 / body.inertia;
    }
    /**
     * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
     * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
     * They are then automatically translated to world space based on `body.position`.
     *
     * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
     * Vertices must form a convex hull. Concave vertices must be decomposed into convex parts.
     *
     * @method setVertices
     * @param body
     * @param vertices
     */
    static setVertices(body, vertices) {
        // change vertices
        if (vertices[0].body === body) {
            body.vertices = vertices;
        }
        else {
            body.vertices = Vertices_1.default.create(vertices, body);
        }
        // update properties
        body.axes = Axes_1.default.fromVertices(body.vertices);
        body.area = Vertices_1.default.area(body.vertices);
        Body.setMass(body, body.density * body.area);
        // orient vertices around the centre of mass at origin (0, 0)
        const centre = Vertices_1.default.centre(body.vertices);
        Vertices_1.default.translate(body.vertices, centre, -1);
        // update inertia while vertices are at origin (0, 0)
        Body.setInertia(body, Body._inertiaScale * Vertices_1.default.inertia(body.vertices, body.mass));
        // update geometry
        Vertices_1.default.translate(body.vertices, body.position);
        Bounds_1.default.update(body.bounds, body.vertices, body.velocity);
    }
    /**
     * Sets the parts of the `body`.
     *
     * See `body.parts` for details and requirements on how parts are used.
     *
     * See Bodies.fromVertices for a related utility.
     *
     * This function updates `body` mass, inertia and centroid based on the parts geometry.
     * Sets each `part.parent` to be this `body`.
     *
     * The convex hull is computed and set on this `body` (unless `autoHull` is `false`).
     * Automatically ensures that the first part in `body.parts` is the `body`.
     * @method setParts
     * @param body
     * @param parts
     * @param autoHull
     */
    static setParts(body, parts, autoHull = true) {
        // add all the parts, ensuring that the first part is always the parent body
        parts = parts.slice(0);
        body.parts.length = 0;
        body.parts.push(body);
        body.parent = body;
        for (const part of parts) {
            if (part !== body) {
                part.parent = body;
                body.parts.push(part);
            }
        }
        if (body.parts.length === 1) {
            return;
        }
        // find the convex hull of all parts to set on the parent body
        if (autoHull) {
            let vertices = [];
            for (const part of parts) {
                vertices = vertices.concat(part.vertices);
            }
            Vertices_1.default.clockwiseSort(vertices);
            const hull = Vertices_1.default.hull(vertices);
            const hullCentre = Vertices_1.default.centre(hull);
            Body.setVertices(body, hull);
            Vertices_1.default.translate(body.vertices, hullCentre);
        }
        // sum the properties of all compound parts of the parent body
        const total = Body._totalProperties(body);
        body.area = total.area;
        body.parent = body;
        body.position.x = total.centre.x;
        body.position.y = total.centre.y;
        body.positionPrev.x = total.centre.x;
        body.positionPrev.y = total.centre.y;
        Body.setMass(body, total.mass);
        Body.setInertia(body, total.inertia);
        Body.setPosition(body, total.centre);
    }
    /**
     * Set the centre of mass of the body.
     * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
     * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
     * This is equal to moving `body.position` but not the `body.vertices`.
     * Invalid if the `centre` falls outside the body's convex hull.
     * @method setCentre
     * @param body
     * @param centre
     * @param relative
     */
    static setCentre(body, centre, relative) {
        if (!relative) {
            body.positionPrev.x = centre.x - (body.position.x - body.positionPrev.x);
            body.positionPrev.y = centre.y - (body.position.y - body.positionPrev.y);
            body.position.x = centre.x;
            body.position.y = centre.y;
        }
        else {
            body.positionPrev.x += centre.x;
            body.positionPrev.y += centre.y;
            body.position.x += centre.x;
            body.position.y += centre.y;
        }
    }
    /**
     * Sets the position of the body. By default velocity is unchanged.
     * If `updateVelocity` is `true` then velocity is inferred from the change in position.
     * @method setPosition
     * @param body
     * @param position
     * @param updateVelocity
     */
    static setPosition(body, position, updateVelocity = false) {
        const delta = Vector_1.default.sub(position, body.position);
        if (updateVelocity) {
            body.positionPrev.x = body.position.x;
            body.positionPrev.y = body.position.y;
            body.velocity.x = delta.x;
            body.velocity.y = delta.y;
            body.speed = Vector_1.default.magnitude(delta);
        }
        else {
            body.positionPrev.x += delta.x;
            body.positionPrev.y += delta.y;
        }
        for (const part of body.parts) {
            part.position.x += delta.x;
            part.position.y += delta.y;
            Vertices_1.default.translate(part.vertices, delta);
            Bounds_1.default.update(part.bounds, part.vertices, body.velocity);
        }
    }
    /**
     * Sets the angle of the body. By default angular velocity is unchanged.
     * If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
     * @method setAngle
     * @param body
     * @param angle
     * @param updateVelocity
     */
    static setAngle(body, angle, updateVelocity = false) {
        const delta = angle - body.angle;
        if (updateVelocity) {
            body.anglePrev = body.angle;
            body.angularVelocity = delta;
            body.angularSpeed = Math.abs(delta);
        }
        else {
            body.anglePrev += delta;
        }
        for (let i = 0; i < body.parts.length; i++) {
            const part = body.parts[i];
            part.angle += delta;
            Vertices_1.default.rotate(part.vertices, delta, body.position);
            Axes_1.default.rotate(part.axes, delta);
            Bounds_1.default.update(part.bounds, part.vertices, body.velocity);
            if (i > 0) {
                Vector_1.default.rotateAbout(part.position, delta, body.position, part.position);
            }
        }
    }
    /**
     * Sets the current linear velocity of the body.
     * Affects body speed.
     * @method setVelocity
     * @param body
     * @param velocity
     */
    static setVelocity(body, velocity) {
        const timeScale = body.deltaTime / Body._baseDelta;
        body.positionPrev.x = body.position.x - velocity.x * timeScale;
        body.positionPrev.y = body.position.y - velocity.y * timeScale;
        body.velocity.x = (body.position.x - body.positionPrev.x) / timeScale;
        body.velocity.y = (body.position.y - body.positionPrev.y) / timeScale;
        body.speed = Vector_1.default.magnitude(body.velocity);
    }
    /**
     * Gets the current linear velocity of the body.
     * @method getVelocity
     * @param {body} body
     * @return {vector} velocity
     */
    static getVelocity(body) {
        const timeScale = Body._baseDelta / body.deltaTime;
        return {
            x: (body.position.x - body.positionPrev.x) * timeScale,
            y: (body.position.y - body.positionPrev.y) * timeScale,
        };
    }
    /**
     * Gets the current linear speed of the body.
     * Equivalent to the magnitude of its velocity.
     * @method getSpeed
     * @param body
     * @return speed
     */
    static getSpeed(body) {
        return Vector_1.default.magnitude(Body.getVelocity(body));
    }
    /**
     * Sets the current linear speed of the body.
     * Direction is maintained. Affects body velocity.
     * @method setSpeed
     * @param body
     * @param speed
     */
    static setSpeed(body, speed) {
        Body.setVelocity(body, Vector_1.default.mult(Vector_1.default.normalise(Body.getVelocity(body)), speed));
    }
    /**
     * Sets the current rotational velocity of the body.
     * Affects body angular speed.
     * @method setAngularVelocity
     * @param body
     * @param velocity
     */
    static setAngularVelocity(body, velocity) {
        const timeScale = body.deltaTime / Body._baseDelta;
        body.anglePrev = body.angle - velocity * timeScale;
        body.angularVelocity = (body.angle - body.anglePrev) / timeScale;
        body.angularSpeed = Math.abs(body.angularVelocity);
    }
    /**
     * Gets the current rotational velocity of the body.
     * @method getAngularVelocity
     * @param body
     * @return angular velocity
     */
    static getAngularVelocity(body) {
        return ((body.angle - body.anglePrev) * Body._baseDelta) / body.deltaTime;
    }
    /**
     * Gets the current rotational speed of the body.
     * Equivalent to the magnitude of its angular velocity.
     * @method getAngularSpeed
     * @param body
     * @return angular speed
     */
    static getAngularSpeed(body) {
        return Math.abs(Body.getAngularVelocity(body));
    }
    /**
     * Sets the current rotational speed of the body.
     * Direction is maintained. Affects body angular velocity.
     * @method setAngularSpeed
     * @param body
     * @param speed
     */
    static setAngularSpeed(body, speed) {
        Body.setAngularVelocity(body, Common_1.default.sign(Body.getAngularVelocity(body)) * speed);
    }
    /**
     * Moves a body by a given vector relative to its current position. By default velocity is unchanged.
     * If `updateVelocity` is `true` then velocity is inferred from the change in position.
     * @method translate
     * @param body
     * @param translation
     * @param updateVelocity
     */
    static translate(body, translation, updateVelocity = false) {
        Body.setPosition(body, Vector_1.default.add(body.position, translation), updateVelocity);
    }
    /**
     * Rotates a body by a given angle relative to its current angle. By default angular velocity is unchanged.
     * If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
     * @method rotate
     * @param body
     * @param rotation
     * @param point
     * @param updateVelocity
     */
    static rotate(body, rotation, point, updateVelocity = false) {
        if (!point) {
            Body.setAngle(body, body.angle + rotation, updateVelocity);
        }
        else {
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            const dx = body.position.x - point.x;
            const dy = body.position.y - point.y;
            Body.setPosition(body, {
                x: point.x + (dx * cos - dy * sin),
                y: point.y + (dx * sin + dy * cos),
            }, updateVelocity);
            Body.setAngle(body, body.angle + rotation, updateVelocity);
        }
    }
    /**
     * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
     * @method scale
     * @param body
     * @param scaleX
     * @param scaleY
     * @param point
     */
    static scale(body, scaleX, scaleY, point = body.position) {
        let totalArea = 0;
        let totalInertia = 0;
        for (let i = 0; i < body.parts.length; i++) {
            const part = body.parts[i];
            // scale vertices
            Vertices_1.default.scale(part.vertices, scaleX, scaleY, point);
            // update properties
            part.axes = Axes_1.default.fromVertices(part.vertices);
            part.area = Vertices_1.default.area(part.vertices);
            Body.setMass(part, body.density * part.area);
            // update inertia (requires vertices to be at origin)
            Vertices_1.default.translate(part.vertices, {
                x: -part.position.x,
                y: -part.position.y,
            });
            Body.setInertia(part, Body._inertiaScale * Vertices_1.default.inertia(part.vertices, part.mass));
            Vertices_1.default.translate(part.vertices, {
                x: part.position.x,
                y: part.position.y,
            });
            if (i > 0) {
                totalArea += part.area;
                totalInertia += part.inertia;
            }
            // scale position
            part.position.x = point.x + (part.position.x - point.x) * scaleX;
            part.position.y = point.y + (part.position.y - point.y) * scaleY;
            // update bounds
            Bounds_1.default.update(part.bounds, part.vertices, body.velocity);
        }
        // handle parent body
        if (body.parts.length > 1) {
            body.area = totalArea;
            if (!body.isStatic) {
                Body.setMass(body, body.density * totalArea);
                Body.setInertia(body, totalInertia);
            }
        }
        // handle circles
        if (body.circleRadius) {
            if (scaleX === scaleY) {
                body.circleRadius *= scaleX;
            }
            else {
                // body is no longer a circle
                body.circleRadius = null;
            }
        }
    }
    /**
     * Performs an update by integrating the equations of motion on the `body`.
     * This is applied every update by `Matter.Engine` automatically.
     * @method update
     * @param body
     * @param deltaTime
     */
    static update(body, deltaTime = 1000 / 60) {
        deltaTime = deltaTime * body.timeScale;
        const deltaTimeSquared = deltaTime * deltaTime;
        const correction = Body._timeCorrection
            ? deltaTime / (body.deltaTime || deltaTime)
            : 1;
        // from the previous step
        const frictionAir = 1 - body.frictionAir * (deltaTime / Common_1.default._baseDelta);
        const velocityPrevX = (body.position.x - body.positionPrev.x) * correction;
        const velocityPrevY = (body.position.y - body.positionPrev.y) * correction;
        // update velocity with Verlet integration
        body.velocity.x =
            velocityPrevX * frictionAir +
                (body.force.x / body.mass) * deltaTimeSquared;
        body.velocity.y =
            velocityPrevY * frictionAir +
                (body.force.y / body.mass) * deltaTimeSquared;
        body.positionPrev.x = body.position.x;
        body.positionPrev.y = body.position.y;
        body.position.x += body.velocity.x;
        body.position.y += body.velocity.y;
        body.deltaTime = deltaTime;
        // update angular velocity with Verlet integration
        body.angularVelocity =
            (body.angle - body.anglePrev) * frictionAir * correction +
                (body.torque / body.inertia) * deltaTimeSquared;
        body.anglePrev = body.angle;
        body.angle += body.angularVelocity;
        // transform the body geometry
        for (let i = 0; i < body.parts.length; i++) {
            const part = body.parts[i];
            Vertices_1.default.translate(part.vertices, body.velocity);
            if (i > 0) {
                part.position.x += body.velocity.x;
                part.position.y += body.velocity.y;
            }
            if (body.angularVelocity !== 0) {
                Vertices_1.default.rotate(part.vertices, body.angularVelocity, body.position);
                Axes_1.default.rotate(part.axes, body.angularVelocity);
                if (i > 0) {
                    Vector_1.default.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
                }
            }
            Bounds_1.default.update(part.bounds, part.vertices, body.velocity);
        }
    }
    /**
     * Updates properties `body.velocity`, `body.speed`, `body.angularVelocity` and `body.angularSpeed` which are normalised in relation to `Body._baseDelta`.
     * @method updateVelocities
     * @param body
     */
    static updateVelocities(body) {
        const timeScale = Body._baseDelta / body.deltaTime;
        const bodyVelocity = body.velocity;
        bodyVelocity.x = (body.position.x - body.positionPrev.x) * timeScale;
        bodyVelocity.y = (body.position.y - body.positionPrev.y) * timeScale;
        body.speed = Math.sqrt(bodyVelocity.x * bodyVelocity.x + bodyVelocity.y * bodyVelocity.y);
        body.angularVelocity = (body.angle - body.anglePrev) * timeScale;
        body.angularSpeed = Math.abs(body.angularVelocity);
    }
    /**
     * Applies the `force` to the `body` from the force origin `position` in world-space, over a single timestep, including applying any resulting angular torque.
     *
     * Forces are useful for effects like gravity, wind or rocket thrust, but can be difficult in practice when precise control is needed. In these cases see `Body.setVelocity` and `Body.setPosition` as an alternative.
     *
     * The force from this function is only applied once for the duration of a single timestep, in other words the duration depends directly on the current engine update `delta` and the rate of calls to this function.
     *
     * Therefore to account for time, you should apply the force constantly over as many engine updates as equivalent to the intended duration.
     *
     * If all or part of the force duration is some fraction of a timestep, first multiply the force by `duration / timestep`.
     *
     * The force origin `position` in world-space must also be specified. Passing `body.position` will result in zero angular effect as the force origin would be at the centre of mass.
     *
     * The `body` will take time to accelerate under a force, the resulting effect depends on duration of the force, the body mass and other forces on the body including friction combined.
     * @method applyForce
     * @param body
     * @param position The force origin in world-space. Pass `body.position` to avoid angular torque.
     * @param force
     */
    static applyForce(body, position, force) {
        const offset = {
            x: position.x - body.position.x,
            y: position.y - body.position.y,
        };
        body.force.x += force.x;
        body.force.y += force.y;
        body.torque += offset.x * force.y - offset.y * force.x;
    }
    /**
     * Returns the sums of the properties of all compound parts of the parent body.
     * @method _totalProperties
     * @param body
     */
    static _totalProperties(body) {
        // from equations at:
        // https://ecourses.ou.edu/cgi-bin/ebook.cgi?doc=&topic=st&chap_sec=07.2&page=theory
        // http://output.to/sideway/default.asp?qno=121100087
        const properties = {
            mass: 0,
            area: 0,
            inertia: 0,
            centre: { x: 0, y: 0 },
        };
        // sum the properties of all compound parts of the parent body
        for (let i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
            const part = body.parts[i];
            const mass = part.mass !== Infinity ? part.mass : 1;
            properties.mass += mass;
            properties.area += part.area;
            properties.inertia += part.inertia;
            properties.centre = Vector_1.default.add(properties.centre, Vector_1.default.mult(part.position, mass));
        }
        properties.centre = Vector_1.default.div(properties.centre, properties.mass);
        return properties;
    }
}
Body._timeCorrection = true;
Body._inertiaScale = 4;
Body._nextCollidingGroupId = 1;
Body._nextNonCollidingGroupId = -1;
Body._nextCategory = 0x0001;
Body._baseDelta = 1000 / 60;
exports["default"] = Body;


/***/ }),

/***/ 927:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Events_1 = __importDefault(__webpack_require__(884));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vertices_1 = __importDefault(__webpack_require__(547));
const Body_1 = __importDefault(__webpack_require__(713));
/**
 * A composite is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite` objects.
 *
 * They are a container that can represent complex objects made of multiple parts, even if they are not physically connected.
 * A composite could contain anything from a single body all the way up to a whole world.
 *
 * When making any changes to composites, use the included functions rather than changing their properties directly.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Composite {
    /**
     * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properites section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return A new composite
     */
    static create(options = {}) {
        const defaults = {
            id: Common_1.default.nextId(),
            type: 'composite',
            parent: null,
            isModified: false,
            bodies: [],
            constraints: [],
            composites: [],
            label: 'Composite',
            plugin: {},
            cache: {
                allBodies: null,
                allConstraints: null,
                allComposites: null,
            },
            events: {},
        };
        return Common_1.default.extend(defaults, options);
    }
    /**
     * Sets the composite's `isModified` flag.
     * If `updateParents` is true, all parents will be set (default: false).
     * If `updateChildren` is true, all children will be set (default: false).
     * @method setModified
     * @param composite
     * @param isModified
     * @param updateParents
     * @param updateChildren
     */
    static setModified(composite, isModified, updateParents = false, updateChildren = false) {
        composite.isModified = isModified;
        if (isModified && composite.cache) {
            composite.cache.allBodies = null;
            composite.cache.allConstraints = null;
            composite.cache.allComposites = null;
        }
        if (updateParents && composite.parent) {
            Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
        }
        if (updateChildren) {
            for (const childComposite of composite.composites) {
                Composite.setModified(childComposite, isModified, updateParents, updateChildren);
            }
        }
    }
    /**
     * Generic single or multi-add function. Adds a single or an array of body(s), constraint(s) or composite(s) to the given composite.
     * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
     * @method add
     * @param composite
     * @param object A single or an array of body(s), constraint(s) or composite(s)
     * @return The original composite with the objects added
     */
    static add(composite, object) {
        const objects = [].concat(object);
        Events_1.default.trigger(composite, 'beforeAdd', { object: object });
        for (const obj of objects) {
            switch (obj.type) {
                case 'body':
                    // skip adding compound parts
                    if (obj.parent !== obj) {
                        Common_1.default.warn('Composite.add: skipped adding a compound body part (you must add its parent instead)');
                        break;
                    }
                    Composite.addBody(composite, obj);
                    break;
                case 'constraint':
                    Composite.addConstraint(composite, obj);
                    break;
                case 'composite':
                    Composite.addComposite(composite, obj);
                    break;
                case 'mouseConstraint':
                    Composite.addConstraint(composite, obj.constraint);
                    break;
            }
        }
        Events_1.default.trigger(composite, 'afterAdd', { object: object });
        return composite;
    }
    /**
     * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
     * Optionally searching its children recursively.
     * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
     * @method remove
     * @param composite
     * @param object
     * @param deep
     * @return The original composite with the objects removed
     */
    static remove(composite, object, deep = false) {
        const objects = [].concat(object);
        Events_1.default.trigger(composite, 'beforeRemove', { object: object });
        for (const obj of objects) {
            switch (obj.type) {
                case 'body':
                    Composite.removeBody(composite, obj, deep);
                    break;
                case 'constraint':
                    Composite.removeConstraint(composite, obj, deep);
                    break;
                case 'composite':
                    Composite.removeComposite(composite, obj, deep);
                    break;
                case 'mouseConstraint':
                    Composite.removeConstraint(composite, obj.constraint);
                    break;
            }
        }
        Events_1.default.trigger(composite, 'afterRemove', { object: object });
        return composite;
    }
    /**
     * Adds a composite to the given composite.
     * @method addComposite
     * @param compositeA
     * @param compositeB
     * @return The original compositeA with the objects from compositeB added
     */
    static addComposite(compositeA, compositeB) {
        compositeA.composites.push(compositeB);
        compositeB.parent = compositeA;
        Composite.setModified(compositeA, true, true, false);
        return compositeA;
    }
    /**
     * Removes a composite from the given composite, and optionally searching its children recursively.
     * @method removeComposite
     * @param compositeA
     * @param compositeB
     * @param deep
     * @return The original compositeA with the composite removed
     */
    static removeComposite(compositeA, compositeB, deep = false) {
        const position = compositeA.composites.indexOf(compositeB);
        if (position !== -1) {
            Composite.removeCompositeAt(compositeA, position);
        }
        if (deep) {
            for (const composite of compositeA.composites) {
                Composite.removeComposite(composite, compositeB, true);
            }
        }
        return compositeA;
    }
    /**
     * Removes a composite from the given composite.
     * @method removeCompositeAt
     * @param composite
     * @param position
     * @return The original composite with the composite removed
     */
    static removeCompositeAt(composite, position) {
        composite.composites.splice(position, 1);
        Composite.setModified(composite, true, true, false);
        return composite;
    }
    /**
     * Adds a body to the given composite.
     * @method addBody
     * @param composite
     * @param body
     * @return The original composite with the body added
     */
    static addBody(composite, body) {
        composite.bodies.push(body);
        Composite.setModified(composite, true, true, false);
        return composite;
    }
    /**
     * Removes a body from the given composite, and optionally searching its children recursively.
     * @method removeBody
     * @param composite
     * @param body
     * @param deep
     * @return The original composite with the body removed
     */
    static removeBody(composite, body, deep = false) {
        const position = composite.bodies.indexOf(body);
        if (position !== -1) {
            Composite.removeBodyAt(composite, position);
        }
        if (deep) {
            for (const c of composite.composites) {
                Composite.removeBody(c, body, true);
            }
        }
        return composite;
    }
    /**
     * Removes a body from the given composite.
     * @method removeBodyAt
     * @param composite
     * @param position
     * @return The original composite with the body removed
     */
    static removeBodyAt(composite, position) {
        composite.bodies.splice(position, 1);
        Composite.setModified(composite, true, true, false);
        return composite;
    }
    /**
     * Adds a constraint to the given composite.
     * @method addConstraint
     * @param composite
     * @param constraint
     * @return The original composite with the constraint added
     */
    static addConstraint(composite, constraint) {
        composite.constraints.push(constraint);
        Composite.setModified(composite, true, true, false);
        return composite;
    }
    /**
     * Removes a constraint from the given composite, and optionally searching its children recursively.
     * @method removeConstraint
     * @param composite
     * @param constraint
     * @param deep
     * @return The original composite with the constraint removed
     */
    static removeConstraint(composite, constraint, deep = false) {
        const position = composite.constraints.indexOf(constraint);
        if (position !== -1) {
            Composite.removeConstraintAt(composite, position);
        }
        if (deep) {
            for (const c of composite.composites) {
                Composite.removeConstraint(c, constraint, true);
            }
        }
        return composite;
    }
    /**
     * Removes a body from the given composite.
     * @private
     * @method removeConstraintAt
     * @param composite
     * @param position
     * @return The original composite with the constraint removed
     */
    static removeConstraintAt(composite, position) {
        composite.constraints.splice(position, 1);
        Composite.setModified(composite, true, true, false);
        return composite;
    }
    /**
     * Removes all bodies, constraints and composites from the given composite.
     * Optionally clearing its children recursively.
     * @method clear
     * @param composite
     * @param keepStatic
     * @param deep
     */
    static clear(composite, keepStatic, deep = false) {
        if (deep) {
            for (const c of composite.composites) {
                Composite.clear(c, keepStatic, true);
            }
        }
        if (keepStatic) {
            composite.bodies = composite.bodies.filter((body) => {
                return body.isStatic;
            });
        }
        else {
            composite.bodies.length = 0;
        }
        composite.constraints.length = 0;
        composite.composites.length = 0;
        Composite.setModified(composite, true, true, false);
        return composite;
    }
    /**
     * Returns all bodies in the given composite, including all bodies in its children, recursively.
     * @method allBodies
     * @param composite
     * @return All the bodies
     */
    static allBodies(composite) {
        if (composite.cache && composite.cache.allBodies) {
            return composite.cache.allBodies;
        }
        let bodies = [].concat(composite.bodies);
        for (const c of composite.composites)
            bodies = bodies.concat(Composite.allBodies(c));
        if (composite.cache) {
            composite.cache.allBodies = bodies;
        }
        return bodies;
    }
    /**
     * Returns all constraints in the given composite, including all constraints in its children, recursively.
     * @method allConstraints
     * @param composite
     * @return All the constraints
     */
    static allConstraints(composite) {
        if (composite.cache && composite.cache.allConstraints) {
            return composite.cache.allConstraints;
        }
        let constraints = [].concat(composite.constraints);
        for (const c of composite.composites)
            constraints = constraints.concat(Composite.allConstraints(c));
        if (composite.cache) {
            composite.cache.allConstraints = constraints;
        }
        return constraints;
    }
    /**
     * Returns all composites in the given composite, including all composites in its children, recursively.
     * @method allComposites
     * @param composite
     * @return All the composites
     */
    static allComposites(composite) {
        if (composite.cache && composite.cache.allComposites) {
            return composite.cache.allComposites;
        }
        let composites = [].concat(composite.composites);
        for (const c of composite.composites)
            composites = composites.concat(Composite.allComposites(c));
        if (composite.cache) {
            composite.cache.allComposites = composites;
        }
        return composites;
    }
    /**
     * Searches the composite recursively for an object matching the type and id supplied, null if not found.
     * @method get
     * @param composite
     * @param id
     * @param type
     * @return The requested object, if found
     */
    static get(composite, id, type) {
        let objects;
        switch (type) {
            case 'body':
                objects = Composite.allBodies(composite);
                break;
            case 'constraint':
                objects = Composite.allConstraints(composite);
                break;
            case 'composite':
                objects = Composite.allComposites(composite).concat(composite);
                break;
        }
        if (!objects) {
            return null;
        }
        const object = objects.filter((object) => {
            return object.id.toString() === id.toString();
        });
        return object.length === 0 ? null : object[0];
    }
    /**
     * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
     * @method move
     * @param compositeA
     * @param objects
     * @param compositeB
     * @return Returns compositeA
     */
    static move(compositeA, objects, compositeB) {
        Composite.remove(compositeA, objects);
        Composite.add(compositeB, objects);
        return compositeA;
    }
    /**
     * Assigns new ids for all objects in the composite, recursively.
     * @method rebase
     * @param composite
     * @return Returns composite
     */
    static rebase(composite) {
        const objects = []
            .concat(Composite.allBodies(composite))
            .concat(Composite.allConstraints(composite))
            .concat(Composite.allComposites(composite));
        for (let i = 0; i < objects.length; i++) {
            objects[i].id = Common_1.default.nextId();
        }
        return composite;
    }
    /**
     * Translates all children in the composite by a given vector relative to their current positions,
     * without imparting any velocity.
     * @method translate
     * @param composite
     * @param translation
     * @param recursive
     */
    static translate(composite, translation, recursive = true) {
        const bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
        for (const body of bodies) {
            Body_1.default.translate(body, translation);
        }
        return composite;
    }
    /**
     * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
     * @method rotate
     * @param composite
     * @param rotation
     * @param point
     * @param recursive
     */
    static rotate(composite, rotation, point, recursive = true) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
        for (const body of bodies) {
            const dx = body.position.x - point.x;
            const dy = body.position.y - point.y;
            Body_1.default.setPosition(body, {
                x: point.x + (dx * cos - dy * sin),
                y: point.y + (dx * sin + dy * cos),
            });
            Body_1.default.rotate(body, rotation);
        }
        return composite;
    }
    /**
     * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
     * @method scale
     * @param composite
     * @param scaleX
     * @param scaleY
     * @param point
     * @param recursive
     */
    static scale(composite, scaleX, scaleY, point, recursive = true) {
        const bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
        for (const body of bodies) {
            const dx = body.position.x - point.x;
            const dy = body.position.y - point.y;
            Body_1.default.setPosition(body, {
                x: point.x + dx * scaleX,
                y: point.y + dy * scaleY,
            });
            Body_1.default.scale(body, scaleX, scaleY);
        }
        return composite;
    }
    /**
     * Returns the union of the bounds of all of the composite's bodies.
     * @method bounds
     * @param composite The composite.
     * @returns The composite bounds.
     */
    static bounds(composite) {
        const bodies = Composite.allBodies(composite);
        const points = [];
        for (const body of bodies) {
            points.push(body.bounds.min, body.bounds.max);
        }
        return Bounds_1.default.create(Vertices_1.default.create(points));
    }
}
exports["default"] = Composite;


/***/ }),

/***/ 178:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Composite_1 = __importDefault(__webpack_require__(927));
/**
 * This module has now been replaced by `Matter.Composite`.
 *
 * All usage should be migrated to the equivalent functions found on `Matter.Composite`.
 * For example `World.add(world, body)` now becomes `Composite.add(world, body)`.
 *
 * The property `world.gravity` has been moved to `engine.gravity`.
 *
 * For back-compatibility purposes this module will remain as a direct alias to `Matter.Composite` in the short term during migration.
 * Eventually this alias module will be marked as deprecated and then later removed in a future release.
 */
class World {
}
/**
 * See above, aliases for back compatibility only
 */
World.create = Composite_1.default.create;
World.add = Composite_1.default.add;
World.remove = Composite_1.default.remove;
World.clear = Composite_1.default.clear;
World.addComposite = Composite_1.default.addComposite;
World.addBody = Composite_1.default.addBody;
World.addConstraint = Composite_1.default.addConstraint;
exports["default"] = World;


/***/ }),

/***/ 697:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vertices_1 = __importDefault(__webpack_require__(547));
const Pair_1 = __importDefault(__webpack_require__(168));
/**
 * The `Matter.Collision` module contains methods for detecting collisions between a given pair of bodies.
 *
 * For efficient detection between a list of bodies, see `Matter.Detector` and `Matter.Query`.
 *
 * See `Matter.Engine` for collision events.
 */
class Collision {
    /**
     * Creates a new collision record.
     * @method create
     * @param bodyA The first body part represented by the collision record
     * @param bodyB The second body part represented by the collision record
     * @return A new collision record
     */
    static create(bodyA, bodyB) {
        return {
            pair: null,
            collided: false,
            bodyA: bodyA,
            bodyB: bodyB,
            parentA: bodyA.parent,
            parentB: bodyB.parent,
            depth: 0,
            normal: { x: 0, y: 0 },
            tangent: { x: 0, y: 0 },
            penetration: { x: 0, y: 0 },
            supports: [],
        };
    }
    /**
     * Detect collision between two bodies.
     * @method collides
     * @param bodyA
     * @param bodyB
     * @param pairs Optionally reuse collision records from existing pairs.
     * @return A collision record if detected, otherwise null
     */
    static collides(bodyA, bodyB, pairs) {
        var _a, _b;
        Collision._overlapAxes(Collision._overlapAB, bodyA.vertices, bodyB.vertices, bodyA.axes);
        if (Collision._overlapAB.overlap <= 0) {
            return null;
        }
        Collision._overlapAxes(Collision._overlapBA, bodyB.vertices, bodyA.vertices, bodyB.axes);
        if (Collision._overlapBA.overlap <= 0) {
            return null;
        }
        // reuse collision records for gc efficiency
        const pair = pairs && pairs.table[Pair_1.default.id(bodyA, bodyB)];
        let collision;
        if (!pair) {
            collision = Collision.create(bodyA, bodyB);
            collision.collided = true;
            collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
            collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
            collision.parentA = collision.bodyA.parent;
            collision.parentB = collision.bodyB.parent;
        }
        else {
            collision = pair.collision;
        }
        bodyA = collision.bodyA;
        bodyB = collision.bodyB;
        let minOverlap;
        if (Collision._overlapAB.overlap < Collision._overlapBA.overlap) {
            minOverlap = Collision._overlapAB;
        }
        else {
            minOverlap = Collision._overlapBA;
        }
        const normal = collision.normal;
        const supports = collision.supports;
        const minAxis = minOverlap.axis;
        const minAxisX = (_a = minAxis === null || minAxis === void 0 ? void 0 : minAxis.x) !== null && _a !== void 0 ? _a : NaN;
        const minAxisY = (_b = minAxis === null || minAxis === void 0 ? void 0 : minAxis.y) !== null && _b !== void 0 ? _b : NaN;
        // ensure normal is facing away from bodyA
        if (minAxisX * (bodyB.position.x - bodyA.position.x) +
            minAxisY * (bodyB.position.y - bodyA.position.y) <
            0) {
            normal.x = minAxisX;
            normal.y = minAxisY;
        }
        else {
            normal.x = -minAxisX;
            normal.y = -minAxisY;
        }
        collision.tangent.x = -normal.y;
        collision.tangent.y = normal.x;
        collision.depth = minOverlap.overlap;
        collision.penetration.x = normal.x * collision.depth;
        collision.penetration.y = normal.y * collision.depth;
        // find support points, there is always either exactly one or two
        const supportsB = Collision._findSupports(bodyA, bodyB, normal, 1);
        let supportCount = 0;
        // find the supports from bodyB that are inside bodyA
        if (Vertices_1.default.contains(bodyA.vertices, supportsB[0])) {
            supports[supportCount++] = supportsB[0];
        }
        if (Vertices_1.default.contains(bodyA.vertices, supportsB[1])) {
            supports[supportCount++] = supportsB[1];
        }
        // find the supports from bodyA that are inside bodyB
        if (supportCount < 2) {
            const supportsA = Collision._findSupports(bodyB, bodyA, normal, -1);
            if (Vertices_1.default.contains(bodyB.vertices, supportsA[0])) {
                supports[supportCount++] = supportsA[0];
            }
            if (supportCount < 2 && Vertices_1.default.contains(bodyB.vertices, supportsA[1])) {
                supports[supportCount++] = supportsA[1];
            }
        }
        // account for the edge case of overlapping but no vertex containment
        if (supportCount === 0) {
            supports[supportCount++] = supportsB[0];
        }
        // update supports array size
        supports.length = supportCount;
        return collision;
    }
    /**
     * Find the overlap between two sets of vertices.
     * @method _overlapAxes
     * @param result
     * @param verticesA
     * @param verticesB
     * @param axes
     */
    static _overlapAxes(result, verticesA, verticesB, axes) {
        const verticesALength = verticesA.length;
        const verticesBLength = verticesB.length;
        const verticesAX = verticesA[0].x;
        const verticesAY = verticesA[0].y;
        const verticesBX = verticesB[0].x;
        const verticesBY = verticesB[0].y;
        const axesLength = axes.length;
        let overlapMin = Number.MAX_VALUE;
        let overlapAxisNumber = 0;
        for (let i = 0; i < axesLength; i++) {
            const axis = axes[i];
            const axisX = axis.x;
            const axisY = axis.y;
            let minA = verticesAX * axisX + verticesAY * axisY;
            let minB = verticesBX * axisX + verticesBY * axisY;
            let maxA = minA;
            let maxB = minB;
            for (let j = 1; j < verticesALength; j += 1) {
                const dot = verticesA[j].x * axisX + verticesA[j].y * axisY;
                if (dot > maxA) {
                    maxA = dot;
                }
                else if (dot < minA) {
                    minA = dot;
                }
            }
            for (let j = 1; j < verticesBLength; j += 1) {
                const dot = verticesB[j].x * axisX + verticesB[j].y * axisY;
                if (dot > maxB) {
                    maxB = dot;
                }
                else if (dot < minB) {
                    minB = dot;
                }
            }
            const overlapAB = maxA - minB;
            const overlapBA = maxB - minA;
            const overlap = overlapAB < overlapBA ? overlapAB : overlapBA;
            if (overlap < overlapMin) {
                overlapMin = overlap;
                overlapAxisNumber = i;
                if (overlap <= 0) {
                    // can not be intersecting
                    break;
                }
            }
        }
        result.axis = axes[overlapAxisNumber];
        result.overlap = overlapMin;
    }
    /**
     * Projects vertices on an axis and returns an interval.
     * @method _projectToAxis
     * @param projection
     * @param vertices
     * @param axis
     */
    static _projectToAxis(projection, vertices, axis) {
        let min = vertices[0].x * axis.x + vertices[0].y * axis.y;
        let max = min;
        for (let i = 1; i < vertices.length; i += 1) {
            const dot = vertices[i].x * axis.x + vertices[i].y * axis.y;
            if (dot > max) {
                max = dot;
            }
            else if (dot < min) {
                min = dot;
            }
        }
        projection.min = min;
        projection.max = max;
    }
    /**
     * Finds supporting vertices given two bodies along a given direction using hill-climbing.
     * @method _findSupports
     * @param bodyA
     * @param bodyB
     * @param normal
     * @param direction
     */
    static _findSupports(bodyA, bodyB, normal, direction) {
        const vertices = bodyB.vertices;
        const verticesLength = vertices.length;
        const bodyAPositionX = bodyA.position.x;
        const bodyAPositionY = bodyA.position.y;
        const normalX = normal.x * direction;
        const normalY = normal.y * direction;
        let nearestDistance = Number.MAX_VALUE;
        let vertexA = vertices[0];
        let vertexB;
        // find deepest vertex relative to the axis
        for (let j = 0; j < verticesLength; j += 1) {
            vertexB = vertices[j];
            const distance = normalX * (bodyAPositionX - vertexB.x) +
                normalY * (bodyAPositionY - vertexB.y);
            // convex hill-climbing
            if (distance < nearestDistance) {
                nearestDistance = distance;
                vertexA = vertexB;
            }
        }
        // measure next vertex
        const vertexC = vertices[(verticesLength + vertexA.index - 1) % verticesLength];
        nearestDistance =
            normalX * (bodyAPositionX - vertexC.x) +
                normalY * (bodyAPositionY - vertexC.y);
        // compare with previous vertex
        vertexB = vertices[(vertexA.index + 1) % verticesLength];
        if (normalX * (bodyAPositionX - vertexB.x) +
            normalY * (bodyAPositionY - vertexB.y) <
            nearestDistance) {
            Collision._supports[0] = vertexA;
            Collision._supports[1] = vertexB;
            return Collision._supports;
        }
        Collision._supports[0] = vertexA;
        Collision._supports[1] = vertexC;
        return Collision._supports;
    }
}
Collision._supports = [];
Collision._overlapAB = {
    overlap: 0,
    axis: null,
};
Collision._overlapBA = {
    overlap: 0,
    axis: null,
};
exports["default"] = Collision;


/***/ }),

/***/ 461:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The `Matter.Contact` module contains methods for creating and manipulating collision contacts.
 */
class Contact {
    /**
     * Creates a new contact.
     * @method create
     * @param {vertex} vertex
     * @return {contact} A new contact
     */
    static create(vertex) {
        return {
            vertex: vertex,
            normalImpulse: 0,
            tangentImpulse: 0,
        };
    }
}
exports["default"] = Contact;


/***/ }),

/***/ 493:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Collision_1 = __importDefault(__webpack_require__(697));
/**
 * The `Matter.Detector` module contains methods for efficiently detecting collisions between a list of bodies using a broadphase algorithm.
 */
class Detector {
    /**
     * Creates a new collision detector.
     * @method create
     * @param options
     * @return A new collision detector
     */
    static create(options) {
        const defaults = {
            bodies: [],
            pairs: null,
        };
        return Common_1.default.extend(defaults, options);
    }
    /**
     * Sets the list of bodies in the detector.
     * @method setBodies
     * @param detector
     * @param bodies
     */
    static setBodies(detector, bodies) {
        detector.bodies = bodies.slice(0);
    }
    /**
     * Clears the detector including its list of bodies.
     * @method clear
     * @param detector
     */
    static clear(detector) {
        detector.bodies = [];
    }
    /**
     * Efficiently finds all collisions among all the bodies in `detector.bodies` using a broadphase algorithm.
     *
     * _Note:_ The specific ordering of collisions returned is not guaranteed between releases and may change for performance reasons.
     * If a specific ordering is required then apply a sort to the resulting array.
     * @method collisions
     * @param detector
     * @return collisions
     */
    static collisions(detector) {
        const collisions = [];
        const pairs = detector.pairs;
        const bodies = detector.bodies;
        const bodiesLength = bodies.length;
        bodies.sort(Detector._compareBoundsX);
        for (let i = 0; i < bodiesLength; i++) {
            const bodyA = bodies[i];
            const boundXMax = bodyA.bounds.max.x;
            const boundYMax = bodyA.bounds.max.y;
            const boundYMin = bodyA.bounds.min.y;
            const bodyAStatic = bodyA.isStatic || bodyA.isSleeping;
            const partsALength = bodyA.parts.length;
            const partsASingle = partsALength === 1;
            for (let j = i + 1; j < bodiesLength; j++) {
                const bodyB = bodies[j];
                const boundsB = bodyB.bounds;
                if (boundsB.min.x > boundXMax) {
                    break;
                }
                if (boundYMax < boundsB.min.y || boundYMin > boundsB.max.y) {
                    continue;
                }
                if (bodyAStatic && (bodyB.isStatic || bodyB.isSleeping)) {
                    continue;
                }
                if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter)) {
                    continue;
                }
                const partsBLength = bodyB.parts.length;
                if (partsASingle && partsBLength === 1) {
                    const collision = Collision_1.default.collides(bodyA, bodyB, pairs);
                    if (collision) {
                        collisions.push(collision);
                    }
                }
                else {
                    const partsAStart = partsALength > 1 ? 1 : 0;
                    const partsBStart = partsBLength > 1 ? 1 : 0;
                    for (let k = partsAStart; k < partsALength; k++) {
                        const partA = bodyA.parts[k];
                        const boundsA = partA.bounds;
                        for (let z = partsBStart; z < partsBLength; z++) {
                            const partB = bodyB.parts[z];
                            const boundsB = partB.bounds;
                            if (boundsA.min.x > boundsB.max.x ||
                                boundsA.max.x < boundsB.min.x ||
                                boundsA.max.y < boundsB.min.y ||
                                boundsA.min.y > boundsB.max.y) {
                                continue;
                            }
                            const collision = Collision_1.default.collides(partA, partB, pairs);
                            if (collision) {
                                collisions.push(collision);
                            }
                        }
                    }
                }
            }
        }
        return collisions;
    }
    /**
     * Returns `true` if both supplied collision filters will allow a collision to occur.
     * See `body.collisionFilter` for more information.
     * @method canCollide
     * @param filterA
     * @param filterB
     * @return `true` if collision can occur
     */
    static canCollide(filterA, filterB) {
        if (filterA.group === filterB.group && filterA.group !== 0) {
            return filterA.group > 0;
        }
        return ((filterA.mask & filterB.category) !== 0 &&
            (filterB.mask & filterA.category) !== 0);
    }
    /**
     * The comparison function used in the broadphase algorithm.
     * Returns the signed delta of the bodies bounds on the x-axis.
     * @method _sortCompare
     * @param bodyA
     * @param bodyB
     * @return The signed delta used for sorting
     */
    static _compareBoundsX(bodyA, bodyB) {
        return bodyA.bounds.min.x - bodyB.bounds.min.x;
    }
}
exports["default"] = Detector;


/***/ }),

/***/ 281:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Pair_1 = __importDefault(__webpack_require__(168));
/**
 * This module has now been replaced by `Matter.Detector`.
 *
 * All usage should be migrated to `Matter.Detector` or another alternative.
 * For back-compatibility purposes this module will remain for a short term and then later removed in a future release.
 *
 * The `Matter.Grid` module contains methods for creating and manipulating collision broadphase grid structures.
 *
 * @deprecated
 */
class Grid {
    /**
     * Creates a new grid.
     * @deprecated replaced by Matter.Detector
     * @method create
     * @param options
     * @return A new grid
     */
    static create(options = {}) {
        const defaults = {
            buckets: {},
            pairs: {},
            pairsList: [],
            bucketWidth: 48,
            bucketHeight: 48,
        };
        return Common_1.default.extend(defaults, options);
    }
    /**
     * Updates the grid.
     * @deprecated replaced by Matter.Detector
     * @method update
     * @param grid
     * @param bodies
     * @param engine
     * @param forceUpdate
     */
    static update(grid, bodies, engine, forceUpdate) {
        let gridChanged = false;
        const world = engine.world;
        const buckets = grid.buckets;
        for (const body of bodies) {
            if (body.isSleeping && !forceUpdate) {
                continue;
            }
            // temporary back compatibility bounds check
            if ('bounds' in world) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bounds = world.bounds;
                if (body.bounds.max.x < bounds.min.x ||
                    body.bounds.min.x > bounds.max.x ||
                    body.bounds.max.y < bounds.min.y ||
                    body.bounds.min.y > bounds.max.y) {
                    continue;
                }
            }
            const newRegion = Grid._getRegion(grid, body);
            // if the body has changed grid region
            if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
                if (!body.region || forceUpdate) {
                    body.region = newRegion;
                }
                const union = Grid._regionUnion(newRegion, body.region);
                // update grid buckets affected by region change
                // iterate over the union of both regions
                for (let col = union.startCol; col <= union.endCol; col++) {
                    for (let row = union.startRow; row <= union.endRow; row++) {
                        const bucketId = Grid._getBucketId(col, row);
                        let bucket = buckets[bucketId];
                        const isInsideNewRegion = col >= newRegion.startCol &&
                            col <= newRegion.endCol &&
                            row >= newRegion.startRow &&
                            row <= newRegion.endRow;
                        const isInsideOldRegion = col >= body.region.startCol &&
                            col <= body.region.endCol &&
                            row >= body.region.startRow &&
                            row <= body.region.endRow;
                        // remove from old region buckets
                        if (!isInsideNewRegion && isInsideOldRegion) {
                            if (isInsideOldRegion) {
                                if (bucket) {
                                    Grid._bucketRemoveBody(grid, bucket, body);
                                }
                            }
                        }
                        // add to new region buckets
                        if (body.region === newRegion ||
                            (isInsideNewRegion && !isInsideOldRegion) ||
                            forceUpdate) {
                            if (!bucket) {
                                bucket = Grid._createBucket(buckets, bucketId);
                            }
                            Grid._bucketAddBody(grid, bucket, body);
                        }
                    }
                }
                // set the new region
                body.region = newRegion;
                // flag changes so we can update pairs
                gridChanged = true;
            }
        }
        // update pairs list only if pairs changed (i.e. a body changed region)
        if (gridChanged) {
            grid.pairsList = Grid._createActivePairsList(grid);
        }
    }
    /**
     * Clears the grid.
     * @deprecated replaced by Matter.Detector
     * @method clear
     * @param grid
     */
    static clear(grid) {
        grid.buckets = {};
        grid.pairs = {};
        grid.pairsList = [];
    }
    /**
     * Finds the union of two regions.
     * @method _regionUnion
     * @deprecated replaced by Matter.Detector
     * @param regionA
     * @param regionB
     * @return region
     */
    static _regionUnion(regionA, regionB) {
        const startCol = Math.min(regionA.startCol, regionB.startCol);
        const endCol = Math.max(regionA.endCol, regionB.endCol);
        const startRow = Math.min(regionA.startRow, regionB.startRow);
        const endRow = Math.max(regionA.endRow, regionB.endRow);
        return Grid._createRegion(startCol, endCol, startRow, endRow);
    }
    /**
     * Gets the region a given body falls in for a given grid.
     * @method _getRegion
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @param body
     * @return region
     */
    static _getRegion(grid, body) {
        const bounds = body.bounds;
        const startCol = Math.floor(bounds.min.x / grid.bucketWidth);
        const endCol = Math.floor(bounds.max.x / grid.bucketWidth);
        const startRow = Math.floor(bounds.min.y / grid.bucketHeight);
        const endRow = Math.floor(bounds.max.y / grid.bucketHeight);
        return Grid._createRegion(startCol, endCol, startRow, endRow);
    }
    /**
     * Creates a region.
     * @method _createRegion
     * @deprecated replaced by Matter.Detector
     * @param startCol
     * @param endCol
     * @param startRow
     * @param endRow
     * @return region
     */
    static _createRegion(startCol, endCol, startRow, endRow) {
        return {
            id: startCol + ',' + endCol + ',' + startRow + ',' + endRow,
            startCol: startCol,
            endCol: endCol,
            startRow: startRow,
            endRow: endRow,
        };
    }
    /**
     * Gets the bucket id at the given position.
     * @method _getBucketId
     * @deprecated replaced by Matter.Detector
     * @param column
     * @param row
     * @return bucket id
     */
    static _getBucketId(column, row) {
        return 'C' + column + 'R' + row;
    }
    /**
     * Creates a bucket.
     * @method _createBucket
     * @deprecated replaced by Matter.Detector
     * @param buckets
     * @param bucketId
     * @return bucket
     */
    static _createBucket(buckets, bucketId) {
        const bucket = (buckets[bucketId] = []);
        return bucket;
    }
    /**
     * Adds a body to a bucket.
     * @method _bucketAddBody
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @param bucket
     * @param body
     */
    static _bucketAddBody(grid, bucket, body) {
        const gridPairs = grid.pairs;
        // add new pairs
        for (const bodyB of bucket) {
            if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic)) {
                continue;
            }
            // keep track of the number of buckets the pair exists in
            // important for Grid.update to work
            const id = Pair_1.default.id(body, bodyB);
            const pair = gridPairs[id];
            if (pair) {
                pair[2] += 1;
            }
            else {
                gridPairs[id] = [body, bodyB, 1];
            }
        }
        // add to bodies (after pairs, otherwise pairs with self)
        bucket.push(body);
    }
    /**
     * Removes a body from a bucket.
     * @method _bucketRemoveBody
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @param bucket
     * @param body
     */
    static _bucketRemoveBody(grid, bucket, body) {
        // remove from bucket
        bucket.splice(bucket.indexOf(body), 1);
        // update pair counts
        for (let i = 0; i < bucket.length; i++) {
            // keep track of the number of buckets the pair exists in
            // important for _createActivePairsList to work
            const pair = grid.pairs[Pair_1.default.id(body, bucket[i])];
            if (pair) {
                pair[2] -= 1;
            }
        }
    }
    /**
     * Generates a list of the active pairs in the grid.
     * @method _createActivePairsList
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @return pairs
     */
    static _createActivePairsList(grid) {
        const gridPairs = grid.pairs;
        const pairKeys = Object.keys(gridPairs);
        const pairKeysLength = pairKeys.length;
        const pairs = [];
        // iterate over grid.pairs
        for (let k = 0; k < pairKeysLength; k++) {
            const pair = gridPairs[pairKeys[k]];
            // if pair exists in at least one bucket
            // it is a pair that needs further collision testing so push it
            if (pair[2] > 0) {
                pairs.push(pair);
            }
            else {
                delete gridPairs[pairKeys[k]];
            }
        }
        return pairs;
    }
}
exports["default"] = Grid;
// eslint-disable-next-line no-extra-semi
;
(() => {
    Common_1.default.deprecated(Grid, 'update', 'Grid.update ➤ replaced by Matter.Detector');
    Common_1.default.deprecated(Grid, 'clear', 'Grid.clear ➤ replaced by Matter.Detector');
})();


/***/ }),

/***/ 168:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Contact_1 = __importDefault(__webpack_require__(461));
/**
 * The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
 */
class Pair {
    /**
     * Creates a pair.
     * @method create
     * @param collision
     * @param timestamp
     * @return A new pair
     */
    static create(collision, timestamp) {
        const bodyA = collision.bodyA;
        const bodyB = collision.bodyB;
        const pair = {
            id: Pair.id(bodyA, bodyB),
            bodyA: bodyA,
            bodyB: bodyB,
            collision: collision,
            contacts: [],
            activeContacts: [],
            separation: 0,
            isActive: true,
            confirmedActive: true,
            isSensor: bodyA.isSensor || bodyB.isSensor,
            timeCreated: timestamp,
            timeUpdated: timestamp,
            inverseMass: 0,
            friction: 0,
            frictionStatic: 0,
            restitution: 0,
            slop: 0,
        };
        Pair.update(pair, collision, timestamp);
        return pair;
    }
    /**
     * Updates a pair given a collision.
     * @method update
     * @param pair
     * @param collision
     * @param timestamp
     */
    static update(pair, collision, timestamp) {
        const contacts = pair.contacts;
        const supports = collision.supports;
        const activeContacts = pair.activeContacts;
        const parentA = collision.parentA;
        const parentB = collision.parentB;
        const parentAVerticesLength = parentA.vertices.length;
        pair.isActive = true;
        pair.timeUpdated = timestamp;
        pair.collision = collision;
        pair.separation = collision.depth;
        pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
        pair.friction =
            parentA.friction < parentB.friction ? parentA.friction : parentB.friction;
        pair.frictionStatic =
            parentA.frictionStatic > parentB.frictionStatic
                ? parentA.frictionStatic
                : parentB.frictionStatic;
        pair.restitution =
            parentA.restitution > parentB.restitution
                ? parentA.restitution
                : parentB.restitution;
        pair.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop;
        collision.pair = pair;
        activeContacts.length = 0;
        for (const support of supports) {
            const contactId = support.body === parentA
                ? support.index
                : parentAVerticesLength + support.index;
            const contact = contacts[contactId];
            if (contact) {
                activeContacts.push(contact);
            }
            else {
                activeContacts.push((contacts[contactId] = Contact_1.default.create(support)));
            }
        }
    }
    /**
     * Set a pair as active or inactive.
     * @method setActive
     * @param pair
     * @param isActive
     * @param timestamp
     */
    static setActive(pair, isActive, timestamp) {
        if (isActive) {
            pair.isActive = true;
            pair.timeUpdated = timestamp;
        }
        else {
            pair.isActive = false;
            pair.activeContacts.length = 0;
        }
    }
    /**
     * Get the id for the given pair.
     * @method id
     * @param bodyA
     * @param bodyB
     * @return Unique pairId
     */
    static id(bodyA, bodyB) {
        if (bodyA.id < bodyB.id) {
            return 'A' + bodyA.id + 'B' + bodyB.id;
        }
        else {
            return 'A' + bodyB.id + 'B' + bodyA.id;
        }
    }
}
exports["default"] = Pair;


/***/ }),

/***/ 577:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Pair_1 = __importDefault(__webpack_require__(168));
/**
 * The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
 */
class Pairs {
    /**
     * Creates a new pairs structure.
     * @method create
     * @param options
     * @return A new pairs structure
     */
    static create(options) {
        const defaults = {
            table: {},
            list: [],
            collisionStart: [],
            collisionActive: [],
            collisionEnd: [],
        };
        return Common_1.default.extend(defaults, options);
    }
    /**
     * Updates pairs given a list of collisions.
     * @method update
     * @param pairs
     * @param collisions
     * @param timestamp
     */
    static update(pairs, collisions, timestamp) {
        const pairsList = pairs.list;
        let pairsListLength = pairsList.length;
        const pairsTable = pairs.table;
        const collisionStart = pairs.collisionStart;
        const collisionEnd = pairs.collisionEnd;
        const collisionActive = pairs.collisionActive;
        // clear collision state arrays, but maintain old reference
        collisionStart.length = 0;
        collisionEnd.length = 0;
        collisionActive.length = 0;
        for (let i = 0; i < pairsListLength; i++) {
            pairsList[i].confirmedActive = false;
        }
        for (const collision of collisions) {
            let pair = collision.pair;
            if (pair) {
                // pair already exists (but may or may not be active)
                if (pair.isActive) {
                    // pair exists and is active
                    collisionActive.push(pair);
                }
                else {
                    // pair exists but was inactive, so a collision has just started again
                    collisionStart.push(pair);
                }
                // update the pair
                Pair_1.default.update(pair, collision, timestamp);
                pair.confirmedActive = true;
            }
            else {
                // pair did not exist, create a new pair
                pair = Pair_1.default.create(collision, timestamp);
                pairsTable[pair.id] = pair;
                // push the new pair
                collisionStart.push(pair);
                pairsList.push(pair);
            }
        }
        // find pairs that are no longer active
        const removePairIndex = [];
        pairsListLength = pairsList.length;
        for (let i = 0; i < pairsListLength; i++) {
            const pair = pairsList[i];
            if (!pair.confirmedActive) {
                Pair_1.default.setActive(pair, false, timestamp);
                collisionEnd.push(pair);
                if (!pair.collision.bodyA.isSleeping &&
                    !pair.collision.bodyB.isSleeping) {
                    removePairIndex.push(i);
                }
            }
        }
        // remove inactive pairs
        for (let i = 0; i < removePairIndex.length; i++) {
            const pairIndex = removePairIndex[i] - i;
            const pair = pairsList[pairIndex];
            pairsList.splice(pairIndex, 1);
            delete pairsTable[pair.id];
        }
    }
    /**
     * Clears the given pairs structure.
     * @method clear
     * @param pairs
     * @return pairs
     */
    static clear(pairs) {
        pairs.table = {};
        pairs.list.length = 0;
        pairs.collisionStart.length = 0;
        pairs.collisionActive.length = 0;
        pairs.collisionEnd.length = 0;
        return pairs;
    }
}
exports["default"] = Pairs;


/***/ }),

/***/ 280:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Bodies_1 = __importDefault(__webpack_require__(392));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vector_1 = __importDefault(__webpack_require__(795));
const Vertices_1 = __importDefault(__webpack_require__(547));
const Collision_1 = __importDefault(__webpack_require__(697));
/**
 * The `Matter.Query` module contains methods for performing collision queries.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Query {
    /**
     * Returns a list of collisions between `body` and `bodies`.
     * @method collides
     * @param body
     * @param bodies
     * @return Collisions
     */
    static collides(body, bodies) {
        const collisions = [];
        const bounds = body.bounds;
        for (const bodyA of bodies) {
            const partsALength = bodyA.parts.length;
            const partsAStart = partsALength === 1 ? 0 : 1;
            if (Bounds_1.default.overlaps(bodyA.bounds, bounds)) {
                for (let j = partsAStart; j < partsALength; j++) {
                    const part = bodyA.parts[j];
                    if (Bounds_1.default.overlaps(part.bounds, bounds)) {
                        const collision = Collision_1.default.collides(part, body);
                        if (collision) {
                            collisions.push(collision);
                            break;
                        }
                    }
                }
            }
        }
        return collisions;
    }
    /**
     * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
     * @method ray
     * @param bodies
     * @param startPoint
     * @param endPoint
     * @param rayWidth
     * @return Collisions
     */
    static ray(bodies, startPoint, endPoint, rayWidth = 1e-100) {
        const rayAngle = Vector_1.default.angle(startPoint, endPoint);
        const rayLength = Vector_1.default.magnitude(Vector_1.default.sub(startPoint, endPoint));
        const rayX = (endPoint.x + startPoint.x) * 0.5;
        const rayY = (endPoint.y + startPoint.y) * 0.5;
        const ray = Bodies_1.default.rectangle(rayX, rayY, rayLength, rayWidth, {
            angle: rayAngle,
        });
        const collisions = Query.collides(ray, bodies);
        for (const collision of collisions) {
            collision.body = collision.bodyB = collision.bodyA;
        }
        return collisions;
    }
    /**
     * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
     * @method region
     * @param bodies
     * @param bounds
     * @param outside
     * @return The bodies matching the query
     */
    static region(bodies, bounds, outside = false) {
        const result = [];
        for (const body of bodies) {
            const overlaps = Bounds_1.default.overlaps(body.bounds, bounds);
            if ((overlaps && !outside) || (!overlaps && outside)) {
                result.push(body);
            }
        }
        return result;
    }
    /**
     * Returns all bodies whose vertices contain the given point, from the given set of bodies.
     * @method point
     * @param {body[]} bodies
     * @param {vector} point
     * @return {body[]} The bodies matching the query
     */
    static point(bodies, point) {
        const result = [];
        for (const body of bodies) {
            if (Bounds_1.default.contains(body.bounds, point)) {
                const initJ = body.parts.length === 1 ? 0 : 1;
                for (let j = initJ; j < body.parts.length; j++) {
                    const part = body.parts[j];
                    if (Bounds_1.default.contains(part.bounds, point) &&
                        Vertices_1.default.contains(part.vertices, point)) {
                        result.push(body);
                        break;
                    }
                }
            }
        }
        return result;
    }
}
exports["default"] = Query;


/***/ }),

/***/ 561:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vertices_1 = __importDefault(__webpack_require__(547));
/**
 * The `Matter.Resolver` module contains methods for resolving collision pairs.
 */
class Resolver {
    /**
     * Prepare pairs for position solving.
     * @method preSolvePosition
     * @param pairs
     */
    static preSolvePosition(pairs) {
        // find total contacts on each body
        for (const pair of pairs) {
            if (!pair.isActive) {
                continue;
            }
            const activeCount = pair.activeContacts.length;
            pair.collision.parentA.totalContacts += activeCount;
            pair.collision.parentB.totalContacts += activeCount;
        }
    }
    /**
     * Find a solution for pair positions.
     * @method solvePosition
     * @param pairs
     * @param delta
     * @param damping
     */
    static solvePosition(pairs, delta, damping = 1) {
        const positionDampen = Resolver._positionDampen * (damping || 1);
        const slopDampen = Common_1.default.clamp(delta / Common_1.default._baseDelta, 0, 1);
        // find impulses required to resolve penetration
        for (const pair of pairs) {
            if (!pair.isActive || pair.isSensor) {
                continue;
            }
            const collision = pair.collision;
            const bodyA = collision.parentA;
            const bodyB = collision.parentB;
            const normal = collision.normal;
            // get current separation between body edges involved in collision
            pair.separation =
                normal.x *
                    (bodyB.positionImpulse.x +
                        collision.penetration.x -
                        bodyA.positionImpulse.x) +
                    normal.y *
                        (bodyB.positionImpulse.y +
                            collision.penetration.y -
                            bodyA.positionImpulse.y);
        }
        for (const pair of pairs) {
            if (!pair.isActive || pair.isSensor) {
                continue;
            }
            const collision = pair.collision;
            const bodyA = collision.parentA;
            const bodyB = collision.parentB;
            const normal = collision.normal;
            let positionImpulse = pair.separation - pair.slop * slopDampen;
            if (bodyA.isStatic || bodyB.isStatic) {
                positionImpulse *= 2;
            }
            if (!(bodyA.isStatic || bodyA.isSleeping)) {
                const contactShare = positionDampen / bodyA.totalContacts;
                bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
                bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
            }
            if (!(bodyB.isStatic || bodyB.isSleeping)) {
                const contactShare = positionDampen / bodyB.totalContacts;
                bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
                bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
            }
        }
    }
    /**
     * Apply position resolution.
     * @method postSolvePosition
     * @param bodies
     */
    static postSolvePosition(bodies) {
        const positionWarming = Resolver._positionWarming;
        for (const body of bodies) {
            const positionImpulse = body.positionImpulse;
            const positionImpulseX = positionImpulse.x;
            const positionImpulseY = positionImpulse.y;
            const velocity = body.velocity;
            // reset contact count
            body.totalContacts = 0;
            if (positionImpulseX !== 0 || positionImpulseY !== 0) {
                // update body geometry
                for (const part of body.parts) {
                    Vertices_1.default.translate(part.vertices, positionImpulse);
                    Bounds_1.default.update(part.bounds, part.vertices, velocity);
                    part.position.x += positionImpulseX;
                    part.position.y += positionImpulseY;
                }
                // move the body without changing velocity
                body.positionPrev.x += positionImpulseX;
                body.positionPrev.y += positionImpulseY;
                if (positionImpulseX * velocity.x + positionImpulseY * velocity.y < 0) {
                    // reset cached impulse if the body has velocity along it
                    positionImpulse.x = 0;
                    positionImpulse.y = 0;
                }
                else {
                    // warm the next iteration
                    positionImpulse.x *= positionWarming;
                    positionImpulse.y *= positionWarming;
                }
            }
        }
    }
    /**
     * Prepare pairs for velocity solving.
     * @method preSolveVelocity
     * @param pairs
     */
    static preSolveVelocity(pairs) {
        for (const pair of pairs) {
            if (!pair.isActive || pair.isSensor) {
                continue;
            }
            const collision = pair.collision;
            const bodyA = collision.parentA;
            const bodyB = collision.parentB;
            const normal = collision.normal;
            const tangent = collision.tangent;
            // resolve each contact
            for (const contact of pair.activeContacts) {
                const contactVertex = contact.vertex;
                const normalImpulse = contact.normalImpulse;
                const tangentImpulse = contact.tangentImpulse;
                if (normalImpulse !== 0 || tangentImpulse !== 0) {
                    // total impulse from contact
                    const impulseX = normal.x * normalImpulse + tangent.x * tangentImpulse;
                    const impulseY = normal.y * normalImpulse + tangent.y * tangentImpulse;
                    // apply impulse from contact
                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
                        bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
                        bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
                        bodyA.anglePrev +=
                            bodyA.inverseInertia *
                                ((contactVertex.x - bodyA.position.x) * impulseY -
                                    (contactVertex.y - bodyA.position.y) * impulseX);
                    }
                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
                        bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
                        bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
                        bodyB.anglePrev -=
                            bodyB.inverseInertia *
                                ((contactVertex.x - bodyB.position.x) * impulseY -
                                    (contactVertex.y - bodyB.position.y) * impulseX);
                    }
                }
            }
        }
    }
    /**
     * Find a solution for pair velocities.
     * @method solveVelocity
     * @param pairs
     * @param delta
     */
    static solveVelocity(pairs, delta) {
        const timeScale = delta / Common_1.default._baseDelta;
        const timeScaleSquared = timeScale * timeScale;
        const timeScaleCubed = timeScaleSquared * timeScale;
        const restingThresh = -Resolver._restingThresh * timeScale;
        const restingThreshTangent = Resolver._restingThreshTangent;
        const frictionNormalMultiplier = Resolver._frictionNormalMultiplier * timeScale;
        const frictionMaxStatic = Resolver._frictionMaxStatic;
        let tangentImpulse;
        let maxFriction;
        for (const pair of pairs) {
            if (!pair.isActive || pair.isSensor) {
                continue;
            }
            const collision = pair.collision;
            const bodyA = collision.parentA;
            const bodyB = collision.parentB;
            const bodyAVelocity = bodyA.velocity;
            const bodyBVelocity = bodyB.velocity;
            const normalX = collision.normal.x;
            const normalY = collision.normal.y;
            const tangentX = collision.tangent.x;
            const tangentY = collision.tangent.y;
            const contacts = pair.activeContacts;
            const contactsLength = contacts.length;
            const contactShare = 1 / contactsLength;
            const inverseMassTotal = bodyA.inverseMass + bodyB.inverseMass;
            const friction = pair.friction * pair.frictionStatic * frictionNormalMultiplier;
            // update body velocities
            bodyAVelocity.x = bodyA.position.x - bodyA.positionPrev.x;
            bodyAVelocity.y = bodyA.position.y - bodyA.positionPrev.y;
            bodyBVelocity.x = bodyB.position.x - bodyB.positionPrev.x;
            bodyBVelocity.y = bodyB.position.y - bodyB.positionPrev.y;
            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
            // resolve each contact
            for (const contact of pair.activeContacts) {
                const contactVertex = contact.vertex;
                const offsetAX = contactVertex.x - bodyA.position.x;
                const offsetAY = contactVertex.y - bodyA.position.y;
                const offsetBX = contactVertex.x - bodyB.position.x;
                const offsetBY = contactVertex.y - bodyB.position.y;
                const velocityPointAX = bodyAVelocity.x - offsetAY * bodyA.angularVelocity;
                const velocityPointAY = bodyAVelocity.y + offsetAX * bodyA.angularVelocity;
                const velocityPointBX = bodyBVelocity.x - offsetBY * bodyB.angularVelocity;
                const velocityPointBY = bodyBVelocity.y + offsetBX * bodyB.angularVelocity;
                const relativeVelocityX = velocityPointAX - velocityPointBX, relativeVelocityY = velocityPointAY - velocityPointBY;
                const normalVelocity = normalX * relativeVelocityX + normalY * relativeVelocityY;
                const tangentVelocity = tangentX * relativeVelocityX + tangentY * relativeVelocityY;
                // coulomb friction
                const normalOverlap = pair.separation + normalVelocity;
                let normalForce = Math.min(normalOverlap, 1);
                normalForce = normalOverlap < 0 ? 0 : normalForce;
                const frictionLimit = normalForce * friction;
                if (tangentVelocity < -frictionLimit ||
                    tangentVelocity > frictionLimit) {
                    maxFriction = tangentVelocity > 0 ? tangentVelocity : -tangentVelocity;
                    tangentImpulse =
                        pair.friction * (tangentVelocity > 0 ? 1 : -1) * timeScaleCubed;
                    if (tangentImpulse < -maxFriction) {
                        tangentImpulse = -maxFriction;
                    }
                    else if (tangentImpulse > maxFriction) {
                        tangentImpulse = maxFriction;
                    }
                }
                else {
                    tangentImpulse = tangentVelocity;
                    maxFriction = frictionMaxStatic;
                }
                // account for mass, inertia and contact offset
                const oAcN = offsetAX * normalY - offsetAY * normalX;
                const oBcN = offsetBX * normalY - offsetBY * normalX;
                const share = contactShare /
                    (inverseMassTotal +
                        bodyA.inverseInertia * oAcN * oAcN +
                        bodyB.inverseInertia * oBcN * oBcN);
                // raw impulses
                let normalImpulse = (1 + pair.restitution) * normalVelocity * share;
                tangentImpulse *= share;
                // handle high velocity and resting collisions separately
                if (normalVelocity < restingThresh) {
                    // high normal velocity so clear cached contact normal impulse
                    contact.normalImpulse = 0;
                }
                else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // impulse constraint tends to 0
                    const contactNormalImpulse = contact.normalImpulse;
                    contact.normalImpulse += normalImpulse;
                    if (contact.normalImpulse > 0) {
                        contact.normalImpulse = 0;
                    }
                    normalImpulse = contact.normalImpulse - contactNormalImpulse;
                }
                // handle high velocity and resting collisions separately
                if (tangentVelocity < -restingThreshTangent ||
                    tangentVelocity > restingThreshTangent) {
                    // high tangent velocity so clear cached contact tangent impulse
                    contact.tangentImpulse = 0;
                }
                else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // tangent impulse tends to -tangentSpeed or +tangentSpeed
                    const contactTangentImpulse = contact.tangentImpulse;
                    contact.tangentImpulse += tangentImpulse;
                    if (contact.tangentImpulse < -maxFriction) {
                        contact.tangentImpulse = -maxFriction;
                    }
                    if (contact.tangentImpulse > maxFriction) {
                        contact.tangentImpulse = maxFriction;
                    }
                    tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
                }
                // total impulse from contact
                const impulseX = normalX * normalImpulse + tangentX * tangentImpulse;
                const impulseY = normalY * normalImpulse + tangentY * tangentImpulse;
                // apply impulse from contact
                if (!(bodyA.isStatic || bodyA.isSleeping)) {
                    bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
                    bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
                    bodyA.anglePrev +=
                        (offsetAX * impulseY - offsetAY * impulseX) * bodyA.inverseInertia;
                }
                if (!(bodyB.isStatic || bodyB.isSleeping)) {
                    bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
                    bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
                    bodyB.anglePrev -=
                        (offsetBX * impulseY - offsetBY * impulseX) * bodyB.inverseInertia;
                }
            }
        }
    }
}
Resolver._restingThresh = 2;
Resolver._restingThreshTangent = Math.sqrt(6);
Resolver._positionDampen = 0.9;
Resolver._positionWarming = 0.8;
Resolver._frictionNormalMultiplier = 5;
Resolver._frictionMaxStatic = Number.MAX_VALUE;
exports["default"] = Resolver;


/***/ }),

/***/ 408:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Collision_1 = __importDefault(__webpack_require__(697));
/**
 * This module has now been replaced by `Matter.Collision`.
 *
 * All usage should be migrated to `Matter.Collision`.
 * For back-compatibility purposes this module will remain for a short term and then later removed in a future release.
 *
 * The `Matter.SAT` module contains methods for detecting collisions using the Separating Axis Theorem.
 *
 * @deprecated
 */
class SAT {
    /**
     * Detect collision between two bodies using the Separating Axis Theorem.
     * @deprecated replaced by Collision.collides
     * @method collides
     * @param bodyA
     * @param bodyB
     * @return collision
     */
    static collides(bodyA, bodyB) {
        return Collision_1.default.collides(bodyA, bodyB);
    }
}
exports["default"] = SAT;
// eslint-disable-next-line no-extra-semi
;
(function () {
    Common_1.default.deprecated(SAT, 'collides', 'SAT.collides ➤ replaced by Collision.collides');
});


/***/ }),

/***/ 61:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Sleeping_1 = __importDefault(__webpack_require__(464));
const Axes_1 = __importDefault(__webpack_require__(631));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vector_1 = __importDefault(__webpack_require__(795));
const Vertices_1 = __importDefault(__webpack_require__(547));
/**
 * The `Matter.Constraint` module contains methods for creating and manipulating constraints.
 * Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
 * The stiffness of constraints can be modified to create springs or elastic.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Constraint {
    /**
     * Creates a new constraint.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
     * For compound bodies, constraints must be applied to the parent body (not one of its parts).
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return constraint
     */
    static create(options) {
        var _a;
        const constraint = options;
        // if bodies defined but no points, use body centre
        if (constraint.bodyA && !constraint.pointA) {
            constraint.pointA = { x: 0, y: 0 };
        }
        if (constraint.bodyB && !constraint.pointB) {
            constraint.pointB = { x: 0, y: 0 };
        }
        // calculate static length using initial world space points
        const initialPointA = constraint.bodyA
            ? Vector_1.default.add(constraint.bodyA.position, constraint.pointA)
            : constraint.pointA;
        const initialPointB = constraint.bodyB
            ? Vector_1.default.add(constraint.bodyB.position, constraint.pointB)
            : constraint.pointB;
        const length = Vector_1.default.magnitude(Vector_1.default.sub(initialPointA, initialPointB));
        constraint.length = (_a = constraint.length) !== null && _a !== void 0 ? _a : length;
        // option defaults
        constraint.id = constraint.id || Common_1.default.nextId();
        constraint.label = constraint.label || 'Constraint';
        constraint.type = 'constraint';
        constraint.stiffness =
            constraint.stiffness || (constraint.length > 0 ? 1 : 0.7);
        constraint.damping = constraint.damping || 0;
        constraint.angularStiffness = constraint.angularStiffness || 0;
        constraint.angleA = constraint.bodyA
            ? constraint.bodyA.angle
            : constraint.angleA;
        constraint.angleB = constraint.bodyB
            ? constraint.bodyB.angle
            : constraint.angleB;
        constraint.plugin = {};
        // render
        const render = {
            visible: true,
            lineWidth: 2,
            strokeStyle: '#ffffff',
            type: 'line',
            anchors: true,
        };
        if (constraint.length === 0 && constraint.stiffness > 0.1) {
            render.type = 'pin';
            render.anchors = false;
        }
        else if (constraint.stiffness < 0.9) {
            render.type = 'spring';
        }
        constraint.render = Common_1.default.extend(render, constraint.render);
        return constraint;
    }
    /**
     * Prepares for solving by constraint warming.
     * @private
     * @method preSolveAll
     * @param bodies
     */
    static preSolveAll(bodies) {
        for (const body of bodies) {
            const impulse = body.constraintImpulse;
            if (body.isStatic ||
                (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)) {
                continue;
            }
            body.position.x += impulse.x;
            body.position.y += impulse.y;
            body.angle += impulse.angle;
        }
    }
    /**
     * Solves all constraints in a list of collisions.
     * @private
     * @method solveAll
     * @param {constraint[]} constraints
     * @param {number} delta
     */
    static solveAll(constraints, delta) {
        const timeScale = Common_1.default.clamp(delta / Common_1.default._baseDelta, 0, 1);
        // Solve fixed constraints first.
        for (const constraint of constraints) {
            const fixedA = !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic);
            const fixedB = !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic);
            if (fixedA || fixedB) {
                Constraint.solve(constraint, timeScale);
            }
        }
        // Solve free constraints last.
        for (const constraint of constraints) {
            const fixedA = !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic);
            const fixedB = !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic);
            if (!fixedA && !fixedB) {
                Constraint.solve(constraint, timeScale);
            }
        }
    }
    /**
     * Solves a distance constraint with Gauss-Siedel method.
     * @method solve
     * @param constraint
     * @param timeScale
     */
    static solve(constraint, timeScale) {
        const bodyA = constraint.bodyA;
        const bodyB = constraint.bodyB;
        const pointA = constraint.pointA;
        const pointB = constraint.pointB;
        if (!bodyA && !bodyB) {
            return;
        }
        // update reference angle
        if (bodyA && !bodyA.isStatic) {
            Vector_1.default.rotate(pointA, bodyA.angle - constraint.angleA, pointA);
            constraint.angleA = bodyA.angle;
        }
        // update reference angle
        if (bodyB && !bodyB.isStatic) {
            Vector_1.default.rotate(pointB, bodyB.angle - constraint.angleB, pointB);
            constraint.angleB = bodyB.angle;
        }
        let pointAWorld = pointA;
        let pointBWorld = pointB;
        if (bodyA) {
            pointAWorld = Vector_1.default.add(bodyA.position, pointA);
        }
        if (bodyB) {
            pointBWorld = Vector_1.default.add(bodyB.position, pointB);
        }
        if (!pointAWorld || !pointBWorld) {
            return;
        }
        const delta = Vector_1.default.sub(pointAWorld, pointBWorld);
        let currentLength = Vector_1.default.magnitude(delta);
        // prevent singularity
        if (currentLength < Constraint._minLength) {
            currentLength = Constraint._minLength;
        }
        // solve distance constraint with Gauss-Siedel method
        const difference = (currentLength - constraint.length) / currentLength;
        const isRigid = constraint.stiffness >= 1 || constraint.length === 0;
        const stiffness = isRigid
            ? constraint.stiffness * timeScale
            : constraint.stiffness * timeScale * timeScale;
        const damping = constraint.damping * timeScale;
        const force = Vector_1.default.mult(delta, difference * stiffness);
        const massTotal = (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0);
        const inertiaTotal = (bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0);
        const resistanceTotal = massTotal + inertiaTotal;
        let normal;
        let normalVelocity;
        let relativeVelocity;
        if (damping > 0) {
            const zero = Vector_1.default.create();
            normal = Vector_1.default.div(delta, currentLength);
            relativeVelocity = Vector_1.default.sub((bodyB && Vector_1.default.sub(bodyB.position, bodyB.positionPrev)) || zero, (bodyA && Vector_1.default.sub(bodyA.position, bodyA.positionPrev)) || zero);
            normalVelocity = Vector_1.default.dot(normal, relativeVelocity);
        }
        if (bodyA && !bodyA.isStatic) {
            const share = bodyA.inverseMass / massTotal;
            // keep track of applied impulses for post solving
            bodyA.constraintImpulse.x -= force.x * share;
            bodyA.constraintImpulse.y -= force.y * share;
            // apply forces
            bodyA.position.x -= force.x * share;
            bodyA.position.y -= force.y * share;
            // apply damping
            if (damping > 0) {
                bodyA.positionPrev.x -= damping * normal.x * normalVelocity * share;
                bodyA.positionPrev.y -= damping * normal.y * normalVelocity * share;
            }
            // apply torque
            const torque = (Vector_1.default.cross(pointA, force) / resistanceTotal) *
                Constraint._torqueDampen *
                bodyA.inverseInertia *
                (1 - constraint.angularStiffness);
            bodyA.constraintImpulse.angle -= torque;
            bodyA.angle -= torque;
        }
        if (bodyB && !bodyB.isStatic) {
            const share = bodyB.inverseMass / massTotal;
            // keep track of applied impulses for post solving
            bodyB.constraintImpulse.x += force.x * share;
            bodyB.constraintImpulse.y += force.y * share;
            // apply forces
            bodyB.position.x += force.x * share;
            bodyB.position.y += force.y * share;
            // apply damping
            if (damping > 0) {
                bodyB.positionPrev.x += damping * normal.x * normalVelocity * share;
                bodyB.positionPrev.y += damping * normal.y * normalVelocity * share;
            }
            // apply torque
            const torque = (Vector_1.default.cross(pointB, force) / resistanceTotal) *
                Constraint._torqueDampen *
                bodyB.inverseInertia *
                (1 - constraint.angularStiffness);
            bodyB.constraintImpulse.angle += torque;
            bodyB.angle += torque;
        }
    }
    /**
     * Performs body updates required after solving constraints.
     * @method postSolveAll
     * @param bodies
     */
    static postSolveAll(bodies) {
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            const impulse = body.constraintImpulse;
            if (body.isStatic ||
                (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)) {
                continue;
            }
            Sleeping_1.default.set(body, false);
            // update geometry and reset
            for (let j = 0; j < body.parts.length; j++) {
                const part = body.parts[j];
                Vertices_1.default.translate(part.vertices, impulse);
                if (j > 0) {
                    part.position.x += impulse.x;
                    part.position.y += impulse.y;
                }
                if (impulse.angle !== 0) {
                    Vertices_1.default.rotate(part.vertices, impulse.angle, body.position);
                    Axes_1.default.rotate(part.axes, impulse.angle);
                    if (j > 0) {
                        Vector_1.default.rotateAbout(part.position, impulse.angle, body.position, part.position);
                    }
                }
                Bounds_1.default.update(part.bounds, part.vertices, body.velocity);
            }
            // dampen the cached impulse for warming next step
            impulse.angle *= Constraint._warming;
            impulse.x *= Constraint._warming;
            impulse.y *= Constraint._warming;
        }
    }
    /**
     * Returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
     * @method pointAWorld
     * @param constraint
     * @returns the world-space position
     */
    static pointAWorld(constraint) {
        return {
            x: (constraint.bodyA ? constraint.bodyA.position.x : 0) +
                (constraint.pointA ? constraint.pointA.x : 0),
            y: (constraint.bodyA ? constraint.bodyA.position.y : 0) +
                (constraint.pointA ? constraint.pointA.y : 0),
        };
    }
    /**
     * Returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
     * @method pointBWorld
     * @param constraint
     * @returns the world-space position
     */
    static pointBWorld(constraint) {
        return {
            x: (constraint.bodyB ? constraint.bodyB.position.x : 0) +
                (constraint.pointB ? constraint.pointB.x : 0),
            y: (constraint.bodyB ? constraint.bodyB.position.y : 0) +
                (constraint.pointB ? constraint.pointB.y : 0),
        };
    }
    /**
     * Returns the current length of the constraint.
     * This is the distance between both of the constraint's end points.
     * See `constraint.length` for the target rest length.
     * @method currentLength
     * @param {constraint} constraint
     * @returns {number} the current length
     */
    static currentLength(constraint) {
        const pointAX = (constraint.bodyA ? constraint.bodyA.position.x : 0) +
            (constraint.pointA ? constraint.pointA.x : 0);
        const pointAY = (constraint.bodyA ? constraint.bodyA.position.y : 0) +
            (constraint.pointA ? constraint.pointA.y : 0);
        const pointBX = (constraint.bodyB ? constraint.bodyB.position.x : 0) +
            (constraint.pointB ? constraint.pointB.x : 0);
        const pointBY = (constraint.bodyB ? constraint.bodyB.position.y : 0) +
            (constraint.pointB ? constraint.pointB.y : 0);
        const deltaX = pointAX - pointBX;
        const deltaY = pointAY - pointBY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
}
Constraint._warming = 0.4;
Constraint._torqueDampen = 1;
Constraint._minLength = 0.000001;
exports["default"] = Constraint;


/***/ }),

/***/ 410:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Composite_1 = __importDefault(__webpack_require__(927));
const Detector_1 = __importDefault(__webpack_require__(493));
const Common_1 = __importDefault(__webpack_require__(120));
const Events_1 = __importDefault(__webpack_require__(884));
const Mouse_1 = __importDefault(__webpack_require__(200));
const Sleeping_1 = __importDefault(__webpack_require__(464));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vector_1 = __importDefault(__webpack_require__(795));
const Vertices_1 = __importDefault(__webpack_require__(547));
const Constraint_1 = __importDefault(__webpack_require__(61));
/**
 * The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
 * Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class MouseConstraint {
    /**
     * Creates a new mouse constraint.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param engine
     * @param options
     * @return A new MouseConstraint
     */
    static create(engine, options) {
        var _a, _b;
        let mouse = (engine ? (_a = engine.mouse) !== null && _a !== void 0 ? _a : null : null) || (options ? options.mouse : null);
        if (!mouse) {
            if (engine && engine.render && engine.render.canvas) {
                mouse = Mouse_1.default.create(engine.render.canvas);
            }
            else if (options && options.element) {
                mouse = Mouse_1.default.create(options.element);
            }
            else {
                mouse = Mouse_1.default.create();
                Common_1.default.warn('MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected');
            }
        }
        const constraint = Constraint_1.default.create({
            label: 'Mouse Constraint',
            pointA: mouse.position,
            pointB: { x: 0, y: 0 },
            length: 0.01,
            stiffness: 0.1,
            angularStiffness: 1,
            render: {
                strokeStyle: '#90EE90',
                lineWidth: 3,
            },
        });
        const defaults = {
            type: 'mouseConstraint',
            mouse: mouse,
            element: null,
            body: null,
            constraint: constraint,
            collisionFilter: {
                category: 0x0001,
                mask: 0xffffffff,
                group: 0,
            },
            events: {}
        };
        const mouseConstraint = Common_1.default.extend(defaults, options);
        Events_1.default.on(engine, 'beforeUpdate', () => {
            const allBodies = Composite_1.default.allBodies(engine.world);
            MouseConstraint.update(mouseConstraint, allBodies);
            MouseConstraint._triggerEvents(mouseConstraint);
        });
        mouseConstraint.events = (_b = mouseConstraint.events) !== null && _b !== void 0 ? _b : {};
        return mouseConstraint;
    }
    /**
     * Updates the given mouse constraint.
     * @method update
     * @param mouseConstraint
     * @param bodies
     */
    static update(mouseConstraint, bodies) {
        const mouse = mouseConstraint.mouse;
        const constraint = mouseConstraint.constraint;
        if (mouse.button === 0) {
            if (!constraint.bodyB) {
                for (let i = 0; i < bodies.length; i++) {
                    const body = bodies[i];
                    if (Bounds_1.default.contains(body.bounds, mouse.position) &&
                        Detector_1.default.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
                        for (let j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                            const part = body.parts[j];
                            if (Vertices_1.default.contains(part.vertices, mouse.position)) {
                                constraint.pointA = mouse.position;
                                constraint.bodyB = mouseConstraint.body = body;
                                constraint.pointB = {
                                    x: mouse.position.x - body.position.x,
                                    y: mouse.position.y - body.position.y,
                                };
                                constraint.angleB = body.angle;
                                Sleeping_1.default.set(body, false);
                                Events_1.default.trigger(mouseConstraint, 'startdrag', {
                                    mouse: mouse,
                                    body: body,
                                });
                                break;
                            }
                        }
                    }
                }
            }
            else {
                Sleeping_1.default.set(constraint.bodyB, false);
                constraint.pointA = mouse.position;
            }
        }
        else {
            const body = mouseConstraint.body;
            constraint.bodyB = mouseConstraint.body = null;
            constraint.pointB = Vector_1.default.create();
            if (body) {
                Events_1.default.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body });
            }
        }
    }
    /**
     * Triggers mouse constraint events.
     * @method _triggerEvents
     * @param mouseConstraint
     */
    static _triggerEvents(mouseConstraint) {
        const mouse = mouseConstraint.mouse;
        const mouseEvents = mouse.sourceEvents;
        if (mouseEvents.mousemove) {
            Events_1.default.trigger(mouseConstraint, 'mousemove', { mouse: mouse });
        }
        if (mouseEvents.mousedown) {
            Events_1.default.trigger(mouseConstraint, 'mousedown', { mouse: mouse });
        }
        if (mouseEvents.mouseup) {
            Events_1.default.trigger(mouseConstraint, 'mouseup', { mouse: mouse });
        }
        // reset the mouse state ready for the next step
        Mouse_1.default.clearSourceEvents(mouse);
    }
}
exports["default"] = MouseConstraint;


/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (LogLevel = {}));
/**
 * The `Matter.Common` module contains utility functions that are common to all modules.
 */
class Common {
    static nextId() {
        return Common._nextId++;
    }
    /**
     * Returns the current timestamp since the time origin (e.g. from page load).
     * The result is in milliseconds and will use high-resolution timing if available.
     * @method now
     * @return the current timestamp in milliseconds
     */
    static now() {
        if (typeof window !== 'undefined' && window.performance) {
            if (window.performance.now) {
                return window.performance.now();
            }
        }
        if (Date.now) {
            return Date.now();
        }
        const date = new Date();
        return +date - Common._nowStartTime;
    }
    static random(min = 1, max = 1) {
        return min + Common._seededRandom() * (max - min);
    }
    static _seededRandom() {
        // https://en.wikipedia.org/wiki/Linear_congruential_generator
        Common._seed = (Common._seed * 9301 + 49297) % 233280;
        return Common._seed / 233280;
    }
    static colorToNumber(colorString) {
        let code = colorString.replace('#', '');
        if (code.length == 3) {
            code =
                code.charAt(0) +
                    code.charAt(0) +
                    code.charAt(1) +
                    code.charAt(1) +
                    code.charAt(2) +
                    code.charAt(2);
        }
        return parseInt(code, 16);
    }
    /**
     * Returns the given value clamped between a minimum and maximum value.
     * @param value
     * @param min
     * @param max
     * @return The value clamped between min and max inclusive
     */
    static clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }
    /**
     * Returns the sign of the given value.
     * @method sign
     * @param value
     * @return -1 if negative, +1 if 0 or positive
     */
    static sign(value) {
        return value < 0 ? -1 : 1;
    }
    /**
     * Shuffles the given array in-place.
     * The function uses a seeded random generator.
     * @param array
     * @return array shuffled randomly
     */
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Common.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    /**
     * Randomly chooses a value from a list with equal probability.
     * The function uses a seeded random generator.
     * @param choices
     * @return A random choice object from the array
     */
    static choose(choices) {
        return choices[Math.floor(Common.random() * choices.length)];
    }
    /**
     * Returns true if the object is an array.
     * @method isArray
     * @param obj
     * @return True if the object is an array, otherwise false
     */
    static isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    static isObject(value) {
        return !!value && value.constructor === Object;
    }
    /**
     * Returns true if the object is a HTMLElement, otherwise false.
     * @method isElement
     * @param obj
     * @return True if the object is a HTMLElement, otherwise false
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isElement(obj) {
        if (typeof HTMLElement !== 'undefined') {
            return obj instanceof HTMLElement;
        }
        return !!(obj && obj.nodeType && obj.nodeName);
    }
    /**
     * Gets a value from `base` relative to the `path` string.
     * @param obj The base object
     * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
     * @param begin Path slice begin
     * @param end Path slice end
     * @return The object at the given path
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static get(obj, path, begin, end) {
        const pathArray = path.split('.').slice(begin, end);
        for (const part of pathArray) {
            obj = obj[part];
        }
        return obj;
    }
    /**
     * Sets a value on `base` relative to the given `path` string.
     * @param obj The base object
     * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
     * @param val The value to set
     * @param begin Path slice begin
     * @param end Path slice end
     * @return Pass through `val` for chaining
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static set(obj, path, val, begin, end) {
        const parts = path.split('.').slice(begin, end);
        Common.get(obj, path, 0, -1)[parts[parts.length - 1]] = val;
        return val;
    }
    static extend(obj, deep, ...params) {
        let deepClone;
        let args;
        if (typeof deep === 'boolean') {
            deepClone = deep;
            args = params;
        }
        else {
            deepClone = true;
            args = deep ? [deep, ...params] : params;
        }
        if (!deepClone) {
            return Object.assign(obj, ...args);
        }
        for (let i = 0; i < args.length; i++) {
            const source = args[i];
            if (source) {
                for (const prop in source) {
                    const value = source[prop];
                    if (Common.isObject(value)) {
                        if (obj[prop]) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            Common.extend(obj[prop], deepClone, value);
                        }
                        else {
                            obj[prop] = Object.assign({}, value);
                        }
                    }
                    else {
                        obj[prop] = value;
                    }
                }
            }
        }
        return obj;
    }
    /**
     * Creates a new clone of the object, if deep is true references will also be cloned.
     * @param obj
     * @param deep
     * @return obj cloned
     */
    static clone(obj, deep) {
        return Common.extend({}, deep, obj);
    }
    /**
     * Shows a `console.log` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-ts' to make it easily identifiable.
     * @param params The objects to log.
     */
    static log(...params) {
        if (Common.logLevel === LogLevel.Debug ||
            Common.logLevel === LogLevel.Info ||
            Common.logLevel === LogLevel.Warn) {
            console.log.apply(console, ['matter-ts:'].concat(params));
        }
    }
    /**
     * Shows a deprecated console warning when the function on the given object is called.
     * The target function will be replaced with a new function that first shows the warning
     * and then calls the original function.
     * @param obj The object or module
     * @param name The property name of the function on obj
     * @param warning The one-time message to show if the function is called
     */
    static deprecated(obj, prop, warning) {
        obj[prop] = Common.chain(() => {
            Common.warnOnce('🔅 deprecated 🔅', warning);
        }, obj[prop]);
    }
    /**
     * Shows a `console.info` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-ts' to make it easily identifiable.
     * @param params The objects to log.
     */
    static info(...params) {
        if (Common.logLevel === LogLevel.Debug ||
            Common.logLevel === LogLevel.Info) {
            console.info.apply(console, ['matter-ts:'].concat(params));
        }
    }
    /**
     * Shows a `console.warn` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-js' to make it easily identifiable.
     * @param params The objects to log.
     */
    static warn(...params) {
        if (Common.logLevel === LogLevel.Debug ||
            Common.logLevel === LogLevel.Info ||
            Common.logLevel === LogLevel.Warn) {
            console.warn.apply(console, ['matter-ts:'].concat(params));
        }
    }
    /**
     * Uses `Common.warn` to log the given message one time only.
     * @param params The objects to log.
     */
    static warnOnce(...params) {
        const message = params.join(' ');
        if (!Common._warnedOnce[message]) {
            Common.warn(message);
            Common._warnedOnce[message] = true;
        }
    }
    /**
     * Takes a directed graph and returns the partially ordered set of vertices in topological order.
     * Circular dependencies are allowed.
     * @param graph
     * @return Partially ordered set of vertices in topological order.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static topologicalSort(graph) {
        // https://github.com/mgechev/javascript-algorithms
        // Copyright (c) Minko Gechev (MIT license)
        // Modifications: tidy formatting and naming
        const result = [];
        const visited = {};
        const temp = {};
        for (const node in graph) {
            if (!visited[node] && !temp[node]) {
                Common._topologicalSort(node, visited, temp, graph, result);
            }
        }
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static _topologicalSort(node, visited, temp, graph, result) {
        const neighbors = graph[node] || [];
        temp[node] = true;
        for (const neighbor of neighbors) {
            if (temp[neighbor]) {
                // skip circular dependencies
                continue;
            }
            if (!visited[neighbor]) {
                Common._topologicalSort(neighbor, visited, temp, graph, result);
            }
        }
        temp[node] = false;
        visited[node] = true;
        result.push(node);
    }
    /**
     * Takes _n_ functions as arguments and returns a new function that calls them in order.
     * The arguments applied when calling the new function will also be applied to every function passed.
     * The value of `this` refers to the last value returned in the chain that was not `undefined`.
     * Therefore if a passed function does not return a value, the previously returned value is maintained.
     * After all passed functions have been called the new function returns the last returned value (if any).
     * If any of the passed functions are a chain, then the chain will be flattened.
     * @param params The functions to chain.
     * @return A new function that calls the passed functions in order.
     */
    static chain(...params) {
        const funcs = [];
        for (const func of params) {
            if ('_chained' in func) {
                // flatten already chained functions
                funcs.push.apply(funcs, func._chained);
            }
            else {
                funcs.push(func);
            }
        }
        const chain = function () {
            // https://github.com/GoogleChrome/devtools-docs/issues/53#issuecomment-51941358
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let lastResult;
            const args = new Array(params.length);
            for (let i = 0; i < params.length; i++) {
                args[i] = params[i];
            }
            for (let i = 0; i < funcs.length; i += 1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = funcs[i].apply(lastResult, args);
                if (typeof result !== 'undefined') {
                    lastResult = result;
                }
            }
            return lastResult;
        };
        chain._chained = funcs;
        return chain;
    }
    /**
     * Chains a function to excute before the original function on the given `path` relative to `base`.
     * See also docs for `Common.chain`.
     * @param base The base object
     * @param path The path relative to `base`
     * @param func The function to chain before the original
     * @return The chained function that replaced the original
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static chainPathBefore(base, path, func) {
        return Common.set(base, path, Common.chain(func, Common.get(base, path)));
    }
    /**
     * Chains a function to excute after the original function on the given `path` relative to `base`.
     * See also docs for `Common.chain`.
     * @param base The base object
     * @param path The path relative to `base`
     * @param func The function to chain after the original
     * @return The chained function that replaced the original
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static chainPathAfter(base, path, func) {
        return Common.set(base, path, Common.chain(Common.get(base, path), func));
    }
    /**
     * Provide the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module to enable
     * concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`.
     * @param decomp The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module.
     */
    static setDecomp(decomp) {
        Common._decomp = decomp;
    }
    /**
     * Returns the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module provided through `Common.setDecomp`,
     * otherwise returns the global `decomp` if set.
     * @return The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module if provided.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getDecomp() {
        // get user provided decomp if set
        let decomp = Common._decomp;
        try {
            // otherwise from window global
            if (!decomp && typeof window !== 'undefined') {
                decomp = window.decomp;
            }
            // otherwise from node global
            if (!decomp && typeof global !== 'undefined') {
                decomp = global.decomp;
            }
        }
        catch (e) {
            // decomp not available
            decomp = null;
        }
        return decomp;
    }
}
Common._baseDelta = 1000 / 60;
Common._nextId = 0;
Common._seed = 0;
Common._nowStartTime = +new Date();
Common._warnedOnce = {};
Common._decomp = null;
/**
 * The console logging level to use, where each level includes all levels above and excludes the levels below.
 * The default level is 'debug' which shows all console messages.
 */
Common.logLevel = LogLevel.Debug;
exports["default"] = Common;


/***/ }),

/***/ 332:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Body_1 = __importDefault(__webpack_require__(713));
const Composite_1 = __importDefault(__webpack_require__(927));
const Detector_1 = __importDefault(__webpack_require__(493));
const Grid_1 = __importDefault(__webpack_require__(281));
const Pairs_1 = __importDefault(__webpack_require__(577));
const Resolver_1 = __importDefault(__webpack_require__(561));
const Constraint_1 = __importDefault(__webpack_require__(61));
const Common_1 = __importDefault(__webpack_require__(120));
const Events_1 = __importDefault(__webpack_require__(884));
const Runner_1 = __importDefault(__webpack_require__(585));
const Sleeping_1 = __importDefault(__webpack_require__(464));
/**
 * The `Matter.Engine` module contains methods for creating and manipulating engines.
 * An engine is a controller that manages updating the simulation of the world.
 * See `Matter.Runner` for an optional game loop utility.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Engine {
    /**
     * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return engine
     */
    static create(options = {}) {
        const defaults = {
            positionIterations: 6,
            velocityIterations: 4,
            constraintIterations: 2,
            enableSleeping: false,
            events: {},
            plugin: {},
            gravity: {
                x: 0,
                y: 1,
                scale: 0.001,
            },
            timing: {
                timestamp: 0,
                timeScale: 1,
                lastDelta: 0,
                lastElapsed: 0,
            },
        };
        const engine = Common_1.default.extend(defaults, options);
        engine.world = options.world || Composite_1.default.create({ label: 'World' });
        engine.pairs = options.pairs || Pairs_1.default.create();
        engine.detector = options.detector || Detector_1.default.create();
        // for temporary back compatibility only
        engine.grid = Grid_1.default.create();
        engine.world.gravity = engine.gravity;
        engine.broadphase = engine.grid;
        engine.metrics = {};
        return engine;
    }
    /**
     * Moves the simulation forward in time by `delta` milliseconds.
     * Triggers `beforeUpdate`, `beforeSolve` and `afterUpdate` events.
     * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
     * @method update
     * @param engine
     * @param delta
     */
    static update(engine, delta = Common_1.default._baseDelta) {
        const startTime = Common_1.default.now();
        const world = engine.world;
        const detector = engine.detector;
        const pairs = engine.pairs;
        const timing = engine.timing;
        const timestamp = timing.timestamp;
        delta *= timing.timeScale;
        // increment timestamp
        timing.timestamp += delta;
        timing.lastDelta = delta;
        // create an event object
        const event = {
            timestamp: timing.timestamp,
            delta: delta,
        };
        Events_1.default.trigger(engine, 'beforeUpdate', event);
        // get all bodies and all constraints in the world
        const allBodies = Composite_1.default.allBodies(world);
        const allConstraints = Composite_1.default.allConstraints(world);
        // if the world has changed
        if (world.isModified) {
            // update the detector bodies
            Detector_1.default.setBodies(detector, allBodies);
            // reset all composite modified flags
            Composite_1.default.setModified(world, false, false, true);
        }
        // update sleeping if enabled
        if (engine.enableSleeping) {
            Sleeping_1.default.update(allBodies, delta);
        }
        // apply gravity to all bodies
        Engine._bodiesApplyGravity(allBodies, engine.gravity);
        // update all body position and rotation by integration
        if (delta > 0) {
            Engine._bodiesUpdate(allBodies, delta);
        }
        Events_1.default.trigger(engine, 'beforeSolve', event);
        // update all constraints (first pass)
        Constraint_1.default.preSolveAll(allBodies);
        for (let i = 0; i < engine.constraintIterations; i++) {
            Constraint_1.default.solveAll(allConstraints, delta);
        }
        Constraint_1.default.postSolveAll(allBodies);
        // find all collisions
        detector.pairs = engine.pairs;
        const collisions = Detector_1.default.collisions(detector);
        // update collision pairs
        Pairs_1.default.update(pairs, collisions, timestamp);
        // wake up bodies involved in collisions
        if (engine.enableSleeping)
            Sleeping_1.default.afterCollisions(pairs.list);
        // trigger collision events
        if (pairs.collisionStart.length > 0) {
            Events_1.default.trigger(engine, 'collisionStart', {
                pairs: pairs.collisionStart,
                timestamp: timing.timestamp,
                delta: delta,
            });
        }
        // iteratively resolve position between collisions
        const positionDamping = Common_1.default.clamp(20 / engine.positionIterations, 0, 1);
        Resolver_1.default.preSolvePosition(pairs.list);
        for (let i = 0; i < engine.positionIterations; i++) {
            Resolver_1.default.solvePosition(pairs.list, delta, positionDamping);
        }
        Resolver_1.default.postSolvePosition(allBodies);
        // update all constraints (second pass)
        Constraint_1.default.preSolveAll(allBodies);
        for (let i = 0; i < engine.constraintIterations; i++) {
            Constraint_1.default.solveAll(allConstraints, delta);
        }
        Constraint_1.default.postSolveAll(allBodies);
        // iteratively resolve velocity between collisions
        Resolver_1.default.preSolveVelocity(pairs.list);
        for (let i = 0; i < engine.velocityIterations; i++) {
            Resolver_1.default.solveVelocity(pairs.list, delta);
        }
        // update body speed and velocity properties
        Engine._bodiesUpdateVelocities(allBodies);
        // trigger collision events
        if (pairs.collisionActive.length > 0) {
            Events_1.default.trigger(engine, 'collisionActive', {
                pairs: pairs.collisionActive,
                timestamp: timing.timestamp,
                delta: delta,
            });
        }
        if (pairs.collisionEnd.length > 0) {
            Events_1.default.trigger(engine, 'collisionEnd', {
                pairs: pairs.collisionEnd,
                timestamp: timing.timestamp,
                delta: delta,
            });
        }
        // clear force buffers
        Engine._bodiesClearForces(allBodies);
        Events_1.default.trigger(engine, 'afterUpdate', event);
        // log the time elapsed computing this update
        engine.timing.lastElapsed = Common_1.default.now() - startTime;
        return engine;
    }
    /**
     * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
     * @method merge
     * @param engineA
     * @param engineB
     */
    static merge(engineA, engineB) {
        Common_1.default.extend(engineA, engineB);
        if (engineB.world) {
            engineA.world = engineB.world;
            Engine.clear(engineA);
            const bodies = Composite_1.default.allBodies(engineA.world);
            for (const body of bodies) {
                Sleeping_1.default.set(body, false);
                body.id = Common_1.default.nextId();
            }
        }
    }
    /**
     * Clears the engine pairs and detector.
     * @method clear
     * @param engine
     */
    static clear(engine) {
        Pairs_1.default.clear(engine.pairs);
        Detector_1.default.clear(engine.detector);
    }
    /**
     * Zeroes the `body.force` and `body.torque` force buffers.
     * @method _bodiesClearForces
     * @param bodies
     */
    static _bodiesClearForces(bodies) {
        for (const body of bodies) {
            // reset force buffers
            body.force.x = 0;
            body.force.y = 0;
            body.torque = 0;
        }
    }
    /**
     * Applies gravitational acceleration to all `bodies`.
     * This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet.
     *
     * @method _bodiesApplyGravity
     * @param bodies
     * @param gravity
     */
    static _bodiesApplyGravity(bodies, gravity) {
        var _a;
        const gravityScale = (_a = gravity.scale) !== null && _a !== void 0 ? _a : 0.001;
        if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
            return;
        }
        for (const body of bodies) {
            if (body.isStatic || body.isSleeping) {
                continue;
            }
            // add the resultant force of gravity
            body.force.y += body.mass * gravity.y * gravityScale;
            body.force.x += body.mass * gravity.x * gravityScale;
        }
    }
    /**
     * Applies `Body.update` to all given `bodies`.
     * @method _bodiesUpdate
     * @param bodies
     * @param delta The amount of time elapsed between updates
     */
    static _bodiesUpdate(bodies, delta) {
        for (const body of bodies) {
            if (body.isStatic || body.isSleeping) {
                continue;
            }
            Body_1.default.update(body, delta);
        }
    }
    /**
     * Applies `Body.updateVelocities` to all given `bodies`.
     * @method _bodiesUpdateVelocities
     * @param bodies
     */
    static _bodiesUpdateVelocities(bodies) {
        for (const body of bodies) {
            Body_1.default.updateVelocities(body);
        }
    }
}
/**
 * @deprecated
 */
Engine.run = Runner_1.default.run;
exports["default"] = Engine;
// eslint-disable-next-line no-extra-semi
;
(() => {
    Common_1.default.deprecated(Engine, 'run', 'Engine.run ➤ use public static Runner.run(engine) instead');
})();


/***/ }),

/***/ 884:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
/**
 * The `Matter.Events` module contains methods to fire and listen to events on other objects.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Events {
    static on(object, eventNames, callback) {
        const names = eventNames.split(' ');
        for (const name of names) {
            object.events = object.events || {};
            object.events[name] = object.events[name] || [];
            object.events[name].push(callback);
        }
        return callback;
    }
    static off(object, eventNames, callback) {
        if (!eventNames) {
            object.events = {};
            return;
        }
        let names;
        // handle Events.off(object, callback)
        if (typeof eventNames === 'function') {
            callback = eventNames;
            names = Object.keys(object.events);
        }
        else {
            names = eventNames.split(' ');
        }
        for (let i = 0; i < names.length; i++) {
            const callbacks = object.events[names[i]];
            const newCallbacks = [];
            if (callback && callbacks) {
                for (let j = 0; j < callbacks.length; j++) {
                    if (callbacks[j] !== callback) {
                        newCallbacks.push(callbacks[j]);
                    }
                }
            }
            object.events[names[i]] = newCallbacks;
        }
    }
    static trigger(object, eventNames, event = {}) {
        const events = object.events;
        if (events && Object.keys(events).length > 0) {
            const names = eventNames.split(' ');
            for (const name of names) {
                const callbacks = events[name];
                if (callbacks) {
                    const eventClone = Common_1.default.clone(event, false);
                    eventClone.name = name;
                    eventClone.source = object;
                    for (let j = 0; j < callbacks.length; j++) {
                        callbacks[j].apply(object, [eventClone]);
                    }
                }
            }
        }
    }
}
exports["default"] = Events;


/***/ }),

/***/ 49:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Plugin_1 = __importDefault(__webpack_require__(885));
const Common_1 = __importDefault(__webpack_require__(120));
const package_json_1 = __importDefault(__webpack_require__(147));
/**
 * includes a function for installing plugins on top of the library.
 */
class Matter {
    /**
     * Installs the given plugins on the `Matter` namespace.
     * This is a short-hand for `Plugin.use`, see it for more information.
     * Call this function once at the start of your code, with all of the plugins you wish to install as arguments.
     * Avoid calling this function multiple times unless you intend to manually control installation order.
     * @param params The plugin(s) to install on `base` (multi-argument).
     */
    static use(...params) {
        Plugin_1.default.use(Matter, params);
    }
    /**
     * Chains a function to excute before the original function on the given `path` relative to `Matter`.
     * See also docs for `Common.chain`.
     * @param path The path relative to `Matter`
     * @param func The function to chain before the original
     * @return The chained function that replaced the original
     */
    static before(path, func) {
        path = path.replace(/^Matter./, '');
        return Common_1.default.chainPathBefore(Matter, path, func);
    }
    /**
     * Chains a function to excute after the original function on the given `path` relative to `Matter`.
     * See also docs for `Common.chain`.
     * @param path The path relative to `Matter`
     * @param func The function to chain after the original
     * @return The chained function that replaced the original
     */
    static after(path, func) {
        path = path.replace(/^Matter./, '');
        return Common_1.default.chainPathAfter(Matter, path, func);
    }
}
/**
 * The library name.
 */
Matter.libraryName = 'matter-ts';
/**
 * The library version.
 */
Matter.version = (_a = package_json_1.default.version) !== null && _a !== void 0 ? _a : 'undefined';
/**
 * A list of plugin dependencies to be installed. These are normally set and installed through `Matter.use`.
 * Alternatively you may set `Matter.uses` manually and install them by calling `Plugin.use(Matter)`.
 */
Matter.uses = [];
/**
 * The plugins that have been installed through `Matter.Plugin.install`. Read only.
 */
Matter.used = [];
exports["default"] = Matter;


/***/ }),

/***/ 200:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector_1 = __importDefault(__webpack_require__(795));
const Common_1 = __importDefault(__webpack_require__(120));
/**
 * The `Matter.Mouse` module contains methods for creating and manipulating mouse inputs.
 */
class Mouse {
    /**
     * Creates a mouse input.
     * @method create
     * @param element
     * @return A new mouse
     */
    static create(element) {
        var _a;
        if (!element) {
            Common_1.default.log('Mouse.create: element was undefined, defaulting to document.body', 'warn');
        }
        const mouse = {
            element: element || document.body,
            absolute: Vector_1.default.create(0, 0),
            position: Vector_1.default.create(0, 0),
            mousedownPosition: Vector_1.default.create(0, 0),
            mouseupPosition: Vector_1.default.create(0, 0),
            offset: Vector_1.default.create(0, 0),
            scale: Vector_1.default.create(1, 1),
            wheelDelta: 0,
            button: -1,
            pixelRatio: parseInt((_a = (element || document.body).getAttribute('data-pixel-ratio')) !== null && _a !== void 0 ? _a : '1', 10),
            sourceEvents: {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null,
            },
            mousemove: (event) => {
                const position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
                if (Mouse.isTouchEvent(event)) {
                    mouse.button = 0;
                    event.preventDefault();
                }
                mouse.absolute.x = position.x;
                mouse.absolute.y = position.y;
                mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                mouse.sourceEvents.mousemove = event;
            },
            mousedown: (event) => {
                const position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
                if (Mouse.isTouchEvent(event)) {
                    mouse.button = 0;
                    event.preventDefault();
                }
                else {
                    mouse.button = event.button;
                }
                mouse.absolute.x = position.x;
                mouse.absolute.y = position.y;
                mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                mouse.mousedownPosition.x = mouse.position.x;
                mouse.mousedownPosition.y = mouse.position.y;
                mouse.sourceEvents.mousedown = event;
            },
            mouseup: (event) => {
                const position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
                if (Mouse.isTouchEvent(event)) {
                    event.preventDefault();
                }
                mouse.button = -1;
                mouse.absolute.x = position.x;
                mouse.absolute.y = position.y;
                mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                mouse.mouseupPosition.x = mouse.position.x;
                mouse.mouseupPosition.y = mouse.position.y;
                mouse.sourceEvents.mouseup = event;
            },
            mousewheel: (event) => {
                mouse.wheelDelta = Math.max(-1, Math.min(1, -event.detail));
                event.preventDefault();
                mouse.sourceEvents.mousewheel = event;
            },
        };
        Mouse.setElement(mouse, mouse.element);
        return mouse;
    }
    static isTouchEvent(event) {
        return 'changedTouches' in event;
    }
    /**
     * Sets the element the mouse is bound to (and relative to).
     * @method setElement
     * @param mouse
     * @param element
     */
    static setElement(mouse, element) {
        mouse.element = element;
        element.addEventListener('mousemove', mouse.mousemove, { passive: true });
        element.addEventListener('mousedown', mouse.mousedown, { passive: true });
        element.addEventListener('mouseup', mouse.mouseup, { passive: true });
        element.addEventListener('wheel', mouse.mousewheel, { passive: false });
        element.addEventListener('touchmove', mouse.mousemove, { passive: false });
        element.addEventListener('touchstart', mouse.mousedown, { passive: false });
        element.addEventListener('touchend', mouse.mouseup, { passive: false });
    }
    /**
     * Clears all captured source events.
     * @method clearSourceEvents
     * @param mouse
     */
    static clearSourceEvents(mouse) {
        mouse.sourceEvents.mousemove = null;
        mouse.sourceEvents.mousedown = null;
        mouse.sourceEvents.mouseup = null;
        mouse.sourceEvents.mousewheel = null;
        mouse.wheelDelta = 0;
    }
    /**
     * Sets the mouse position offset.
     * @method setOffset
     * @param mouse
     * @param offset
     */
    static setOffset(mouse, offset) {
        mouse.offset.x = offset.x;
        mouse.offset.y = offset.y;
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    }
    /**
     * Sets the mouse position scale.
     * @method setScale
     * @param mouse
     * @param scale
     */
    static setScale(mouse, scale) {
        mouse.scale.x = scale.x;
        mouse.scale.y = scale.y;
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    }
    /**
     * Gets the mouse position relative to an element given a screen pixel ratio.
     * @method _getRelativeMousePosition
     * @private
     * @param {} event
     * @param {} element
     * @param {number} pixelRatio
     * @return {}
     */
    static _getRelativeMousePosition(event, element, pixelRatio) {
        const elementBounds = element.getBoundingClientRect();
        const rootNode = document.documentElement || document.body.parentNode || document.body;
        const scrollX = window.scrollX !== undefined ? window.scrollX : rootNode.scrollLeft;
        const scrollY = window.scrollY !== undefined ? window.scrollY : rootNode.scrollTop;
        let x;
        let y;
        if (Mouse.isTouchEvent(event)) {
            const touches = event.changedTouches;
            x = touches[0].pageX - elementBounds.left - scrollX;
            y = touches[0].pageY - elementBounds.top - scrollY;
        }
        else {
            x = event.pageX - elementBounds.left - scrollX;
            y = event.pageY - elementBounds.top - scrollY;
        }
        return Vector_1.default.create(x / ((element.clientWidth / element.clientWidth) * pixelRatio), y / ((element.clientHeight / element.clientHeight) * pixelRatio));
    }
}
exports["default"] = Mouse;


/***/ }),

/***/ 885:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
/**
 * contains functions for registering and installing plugins on modules.
 */
class Plugin {
    /**
     * Registers a plugin object so it can be resolved later by name.
     * @param plugin The plugin to register.
     * @return The plugin.
     */
    static register(plugin) {
        if (!Plugin.isPlugin(plugin)) {
            Common_1.default.warn('Plugin.register:', JSON.stringify(plugin), 'does not implement all required fields.');
            return plugin;
        }
        if (plugin.name in Plugin._registry) {
            const registered = Plugin._registry[plugin.name];
            const pluginVersion = Plugin.versionParse(plugin.version).number;
            const registeredVersion = Plugin.versionParse(registered.version).number;
            if (pluginVersion > registeredVersion) {
                Common_1.default.warn('Plugin.register:', Plugin.toString(registered), 'was upgraded to', Plugin.toString(plugin));
                Plugin._registry[plugin.name] = plugin;
            }
            else if (pluginVersion < registeredVersion) {
                Common_1.default.warn('Plugin.register:', Plugin.toString(registered), 'can not be downgraded to', Plugin.toString(plugin));
            }
            else if (plugin !== registered) {
                Common_1.default.warn('Plugin.register:', Plugin.toString(plugin), 'is already registered to different plugin object');
            }
        }
        else {
            Plugin._registry[plugin.name] = plugin;
        }
        return plugin;
    }
    /**
     * Resolves a dependency to a plugin object from the registry if it exists.
     * The `dependency` may contain a version, but only the name matters when resolving.
     * @param dependency The dependency.
     * @return The plugin if resolved, otherwise `undefined`.
     */
    static resolve(dependency) {
        return Plugin._registry[Plugin.dependencyParse(dependency).name];
    }
    /**
     * Returns a pretty printed plugin name and version.
     * @param plugin The plugin.
     * @return Pretty printed plugin name and version.
     */
    static toString(plugin) {
        return typeof plugin === 'string'
            ? plugin
            : (plugin.name || 'anonymous') + '@' + plugin.version;
    }
    /**
     * Returns `true` if the object meets the minimum standard to be considered a plugin.
     * This means it must define the following properties:
     * - `name`
     * - `version`
     * - `install`
     * @param obj The obj to test.
     * @return `true` if the object can be considered a plugin otherwise `false`.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isPlugin(obj) {
        return obj && 'name' in obj && 'version' in obj && 'install' in obj;
    }
    /**
     * Returns `true` if a plugin with the given `name` been installed on `module`.
     * @param m The module.
     * @param name The plugin name.
     * @return `true` if a plugin with the given `name` been installed on `module`, otherwise `false`.
     */
    static isUsed(m, name) {
        return m.used.indexOf(name) > -1;
    }
    /**
     * Returns `true` if `plugin.for` is applicable to `module` by comparing against `module.name` and `module.version`.
     * If `plugin.for` is not specified then it is assumed to be applicable.
     * The value of `plugin.for` is a string of the format `'module-name'` or `'module-name@version'`.
     * @param plugin The plugin.
     * @param m The module.
     * @return `true` if `plugin.for` is applicable to `module`, otherwise `false`.
     */
    static isFor(plugin, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    m) {
        const parsed = Plugin.dependencyParse(plugin.for);
        return (!plugin.for ||
            (m.name === parsed.name &&
                Plugin.versionSatisfies(m.version, parsed.range)));
    }
    /**
     * Installs the plugins by calling `plugin.install` on each plugin specified in `plugins` if passed, otherwise `module.uses`.
     * For installing plugins on `Matter` see the convenience function `Matter.use`.
     * Plugins may be specified either by their name or a reference to the plugin object.
     * Plugins themselves may specify further dependencies, but each plugin is installed only once.
     * Order is important, a topological sort is performed to find the best resulting order of installation.
     * This sorting attempts to satisfy every dependency's requested ordering, but may not be exact in all cases.
     * This function logs the resulting status of each dependency in the console, along with any warnings.
     * - A green tick ✅ indicates a dependency was resolved and installed.
     * - An orange diamond 🔶 indicates a dependency was resolved but a warning was thrown for it or one if its dependencies.
     * - A red cross ❌ indicates a dependency could not be resolved.
     * Avoid calling this function multiple times on the same module unless you intend to manually control installation order.
     * @param m The module install plugins on.
     * @param [plugins=module.uses] {} The plugins to install on module (optional, defaults to `module.uses`).
     */
    static use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    m, plugins) {
        m.uses = (m.uses || []).concat(plugins || []);
        if (m.uses.length === 0) {
            Common_1.default.warn('Plugin.use:', JSON.stringify(m), 'does not specify any dependencies to install.');
            return;
        }
        const dependencies = Plugin.dependencies(m);
        const sortedDependencies = Common_1.default.topologicalSort(dependencies).map((d) => `${d}`);
        const status = [];
        for (const d of sortedDependencies) {
            if (d === m.name) {
                continue;
            }
            const plugin = Plugin.resolve(d);
            if (!plugin) {
                status.push('❌ ' + d);
                continue;
            }
            if ('used' in m && Plugin.isUsed(m, plugin.name)) {
                continue;
            }
            if (!Plugin.isFor(plugin, m)) {
                Common_1.default.warn('Plugin.use:', Plugin.toString(plugin), 'is for', plugin.for, 'but installed on', JSON.stringify(m) + '.');
                plugin._warned = true;
            }
            if (plugin.install) {
                plugin.install(m);
            }
            else {
                Common_1.default.warn('Plugin.use:', Plugin.toString(plugin), 'does not specify an install function.');
                plugin._warned = true;
            }
            if (plugin._warned) {
                status.push('🔶 ' + Plugin.toString(plugin));
                delete plugin._warned;
            }
            else {
                status.push('✅ ' + Plugin.toString(plugin));
            }
            m.used.push(plugin.name);
        }
        if (status.length > 0) {
            Common_1.default.info(status.join('  '));
        }
    }
    /**
     * Recursively finds all of a module's dependencies and returns a flat dependency graph.
     * @param m The module.
     * @return A dependency graph.
     */
    static dependencies(m, tracked) {
        const parsedBase = Plugin.dependencyParse(m);
        const name = parsedBase.name;
        tracked = tracked || {};
        if (name in tracked) {
            return tracked;
        }
        const plugin = typeof m === 'string' ? Plugin.resolve(m) : m;
        tracked[name] = (plugin.uses || []).map((dependency) => {
            if (Plugin.isPlugin(dependency)) {
                Plugin.register(dependency);
            }
            const parsed = Plugin.dependencyParse(dependency);
            const resolved = Plugin.resolve(dependency);
            if (resolved &&
                !Plugin.versionSatisfies(resolved.version, parsed.range)) {
                Common_1.default.warn('Plugin.dependencies:', Plugin.toString(resolved), 'does not satisfy', JSON.stringify(parsed), 'used by', JSON.stringify(parsedBase) + '.');
                resolved._warned = true;
                plugin._warned = true;
            }
            else if (!resolved) {
                Common_1.default.warn('Plugin.dependencies:', Plugin.toString(dependency), 'used by', JSON.stringify(parsedBase), 'could not be resolved.');
                plugin._warned = true;
            }
            return parsed.name;
        });
        for (const t of tracked[name]) {
            Plugin.dependencies(t, tracked);
        }
        return tracked;
    }
    /**
     * Parses a dependency string into its components.
     * The `dependency` is a string of the format `'module-name'` or `'module-name@version'`.
     * See documentation for `Plugin.versionParse` for a description of the format.
     * This function can also handle dependencies that are already resolved (e.g. a module object).
     * @param dependency The dependency of the format `'module-name'` or `'module-name@version'`.
     * @return The dependency parsed into its components.
     */
    static dependencyParse(dependency) {
        if (typeof dependency === 'string') {
            const pattern = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
            if (!pattern.test(dependency)) {
                Common_1.default.warn('Plugin.dependencyParse:', dependency, 'is not a valid dependency string.');
            }
            return {
                name: dependency.split('@')[0],
                range: dependency.split('@')[1] || '*',
            };
        }
        let range = '';
        if ('range' in dependency) {
            range = dependency.range;
        }
        else if ('version' in dependency) {
            range = dependency.version;
        }
        return {
            name: dependency.name,
            range,
        };
    }
    /**
     * Parses a version string into its components.
     * Versions are strictly of the format `x.y.z` (as in [semver](http://semver.org/)).
     * Versions may optionally have a prerelease tag in the format `x.y.z-alpha`.
     * Ranges are a strict subset of [npm ranges](https://docs.npmjs.com/misc/semver#advanced-range-syntax).
     * Only the following range types are supported:
     * - Tilde ranges e.g. `~1.2.3`
     * - Caret ranges e.g. `^1.2.3`
     * - Greater than ranges e.g. `>1.2.3`
     * - Greater than or equal ranges e.g. `>=1.2.3`
     * - Exact version e.g. `1.2.3`
     * - Any version `*`
     * @param range The version string.
     * @return The version range parsed into its components.
     */
    static versionParse(range) {
        const pattern = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
        if (!pattern.test(range)) {
            Common_1.default.warn('Plugin.versionParse:', range, 'is not a valid version or range.');
        }
        const parts = pattern.exec(range);
        if (!parts) {
            return {
                isRange: false,
                version: '0',
                range: range,
                operator: '',
                major: 0,
                minor: 0,
                patch: 0,
                parts: [0, 0, 0],
                prerelease: '',
                number: 0 * 1e8 + 0 * 1e4 + 0,
            };
        }
        const major = Number(parts[4]);
        const minor = Number(parts[5]);
        const patch = Number(parts[6]);
        return {
            isRange: Boolean(parts[1] || parts[2]),
            version: parts[3],
            range: range,
            operator: parts[1] || parts[2] || '',
            major: major,
            minor: minor,
            patch: patch,
            parts: [major, minor, patch],
            prerelease: parts[7],
            number: major * 1e8 + minor * 1e4 + patch,
        };
    }
    /**
     * Returns `true` if `version` satisfies the given `range`.
     * See documentation for `Plugin.versionParse` for a description of the format.
     * If a version or range is not specified, then any version (`*`) is assumed to satisfy.
     * @param version The version string.
     * @param range The range string.
     * @return {boolean} `true` if `version` satisfies `range`, otherwise `false`.
     */
    static versionSatisfies(version, range) {
        range = range || '*';
        const r = Plugin.versionParse(range);
        const v = Plugin.versionParse(version);
        if (r.isRange) {
            if (r.operator === '*' || version === '*') {
                return true;
            }
            if (r.operator === '>') {
                return v.number > r.number;
            }
            if (r.operator === '>=') {
                return v.number >= r.number;
            }
            if (r.operator === '~') {
                return v.major === r.major && v.minor === r.minor && v.patch >= r.patch;
            }
            if (r.operator === '^') {
                if (r.major > 0) {
                    return v.major === r.major && v.number >= r.number;
                }
                if (r.minor > 0) {
                    return v.minor === r.minor && v.patch >= r.patch;
                }
                return v.patch === r.patch;
            }
        }
        return version === range || version === '*';
    }
}
Plugin._registry = {};
exports["default"] = Plugin;


/***/ }),

/***/ 585:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Engine_1 = __importDefault(__webpack_require__(332));
const Events_1 = __importDefault(__webpack_require__(884));
/**
 * The `Matter.Runner` module is an optional utility which provides a game loop,
 * that handles continuously updating a `Matter.Engine` for you within a browser.
 * It is intended for development and debugging purposes, but may also be suitable for simple games.
 * If you are using your own game loop instead, then you do not need the `Matter.Runner` module.
 * Instead just call `Engine.update(engine, delta)` in your own loop.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Runner {
    /**
     * Creates a new Runner. The options parameter is an object that specifies any properties you wish to override the defaults.
     * @method create
     * @param options
     */
    static create(options = {}) {
        const defaults = {
            fps: 60,
            deltaSampleSize: 60,
            counterTimestamp: 0,
            frameCounter: 0,
            deltaHistory: [],
            timePrev: null,
            frameRequestId: null,
            isFixed: false,
            enabled: true,
            events: {},
        };
        const runner = Common_1.default.extend(defaults, options);
        runner.delta = runner.delta || 1000 / runner.fps;
        runner.deltaMin = runner.deltaMin || 1000 / runner.fps;
        runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5);
        runner.fps = 1000 / runner.delta;
        return runner;
    }
    /**
     * Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event.
     * @method run
     * @param target
     * @param engine
     */
    static run(target, engine) {
        const isEngine = (v) => 'positionIterations' in v;
        let runner;
        // create runner if engine is first argument
        if (isEngine(target)) {
            engine = target;
            runner = Runner.create();
        }
        else {
            runner = target;
        }
        const run = function (time) {
            runner.frameRequestId = Runner._requestAnimationFrame(run);
            if (time && runner.enabled) {
                Runner.tick(runner, engine, time);
            }
        };
        run();
        return runner;
    }
    /**
     * A game loop utility that updates the engine and renderer by one step (a 'tick').
     * Features delta smoothing, time correction and fixed or dynamic timing.
     * Consider just `Engine.update(engine, delta)` if you're using your own loop.
     * @method tick
     * @param runner
     * @param engine
     * @param time
     */
    static tick(runner, engine, time) {
        const timing = engine.timing;
        let delta;
        if (runner.isFixed) {
            // fixed timestep
            delta = runner.delta;
        }
        else {
            // dynamic timestep based on wall clock between calls
            delta = runner.timePrev ? time - runner.timePrev : runner.delta;
            runner.timePrev = time;
            // optimistically filter delta over a few frames, to improve stability
            runner.deltaHistory.push(delta);
            runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
            delta = Math.min.apply(null, runner.deltaHistory);
            // limit delta
            delta = delta < runner.deltaMin ? runner.deltaMin : delta;
            delta = delta > runner.deltaMax ? runner.deltaMax : delta;
            // update engine timing object
            runner.delta = delta;
        }
        // create an event object
        const event = {
            timestamp: timing.timestamp,
        };
        Events_1.default.trigger(runner, 'beforeTick', event);
        // fps counter
        runner.frameCounter += 1;
        if (time - runner.counterTimestamp >= 1000) {
            runner.fps =
                runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
            runner.counterTimestamp = time;
            runner.frameCounter = 0;
        }
        Events_1.default.trigger(runner, 'tick', event);
        // update
        Events_1.default.trigger(runner, 'beforeUpdate', event);
        Engine_1.default.update(engine, delta);
        Events_1.default.trigger(runner, 'afterUpdate', event);
        Events_1.default.trigger(runner, 'afterTick', event);
    }
    /**
     * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
     * If you wish to only temporarily pause the runner, see `runner.enabled` instead.
     * @method stop
     * @param runner
     */
    static stop(runner) {
        if (runner.frameRequestId) {
            Runner._cancelAnimationFrame(runner.frameRequestId);
        }
    }
    /**
     * Alias for `Runner.run`.
     * @method start
     * @param runner
     * @param engine
     */
    static start(runner, engine) {
        Runner.run(runner, engine);
    }
}
Runner._requestAnimationFrame = window.requestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.webkitRequestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.mozRequestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.msRequestAnimationFrame.bind(window) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (callback) {
        Runner._frameTimeout = setTimeout(() => {
            callback(Common_1.default.now());
        }, 1000 / 60);
    };
Runner._cancelAnimationFrame = window.cancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.mozCancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.webkitCancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.msCancelAnimationFrame.bind(window) ||
    function () {
        clearTimeout(Runner._frameTimeout);
    };
exports["default"] = Runner;


/***/ }),

/***/ 464:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Body_1 = __importDefault(__webpack_require__(713));
const Common_1 = __importDefault(__webpack_require__(120));
const Events_1 = __importDefault(__webpack_require__(884));
/**
 * The `Matter.Sleeping` module contains methods to manage the sleeping state of bodies.
 */
class Sleeping {
    /**
     * Puts bodies to sleep or wakes them up depending on their motion.
     * @method update
     * @param bodies
     * @param delta
     */
    static update(bodies, delta) {
        const timeScale = delta / Common_1.default._baseDelta;
        const motionSleepThreshold = Sleeping._motionSleepThreshold;
        // update bodies sleeping status
        for (const body of bodies) {
            const speed = Body_1.default.getSpeed(body);
            const angularSpeed = Body_1.default.getAngularSpeed(body);
            const motion = speed * speed + angularSpeed * angularSpeed;
            // wake up bodies if they have a force applied
            if (body.force.x !== 0 || body.force.y !== 0) {
                Sleeping.set(body, false);
                continue;
            }
            const minMotion = Math.min(body.motion, motion);
            const maxMotion = Math.max(body.motion, motion);
            // biased average motion estimation between frames
            body.motion =
                Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
            if (body.sleepThreshold > 0 && body.motion < motionSleepThreshold) {
                body.sleepCounter += 1;
                if (body.sleepCounter >= body.sleepThreshold / timeScale) {
                    Sleeping.set(body, true);
                }
            }
            else if (body.sleepCounter > 0) {
                body.sleepCounter -= 1;
            }
        }
    }
    /**
     * Given a set of colliding pairs, wakes the sleeping bodies involved.
     * @method afterCollisions
     * @param pairs
     */
    static afterCollisions(pairs) {
        const motionSleepThreshold = Sleeping._motionSleepThreshold;
        // wake up bodies involved in collisions
        for (const pair of pairs) {
            // don't wake inactive pairs
            if (!pair.isActive) {
                continue;
            }
            const collision = pair.collision;
            const bodyA = collision.bodyA.parent;
            const bodyB = collision.bodyB.parent;
            // don't wake if at least one body is static
            if ((bodyA.isSleeping && bodyB.isSleeping) ||
                bodyA.isStatic ||
                bodyB.isStatic) {
                continue;
            }
            if (bodyA.isSleeping || bodyB.isSleeping) {
                const sleepingBody = bodyA.isSleeping && !bodyA.isStatic ? bodyA : bodyB;
                const movingBody = sleepingBody === bodyA ? bodyB : bodyA;
                if (!sleepingBody.isStatic &&
                    movingBody.motion > motionSleepThreshold) {
                    Sleeping.set(sleepingBody, false);
                }
            }
        }
    }
    /**
     * Set a body as sleeping or awake.
     * @method set
     * @param body
     * @param isSleeping
     */
    static set(body, isSleeping) {
        const wasSleeping = body.isSleeping;
        if (isSleeping) {
            body.isSleeping = true;
            body.sleepCounter = body.sleepThreshold;
            body.positionImpulse.x = 0;
            body.positionImpulse.y = 0;
            body.positionPrev.x = body.position.x;
            body.positionPrev.y = body.position.y;
            body.anglePrev = body.angle;
            body.speed = 0;
            body.angularSpeed = 0;
            body.motion = 0;
            if (!wasSleeping) {
                Events_1.default.trigger(body, 'sleepStart');
            }
        }
        else {
            body.isSleeping = false;
            body.sleepCounter = 0;
            if (wasSleeping) {
                Events_1.default.trigger(body, 'sleepEnd');
            }
        }
    }
}
Sleeping._motionWakeThreshold = 0.18;
Sleeping._motionSleepThreshold = 0.08;
Sleeping._minBias = 0.9;
exports["default"] = Sleeping;


/***/ }),

/***/ 392:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Body_1 = __importDefault(__webpack_require__(713));
const Common_1 = __importDefault(__webpack_require__(120));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vector_1 = __importDefault(__webpack_require__(795));
const Vertices_1 = __importDefault(__webpack_require__(547));
/**
 * The `Matter.Bodies` module contains factory methods for creating rigid body models
 * with commonly used body configurations (such as rectangles, circles and other polygons).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Bodies {
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
    static rectangle(x, y, width, height, options = {}) {
        const rectangle = {
            label: 'Rectangle Body',
            position: { x: x, y: y },
            vertices: Vertices_1.default.fromPath('L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height),
        };
        if (options.chamfer) {
            const chamfer = options.chamfer;
            rectangle.vertices = Vertices_1.default.chamfer(rectangle.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
            delete options.chamfer;
        }
        return Body_1.default.create(Common_1.default.extend({}, rectangle, options));
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
    static trapezoid(x, y, width, height, slope, options = {}) {
        if (slope >= 1) {
            Common_1.default.warn('Bodies.trapezoid: slope parameter must be < 1.');
        }
        slope *= 0.5;
        const roof = (1 - slope * 2) * width;
        const x1 = width * slope;
        const x2 = x1 + roof;
        const x3 = x2 + x1;
        let verticesPath;
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
                    ' 0';
        }
        else {
            verticesPath = 'L 0 0 L ' + x2 + ' ' + -height + ' L ' + x3 + ' 0';
        }
        const trapezoid = {
            label: 'Trapezoid Body',
            position: { x: x, y: y },
            vertices: Vertices_1.default.fromPath(verticesPath),
        };
        if (options.chamfer) {
            const chamfer = options.chamfer;
            trapezoid.vertices = Vertices_1.default.chamfer(trapezoid.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
            delete options.chamfer;
        }
        return Body_1.default.create(Common_1.default.extend({}, trapezoid, options));
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
    static circle(x, y, radius, options = {}, maxSides = 25) {
        const circle = {
            label: 'Circle Body',
            circleRadius: radius,
        };
        // approximate circles with polygons until true circles implemented in SAT
        let sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
        // optimisation: always use even number of sides (half the number of unique axes)
        if (sides % 2 === 1) {
            sides += 1;
        }
        return Bodies.polygon(x, y, sides, radius, Common_1.default.extend({}, circle, options));
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
    static polygon(x, y, sides, radius, options = {}) {
        if (sides < 3) {
            return Bodies.circle(x, y, radius, options);
        }
        const theta = (2 * Math.PI) / sides;
        let path = '';
        const offset = theta * 0.5;
        for (let i = 0; i < sides; i += 1) {
            const angle = offset + i * theta;
            const xx = Math.cos(angle) * radius;
            const yy = Math.sin(angle) * radius;
            path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
        }
        const polygon = {
            label: 'Polygon Body',
            position: { x: x, y: y },
            vertices: Vertices_1.default.fromPath(path),
        };
        if (options.chamfer) {
            const chamfer = options.chamfer;
            polygon.vertices = Vertices_1.default.chamfer(polygon.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
            delete options.chamfer;
        }
        return Body_1.default.create(Common_1.default.extend({}, polygon, options));
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
    static fromVertices(x, y, vertexSets, options = {}, flagInternal = false, removeCollinear = 0.01, minimumArea = 10, removeDuplicatePoints = 0.01) {
        const decomp = Common_1.default.getDecomp();
        // check decomp is as expected
        // @ts-ignore
        const canDecomp = Boolean(decomp && decomp.quickDecomp);
        const parts = [];
        // ensure vertexSets is an array of arrays
        if (!Common_1.default.isArray(vertexSets[0])) {
            vertexSets = [vertexSets];
        }
        for (let v = 0; v < vertexSets.length; v += 1) {
            let vertices = vertexSets[v];
            const isConvex = Vertices_1.default.isConvex(vertices);
            const isConcave = !isConvex;
            if (isConcave && !canDecomp) {
                Common_1.default.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices.");
            }
            if (isConvex || !canDecomp) {
                if (isConvex) {
                    vertices = Vertices_1.default.clockwiseSort(vertices);
                }
                else {
                    // fallback to convex hull when decomposition is not possible
                    vertices = Vertices_1.default.hull(vertices);
                }
                parts.push({
                    position: { x: x, y: y },
                    vertices: vertices,
                });
            }
            else {
                // initialise a decomposition
                const concave = vertices.map(function (vertex) {
                    return [vertex.x, vertex.y];
                });
                // vertices are concave and simple, we can decompose into parts
                // @ts-ignore
                decomp.makeCCW(concave);
                // @ts-ignore
                if (removeCollinear !== false) {
                    // @ts-ignore
                    decomp.removeCollinearPoints(concave, removeCollinear);
                }
                // @ts-ignore
                if (removeDuplicatePoints !== false && decomp.removeDuplicatePoints) {
                    // @ts-ignore
                    decomp.removeDuplicatePoints(concave, removeDuplicatePoints);
                }
                // use the quick decomposition algorithm (Bayazit)
                // @ts-ignore
                const decomposed = decomp.quickDecomp(concave);
                // for each decomposed chunk
                for (let i = 0; i < decomposed.length; i++) {
                    const chunk = decomposed[i];
                    // convert vertices into the correct structure
                    const chunkVertices = chunk.map((vertices) => {
                        return {
                            x: vertices[0],
                            y: vertices[1],
                        };
                    });
                    // skip small chunks
                    if (minimumArea > 0 && Vertices_1.default.area(chunkVertices) < minimumArea)
                        continue;
                    // create a compound part
                    parts.push({
                        position: Vertices_1.default.centre(chunkVertices),
                        vertices: chunkVertices,
                    });
                }
            }
        }
        const bodies = [];
        // create body parts
        for (let i = 0; i < parts.length; i++) {
            bodies.push(Body_1.default.create(Common_1.default.extend(parts[i], options)));
        }
        // flag internal edges (coincident part edges)
        if (flagInternal) {
            const coincident_max_dist = 5;
            for (let i = 0; i < bodies.length; i++) {
                const partA = bodies[i];
                for (let j = i + 1; j < bodies.length; j++) {
                    const partB = bodies[j];
                    if (Bounds_1.default.overlaps(partA.bounds, partB.bounds)) {
                        const pav = partA.vertices;
                        const pbv = partB.vertices;
                        // iterate vertices of both parts
                        for (let k = 0; k < partA.vertices.length; k++) {
                            for (let z = 0; z < partB.vertices.length; z++) {
                                // find distances between the vertices
                                const da = Vector_1.default.magnitudeSquared(Vector_1.default.sub(pav[(k + 1) % pav.length], pbv[z]));
                                const db = Vector_1.default.magnitudeSquared(Vector_1.default.sub(pav[k], pbv[(z + 1) % pbv.length]));
                                // if both vertices are very close, consider the edge concident (internal)
                                if (da < coincident_max_dist && db < coincident_max_dist) {
                                    pav[k].isInternal = true;
                                    pbv[z].isInternal = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (bodies.length > 1) {
            // create the parent body to be returned, that contains generated compound parts
            const body = Body_1.default.create(Common_1.default.extend({ parts: bodies.slice(0) }, options));
            // offset such that body.position is at the centre off mass
            Body_1.default.setPosition(body, { x: x, y: y });
            return body;
        }
        else {
            return bodies[0];
        }
    }
}
exports["default"] = Bodies;


/***/ }),

/***/ 297:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Body_1 = __importDefault(__webpack_require__(713));
const Composite_1 = __importDefault(__webpack_require__(927));
const Constraint_1 = __importDefault(__webpack_require__(61));
const Common_1 = __importDefault(__webpack_require__(120));
const Bodies_1 = __importDefault(__webpack_require__(392));
/**
 * The `Matter.Composites` module contains factory methods for creating composite bodies
 * with commonly used configurations (such as stacks and chains).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Composites {
    /**
     * Create a new composite containing bodies created in the callback in a grid arrangement.
     * This function uses the body's bounds to prevent overlaps.
     * @method stack
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param columns
     * @param rows
     * @param columnGap
     * @param rowGap
     * @param callback
     * @return A new composite containing objects created in the callback
     */
    static stack(x, y, columns, rows, columnGap, rowGap, callback) {
        const stack = Composite_1.default.create({ label: 'Stack' });
        let currentX = x;
        let currentY = y;
        let lastBody;
        let i = 0;
        for (let row = 0; row < rows; row++) {
            let maxHeight = 0;
            for (let column = 0; column < columns; column++) {
                const body = callback(currentX, currentY, column, row, lastBody, i);
                if (body) {
                    const bodyHeight = body.bounds.max.y - body.bounds.min.y;
                    const bodyWidth = body.bounds.max.x - body.bounds.min.x;
                    if (bodyHeight > maxHeight) {
                        maxHeight = bodyHeight;
                    }
                    Body_1.default.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });
                    currentX = body.bounds.max.x + columnGap;
                    Composite_1.default.addBody(stack, body);
                    lastBody = body;
                    i += 1;
                }
                else {
                    currentX += columnGap;
                }
            }
            currentY += maxHeight + rowGap;
            currentX = x;
        }
        return stack;
    }
    /**
     * Chains all bodies in the given composite together using constraints.
     * @method chain
     * @param composite
     * @param xOffsetA
     * @param yOffsetA
     * @param xOffsetB
     * @param yOffsetB
     * @param options
     * @return A new composite containing objects chained together with constraints
     */
    static chain(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
        const bodies = composite.bodies;
        for (let i = 1; i < bodies.length; i++) {
            const bodyA = bodies[i - 1];
            const bodyB = bodies[i];
            const bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y;
            const bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x;
            const bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y;
            const bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
            const defaults = {
                bodyA: bodyA,
                pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
                bodyB: bodyB,
                pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB },
            };
            const constraint = Common_1.default.extend(defaults, options);
            Composite_1.default.addConstraint(composite, Constraint_1.default.create(constraint));
        }
        composite.label += ' Chain';
        return composite;
    }
    /**
     * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
     * @method mesh
     * @param composite
     * @param columns
     * @param rows
     * @param crossBrace
     * @param options
     * @return The composite containing objects meshed together with constraints
     */
    static mesh(composite, columns, rows, crossBrace, options) {
        const bodies = composite.bodies;
        for (let row = 0; row < rows; row++) {
            for (let col = 1; col < columns; col++) {
                const bodyA = bodies[col - 1 + row * columns];
                const bodyB = bodies[col + row * columns];
                Composite_1.default.addConstraint(composite, Constraint_1.default.create(Common_1.default.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
            }
            if (row > 0) {
                for (let col = 0; col < columns; col++) {
                    const bodyA = bodies[col + (row - 1) * columns];
                    const bodyB = bodies[col + row * columns];
                    Composite_1.default.addConstraint(composite, Constraint_1.default.create(Common_1.default.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
                    if (crossBrace && col > 0) {
                        const bodyC = bodies[col - 1 + (row - 1) * columns];
                        Composite_1.default.addConstraint(composite, Constraint_1.default.create(Common_1.default.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
                    }
                    if (crossBrace && col < columns - 1) {
                        const bodyC = bodies[col + 1 + (row - 1) * columns];
                        Composite_1.default.addConstraint(composite, Constraint_1.default.create(Common_1.default.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
                    }
                }
            }
        }
        composite.label += ' Mesh';
        return composite;
    }
    /**
     * Create a new composite containing bodies created in the callback in a pyramid arrangement.
     * This function uses the body's bounds to prevent overlaps.
     * @method pyramid
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param columns
     * @param rows
     * @param columnGap
     * @param rowGap
     * @param callback
     * @return A new composite containing objects created in the callback
     */
    static pyramid(x, y, columns, rows, columnGap, rowGap, callback) {
        return Composites.stack(x, y, columns, rows, columnGap, rowGap, (_stackX, stackY, column, row, lastBody, i) => {
            const actualRows = Math.min(rows, Math.ceil(columns / 2));
            const lastBodyWidth = lastBody
                ? lastBody.bounds.max.x - lastBody.bounds.min.x
                : 0;
            if (row > actualRows) {
                return;
            }
            // reverse row order
            row = actualRows - row;
            const start = row;
            const end = columns - 1 - row;
            if (column < start || column > end) {
                return;
            }
            // retroactively fix the first body's position, since width was unknown
            if (i === 1 && lastBody) {
                Body_1.default.translate(lastBody, {
                    x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth,
                    y: 0,
                });
            }
            const xOffset = lastBody ? column * lastBodyWidth : 0;
            return callback(x + xOffset + column * columnGap, stackY, column, row, lastBody, i);
        });
    }
    /**
     * This has now moved to the [newtonsCradle example](https://github.com/liabru/matter-js/blob/master/examples/newtonsCradle.js), follow that instead as this function is deprecated here.
     * @deprecated moved to newtonsCradle example
     * @method newtonsCradle
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param number
     * @param size
     * @param length
     * @return A new composite newtonsCradle body
     */
    static newtonsCradle(x, y, number, size, length) {
        const newtonsCradle = Composite_1.default.create({ label: 'Newtons Cradle' });
        for (let i = 0; i < number; i++) {
            const separation = 1.9;
            const circle = Bodies_1.default.circle(x + i * (size * separation), y + length, size, {
                inertia: Infinity,
                restitution: 1,
                friction: 0,
                frictionAir: 0.0001,
                slop: 1,
            });
            const constraint = Constraint_1.default.create({
                pointA: { x: x + i * (size * separation), y: y },
                bodyB: circle,
            });
            Composite_1.default.addBody(newtonsCradle, circle);
            Composite_1.default.addConstraint(newtonsCradle, constraint);
        }
        return newtonsCradle;
    }
    /**
     * This has now moved to the [car example](https://github.com/liabru/matter-js/blob/master/examples/car.js), follow that instead as this function is deprecated here.
     * @deprecated moved to car example
     * @method car
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param width
     * @param height
     * @param wheelSize
     * @return A new composite car body
     */
    static car(x, y, width, height, wheelSize) {
        const group = Body_1.default.nextGroup(true);
        const wheelBase = 20;
        const wheelAOffset = -width * 0.5 + wheelBase;
        const wheelBOffset = width * 0.5 - wheelBase;
        const wheelYOffset = 0;
        const car = Composite_1.default.create({ label: 'Car' });
        const body = Bodies_1.default.rectangle(x, y, width, height, {
            collisionFilter: {
                group: group,
            },
            chamfer: {
                radius: height * 0.5,
            },
            density: 0.0002,
        });
        const wheelA = Bodies_1.default.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, {
            collisionFilter: {
                group: group,
            },
            friction: 0.8,
        });
        const wheelB = Bodies_1.default.circle(x + wheelBOffset, y + wheelYOffset, wheelSize, {
            collisionFilter: {
                group: group,
            },
            friction: 0.8,
        });
        const axelA = Constraint_1.default.create({
            bodyB: body,
            pointB: { x: wheelAOffset, y: wheelYOffset },
            bodyA: wheelA,
            stiffness: 1,
            length: 0,
        });
        const axelB = Constraint_1.default.create({
            bodyB: body,
            pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: wheelB,
            stiffness: 1,
            length: 0,
        });
        Composite_1.default.addBody(car, body);
        Composite_1.default.addBody(car, wheelA);
        Composite_1.default.addBody(car, wheelB);
        Composite_1.default.addConstraint(car, axelA);
        Composite_1.default.addConstraint(car, axelB);
        return car;
    }
    /**
     * This has now moved to the [softBody example](https://github.com/liabru/matter-js/blob/master/examples/softBody.js)
     * and the [cloth example](https://github.com/liabru/matter-js/blob/master/examples/cloth.js), follow those instead as this function is deprecated here.
     * @deprecated moved to softBody and cloth examples
     * @method softBody
     * @param {number} x Starting position in X.
     * @param {number} y Starting position in Y.
     * @param {number} columns
     * @param {number} rows
     * @param {number} columnGap
     * @param {number} rowGap
     * @param {boolean} crossBrace
     * @param {number} particleRadius
     * @param {} particleOptions
     * @param {} constraintOptions
     * @return {composite} A new composite softBody
     */
    static softBody(x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
        particleOptions = Common_1.default.extend({ inertia: Infinity }, particleOptions);
        constraintOptions = Common_1.default.extend({ stiffness: 0.2, render: { type: 'line', anchors: false } }, constraintOptions);
        const softBody = Composites.stack(x, y, columns, rows, columnGap, rowGap, (stackX, stackY) => {
            return Bodies_1.default.circle(stackX, stackY, particleRadius, particleOptions);
        });
        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
        softBody.label = 'Soft Body';
        return softBody;
    }
}
exports["default"] = Composites;
(() => {
    Common_1.default.deprecated(Composites, 'newtonsCradle', 'Composites.newtonsCradle ➤ moved to newtonsCradle example');
    Common_1.default.deprecated(Composites, 'car', 'Composites.car ➤ moved to car example');
    Common_1.default.deprecated(Composites, 'softBody', 'Composites.softBody ➤ moved to softBody and cloth examples');
})();


/***/ }),

/***/ 631:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector_1 = __importDefault(__webpack_require__(795));
/**
 * The `Matter.Axes` module contains methods for creating and manipulating sets of axes.
 */
class Axes {
    /**
     * Creates a new set of axes from the given vertices.
     * @method fromVertices
     * @param vertices
     * @return A new axes from the given vertices
     */
    static fromVertices(vertices) {
        const axes = {};
        // find the unique axes, using edge normal gradients
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            const normal = Vector_1.default.normalise({
                x: vertices[j].y - vertices[i].y,
                y: vertices[i].x - vertices[j].x,
            });
            const gradient = normal.y === 0 ? Infinity : normal.x / normal.y;
            // limit precision
            const gradientStr = gradient.toFixed(3).toString();
            axes[gradientStr] = normal;
        }
        return Object.values(axes);
    }
    /**
     * Rotates a set of axes by the given angle.
     * @method rotate
     * @param axes
     * @param angle
     */
    static rotate(axes, angle) {
        if (angle === 0) {
            return;
        }
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        for (const axis of axes) {
            const xx = axis.x * cos - axis.y * sin;
            axis.y = axis.x * sin + axis.y * cos;
            axis.x = xx;
        }
    }
}
exports["default"] = Axes;


/***/ }),

/***/ 447:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector_1 = __importDefault(__webpack_require__(795));
/**
 * The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
 */
class Bounds {
    /**
     * Creates a new axis-aligned bounding box (AABB) for the given vertices.
     * @method create
     * @param vertices
     * @return A new bounds object
     */
    static create(vertices) {
        const bounds = {
            min: Vector_1.default.create(0, 0),
            max: Vector_1.default.create(0, 0),
        };
        if (vertices) {
            Bounds.update(bounds, vertices);
        }
        return bounds;
    }
    /**
     * Updates bounds using the given vertices and extends the bounds given a velocity.
     * @method update
     * @param bounds
     * @param vertices
     * @param velocity
     */
    static update(bounds, vertices, velocity) {
        bounds.min.x = Infinity;
        bounds.max.x = -Infinity;
        bounds.min.y = Infinity;
        bounds.max.y = -Infinity;
        for (const vertex of vertices) {
            if (vertex.x > bounds.max.x) {
                bounds.max.x = vertex.x;
            }
            if (vertex.x < bounds.min.x) {
                bounds.min.x = vertex.x;
            }
            if (vertex.y > bounds.max.y) {
                bounds.max.y = vertex.y;
            }
            if (vertex.y < bounds.min.y) {
                bounds.min.y = vertex.y;
            }
        }
        if (velocity) {
            if (velocity.x > 0) {
                bounds.max.x += velocity.x;
            }
            else {
                bounds.min.x += velocity.x;
            }
            if (velocity.y > 0) {
                bounds.max.y += velocity.y;
            }
            else {
                bounds.min.y += velocity.y;
            }
        }
    }
    /**
     * Returns true if the bounds contains the given point.
     * @method contains
     * @param bounds
     * @param point
     * @return True if the bounds contain the point, otherwise false
     */
    static contains(bounds, point) {
        return (point.x >= bounds.min.x &&
            point.x <= bounds.max.x &&
            point.y >= bounds.min.y &&
            point.y <= bounds.max.y);
    }
    /**
     * Returns true if the two bounds intersect.
     * @method overlaps
     * @param boundsA
     * @param boundsB
     * @return True if the bounds overlap, otherwise false
     */
    static overlaps(boundsA, boundsB) {
        return (boundsA.min.x <= boundsB.max.x &&
            boundsA.max.x >= boundsB.min.x &&
            boundsA.max.y >= boundsB.min.y &&
            boundsA.min.y <= boundsB.max.y);
    }
    /**
     * Translates the bounds by the given vector.
     * @method translate
     * @param bounds
     * @param vector
     */
    static translate(bounds, vector) {
        bounds.min.x += vector.x;
        bounds.max.x += vector.x;
        bounds.min.y += vector.y;
        bounds.max.y += vector.y;
    }
    /**
     * Shifts the bounds to the given position.
     * @method shift
     * @param bounds
     * @param position
     */
    static shift(bounds, position) {
        const deltaX = bounds.max.x - bounds.min.x;
        const deltaY = bounds.max.y - bounds.min.y;
        bounds.min.x = position.x;
        bounds.max.x = position.x + deltaX;
        bounds.min.y = position.y;
        bounds.max.y = position.y + deltaY;
    }
}
exports["default"] = Bounds;


/***/ }),

/***/ 550:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
/**
 * The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
 *
 * To use this module you also need the SVGPathSeg polyfill: https://github.com/progers/pathseg
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Svg {
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
    static pathToVertices(path, sampleLength = 15) {
        if (typeof window !== 'undefined' && !('SVGPathSeg' in window)) {
            Common_1.default.warn('Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.');
        }
        // https://github.com/wout/svg.topoly.js/blob/master/svg.topoly.js
        let lastPoint;
        let x;
        let y;
        const points = [];
        const addPoint = (px, py, pathSegType) => {
            // all odd-numbered path types are relative except PATHSEG_CLOSEPATH (1)
            const isRelative = pathSegType % 2 === 1 && pathSegType > 1;
            let lx;
            let ly;
            // when the last point doesn't equal the current point add the current point
            if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
                if (lastPoint && isRelative) {
                    lx = lastPoint.x;
                    ly = lastPoint.y;
                }
                else {
                    lx = 0;
                    ly = 0;
                }
                const point = {
                    x: lx + px,
                    y: ly + py,
                };
                // set last point
                if (isRelative || !lastPoint) {
                    lastPoint = point;
                }
                points.push(point);
                x = lx + px;
                y = ly + py;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addSegmentPoint = (segment) => {
            const segType = segment.pathSegTypeAsLetter.toUpperCase();
            // skip path ends
            if (segType === 'Z') {
                return;
            }
            // map segment to x and y
            switch (segType) {
                case 'M':
                case 'L':
                case 'T':
                case 'C':
                case 'S':
                case 'Q':
                    x = segment.x;
                    y = segment.y;
                    break;
                case 'H':
                    x = segment.x;
                    break;
                case 'V':
                    y = segment.y;
                    break;
            }
            addPoint(x, y, segment.pathSegType);
        };
        // ensure path is absolute
        Svg._svgPathToAbsolute(path);
        // get total length
        const total = path.getTotalLength();
        // queue segments
        const segments = [];
        // @ts-ignore
        for (let i = 0; i < path.pathSegList.numberOfItems; i += 1) {
            // @ts-ignore
            segments.push(path.pathSegList.getItem(i));
        }
        const segmentsQueue = segments.concat();
        let lastSegment;
        // sample through path
        while (length < total) {
            // get segment at position
            // @ts-ignore
            const segmentIndex = path.getPathSegAtLength(length);
            const segment = segments[segmentIndex];
            // new segment
            if (segment != lastSegment) {
                while (segmentsQueue.length && segmentsQueue[0] != segment) {
                    addSegmentPoint(segmentsQueue.shift());
                }
                lastSegment = segment;
            }
            // add points in between when curving
            // TODO: adaptive sampling
            switch (segment.pathSegTypeAsLetter.toUpperCase()) {
                case 'C':
                case 'T':
                case 'S':
                case 'Q':
                case 'A':
                    const point = path.getPointAtLength(length);
                    addPoint(point.x, point.y, 0);
                    break;
            }
            // increment by sample value
            // eslint-disable-next-line no-global-assign
            length += sampleLength;
        }
        // add remaining segments not passed by sampling
        for (let i = 0, il = segmentsQueue.length; i < il; ++i)
            addSegmentPoint(segmentsQueue[i]);
        return points;
    }
    static _svgPathToAbsolute(path) {
        // http://phrogz.net/convert-svg-path-to-all-absolute-commands
        // Copyright (c) Gavin Kistner
        // http://phrogz.net/js/_ReuseLicense.txt
        // Modifications: tidy formatting and naming
        let x = 0;
        let y = 0;
        let x0 = 0;
        let y0 = 0;
        let x1;
        let y1;
        let x2;
        let y2;
        // @ts-ignore
        const segs = path.pathSegList;
        const len = segs.numberOfItems;
        for (let i = 0; i < len; ++i) {
            const seg = segs.getItem(i);
            const segType = seg.pathSegTypeAsLetter;
            if (/[MLHVCSQTA]/.test(segType)) {
                if ('x' in seg) {
                    x = seg.x;
                }
                if ('y' in seg) {
                    y = seg.y;
                }
            }
            else {
                if ('x1' in seg) {
                    x1 = x + seg.x1;
                }
                if ('x2' in seg) {
                    x2 = x + seg.x2;
                }
                if ('y1' in seg) {
                    y1 = y + seg.y1;
                }
                if ('y2' in seg) {
                    y2 = y + seg.y2;
                }
                if ('x' in seg) {
                    x += seg.x;
                }
                if ('y' in seg) {
                    y += seg.y;
                }
                switch (segType) {
                    case 'm':
                        // @ts-ignore
                        segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                        break;
                    case 'l':
                        // @ts-ignore
                        segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                        break;
                    case 'h':
                        // @ts-ignore
                        segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                        break;
                    case 'v':
                        // @ts-ignore
                        segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                        break;
                    case 'c':
                        segs.replaceItem(
                        // @ts-ignore
                        path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                        break;
                    case 's':
                        segs.replaceItem(
                        // @ts-ignore
                        path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                        break;
                    case 'q':
                        segs.replaceItem(
                        // @ts-ignore
                        path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                        break;
                    case 't':
                        segs.replaceItem(
                        // @ts-ignore
                        path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                        break;
                    case 'a':
                        segs.replaceItem(
                        // @ts-ignore
                        path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                        break;
                    case 'z':
                    case 'Z':
                        x = x0;
                        y = y0;
                        break;
                }
            }
            if (segType == 'M' || segType == 'm') {
                x0 = x;
                y0 = y;
            }
        }
    }
}
exports["default"] = Svg;


/***/ }),

/***/ 795:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The `Matter.Vector` module contains methods for creating and manipulating vectors.
 * Vectors are the basis of all the geometry related operations in the engine.
 * A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Vector {
    constructor() {
        /**
         * Temporary vector pool (not thread-safe).
         */
        this._temp = [
            Vector.create(),
            Vector.create(),
            Vector.create(),
            Vector.create(),
            Vector.create(),
            Vector.create(),
        ];
    }
    /**
     * Creates a new vector.
     * @method create
     * @param x
     * @param  y
     * @return  A new vector
     */
    static create(x, y) {
        return { x: x || 0, y: y || 0 };
    }
    /**
     * Returns a new vector with `x` and `y` copied from the given `vector`.
     * @method clone
     * @param vector
     * @return A new cloned vector
     */
    static clone(vector) {
        return { x: vector.x, y: vector.y };
    }
    /**
     * Returns the magnitude (length) of a vector.
     * @method magnitude
     * @param vector
     * @return The magnitude of the vector
     */
    static magnitude(vector) {
        return Math.sqrt(Vector.magnitudeSquared(vector));
    }
    /**
     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
     * @method magnitudeSquared
     * @param {vector} vector
     * @return {number} The squared magnitude of the vector
     */
    static magnitudeSquared(vector) {
        return vector.x * vector.x + vector.y * vector.y;
    }
    /**
     * Rotates the vector about (0, 0) by specified angle.
     * @method rotate
     * @param {vector} vector
     * @param {number} angle
     * @param {vector} [output]
     * @return {vector} The vector rotated about (0, 0)
     */
    static rotate(vector, angle, output = Vector.create()) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = vector.x * cos - vector.y * sin;
        output.y = vector.x * sin + vector.y * cos;
        output.x = x;
        return output;
    }
    /**
     * Rotates the vector about a specified point by specified angle.
     * @method rotateAbout
     * @param vector
     * @param angle
     * @param point
     * @param output
     * @return A new vector rotated about the point
     */
    static rotateAbout(vector, angle, point, output = Vector.create()) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
        output.y =
            point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
        output.x = x;
        return output;
    }
    /**
     * Normalises a vector (such that its magnitude is `1`).
     * @method normalise
     * @param vector
     * @return A new vector normalised
     */
    static normalise(vector) {
        const magnitude = Vector.magnitude(vector);
        if (magnitude === 0) {
            return { x: 0, y: 0 };
        }
        return { x: vector.x / magnitude, y: vector.y / magnitude };
    }
    /**
     * Returns the dot-product of two vectors.
     * @param vectorA
     * @param vectorB
     * @return The dot product of the two vectors
     */
    static dot(vectorA, vectorB) {
        return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    }
    /**
     * Returns the cross-product of two vectors.
     * @param vectorA
     * @param vectorB
     * @return The cross product of the two vectors
     */
    static cross(vectorA, vectorB) {
        return vectorA.x * vectorB.y - vectorA.y * vectorB.x;
    }
    /**
     * Returns the cross-product of three vectors.
     * @param vectorA
     * @param vectorB
     * @param vectorC
     * @return The cross product of the three vectors
     */
    static cross3(vectorA, vectorB, vectorC) {
        return ((vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) -
            (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x));
    }
    /**
     * Adds the two vectors.
     * @method add
     * @param vectorA
     * @param vectorB
     * @param output
     * @return A new vector of vectorA and vectorB added
     */
    static add(vectorA, vectorB, output = Vector.create()) {
        output.x = vectorA.x + vectorB.x;
        output.y = vectorA.y + vectorB.y;
        return output;
    }
    /**
     * Subtracts the two vectors.
     * @param vectorA
     * @param vectorB
     * @param output
     * @return A new vector of vectorA and vectorB subtracted
     */
    static sub(vectorA, vectorB, output = Vector.create()) {
        output.x = vectorA.x - vectorB.x;
        output.y = vectorA.y - vectorB.y;
        return output;
    }
    /**
     * Multiplies a vector and a scalar.
     * @method mult
     * @param vector
     * @param scalar
     * @return A new vector multiplied by scalar
     */
    static mult(vector, scalar) {
        return { x: vector.x * scalar, y: vector.y * scalar };
    }
    /**
     * Divides a vector and a scalar.
     * @method div
     * @param vector
     * @param scalar
     * @return A new vector divided by scalar
     */
    static div(vector, scalar) {
        return { x: vector.x / scalar, y: vector.y / scalar };
    }
    /**
     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
     * @method perp
     * @param vector
     * @param negate
     * @return The perpendicular vector
     */
    static perp(vector, negate = false) {
        const negateNum = negate ? -1 : 1;
        return { x: negateNum * -vector.y, y: negateNum * vector.x };
    }
    /**
     * Negates both components of a vector such that it points in the opposite direction.
     * @method neg
     * @param vector
     * @return The negated vector
     */
    static neg(vector) {
        return { x: -vector.x, y: -vector.y };
    }
    /**
     * Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
     * @method angle
     * @param vectorA
     * @param vectorB
     * @return The angle in radians
     */
    static angle(vectorA, vectorB) {
        return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
    }
}
exports["default"] = Vector;


/***/ }),

/***/ 547:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Common_1 = __importDefault(__webpack_require__(120));
const Vector_1 = __importDefault(__webpack_require__(795));
/**
 * The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
 * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
 * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
class Vertices {
    /**
     * Creates a new set of `Matter.Body` compatible vertices.
     * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
     *
     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
     *
     * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
     * but with some additional references required for efficient collision detection routines.
     *
     * Vertices must be specified in clockwise order.
     *
     * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
     *
     * @method create
     * @param points
     * @param body
     */
    static create(points, body) {
        const vertices = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const vertex = {
                x: point.x,
                y: point.y,
                index: i,
                body: body,
                isInternal: false,
            };
            vertices.push(vertex);
        }
        return vertices;
    }
    /**
     * Parses a string containing ordered x y pairs separated by spaces (and optionally commas),
     * into a `Matter.Vertices` object for the given `Matter.Body`.
     * For parsing SVG paths, see `Svg.pathToVertices`.
     * @method fromPath
     * @param path
     * @param body
     * @return vertices
     */
    static fromPath(path, body) {
        const pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi;
        const points = [];
        path.replace(pathPattern, (_, x, y) => {
            points.push({ x: parseFloat(x), y: parseFloat(y) });
            return '';
        });
        return Vertices.create(points, body);
    }
    /**
     * Returns the centre (centroid) of the set of vertices.
     * @method centre
     * @param vertices
     * @return The centre point
     */
    static centre(vertices) {
        const area = Vertices.area(vertices, true);
        let centre = Vector_1.default.create(0, 0);
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            const cross = Vector_1.default.cross(vertices[i], vertices[j]);
            const temp = Vector_1.default.mult(Vector_1.default.add(vertices[i], vertices[j]), cross);
            centre = Vector_1.default.add(centre, temp);
        }
        return Vector_1.default.div(centre, 6 * area);
    }
    /**
     * Returns the average (mean) of the set of vertices.
     * @method mean
     * @param vertices
     * @return The average point
     */
    static mean(vertices) {
        const average = Vector_1.default.create(0, 0);
        for (const vertex of vertices) {
            average.x += vertex.x;
            average.y += vertex.y;
        }
        return Vector_1.default.div(average, vertices.length);
    }
    /**
     * Returns the area of the set of vertices.
     * @method area
     * @param vertices
     * @param signed
     * @return The area
     */
    static area(vertices, signed) {
        let area = 0;
        let j = vertices.length - 1;
        for (let i = 0; i < vertices.length; i++) {
            area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
            j = i;
        }
        if (signed) {
            return area / 2;
        }
        return Math.abs(area) / 2;
    }
    /**
     * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
     * @method inertia
     * @param vertices
     * @param mass
     * @return  The polygon's moment of inertia
     */
    static inertia(vertices, mass) {
        let numerator = 0;
        let denominator = 0;
        // find the polygon's moment of inertia, using second moment of area
        // from equations at http://www.physicsforums.com/showthread.php?t=25293
        for (let n = 0; n < vertices.length; n++) {
            const j = (n + 1) % vertices.length;
            const cross = Math.abs(Vector_1.default.cross(vertices[j], vertices[n]));
            numerator +=
                cross *
                    (Vector_1.default.dot(vertices[j], vertices[j]) +
                        Vector_1.default.dot(vertices[j], vertices[n]) +
                        Vector_1.default.dot(vertices[n], vertices[n]));
            denominator += cross;
        }
        return (mass / 6) * (numerator / denominator);
    }
    /**
     * Translates the set of vertices in-place.
     * @method translate
     * @param vertices
     * @param vector
     * @param scalar
     */
    static translate(vertices, vector, scalar = 1) {
        const translateX = vector.x * scalar;
        const translateY = vector.y * scalar;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].x += translateX;
            vertices[i].y += translateY;
        }
        return vertices;
    }
    /**
     * Rotates the set of vertices in-place.
     * @method rotate
     * @param vertices
     * @param angle
     * @param point
     */
    static rotate(vertices, angle, point) {
        if (angle === 0) {
            return;
        }
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        for (const vertex of vertices) {
            const dx = vertex.x - point.x;
            const dy = vertex.y - point.y;
            vertex.x = point.x + (dx * cos - dy * sin);
            vertex.y = point.y + (dx * sin + dy * cos);
        }
        return vertices;
    }
    /**
     * Returns `true` if the `point` is inside the set of `vertices`.
     * @method contains
     * @param vertices
     * @param point
     * @return True if the vertices contains point, otherwise false
     */
    static contains(vertices, point) {
        let vertex = vertices[vertices.length - 1];
        let nextVertex;
        for (let i = 0; i < vertices.length; i++) {
            nextVertex = vertices[i];
            if ((point.x - vertex.x) * (nextVertex.y - vertex.y) +
                (point.y - vertex.y) * (vertex.x - nextVertex.x) >
                0) {
                return false;
            }
            vertex = nextVertex;
        }
        return true;
    }
    /**
     * Scales the vertices from a point (default is centre) in-place.
     * @method scale
     * @param vertices
     * @param scaleX
     * @param scaleY
     * @param point
     */
    static scale(vertices, scaleX, scaleY, point = Vertices.centre(vertices)) {
        if (scaleX === 1 && scaleY === 1) {
            return vertices;
        }
        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const delta = Vector_1.default.sub(vertex, point);
            vertices[i].x = point.x + delta.x * scaleX;
            vertices[i].y = point.y + delta.y * scaleY;
        }
        return vertices;
    }
    /**
     * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
     * The radius parameter is a single number or an array to specify the radius for each vertex.
     * @method chamfer
     * @param vertices
     * @param radius
     * @param quality
     * @param qualityMin
     * @param qualityMax
     */
    static chamfer(vertices, radius = [8], quality = -1, qualityMin = 2, qualityMax = 14) {
        if (typeof radius === 'number') {
            radius = [radius];
        }
        const newVertices = [];
        for (let i = 0; i < vertices.length; i++) {
            const prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1];
            const vertex = vertices[i];
            const nextVertex = vertices[(i + 1) % vertices.length];
            const currentRadius = radius[i < radius.length ? i : radius.length - 1];
            if (currentRadius === 0) {
                newVertices.push(vertex);
                continue;
            }
            const prevNormal = Vector_1.default.normalise({
                x: vertex.y - prevVertex.y,
                y: prevVertex.x - vertex.x,
            });
            const nextNormal = Vector_1.default.normalise({
                x: nextVertex.y - vertex.y,
                y: vertex.x - nextVertex.x,
            });
            const diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2));
            const radiusVector = Vector_1.default.mult(Common_1.default.clone(prevNormal), currentRadius);
            const midNormal = Vector_1.default.normalise(Vector_1.default.mult(Vector_1.default.add(prevNormal, nextNormal), 0.5));
            const scaledVertex = Vector_1.default.sub(vertex, Vector_1.default.mult(midNormal, diagonalRadius));
            let precision = quality;
            if (quality === -1) {
                // automatically decide precision
                precision = Math.pow(currentRadius, 0.32) * 1.75;
            }
            precision = Common_1.default.clamp(precision, qualityMin, qualityMax);
            // use an even value for precision, more likely to reduce axes by using symmetry
            if (precision % 2 === 1) {
                precision += 1;
            }
            const alpha = Math.acos(Vector_1.default.dot(prevNormal, nextNormal));
            const theta = alpha / precision;
            for (let j = 0; j < precision; j++) {
                newVertices.push(Object.assign(Object.assign({}, vertex), Vector_1.default.add(Vector_1.default.rotate(radiusVector, theta * j), scaledVertex)));
            }
        }
        return newVertices;
    }
    /**
     * Sorts the input vertices into clockwise order in place.
     * @method clockwiseSort
     * @param vertices
     * @return vertices
     */
    static clockwiseSort(vertices) {
        const centre = Vertices.mean(vertices);
        vertices.sort(function (vertexA, vertexB) {
            return Vector_1.default.angle(centre, vertexA) - Vector_1.default.angle(centre, vertexB);
        });
        return vertices;
    }
    /**
     * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
     * @method isConvex
     * @param vertices
     * @return `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
     */
    static isConvex(vertices) {
        // http://paulbourke.net/geometry/polygonmesh/
        // Copyright (c) Paul Bourke (use permitted)
        let flag = 0;
        if (vertices.length < 3) {
            return null;
        }
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            const k = (i + 2) % vertices.length;
            let z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
            z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);
            if (z < 0) {
                flag |= 1;
            }
            else if (z > 0) {
                flag |= 2;
            }
            if (flag === 3) {
                return false;
            }
        }
        if (flag !== 0) {
            return true;
        }
        else {
            return null;
        }
    }
    /**
     * Returns the convex hull of the input vertices as a new array of points.
     * @method hull
     * @param vertices
     * @return vertices
     */
    static hull(vertices) {
        // http://geomalgorithms.com/a10-_hull-1.html
        const upper = [];
        const lower = [];
        // sort vertices on x-axis (y-axis for ties)
        vertices = vertices.slice(0);
        vertices.sort((vertexA, vertexB) => {
            const dx = vertexA.x - vertexB.x;
            return dx !== 0 ? dx : vertexA.y - vertexB.y;
        });
        // build lower hull
        for (const vertex of vertices) {
            while (lower.length >= 2 &&
                Vector_1.default.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) {
                lower.pop();
            }
            lower.push(vertex);
        }
        // build upper hull
        for (const vertex of vertices) {
            while (upper.length >= 2 &&
                Vector_1.default.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) {
                upper.pop();
            }
            upper.push(vertex);
        }
        // concatenation of the lower and upper hulls gives the convex hull
        // omit last points because they are repeated at the beginning of the other list
        upper.pop();
        lower.pop();
        return upper.concat(lower);
    }
}
exports["default"] = Vertices;


/***/ }),

/***/ 513:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Body_1 = __importDefault(__webpack_require__(713));
const Composite_1 = __importDefault(__webpack_require__(927));
const World_1 = __importDefault(__webpack_require__(178));
const Collision_1 = __importDefault(__webpack_require__(697));
const Contact_1 = __importDefault(__webpack_require__(461));
const Detector_1 = __importDefault(__webpack_require__(493));
const Grid_1 = __importDefault(__webpack_require__(281));
const Pair_1 = __importDefault(__webpack_require__(168));
const Pairs_1 = __importDefault(__webpack_require__(577));
const Query_1 = __importDefault(__webpack_require__(280));
const Resolver_1 = __importDefault(__webpack_require__(561));
const SAT_1 = __importDefault(__webpack_require__(408));
const Constraint_1 = __importDefault(__webpack_require__(61));
const MouseConstraint_1 = __importDefault(__webpack_require__(410));
const Common_1 = __importDefault(__webpack_require__(120));
const Engine_1 = __importDefault(__webpack_require__(332));
const Events_1 = __importDefault(__webpack_require__(884));
const Matter_1 = __importDefault(__webpack_require__(49));
const Mouse_1 = __importDefault(__webpack_require__(200));
const Plugin_1 = __importDefault(__webpack_require__(885));
const Runner_1 = __importDefault(__webpack_require__(585));
const Sleeping_1 = __importDefault(__webpack_require__(464));
const Bodies_1 = __importDefault(__webpack_require__(392));
const Composites_1 = __importDefault(__webpack_require__(297));
const Axes_1 = __importDefault(__webpack_require__(631));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Svg_1 = __importDefault(__webpack_require__(550));
const Vector_1 = __importDefault(__webpack_require__(795));
const Vertices_1 = __importDefault(__webpack_require__(547));
const Render_1 = __importDefault(__webpack_require__(879));
class MatterModule extends Matter_1.default {
}
MatterModule.Axes = Axes_1.default;
MatterModule.Bodies = Bodies_1.default;
MatterModule.Body = Body_1.default;
MatterModule.Bounds = Bounds_1.default;
MatterModule.Collision = Collision_1.default;
MatterModule.Common = Common_1.default;
MatterModule.Composite = Composite_1.default;
MatterModule.Composites = Composites_1.default;
MatterModule.Constraint = Constraint_1.default;
MatterModule.Contact = Contact_1.default;
MatterModule.Detector = Detector_1.default;
MatterModule.Engine = Engine_1.default;
MatterModule.Events = Events_1.default;
MatterModule.Grid = Grid_1.default;
MatterModule.Mouse = Mouse_1.default;
MatterModule.MouseConstraint = MouseConstraint_1.default;
MatterModule.Pair = Pair_1.default;
MatterModule.Pairs = Pairs_1.default;
MatterModule.Plugin = Plugin_1.default;
MatterModule.Query = Query_1.default;
MatterModule.Render = Render_1.default;
MatterModule.Resolver = Resolver_1.default;
MatterModule.Runner = Runner_1.default;
MatterModule.SAT = SAT_1.default;
MatterModule.Sleeping = Sleeping_1.default;
MatterModule.Svg = Svg_1.default;
MatterModule.Vector = Vector_1.default;
MatterModule.Vertices = Vertices_1.default;
MatterModule.World = World_1.default;
exports["default"] = MatterModule;


/***/ }),

/***/ 879:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Body_1 = __importDefault(__webpack_require__(713));
const Composite_1 = __importDefault(__webpack_require__(927));
const Common_1 = __importDefault(__webpack_require__(120));
const Engine_1 = __importDefault(__webpack_require__(332));
const Events_1 = __importDefault(__webpack_require__(884));
const Mouse_1 = __importDefault(__webpack_require__(200));
const Bounds_1 = __importDefault(__webpack_require__(447));
const Vector_1 = __importDefault(__webpack_require__(795));
/**
 * The `Matter.Render` module is a simple canvas based renderer for visualising instances of `Matter.Engine`.
 * It is intended for development and debugging purposes, but may also be suitable for simple games.
 * It includes a number of drawing options including wireframe, vector with support for sprites and viewports.
 */
class Render {
    /**
     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return A new renderer
     */
    static create(options = {}) {
        var _a, _b;
        const defaults = {
            element: null,
            mouse: null,
            frameRequestId: null,
            timing: {
                historySize: 60,
                delta: 0,
                deltaHistory: [],
                lastTime: 0,
                lastTimestamp: 0,
                lastElapsed: 0,
                timestampElapsed: 0,
                timestampElapsedHistory: [],
                engineDeltaHistory: [],
                engineElapsedHistory: [],
                elapsedHistory: [],
            },
            options: {
                width: 800,
                height: 600,
                pixelRatio: 1,
                background: '#14151f',
                wireframeBackground: '#14151f',
                wireframeStrokeStyle: '#bbb',
                hasBounds: !!options.bounds,
                enabled: true,
                wireframes: true,
                showSleeping: true,
                showDebug: false,
                showStats: false,
                showPerformance: false,
                showBounds: false,
                showVelocity: false,
                showCollisions: false,
                showSeparations: false,
                showAxes: false,
                showPositions: false,
                showAngleIndicator: false,
                showIds: false,
                showVertexNumbers: false,
                showConvexHulls: false,
                showInternalEdges: false,
                showMousePosition: false,
                showBroadphase: false,
            },
            events: {},
        };
        const render = Common_1.default.extend(defaults, options);
        if (render.canvas) {
            render.canvas.width = render.options.width || render.canvas.width;
            render.canvas.height = render.options.height || render.canvas.height;
        }
        render.mouse = (_a = options.mouse) !== null && _a !== void 0 ? _a : null;
        render.engine = (_b = options.engine) !== null && _b !== void 0 ? _b : Engine_1.default.create();
        render.canvas =
            render.canvas ||
                Render._createCanvas(render.options.width, render.options.height);
        render.context = render.canvas.getContext('2d');
        render.textures = {};
        render.bounds = render.bounds || {
            min: {
                x: 0,
                y: 0,
            },
            max: {
                x: render.canvas.width,
                y: render.canvas.height,
            },
        };
        // for temporary back compatibility only
        render.controller = Render;
        render.options.showBroadphase = false;
        if (render.options.pixelRatio !== 1) {
            Render.setPixelRatio(render, render.options.pixelRatio);
        }
        if (Common_1.default.isElement(render.element)) {
            render.element.appendChild(render.canvas);
        }
        return render;
    }
    /**
     * Continuously updates the render canvas on the `requestAnimationFrame` event.
     * @method run
     * @param render
     */
    static run(render) {
        const loop = (time) => {
            render.frameRequestId = Render._requestAnimationFrame(loop);
            Render._updateTiming(render, time);
            Render.world(render, time);
            if (render.options.showStats || render.options.showDebug) {
                Render.stats(render, render.context, time);
            }
            if (render.options.showPerformance || render.options.showDebug) {
                Render.performance(render, render.context);
            }
        };
        loop();
    }
    /**
     * Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
     * @method stop
     * @param render
     */
    static stop(render) {
        if (render.frameRequestId) {
            Render._cancelAnimationFrame(render.frameRequestId);
        }
    }
    /**
     * Sets the pixel ratio of the renderer and updates the canvas.
     * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
     * @method setPixelRatio
     * @param render
     * @param pixelRatio
     */
    static setPixelRatio(render, pr) {
        const options = render.options;
        const canvas = render.canvas;
        let pixelRatio;
        if (pr === 'auto') {
            pixelRatio = Render._getPixelRatio(canvas);
        }
        else {
            pixelRatio = pr;
        }
        options.pixelRatio = pixelRatio;
        canvas.setAttribute('data-pixel-ratio', String(pixelRatio));
        canvas.width = options.width * pixelRatio;
        canvas.height = options.height * pixelRatio;
        canvas.style.width = options.width + 'px';
        canvas.style.height = options.height + 'px';
    }
    /**
     * Sets the render `width` and `height`.
     *
     * Updates the canvas accounting for `render.options.pixelRatio`.
     *
     * Updates the bottom right render bound `render.bounds.max` relative to the provided `width` and `height`.
     * The top left render bound `render.bounds.min` isn't changed.
     *
     * Follow this call with `Render.lookAt` if you need to change the render bounds.
     *
     * See also `Render.setPixelRatio`.
     * @method setSize
     * @param render
     * @param width The width (in CSS pixels)
     * @param height The height (in CSS pixels)
     */
    static setSize(render, width, height) {
        render.options.width = width;
        render.options.height = height;
        render.bounds.max.x = render.bounds.min.x + width;
        render.bounds.max.y = render.bounds.min.y + height;
        if (render.options.pixelRatio !== 1) {
            Render.setPixelRatio(render, render.options.pixelRatio);
        }
        else {
            render.canvas.width = width;
            render.canvas.height = height;
        }
    }
    /**
     * Positions and sizes the viewport around the given object bounds.
     * Objects must have at least one of the following properties:
     * - `object.bounds`
     * - `object.position`
     * - `object.min` and `object.max`
     * - `object.x` and `object.y`
     * @method lookAt
     * @param render
     * @param objects
     * @param padding
     * @param center
     */
    static lookAt(render, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objects, padding = Vector_1.default.create(0, 0), center = true) {
        objects = Common_1.default.isArray(objects) ? objects : [objects];
        // find bounds of all objects
        const bounds = {
            min: { x: Infinity, y: Infinity },
            max: { x: -Infinity, y: -Infinity },
        };
        for (const object of objects) {
            const min = object.bounds
                ? object.bounds.min
                : object.min || object.position || object;
            const max = object.bounds
                ? object.bounds.max
                : object.max || object.position || object;
            if (min && max) {
                if (min.x < bounds.min.x) {
                    bounds.min.x = min.x;
                }
                if (max.x > bounds.max.x) {
                    bounds.max.x = max.x;
                }
                if (min.y < bounds.min.y) {
                    bounds.min.y = min.y;
                }
                if (max.y > bounds.max.y) {
                    bounds.max.y = max.y;
                }
            }
        }
        // find ratios
        const width = bounds.max.x - bounds.min.x + 2 * padding.x;
        const height = bounds.max.y - bounds.min.y + 2 * padding.y;
        const viewHeight = render.canvas.height;
        const viewWidth = render.canvas.width;
        const outerRatio = viewWidth / viewHeight;
        const innerRatio = width / height;
        let scaleX = 1;
        let scaleY = 1;
        // find scale factor
        if (innerRatio > outerRatio) {
            scaleY = innerRatio / outerRatio;
        }
        else {
            scaleX = outerRatio / innerRatio;
        }
        // enable bounds
        render.options.hasBounds = true;
        // position and size
        render.bounds.min.x = bounds.min.x;
        render.bounds.max.x = bounds.min.x + width * scaleX;
        render.bounds.min.y = bounds.min.y;
        render.bounds.max.y = bounds.min.y + height * scaleY;
        // center
        if (center) {
            render.bounds.min.x += width * 0.5 - width * scaleX * 0.5;
            render.bounds.max.x += width * 0.5 - width * scaleX * 0.5;
            render.bounds.min.y += height * 0.5 - height * scaleY * 0.5;
            render.bounds.max.y += height * 0.5 - height * scaleY * 0.5;
        }
        // padding
        render.bounds.min.x -= padding.x;
        render.bounds.max.x -= padding.x;
        render.bounds.min.y -= padding.y;
        render.bounds.max.y -= padding.y;
        // update mouse
        if (render.mouse) {
            Mouse_1.default.setScale(render.mouse, {
                x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
                y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height,
            });
            Mouse_1.default.setOffset(render.mouse, render.bounds.min);
        }
    }
    /**
     * Applies viewport transforms based on `render.bounds` to a render context.
     * @method startViewTransform
     * @param {render} render
     */
    static startViewTransform(render) {
        const boundsWidth = render.bounds.max.x - render.bounds.min.x;
        const boundsHeight = render.bounds.max.y - render.bounds.min.y;
        const boundsScaleX = boundsWidth / render.options.width;
        const boundsScaleY = boundsHeight / render.options.height;
        render.context.setTransform(render.options.pixelRatio / boundsScaleX, 0, 0, render.options.pixelRatio / boundsScaleY, 0, 0);
        render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
    }
    /**
     * Resets all transforms on the render context.
     * @method endViewTransform
     * @param render
     */
    static endViewTransform(render) {
        render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
    }
    /**
     * Renders the given `engine`'s `Matter.World` object.
     * This is the entry point for all rendering and should be called every time the scene changes.
     * @method world
     * @param render
     * @param time
     */
    static world(render, _time) {
        const startTime = Common_1.default.now();
        const engine = render.engine;
        const world = engine.world;
        const canvas = render.canvas;
        const context = render.context;
        const options = render.options;
        const timing = render.timing;
        const allBodies = world ? Composite_1.default.allBodies(world) : [];
        const allConstraints = world ? Composite_1.default.allConstraints(world) : [];
        const background = options.wireframes
            ? options.wireframeBackground
            : options.background;
        let bodies = [];
        let constraints = [];
        const event = {
            timestamp: engine.timing.timestamp,
        };
        Events_1.default.trigger(render, 'beforeRender', event);
        // apply background if it has changed
        if (render.currentBackground !== background)
            Render._applyBackground(render, background);
        // clear the canvas with a transparent fill, to allow the canvas background to show
        context.globalCompositeOperation = 'source-in';
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';
        // handle bounds
        if (options.hasBounds) {
            // filter out bodies that are not in view
            for (const body of allBodies) {
                if (Bounds_1.default.overlaps(body.bounds, render.bounds)) {
                    bodies.push(body);
                }
            }
            // filter out constraints that are not in view
            for (const constraint of allConstraints) {
                const bodyA = constraint.bodyA;
                const bodyB = constraint.bodyB;
                let pointAWorld = constraint.pointA;
                let pointBWorld = constraint.pointB;
                if (bodyA) {
                    pointAWorld = Vector_1.default.add(bodyA.position, constraint.pointA);
                }
                if (bodyB) {
                    pointBWorld = Vector_1.default.add(bodyB.position, constraint.pointB);
                }
                if (!pointAWorld || !pointBWorld) {
                    continue;
                }
                if (Bounds_1.default.contains(render.bounds, pointAWorld) ||
                    Bounds_1.default.contains(render.bounds, pointBWorld)) {
                    constraints.push(constraint);
                }
            }
            // transform the view
            Render.startViewTransform(render);
            // update mouse
            if (render.mouse) {
                Mouse_1.default.setScale(render.mouse, {
                    x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
                    y: (render.bounds.max.y - render.bounds.min.y) / render.options.height,
                });
                Mouse_1.default.setOffset(render.mouse, render.bounds.min);
            }
        }
        else {
            constraints = allConstraints;
            bodies = allBodies;
            if (render.options.pixelRatio !== 1) {
                render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
            }
        }
        if (!options.wireframes ||
            (engine.enableSleeping && options.showSleeping)) {
            // fully featured rendering of bodies
            Render.bodies(render, bodies, context);
        }
        else {
            if (options.showConvexHulls) {
                Render.bodyConvexHulls(render, bodies, context);
            }
            // optimised method for wireframes only
            Render.bodyWireframes(render, bodies, context);
        }
        if (options.showBounds) {
            Render.bodyBounds(render, bodies, context);
        }
        if (options.showAxes || options.showAngleIndicator) {
            Render.bodyAxes(render, bodies, context);
        }
        if (options.showPositions) {
            Render.bodyPositions(render, bodies, context);
        }
        if (options.showVelocity) {
            Render.bodyVelocity(render, bodies, context);
        }
        if (options.showIds) {
            Render.bodyIds(render, bodies, context);
        }
        if (options.showSeparations) {
            Render.separations(render, engine.pairs.list, context);
        }
        if (options.showCollisions) {
            Render.collisions(render, engine.pairs.list, context);
        }
        if (options.showVertexNumbers) {
            Render.vertexNumbers(render, bodies, context);
        }
        if (options.showMousePosition && render.mouse) {
            Render.mousePosition(render, render.mouse, context);
        }
        Render.constraints(constraints, context);
        if (options.hasBounds) {
            // revert view transforms
            Render.endViewTransform(render);
        }
        Events_1.default.trigger(render, 'afterRender', event);
        // log the time elapsed computing this update
        timing.lastElapsed = Common_1.default.now() - startTime;
    }
    /**
     * Renders statistics about the engine and world useful for debugging.
     * @method stats
     * @param render
     * @param context
     * @param time
     */
    static stats(render, context, _time) {
        const engine = render.engine;
        const world = engine.world;
        const bodies = world ? Composite_1.default.allBodies(world) : [];
        let parts = 0;
        const width = 55;
        const height = 44;
        let x = 0;
        const y = 0;
        // count parts
        for (let i = 0; i < bodies.length; i += 1) {
            parts += bodies[i].parts.length;
        }
        // sections
        const sections = {
            Part: parts,
            Body: bodies.length,
            Cons: world ? Composite_1.default.allConstraints(world).length : undefined,
            Comp: world ? Composite_1.default.allComposites(world).length : undefined,
            Pair: engine.pairs.list.length,
        };
        // background
        context.fillStyle = '#0e0f19';
        context.fillRect(x, y, width * 5.5, height);
        context.font = '12px Arial';
        context.textBaseline = 'top';
        context.textAlign = 'right';
        // sections
        for (const key in sections) {
            const section = sections[key];
            // label
            context.fillStyle = '#aaa';
            context.fillText(key, x + width, y + 8);
            // value
            context.fillStyle = '#eee';
            context.fillText(String(section), x + width, y + 26);
            x += width;
        }
    }
    /**
     * Renders engine and render performance information.
     * @method performance
     * @param render
     * @param context
     */
    static performance(render, context) {
        const engine = render.engine;
        const timing = render.timing;
        const deltaHistory = timing.deltaHistory;
        const elapsedHistory = timing.elapsedHistory;
        const timestampElapsedHistory = timing.timestampElapsedHistory;
        const engineDeltaHistory = timing.engineDeltaHistory;
        const engineElapsedHistory = timing.engineElapsedHistory;
        const lastEngineDelta = engine.timing.lastDelta;
        const deltaMean = Render._mean(deltaHistory);
        const elapsedMean = Render._mean(elapsedHistory);
        const engineDeltaMean = Render._mean(engineDeltaHistory);
        const engineElapsedMean = Render._mean(engineElapsedHistory);
        const timestampElapsedMean = Render._mean(timestampElapsedHistory);
        const rateMean = timestampElapsedMean / deltaMean || 0;
        const fps = 1000 / deltaMean || 0;
        const graphHeight = 4;
        const gap = 12;
        const width = 60;
        const height = 34;
        const x = 10;
        const y = 69;
        // background
        context.fillStyle = '#0e0f19';
        context.fillRect(0, 50, gap * 4 + width * 5 + 22, height);
        // show FPS
        Render.status(context, x, y, width, graphHeight, deltaHistory.length, Math.round(fps) + ' fps', fps / Render._goodFps, (i) => {
            return deltaHistory[i] / deltaMean - 1;
        });
        // show engine delta
        Render.status(context, x + gap + width, y, width, graphHeight, engineDeltaHistory.length, (lastEngineDelta === null || lastEngineDelta === void 0 ? void 0 : lastEngineDelta.toFixed(2)) + ' dt', Render._goodDelta / (lastEngineDelta !== null && lastEngineDelta !== void 0 ? lastEngineDelta : NaN), (i) => {
            return engineDeltaHistory[i] / engineDeltaMean - 1;
        });
        // show engine update time
        Render.status(context, x + (gap + width) * 2, y, width, graphHeight, engineElapsedHistory.length, engineElapsedMean.toFixed(2) + ' ut', 1 - engineElapsedMean / Render._goodFps, (i) => {
            return engineElapsedHistory[i] / engineElapsedMean - 1;
        });
        // show render time
        Render.status(context, x + (gap + width) * 3, y, width, graphHeight, elapsedHistory.length, elapsedMean.toFixed(2) + ' rt', 1 - elapsedMean / Render._goodFps, (i) => {
            return elapsedHistory[i] / elapsedMean - 1;
        });
        // show effective speed
        Render.status(context, x + (gap + width) * 4, y, width, graphHeight, timestampElapsedHistory.length, rateMean.toFixed(2) + ' x', rateMean * rateMean * rateMean, (i) => {
            return ((timestampElapsedHistory[i] / deltaHistory[i] / rateMean || 0) - 1);
        });
    }
    /**
     * Renders a label, indicator and a chart.
     * @method status
     * @param context
     * @param x
     * @param y
     * @param width
     * @param height
     * @param count
     * @param label
     * @param indicator
     * @param plotY
     */
    static status(context, x, y, width, height, count, label, indicator, plotY) {
        // background
        context.strokeStyle = '#888';
        context.fillStyle = '#444';
        context.lineWidth = 1;
        context.fillRect(x, y + 7, width, 1);
        // chart
        context.beginPath();
        context.moveTo(x, y + 7 - height * Common_1.default.clamp(0.4 * plotY(0), -2, 2));
        for (let i = 0; i < width; i += 1) {
            context.lineTo(x + i, y + 7 - (i < count ? height * Common_1.default.clamp(0.4 * plotY(i), -2, 2) : 0));
        }
        context.stroke();
        // indicator
        context.fillStyle =
            'hsl(' + Common_1.default.clamp(25 + 95 * indicator, 0, 120) + ',100%,60%)';
        context.fillRect(x, y - 7, 4, 4);
        // label
        context.font = '12px Arial';
        context.textBaseline = 'middle';
        context.textAlign = 'right';
        context.fillStyle = '#eee';
        context.fillText(label, x + width, y - 5);
    }
    /**
     * Description
     * @method constraints
     * @param constraints
     * @param context
     */
    static constraints(constraints, context) {
        for (const constraint of constraints) {
            if (!constraint.render.visible ||
                !constraint.pointA ||
                !constraint.pointB) {
                continue;
            }
            const bodyA = constraint.bodyA;
            const bodyB = constraint.bodyB;
            let start;
            let end;
            if (bodyA) {
                start = Vector_1.default.add(bodyA.position, constraint.pointA);
            }
            else {
                start = constraint.pointA;
            }
            if (constraint.render.type === 'pin') {
                context.beginPath();
                context.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                context.closePath();
            }
            else {
                if (bodyB) {
                    end = Vector_1.default.add(bodyB.position, constraint.pointB);
                }
                else {
                    end = constraint.pointB;
                }
                context.beginPath();
                context.moveTo(start.x, start.y);
                if (constraint.render.type === 'spring') {
                    const delta = Vector_1.default.sub(end, start);
                    const normal = Vector_1.default.perp(Vector_1.default.normalise(delta));
                    const coils = Math.ceil(Common_1.default.clamp(constraint.length / 5, 12, 20));
                    let offset;
                    for (let j = 1; j < coils; j += 1) {
                        offset = j % 2 === 0 ? 1 : -1;
                        context.lineTo(start.x + delta.x * (j / coils) + normal.x * offset * 4, start.y + delta.y * (j / coils) + normal.y * offset * 4);
                    }
                }
                context.lineTo(end.x, end.y);
            }
            if (constraint.render.lineWidth) {
                context.lineWidth = constraint.render.lineWidth;
                context.strokeStyle = constraint.render.strokeStyle;
                context.stroke();
            }
            if (constraint.render.anchors) {
                context.fillStyle = constraint.render.strokeStyle;
                context.beginPath();
                context.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                if (end) {
                    context.arc(end.x, end.y, 3, 0, 2 * Math.PI);
                }
                context.closePath();
                context.fill();
            }
        }
    }
    /**
     * Description
     * @method bodies
     * @param render
     * @param bodies
     * @param context
     */
    static bodies(render, bodies, context) {
        const options = render.options;
        const showInternalEdges = options.showInternalEdges || !options.wireframes;
        for (const body of bodies) {
            if (!body.render.visible) {
                continue;
            }
            // handle compound parts
            for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                const part = body.parts[k];
                if (!part.render.visible) {
                    continue;
                }
                if (options.showSleeping && body.isSleeping) {
                    context.globalAlpha = 0.5 * part.render.opacity;
                }
                else if (part.render.opacity !== 1) {
                    context.globalAlpha = part.render.opacity;
                }
                if (part.render.sprite &&
                    part.render.sprite.texture &&
                    !options.wireframes) {
                    // part sprite
                    const sprite = part.render.sprite;
                    const texture = Render._getTexture(render, sprite.texture);
                    context.translate(part.position.x, part.position.y);
                    context.rotate(part.angle);
                    context.drawImage(texture, texture.width * -sprite.xOffset * sprite.xScale, texture.height * -sprite.yOffset * sprite.yScale, texture.width * sprite.xScale, texture.height * sprite.yScale);
                    // revert translation, hopefully faster than save / restore
                    context.rotate(-part.angle);
                    context.translate(-part.position.x, -part.position.y);
                }
                else {
                    // part polygon
                    if (part.circleRadius) {
                        context.beginPath();
                        context.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
                    }
                    else {
                        context.beginPath();
                        context.moveTo(part.vertices[0].x, part.vertices[0].y);
                        for (let j = 1; j < part.vertices.length; j++) {
                            if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                                context.lineTo(part.vertices[j].x, part.vertices[j].y);
                            }
                            else {
                                context.moveTo(part.vertices[j].x, part.vertices[j].y);
                            }
                            if (part.vertices[j].isInternal && !showInternalEdges) {
                                context.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                            }
                        }
                        context.lineTo(part.vertices[0].x, part.vertices[0].y);
                        context.closePath();
                    }
                    if (!options.wireframes) {
                        context.fillStyle = part.render.fillStyle;
                        if (part.render.lineWidth) {
                            context.lineWidth = part.render.lineWidth;
                            context.strokeStyle = part.render.strokeStyle;
                            context.stroke();
                        }
                        context.fill();
                    }
                    else {
                        context.lineWidth = 1;
                        context.strokeStyle = render.options.wireframeStrokeStyle;
                        context.stroke();
                    }
                }
                context.globalAlpha = 1;
            }
        }
    }
    /**
     * Optimised method for drawing body wireframes in one pass
     * @method bodyWireframes
     * @param render
     * @param bodies
     * @param context
     */
    static bodyWireframes(render, bodies, context) {
        const showInternalEdges = render.options.showInternalEdges;
        context.beginPath();
        // render all bodies
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (!body.render.visible) {
                continue;
            }
            // handle compound parts
            for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                const part = body.parts[k];
                context.moveTo(part.vertices[0].x, part.vertices[0].y);
                for (let j = 1; j < part.vertices.length; j++) {
                    if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                        context.lineTo(part.vertices[j].x, part.vertices[j].y);
                    }
                    else {
                        context.moveTo(part.vertices[j].x, part.vertices[j].y);
                    }
                    if (part.vertices[j].isInternal && !showInternalEdges) {
                        context.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                    }
                }
                context.lineTo(part.vertices[0].x, part.vertices[0].y);
            }
        }
        context.lineWidth = 1;
        context.strokeStyle = render.options.wireframeStrokeStyle;
        context.stroke();
    }
    /**
     * Optimised method for drawing body convex hull wireframes in one pass
     * @method bodyConvexHulls
     * @param render
     * @param bodies
     * @param context
     */
    static bodyConvexHulls(_render, bodies, context) {
        context.beginPath();
        // render convex hulls
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (!body.render.visible || body.parts.length === 1) {
                continue;
            }
            context.moveTo(body.vertices[0].x, body.vertices[0].y);
            for (let j = 1; j < body.vertices.length; j++) {
                context.lineTo(body.vertices[j].x, body.vertices[j].y);
            }
            context.lineTo(body.vertices[0].x, body.vertices[0].y);
        }
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(255,255,255,0.2)';
        context.stroke();
    }
    /**
     * Renders body vertex numbers.
     * @method vertexNumbers
     * @param render
     * @param bodies
     * @param context
     */
    static vertexNumbers(_render, bodies, context) {
        for (let i = 0; i < bodies.length; i++) {
            const parts = bodies[i].parts;
            for (let k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
                const part = parts[k];
                for (let j = 0; j < part.vertices.length; j++) {
                    context.fillStyle = 'rgba(255,255,255,0.2)';
                    context.fillText(i + '_' + j, part.position.x + (part.vertices[j].x - part.position.x) * 0.8, part.position.y + (part.vertices[j].y - part.position.y) * 0.8);
                }
            }
        }
    }
    /**
     * Renders mouse position.
     * @method mousePosition
     * @param render
     * @param mouse
     * @param context
     */
    static mousePosition(_render, mouse, context) {
        context.fillStyle = 'rgba(255,255,255,0.8)';
        context.fillText(mouse.position.x + '  ' + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
    }
    /**
     * Draws body bounds
     * @method bodyBounds
     * @param render
     * @param bodies
     * @param context
     */
    static bodyBounds(render, bodies, context) {
        const options = render.options;
        context.beginPath();
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (body.render.visible) {
                const parts = bodies[i].parts;
                for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    const part = parts[j];
                    context.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
                }
            }
        }
        if (options.wireframes) {
            context.strokeStyle = 'rgba(255,255,255,0.08)';
        }
        else {
            context.strokeStyle = 'rgba(0,0,0,0.1)';
        }
        context.lineWidth = 1;
        context.stroke();
    }
    /**
     * Draws body angle indicators and axes
     * @method bodyAxes
     * @param render
     * @param bodies
     * @param context
     */
    static bodyAxes(render, bodies, context) {
        const options = render.options;
        context.beginPath();
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            const parts = body.parts;
            if (!body.render.visible) {
                continue;
            }
            if (options.showAxes) {
                // render all axes
                for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    const part = parts[j];
                    for (let k = 0; k < part.axes.length; k++) {
                        const axis = part.axes[k];
                        context.moveTo(part.position.x, part.position.y);
                        context.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
                    }
                }
            }
            else {
                for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    const part = parts[j];
                    for (let k = 0; k < part.axes.length; k++) {
                        // render a single axis indicator
                        context.moveTo(part.position.x, part.position.y);
                        context.lineTo((part.vertices[0].x + part.vertices[part.vertices.length - 1].x) /
                            2, (part.vertices[0].y + part.vertices[part.vertices.length - 1].y) /
                            2);
                    }
                }
            }
        }
        if (options.wireframes) {
            context.strokeStyle = 'indianred';
            context.lineWidth = 1;
        }
        else {
            context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            context.globalCompositeOperation = 'overlay';
            context.lineWidth = 2;
        }
        context.stroke();
        context.globalCompositeOperation = 'source-over';
    }
    /**
     * Draws body positions
     * @method bodyPositions
     * @param render
     * @param bodies
     * @param context
     */
    static bodyPositions(render, bodies, context) {
        const options = render.options;
        context.beginPath();
        // render current positions
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (!body.render.visible) {
                continue;
            }
            // handle compound parts
            for (let k = 0; k < body.parts.length; k++) {
                const part = body.parts[k];
                context.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
                context.closePath();
            }
        }
        if (options.wireframes) {
            context.fillStyle = 'indianred';
        }
        else {
            context.fillStyle = 'rgba(0,0,0,0.5)';
        }
        context.fill();
        context.beginPath();
        // render previous positions
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (body.render.visible) {
                context.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
                context.closePath();
            }
        }
        context.fillStyle = 'rgba(255,165,0,0.8)';
        context.fill();
    }
    /**
     * Draws body velocity
     * @method bodyVelocity
     * @param render
     * @param bodies
     * @param context
     */
    static bodyVelocity(_render, bodies, context) {
        context.beginPath();
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (!body.render.visible) {
                continue;
            }
            const velocity = Body_1.default.getVelocity(body);
            context.moveTo(body.position.x, body.position.y);
            context.lineTo(body.position.x + velocity.x, body.position.y + velocity.y);
        }
        context.lineWidth = 3;
        context.strokeStyle = 'cornflowerblue';
        context.stroke();
    }
    /**
     * Draws body ids
     * @method bodyIds
     * @param render
     * @param bodies
     * @param context
     */
    static bodyIds(_render, bodies, context) {
        for (let i = 0; i < bodies.length; i++) {
            if (!bodies[i].render.visible) {
                continue;
            }
            const parts = bodies[i].parts;
            for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                const part = parts[j];
                context.font = '12px Arial';
                context.fillStyle = 'rgba(255,255,255,0.5)';
                context.fillText(String(part.id), part.position.x + 10, part.position.y - 10);
            }
        }
    }
    /**
     * Description
     * @method collisions
     * @param render
     * @param pairs
     * @param context
     */
    static collisions(render, pairs, context) {
        const options = render.options;
        context.beginPath();
        // render collision positions
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (!pair.isActive) {
                continue;
            }
            for (let j = 0; j < pair.activeContacts.length; j++) {
                const contact = pair.activeContacts[j];
                const vertex = contact.vertex;
                context.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
            }
        }
        if (options.wireframes) {
            context.fillStyle = 'rgba(255,255,255,0.7)';
        }
        else {
            context.fillStyle = 'orange';
        }
        context.fill();
        context.beginPath();
        // render collision normals
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (!pair.isActive) {
                continue;
            }
            const collision = pair.collision;
            if (pair.activeContacts.length > 0) {
                let normalPosX = pair.activeContacts[0].vertex.x;
                let normalPosY = pair.activeContacts[0].vertex.y;
                if (pair.activeContacts.length === 2) {
                    normalPosX =
                        (pair.activeContacts[0].vertex.x +
                            pair.activeContacts[1].vertex.x) /
                            2;
                    normalPosY =
                        (pair.activeContacts[0].vertex.y +
                            pair.activeContacts[1].vertex.y) /
                            2;
                }
                if (collision.bodyB === collision.supports[0].body ||
                    collision.bodyA.isStatic === true) {
                    context.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
                }
                else {
                    context.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
                }
                context.lineTo(normalPosX, normalPosY);
            }
        }
        if (options.wireframes) {
            context.strokeStyle = 'rgba(255,165,0,0.7)';
        }
        else {
            context.strokeStyle = 'orange';
        }
        context.lineWidth = 1;
        context.stroke();
    }
    /**
     * Description
     * @method separations
     * @param render
     * @param pairs
     * @param context
     */
    static separations(render, pairs, context) {
        const options = render.options;
        context.beginPath();
        // render separations
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (!pair.isActive) {
                continue;
            }
            const collision = pair.collision;
            const bodyA = collision.bodyA;
            const bodyB = collision.bodyB;
            let k = 1;
            if (!bodyB.isStatic && !bodyA.isStatic) {
                k = 0.5;
            }
            if (bodyB.isStatic) {
                k = 0;
            }
            context.moveTo(bodyB.position.x, bodyB.position.y);
            context.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);
            k = 1;
            if (!bodyB.isStatic && !bodyA.isStatic) {
                k = 0.5;
            }
            if (bodyA.isStatic) {
                k = 0;
            }
            context.moveTo(bodyA.position.x, bodyA.position.y);
            context.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
        }
        if (options.wireframes) {
            context.strokeStyle = 'rgba(255,165,0,0.5)';
        }
        else {
            context.strokeStyle = 'orange';
        }
        context.stroke();
    }
    /**
     * Description
     * @method inspector
     * @param inspector
     * @param context
     */
    static inspector(inspector, context) {
        const selected = inspector.selected;
        const render = inspector.render;
        const options = render.options;
        if (options.hasBounds) {
            const boundsWidth = render.bounds.max.x - render.bounds.min.x;
            const boundsHeight = render.bounds.max.y - render.bounds.min.y;
            const boundsScaleX = boundsWidth / render.options.width;
            const boundsScaleY = boundsHeight / render.options.height;
            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
            context.translate(-render.bounds.min.x, -render.bounds.min.y);
        }
        for (let i = 0; i < selected.length; i++) {
            const item = selected[i].data;
            context.translate(0.5, 0.5);
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(255,165,0,0.9)';
            context.setLineDash([1, 2]);
            switch (item.type) {
                case 'body':
                    // render body selections
                    const bounds = item.bounds;
                    context.beginPath();
                    context.rect(Math.floor(bounds.min.x - 3), Math.floor(bounds.min.y - 3), Math.floor(bounds.max.x - bounds.min.x + 6), Math.floor(bounds.max.y - bounds.min.y + 6));
                    context.closePath();
                    context.stroke();
                    break;
                case 'constraint':
                    // render constraint selections
                    let point = item.pointA;
                    if (item.bodyA) {
                        point = item.pointB;
                    }
                    context.beginPath();
                    context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                    context.closePath();
                    context.stroke();
                    break;
            }
            context.setLineDash([]);
            context.translate(-0.5, -0.5);
        }
        // render selection region
        if (inspector.selectStart !== null) {
            context.translate(0.5, 0.5);
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(255,165,0,0.6)';
            context.fillStyle = 'rgba(255,165,0,0.1)';
            const bounds = inspector.selectBounds;
            context.beginPath();
            context.rect(Math.floor(bounds.min.x), Math.floor(bounds.min.y), Math.floor(bounds.max.x - bounds.min.x), Math.floor(bounds.max.y - bounds.min.y));
            context.closePath();
            context.stroke();
            context.fill();
            context.translate(-0.5, -0.5);
        }
        if (options.hasBounds) {
            context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    /**
     * Updates render timing.
     * @method _updateTiming
     * @param render
     * @param time
     */
    static _updateTiming(render, time) {
        const engine = render.engine;
        const timing = render.timing;
        const historySize = timing.historySize;
        const timestamp = engine.timing.timestamp;
        timing.delta =
            timing.lastTime && time ? time - timing.lastTime : Render._goodDelta;
        timing.lastTime = time;
        timing.timestampElapsed =
            timestamp && timing.lastTimestamp ? timestamp - timing.lastTimestamp : 0;
        timing.lastTimestamp = timestamp;
        timing.deltaHistory.unshift(timing.delta);
        timing.deltaHistory.length = Math.min(timing.deltaHistory.length, historySize);
        timing.engineDeltaHistory.unshift(engine.timing.lastDelta);
        timing.engineDeltaHistory.length = Math.min(timing.engineDeltaHistory.length, historySize);
        timing.timestampElapsedHistory.unshift(timing.timestampElapsed);
        timing.timestampElapsedHistory.length = Math.min(timing.timestampElapsedHistory.length, historySize);
        timing.engineElapsedHistory.unshift(engine.timing.lastElapsed);
        timing.engineElapsedHistory.length = Math.min(timing.engineElapsedHistory.length, historySize);
        timing.elapsedHistory.unshift(timing.lastElapsed);
        timing.elapsedHistory.length = Math.min(timing.elapsedHistory.length, historySize);
    }
    /**
     * Returns the mean value of the given numbers.
     * @method _mean
     * @param values
     * @return the mean of given values
     */
    static _mean(values) {
        let result = 0;
        for (let i = 0; i < values.length; i += 1) {
            result += values[i];
        }
        return result / values.length || 0;
    }
    /**
     * @method _createCanvas
     * @param width
     * @param height
     * @return canvas
     */
    static _createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.oncontextmenu = function () {
            return false;
        };
        canvas.onselectstart = function () {
            return false;
        };
        return canvas;
    }
    /**
     * Gets the pixel ratio of the canvas.
     * @method _getPixelRatio
     * @param canvas
     * @return pixel ratio
     */
    static _getPixelRatio(canvas) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStorePixelRatio = 1;
        return devicePixelRatio / backingStorePixelRatio;
    }
    /**
     * Gets the requested texture (an Image) via its path
     * @method _getTexture
     * @param render
     * @param imagePath
     * @return texture
     */
    static _getTexture(render, imagePath) {
        let image = render.textures[imagePath];
        if (image) {
            return image;
        }
        image = render.textures[imagePath] = new Image();
        image.src = imagePath;
        return image;
    }
    /**
     * Applies the background to the canvas using CSS.
     * @method applyBackground
     * @param render
     * @param background
     */
    static _applyBackground(render, background) {
        let cssBackground = background;
        if (/(jpg|gif|png)$/.test(background)) {
            cssBackground = 'url(' + background + ')';
        }
        render.canvas.style.background = cssBackground;
        render.canvas.style.backgroundSize = 'contain';
        render.currentBackground = background;
    }
}
Render._requestAnimationFrame = window.requestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.webkitRequestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.mozRequestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.msRequestAnimationFrame.bind(window) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (callback) {
        window.setTimeout(function () {
            callback(Common_1.default.now());
        }, 1000 / 60);
    };
Render._cancelAnimationFrame = window.cancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.mozCancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.webkitCancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.msCancelAnimationFrame.bind(window);
Render._goodFps = 30;
Render._goodDelta = 1000 / 60;
exports["default"] = Render;


/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@rozelin/matter-ts","version":"1.0.5","license":"MIT","homepage":"https://github.com/Rozelin-dc/matter-tools","author":"Rozelin <rozelin.dc@gmail.com> (https://github.com/Rozelin-dc)","description":"a 2D rigid body physics engine for the web","main":"build/matter.js","types":"build/matter.d.ts","repository":{"type":"git","url":"https://github.com/Rozelin-dc/matter-ts.git"},"keywords":["typescript","canvas","html5","physics","physics engine","game engine","rigid body physics"],"devDependencies":{"@babel/core":"^7.23.0","@babel/preset-env":"^7.22.20","@babel/preset-typescript":"^7.23.0","@typescript-eslint/eslint-plugin":"^7.7.0","@typescript-eslint/parser":"^7.7.0","babel-jest":"^29.7.0","conventional-changelog-cli":"^4.1.0","eslint":"^8.49.0","html-webpack-plugin":"^5.5.3","jest":"^29.7.0","jest-worker":"^29.7.0","json-stringify-pretty-compact":"^4.0.0","matter-tools":"^0.14.0","matter-wrap":"^0.2.0","mock-require":"^3.0.3","pathseg":"^1.2.1","poly-decomp":"^0.3.0","puppeteer-core":"^21.2.1","terser-webpack-plugin":"^5.3.9","ts-loader":"^9.4.4","typedoc":"^0.25.1","typescript":"^5.2.2","webpack":"^5.88.2","webpack-bundle-analyzer":"^4.9.1","webpack-cli":"^5.1.4","webpack-dev-server":"^4.15.1"},"scripts":{"start":"npm run dev","dev":"npm run serve -- --open","serve":"webpack-dev-server --no-cache --mode development --config webpack.demo.config.js","watch":"nodemon --watch webpack.demo.config.js --exec \\"npm run serve\\"","build":"webpack --mode=production","build-alpha":"webpack --mode=production","build-dev":"webpack --mode=production","build-demo":"rm -rf ./demo/js && webpack --config webpack.demo.config.js --mode=production && webpack --config webpack.demo.config.js --mode=production","lint":"eslint \\"src/**/*.ts\\"","typedoc":"typedoc --out docs src/**/*.ts","type-check":"tsc --noEmit","test":"jest"},"files":["src","build"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(513);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});