/*
ads-client-ads.js

Copyright (c) 2020 Jussi Isotalo <j.isotalo91@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



/**
 * AMS/TCP header length
 */
const AMS_TCP_HEADER_LENGTH = 6
exports.AMS_TCP_HEADER_LENGTH = AMS_TCP_HEADER_LENGTH

/**
 * AMS header length
 */
const AMS_HEADER_LENGTH = 32
exports.AMS_HEADER_LENGTH = AMS_HEADER_LENGTH

/**
 * AmsNetId length
 */
const AMS_NET_ID_LENGTH = 6
exports.AMS_NET_ID_LENGTH = AMS_NET_ID_LENGTH

/**
 * ADS index offset length
 */
const ADS_INDEX_OFFSET_LENGTH = 4
exports.ADS_INDEX_OFFSET_LENGTH = ADS_INDEX_OFFSET_LENGTH

/**
 * ADS index group length
 */
const ADS_INDEX_GROUP_LENGTH = 4
exports.ADS_INDEX_GROUP_LENGTH = ADS_INDEX_GROUP_LENGTH

/**
 * ADS invoke ID maximum value (32bit unsigned integer)
 */
const ADS_INVOKE_ID_MAX_VALUE = 4294967295
exports.ADS_INVOKE_ID_MAX_VALUE = ADS_INVOKE_ID_MAX_VALUE

/**
 * AMS header flag (AMS command)
 */
const AMS_HEADER_FLAG = {
  AMS_TCP_PORT_AMS_CMD: 0, //0x0000 - Used for ADS commands
  AMS_TCP_PORT_CLOSE: 1, //0x0001
  AMS_TCP_PORT_CONNECT: 4096, // 0x1000
  AMS_TCP_PORT_ROUTER_NOTE: 4097, // 0x1001
  GET_LOCAL_NETID: 4098, // 0x1002
  
  toString: function (value) {
    return ((ret = Object.keys(this).find(key => this[key] == value)) != null ? ret : 'UNKNOWN')
  }
}
exports.AMS_HEADER_FLAG = AMS_HEADER_FLAG

/**
 * ADS command
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_COMMAND = {
  //Invalid
  Invalid: 0,
  //None / Uninitialized
  None: 0,
  //ReadDeviceInfo command
  ReadDeviceInfo: 1,
  //Read Command
  Read: 2,
  //Write Command
  Write: 3,
  //ReadState Command
  ReadState: 4,
  //WriteControl Command
  WriteControl: 5,
  //AddNotification Command
  AddNotification: 6,
  //DeleteNotification Command
  DeleteNotification: 7,
  //Notification event.
  Notification: 8,
  //ReadWrite Command
  ReadWrite: 9,
  
  toString: function (value) {
    return ((ret = Object.keys(this).find(key => this[key] == value)) != null ? ret : 'UNKNOWN')
  }
}
exports.ADS_COMMAND = ADS_COMMAND



/**
 * ADS state flags
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_STATE_FLAGS = {
   //The response (AMSCMDSF_RESPONSE)
    Response: 1,
    //(AMSCMDSF_NORETURN)
    NoReturn: 2,
    //AdsCommand
    AdsCommand: 4,
    //Internal generated cmds (AMSCMDSF_SYSCMD)
    SysCommand: 8,
    //High Priority (R0 to R0 checked at task begin, AMSCMDSF_HIGHPRIO)
    HighPriority: 16, // 0x0010
    //(cbData um 8 Byte vergrößert, AMSCMDSF_TIMESTAMPADDED)
    TimeStampAdded: 32, // 0x0020
    //(UDP instead of TCP, AMSCMDSF_UDP)
    Udp: 64, // 0x0040
    //(command during init phase of TwinCAT, AMSCMDSF_INITCMD)
    InitCmd: 128, // 0x0080
    //(AMSCMDSF_BROADCAST)
    Broadcast: 32768, // 0x8000
    //Mask Ads Request
    //MaskAdsRequest: 0x0004, // 0x0004
    //Mask Ads Response
    //MaskAdsResponse: 0x0005, // 0x0005
    
    toString: function (value) {
      let flags = []

      for (let key of Object.keys(this)) {
        if (typeof this[key] !== 'number')
          continue

        if((value & this[key]) == this[key])
          flags.push(key)
      }

      //Specials: For helping debugging
      if (!flags.includes('Udp'))
        flags.push('Tcp')
      
      if (!flags.includes('Response'))
        flags.push('Request')
      
      return flags.join(', ')
    }
}
exports.ADS_STATE_FLAGS = ADS_STATE_FLAGS


/**
 * ADS error code
 * 
 * Source: Beckhoff InfoSys
 */
