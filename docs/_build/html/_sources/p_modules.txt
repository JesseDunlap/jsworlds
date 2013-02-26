Extending P With Modules
************************

What are Modules?
=================

Modules are **Node modules**, which usually ``export`` a few options, and a master function, 
which gets called with the **P Object** as their first parameter. At this time, a Module 
can choose to listen for events, do something with the file system, or extend
the P object.

Modules are typically used to enhance the functionality of the framework, and often can be written
to tailor to the unique needs of an application.


Module Autoloading
==================

When a user connects to the P server, P loads all of the modules in the ``modules`` directory using the
``require`` function. P then checks the module's ``autoload`` export. If ``autoload`` is equal to ``true``,
P will then call the ``module`` function of the export, supplying ``P`` as the first parameter.

.. warning::

   It is considered good practice to, by default, **not** autoload custom modules, as that can clutter up
   the P object, and cause slow-down.


Custom Modules
==============

To write a custom module, simply add a new file to the ``modules`` directory. Use this boilerplate
to get your module up and running:

.. code-block:: javascript

   exports.autoload = false; // Set this to true if you wish for your module to be autoloaded

   exports.module = function(P) {
       // Make your module work here, and modify the P object if necessary
   });


.. note::

   Notice that the boilerplate uses ``exports.module``. This is **not** a typo, and it should **not** be
   ``module.exports``. This is an unintentional side-effect of the P Module Naming Convention.


Depending on Modules
--------------------

Typically, P loads all modules at the same time, with almost no noticeable delay, usually rendering the
manual specification of Module dependencies unnecessary. The practice is, however, still suggested to
improve stability of your module, and by extension your application.

To depend on a module, you call the ``P.depends`` function, which will priority-load the modules you specify,
if they have not already been loaded by the autoloader.

.. code-block:: javascript

   P.depend(["List", "Of", "Dependencies"]);


Depending on Your Own Module
----------------------------

If your module is not auto-loaded, you will need to have your **controllers** depend on it, before you use it
in your application's code. Simply use the ``P.depend`` function like you would in a module.