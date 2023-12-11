const path = require('path')
const fs = require('fs')

exports.uploadFile = (req, res) => {
    // console.log("body",req.files);

    const folderPaths = [];

    // Move each uploaded file to the final destination
    req.files.forEach(file => {
        const tempPath = file.path;
        const finalDestination = path.join('public/uploads', file.filename);

        console.log("final", finalDestination);

        // fs.renameSync(tempPath, finalDestination);

        // const folderPath = path.join('uploads', file.filename);
        // folderPaths.push(folderPath);
    });

    // console.log('Folder paths for database:', folderPaths);

    res.json({ message: 'File uploaded successfully!' });
};