const ADS_ERROR = {
  0: 'No error',
  1: 'Internal error',
  2: 'No Rtime',
  3: 'Allocation locked memory error',
  4: 'Insert mailbox error',
  5: 'Wrong receive HMSG',
  6: 'Target port not found',
  7: 'Target machine not found',
  8: 'Unknown command ID',
  9: 'Bad task ID',
  10: 'No IO',
  11: 'Unknown ADS command',
  12: 'Win 32 error',
  13: 'Port not connected',
  14: 'Invalid ADS length',
  15: 'Invalid AMS Net ID',
  16: 'Low Installation level',
  17: 'No debug available',
  18: 'Port disabled',
  19: 'Port already connected',
  20: 'ADS Sync Win32 error',
  21: 'ADS Sync Timeout',
  22: 'ADS Sync AMS error',
  23: 'ADS Sync no index map',
  24: 'Invalid ADS port',
  25: 'No memory',
  26: 'TCP send error',
  27: 'Host unreachable',
  28: 'Invalid AMS fragment',
  1280: 'No locked memory can be allocated',
  1281: 'The size of the router memory could not be changed',
  1282: 'The mailbox has reached the maximum number of possible messages. The current sent message was rejected',
  1283: 'The mailbox has reached the maximum number of possible messages.',
  1284: 'Unknown port type',
  1285: 'Router is not initialized',
  1286: 'The desired port number is already assigned',
  1287: 'Port not registered',
  1288: 'The maximum number of Ports reached',
  1289: 'Invalid port',
  1290: 'TwinCAT Router not active',
  1792: 'General device error',
  1793: 'Service is not supported by server',
  1794: 'Invalid index group',
  1795: 'Invalid index offset',
  1796: 'Reading/writing not permitted',
  1797: 'Parameter size not correct',
  1798: 'Invalid parameter value(s)',
  1799: 'Device is not in a ready state',
  1800: 'Device is busy',
  1801: 'Invalid context (must be in Windows)',
  1802: 'Out of memory',
  1803: 'Invalid parameter value(s)',
  1804: 'Not found (files, ...)',
  1805: 'Syntax error in command or file',
  1806: 'Objects do not match',
  1807: 'Object already exists',
  1808: 'Symbol not found',
  1809: 'Symbol version invalid',
  1810: 'Server is in invalid state',
  1811: 'AdsTransMode not supported',
  1812: 'Notification handle is invalid',
  1813: 'Notification client not registered',
  1814: 'No more notification handles',
  1815: 'Size for watch too big',
  1816: 'Device not initialized',
  1817: 'Device has a timeout',
  1818: 'Query interface failed',
  1819: 'Wrong interface required',
  1820: 'Class ID is invalid',
  1821: 'Object ID is invalid',
  1822: 'Request is pending',
  1823: 'Request is aborted',
  1824: 'Signal warning',
  1825: 'Invalid array index',
  1826: 'Symbol not active',
  1827: 'Access denied',
  1828: 'Missing license',
  1829: 'License expired',
  1830: 'License exceeded',
  1831: 'License invalid',
  1832: 'License invalid system id',
  1833: 'License not time limited',
  1834: 'License issue time in the future',
  1835: 'License time period to long',
  1836: 'Exception occured during system start',
  1837: 'License file read twice',
  1838: 'Invalid signature',
  1839: 'Public key certificate',
  1856: 'Error class <client error>',
  1857: 'Invalid parameter at service',
  1858: 'Polling list is empty',
  1859: 'Var connection already in use',
  1860: 'Invoke ID in use',
  1861: 'Timeout elapsed',
  1862: 'Error in win32 subsystem',
  1863: 'Invalid client timeout value',
  1864: 'Ads-port not opened',
  1872: 'Internal error in ads sync',
  1873: 'Hash table overflow',
  1874: 'Key not found in hash',
  1875: 'No more symbols in cache',
  1876: 'Invalid response received',
  1877: 'Sync port is locked',
  4096: 'Internal fatal error in the TwinCAT real-time system',
  4097: 'Timer value not vaild',
  4098: 'Task pointer has the invalid value ZERO',
  4099: 'Task stack pointer has the invalid value ZERO',
  4100: 'The demand task priority is already assigned',
  4101: 'No more free TCB (Task Control Block) available. Maximum number of TCBs is 64',
  4102: 'No more free semaphores available. Maximum number of semaphores is 64',
  4103: 'No more free queue available. Maximum number of queue is 64',
  4109: 'An external synchronization interrupt is already applied',
  4110: 'No external synchronization interrupt applied',
  4111: 'The apply of the external synchronization interrupt failed',
  4112: 'Call of a service function in the wrong context',
  4119: 'Intel VT-x extension is not supported',
  4120: 'Intel VT-x extension is not enabled in system BIOS',
  4121: 'Missing function in Intel VT-x extension',
  4122: 'Enabling Intel VT-x fails',
}
exports.ADS_ERROR = ADS_ERROR

