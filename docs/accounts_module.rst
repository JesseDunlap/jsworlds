.. sidebar:: Module Information

   :Implemented In:
      ``modules/Accounts.js``
      
   :Depends On:
      Core, MongoDb

Accounts Module
***************


About the Accounts Modules
==========================

The Accounts module allows your P application to have user account
functionality out of the box. The account module handles **registration**,
**authentication**, and **account modification**.


Data Storage
============

Currently, the Accounts module utilizes a MongoDb connection to store
account information. The Accounts module reads the Mongo configuration
from ``config/environment.js`` and automatically sets up it's own, separate
connection.

The Accounts module uses the ``accounts`` collection in your configured
database. You will be notified via an **Error Message** in the P console
output if the Accounts module is unable to connect to the configured
MongoDb server.


Account Structure
=================

Accounts are stored as records in a MongoDb collection. Every account
record contains a:

* Mongo ID (``_id``)
* First Name
* Last Name
* Username
* Password
* Email Address
* Additional Data (a JavaScript object, which can be almost anything)

When your client has an authenticated session, their current account information
will be stored in ``P.account``. An sample account structure looks like this:

.. code-block:: javascript

   {
      "firstName":        "John",
      "lastName":         "Doe",
      "password":         "1234",
      "email":            "john@gmail.com",
      "username":         "john.doe",
      "additionalData":   {}
   }


Method Definitions
==================

P.accounts.getSkeleton()
   Returns an empty account Skeleton, which represents a new, blank user.
   
   **@param**			None.
   
   **@return**			An empty account skeleton. (See **Account Structure**)
   

----------------------------------------------------------------------
   
P.accounts.isLoggedIn()
   Returns ``true`` if the client has an active, authenticated login session.
   Returns ``false`` if the client is not authenticated.
   
   **@param**           None.
   
   **@return**          ``true`` if authenticated, ``false`` if not authenticated.
   
----------------------------------------------------------------------

P.accounts.init(callback)
   Initializes the Accounts module, and restores an active session if one
   exists. This should be called in the **app controller's** ``index`` action.
   
   **@param**           ``function`` callback - Callback function which is called once initialization is finished.
   
   **@return**			None.
   
   
**Example:** Initializing the Accounts Module.

.. code-block:: javascript

   /**
    * controllers/app.js
    */
    
   module.exports = function(P) {
       this.index = function(callback) {
           P.depends(["Accounts"]);
           P.accounts.init(callback);
       };
   };
   
----------------------------------------------------------------------

P.accounts.grav(email)
   Returns a **Gravatar URL** to an image for the given email's associated
   Gravatar. This is useful for when you have an account email, and wish to
   fetch an avatar for the account.
   
   **@param**			``string`` email - Email to fetch Gravatar for
   
   **@return**			``string`` A URL to a Gravatar image
   
----------------------------------------------------------------------

P.accounts.getGravatar()
   Returns a **Gravatar URL** for the currently authenticated user.
   
   **@param**			None.
   
   **@return**			``string`` A URL to the current user's Gravatar
   
----------------------------------------------------------------------

P.accounts.update(callback)
   Saves the data in ``P.account`` to the database.
   
   **@param**			``function`` callback - Called when the update is complete
   
   **@return**			None
   

**Example:** Updating a user.

.. code-block:: javascript

   P.account.firstName = "Johnny";
   
   P.accounts.update(function(error, results) {
       // John renamed to Johnny
       // Update Complete.
   });
   
   
----------------------------------------------------------------------

P.accounts.register(callback)
   Creates a new user, using the data in ``P.account``.
   
   **@param**			``function`` callback - Called when the registration is complete
   
   **@return**			None

.. warning:: This function does not validate if a duplicate user exists, and will create a duplicate user if supplied duplicate information.
   
**Example:** Registering a user.

.. code-block:: javascript

   P.account.username    = "john.doe";
   P.account.firstName   = "John";
   P.account.lastName    = "Doe";
   P.account.password    = "1234";
   P.account.email       = "john@gmail.com";
   
   P.accounts.register(function(error, results) {
       // Registration complete.
   });
   
----------------------------------------------------------------------

P.accounts.logout()
   Logs the user out and invalidates the current login session.
   Resets ``P.account`` to a blank skeleton account.
   
   **@param**				None.
   
   **@return**				None.
   
   
----------------------------------------------------------------------

P.accounts.login(usernameOrEmail, password, callback)
   Attempts to validate the given login information. If validation is
   successful, the session will be saved for future use.
   
   **@param**				``string`` usernameOrEmail - The username or email address of the user

   **@param**				``string`` password - The password of the user

   **@param**				``function`` callback - Callback function, which is called once the authentication response is ready

   **@return**				None.
   
.. note:: If a valid username or email address is supplied, as well as a valid password, authentication will succeed. This allows your users to log in using either their username or email address, and your application's text should reflect this.

.. warning::

   As of now, no methods are in place to encrypt any user data, namely **passwords**. If you would
   like to encrypt passwords, simply encrypt them manually before passing them into any of the
   Account module's functions. Future plans for encryption **are** being considered.
   
   
**Example:** Authenticating a user.

.. code-block:: javascript

   P.accounts.login("john.doe", "1234", function(successfulLogin, error, results) {
       if (successfulLogin) {
           // Login Successful!
       }
       
       else {
           // Invalid username/email or password combination
       }
   });
