/* import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
export const initFirst=()=>{
    // 建立连接对象
    let stompClient="";
    //请求地址
    let herfUrl = window.location.hostname;
    //let socket = new SockJS(`http://${herfUrl}:878`);
    let socket = new SockJS(`http://192.168.3.87:878`);
    // 获取STOMP子协议的客户端对象
    stompClient = Stomp.over(socket);
    return stompClient;
}
export const connection=(mystompClient,ID,callback)=>{
        // 定义客户端的认证信息,按需求配置
        let headers = {
            Authorization: ""
        }
        // 向服务器发起websocket连接
        mystompClient.connect(headers,() => {
            mystompClient.subscribe('text', (msg) => { // 订阅服务端提供的某个topic
                callback(msg);
            },headers);
            //mystompClient.send("", {}, JSON.stringify(`{"queryID": "${ID}"}`))
           //用户加入接口
        }, (err)=>{
            let errdata={
                type:"err",
                model:"",
                msg:err };
            callback(errdata);
        });
};
export const disconnect=(mystompClient)=>{
    if(mystompClient) {
        mystompClient.disconnect();
    }
} */