﻿
var redis = require("redis");
redis.debug_mode = false;


var queueWatcher = function (channel, callback) {
    var client1 = redis.createClient(6379, Common.RedisIP);

    var cycle = function (chnl) {
        client1.blpop([chnl, 0], function (caller, data) {
            if (data) {
                var dt = null;
                try {
                    dt = JSON.parse(data[1]);
                } catch (e) {

                }  

                callback(dt.name, dt.user, dt.eventChannel, dt.content);
            }
            cycle(chnl);
        });
    }

    cycle(channel);
};
module.exports = queueWatcher;

//http://www.youtube.com/watch?v=tOu-LTsk1WI