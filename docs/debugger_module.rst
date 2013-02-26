.. sidebar:: Module Information

   :Implemented In:
      ``modules/Debugger.js``
      
   :Depends On:
      Core

Debugger Module
***************

About the Debugger Module
=========================

Currently, the Debugger module is just a wrapper for a more feature-rich
debugging system in the near future. The eventual goal of the debugger
system and module is to have a more robust logger, which can be configured
to display certain kinds of messages, send notifications when critical
errors occur, log to databases or files, and more.

As of now, nothing, besides coloring of different message types in the
console is implemented, however it is still suggested that your app use
the Debugger module, since the API of the module will not change very much.


Method Definitions
==================

P.log.error(message)
   Logs a critical error. This method should be used in the event
   that something has occured that will prevent complete operation
   of a feature.
   
   **@param**				``string`` message - A description of what has happened to cause this error, and steps that can be taken to remedy it.
   
   **@return**				None.
   
------------------------------------------------

P.log.warning(message)
   Logs a warning message. This method should be used in the event
   that something that is sub-nominal has occured. Warnings should be
   issued when performance or optimal behavior of a component will be
   affected.
   
   **@param**				``string`` message - A description of what has happened to cause the warning, and steps to remedy it (if applicable).
   

------------------------------------------------

P.log.notice(message)
   Logs an informational notice. This method should be used simply to
   keep the developer informed on what is happening in the system. Notices
   should report status changes, and expected activity.
   
   **@param**				``string`` message - An informational message.
