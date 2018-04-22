((win, $) => {
	function clone(src, out) {
		for (let attr in src.prototype)
			out.prototype[attr] = src.prototype[attr];
	}

	function Circle() {
		this.item = $('<div class="circle"></div>');
	}

	Circle.prototype.tint = function (clr) {
		this.item.css('background', clr);
	};

	Circle.prototype.move = function (left, top) {
		this.item.css('left', left);
		this.item.css('top', top);
	};

	Circle.prototype.get = function () {
		return this.item;
	};

	function Rect() {
		this.item = $('<div class="rect"></div>');
	}
	clone(Circle, Rect);

	function RedCircleBuilder() {
		this.item = new Circle();
		this.init();
	}

	RedCircleBuilder.prototype.init = function () {
		//NOTHING
	};

	RedCircleBuilder.prototype.get = function () {
		return this.item;
	};

	function BlueCircleBuilder() {
		this.item = new Circle();
		this.init();
	}

	BlueCircleBuilder.prototype.init = function () {
		this.item.tint('blue');
		let rect = new Rect();
		rect.tint('yellow');
		rect.move(40, 40);

		this.item.get().append(rect.get());
	};

	BlueCircleBuilder.prototype.get = function () {
		return this.item;
	};

	function CircleFactory() {
		this.types = {};
		this.create = (type) => {
			return new this.types[type]().get();
		};
		this.register = function (type, cls) {
			if (cls.prototype.init && cls.prototype.get) {
				this.types[type] = cls;
			}
		};
	};

	const CircleGeneratorSingleton = (() => {
		let instance;

		const init = () => {
			let _aCircle = [],
				_stage = $('.advert'),
				_cf = new CircleFactory();
			_cf.register('red', RedCircleBuilder);
			_cf.register('blue', BlueCircleBuilder);

			const _position = (circle, left, top) => {
				circle.css('left', left);
				circle.css('top', top);
			};

			const create = (left, top, type) => {
				var circle = _cf.create(type).get();
				_position(circle, left, top);
				return circle;
			};

			const add = (circle) => {
				_stage.append(circle.get());
				_aCircle.push(circle);
			};

			const index = () => {
				return _aCircle.length;
			};

			return { index, create, add };
		};

		return {
			getInstance() {
				if (!instance) {
					instance = init();
				}

				return instance;
			}
		}
	})();

	$(win.document).ready(function () {
		$('.advert').click(function (e) {
			let cg = CircleGeneratorSingleton.getInstance();
			let circle = cg.create(e.pageX - 25, e.pageY - 25, 'red');
			cg.add(circle);
		});

		$(document).keypress(function (e) {
			if (e.key === 'a') {
				var cg = CircleGeneratorSingleton.getInstance();
				var circle = cg.create(Math.floor(Math.random() * 600), Math.floor(Math.random() * 600), "blue");

				cg.add(circle);
			}
		});
	});

})(window, $);