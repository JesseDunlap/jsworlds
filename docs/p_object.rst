The P Object
************

Introduction
============

The ***P*** Object is P's version of the jQuery ***$***. When P first runs, it searches the
modules folder for JavaScript files, which extend the P object. The P object also contains
a few core functions, which are required almost everywhere in a P app.

Variables
=========

P.config
--------
P's global configuration object.

**To set configuration variables:**

.. code-block:: javascript

   P.configure({
       key: "value"
   });


**To access configuration variables:**

.. code-block:: javascript

   P.config["key"]; // "value"


P.socket
--------
The Socket.IO instance corresponding to the current user.


Methods
=======

P.depends(dependencies)
-----------------------
Loads any dependency modules that have not already been loaded. Useful for modules
that require other modules to be loaded, or when your code requires modules that are
not automatically loaded.

**Parameters:**

* **dependencies** - a list of modules that are required.


P.on(listener, callback)
-----------------------
Adds an event listener, which will be triggered if the listener is emitted using ``P.emit``.

**Parameters:**

* **listener** - the name of the event emitter you wish to listen for.
* **callback** - a callback function, which will be triggered, sometimes with parameters, when the emitter is triggered.

P.emit(listener, [data])
------------------------
Triggers a P event, by extension triggering the callback functions of all corresponding ``P.on`` listeners.

* **listener** - the name of the event emitter you wish to trigger.
* **data** - any kind of JavaScript variable, which will be sent to the corresponding listener(s).

**Using Emitters:**

.. code-block:: javascript

   P.on("message", function(data) {
       console.log(data.sender + ": " + data.message);
   });

   P.emit("message", { 
       sender: "Bob", 
       message: "Hello World!" 
   });


P.extend(object1, object2)
--------------------------

Merges ``object2`` into ``object1``, much like the ``jQuery.extend`` function.

**Parameters:**

* **object1** - the source object, which will be modified.
* **object2** - the modifier object, which will be merged into ``object1``.

**Usage Example:**

.. code-block:: javascript

   var object1 = { sender: "Bob" };
   var object2 = { message: "Hello World" };

   P.extend(object1, object2);

   console.log(object1.message); // "Hello World"