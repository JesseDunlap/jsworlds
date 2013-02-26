.. sidebar:: Module Information

   :Implemented In:
      ClientSync.js
   
   :Dependencies:
      Core
      
   :Author:
      Jesse Dunlap


Accessing Other Clients
***********************

A main feature of P is the ability to easily and quickly interact with other
connected users. P allows this through a feature called **ClientSync**.


Getting a List of Clients
=========================

``P.clients`` is a list of P instances, including your own, which is actively updated
as users connect and disconnect.

Iterating Through Clients
=========================

.. code-block:: javascript

   P.clients.forEach(function(client) {
       client.controller("index").index(); // call the index action on the client
   });


.. note:: ``client`` represents an instance of P, just like the ``P`` object, but corresponding to that client.


Listening for Client Changes
============================

.. code-block:: javascript

   P.on("clients_changed", function() {
       // someone connected or disconnected
   });
