const net = require('net');
const socket = net.createConnection({port: 2004, host: '192.168.0.120' });

socket.on('connect', () => {
  var temp = reqData('%DW10000');//Buffer.from([0x54,0x00,0x02,0x00,0x00,0x00,0x01,0x00,0x04,0x00,0x25,0x4D,0x57,0x30]);
  var header = companyHeader(temp);
  var total_length = temp.length+header.length;
  var data = Buffer.concat([header,temp],total_length);
  socket.write(data);
});
socket.on('data', serverData => { // 6. receive data from server
  console.log(`[client] received data from server: ${serverData}`);
  console.log(Buffer.from(serverData));
  socket.destroy();
});
var companyHeader = function(dataFrame){
  var company_id = Buffer.from('LSIS-XGT');
  var reserved1 = Buffer.from([0x00,0x00]);
  var plc_info = Buffer.from([0x00,0x00]);  
  var cpu_info = Buffer.from([0xB0]);   
  var frame_dir = Buffer.from([0x33]);      //0x33(client->PLC-server), 0x11(PLC-server->client)
  var InvokeID = Buffer.from([0x00,0x00]);
  var data_length = Buffer.from([dataFrame.length,0x00]);
  var enetPos = Buffer.from([0x01]);
  var reserved2 = Buffer.from([0x00]);
  var total_length = company_id.length+reserved1.length+plc_info.length+cpu_info.length+
                    frame_dir.length+InvokeID.length+data_length.length+reserved2.length+
                    enetPos.length;
  var data =  Buffer.concat([company_id,reserved1,plc_info,cpu_info,frame_dir,
                               InvokeID,data_length,reserved2,enetPos],total_length);
  console.log(data);                               
  return data;                               
}
var reqData = function(address){
  var data;
  var command = Buffer.from([0x54,0x00]);              //read(0x54), write(0x58)
  var dataType = Buffer.from([0x02,0x00]);
  var reserved = Buffer.from([0x00,0x00]);
  var block = Buffer.from([0x01,0x00]);
  var variable = Buffer.from(address, 'utf8');
  var var_length = Buffer.from([variable.length,0x00]);
  var total_length = command.length+dataType.length+reserved.length+block.length+var_length.length+variable.length;
  data = Buffer.concat([command, dataType,reserved,block,var_length,variable],total_length);
  console.log(data);
  return data;
}

/*setInterval(() => {

}, 1000);*/
