About Milo
----------

Milo is a highly extensible, Markdown-based documentation generation platform. Milo allows you to write elegant
documentation of your programming project in Markdown, and then with a simple command, compiles it to a static,
HTML website.

CodeView
--------

Milo makes your code come to life in your documentation. Through the use of ``@milo`` tags, you can make your code,
displayed elegantly alongside your docs, jump to life as the user scrolls through the page. Is your project
closed source? No problem! Just don't provide a source file, and Milo will transform into no-code mode to look
nice as a pure-documentation page.

Plugins
-------

Milo is plugin based. The Milo parser looks at ``@milo`` tags in your Markdown source, and can change the entire
generator's behavior based on them. Plugins can do almost anything!

Cross-Platform
--------------

Milo generates in a static, self contained HTML package which can be published to any web server for viewing.
Compiling documentation is also easy. Simply download Node.js on your publishing platform and run:
```
node index.js
```
