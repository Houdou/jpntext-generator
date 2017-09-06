function init() {
	let config = {
		sizeBit: 6,
		size: 4,
		blur: 1,
		offset: 1,
		rotation: 4
	};

	let size = {
		width: 2**config.sizeBit,
		height: 2**config.sizeBit
	};

	let canvas = document.getElementById("canvas");
	canvas.width = size.width;
	canvas.height = size.height;
	let stage = new createjs.Stage(canvas);
	stage.clear();

	document.body.style.backgroundColor = "#888";

	let bg = new createjs.Shape();
	bg.graphics.f('white').dr(0, 0, size.width, size.height);

	stage.addChild(bg);
	stage.update();

	let str = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐうゑをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰウヱヲンがぎぐげござじずぜぞだぢづでどばびぶべぼヴガギグゲゴザジズゼゾダヂヅデドバビブベボぱぴぷぺぽぴゃぴゅぴょパピプペポピャピュピョぁぃぅぇぉっゃゅょゎァィゥェォヵㇰヶㇱㇲッㇳㇴㇵㇶㇷㇸㇹㇺャュョㇻㇼㇽㇾㇿヮゝゞヽヾ゛゜。、ー－―～１２３４５６７８９０ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let repeat = 10;

	let _list = str.split('');
	let list = [];
	_list.forEach((u) => {
		for(let i = 0; i < repeat; i++) {
			list.push(u);
		}
	});

	console.log(list);

	class TaskQueue extends EventEmitter {
		constructor() {
			super();
			this.queue = [];
			this.nextId = -1;
		}

		add(task) {
			this.queue.push(task);
		}

		step(taskId) {
			if(taskId >= this.queue.length) throw new Error("Task index out of range.");
			this.queue[taskId].execute(this);
		}

		run(config) {
			this.on('step', () => {
				if(this.nextId < this.queue.length) {
					if(config.loop)
						this.nextId = (this.nextId + 1) % this.queue.length;
					else {
						this.nextId++;
						if(this.nextId >= this.queue.length) {
							this.emit('done');
							return;
						}
					}
					this.step(this.nextId);
				} else {
					this.emit('done');
					return;
				}
			});
			this.on('stop', () => {
				this.nextId = 0;
				this.emit('done');
			});
			this.emit('step');
		}
	};

	class Task {
		constructor(f) {
			this.f = f;
		}

		execute(queue) {
			this.f(() => {
				queue.emit('step');
			}, () => {
				queue.emit('stop');
			});
		};
	}
	function JPNText(list) {
		let currentIndex = 0;

		const TaskList = new TaskQueue();

		let flowControl = () => {
			TaskList.add(new Task((next, end) => {
				currentIndex++;
				if(currentIndex < list.length)
					console.log(`Go to ${list[currentIndex]}.`);
				next();
			}));

			TaskList.add(new Task((next, end) => {
				if(currentIndex < list.length) {
					main();
					next();	
				} else {
					console.log("End of character list reached.");
					end();
				}
			}));
		}

		let main = () => {
			TaskList.add(new Task((next, end) => {
				stage.removeAllChildren();
				stage.clear();
				let bg = new createjs.Shape();
				bg.graphics.f('white').dr(0, 0, size.width, size.height);
				stage.addChild(bg);

				let a = new createjs.Text(list[currentIndex], (size.width + -Math.random() * config.size) + "px Helvetica", "black");
				a.x = a.regX = size.width / 2;
				a.y = a.regY = size.height / 2;

				a.x += Math.random() * config.offset;
				a.y += Math.random() * config.offset;

				a.rotation = Math.random() * 2 * config.rotation - config.rotation;

				a.filters = [
					new createjs.BlurFilter(Math.max(0, Math.random() * Math.random() * config.blur - 0.2))
				];
				a.cache(0, 0, size.width, size.height);
				stage.addChild(a);
				stage.update();

				let dt = canvas.toDataURL('image/png');
				document.getElementById('data').innerHTML = dt;

				dt = dt.replace(/\+/g, '%2B');

				let xhr = new XMLHttpRequest();
				xhr.onreadystatechange = () => {
					if(xhr.readyState == 4 && xhr.status == 200) {
						console.log(xhr.responseText);
						flowControl();

						let waitTime = 100;
						console.log(`Wait for random ${parseInt(waitTime / 10, 10) / 100} seconds for next page.`);
						setTimeout(() => {next(); }, waitTime);
				    }
				};

				xhr.open('POST', 'http://localhost:3002/', true);
				// xhr.setRequestHeader("Content-Encoding", "base64");
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send(`chara=${list[currentIndex]}&index=${currentIndex%10}&img=${dt}`);
			}));
		}

		main();

		TaskList.on('done', () => {
			
		});

		TaskList.run({ loop: true });
	}

	JPNText(list);
}