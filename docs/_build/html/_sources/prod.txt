Readying Your App For Production
********************************

Before you can deploy your application on a public server, you will need to take a few extra steps
to get P to work for multiple people.


Connect to your server, not localhost
=====================================

By default, P connects to ``http://127.0.0.1:8080``. This connection happens in ``index.html``. While
this works fine when the P server is running locally, it won't work if other users, who do not have
a local P server running, try to connect to your application. To fix this, change the ``host`` to match
your host server's IP address.

In ``config/global/client.json``:

.. code-block:: json

   {
       "host":    "your.servers.ip.address",
       "port":    8080
   }


Change Environment to Production
================================

In ``config/environment.js`` you will want to switch the ``environment`` setting to ``"production"``:

.. code-block:: javascript

   P.configure({ environment: "production" });


.. warning:: Developers often neglect the production configuration when developing. Make sure everything is correct, and up to date.



Setting a Session Key
=====================

You may have noticed a warning when you start the P server about a session key. While this isn't
**essential**, it is highly recommended for production environments. 

To change the session key, edit ``config/global/app.js``. Change the session key to something unique
to your application. This will help P set your app apart from other P applications, and prevent session
mix-ups.