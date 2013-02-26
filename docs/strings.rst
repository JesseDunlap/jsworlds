Strings and Snippets
********************

Strings
=======

Strings allow you to outsource all **copy** from your controllers. MVC design patterns
discourage the use of HTML or application copy inside of controllers.

Strings are different from Snippets, because they are not ran through a templating engine,
but rather just returned as-is.

Using Strings
-------------

To use a string, you call the ``P.string`` or ``P.str`` function as shown below:

.. code-block:: javascript

   console.log(P.string("hello_world"));

The code snippet above would look for a string at ``app/strings/locale/hello_world.string``.

.. note::
   
   To prevent extensive I/O, strings are pre-loaded when the user connects to the app.
   If a string does not exist in the cache, it will be loaded from the file system.


Snippets
========

Snippets are much like strings, except they are ran through a templating engine, just like
Views. Snippets are useful in both Controllers and Views, as they can be used to quickly
re-use important parts of the user interface.

Using Snippets
--------------

To use a snippet in either a view or a controller, you use the ``P.snippet`` function:


.. code-block:: javascript

   P.snippet("hello_world", [options]);

Snippets, like views, should be saved with an extension corresponding to the templating
engine you are currently using. The default is ``.ejs``.

.. note::

   Also like views, snippets have access to the server-side P object through the
   templating engine, as well as the P client-side variable through normal JavaScript.