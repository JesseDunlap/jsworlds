.. sidebar:: Module Information

   :Implemented In:
      ``modules/View.js``
      
   :Depends On:
      Core, Element

View Module
***********

About the View Module
=====================

The View module serves as the primary way to create interfaces, and
implements the View portion of the P MVC architecture.

Views are localized, and stored in the ``app/views`` directory.

For more information about views, see the **Views** guide.


Method Definitions
==================

P.view(name, [options])
   Appends a view to the ``body`` of the page.
   
   **@param**				``string`` name - The view file you wish to load. Note: extension not necessary
   
   **@param**				``object`` [options] - An optional key-value pair which specifies data able to be used by the view.
   
   **@return**				``Element`` An element which references the container ``div`` which contains your view.
   
   
---------------------------------

P.snippet(name, [options])
   Passes the view file through the templating engine, but does not add it to the page.
   
   **@param**				``string`` name - The view file you wish to parse.
   
   **@param**				``object`` [options] - An optional key-value pair which will be available to the view.
   
   **@return**				``string`` A string representation of the view's parsed code.
   
.. note:: It is possible to use the ``P.snippet`` function in views, and this is a good practice for outsourcing interface elements to separate files. You can also use ``P.snippet`` in a controller, for outsourcing re-usable elements of the interface when they need to be changed or updated.
