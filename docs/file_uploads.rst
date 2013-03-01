Uploading Files With P
**********************

1. Create the upload form
=========================

.. code-block:: html

   <form p:action="upload.submit">
       <input type="file" name="file" />
       <input type="submit" value="Upload" />
   </form>


2. Handle the Upload in a controller
====================================

**Upload Controller:**


.. code-block:: javascript

   module.exports = function(P) {
       this.submit = function(formData) {
           var fileName = formData.file[0].name;
           var dataURL  = formData.file[0].contents;

           // parse the data URL
           var buff     = P.parseDataURL(dataURL);

           // write the file
           require("fs").writeFileSync(fileName, buff);
       });
   });

When the form is submitted, the files to be uploaded are compressed into **Data URLs**.
When the data arrives at the server, we then need to de-compress it. P provides a helper
function, which converts a data URL to a ``Buffer``. Finally, we can write it to the
server's file system.