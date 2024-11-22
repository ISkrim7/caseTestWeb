import { socketUrl } from '@/utils/config';
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [roomID, setRoomID] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [allLogs, setAllLogs] = useState<string[]>([]); // 新增一个状态变量 allLogs 来保存所有的日志内容

  useEffect(() => {
    // 如果 roomID 不为空
    if (roomID) {
      // 如果 socketRef.current 是 null，才建立新的连接
      if (!socketRef.current) {
        socketRef.current = io(socketUrl + roomID); // 假设 socketUrl 是已定义的连接地址

        // 监听连接成功事件
        socketRef.current.on('connect', () => {
          console.log(`Connected to room ${roomID}`);
        });

        // 监听连接错误
        socketRef.current.on('connect_error', (error) => {
          console.error('Connection Error:', error);
        });

        // 监听 'log' 事件
        socketRef.current.on('log', ({ code, msg }) => {
          if (code === 0) {
            setAllLogs((prevLog) => [...prevLog, msg]);
          } else {
            console.log(`Disconnect from room ${roomID}`);
            setRoomID(null); // 清空 roomID，触发下一次连接
            socketRef.current?.disconnect(); // 断开连接
          }
        });
      }
    } else {
      // 如果 roomID 为 null，关闭连接
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // 清理 socket 引用
      }
    }

    // 在 effect 清理阶段断开连接
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // 断开连接
        socketRef.current = null; // 清理引用
      }
    };
  }, [roomID]); // 依赖

  return {
    setRoomID,
    drawer,
    setDrawer,
    allLogs,
    setAllLogs,
  };
};

export default useSocket;
