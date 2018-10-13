/*
 * Copyright (c) 2018 Princess Rosella. All rights reserved.
 *
 * @LICENSE_HEADER_START@
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @LICENSE_HEADER_END@
 */

export interface Point {
    x: number;
    y: number;
}

const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;
const EPSILON = Number.EPSILON;

export function mat3_determinant(m: Float32Array): number {
    const a = m[0];
    const b = m[1];
    const c = m[2];
    const d = m[3];
    const e = m[4];
    const f = m[5];
    const g = m[6];
    const h = m[7];
    const i = m[8];
    return (a * e * i) - (a * f * h) - (b * d * i) + (b * f * g) + (c * d * h) - (c * e * g);
}

export function mat3_isIdentity(m: Float32Array): boolean {
    return m[0] === 1 && m[1] === 0 && m[2] === 0 &&
           m[3] === 0 && m[4] === 1 && m[5] === 0 &&
           m[6] === 0 && m[7] === 0 && m[8] === 1;
}

export function mat3_setIdentity(m: Float32Array): void {
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;

    m[3] = 0;
    m[4] = 1;
    m[5] = 0;

    m[6] = 0;
    m[7] = 0;
    m[8] = 1;
}

export function mat3_copy(a: Float32Array, b: Float32Array): void {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];

    a[3] = b[3];
    a[4] = b[4];
    a[5] = b[5];

    a[6] = b[6];
    a[7] = b[7];
    a[8] = b[8];
}

export function mat3_setTranslation(m: Float32Array, tx: number, ty: number): void {
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;

    m[3] = 0;
    m[4] = 1;
    m[5] = 0;

    m[6] = tx;
    m[7] = ty;
    m[8] = 1;
}

export function mat3_setScale(m: Float32Array, sx: number, sy: number): void {
    m[0] = sx;
    m[1] = 0;
    m[2] = 0;

    m[3] = 0;
    m[4] = sy;
    m[5] = 0;

    m[6] = 0;
    m[7] = 0;
    m[8] = 1;
}

export function mat3_setRotationAngle(m: Float32Array, angle: number): void {
    const c = cos(angle);
    const s = sin(angle);

    m[0] = c;
    m[1] = -s;
    m[2] = 0;

    m[3] = s;
    m[4] = c;
    m[5] = 0;

    m[6] = 0;
    m[7] = 0;
    m[8] = 1;
}

export function mat3_setSimpleOrtographic(m: Float32Array, width: number, height: number): void {
    m[0] = 2.0 / width; m[3] = 0.0;          m[6] = -1.0;
    m[1] = 0.0;         m[4] = 2.0 / height; m[7] = -1.0;
    m[2] = 0.0;         m[5] = 0.0;          m[8] = 1.0;
}

export function mat3_setOrtographic(m: Float32Array, left: number, right: number, top: number, bottom: number): void {
    const w = 1.0 / (right - left);
    const h = 1.0 / (bottom - top);

    const x = (right + left) * w;
    const y = (top + bottom) * h;

    m[0] = 2.0 * w; m[3] = 0.0;     m[6] = -x;
    m[1] = 0.0;     m[4] = 2.0 * h; m[7] = -y;
    m[2] = 0.0;     m[5] = 0.0;     m[8] = 1.0;
}

export function mat3_setScaleAtPoint(m: Float32Array, scale: number, x: number, y: number): void {
    const tx  = x * (1 - scale);
    const ty  = y * (1 - scale);

    m[0] = scale; m[3] = 0.0;   m[6] = tx;
    m[1] = 0.0;   m[4] = scale; m[7] = ty;
    m[2] = 0.0;   m[5] = 0.0;   m[8] = 1.0;
}

export function mat3_setInverse(m: Float32Array, o: Float32Array): void {
    const a = o[0];
    const b = o[1];
    const c = o[2];
    const d = o[3];
    const e = o[4];
    const f = o[5];
    const g = o[6];
    const h = o[7];
    const i = o[8];
    const det = (a * e * i) - (a * f * h) - (b * d * i) + (b * f * g) + (c * d * h) - (c * e * g);

    if (abs(det) < EPSILON)
        throw new Error("mat3_setInverse() can't produce inverted matrix. Determinant too small");

    const invDet = 1.0 / det;

    m[0] = ((e * i) - (f * h)) * invDet;
    m[1] = ((c * h) - (b * i)) * invDet;
    m[2] = ((b * f) - (c * e)) * invDet;

    m[3] = ((f * g) - (d * i)) * invDet;
    m[4] = ((a * i) - (c * g)) * invDet;
    m[5] = ((c * d) - (a * f)) * invDet;

    m[6] = ((d * h) - (e * g)) * invDet;
    m[7] = ((b * g) - (a * h)) * invDet;
    m[8] = ((a * e) - (b * d)) * invDet;
}

export function mat3_multiply(m: Float32Array, a: Float32Array, b: Float32Array): void {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];
    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];

    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b10 = b[3];
    const b11 = b[4];
    const b12 = b[5];
    const b20 = b[6];
    const b21 = b[7];
    const b22 = b[8];

    m[0] = b00 * a00 + b01 * a10 + b02 * a20;
    m[1] = b00 * a01 + b01 * a11 + b02 * a21;
    m[2] = b00 * a02 + b01 * a12 + b02 * a22;
    m[3] = b10 * a00 + b11 * a10 + b12 * a20;
    m[4] = b10 * a01 + b11 * a11 + b12 * a21;
    m[5] = b10 * a02 + b11 * a12 + b12 * a22;
    m[6] = b20 * a00 + b21 * a10 + b22 * a20;
    m[7] = b20 * a01 + b21 * a11 + b22 * a21;
    m[8] = b20 * a02 + b21 * a12 + b22 * a22;
}

export function mat3_applyToCoord(m: Float32Array, x: number, y: number, out: Point): void {
    out.x = (m[0] * x) + (m[3] * y) + m[6];
    out.y = (m[1] * x) + (m[4] * y) + m[7];
}
