// package: examplecom
// file: proto/examplecom/simple_service.proto

var proto_examplecom_simple_service_pb = require("../../proto/examplecom/simple_service_pb");
var proto_othercom_external_child_message_pb = require("../../proto/othercom/external_child_message_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("grpc-web-client").grpc;

var exports = (typeof module === 'object' && module !== null && module.exports !== undefined) ? module.exports : {};

var SimpleService = (function () {
  function SimpleService() {}
  SimpleService.serviceName = "examplecom.SimpleService";
  return SimpleService;
}());

SimpleService.DoUnary = {
  methodName: "DoUnary",
  service: SimpleService,
  requestStream: false,
  responseStream: false,
  requestType: proto_examplecom_simple_service_pb.UnaryRequest,
  responseType: proto_othercom_external_child_message_pb.ExternalChildMessage
};

SimpleService.DoServerStream = {
  methodName: "DoServerStream",
  service: SimpleService,
  requestStream: false,
  responseStream: true,
  requestType: proto_examplecom_simple_service_pb.StreamRequest,
  responseType: proto_othercom_external_child_message_pb.ExternalChildMessage
};

SimpleService.DoClientStream = {
  methodName: "DoClientStream",
  service: SimpleService,
  requestStream: true,
  responseStream: false,
  requestType: proto_examplecom_simple_service_pb.StreamRequest,
  responseType: google_protobuf_empty_pb.Empty
};

SimpleService.DoBidiStream = {
  methodName: "DoBidiStream",
  service: SimpleService,
  requestStream: true,
  responseStream: true,
  requestType: proto_examplecom_simple_service_pb.StreamRequest,
  responseType: proto_othercom_external_child_message_pb.ExternalChildMessage
};

SimpleService.Delete = {
  methodName: "Delete",
  service: SimpleService,
  requestStream: false,
  responseStream: false,
  requestType: proto_examplecom_simple_service_pb.UnaryRequest,
  responseType: proto_examplecom_simple_service_pb.UnaryResponse
};

exports.SimpleService = SimpleService;

function SimpleServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SimpleServiceClient.prototype.doUnary = function doUnary(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(SimpleService.DoUnary, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

SimpleServiceClient.prototype.doServerStream = function doServerStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(SimpleService.DoServerStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

SimpleServiceClient.prototype.doClientStream = function doClientStream(metadata) {
  var listeners = {
    end: [],
    status: []
  };
  var client = grpc.client(SimpleService.DoClientStream, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.end.forEach(function (handler) {
      handler();
    });
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      if (!client.started) {
        client.start(metadata);
      }
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

SimpleServiceClient.prototype.doBidiStream = function doBidiStream(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(SimpleService.DoBidiStream, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.end.forEach(function (handler) {
      handler();
    });
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

SimpleServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(SimpleService.Delete, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

exports.SimpleServiceClient = SimpleServiceClient;

