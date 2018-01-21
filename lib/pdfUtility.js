const child_process = require('child_process');
const pdfManipulation = {};
const QUALITY = ['screen', 'ebook', 'printer', 'prepress', 'default'];
module.exports = pdfManipulation;

setQuality = (quality) => {
    if (!quality) return QUALITY[4];
    if (QUALITY.indexOf(quality) == -1) throw Error(`Quality can contain ${QUALITY}`);
    return quality;
}

pdfManipulation.compressPdf = (pdfPath, targetPath, quality) => {
    let setQuality = (QUALITY.indexOf(quality) !== -1) ? quality : 'default';
    let compressCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${setQuality} -dDownsampleColorImages=true -dColorImageResolution=150 -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${targetPath} ${pdfPath}`;
    return new Promise((resolve, reject) => {
        child_process.exec(compressCommand, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            } else {
                resolve('Operation Done');
            }
        })
    })
}


pdfManipulation.splitPdf = (pdfPath, targetPath) => {
    let splitCommand = `qpdf ${pdfPath} ${targetPath} --split-pages`;
    return new Promise((resolve, reject) => {
        child_process.exec(splitCommand, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            } else {
                resolve('Operation Done');
            }
        });
    })

}

pdfManipulation.genrateImage = (pdfPath, targetPath, conversionType) => {
    let page = 0;
    let pdfDetail = {};
    if(conversionType && conversionType!='thumb') throw Error(`conversionType can contain thumb value only`);
    return new Promise((resolve, reject) => {
        pdfManipulation.countPages(pdfPath)
            .then((pdfLength) => {
                pdfDetail.pdfPath = pdfPath;
                pdfDetail.targetPath = targetPath;
                pdfDetail.pdfLength = pdfLength;
                pdfDetail.conversionType = conversionType;
                imageProcess(page, pdfDetail, resolve, reject);
            })
            .catch((err) => {
                reject(err);
            })

    })
}

imageProcess = (page, pdfDetail, resolve, reject) => {
    let imageCommand = `vips pdfload ${pdfDetail.pdfPath} --dpi 300 --scale 2 --page ${page} ${pdfDetail.targetPath}${page}.jpg[Q=70]`
    let tumbnailCommand = `vipsthumbnail ${pdfDetail.pdfPath}[page=${page}] -o ${pdfDetail.targetPath}_${page}.jpg[Q=100]`;
    let conversionComaand = pdfDetail.conversionType ? tumbnailCommand : imageCommand;
    child_process.exec(conversionComaand, function (err, stdout, stderr) {
        if (err) {
            reject(err);
        } else {
            if (page < pdfDetail.pdfLength - 1) {
                page++
                imageProcess(page, pdfDetail, resolve, reject);
            } else {
                resolve('Operation Done');
            }
        }
    });
}

pdfManipulation.countPages = (pdfName) => {
    let countCommand = `qpdf ${pdfName} --show-npages`;
    return new Promise((resolve, reject) => {
        child_process.exec(countCommand, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                resolve(+stdout);
            }

        })
    })
}