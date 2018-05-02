const grpc = require('grpc');
const util = require('util');

module.exports = {
  //console.log(util.inspect(call, {depth: null}));
  streamPackets: function(client,callback, statuscb){
      const call = client.streamPackets();
      console.log("stream requested");
      call.on('error', function(error){
        console.error(error)
      });
      //call.on('cancelled',connectionStatusCallback);
      call.on('status', function(status){
        let statusCode = 0;
        if(status === undefined){

        }else{
          switch (status.code){
            case 14:
              statusCode = 0;
              break;
            default:
          }
        }
        statuscb(statusCode);
      });
      call.on('data',callback);
      return call;
  },
  sendCommand: function(client, node, type, data0, data1, data2, data3){
    let command = {
      Node: node,
      PacketType: type,
      Data: [data0, data1, data2, data3]
    };

    for (let idx = 0; idx < command.Data.length; idx++){
      if (command.Data[idx] === undefined){
        command.Data[idx] = 0;
      }
    }
    try{
      const call = client.sendCommand(command, function (err,response){
        if(err){
          console.log("ERROR CALLBACK:");
        }else{

          console.log("command succesfuly sent");
        }
      });
    }catch(err){
      console.error("CATCH ERROR: " + err);
    }

    /*call.on('error', function(error){
      console.error(error);
    })*/
  },

  sendControl: function (client,data) {
    try{
      const call = client.controlServer({Command:data},function (err,response) {
        if(err){
          console.log("ERROR CONTROL SERVER" + err);
        }
      })
    }catch (err){

    }
  },

  sendPySimControl: function (client,data) {
    try{
      console.log("sending py sim command: " + data);
      const call = client.sendSimCommand({Command:data},function (err,response) {
        if(err){
          console.log("ERROR CONTROL SIM" + err);
        }
      })
    }catch (err){

    }
  },

  ping: function(client,callback){
    try{
      const call = client.ping({}, function (err,response){
        if(err){
          console.log("ERROR PING");
          callback(null);
        }else{
          callback(response['Status']);
        }
      });
    }catch(err){
      console.error("CATCH ERROR: " + err);
    }
  }
};
