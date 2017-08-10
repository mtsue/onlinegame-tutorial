const server = require('http').createServer(); // server
const io = require('socket.io')(server); // socket.io
server.listen(8080); // set server port

var members = {}; // members in game

// 接続開始
io.on('connection', function(socket){
    members[socket.id] = {};

    // player position を受け取り、対応する socket.id に追加する
    socket.on('playerPosition', function(data){
        members[socket.id].x = data.x;
        members[socket.id].y = data.y;
        members[socket.id].z = data.z;        
        console.log(members);
    });

    // enemy position を取得するためのリクエスト
    socket.on('getEnemyPosition', function(){
        var enemyId = '';
        for(id in members){
            // 自分以外の socket.id を検索
            if(id !== socket.id){
                // enemy position をレスポンス
                io.to(socket.id).emit('resEnemyPosition',
                    {
                        x: members[id].x,
                        y: members[id].y,
                        z: members[id].z
                    }
                );
            }
        }
    });

    // 切断時に members から削除
    socket.on('disconnect', function(){
        delete members[socket.id];
    });

});
