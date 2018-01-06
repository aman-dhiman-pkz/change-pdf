const child_process = require('child_process');
const pdfManipulation = {};
module.exports = pdfManipulation;

pdfManipulation.compressPdf = (pdfPath,targetPath)=> {
    let compressCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/prepress -dDownsampleColorImages=true -dColorImageResolution=150 -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${targetPath} ${pdfPath}`;
    return new Promise((resolve,reject)=>{
        child_process.exec(compressCommand, function(err, stdout, stderr) {
            if (err) {
                reject(err);
            } else {
                resolve('Operation Done');
            }
        })
    })
}



pdfManipulation.splitPdf=(pdfPath,targetPath)=> {
    let splitCommand =  `qpdf ${pdfPath} ${targetPath} --split-pages`;
    return new Promise((resolve,reject)=>{
        child_process.exec(splitCommand, function(err, stdout, stderr) {
            if (err) {
               reject(err);
            } else {
               resolve('Operation Done');
            }
        });
    })
        
}

pdfManipulation.genrateTumbImage=(pdfPath,targetPath,conversionType)=> {
    let page = 0;
    let pdfDetail = {};
    return new Promise((resolve,reject)=>{
        pdfManipulation.countPages(pdfPath)
        .then((pdfLength)=>{
            pdfDetail.pdfPath = pdfPath;
            pdfDetail.targetPath = targetPath;
            pdfDetail.pdfLength = pdfLength;
            pdfDetail.conversionType = conversionType;
            thumbnailProcess(page,pdfDetail,resolve,reject);
        })
        .catch((err)=>{
            reject(err);
        })
        
    })
}

thumbnailProcess =(page,pdfDetail,resolve,reject)=>{
    let imageCommand = `vips pdfload ${pdfDetail.pdfPath} --dpi 300 --scale 2 --page ${page} ${pdfDetail.targetPath}${page}.jpg[Q=70]`
    let tumbnailCommand = `vipsthumbnail ${pdfDetail.pdfPath}[page=${page}] -o ${pdfDetail.targetPath}_${page}.jpg[Q=100]`;
    let conversionComaand = pdfDetail.conversionType==='image'? imageCommand : tumbnailCommand;
    child_process.exec(conversionComaand, function(err, stdout, stderr) {
        if (err) {
            reject(err);
        } else {
            if (page < pdfDetail.pdfLength-1) {
                page++
                thumbnailProcess(page,pdfDetail,resolve,reject);
                console.log(`${page} thumb converted`);
            } else {
                resolve('Operation Done');
                //console.log(page,new Date(), '------------conversionToThumbnails complete--------------');
            }
        }
    });
}

pdfManipulation.countPages = (pdfName)=>{
    let countCommand = `qpdf ${pdfName} --show-npages`;
    return new Promise((resolve,reject)=>{
        child_process.exec(countCommand,function(err,stdout,stderr){
            if(err){
                reject(err);
            }
            else{
                resolve(+stdout);
            }
            
        })
    })
}