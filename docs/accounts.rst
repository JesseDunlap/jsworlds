Accounts
********   

The Accounts Module allows your app to have user accounts set up out of the box,
complete with name, email, password, avatars, and any additional data you desire.

The Accounts module uses MongoDb, and references the ``mongo`` config in the
``config/environment.js`` file.

Initializing the Accounts Module
================================

Before you can use the Accounts module, you will need to add the following code to your
**App Controller's** ``onLoad`` action:


.. code-block:: javascript

   P.depends(["Accounts"]);

   P.accounts.init(function() {
       callback();
   });

The ``init`` method will:

* Connect to the P account database
* Re-establish a session if one exists
* Notify you of any errors that occur


Checking If The User is Logged In
=================================


.. code-block:: javascript

   if (P.accounts.isLoggedIn() == true) {
       // user authenticated
   }


Accessing the Logged In User
============================

If you have an active login session, you can access the account information using
the ``P.account`` object. A sample Account Object is shown below:

.. code-block:: javascript

   {
       "firstName":      "John",
       "lastName":       "Doe",
       "password":       "1234",
       "username":       "john.doe",
       "email":          "john@gmail.com",
       "additionalData": {}
   }


Registering a New User
======================

.. code-block:: javascript

   P.account.firstName = "John";
   P.account.lastName  = "Doe";
   P.account.password  = "1234";
   P.account.email     = "john@gmail.com";
   P.account.username  = "john.doe";

   P.accounts.register(function() {
       // completed registration
   });


Authenticating a User
=====================

.. code-block:: javascript

   P.accounts.login("username", "password", function(loggedIn) {
       if (loggedIn == true) {
           // authenticated
       }
   });


.. note:: The user can enter either their **username** or **email address**. Both will work.


Logging Out
===========

.. code-block:: javascript

   P.accounts.logout();


Updating User Information
=========================

After successful authentication, you can change the ``P.account`` object to match
the new information, then call ``P.accounts.update()``

.. code-block:: javascript

   P.account.firstName = "Johnny";

   P.accounts.update(function() {
       // completed update
   });


.. warning:: 

   As of now, changing the username, password, or email of the user does not invalidate
   the session. You will have to do this on your own.


Gravatars
=========

The Accounts Module uses Gravatars for avatar storage. You can choose to use your own
avatar storage if you would like. A couple of functions are provided for retrieving
Gravatar information...


P.accounts.grav(email)
----------------------
This shorthand function returns a Gravatar URL for the specified ``email``.

P.accounts.getGravatar()
------------------------
Gets the current authenticated user's Gravatar URL.
