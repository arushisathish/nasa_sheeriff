import * as THREE from 'three';
import { soundService } from '../services/soundService';
import { getMartianTerrainHeight } from './MarsEnvironment';

/**
 * Advanced First-Person Controller with:
 * - Dynamic Mars Low-Gravity Engine (0.38g outside vs 1.0g inside)
 * - Reliable Rover Entry & Safe Terrain-Snapped Exit
 * - Wall-sliding collision against habitat walls and dunes
 * - Sprinting (Shift), floaty Jump (Space), Scanner (F)
 * - Configurable mouse sensitivity & PointerLock lifecycle
 */
export class FirstPersonControls {
  constructor(camera, domElement, callbacks = {}) {
    this.camera = camera;
    this.domElement = domElement;
    this.onInteract = callbacks.onInteract;
    this.onTogglePause = callbacks.onTogglePause;
    this.onToggleScanner = callbacks.onToggleScanner;
    this.onToggleDebugColliders = callbacks.onToggleDebugColliders;

    // Pointer Lock & Camera Rotation
    this.isLocked = false;
    this.pitch = 0;
    this.yaw = 0;
    this.sensitivity = 0.0022;

    // Movement Physics
    this.velocity = new THREE.Vector3();
    this.walkSpeed = 4.8;    // m/s
    this.sprintSpeed = 8.2;   // m/s
    this.roverSpeed = 16.0;   // m/s cruise
    this.roverTurbo = 24.0;   // m/s turbo
    this.damping = 10.0;
    this.isSprinting = false;
    this.isDrivingRover = false;

    // Dynamic Gravity System:
    // Inside habitat: 9.8 m/s² (simulated artificial 1.0g)
    // Outside on Mars: 3.72 m/s² (0.38g true Martian surface low-gravity)
    this.velocityY = 0;
    this.gravity = 9.8;
    this.jumpStrength = 4.4;
    this.isGrounded = true;
    this.baseEyeHeight = 1.7;
    this.isOutdoors = false;

    // Footstep audio timing
    this.lastFootstepTime = 0;

    // Key tracking using Set (immune to ghosting and stuck keys)
    this.pressedKeys = new Set();

    // Bind event handlers
    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onPointerLockChange = this.handlePointerLockChange.bind(this);
    this.onWindowBlur = this.handleWindowBlur.bind(this);

    // Initial position inside Command Hub
    this.camera.position.set(0, this.baseEyeHeight, 2.5);
    this.camera.rotation.order = 'YXZ';

    this.attach();
  }

