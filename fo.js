/**
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
**/

// Gross mutable global
var foQueue;

/**
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
**/
function fo() {
    var oldfoQueue = foQueue;

    if(arguments.length)
        throw new TypeError("Arguments given to fo. Proper usage: fo()(arguments)");

    function reduce(a, f) {
        var r = a[0],
            i;

        if(a.reduce)
            return a.reduce(f);

        for(i = 1; i < a.length; i++) {
            r = f(r, a[i]);
        }

        return r;
    }

    function access(p) {
        return function(o) {
            return o[p];
        };
    }

    function andThen(g) {
        return function(f) {
            return f.compose(g);
        };
    };

    function sequence(a) {
        return function(b) {
            return a.chain(function(ignored) {
                return b;
            });
        };
    }

    function minus(a) {
        return function(b) {
            return a.concat(b.negate());
        };
    }

    foQueue = [];
    return function(n) {
        var op,
            r,
            i;

        if(!foQueue.length) {
            foQueue = oldfoQueue;
            return n;
        }

        // >= > === ==
        if(n === false)
            op = access('chain');

        // >> >>> &
        else if(n === 0)
            op = andThen;

        // <<
        else if(n === Math.pow(2, (2 << foQueue.length) - 3))
            op = access('compose');

        // *
        else if(n === Math.pow(2, foQueue.length * (foQueue.length + 1) / 2))
            op = access('ap');

        // + | ^
        else if(n === (2 << foQueue.length) - 2)
            op = access('concat');

        // %
        else if(n === 2)
            op = access('map');

        // -
        else if(n < 0)
            op = minus;

        // < <= !== !=
        else if(n == true)
            op = sequence;

        else {
            console.log(n);
            foQueue = oldfoQueue;
            throw new Error("Couldn't determine fo operation. Could be ambiguous.");
        }

        r = reduce(foQueue, function(r, q) {
            return op(r).call(r, q);
        });

        foQueue = oldfoQueue;
        return r;
    };
}

/**
    ## fo.setValueOf(proto)

    Used to mutate the `valueOf` property on `proto`. Necessary for
    the `fo` block's operator overloading. Falls back to the objects
    existing `valueOf` if not in a `fo` block.

    **Caution:** this mutates `proto`. The new `valueOf` tries to use
    the original behaviour when not in a `fo` block but may not be
    safe.
**/
fo.unsafeSetValueOf = function(proto) {
    var oldValueOf = proto.valueOf;
    proto.valueOf = function() {
        if(foQueue === undefined)
            return oldValueOf.call(this);

        foQueue.push(this);
        return 1 << foQueue.length;
    };
};

if(typeof module != 'undefined')
    module.exports = fo;
