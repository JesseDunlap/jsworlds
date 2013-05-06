@milo-title:P Documentation
@milo-description:
@milo-keywords:index
@milo-codefile:pages/index.md
@milo-language:javascript

# P Documentation

Welcome to the P Documentation site. Here, you can learn all about the P Framework, how it
works, best practices, etc. For more information about the P Framework, go to
[thepframework.com](http://thepframework.com/)

### Useful Development Links

* [P on GitHub](https://github.com/hydrais/p-framework/)
* [Known Issues](https://github.com/hydrais/p-framework/issues?labels=bug&milestone=&page=1&state=open)
* [Development Blog](http://blog.thepframework.com/?cat=3)

## Obtaining P

To install the latest version of P, you will need [Node JS](http://nodejs.org) and **NPM**.
Run the following command to install the P Framework:

    sudo npm install -g p-framework             # Latest Release
    sudo npm install -g p-framework@1.0.0       # Stable Release
	
Then, run the following commands to get started:

	p engage /path/to/your/project		# Create your working environment
	cd /path/to/your/project			# Move to your work directory
	npm start							# Start the P server
	
Out of the box, you can point your browser to `http://127.0.0.1:8888` to see your
newly functioning P application.

![P Framework 1.1b](/assets/img/screenshot1.png "P Framework version 1.1b, running in the browser.")


## Learn P

### Tutorials
Get an idea of what P is capable of:

* [Showcase Tutorial](http://thepframework.com/#tutorial)

### The MVC
The best place to start learning about P is by reading the **MVC** docs in order:

* [Controllers](/MVC/Controllers.html)
* [Views](/MVC/Views.html)
* [Models](/MVC/Models.html)

### Modules
P is organized into a system of **Modules**. Here, you can learn all about them:

**MVC**

* [Controller](#)
* [Views](#)
* [Element](#)
* [DataSource](#)

**Templating Engines**

* [Jade](#)
* [EJS](#)
* [Mustache](#)

**Application Utilities**

* [AppBridge](#)
* [ClientSync](#)
* [Helpers](#)

**Sessions & Security**

* [Accounts](#)
* [Session](#)

### Advanced Topics

* [Creating Custom Modules](#)
* [Connecting to P with C#](#)
* [Designing a P Client (In a language other than JavaScript)](#)