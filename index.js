
		class JoystickController {
			constructor(stickID, maxDistance, deadzone) {
				this.id = stickID;
				let stick = document.getElementById(stickID);
				this.dragStart = null;
				this.touchId = null;
				this.active = false;
				this.value = { x: 0, y: 0 };
				let self = this;

				function handleDown(event) {
					self.active = true;

					stick.style.transition = '0s';

					// touch event fired before mouse event; prevent redundant mouse event from firing
					event.preventDefault();

					if (event.changedTouches)
						self.dragStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
					else
						self.dragStart = { x: event.clientX, y: event.clientY };

					// if this is a touch event, keep track of which one
					if (event.changedTouches)
						self.touchId = event.changedTouches[0].identifier;
				}

				function handleMove(event) {
					if (!self.active) return;

					// if this is a touch event, make sure it is the right one
					// also handle multiple simultaneous touchmove events
					let touchmoveId = null;
					if (event.changedTouches) {
						for (let i = 0; i < event.changedTouches.length; i++) {
							if (self.touchId == event.changedTouches[i].identifier) {
								touchmoveId = i;
								event.clientX = event.changedTouches[i].clientX;
								event.clientY = event.changedTouches[i].clientY;
							}
						}

						if (touchmoveId == null) return;
					}

					const xDiff = event.clientX - self.dragStart.x;
					const yDiff = event.clientY - self.dragStart.y;
					const angle = Math.atan2(yDiff, xDiff);
					const distance = Math.min(maxDistance, Math.hypot(xDiff, yDiff));
					const xPosition = distance * Math.cos(angle);
					const yPosition = distance * Math.sin(angle);

					// move stick image to new position
					stick.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;

					// deadzone adjustment
					const distance2 = (distance < deadzone) ? 0 : maxDistance / (maxDistance - deadzone) * (distance - deadzone);
					const xPosition2 = distance2 * Math.cos(angle);
					const yPosition2 = distance2 * Math.sin(angle);
					const xPercent = parseFloat((xPosition2 / maxDistance).toFixed(4));
					const yPercent = parseFloat((yPosition2 / maxDistance).toFixed(4));

					self.value = { x: xPercent, y: yPercent };
				}
				function reset() {
					if (event.changedTouches && self.touchId != event.changedTouches[0].identifier) return;

					// transition the joystick position back to center
					stick.style.transition = '.2s';

					// reset everything
					self.touchId = null;
					self.active = null;

				}
				stick.addEventListener('mousedown', handleDown,);
				stick.addEventListener('touchstart', handleDown);
				document.addEventListener('mousemove', handleMove, { passive: false });
				document.addEventListener('touchmove', handleMove, { passive: false });
				stick.addEventListener('click', reset)
			}
		}
		let joystick1 = new JoystickController("contenti", 49, 7);
		var openmenu = document.getElementById("menuopen")
		openmenu.addEventListener('click',function(){
			document.getElementById("mc").style.display = "block";
		})
		var closemenu = document.getElementById("close")
		closemenu.addEventListener('click',function(){
			document.getElementById("mc").style.display = "none";
		})
		