.. sidebar:: Module Information

   :Implemented In:
      Session.js
   
   :Dependencies:
      Core
      
   :Author:
      Jesse Dunlap


Session Data
************

Session data is a client-specific persistent storage, in the form of JSON. When a client
first connects to a P server, they are assigned a unique ID. Upon return visits, that client
identifies itself with that ID, and the server will load the client's session data.

Session data is stored in the ``app/data`` folder, as a JSON file.


Setting Session Data
====================

.. code-block:: javascript

   P.session("key", "value");


.. note:: "value" can be any JSON-compatible data structure.

.. warning:: 

   Saving non-JSON-compatible data can cause your app to crash repeatedly. If this happens,
   simply delete the offending ``.json`` file from ``app/data``.


Reading Session Data

.. code-block:: javascript

   var value = P.session("key");
