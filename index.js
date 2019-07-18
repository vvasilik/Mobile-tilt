const DEBOUNCE_TIME = 18;
const MAX_ANGLE = 25;

const image = document.querySelector('.js-image');
const sprite = {width: parseInt(image.dataset.width), height: parseInt(image.dataset.height)};
const imageParams = image.getClientRects()[0];
const imageHeight = Math.round(imageParams.height);
const imageWidth = imageParams.width;
const sizeKoef = imageWidth / sprite.width;
const adaptedSpriteHeight = sprite.height * sizeKoef;
const sensativeAngle = 2 * MAX_ANGLE;
const frameHeight = imageHeight * sizeKoef;
const numFrames = Math.floor(sprite.height / frameHeight);
const framesInOneAngle = numFrames / sensativeAngle;

tilt();

window.addEventListener('deviceorientation', throttledTilt.bind(this));

function throttledTilt(e) {
	return debounce(tilt.call(this, e), DEBOUNCE_TIME);
}

function setOffset(value) {
	image.style.backgroundPosition = '0 ' + (-1 * value)  + 'px';
}

function getFloorOffset(opts) {
	let offset = opts.offset - (opts.offset % imageHeight);

	if (offset < 0) {
		offset = 0;
	} else if (offset > adaptedSpriteHeight- imageHeight) {
		offset = adaptedSpriteHeight - imageHeight
	}
	return offset;
}

function tilt(e) {
	if (!e) {
		setOffset(getFloorOffset({
			offset: adaptedSpriteHeight / 2
		}));

		return;
	}
		
	const gamma = e.gamma;
	const tilt = gamma - this.initialAngle;

	switch (true) {
		case !this.initialAngle:
			this.initialAngle = gamma;

			setOffset(getFloorOffset({
				offset: adaptedSpriteHeight / 2
			}));
	
			break;
		case tilt < 0 && tilt < -MAX_ANGLE:
			setOffset(getFloorOffset({
				offset: 0
			}));
	
			break;
		case tilt > 0 && tilt > MAX_ANGLE:
			setOffset(getFloorOffset({
				offset: adaptedSpriteHeight
			}));
	
			break;
		default:
			const offsetDirty = Math.abs(tilt) * framesInOneAngle * frameHeight;
			const offset = tilt < 0
				? adaptedSpriteHeight / 2 - offsetDirty
				: adaptedSpriteHeight / 2 + offsetDirty
			setOffset(getFloorOffset({
				offset: offset
			}));
	}	
}

function debounce(func, wait, immediate) {
	let timeout;

	return function() {
		const context = this;
		const args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};