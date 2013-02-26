.. sidebar:: Module Information

   :Implemented In:
      Elements.js
   
   :Dependencies:
      Core
      
   :Author:
      Jesse Dunlap


Elements
********

Introduction
============

Elements are one of the most important, and exiting features of the P Framework. Elements
provide a wrapper for you to directly modify HTML on the current user's page, or
through the **ClientSync** API, another user's page.

The Elements API directly mimics and corresponds to the jQuery API, with a few exceptions.


Selecting Elements
==================

.. code-block:: javascript

   var element = P.$('jquery selector');


.. note:: The element selector can literally be any kind of jQuery selector, as they directly map to jQuery.


Selecting Children
==================

.. code-block:: javascript

   var parent = P.$('#parent');
   var child = parent.$('#child');

   console.log(child.selector); // "#parent > #child"



Rendering a View In an Element
==============================

.. code-block:: javascript

   P.$('#element').render("view", [options]);

