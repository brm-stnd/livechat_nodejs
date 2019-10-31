var express = require('express');
var router = express.Router();
var linkifyHtml = require('linkifyjs/html');
var linkifyStr = require('linkifyjs/string');
var Chat     = require('../models/chat')

function socket(io) {
  // start listen with socket.io
  
  io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('disconnect', function(){
      try {
        socket.leave(socket.room);

        var data = {
          room: socket.room,
          name: socket.username
        }
        io.to(socket.room).emit('leave room', data);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('create', function(room) {
      try {

        socket.username = room[1];
        socket.room     = room[0];
        socket.join(room[0]);

        console.log(room[1]+' joined chat room '+room[0]);

        var data = {
          room: room[0],
          name: room[1]
        }
        io.to(room[0]).emit('join room', data);

        var list_users = [];
        for (socketID in io.nsps['/'].adapter.rooms[room[0]].sockets) {
          const username = io.nsps['/'].connected[socketID].username;
          list_users.push(username);
        }
        
        var data = {
          list_users: list_users
        }
        io.to(room[0]).emit('list users online', data);

      } catch (err) {
        console.log(err);
      }
    });

    socket.on('new message', async function(msg){
      try {
        var options = {/* … */};
        var data = {
          room: msg.room,
          name: msg.name,
          message: linkifyStr(msg.message, options)
        }
        io.in(msg.room).emit('chat message', data);

        let detail_chat = {
          name: msg.name,
          message: linkifyStr(msg.message, options)
        }

        let check_room = await Chat.find({room: msg.room})
            .select('room chat');
        if(check_room.length>0){
          Chat.update(
              { room: msg.room }, 
              { $push: { chat: detail_chat } }
          );
          
          Chat.findOne({room: msg.room}, function (err, chats) {
            if (err) console.log(err);

            chats.chat.push(detail_chat);
            chats.save();
          });
        }else{
          let data_chat = {
            room: msg.room,
            chat: detail_chat
          }

          Chat.create(data_chat)
            .then((result) => {
              console.log('Success entry to database')
            })
            .catch((err) => {
              console.log(err)
            })
        }
      } catch (err) {
        console.log(err);
      }
    });
    
  });
  /* GET home page. */
  router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Express socket' });
  });
}
module.exports = {
  router: router,
  sck: socket
}
