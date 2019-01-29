


// Beast 4: librarySystem that can handle dependencies that are created out of order



// Requirements:
// -- librarySystem can accept any number of dependencies (0 or more)
// -- Dependendencies can be created out of order
// -- Each library callback function is run only once




(function() {

    // Internal data
    var libraryStorage = {};  // key: string name; value: object library
    var libsWaitingForDependencies = {};  // key: string name; value: {string array dependencies, function libraryFunction}

    // Public function
    function purgeLibraries() {
        libraryStorage = {};
        libsWaitingForDependencies = {};
    }

    // Public function
    // libraryFunc should return the library object
    function librarySystem(libraryName, dependencies, libraryFunc) {

        if (arguments.length > 2) {
            // Use case: attempting to store a new library in libraryStorage
            // If library is not already in libraryStorage, attempt to load it
            if ( !(libraryName in libraryStorage) ) {
                libsWaitingForDependencies[libraryName] = 
                    {
                        dependencies: dependencies,
                        libraryFunc: libraryFunc
                    };
                attemptLoadLibrary(libraryName);
            }
        }
        
        else if (arguments.length === 1) {
            // Use case: attempting to read library object from libraryStorage
            // Returns undefined if library object could not be resolved
            return attemptLoadLibrary(libraryName);
        }

    }

    // Internal function
    function attemptLoadLibrary(libraryName) {
        console.log("Attempting to load " + libraryName);
        // If already in storage, return the library object; otherwise, attempt to load it and its dependencies
        if (libraryName in libraryStorage) {
            return libraryStorage[libraryName];
        }
        if ( !(libraryName in libsWaitingForDependencies) ) {
            // Library is neither loaded into libraryStorage nor waiting to be loaded in libsWaitingForDependencies
            return undefined;
        }
        // Library is not loaded into libraryStorage but it is waiting to be loaded in libsWaitingForDependencies
        // Attempt to load its dependencies
        var depNames = libsWaitingForDependencies[libraryName].dependencies;
        var loadedDeps = [];
        for (var i = 0; i < depNames.length; i++) {
            var loadResult = attemptLoadLibrary(depNames[i]);
            if (loadResult === undefined) {
                // Dependency could not be loaded, so this library cannot be loaded.
                return undefined;
            }
            loadedDeps.push(loadResult);
        }
        // All dependencies were loaded successfully. Store library in libraryStorage and return it.
        console.log("Successful creation of " + libraryName);
        libraryStorage[libraryName] = libsWaitingForDependencies[libraryName].libraryFunc.apply(this, loadedDeps);
        delete libsWaitingForDependencies[libraryName];
        return libraryStorage[libraryName];
    }

    // Make librarySystem function globally available
    window.purgeLibraries = purgeLibraries;
    window.librarySystem = librarySystem;

})();