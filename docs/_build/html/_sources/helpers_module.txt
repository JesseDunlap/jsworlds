.. sidebar:: Module Information

   :Implemented In:
      ``modules/Helpers.js``
      
   :Depends On:
      Core

Helpers Module
**************

About the Helpers Module
========================

The Helpers module implements various utility functions, which do not fit into
a single Component category.


Method Definitions
==================

``object`` P.globe
   Convenient access to the P temporary global object, which persists across the entire server.
   
-----------------------------------------------

P.title(title)
   Sets the title of the client's web browser.
   
   **@param**				``string`` title - The title you want the page to have.
   
   **@return**				None;
   
-----------------------------------------------

P.lib(library)
   Loads a library from the ``lib`` directory. For more information, see the **Libraries** guide.
   
   **@param**				``string`` library - The path, relative to the ``lib`` directory, to the desired library.
   
   **@return**				``function`` Returns an initialized instance of the library.
   
-----------------------------------------------

P.parseDataURL(dataURL)
   Takes a data URL and converts it to a Node ``Buffer`` object.
   
   **@param**				``string`` dataURL - The data URL to convert
   
   **@return**				``Buffer`` A buffer, containing the decoded data.
   
   **@shorthand**			``P.pdu(dataURL)``
