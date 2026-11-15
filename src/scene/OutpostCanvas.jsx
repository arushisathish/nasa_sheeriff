import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { createMarsEnvironment } from './MarsEnvironment';
import { buildHabitat } from './HabitatBuilder';
import { createStationBeacons, checkNearbyStation, updateRoverStationPosition } from './StationManager';
import { createRoverModel } from './RoverModel';
import { FirstPersonControls } from './FirstPersonControls';
import { AtmosphericEffects } from './AtmosphericEffects';
import { soundService } from '../services/soundService';

const OutpostCanvas = forwardRef(function OutpostCanvas({
  gameState,
  onStationInteract,
  onNearbyStationChange,
  onOutdoorsChange,
  onSprintingChange,
  onDrivingChange,
  onPlayerPoseChange,
  onTogglePause,
  onToggleScanner,
  onToggleDebugColliders,
  showDebugColliders = false,
  mouseSensitivity = 1.0,
  graphicsQuality = 'high',
  isPaused = false,
}, ref) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const roverRef = useRef(null);
  const habitatRef = useRef(null);
  const debugColliderGroupRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);

  // Stable callback ref to eliminate stale state closures
  const onStationInteractRef = useRef(onStationInteract);
  useEffect(() => {
    onStationInteractRef.current = onStationInteract;
  }, [onStationInteract]);

  // Sync debug collider wireframe visibility
  useEffect(() => {
    if (debugColliderGroupRef.current) {
      debugColliderGroupRef.current.visible = showDebugColliders;
    }
  }, [showDebugColliders]);

  // Expose imperative controller methods to parent
  useImperativeHandle(ref, () => ({
    teleport: (x, y, z, yaw) => {
      if (controlsRef.current) {
        controlsRef.current.teleport(x, y, z, yaw);
      }
    },
    setDrivingRover: (driving) => {
      if (controlsRef.current) {
        const roverPos = roverRef.current?.group?.position;
        controlsRef.current.setDrivingRover(driving, roverPos);
        if (!driving && roverRef.current) {
          updateRoverStationPosition(roverRef.current.group.position);
        }
      }
    },
    getCameraPosition: () => {
      return controlsRef.current?.camera?.position;
    },
  }));

  // Sync mouse sensitivity
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setSensitivity(mouseSensitivity);
    }
  }, [mouseSensitivity]);

  // Handle Pause state changes (unlock cursor and clear stuck keys)
  useEffect(() => {
    if (controlsRef.current) {
      if (isPaused) {
        controlsRef.current.clearKeys();
        controlsRef.current.unlock();
      }
    }
  }, [isPaused]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      72, // Comfortable Astroneer FOV
      container.clientWidth / container.clientHeight,
      0.1,
      350
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: graphicsQuality === 'high', 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, graphicsQuality === 'high' ? 2 : 1.25));
    renderer.shadowMap.enabled = graphicsQuality === 'high';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Build 3D World
    createMarsEnvironment(scene);
    const habitat = buildHabitat(scene);
    habitatRef.current = habitat;

    createStationBeacons(scene);
    const atmosphericEffects = new AtmosphericEffects(scene);

    // Add 3D Mars Exploration Rover
    const rover = createRoverModel(new THREE.Vector3(18, 0, 4));
    scene.add(rover.group);
    roverRef.current = rover;

    // Build Debug Collider Wireframes Group (Toggled with [B])
    const colliderDebugGroup = new THREE.Group();
    colliderDebugGroup.name = 'collider_debug_wireframes';
    const redWireMat = new THREE.LineBasicMaterial({ color: '#ef4444' });

    const addWireBox = (w, h, d, x, y, z) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, redWireMat);
      line.position.set(x, y, z);
      colliderDebugGroup.add(line);
    };

    const addWireCyl = (r, h, x, y, z) => {
      const geo = new THREE.CylinderGeometry(r, r, h, 20);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, redWireMat);
      line.position.set(x, y, z);
      colliderDebugGroup.add(line);
    };

    // Central Console Pedestal
    addWireBox(1.5, 1.2, 1.5, 0, 0.6, 0);

    // North Corridor Solid Walls (Left & Right)
    addWireBox(0.4, 2.8, 6.0, -1.5, 1.4, 8.5);
    addWireBox(0.4, 2.8, 6.0, 1.5, 1.4, 8.5);

    // West Corridor Solid Walls (North & South)
    addWireBox(6.0, 2.8, 0.4, -8.5, 1.4, 1.5);
    addWireBox(6.0, 2.8, 0.4, -8.5, 1.4, -1.5);

    // South Corridor Solid Walls
    addWireBox(0.4, 2.8, 6.0, -1.5, 1.4, -8.5);
    addWireBox(0.4, 2.8, 6.0, 1.5, 1.4, -8.5);

    // East Airlock Solid Walls
    addWireBox(4.8, 3.2, 0.4, 11.0, 1.6, 1.7);
    addWireBox(4.8, 3.2, 0.4, 11.0, 1.6, -1.7);

    // Domes Outer Cylinders
    addWireCyl(7.0, 3.6, 0, 1.8, 0);       // Central Hub
    addWireCyl(5.5, 3.2, 0, 1.6, 14);     // Greenhouse Dome
    addWireCyl(5.2, 3.0, -14, 1.5, 0);     // Life Support Dome
    addWireCyl(5.2, 3.0, 0, 1.5, -14);     // Water Recycler Dome

    colliderDebugGroup.visible = showDebugColliders;
    scene.add(colliderDebugGroup);
    debugColliderGroupRef.current = colliderDebugGroup;

    // Dedicated raycaster for crosshair look-detection (rover & interactive objects)
    const raycaster = new THREE.Raycaster();
    const centerPoint = new THREE.Vector2(0, 0);
    const lastDrivingState = { current: false };

    // Proximity + Look-Raycast detection for Rover entry
    const checkRoverProximityOrLook = () => {
      if (!roverRef.current?.group) return false;
      const isOutdoors = camera.position.x > 13.5;
      if (!isOutdoors) return false;

      const roverPos = roverRef.current.group.position;
      const dx = camera.position.x - roverPos.x;
      const dz = camera.position.z - roverPos.z;
      const distToRover = Math.hypot(dx, dz);

      // 1. Generous 5.0m proximity check
      if (distToRover <= 5.0) {
        return { isHit: true, distance: distToRover, roverPos };
      }

      // 2. Look-raycast check from camera reticle
      raycaster.setFromCamera(centerPoint, camera);
      const intersects = raycaster.intersectObject(roverRef.current.group, true);
      if (intersects.length > 0 && intersects[0].distance <= 7.0) {
        return { isHit: true, distance: intersects[0].distance, roverPos };
      }

      return false;
    };

    // 3. First Person Controls
    const handleInteractKey = (specificId) => {
      // If already driving rover or requested rover dismount: UNCONDITIONAL DISMOUNT
      if (specificId === 'mars_rover' || controlsRef.current?.isDrivingRover) {
        if (onStationInteractRef.current) {
          onStationInteractRef.current('mars_rover');
        }
        return;
      }

      // If looking at or within generous proximity of the rover outdoors
      const roverCheck = checkRoverProximityOrLook();
      if (roverCheck && !controlsRef.current?.isDrivingRover) {
        if (onStationInteractRef.current) {
          onStationInteractRef.current('mars_rover');
        }
        return;
      }

      const nearby = checkNearbyStation(camera.position);
      if (nearby && onStationInteractRef.current) {
        onStationInteractRef.current(nearby.id);
      }
    };

    const controls = new FirstPersonControls(camera, renderer.domElement, {
      onInteract: handleInteractKey,
      onTogglePause: onTogglePause,
      onToggleScanner: onToggleScanner,
      onToggleDebugColliders: onToggleDebugColliders,
    });
    controls.setSensitivity(mouseSensitivity);
    controlsRef.current = controls;

    // Track Pointer Lock changes
    const onLockChange = () => {
      const locked = document.pointerLockElement === renderer.domElement;
      setIsLocked(locked);
    };
    document.addEventListener('pointerlockchange', onLockChange);

    // 4. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      if (!isPaused) {
        controls.update(delta);

        // Update Door Sliding Animations
        if (habitatRef.current?.updateDoors) {
          habitatRef.current.updateDoors(camera.position, delta);
        }

        // Update Rover if being driven
        if (controls.isDrivingRover && roverRef.current) {
          roverRef.current.setPosition(camera.position, controls.yaw);
          updateRoverStationPosition(camera.position);

          const horizontalSpeed = Math.hypot(controls.velocity.x, controls.velocity.z);
          roverRef.current.rotateWheels(horizontalSpeed * delta * 0.6);
        }

        // Check station and rover proximity / look-raycast
        let nearby = null;
        if (!controls.isDrivingRover) {
          const roverCheck = checkRoverProximityOrLook();
          if (roverCheck) {
            nearby = {
              id: 'mars_rover',
              name: 'Mars Exploration Rover',
              actionLabel: 'Enter Rover [E] / Cockpit Steering',
              distance: roverCheck.distance,
              position: roverCheck.roverPos.clone(),
              color: '#f97316',
            };
          } else {
            nearby = checkNearbyStation(camera.position);
          }
        }

        if (onNearbyStationChange) {
          onNearbyStationChange(nearby);
        }

        // Check if player stepped through airlock outdoors
        const isOutdoors = camera.position.x > 13.5;
        if (onOutdoorsChange) {
          onOutdoorsChange(isOutdoors);
        }

        // Dynamic atmospheric audio (exterior howling wind vs interior ECLSS hum)
        soundService.updateAmbient(isOutdoors, gameState?.environment?.atmosphericDustTau);

        // Check if player is sprinting
        if (onSprintingChange) {
          onSprintingChange(controls.isSprinting);
        }

        // Check if player is driving rover (notify only on state change)
        if (lastDrivingState.current !== controls.isDrivingRover) {
          lastDrivingState.current = controls.isDrivingRover;
          if (onDrivingChange) {
            onDrivingChange(controls.isDrivingRover);
          }
        }

        // Report player position & camera yaw for Compass HUD
        if (onPlayerPoseChange) {
          onPlayerPoseChange(camera.position, controls.yaw);
        }

        // Reactive atmospheric effects
        atmosphericEffects.update(
          delta,
          elapsedTime,
          gameState?.environment,
          gameState?.moduleHealth
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('pointerlockchange', onLockChange);
      cancelAnimationFrame(animationFrameId);

      soundService.stopAmbientLoop();
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [graphicsQuality]);

  const handleClickToLock = () => {
    if (controlsRef.current && !isPaused) {
      controlsRef.current.lock();
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden select-none cursor-crosshair"
      onClick={handleClickToLock}
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
});

export default OutpostCanvas;
