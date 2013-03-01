.. sidebar:: Module Information

   :Implemented In:
      ``modules/String.js``
      
   :Depends On:
      Core

String Module
*************

About the Strings Module
========================

The strings module implements the ability to have pre-defined strings,
which can be localized. This is to allow you to completely outsource
any application UX copy from your controller, for proper MVC design
standards.

Strings are stored as ``.string`` files in the ``app/strings`` directory.
For more information, see the **Localization** and **Strings** guides.

.. note:: Strings are pre-loaded when the user connects, to prevent I/O thrashing.

Method Definitions
==================

P.string(string)
   Returns the string specified.
   
   **@param**			``string`` The string you wish to use.
   
   **@return**			``string`` The value of the specified string file.
   
   **@shorthand**		``P.str(string)``
