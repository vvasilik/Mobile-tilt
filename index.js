const DEBOUNCE_TIME = 18;
const MAX_ANGLE = 25;

const image = document.querySelector('.js-image');

var sprite = {width: parseInt(image.dataset.width), height: parseInt(image.dataset.height)};
var mediaAsset = $(image);
var imageHeight = Math.round(image.getClientRects()[0].height);
var imageWidth = mediaAsset.width();
var sizeKoef = imageWidth / sprite.width;
var adaptedSpriteHeight = sprite.height * sizeKoef;
var sensativeAngle = 2 * MAX_ANGLE;
var frameHeight = imageHeight * sizeKoef;
var numFrames = Math.floor(sprite.height / frameHeight);
var framesInOneAngle = numFrames / sensativeAngle;

tilt();

window.addEventListener('deviceorientation', throttledTilt.bind(this));

function throttledTilt(e) {
	return debounce(tilt.call(this, e), DEBOUNCE_TIME);
}

function setOffset(value) {
	$(image).css({'background-position': '0 ' + (-1 * value)  + 'px'});
}

function getFloorOffset(opts) {
	var offset = opts.offset - (opts.offset % imageHeight);

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

	var gamma = e.gamma;
	var tilt = gamma - this.initialAngle;

	if (!this.initialAngle) {
		this.initialAngle = gamma;

		setOffset(getFloorOffset({
			offset: adaptedSpriteHeight / 2
		}));

		return;
	}

	if (tilt < 0 && tilt < -MAX_ANGLE) {
		setOffset(getFloorOffset({
			offset: 0
		}));

		return;
	}

	if (tilt > 0 && tilt > MAX_ANGLE) {
		setOffset(getFloorOffset({
			offset: adaptedSpriteHeight
		}));

		return;
	}

	var offsetDirty = Math.abs(tilt) * framesInOneAngle * frameHeight;
	var offset = tilt < 0
		? adaptedSpriteHeight / 2 - offsetDirty
		: adaptedSpriteHeight / 2 + offsetDirty
	setOffset(getFloorOffset({
		offset: offset
	}));
}

function debounce(func, wait, immediate) {
	let timeout;

	return function() {
		const context = this, args = arguments;
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