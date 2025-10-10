"use client";
import { useRef, useState } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      // ⚙️ Kiểm tra trạng thái quyền máy ảnh (nếu trình duyệt hỗ trợ)
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({
          name: "camera",
        });

        if (permissionStatus.state === "denied") {
          alert(
            "⚠️ Quyền truy cập máy ảnh đã bị chặn!\n\n" +
              "Hãy vào Cài đặt trình duyệt → Quyền (Permissions) → Cho phép truy cập camera, sau đó tải lại trang."
          );
          return;
        }
      }

      // 🧩 Yêu cầu quyền camera
      const s = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) videoRef.current.srcObject = s;
      setStream(s);
    } catch (err) {
      console.error("Camera error:", err);

      // 🧠 Phân loại lỗi để hiển thị thân thiện hơn
      if (err.name === "NotAllowedError") {
        alert(
          "⚠️ Bạn đã từ chối quyền truy cập camera.\n\n" +
            "Hãy bật lại quyền trong Cài đặt trình duyệt và tải lại trang."
        );
      } else if (err.name === "NotFoundError") {
        alert("🚫 Không tìm thấy camera trên thiết bị của bạn!");
      } else {
        alert("❌ Không thể bật camera: " + err.message);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setStream(null);
    }
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
        stopCamera(); // ✅ Tắt camera sau khi chụp
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <video ref={videoRef} autoPlay className="w-64 h-48 border rounded" />

      {!stream && (
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🎥 Start Camera
        </button>
      )}

      {stream && (
        <div className="flex gap-3">
          <button
            onClick={capture}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            📸 Capture
          </button>
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            ✖ Stop Camera
          </button>
        </div>
      )}
    </div>
  );
}