/**
 * ADS notification transmission mode
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_TRANS_MODE = {
  None: 0,
  ClientCycle: 1,
  ClientOnChange: 2,
  Cyclic: 3,
  OnChange: 4,
  CyclicInContext: 5,
  OnChangeInContext: 6,
}
exports.ADS_TRANS_MODE = ADS_TRANS_MODE

/**
 * ADS state
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_STATE = {
  Invalid: 0,
  Idle: 1,
  Reset: 2,
  Initialize: 3,
  Start: 4,
  Run: 5,
  Stop: 6,
  SaveConfig: 7,
  LoadConfig: 8,
  PowerFailure: 9,
  PowerGood: 10,
  Error: 11,
  Shutdown: 12,
  Susped: 13,
  Resume: 14,
  Config: 15,
  Reconfig: 16,
  Stopping: 17,
  Incompatible: 18,
  Exception: 19,

  toString: function (value) {
    return ((ret = Object.keys(this).find(key => this[key] == value)) != null ? ret : 'UNKNOWN')
  }
}
exports.ADS_STATE = ADS_STATE


/**
 * Reserved ADS index groups
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_RESERVED_INDEX_GROUPS = {
  //PlcRWIB (0x4000, 16384)
  PlcRWIB: 16384, // 0x00004000
  //PlcRWOB (0x4010, 16400)
  PlcRWOB: 16400, // 0x00004010
  //PlcRWMB (0x4020, 16416)
  PlcRWMB: 16416, // 0x00004020
  //PlcRWRB (0x4030, 16432)
  PlcRWRB: 16432, // 0x00004030
  //PlcRWDB (0x4040,16448)
  PlcRWDB: 16448, // 0x00004040
  //SymbolTable (0xF000, 61440)
  SymbolTable: 61440, // 0x0000F000
  //SymbolName (0xF001, 61441)
  SymbolName: 61441, // 0x0000F001
  //SymbolValue (0xF002, 61442)
  SymbolValue: 61442, // 0x0000F002
  //SymbolHandleByName (0xF003, 61443)
  SymbolHandleByName: 61443, // 0x0000F003
  //SymbolValueByName (0xF004, 61444)
  SymbolValueByName: 61444, // 0x0000F004
  //SymbolValueByHandle (0xF005, 61445)
  SymbolValueByHandle: 61445, // 0x0000F005
  //SymbolReleaseHandle (0xF006, 61446)
  SymbolReleaseHandle: 61446, // 0x0000F006
  //SymbolInfoByName (0xF007, 61447)
  SymbolInfoByName: 61447, // 0x0000F007
  //SymbolVersion (0xF008, 61448)
  SymbolVersion: 61448, // 0x0000F008
  //SymbolInfoByNameEx (0xF009, 61449)
  SymbolInfoByNameEx: 61449, // 0x0000F009
  //SymbolDownload (F00A, 61450)
  SymbolDownload: 61450, // 0x0000F00A
  //SymbolUpload (F00B, 61451)
  SymbolUpload: 61451, // 0x0000F00B
  //SymbolUploadInfo (0xF00C, 61452)
  SymbolUploadInfo: 61452, // 0x0000F00C
  //SymbolDownload2
  SymbolDownload2: 0xF00D, //Added, not from .dll
  //SymbolDataTypeUpload
  SymbolDataTypeUpload: 0xF00E, //Added, not from .dll
  //SymbolUploadInfo2
  SymbolUploadInfo2: 0xF00F, //Added, not from .dll - 24 bytes of info, uploadinfo3 would contain 64 bytes
  //Notification of named handle (0xF010, 61456)
  SymbolNote: 61456, // 0x0000F010
  //DataDataTypeInfoByNameEx
  DataDataTypeInfoByNameEx: 0xF011, //Added, not from .dll
  //read/write input byte(s) (0xF020, 61472)
  IOImageRWIB: 61472, // 0x0000F020
  //read/write input bit (0xF021, 61473)
  IOImageRWIX: 61473, // 0x0000F021
  //read/write output byte(s) (0xF030, 61488)
  IOImageRWOB: 61488, // 0x0000F030
  //read/write output bit (0xF031, 61489)
  IOImageRWOX: 61489, // 0x0000F031
  //write inputs to null (0xF040, 61504)
  IOImageClearI: 61504, // 0x0000F040
  //write outputs to null (0xF050, 61520)
  IOImageClearO: 61520, // 0x0000F050
  //
  //ADS Sum Read Command (ADSIGRP_SUMUP_READ, 0xF080, 61568)
  //
  SumCommandRead: 61568, // 0x0000F080
  //
  //ADS Sum Write Command (ADSIGRP_SUMUP_WRITE, 0xF081, 61569)
  //
  SumCommandWrite: 61569, // 0x0000F081
  //
  //ADS sum Read/Write command (ADSIGRP_SUMUP_READWRITE, 0xF082, 61570)
  //
  SumCommandReadWrite: 61570, // 0x0000F082
  //
  //ADS sum ReadEx command (ADSIGRP_SUMUP_READEX, 0xF083, 61571)
  //AdsRW  IOffs list size
  //W: {list of IGrp, IOffs, Length}
  //R: {list of results, Length} followed by {list of data (expepted lengths)}
  //
  SumCommandReadEx: 61571, // 0x0000F083
  //
  //ADS sum ReadEx2 command (ADSIGRP_SUMUP_READEX2, 0xF084, 61572)
  //AdsRW  IOffs list size
  //W: {list of IGrp, IOffs, Length}
  //R: {list of results, Length} followed by {list of data (returned lengths)}
  //
  SumCommandReadEx2: 61572, // 0x0000F084
  //
  //ADS sum AddDevNote command (ADSIGRP_SUMUP_ADDDEVNOTE, 0xF085, 61573)
  //AdsRW  IOffs list size
  //W: {list of IGrp, IOffs, Attrib}
  //R: {list of results, handles}
  //
  SumCommandAddDevNote: 61573, // 0x0000F085
  //
  //ADS sum DelDevNot command (ADSIGRP_SUMUP_DELDEVNOTE, 0xF086, 61574)
  //AdsRW  IOffs list size
  //W: {list of handles}
  //R: {list of results}
  //
  SumCommandDelDevNote: 61574, // 0x0000F086
  //DeviceData (0xF100,61696)
  DeviceData: 61696, // 0x0000F100


  toString: function (value) {
    return ((ret = Object.keys(this).find(key => this[key] == value)) != null ? ret : 'UNKNOWN')
  }
}
exports.ADS_RESERVED_INDEX_GROUPS = ADS_RESERVED_INDEX_GROUPS





/**
 * ADS symbol flags
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_SYMBOL_FLAGS = {
  //None
  None: 0,
  //ADSSYMBOLFLAG_PERSISTENT
  Persistent: 1,
  //ADSSYMBOLFLAG_BITVALUE
  BitValue: 2,
  //ADSSYMBOLFLAG_REFERENCETO
  ReferenceTo: 4,
  //ADSSYMBOLFLAG_TYPEGUID
  TypeGuid: 8,
  //ADSSYMBOLFLAG_TCCOMIFACEPTR
  TComInterfacePtr: 16, // 0x0010
  //ADSSYMBOLFLAG_READONLY
  ReadOnly: 32, // 0x0020
  //ADSSYMBOLFLAG_ITFMETHODACCESS
  ItfMethodAccess: 64, // 0x0040
  //ADSSYMBOLFLAG_METHODDEREF
  MethodDeref: 128, // 0x0080
  //ADSSYMBOLFLAG_CONTEXTMASK (4 Bit)
  ContextMask: 3840, // 0x0F00
  //ADSSYMBOLFLAG_ATTRIBUTES
  Attributes: 4096, // 0x1000
  //
  // Symbol is static (ADSSYMBOLFLAG_STATIC,0x2000)
  // 
  Static: 8192, // 0x2000
  //
  // Persistent data will not restored after reset (cold, ADSSYMBOLFLAG_INITONRESET 0x4000)
  // 
  InitOnReset: 16384, // 0x4000
  //
  // Extended Flags in symbol (ADSSYMBOLFLAG_EXTENDEDFLAGS,0x8000)
  // 
  ExtendedFlags: 32768, // 0x8000

  toStringArray: function (flags) {
    let flagsStr = []

    Object.keys(ADS_SYMBOL_FLAGS).forEach((item) => {
      //Check if flag is available
      if ((flags & ADS_SYMBOL_FLAGS[item]) === ADS_SYMBOL_FLAGS[item]) {
        if (flags === 0 || ADS_SYMBOL_FLAGS[item] !== 0) flagsStr.push(item)
      }
    })
      
    return flagsStr
  }
}
exports.ADS_SYMBOL_FLAGS = ADS_SYMBOL_FLAGS



/**
 * ADS data type flags
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_DATA_TYPE_FLAGS = {
  //ADSDATATYPEFLAG_DATATYPE
  DataType: 1,
  //ADSDATATYPEFLAG_DATAITEM
  DataItem: 2,
  //ADSDATATYPEFLAG_REFERENCETO
  ReferenceTo: 4,
  //ADSDATATYPEFLAG_METHODDEREF
  MethodDeref: 8,
  //ADSDATATYPEFLAG_OVERSAMPLE
  Oversample: 16, // 0x00000010
  //ADSDATATYPEFLAG_BITVALUES
  BitValues: 32, // 0x00000020
  //ADSDATATYPEFLAG_PROPITEM
  PropItem: 64, // 0x00000040
  //ADSDATATYPEFLAG_TYPEGUID
  TypeGuid: 128, // 0x00000080
  //ADSDATATYPEFLAG_PERSISTENT
  Persistent: 256, // 0x00000100
  //ADSDATATYPEFLAG_COPYMASK
  CopyMask: 512, // 0x00000200
  //ADSDATATYPEFLAG_TCCOMIFACEPTR
  TComInterfacePtr: 1024, // 0x00000400
  //ADSDATATYPEFLAG_METHODINFOS
  MethodInfos: 2048, // 0x00000800
  //ADSDATATYPEFLAG_ATTRIBUTES
  Attributes: 4096, // 0x00001000
  //ADSDATATYPEFLAG_ENUMINFOS
  EnumInfos: 8192, // 0x00002000
  //
  // this flag is set if the datatype is aligned (ADSDATATYPEFLAG_ALIGNED)
  // 
  Aligned: 65536, // 0x00010000
  //
  // data item is static - do not use offs (ADSDATATYPEFLAG_STATIC)
  // 
  Static: 131072, // 0x00020000
  //
  // means "ContainSpLevelss" for DATATYPES and "HasSpLevels" for DATAITEMS (ADSDATATYPEFLAG_SPLEVELS)
  // 
  SpLevels: 262144, // 0x00040000
  //
  // do not restore persistent data (ADSDATATYPEFLAG_IGNOREPERSIST)
  // 
  IgnorePersist: 524288, // 0x00080000
  //Any size array (ADSDATATYPEFLAG_ANYSIZEARRAY)
  // <remarks>
  // If the index is exeeded, a value access to this array will return <see cref="F:TwinCAT.Ads.AdsErrorCode.DeviceInvalidArrayIndex" />
  // </remarks>
  AnySizeArray: 1048576, // 0x00100000
  //
  //  data type used for persistent variables -&gt; should be saved with persistent data (ADSDATATYPEFLAG_PERSIST_DT,0x00200000)
  // 
  PersistantDatatype: 2097152, // 0x00200000
  //
  // Persistent data will not restored after reset (cold) (ADSDATATYPEFLAG_INITONRESET,0x00400000)
  // 
  InitOnResult: 4194304, // 0x00400000
  //None / No Flag set
  None: 0,

  toStringArray: function (flags) {
    let flagsStr = []

    Object.keys(ADS_DATA_TYPE_FLAGS).forEach((item) => {
      //Check if flag is available
      if ((flags & ADS_DATA_TYPE_FLAGS[item]) === ADS_DATA_TYPE_FLAGS[item]) {
        if (flags === 0 || ADS_DATA_TYPE_FLAGS[item] !== 0) flagsStr.push(item)
      }
    })
      
    return flagsStr
  }
}
exports.ADS_DATA_TYPE_FLAGS = ADS_DATA_TYPE_FLAGS


/**
 * ADS data types
 * 
 * Source: TwinCAT.Ads.dll By Beckhoff
 */
