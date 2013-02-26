.. sidebar:: Module Information

   :Implemented In:
      ``modules/Controller.js``
      
   :Depends On:
      Core, Debugger


Controller Module
*****************

About the Controller Module
===========================

The Controller module handles everything related to the Controller aspect
in the P MVC architecture. The Controller module allows you to trigger
controller actions, and handles client-side controller action triggering.


Method Definitions
==================

P.controller(name, [options])
   Returns a local cached instance of the specified controller.
   
   **@param**				``string`` name - The name of the controller you wish to access
  
   **@param**				``object`` options - A key-value pair specifying various special options. See **Options** below.
   
   **@return**				``Controller`` a cached instance of the requested controller object

Options
-------

Below are options that you can specify in the second parameter of ``P.controller``:

+----------+--------+------------------------------------------------------------------------------------------------------------------------------+
|Option Key|Type    |Description                                                                                                                   |
+==========+========+==============================================================================================================================+
|``cache`` |``bool``|If set to ``false``, the ``P.controller`` function will load a **new** version of the controller, instead of a cached version.|
+----------+--------+------------------------------------------------------------------------------------------------------------------------------+


.. warning:: If you specify that the ``P.controller`` function should use a **new** version of the controller, it will over-write the cached version with the new version in the controller cache.


**Example:** Triggering a controller action from another controller.

.. code-block:: javascript

   P.controller("index").index(); // trigger the index controller's index action
   

**Example:** Triggering a controller action in a view's JavaScript.

.. code-block:: javascript

   P.controller("index", "index"); // index controller's index action
   

.. note:: Triggering a controller in a view is a bit different than in a controller, for more information, see the **Controllers** guide.


Manually Triggering a Controller Action
=======================================

It is possible to directly trigger a controller action through Socket.IO, but this
should never need to be done in normal use-cases. Regardless, an example is shown below...

**Example:** Triggering a controller action through Socket.IO.

.. code-block:: javascript

   P.socket.emit("call", {
      controller:    "index",
      action:        "index",
      data:          "hello"
   });
   

.. note:: The value for ``data`` will be mapped to the action's first parameter.
