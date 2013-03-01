.. sidebar:: Module Information

   :Implemented In:
      Views.js
   
   :Dependencies:
      Core, Elements
      
   :Author:
      Jesse Dunlap

Views
*****

Views make up the user interface of your application. They contain all markup and
JavaScript required to create your user experience. Views also trigger actions on
the controller for various different types of events.


Templating Engines
==================

P allows for multiple different templating engines. By default, P uses the **EJS**
templating engine. For more information, see the Templating Engines documentation.


Loading a View
==============

Views can be loaded in the controller, either inside of an element, or just appended
to the page. Choosing where you put your view ultimately comes down to what the view
does and how it functions.


Rendering a View in an Element
------------------------------

.. code-block:: javascript

   P.$('#element').render("view", [options]);


Appending a View to the Body
----------------------------

.. code-block:: javascript

   var viewElement = P.view("view", [options]);


.. note::

   You **do not** need to add an extension for your views. This will be handled automatically
   by the templating engine you have configured.



Access to the P Object
======================

Views have access to both the **server-side P Object** and the **client-side P Object**.
The server side P object can be accessed through the templating engine's template feature.

In EJS accessing the P object looks like this:

.. code-block:: html

   <% P.config.appName %>


You can also communicate with the P server using client-side JavaScript. We have done
our best to make this transition seamless, however only a few of the functions available
in the server-side P object are available in the client-side version.
