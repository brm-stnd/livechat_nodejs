function create_room(room) {
  socket.emit('create', room);
}
function send_msg(msg) {
  socket.emit('new message', msg);
}
socket.on('chat message', function(msg){
  var name = $('#name').val();
  var align = 'left';
  var align_pull = 'pull-left';
  if(name===msg.name){
    align = 'right';
    align_pull = 'pull-right';
  }
  $('.chat-list').append('<article class="chat-item '+align+'">'+
                            '<a href="#" class="'+align_pull+' thumb-sm avatar"><img src="https://api.adorable.io/avatars/78/'+msg.name+'"></a>'+
                            '<section class="chat-body">'+
                              '<div class="panel b-light text-sm m-b-none">'+
                                '<div class="panel-body">'+
                                  '<span class="arrow '+align+'"></span>'+
                                  '<p class="m-b-none">'+msg.message+'</p>'+
                                '</div>'+
                              '</div>'+
                              '<small class="text-muted '+align_pull+'"><i class="fa fa-ok text-success"></i> '+msg.name+'</small>'+
                            '</section>'+
                          '</article>');
  $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight);
});
socket.on('join room', function(msg){
  $('.chat-list').append('<article class="chat-item"><center><b>'+msg.name+'</b> join room</center></article>');
  $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight);
});
socket.on('leave room', function(msg){
  $('.chat-list').append('<article class="chat-item"><center><b>'+msg.name+'</b> leave room</center></article>');
  $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight);

  $("#"+msg.name).remove();
});
socket.on('list users online', function(data){
  var list_users_html = '';
  for(var i=0;i<data.list_users.length;i++){
    list_users_html += '<li id='+data.list_users[i]+' class="list-group-item">'+
                          '<div class="media">'+
                            '<span class="pull-left thumb-sm avatar">'+
                              '<img src="https://api.adorable.io/avatars/78/'+data.list_users[i]+'" class="img-circle">'+
                              '<i class="on b-white bottom"></i>'+
                            '</span>'+
                            '<div class="media-body">'+
                              '<div><a href="#">'+data.list_users[i]+'</a></div>'+
                            '</div>'+
                          '</div>'+
                        '</li>';
  }
  $('.user-list').html(list_users_html);
  $('.user-list').scrollTop($('.user-list')[0].scrollHeight);
});
