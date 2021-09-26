/**
 * Recursively repackages array values into provided properties via
 * zipper-merge. Non-array values will be preserved as-is.
 *
 * @example
 * zipperPack({ foo: [1, 2, 3], bar: [4, 5], baz: 6 }, ["a", "b", "c"])
 * // => { a: { foo: 1, bar: 4 }, b: { foo: 2, bar: 5 }, c: { foo: 3 }, baz: 6 }
 * @param {object} input
 * @param {array} boxes Properties to zipperPack array values into
 * @returns {object}
 */
export default function zipperPack(input, boxes) {
  const { root = {}, ...rest } = Object.entries(input).reduce(
    (output, [property, values]) => {
      if (Array.isArray(values)) {
        // put each value in the target box
        values.forEach((value, index) => {
          const box = boxes[index]
          output[box] = output[box] || {}
          output[box][property] = value
        })
      } else if (typeof values === "object") {
        // recurse, merging with any existing values
        output[property] = {
          ...(output[property] || {}),
          ...recurse(values, boxes),
        }
      } else {
        output[property] = values
      }

      return output
    },
    {}
  )

  return { ...root, ...rest }
}
