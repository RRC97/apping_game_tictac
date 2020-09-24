var user_token = localStorage.getItem('user_token');

var io = io('ws://25.43.203.103:3000');

io.on('connect', () => {
    
    io.emit('token', user_token, (data) => {
        console.log(data);
    })

    io.on('token:success',(player)=>{
        
        
    })

    io.on('token:failed',(data)=>{
        console.log(data);
    })
});