const ADS_DATA_TYPES = {
  /// <summary>Empty Type</summary>
  ADST_VOID: 0,
  /// <summary>Integer 16 Bit</summary>
  ADST_INT16: 2,
  /// <summary>Integer 32 Bit</summary>
  ADST_INT32: 3,
  /// <summary>Real (32 Bit)</summary>
  ADST_REAL32: 4,
  /// <summary>Real 64 Bit</summary>
  ADST_REAL64: 5,
  /// <summary>Integer 8 Bit</summary>
  ADST_INT8: 16, // 0x00000010
  /// <summary>Unsigned integer 8 Bit</summary>
  ADST_UINT8: 17, // 0x00000011
  /// <summary>Unsigned integer 16 Bit</summary>
  ADST_UINT16: 18, // 0x00000012
  /// <summary>Unsigned Integer 32 Bit</summary>
  ADST_UINT32: 19, // 0x00000013
  /// <summary>LONG Integer 64 Bit</summary>
  ADST_INT64: 20, // 0x00000014
  /// <summary>Unsigned Long integer 64 Bit</summary>
  ADST_UINT64: 21, // 0x00000015
  /// <summary>STRING</summary>
  ADST_STRING: 30, // 0x0000001E
  /// <summary>WSTRING</summary>
  ADST_WSTRING: 31, // 0x0000001F
  /// <summary>ADS REAL80</summary>
  ADST_REAL80: 32, // 0x00000020
  /// <summary>ADS BIT</summary>
  ADST_BIT: 33, // 0x00000021
  /// <summary>Internal Only</summary>
  ADST_MAXTYPES: 34, // 0x00000022
  /// <summary>Blob</summary>
  ADST_BIGTYPE: 65, // 0x00000041

  toString: function (value) {
    return ((ret = Object.keys(this).find(key => this[key] == value)) != null ? ret : 'UNKNOWN')
  }
}
exports.ADS_DATA_TYPES = ADS_DATA_TYPES

