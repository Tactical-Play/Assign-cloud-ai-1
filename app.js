var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var http = require('http');
const qs = require('querystring');
const formidable = require('formidable');
const url = require('url');
var add = 'mongodb://maharathidb:91pkTnOTqbDN9PfRWvuniB2LSvvmP40KBt1EyudX5HGQHevebKagAMyLaXJAvUQeCZplctQSMH3hAsj5aNzC1Q==@maharathidb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@maharathidb@';
/* example db entry
{
        "player_id": "abcd01",
        "name":"Marco Verrati"
        "position": "central-midfielder",
       "phone":[{"mobile":"9845676534"},{"mobile":"8297164567"}]
    }
    */
var insertDocument = function(db,query, callback) {
    db.collection('emp').insertOne( query, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the families collection.");
        callback();
    });
};
const projection = { "_id": 0 };
async function findDocument(db,query,res, callback) {
    await db.collection('emp').find(query,projection)
    .toArray()
    .then(items => {
        console.log(`Successfully found ${items.length} documents.`)
        for(i of items){
        console.log(i);
        res.write(JSON.stringify(i));
    }
    return items;
    }).catch(err => console.error(`Failed to find documents: ${err}`));
    callback();
};

var removeDocument = function(db,query, callback) {
db.collection('emp').deleteMany(
    query,
    function(err, results) {
        console.log(results);
        callback();
    });
};


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });


var record={};
var askq = function(callback){
  readline.question(`Enter id`, id => {
    readline.question(`Enter name`, name =>{
        readline.question(`Enter position`, pos=>{
            readline.question(`Enter mobile1`, mob_1=>{
                readline.question(`Enter mobile2`, mob_2=>{
                    console.log(id,name,pos,mob_1,mob_2);
                    record = {"player_id":id,"name":name,"position":pos,"phone":[{"mobile":mob_1},{"mobile":mob_2}]};
                    readline.close();
                    callback();
                });
            });
        });
    });
  });
}

MongoClient.connect(add, function(err, client) {
    assert.equal(null, err);
    var db = client.db('empdb');
    readline.question(`Enter 1 to insert, 2 to search: `,res=>
    {
        if(res.trim()=='1')
        {
                askq(function(){
                insertDocument(db,record,function(){
                    client.close();
                    });
                });
        }
        else if(res.trim()=='2')
        {
            
            http.createServer(function (req, res) {
                if (req.method === 'GET' && req.url.startsWith('/inp_accepted')) {
                    console.log("boohoo");
                    var temp = url.parse(req.url,true);
                    //console.log(temp.query['input']);
                    var fq=temp.query['input'];
                    var arr = findDocument(db, JSON.parse(fq),res,function(){
                        client.close();
                    });
                    //for(i of arr){
                        //res.write(JSON.stringify(arr));
                    //}
                    return res.end();
                }
                   else{
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<body><form action = "inp_accepted" method="get">');
                res.write('<p>Enter query : </p>');
                res.write('<textarea name ="input" id="inp" type="text"></textarea><br>');
                res.write('<input type="submit">');
                res.write('</form></body>');
                return res.end();
              }
            }).listen(8080);
        }
        else{
            console.log('invalid input');
            client.close();
        }
    });
});
