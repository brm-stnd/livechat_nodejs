function kirim_pesan(pesan) {
  socket.emit('new message', pesan);
}
socket.on('chat message', function(msg){
  $('.chat').append('<li>'+'<div style="color:#e74c3c;float:left">'+msg.nama+'</div>'+': '+msg.message+'</li>');
  $('.chat').scrollTop($('.chat')[0].scrollHeight);
})
