.. sidebar:: Module Information

   :Implemented In:
      ``modules/Session.js``
      
   :Depends On:
      Core, Controller, Global, ClientSync

Session Module
**************

About the Session Module
========================

The Session module allows your application to store persistant session data
for connected clients. This session data will automatically be loaded upon
connection of a returning client.

Session data is stored in ``.json`` files in the ``app/data`` directory.

For additional information, see the **Sessions** guide.


.. note:: This module has a few unusual dependencies because it handles a good portion of the client's connection process.


Unique Sessions
===============

Automatic precaution is taken to ensure that P sessions are unique between
clients and servers, and different P applications. To make sure that your
app is completely unique, the unique client ID assigned by the P server
uses a customized ``sessionKey`` from ``config/global/app.js`` to make your
app's assigned client ID's 100% unique.

Before deploying your app in a production environment, it is suggested that
you change the ``sessionKey`` variable in ``config/global/app.js``.

For more information, see the **Production** guide.


Method Definitions
==================

P.session(key)
   Returns the value for the specified ``key``.
   
   **@param**				``string`` key - The key you wish to look up.
   
   **@return**				``id`` The value corresponding to the specified key.
   
---------------------------------------------

P.session(key, value)
   Sets a session variable.
   
   **@param**				``string`` key - The key you wish to set
   
   **@param**				``id`` value - Any JSON-serializable value, which will correspond to the specified key.
   
   **@return**				None.
