import * as assert from 'assert'
import * as A from '../src/ReadonlyArray'
import * as I from '../src/IO'
import * as O from '../src/Option'
import * as T from '../src/Tree'
import { monoidString } from '../src/Monoid'
import * as _ from '../src/Foldable'
import { pipe } from '../src/function'

export const ArrayOptionURI = 'ArrayOption'

export type ArrayOptionURI = typeof ArrayOptionURI

describe('Foldable', () => {
  it('intercalate', () => {
    assert.deepStrictEqual(pipe(['a', 'b', 'c'], _.intercalate(monoidString, A.Foldable)(',')), 'a,b,c')
  })

  it('toArray', () => {
    // Option
    const optionToArray = _.toArray(O.Foldable)
    assert.deepStrictEqual(optionToArray(O.some(1)), [1])
    assert.deepStrictEqual(optionToArray(O.none), [])

    // Tree
    const treeToArray = _.toArray(T.Foldable)
    assert.deepStrictEqual(treeToArray(T.make(1, [T.make(2, []), T.make(3, []), T.make(4, [])])), [1, 2, 3, 4])
  })

  it('traverse_', () => {
    let log = ''
    const append = (s: String) => () => (log += s)
    _.traverse_(I.Applicative, A.Foldable)(['a', 'b', 'c'], append)()
    assert.deepStrictEqual(log, 'abc')
  })

  it('reduceM', () => {
    assert.deepStrictEqual(
      pipe(
        [],
        _.reduceM(O.Monad, A.Foldable)(1, () => O.none)
      ),
      O.some(1)
    )
    assert.deepStrictEqual(
      pipe(
        [2],
        _.reduceM(O.Monad, A.Foldable)(1, () => O.none)
      ),
      O.none
    )
    assert.deepStrictEqual(
      pipe(
        [2],
        _.reduceM(O.Monad, A.Foldable)(1, (b, a) => O.some(b + a))
      ),
      O.some(3)
    )
  })
})
