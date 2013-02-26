.. sidebar:: Module Information

   :Implemented In:
      ``modules/Element.js``
      
   :Depends On:
      Core, View

Element Module
**************

About the Element Module
========================

The Element module provides the ability to communicate, manipulate, and 
handle events for on-screen elements. The Element API has been designed
to match the **jQuery** API as much as possible.

The basis of the Element API is the ``P.$`` function, which works much
like the ``jQuery`` or ``$`` function in the jQuery library.

.. note:: jQuery-style method chaining is not currently supported, but is planned in a future release of P.


Method Definitions
==================

.. note::

   A complete list of methods has not been provided. For reference, 
   please see the jQuery method reference. Instead, the unique or
   important methods in the Element module have been highlighted.
   

P.$(selector)
   Creates a new ``Element`` object, which acts upon the specified
   selector.
   
   **@param**				``string`` selector - A jQuery selector. Literally any jQuery selector will work, as it directly maps to the ``jQuery`` function.
   
   **@return**				``Element`` An element corresponding to the specified selector.
   
-----------------------------------------------

``string`` Element.selector
   A string representation of the Element's selector.

-----------------------------------------------

Element.$(selector)
   Returns a new element which is mapped to the specified selector inside
   the parent element.
   
   **@param**				``string`` selector - The child jQuery selector
   
   **@return**				``Element`` A child element inside of the parent element, matching the specified selector.
   

**Example:** Selecting a child element.

.. code-block:: javascript

   var parent = P.$('#parent');
   
   console.log(parent.selector);    // "#parent"
   
   var child  = parent.$('#child');
   
   console.log(child.selector);     // "#parent > #child"
   
--------------------------------------------------

Element.render(view, options)
   Renders a view inside of the element.
   
   **@param**				``string`` view - The name of the view you wish to render.
   
   **@param**				``object`` options - Key-value pair, which will be passed to the view.
   
   **@return**				None.
   
--------------------------------------------------

Element.jq(method, args)
   Allows you to manually call a jQuery function on the element, with arguments.
   
   **@param**				``string`` method - The jQuery method you want to call.
   
   **@param**				``list`` args - A list of arguments, which will be mapped to the jQuery function.
   
   **@return**				None.
   
   
**Example:** Calling a custom jQuery function.

.. code-block:: javascript

   var element = P.$('#element');
   
   element.jq("myCustomFunction", ["arg1", "arg2", "arg3"]);
   // This is the equivalent of: $('#element').myCustomFunction("arg1", "arg2", "arg3");
   
 

