const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();

let  filenames =  'filenames.txt';


const fileStorageEngine = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null , './img')
    },
    filename: (req , file , cb)=>{
        
        cb(null ,file.originalname)
    }
});

const upload = multer({storage: fileStorageEngine})
app.use(express.static('img'))

app.get('/index',(req , res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

 
app.post('/single', upload.single('image') , (req , res) => {


    console.log(req.file , "    FROM SINGLE UPLOAD API");
    res.send("single upload sexus");
} )


app.post('/multiple' , upload.array('images' ,  1000) , (req , res)=>{

    console.log(req.files);
})

app.get('/indexpublic',(req , res)=>{
    res.sendFile(path.join(__dirname, 'public/publicupload.html'))
})

app.post('/publicmultiple' , upload.array('images' , 1000) , (req , res)=>{

    console.log(req.files);

     const directoryPath = path.join(__dirname, 'img');
    fs.readdir(directoryPath , function (err , files){
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        console.log(files)
            // Do whatever you want to do with the file
            // console.log(file); 

            
           let  appendable = files + "\r\n"

            fs.writeFile('public/filenames.txt', appendable, err => {
                console.log("WROTE " + appendable )
                if (err) {
                  console.error(err)
                  return
                }
                //file written successfully
              })
           
        
    } ) 
    res.send("http://localhost:5000/"+req.files[0].filename)

})



app.get('/allfiles' , (req , res)=>{

   

    res.sendFile(path.join(__dirname, 'public/filenames.txt'))


})
app.listen(5000);