/**
 * AMS router state
 */
const AMS_ROUTER_STATE = {
  STOP: 0,
  START: 1,
  REMOVED: 2,

  toString: function (value) {
    return ((ret = Object.keys(this).find(key => this[key] == value)) != null ? ret : 'UNKNOWN')
  }
}
exports.AMS_ROUTER_STATE = AMS_ROUTER_STATE

/**
 * Base data types
 * 
 * Object that handles PLC base data types
 */
const BASE_DATA_TYPES = {

  /**
   * Returns true if given data type is found and known
   * 
   * @param {string} name Data type name
   */
  isKnownType: function (name) {
    return this.find(name) !== undefined || name.toUpperCase().includes('STRING(')
  },



  /**
   * Finds the given data type from array
   * 
   * @param {string} name Data type name
   */
  find: function(name) {
    return this.types.find(type => type.name.includes(name.trim().toUpperCase()))
  },



  /**
   * Writes given value to given or new buffer
   * 
   * @param {object} settings Reference to AdsClient settings
   * @param {string} name Data type name
   * @param {any} value Value to write
   * @param {Buffer} [buffer] Optional - Buffer to write to. If not given, new Buffer is allocated
   */
  toBuffer: function (settings, name, value, buffer = null) {
    const type = this.find(name)

    if (type == null) {
      throw new Error(`Error: Base type ${name} not found from BaseDataTypes - If this should be found, report an issue`)
    }

    //If buffer not given, allocate new
    if (buffer == null) {
      const type = this.find(name)
      buffer = Buffer.allocUnsafe(type.size)
    }
    
    type.toBuffer(value, buffer, settings)
    return buffer
  },



  /**
   * Reads given data type from given buffer
   * 
   * @param {object} settings Reference to AdsClient settings
   * @param {string} name Data type name
   * @param {Buffer} buffer Buffer to read from
   */
  fromBuffer: function (settings, name, buffer) {
    const type = this.find(name)

    if (type == null) {
      throw new Error(`Error: Base type ${name} not found from BaseDataTypes - If this should be found, report an issue`)
    }
    return type.fromBuffer(buffer, settings)
  },




  /**
   * All base data types and properties
   */
  types: [
    {
      name: ['BOOL'],
      size: 1,
      toBuffer: (value, buffer) => buffer.writeUInt8(value === true || value === 1 ? 1 : 0),
      fromBuffer: buffer => buffer.readUInt8(0) === 1
    },
    {
      name: ['BYTE', 'USINT'],
      size: 1,
      toBuffer: (value, buffer) => buffer.writeUInt8(value),
      fromBuffer: buffer => buffer.readUInt8(0)
    },
    {
      name: ['SINT'],
      size: 1,
      toBuffer: (value, buffer) => buffer.writeInt8(value),
      fromBuffer: buffer => buffer.readInt8(0)
    },
    {
      name: ['UINT', 'WORD'],
      size: 2,
      toBuffer: (value, buffer) => buffer.writeUInt16LE(value),
      fromBuffer: buffer => buffer.readInt16LE(0)
    },
    {
      name: ['INT'],
      size: 2,
      toBuffer: (value, buffer) => buffer.writeInt16LE(value),
      fromBuffer: buffer => buffer.readInt16LE(0)
    },
    {
      name: ['DINT'],
      size: 4,
      toBuffer: (value, buffer) => buffer.writeInt32LE(value),
      fromBuffer: buffer => buffer.readInt32LE(0)
    },
    {
      name: ['UDINT', 'DWORD', 'TIME', 'TIME_OF_DAY'],
      size: 4,
      toBuffer: (value, buffer) => buffer.writeUInt32LE(value),
      fromBuffer: buffer => buffer.readUInt32LE(0)
    },
    {
      name: ['DATE_AND_TIME', 'DATE'],
      size: 4,
      toBuffer: (value, buffer, settings) => {
        if (settings.convertDatesToJavascript === true && value.getTime)
          buffer.writeUInt32LE(value.getTime() / 1000)
        else
          buffer.writeUInt32LE(value)
      },
      fromBuffer: (buffer, settings) => {
        if (settings.convertDatesToJavascript === true)
          return new Date(buffer.readUInt32LE(0) * 1000)
        else
          return buffer.readUInt32LE(0)
      }
    },
    {
      name: ['REAL'],
      size: 4,
      toBuffer: (value, buffer) => buffer.writeFloatLE(value),
      fromBuffer: buffer => buffer.readFloatLE(0)
    },
    {
      name: ['LREAL'],
      size: 8,
      toBuffer: (value, buffer) => buffer.writeDoubleLE(value),
      fromBuffer: buffer => buffer.readDoubleLE(0)
    },
    {
      name: ['LWORD', 'ULINT', 'LTIME'],
      size: 8,
      toBuffer: (value, buffer) => {
        //64 bit integers are missing from older Node.js Buffer, so use buffer instead if so
        if (buffer.writeBigUInt64LE)
          buffer.writeBigUInt64LE(value)
        else
          value.copy(buffer)
      },
      fromBuffer: buffer => {
        if (buffer.readBigInt64LE)
          return buffer.readBigInt64LE(0)
        else
          return buffer
      }
    },
    {
      name: ['LINT'],
      size: 8,
      toBuffer: (value, buffer) => {
        //64 bit integers are missing from older Node.js Buffer, so use buffer instead if so
        if (buffer.writeBigInt64LE)
          buffer.writeBigInt64LE(value)
        else
          value.copy(buffer)
      },
      fromBuffer: buffer => {
        if (buffer.readBigInt64LE)
          return buffer.readBigInt64LE(0)
        else
          return buffer
      }
    },
  ]
}
exports.BASE_DATA_TYPES = BASE_DATA_TYPES