
const fs = require('fs')

const readPpGeojson = (filename) => {
    const data = fs.readFileSync(filename, 'utf8');
    
    const buf1 = filename.replace('.txt','');
    const chizuscale= buf1.replace('./zu/t', ''); // 応急処置
    console.log(buf1);
    
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
           "type":"Point",
           "coordinates":[
             ( +f.box.lt.lng*1 + f.box.lb.lng*1 + f.box.rb.lng*1 + f.box.rt.lng*1)/4,
             ( +f.box.lt.lat*1 + f.box.lb.lat*1 + f.box.rb.lat*1 + f.box.rt.lat*1)/4
           ]
        },
        "properties":{
          "Name": f.name,
          "figureNameId": f.figureNameId,
          "scale": +chizuscale
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


