import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import "leaflet.offline";

export default function OfflineMap () {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Tạo bản đồ Leaflet
    const map = L.map('map', {
      crs: L.CRS.EPSG3857,
      center: [10.775233, 106.699947],
      zoom: 12,
    });

    // Thêm lớp bản đồ ngoại tuyến
    const tileLayer = L.tileLayer.offline('path/to/tiles/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Lưu trữ bản đồ
    setMap(map);

    // Tải bản đồ tự động
    const loadMap = () => {
      // Kiểm tra xem bản đồ đã được tải xuống hay chưa
      if (!localStorage.getItem('mapTiles')) {
        // Tải xuống bản đồ
        fetch('path/to/tiles.zip')
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onload = () => {
              // Lưu trữ bản đồ vào bộ nhớ cache
              localStorage.setItem('mapTiles', reader.result);

              // Tải bản đồ vào Leaflet
              tileLayer.setUrl(URL.createObjectURL(new Blob([reader.result])));
            };
            reader.readAsArrayBuffer(blob);
          });
      }
    };

    // Tải bản đồ khi component được mount
    loadMap();

    return () => {
      // Xóa bản đồ khỏi DOM khi component bị unmount
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{ height: '400px' }}>
        {map}
    </div>
  );
};