  attach() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    window.addEventListener('blur', this.onWindowBlur);
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    window.removeEventListener('blur', this.onWindowBlur);
    this.unlock();
  }

  setSensitivity(multiplier) {
    this.sensitivity = 0.0022 * Math.max(0.2, Math.min(3.0, multiplier));
  }

  clearKeys() {
    this.pressedKeys.clear();
    this.velocity.set(0, 0, 0);
    this.isSprinting = false;
  }

  handleWindowBlur() {
    this.clearKeys();
  }

  lock() {
    if (this.domElement) {
      this.domElement.requestPointerLock();
    }
  }

  unlock() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  handlePointerLockChange() {
    this.isLocked = document.pointerLockElement === this.domElement;
    if (!this.isLocked) {
      this.clearKeys();
    }
  }

  handleMouseMove(event) {
    if (!this.isLocked) return;

    this.yaw -= event.movementX * this.sensitivity;
    this.pitch -= event.movementY * this.sensitivity;

    // Clamp pitch between -85° and +85°
    const maxPitch = Math.PI / 2 - 0.08;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  handleKeyDown(event) {
    // Pause hotkey toggle
    if (event.code === 'KeyP') {
      if (this.onTogglePause) {
        this.onTogglePause();
      }
      return;
    }

    // Interaction hotkey: While driving rover, pressing E ALWAYS triggers dismount
    if (event.code === 'KeyE') {
      if (this.isDrivingRover) {
        if (this.onInteract) {
          this.onInteract('mars_rover');
        }
        return;
      }

      if (this.onInteract) {
        this.onInteract();
      }
      return;
    }

    // Scanner toggle hotkey
    if (event.code === 'KeyF') {
      if (this.onToggleScanner) {
        this.onToggleScanner();
      }
      return;
    }

    // Debug collider wireframes hotkey (B)
    if (event.code === 'KeyB') {
      if (this.onToggleDebugColliders) {
        this.onToggleDebugColliders();
      }
      return;
    }

    // Jump hotkey (with Mars Low-G jump when outdoors)
    if (event.code === 'Space') {
      if (!this.isDrivingRover && this.isGrounded && this.isLocked) {
        // Outside on Mars: floaty, high low-g jump (0.38g) with slower descent
        const currentJump = this.isOutdoors ? 5.6 : this.jumpStrength;
        this.velocityY = currentJump;
        this.isGrounded = false;
        soundService.playJump();
      }
      event.preventDefault();
      return;
    }

    this.pressedKeys.add(event.code);
  }

  handleKeyUp(event) {
    this.pressedKeys.delete(event.code);
  }

  /**
   * Mount or dismount the rover cleanly.
   */
  setDrivingRover(driving, roverPos) {
    this.isDrivingRover = driving;

    if (driving) {
      this.baseEyeHeight = 2.2; // Elevated cockpit driving seating
      this.velocity.set(0, 0, 0);
      this.velocityY = 0;

      const targetPos = roverPos || this.camera.position;
      const groundY = getMartianTerrainHeight(targetPos.x, targetPos.z);
      this.camera.position.set(targetPos.x, groundY + this.baseEyeHeight, targetPos.z);
    } else {
      this.baseEyeHeight = 1.7; // Standard astronaut standing height

      // Safely offset the player 3.0m to the side of the rover (driver egress)
      const basePos = roverPos || this.camera.position;
      const leftExit = new THREE.Vector3(-3.0, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      const rightExit = new THREE.Vector3(3.0, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

      let exitX = basePos.x + leftExit.x;
      let exitZ = basePos.z + leftExit.z;

      // Test candidate exit against valid positions and ensure outdoors
      if (!this.isValidPosition(exitX, exitZ) || exitX < 14.5) {
        exitX = basePos.x + rightExit.x;
        exitZ = basePos.z + rightExit.z;
      }
      if (exitX < 14.5) {
        exitX = Math.max(15.0, basePos.x + 3.0);
      }

      // Snap safely to Martian terrain height (never clip into ground or vehicle)
      const groundY = getMartianTerrainHeight(exitX, exitZ);
      this.camera.position.set(exitX, groundY + this.baseEyeHeight, exitZ);

      // Restore clean on-foot collision and reset velocities
      this.velocity.set(0, 0, 0);
      this.velocityY = 0;
      this.isGrounded = true;
      this.clearKeys();
    }
  }

  /**
   * Direct teleport with orientation (used by airlock cycle)
   */
  teleport(x, y, z, targetYaw) {
    this.camera.position.set(x, y, z);
    if (typeof targetYaw === 'number') {
      this.yaw = targetYaw;
      this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    }
    this.velocity.set(0, 0, 0);
    this.velocityY = 0;
  }

  /**
   * Spatial collision test for a single (X, Z) coordinate point.
   * Completely open doorways, tunnels, and rooms using a union of walkable zones.
   */
  isValidPosition(x, z) {
    // When driving rover, restricted to outdoors (cannot drive through habitat airlock)
    if (this.isDrivingRover) {
      if (x < 13.5) return false;
      const distFromCenter = Math.hypot(x, z);
      return distFromCenter <= 125;
    }

    // 1. Outside through airlock onto Martian surface
    if (x >= 13.5 && Math.hypot(x, z) <= 125) {
      // Prevent walking through the solid rear exterior walls of the habitat
      if (x < 14.0 && Math.abs(z) > 1.8) return false;
      return true;
    }

    // 2. Central Hub Interior (Full 6.5m radius, minus central console)
    const distHub = Math.hypot(x, z);
    if (distHub <= 6.5) {
      if (distHub < 0.75) return false; // Central console pedestal
      return true;
    }

    // 3. North Corridor & Greenhouse (Z: 5.0 to 19.5, X: -5.5 to 5.5)
    if (Math.abs(x) <= 1.6 && z >= 5.0 && z <= 11.5) return true; // North corridor
    if (Math.hypot(x, z - 14) <= 5.3) return true; // Greenhouse Dome

    // 4. West Corridor & Life Support (X: -5.0 to -19.5, Z: -5.5 to 5.5)
    if (Math.abs(z) <= 1.6 && x <= -5.0 && x >= -11.5) return true; // West corridor
    if (Math.hypot(x + 14, z) <= 5.0) return true; // Life Support Dome

    // 5. South Corridor & Water Bay (Z: -5.0 to -19.5, X: -5.5 to 5.5)
    if (Math.abs(x) <= 1.6 && z <= -5.0 && z >= -11.5) return true; // South corridor
    if (Math.hypot(x, z + 14) <= 5.0) return true; // Water Recycler Dome

    // 6. East Corridor & Airlock Chamber (X: 5.0 to 14.5, Z: -1.6 to 1.6)
    if (Math.abs(z) <= 1.6 && x >= 5.0 && x <= 14.5) return true;

    return false;
  }

  update(delta) {
    if (!this.isLocked) return;

    const dt = Math.min(delta, 0.05);

    // Zone Check: Inside Habitat vs Outside on Martian Surface
    const currentPos = this.camera.position;
    this.isOutdoors = currentPos.x > 13.5;

    // Dynamic Gravity Switching:
    // Inside: 9.8 m/s² (1.0g simulated)
    // Outside: 3.72 m/s² (0.38g true Mars low-g)
    this.gravity = this.isOutdoors ? 3.72 : 9.8;

    // Sprinting / Turbo check
    this.isSprinting = this.pressedKeys.has('ShiftLeft') || this.pressedKeys.has('ShiftRight');

    let targetSpeed = this.walkSpeed;
    if (this.isDrivingRover) {
      targetSpeed = this.isSprinting ? this.roverTurbo : this.roverSpeed;
    } else {
      targetSpeed = this.isSprinting ? this.sprintSpeed : this.walkSpeed;
    }

    // Compute input directions from key Set
    let moveForward = 0;
    let moveRight = 0;

    if (this.pressedKeys.has('KeyW') || this.pressedKeys.has('ArrowUp')) moveForward += 1;
    if (this.pressedKeys.has('KeyS') || this.pressedKeys.has('ArrowDown')) moveForward -= 1;
    if (this.pressedKeys.has('KeyD') || this.pressedKeys.has('ArrowRight')) moveRight += 1;
    if (this.pressedKeys.has('KeyA') || this.pressedKeys.has('ArrowLeft')) moveRight -= 1;

    const inputDir = new THREE.Vector2(moveRight, moveForward);
    if (inputDir.lengthSq() > 0) {
      inputDir.normalize();
    }

    // Damping friction (floatier momentum in air during Mars low-g jump)
    let currentDamping = this.isDrivingRover ? 5.5 : this.damping;
    if (!this.isGrounded && this.isOutdoors) {
      currentDamping = 3.2; // Low atmospheric drag momentum during low-g jump
    }
    this.velocity.x -= this.velocity.x * currentDamping * dt;
    this.velocity.z -= this.velocity.z * currentDamping * dt;

    // Apply acceleration
    if (inputDir.lengthSq() > 0) {
      this.velocity.x += inputDir.x * targetSpeed * currentDamping * dt;
      this.velocity.z += inputDir.y * targetSpeed * currentDamping * dt;
    }

    // Convert local movement into world vectors
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

    const stepX = (right.x * this.velocity.x + forward.x * this.velocity.z) * dt;
    const stepZ = (right.z * this.velocity.x + forward.z * this.velocity.z) * dt;

    // Smooth Wall-Sliding Collision: Test X and Z independently!
    const candidateX = currentPos.x + stepX;
    const candidateZ = currentPos.z + stepZ;

    // Test sliding along X
    if (this.isValidPosition(candidateX, currentPos.z)) {
      currentPos.x = candidateX;
    } else {
      this.velocity.x = 0;
    }

    // Test sliding along Z
    if (this.isValidPosition(currentPos.x, candidateZ)) {
      currentPos.z = candidateZ;
    } else {
      this.velocity.z = 0;
    }

    // Footstep audio timing (when moving on foot)
    const isMoving = inputDir.lengthSq() > 0 && Math.hypot(this.velocity.x, this.velocity.z) > 1.0;
    if (!this.isDrivingRover && isMoving && this.isGrounded) {
      const now = performance.now();
      const stepInterval = this.isSprinting ? 280 : 420;
      if (now - this.lastFootstepTime > stepInterval) {
        soundService.playFootstep(this.isOutdoors);
        this.lastFootstepTime = now;
      }
    }

    // Vertical Physics (Gravity & Mars Low-G float)
    if (!this.isDrivingRover) {
      this.velocityY -= this.gravity * dt;
      currentPos.y += this.velocityY * dt;
    }

    // Compute ground elevation
    let groundH = 0;
    if (currentPos.x > 13.5) {
      groundH = getMartianTerrainHeight(currentPos.x, currentPos.z);
    }

    const minFloorY = this.baseEyeHeight + groundH;
    if (this.isDrivingRover) {
      // Smoothly stick rover to terrain surface
      currentPos.y = minFloorY;
      this.isGrounded = true;
    } else if (currentPos.y <= minFloorY) {
      currentPos.y = minFloorY;
      this.velocityY = 0;
      this.isGrounded = true;
    }
  }
}
