Connecting to Multiple P App Servers at the Same Time
*****************************************************

.. warning::

   The content in this article is highly theoretical and experimental. As of now, multiple
   P connections is not a supported aspect of P, however it is something we will be looking
   into in the near future.


Connecting to Multiple Apps
===========================

The usual, single connection to the locally running P application server happens in ``index.html``:

.. code-block:: javascript

   window.onload = function() {
       p = new P($('body'), 'p');
       p.connect({ host: "127.0.0.1", port: 8080 });
   };


The first line creates a new ``P`` instance, and assigns it to the global variable ``p``. The first parameter
specifies the **container** of the P application. It is possible to confine a P application to any jQuery element,
and any reference in your app to the **body** will automatically be changed to that container.

The second parameter in the ``P`` initializer is the **variable**. When you use ``P.`` in any of your views, it
will be replaced with the variable you specify here. This variable should match the global variable you are
assigning the P instance to.

After we have initialized the P object, we connect to the locally running server.

In theory, connecting to multiple apps would look something like this:

.. code-block:: javascript

   window.onload = function() {
       p1 = new P($('#leftPane'), 'p1');
       p1.connect({ host: "server1.domain.com", port: 8080 });

       p2 = new P($('#rightPane'), 'p2');
       p2.connect({ host: "server2.domain.com", port: 8080 });
   };

It is assumed that in the ``body`` of the page, there would be two divs: ``#leftPane`` and ``#rightPane``.


Communicating Between Apps
==========================

While the code demonstrated above works flawlessly, albeit being a bit strange, communication between P
applications is a gray area. At this time, there is no good way to communicate between two apps running
on the same page. Some theories have been written out below...


Directly Accessing the "True" P Variable
----------------------------------------

In our example above, we use ``p1`` to correspond to the first application, and ``p2`` to correspond to
the second application. If the first application were to reference ``p2`` in it's views, and trigger
controller actions using ``p2.controller``, the apps would be able to at the very least trigger controller
actions, which could provide a decent level of communication between them.

Unfortunately, hard-coding variable is not a good practice, since the variables could change. To remedy this,
you could have two expected ``div`` elements on the page, which contain the appropriate variables, so that
the applications can access and use them.


Communicating via Socket.IO
---------------------------

Recently, I discovered that there is a Node socket.io **client**, which allows you to communicate with
socket.io **servers** in Node. We could theoretically write a communication layer, which would emulate
a client connection to another app, and trigger controller methods on it through some sort of bridge.


Why Multiple Connections?
=========================

It is imagined that in future iterations of P, developers will be able to outsource entire portions of their
application as advanced APIs. 

For instance, a photo sharing P application could allow some other P application
to connect to their app, and request photos. Instead of the photo sharing application just sending back JSON
containing photo information, the app could actually open it's own interface on the user's screen, and allow
the user to choose photos in a familiar environment. Those photos could then directly be sent to the external
application for use.

Having advanced "APIs" such as this would be a lot like Windows 8's new **sharing** feature, which allows other
apps to provide data in a familiar experience to the user. We believe it would truly revolutionize the way apps
communicate with each other.