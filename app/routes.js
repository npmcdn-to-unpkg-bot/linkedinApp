var SSE = require('sse-nodejs');
 var x=0;


module.exports = function (app) {
app.get('/time', function (req,res) {
    var serverSent = SSE(res);
x++;
    serverSent.sendEvent('time', function () {
        
        return (x)
    },0);
    serverSent.disconnect(function () {
        console.log("disconnected");
    })
 
    serverSent.removeEvent('time',2000);
 
});
    // api ---------------------------------------------------------------------
    // get all todos
    
    app.post('/postsearch', function (req, res) {
        var searchTools = require('./testing.js');
var rest = JSON.stringify(req.body);
console.log(rest);
var searchResponce = 'haha';
 searchTools.searching(req.body, function (error, result) {
    res.send(result);  
 });

//setTimeout(function(){ console.log("the search responce is : "+searchResponce); }, 500);
    
});

    app.post('/post', function (req, res) {
var tools = require('./app4.js');
    console.log(req.body);
   tools.searchProfile(req.body.linkedInAccount,req.body.linkedInpassword);
   
   
   
  
});
    app.post('/post2', function (req, res) {

    console.log(req.body);
   
   var mongoEx = require('./expandNetwork.js');
    
   
  
});
    app.post('/someURL', function (req, res) {

    
   res.send("mongoEx");
   
  
});
    // create todo and send back all todos after creation
   
    
  

    // application -------------------------------------------------------------
    // app.get('*', function (req, res) {
    //     res.sendFile(__dirname + '/public/index.html');
    //     console.log("haaaaaa"); // load the single view file (angular will handle the page changes on the front-end)
    // });
     app.get('*', function (req, res) {
        console.log("the path is " +__dirname );
        res.sendFile('/home/mahmoud/Desktop/node-todo-master' + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
