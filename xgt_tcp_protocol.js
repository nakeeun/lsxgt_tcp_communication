exports.companyHeader = function(dataFrame){
  var company_id = Buffer.from('LSIS-XGT');
  var reserved1 = Buffer.from([0x00,0x00]);
  var plc_info = Buffer.from([0x00,0x00]);
  var cpu_info = Buffer.from([0xA0]);
  var frame_dir = Buffer.from([0x33]);
  var InvokeID = Buffer.from([0x00,0x00]);
  var data_length = Buffer.from([dataFrame.length,0x00]);
  var enetPos = Buffer.from([0x01]);
  var reserved2 = Buffer.from([0x00]);
  var total_length = company_id.length+reserved1.length+plc_info.length+cpu_info.length+
                    frame_dir.length+InvokeID.length+data_length.length+reserved2.length+
                    enetPos.length;
  var data =  Buffer.concat([company_id,reserved1,plc_info,cpu_info,frame_dir,
                               InvokeID,data_length,reserved2,enetPos],total_length);
  //console.log(data);                               
  return data;                               
}
exports.readData = function(address,dataType){
  var data;
  var command = Buffer.from([0x54,0x00]);
  var set_data_Type = setDataType(dataType);
  var reserved = Buffer.from([0x00,0x00]);
  var block = Buffer.from([0x01,0x00]);
  var addr = Buffer.from(address, 'utf8');
  var addr_length = Buffer.from([addr.length,0x00]);
  var total_length = command.length+set_data_Type.length+reserved.length+block.length+addr_length.length+addr.length;
  data = Buffer.concat([command, set_data_Type,reserved,block,addr_length,addr],total_length);
  //console.log(data);
  return data;
}
exports.writeData = function(address,dataType,tempData){
    var data;
    var command = Buffer.from([0x58,0x00]);
    var set_data_Type = setDataType(dataType);
    var reserved = Buffer.from([0x00,0x00]);
    var block = Buffer.from([0x01,0x00]);
    var addr = Buffer.from(address, 'utf8');
    var addr_length = Buffer.from([addr.length,0x00]);
    var data = Buffer.from(tempData, 'hex');
    if(data.length == 1){
      data = Buffer.from([tempData,0x00],'hex');
    }
    var data_length = Buffer.from([data.length,0x00]);
    var total_length = command.length+set_data_Type.length+reserved.length+block.length+addr_length.length+addr.length+data.length+data_length.length;
    data = Buffer.concat([command, set_data_Type,reserved,block,addr_length,addr,data_length,data],total_length);
    //console.log(data);
    return data;
  }
var setDataType = function(dataType){
  var temp;
  switch(dataType){
    case 'bit':
      temp = Buffer.from([0x00,0x00]);
      break;
    case 'byte':
      temp = Buffer.from([0x01,0x00]);
      break;
    case 'word':
      temp = Buffer.from([0x02,0x00]);
      break;
    case 'dword':
      temp = Buffer.from([0x03,0x00]);
      break;
    case 'lword':
      temp = Buffer.from([0x04,0x00]);
      break;
    case 'seq':
      temp = Buffer.from([0x14,0x00]);
      break;
  }
  return temp;
}
