var fo = require('./fo');

function Identity(x) {
    if(!(this instanceof Identity))
        return new Identity(x);

    this.x = x;
}

Identity.prototype.chain = function(f) {
    return f(this.x);
};
Identity.prototype.ap = function(b) {
    return Identity(this.x(b.x));
};
Identity.prototype.concat = function(b) {
    return Identity(this.x.concat(b.x));;
};
Identity.prototype.map = function(f) {
    return Identity(f(this.x));
};
Identity.prototype.negate = function() {
    return Identity(this.x.negate());
};
fo.unsafeSetValueOf(Identity.prototype);

Number.prototype.negate = function() {
    return -this;
};
Number.prototype.concat = function(b) {
    return this + b;
};

Function.prototype.compose = function(b) {
    var a = this;
    return function(x) {
        return a(b(x));
    };
};
fo.unsafeSetValueOf(Function.prototype);

function add(x) {
    return function(y) {
        return x + y;
    };
}

function times(x) {
    return function(y) {
        return x * y;
    };
}

exports.testAndThen = function(test) {
    test.equal(
        fo()(
            add(1) >> times(2) >> add(3)
        )(4),
        13
    );

    test.done();
};

exports.testAp = function(test) {
    test.equal(
        fo()(
            Identity(add) * Identity(1) * Identity(2)
        ).x,
        3
    );

    test.done();
};

exports.testChain = function(test) {
    test.equal(
        fo()(
            Identity(1) >= function(x) {
                return Identity(x + 1);
            }
        ).x,
        2
    );

    test.done();
};

exports.testCompose = function(test) {
    test.equal(
        fo()(
            add(1) << times(2) << add(3)
        )(4),
        15
    );

    test.done();
};

exports.testConcat = function(test) {
    test.equal(
        fo()(
            Identity(1) + Identity(2)
        ).x,
        3
    );

    test.done();
};

exports.testMap = function(test) {
    test.equal(
        fo()(
            Identity(1) % times(10) % add(1)
        ).x,
        11
    );

    test.done();
};

exports.testMinus = function(test) {
    test.equal(
        fo()(
            Identity(1) - Identity(2)
        ).x,
        -1
    );

    test.done();
};

exports.testSequence = function(test) {
    test.equal(
        fo()(
            Identity(1) < Identity(2)
        ).x,
        2
    );

    test.done();
};
