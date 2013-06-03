# Fo (Fantasy Overloading)

Overloaded operators for [Fantasy
Land](https://github.com/puffnfresh/fantasy-land) compatible
JavaScript:

  * `>=` Monad chain:

        fo()(
            Option.Some(1) >= function(x) {
                return x < 0 ? Option.None : Option.Some(x + 2);
            }
        ).getOrElse(0) == 3;

  * `<` Monad sequence:

        fo()(
            Option.Some(1) < Option.Some(2)
        ).getOrElse(0) == 2;

  * `%` Functor map:

        fo()(
            Option.Some(1) % add(2)
        ).getOrElse(0) == 3;

  * `*` Applicative ap(ply):

        fo()(
            Option.Some(add) * Option.Some(1) * Option.Some(2)
        ).getOrElse(0) == 3;

  * `<<` Compose:

        fo()(
            add(1) << times(2)
        )(3) == 7;

  * `>>` Compose reverse:

        fo()(
            add(1) >> times(2)
        )(3) == 8;

  * `+` Semigroup concat:

        fo()(
            Option.Some([1, 2]) + Option.Some([3, 4])
        ).getOrElse([]) == [1, 2, 3, 4];

  * `-` Group minus:

        fo()(
            Option.Some(1) - Option.Some(2)
        ).getOrElse(0) == -1;

## fo()(a)

Creates a new syntax scope. The `a` expression is allowed multiple
usages of a single operator per `fo` call.

For most operations, the associated name will be called on the
operands. for example:

    fo()(Option.Some([1, 2]) + Option.Some([3, 4]))

Desugars into:

    Option.Some([1, 2]).concat(Option.Some([3, 4]))

The exceptions are `andThen`, `sequence` and `minus`. They are
derived from Compose, Monad and Group, respectively.

## fo.setValueOf(proto)

Used to mutate the `valueOf` property on `proto`. Necessary for
the `fo` block's operator overloading. Falls back to the objects
existing `valueOf` if not in a `fo` block.

**Caution:** this mutates `proto`. The new `valueOf` tries to use
the original behaviour when not in a `fo` block but may not be
safe.
