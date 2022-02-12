/**
 * Simple Vector class, extending built-in Arrays
 * @extends Array
 */
 class Vector extends Array {
    /**
     * Create Vector.
     * @param {Array} array - Array to be unpacked and used to create Vector.
     *
     * This behavior is the same for length 1 Array.
     */
    constructor(array) {
        console.assert(Array.isArray(array),
            `Vector constructor expected Array, got ${array}`);

        // Handle special case of length 1 array, since Array with one numeric
        // argument creates an Array with that many empty slots
        if (array.length === 1) {
            super();
            this.push(array[0]);
        }
        else {
            super(...array);
        }
    }

    /**
     * Add elementwise.
     * @param {Vector} other - Other summand
     * @returns {Vector} Vector sum
     */
    add(other) {
        return this.map((e, i) => e + other[i]);
    }

    /**
     * Subtract elementwise.
     * @param {Vector} other - Subtrahend
     * @returns {Vector} Vector difference
     */
    sub(other) {
        return this.map((e, i) => e - other[i]);
    }

    /**
     * Multiply elementwise (Hadamard product).
     * @param {Vector} other - Other multiplicand
     * @returns {Vector} Vector elementwise product
     */
    mul(other) {
        return this.map((e, i) => e * other[i]);
    }

    /**
     * Sum elements.
     * @returns {Number} Sum of elements
     */
    sum() {
        return this.reduce((a, b) => a+b);
    }

    /**
     * Scale elements.
     * @param {Number} s - Factor to scale elements by
     * @returns {Vector} Scaled vector.
     */
    scale(s) {
        return this.map(e => s*e);
    }

    /**
     * Dot product.
     * @param {Vector} other - Other vector to dot product with
     * @returns {Number} Dot product
     */
    dot(other) {
        return this.mul(other).sum();
    }

    /**
     * Compute Euclidean (L2) norm.
     * @returns {number} Euclidean norm
     */
    norm() {
        return Math.sqrt(this.dot(this));
    }

    /**
     * Normalize (scale) to a unit vector.
     * @returns {Vector} Unit vector
     */
    unit() {
        return this.scale(1 / this.norm());
    }
}