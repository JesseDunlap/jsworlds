Using and Creating Custom Libraries
***********************************

**Libraries** are much like **P Modules**, differing only in the aspect that they are never auto-loaded.
Libraries are true **Node modules**, and can usually be taken out of a P application and used in other Node
projects. Loading a library through P allows you to give the library access to the **P Object**.


Loading a Library
=================

.. code-block:: javascript

   var library = P.lib("path/to/library");


.. note::

   ``P.lib`` will use ``require`` to load the library module you specified inside of the ``lib`` folder.
   It will then call the returned function, passing the P object as a parameter. The initialized module
   will be returned by ``P.lib``, making initialization after loading unnecessary.


Creating a Custom Library
=========================

As previously mentioned, libraries are just **Node modules**, which export a single function, which can
accept ``P`` as its one and only parameter.

.. code-block:: javascript

   module.exports = function(P) {
       this.someMethod = function() {
           // Use P here if you want, or do something completely different
       };
   };


.. note::

   Libraries are stored in the ``lib`` folder, usually in a subdirectory corresponding to your name
   or company/organization name. For example, P libraries are stored in ``lib/p``, and loaded using
   ``P.lib("p/<some_library>")``.