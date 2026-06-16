// Generates images/icon.png (128x128) for the Marketplace listing: a white
// graduation cap (the "hat") on an indigo background, with a gold tassel.
//
// Pure Node, no dependencies — rasterizes simple shapes into an RGBA buffer
// and encodes a PNG using zlib. Run with: node scripts/generate-icon.js

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const SIZE = 128;
const BG = [76, 58, 135]; // indigo
const CAP = [255, 255, 255]; // white
const HEAD = [222, 222, 230]; // light grey
const GOLD = [255, 200, 87];

const buf = Buffer.alloc(SIZE * SIZE * 4);

function set(x, y, [r, g, b]) {
	if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) {
		return;
	}
	const i = (y * SIZE + x) * 4;
	buf[i] = r;
	buf[i + 1] = g;
	buf[i + 2] = b;
	buf[i + 3] = 255;
}

function inPolygon(x, y, pts) {
	let inside = false;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
		const [xi, yi] = pts[i];
		const [xj, yj] = pts[j];
		const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (hit) {
			inside = !inside;
		}
	}
	return inside;
}

function disc(cx, cy, radius, color) {
	for (let y = cy - radius; y <= cy + radius; y++) {
		for (let x = cx - radius; x <= cx + radius; x++) {
			if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) {
				set(x, y, color);
			}
		}
	}
}

// Background.
for (let y = 0; y < SIZE; y++) {
	for (let x = 0; x < SIZE; x++) {
		set(x, y, BG);
	}
}

const head = [
	[44, 58],
	[84, 58],
	[78, 88],
	[50, 88],
];
const board = [
	[64, 34],
	[110, 54],
	[64, 74],
	[18, 54],
];
for (let y = 0; y < SIZE; y++) {
	for (let x = 0; x < SIZE; x++) {
		if (inPolygon(x, y, head)) {
			set(x, y, HEAD);
		}
		if (inPolygon(x, y, board)) {
			set(x, y, CAP);
		}
	}
}

// Centre knob and tassel hanging from the right corner of the board.
disc(64, 54, 4, GOLD);
for (let y = 54; y <= 86; y++) {
	for (let x = 102; x <= 105; x++) {
		set(x, y, GOLD);
	}
}
disc(103, 90, 5, GOLD);

writePng(path.join(__dirname, '..', 'images', 'icon.png'), buf, SIZE, SIZE);
console.log('Wrote images/icon.png');

function writePng(file, rgba, width, height) {
	const raw = Buffer.alloc(height * (1 + width * 4));
	for (let y = 0; y < height; y++) {
		raw[y * (1 + width * 4)] = 0; // no filter
		rgba.copy(
			raw,
			y * (1 + width * 4) + 1,
			y * width * 4,
			(y + 1) * width * 4,
		);
	}
	const idat = zlib.deflateSync(raw);
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 6; // RGBA
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(
		file,
		Buffer.concat([
			Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
			chunk('IHDR', ihdr),
			chunk('IDAT', idat),
			chunk('IEND', Buffer.alloc(0)),
		]),
	);
}

function chunk(type, data) {
	const typeBuf = Buffer.from(type, 'ascii');
	const body = Buffer.concat([typeBuf, data]);
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length, 0);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(body) >>> 0, 0);
	return Buffer.concat([len, body, crc]);
}

function crc32(buffer) {
	let crc = ~0;
	for (let i = 0; i < buffer.length; i++) {
		crc ^= buffer[i];
		for (let k = 0; k < 8; k++) {
			crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
		}
	}
	return ~crc;
}
