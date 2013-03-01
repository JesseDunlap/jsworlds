.. sidebar:: Module Information

   :Implemented In:
      Controllers.js
   
   :Dependencies:
      Core
      
   :Author:
      Jesse Dunlap

Controllers
***********

**Controllers** are a major part of the MVC architecture. They serve as the "glue" between
Models and Views. Controllers contain methods, or functions, called **actions**, which
usually correspond to a single task the controller can perform.

Generating a Controller
=======================

Using the P command prompt, you can quickly generate a new controller, complete with
some basic bootstrap code. To generate a controller, run the following command in the
prompt:


.. code-block:: javascript
   
   generate controller <controller name>


Controllers are typically named in a lowercase, plural form of whatever data they will
be interacting with the most. For example, a controller that handles account registration,
login, and modification, might be called ``accounts``.


Structure of a Controller
=========================

Controllers are, simply put, **Node modules**. This allows for potential portability in
the future, perhaps allowing you to simply take your code and put it into another Node
application.

Inside of the Controller, there can be variables or functions. Functions typically
correspond to actions, which may be invoked by Views or other Controllers.

A sample controller is shown below:

.. code-block:: javascript

   module.exports = function(P) {
       this.index = function() {
           // Index Action
       };
   };

As you can see, this controller contains a single action: ``index``. Most controllers
contain an index action, which serves as the "landing page" for the controller.

Special Controller Actions
--------------------------

Any controller can choose to implement a set of **special actions** which allow it to perform
actions in certain special-case scenarios.

**beforeFilter**

The ``beforeFilter`` action will be triggered before the controller is loaded.
(e.g. when the app calls ``P.controller("your_controller_name")``)

**index**

It is usually a good idea to implement the ``index`` action, especially in the
**P Websites** fork of P. Future versions of P may automatically route to the
``index`` action if another action is not specified.


Triggering a Controller Action
==============================

In a Controller
---------------

Triggering an action in a controller is simple, just use the ``P.controller`` function as shown below:

.. code-block:: javascript

   P.controller("controller_name").action([parameters]);


.. note::

   P automatically caches controllers. If a controller has been previously loaded,
   it will be returned by ``P.controller``. To disable this, specify a second parameter: 
   ``{ cache: false }`` in the ``P.controller`` function.


In a View
---------

**Manual JavaScript Triggering**

The usual way of triggering a controller action is through client-side Javascript, using
the **P.controller** function. In client-side JavaScript, the ``P.controller`` function
acts a bit differently than on the server. 

A usage example is shown below:

.. code-block:: javascript

   P.controller("controller_name").action([parameter], [callback]);


.. note::
   If the controller returns something, the return value will be passed
   as a parameter to the specified ``callback`` function.

.. warning:: 

   You can only send one parameter to a controller action with client-side JavaScript.
   However, this can be any kind of **serializable** data structure, including an
   **Object**.

-----------------------------------------------

**Quick Links**

You can also trigger a parameter-less controller action by adding the ``p:link`` attribute
to an ``anchor`` tag in your view. An example is shown below:

.. code-block:: html

   <a href="#" p:link="controller.action">Click Me</a>

----------------------------------------------

**Forms**

P allows you to quickly link a form, including its serialized data to a controller action
using the ``p:action`` tag. An example is shown below:

.. code-block:: html

   <form p:action="controller.action">
       <p>Your Name:</p>
       <input type="text" name="name" />

       <input type="submit" value="Submit" />
   </form>

P will automatically serialize the form's data and include it as the parameter for the
controller action. The form above would be serialized into this JSON data:

.. code-block:: javascript

   {
       "name": "The User's Entered Value" 
   }

.. note:: P can also serialize file input elements. For more information, see the Forms tutorial.

------------------------------------------------

**Callbacks**

.. admonition:: Required P Version

   **>= 0.1.5**

Controller actions are able, through their ``return`` statement, to send data back to the calling
view as a callback function.

**Controller Action:**

.. code-block:: javascript

   this.add = function(x) {
       return x + 2;
   };


**View:**

.. code-block:: javascript

   P.controller("some_controller", "add", 5, function(result) {
       console.log(result); // 7
   });

The Index Controller
====================

The **Index Controller** (``index.js``) is a required controller, similar to the **App Controller**.

P assumes the existence of the index controller, as well as the ``index`` action. When a user
connects to the P server, a new instance of the P object is created, and the index controller's
index action is triggered.

The App Controller
==================

The **App Controller** provides a more global-oriented area to handle events for your
application. The app controller is required for proper operation of your application,
as well as implementation of the following methods:

onLoad(callback)
----------------

``onLoad`` is called when the user first connects to the P server. This is where you
should do any kind of filesystem setup, session restoring, or database connections.
Once you've finished doing everything you need to do, you will need to trigger the
``callback()`` method.

.. warning:: Failure to trigger the ``callback()`` function will stop your app from loading.


onExit()
--------

``onExit`` is called when the user disconnects from your app. It gives you an opportunity
to do any background processing necessary to save the user's state, and clean up anything
you need to.

.. note:: 
   
   When the user disconnects, or closes the web page, nothing happens on the server side, 
   so you can use almost any information without fear of it being deleted. However, this
   means you will need to be careful about memory usage and clean-up.

beforeFilter()
--------------

``beforeFilter`` functions like the beforeFilter action on any controller, except the
App controller's beforeFilter action gets triggered before *every* controller load.
