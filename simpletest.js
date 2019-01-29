/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */

 
var SimpleTest = {

    run: function(tests) {
        var failures = 0;
        var successes = 0;
        for (var testName in tests) {
            var testAction = tests[testName];
            try {
                testAction.apply(this);
                successes++;
                console.log('%c' + testName, "color: green;");
            } catch (e) {
                failures++;
                console.groupCollapsed("%c" + testName, "color: red;");
                console.log("%c" + e.stack, "color: red");
                console.groupEnd();
            }
        }
        setTimeout(function() { // Give document a chance to complete
            if (window.document && document.body) {
                document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
                var h1 = document.createElement("h1");
                h1.innerHTML = "Ran " + (successes+failures) + " Tests: " + successes + " successes, " + failures + " failures.";
                document.body.appendChild(h1);
            }
        }, 0);
    },

    assert: function(value, msg) {
        if (!value) {
            throw new Error('assert(): ' + msg);
        }
    },

    assertEquals: function(expected, actual) {
        if (expected !== actual) {
            throw new Error('assertEquals() "' + expected + '" !== "' + actual + '"');
        }
    },

    assertEqualArrays: function(expected, actual) {
        if (expected.length !== actual.length) {
            throw new Error('assertEqualArrays() "' + expected + '" !== "' + actual + '"');
        }
        for (var i = 0; i < expected.length; i++) {
            if (expected[i] !== actual[i]) {
                throw new Error('assertEqualArrays() "' + expected + '" !== "' + actual + '"');
            }
        }
    },


};

var assert             = SimpleTest.assert.bind(SimpleTest),
    assertEquals       = SimpleTest.assertEquals.bind(SimpleTest),
    eq                 = SimpleTest.assertEquals.bind(SimpleTest), // alias for assertEquals
    tests              = SimpleTest.run.bind(SimpleTest),
    assertEqualArrays  = SimpleTest.assertEqualArrays.bind(SimpleTest);
