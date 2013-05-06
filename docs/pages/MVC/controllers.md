@milo-title:Controllers
@milo-description:Controllers
@milo-keywords:controllers
@milo-codefile:../modules/Controller.js
@milo-language:javascript

# Controllers

## About Controllers

**Controllers** contain the main logic code for your app. In a traditional
Model, View, Controller (MVC) architecture, Controllers act as the "glue"
between **Views** and **Models**.

### Actions

P Controllers have **Actions** which are methods that can be called by a
View as well as other Controllers. An example action might be
`buttonClicked`, which is triggered when the user clicks a button.

    var SomeController = function() {
	
	};
	
	SomeController.prototype.buttonClicked = function() {
		console.log("The button was clicked!");
	};
	
	module.exports = buttonClicked;
	

The `buttonClicked` action could be triggered either in a view:

    <a p:link="SomeController.buttonClicked">Click Me!</a>

Or through another controller:

    var SomeOtherController = function() {
	
    };

	SomeOtherController.prototype.someAction = function() {
		this.P.controller("SomeController").buttonClicked();
	};
	
You can limit the accessibility of an action by adding attributes to it:

	SomeController.prototype.buttonClicked = function() {
		console.log("The button was clicked!");
	};
	
	// Allow views to call the action
	SomeController.prototype.viewAccessible       = true;  
	
	// But don't allow controllers to call the action
	SomeController.prototype.controllerAccessible = false;
	
Actions can also accept data parameters:

	SomeController.prototype.buttonClicked = function(data) {
		console.log("The button was clicked with this data:" + data);
	};
	
Data can be passed in views:

	<a p:link="SomeController.buttonClicked.'Hello World'">Click Me</a>

Or in controllers:

	SomeOtherController.prototype.someAction = function() {
		this.P.controller("SomeController").buttonClicked("Hello World");
	};
	
You can also quickly serialize form data and send it to an action:

	<form p:action="SomeController.formSubmitted">
		<p>First Name:</p>
		<input type="text" name="firstName" />
		
		<p>Last Name:</p>
		<input type="text" name="lastName" />
		
		<input type="submit" value="Submit" />
	</form>
	

To access the data:

	SomeController.prototype.formSubmitted = function(data) {
		console.log("First Name: " + data.firstName);
		console.log("Last Name:  " + data.lastName);
	};
	

### Special Actions

#### beforeFilter()
Called when the controller is loaded, before the targeted action is triggered.

### App Controller

The App Controller, which resides in `controllers/app.js` is a special, required
controller, which handles various app-centric events. The app controller implements
these special actions:

#### onLoad(callback)
**REQUIRED**

Called when the user connects to the application. This is where you initialize any plugins
or modules, such as the **Account Module**. Once finished, you must trigger `callback()`.
Failure to do so will prevent your app from loading.

#### onExit(callback)
**REQUIRED**

Called when the user disconnects from the app (e.g. closes the browser). Here, you can do
any necessary background saving or after-processing. All database connections are kept alive
until you trigger `callback()`. Failure to trigger the callback will result in memory leaks.

#### beforeFilter()
Called when any controller is loaded, prior to triggering that controller's targeted action.

### Controller Caching

When you load a controller, whether it be through a view-based action call, or through
the ``P.controller`` function, the controller is cached. Future attempts to load the same
controller will return the cached copy of the controller. There are, however, a few things
to keep in mind:

* **Controllers are cached on a per-user basis.**
Users do not share the same cached controllers.
* **P will automatically reload the controller if the controller file changes.**
The old cached version will be deleted, and a new one will be created.
* **You can use caching to your advantage to store state data**.
Use the ``this`` keyword to store state data in the controller. _Remember_: State data
will be deleted if the cache needs to be rebuilt.