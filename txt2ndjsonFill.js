
const fs = require('fs')

const readPpGeojson = (filename) => {
    const data = fs.readFileSync(filename, 'utf8');
    
    if(!data){
      console.log("Error:", filename);
      return;
    }
    
    // BOMを無視する https://webbibouroku.com/Blog/Article/node-bom-utf8
    if (data.charCodeAt(0) === 0xFEFF) {
      json = data.substr(1);
    }else{
      json = data;
    }
    
    const zulist = JSON.parse(json);
    
    zulist.forEach( f => {
      
      const filepath = "./dst/zu.ndjson";
      
      //書き出し
      const ff = {
        "type":"Feature",
        "geometry":{
           "type":"Polygon",
           "coordinates":[
             [f.box.lt.lng, f.box.lt.lat],
             [f.box.lb.lng, f.box.lb.lat],
             [f.box.rb.lng, f.box.rb.lat],
             [f.box.rt.lng, f.box.rt.lat],
             [f.box.lt.lng, f.box.lt.lat]
           ]
        },
        "properties":{
          "ID":f.name,
          "figureNameId":f.figureNameId
        }
      };
      
      const s = JSON.stringify(ff) + "\n";
      
      try{
        fs.appendFileSync(filepath , s);
      }catch(err){
        console.log(err);
      }
      
    });
} 


const dir = 'zu';
fs.readdir(dir, (err, files) => {
  if (err) throw err;
  
  files.forEach( file => {
    const filepath = './' + dir + '/' + file;
    console.log(filepath);
    readPpGeojson(filepath);
  });

});


