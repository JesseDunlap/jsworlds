Localization
************

P supports localization, allowing you to re-use most of your code across different
languages. By simply changing a variable in the `config/environment.js` file, you
can switch your app to different languages.

Changing Localization
=====================

To change your localization, modify the ``localization`` variable in ``config/environment.js``.


Localizing Views and Strings
============================

Views and Strings are stored in subdirectories corresponding to their localization. By default,
P uses the ``en`` localization, for English. Your views and strings are put in an ``en``
subdirectory inside either the ``app/views`` or ``app/strings`` directories.

Localizing views and strings is as simple as creating different views and strings in
different languages, and putting them in subdirectories corresponding to different
localizations.