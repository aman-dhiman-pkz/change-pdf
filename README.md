change-pdf :

A node.js library to perform several operations on PDF file like Compress, Split, Count pages, Convert into images or thumbnails by using different tools those are best in terms of performance and memory utilization. 

MUST : IT MUST REQUIRES SOFTWARES 
1.qpdf 
    Reference link - http://qpdf.sourceforge.net/

2.libvips with poppler supoort
    Reference link - https://github.com/jcupitt/libvips

3.ghostscript
    Reference link - https://www.ghostscript.com/


Installation :

npm install --save change-pdf


Usage :

It contains following functions to perform above described tasks : 

1-  compressPdf : This function compress given pdf file, save compressed pdf file to target path and returns promise. It takes two parameters first- pdf file path, second- target file path and one optional parameter.

example :

var changePdf = require("change-pdf");

changePdf.compressPdf(pdfPath, targetPath, quality)

function parameters :

* pdfPath : Path of pdf file (Required)
* targetPath : Path where you want to save compressed pdf file (Required)
* quality: value of compressed pdf quality. it can only contain:(optional)
            
             'screen': selects low-resolution output similar to the Acrobat Distiller "Screen            Optimized" setting.,
             'ebook':  selects medium-resolution output similar to the Acrobat Distiller                 "eBook" setting,
             'printer':selects output similar to the Acrobat Distiller "Print Optimized"                  setting,
             'prepress':selects output similar to Acrobat Distiller "Prepress Optimized"                  setting,
             'default': selects output intended to be useful across a wide variety of uses,               possibly at the expense of a larger output file
             
            if no value is provided then value will be 'default'

2-  splitPdf : This function splits given pdf file into different single page pdf files, save those pdf files to target path and returns promise. It takes two parameters first- pdf file path, second- target file path. 

example :

var changePdf = require("change-pdf");

changePdf.splitPdf(pdfPath, targetPath)

function parameters :

* pdfPath : Path of pdf file.
* targetPath : Path where you want to save splitted pdf files.

3-  genrateImage : This function converts given pdf file to different images and save it to target path and returns promise. It takes three parameters first- pdf file path, second- target file path and third optional parameter conversionType with the value "thumb" to generate thumbnails.

Note : if no value provided in third param then it makes image by default if thumb is provided then thumbnails will be generated.

example :

var changePdf = require("change-pdf");

changePdf.genrateTumbImage(pdfPath, targetPath, conversionType)

function parameters :

* pdfPath : Path of pdf file.
* targetPath : Path where you want to save compressed pdf file.
* conversionType : "thumb" to make thumbnail sized image of pdf.(Optional)

4-  countPages : This function is used to find total number of pages in pdf file and returns number. It takes pdf file path as a parameter. 

example :

var changePdf = require("change-pdf");

changePdf.countPages(pdfPath)

function parameters :

* pdfPath : Path of pdf file.