
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/app/api/axios/instance";

interface ChatRoomResponse {
  roomId: number;
  message: string;
}

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<ChatRoomResponse | null>(null);

  useEffect(() => {
    if (!roomId) return;
    apiClient.get(`/group/room/${roomId}`)
      .then(res => setRoomData(res.data))
      .catch(() => setRoomData(null));
  }, [roomId]);

  if (!roomData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">채팅방 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen p-5">
      <h1 className="text-xl font-semibold mb-4">
        채팅방 #{roomData.roomId}
      </h1>

      <div className="flex-1 bg-gray-100 rounded-xl p-4">
        <p className="text-gray-500">{roomData.message}</p>
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button className="ml-2 bg-key-100 text-white px-4 rounded-lg">
          전송
        </button>
      </div>
    </div>
  );
}
