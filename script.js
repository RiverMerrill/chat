function main(){
	var getNode = function(s){
		return document.querySelector(s);
	}
	var status = getNode('.chat-status span');
	var messages = getNode('.chat-messages')
	var textarea = getNode('.chat textarea');
	var chatName = getNode('.chat-name');
	var statusDefault = status.textContent
	function setStatus(s){
		status.textContent = s;
		
		if(s !== statusDefault){
			var delay = setTimeout(function(){
				setStatus(statusDefault);
				clearInterval(delay);
			}, 3000)
		}
	};
	
	try {
		var socket = io.connect('http://127.0.0.1:8080');
	} catch (e) {
		//set status to warn user
	}
	
	if(socket !== undefined){
		//Listen for output
		socket.on('output', function(data){
			if(data.length) {
				for(var i = 0; i < data.length; i++){
					var message = document.createElement('div');
					message.setAttribute('class', 'chat-message');
					message.textContent = data[i].name + ': ' + data[i].message;
					
					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				}
			}
		});
		
		socket.on('status', function(data){
			setStatus((typeof data === 'object') ? data.message : data);
			
			if(data.clear == true){
				textarea.value = '';
			}
		});
		//Listen for keydown
		textarea.addEventListener('keydown', function(event){
			var self = this
			var name = chatName.value;
			if(event.which === 13 && event.shiftKey === false) {
				socket.emit('input', {
					name: name,
					message: self.value
				})
			}
		});
	}
};
main();