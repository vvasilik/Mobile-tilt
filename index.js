const images = document.querySelectorAll('.js-image');

var defaultTiltOpts = {
	debounceTime: 18,
	maxAngle: 25,
	ignoreAngle: 5
};

images.forEach(item => {
	var sprite = {width: parseInt(item.dataset.width), height: parseInt(item.dataset.height)};
	var mediaAsset = $(item);
	var imageHeight = Math.round(item.getClientRects()[0].height);
	var imageWidth = mediaAsset.width();
	var sizeKoef = imageWidth / sprite.width;
	var ratioImage = imageWidth / imageHeight;
	var adaptedSpriteHeight = sprite.height * sizeKoef;
	var sensativeAnle = 2 * (defaultTiltOpts.maxAngle - defaultTiltOpts.ignoreAngle);
	var frameHeight = imageHeight * sizeKoef;
	var numFrames = Math.floor(sprite.height / frameHeight);
	var framesInOneAngle = numFrames / sensativeAnle;

	init();

	$(window).on('deviceorientation', throttledTilt.bind(this));

	function init() {
		tilt();
	}

	function throttledTilt(e) {
		return _.debounce(tilt.call(this, e), defaultTiltOpts.debounceTime);
	}

	function tilt(e) {
		if (!e) {
			setOffset(getFloorOffset({
				offset: adaptedSpriteHeight / 2
			}));

			return;
		}

		var gamma = e.originalEvent.gamma;
		var tilt = gamma - this.initialAngle;
		var absoluteTilt = Math.abs(tilt);


		if (_.isUndefined(this.initialAngle)) {
			this.initialAngle = gamma;

			setOffset(getFloorOffset({
				offset: adaptedSpriteHeight / 2
			}));

			return;
		}
		
		if (!isTiltInSensativeAre(absoluteTilt, this.initialAngle)) {
			setOffset(getFloorOffset({
				offset: adaptedSpriteHeight / 2
			}));

			return;
		}

		if (tilt < 0 && tilt < -defaultTiltOpts.maxAngle) {
			setOffset(getFloorOffset({
				offset: 0
			}));

			return;
		}

		if (tilt > 0 && tilt > defaultTiltOpts.maxAngle) {
			setOffset(getFloorOffset({
				offset: adaptedSpriteHeight
			}));

			return;
		}

		var offsetDirty = (Math.abs(tilt) - defaultTiltOpts.ignoreAngle) * framesInOneAngle * frameHeight;
		var offset = tilt < 0
			? adaptedSpriteHeight / 2 - offsetDirty
			: adaptedSpriteHeight / 2 + offsetDirty
		setOffset(getFloorOffset({
			offset: offset
		}));

		function setOffset(value) {
			$(item).css({'background-position': '0 ' + (-1 * value)  + 'px'});
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

		function isTiltInSensativeAre(absoluteTilt, initialAngle) {
			return (-defaultTiltOpts.ignoreAngle > absoluteTilt) || (defaultTiltOpts.ignoreAngle < absoluteTilt)
		}
	}
})