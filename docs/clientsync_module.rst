.. sidebar:: Module Information

   :Implemented In:
      ``modules/ClientSync.js``
      
   :Depends On:
      Core

ClientSync Module
*****************

About the ClientSync Module
===========================

The ClientSync module allows your application to synchronize and communicate
between connected "users" or "clients". When a user connects to your application
server, they are added to a global clients list.

The ClientSync module allows you to access this list through ``P.clients``.
The list contains P instances for every connected client, **including the
local connected instance.**


Iterating Through Clients
=========================

.. code-block:: javascript

   P.clients.forEach(function(client) {
       if (client == P) {
           // client is our current instance of P
       }
       
       else {
           // client is a different instance of P
           // and can be used just like the P variable.
       }
   });
   
What Can You Do With Clients?
=============================

By gaining access to an entry in the ``P.clients`` array, you are gaining
access to another instance of the **P Object**. This means that you can do
literally anything with a client entry that you can with the usual **P Object**,
including, but not limited to, **calling controller methods**, **modifying elements**,
**sending P and Socket.io emissions**, and **changing variables directly in the P object**.
The possibilities are nearly unlimited.
