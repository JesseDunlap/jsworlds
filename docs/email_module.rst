.. sidebar:: Module Information

   :Implemented In:
      ``modules/Email.js``
      
   :Depends On:
      Core, `sendmail`

Email Module
***************


About the Email Module
======================

The Email module makes it easy to send email messages with the P Framework. Currently, the module
is quite rudamentry, and uses the ``sendmail`` system to deliver messages. The Email module supports
both HTML and Plain Text emails, and can utilize **Views** as email bodies.

The Email module is a wrapper around the **node-email** node modulea available at https://github.com/aheckmann/node-email


Changing the Sender
===================

To change the displayed sender for your app, modify the ``email.sendFrom`` variable in ``config/environment.js``.


Future Plans
============

Plans for a more advanced email system are underway for version `1.1` of P. These plans include custom SMTP transport,
and enhancements to HTML/Plain Text view emails, as well as integration into a possible Account Permission System.


Method Definitions
==================

P.email(to, subject, message, [options], [callback])
   Sends an email with a specified subject and message to the specified sender.

   **@param**				``string`` to - The recipient email address

   **@param**				``string`` subject - The message subject

   **@param**				``string`` message - The body of the message

   **@param**				``object`` [options] - An optional key-value pair which can specify more options. See **node-email** for a complete list of options

   **@param**				``function`` [callback] - An optional callback which will be triggered when the email is done sending (along with any errors)

   **@return**				None.

----------------------------------------------------------------

P.emailView(to, subject, view_name, [options], [callback])
   Sends an HTML email to the specified sender with the rendered contents of the view.

   **@param**				``string`` to - The recipient email address

   **@param**				``string`` subject - The message subject

   **@param**				``string`` view_name - The view to use for the message body

   **@param**				``object`` [options] - An optional key-value pair which can **both options for the view, and node-email options**

   **@param**				``function`` [callback] - An optional callback which will be triggered when the email is done sending (along with any errors)

   **@return**				None.   


.. note:: As of now, there is no way to send Plain-Text view emails. You could, as a workaround, use the ``P.email`` function, and manually render the view with ``P.snippet``.