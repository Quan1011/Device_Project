import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  LayersControl,
  Pane,
  FeatureGroup,
  Polyline,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./map.css";
import "leaflet.offline";
import L from "leaflet";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";
import "font-awesome/css/font-awesome.min.css";
import broadcast from "../assets/broadcast.svg";
import drone from "../assets/drone.svg";
import mqtt from "mqtt";
import WebSocket from "ws";

export default function Dashboard() {
  const initialNotifications = [
    {
      id: Date.now() + 1,
      label: "Drone 1",
      latitude: 10.762622,
      longitude: 106.660172,
      timestamp: "10:30:00 AM",
      hide: false,
    },
    {
      id: Date.now() + 2,
      label: "Drone 2",
      latitude: 11.762622,
      longitude: 105.660172,
      timestamp: "10:30:00 AM",
      hide: false,
    },
    {
      id: Date.now() + 3,
      label: "Drone 3",
      latitude: 12.762622,
      longitude: 104.660172,
      timestamp: "10:30:00 AM",
      hide: false,
    },
    {
      id: Date.now() + 4,
      label: "Drone 4",
      latitude: 13.762622,
      longitude: 103.660172,
      timestamp: "10:30:00 AM",
      hide: false,
    },
  ];

  const markerIcon = new L.icon({
    iconUrl: broadcast,
    iconSize: [40, 40],
  });

  const droneIcon = new L.icon({
    iconUrl: drone,
    iconSize: [40, 40],
  });

  const { BaseLayer } = LayersControl;

  const latitude = parseFloat(import.meta.env.VITE_LAT);
  const longitude = parseFloat(import.meta.env.VITE_LNG);
  const center = [latitude, longitude];
  const zoom = 15;
  const mapRef = useRef();

  const polyline1 = [
    [latitude + 0.00328, longitude - 0.00328],
    [latitude - 0.00328, longitude + 0.00328],
  ];

  const polyline2 = [
    [latitude + 0.00328, longitude + 0.00328],
    [latitude - 0.00328, longitude - 0.00328],
  ];

  const poly = 0.005;

  const coordinates = [
    [
      [latitude + poly, longitude - poly],
      [latitude + poly, longitude + poly],
      [latitude, longitude],
    ],
    [
      [latitude + poly, longitude + poly],
      [latitude - poly, longitude + poly],
      [latitude, longitude],
    ],
    [
      [latitude - poly, longitude + poly],
      [latitude - poly, longitude - poly],
      [latitude, longitude],
    ],
    [
      [latitude - poly, longitude - poly],
      [latitude + poly, longitude - poly],
      [latitude, longitude],
    ],
  ];

  const client = mqtt.connect("ws://localhost:9001", { WebSocket: WebSocket });

  client.on("connect", () => {
    try {
      console.log("Đã kết nối đến MQTT broker");
      client.subscribe("drone/location");
    } catch (error) {
      console.error("Lỗi khi kết nối hoặc đăng ký MQTT:", error);
    }
  });

  const [drones, setDrones] = useState({});
  const markerTimeouts = useRef({});

  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    client.on("message", (topic, message) => {
      if (topic === "drone/location") {
        try {
          const data = JSON.parse(message.toString());
          if (Array.isArray(data)) {
            const newDrones = {};
            data.forEach((drone) => {
              if (drone && drone.lat && drone.lng && drone.label) {
                newDrones[drone.label] = [drone.lat, drone.lng];
                if (markerTimeouts.current[drone.label]) {
                  clearTimeout(markerTimeouts.current[drone.label]);
                }

                markerTimeouts.current[drone.label] = setTimeout(() => {
                  setDrones((prevDrones) => {
                    const updatedDrones = { ...prevDrones };
                    delete updatedDrones[drone.label];
                    return updatedDrones;
                  });
                }, 15000);
              } else {
                console.error("Dữ liệu tọa độ không hợp lệ:", drone);
              }
            });
            setDrones(newDrones);
            console.log("data:", newDrones);

            // Add new notification
            const newNotification = {
              id: Date.now(),
              label: data[0].label,
              latitude: data[0].lat,
              longitude: data[0].lng,
              timestamp: new Date().toLocaleTimeString(),
              hide: false,
            };

            setNotifications((prevNotifications) => [
              newNotification,
              ...prevNotifications,
            ]);

            setTimeout(() => {
              console.log("Hiding notification:", newNotification.id);
              setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                  notification.id === newNotification.id
                    ? { ...notification, hide: true }
                    : notification
                )
              );
            }, 3000);
            
          } else {
            console.error("Dữ liệu nhận được không phải là mảng:", data);
          }
        } catch (error) {
          console.error("Lỗi khi phân tích JSON:", error);
        }
      }
    });

    client.on("error", (error) => {
      console.error("Lỗi kết nối MQTT:", error);
    });

    return () => {
      client.end();
    };
  }, []);

  // useEffect(() => {
  //   const timeoutIds = notifications.map((notification, index) =>
  //     setTimeout(() => {
  //       setNotifications((prevNotifications) =>
  //         prevNotifications.filter((_, i) => i !== index)
  //       );
  //     }, 3000)
  //   );

  //   return () => {
  //     timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  //   };
  // }, [notifications]);

  function openPopup(e) {
    e.target.openPopup();
  }

  const handleCoordinates = (e) => {
    const layerType = e.layerType;
    const layer = e.layer;

    let coordinates;

    if (layerType === "marker") {
      coordinates = layer.getLatLng();
    } else {
      coordinates = layer.getLatLngs();
    }

    const geojson = {
      type: "Feature",
      geometry: {
        type: layerType,
        coordinates: coordinates,
      },
      properties: {},
    };

    const file = new Blob([JSON.stringify(geojson)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coordinates_${layerType}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <MapContainer
        className="container"
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        ref={mapRef}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              polyline: true,
              polygon: true,
              rectangle: true,
              circle: true,
              marker: true,
            }}
            onCreated={handleCoordinates}
            onEdited={(e) => {
              console.log(e.layers);
            }}
            onDeleted={(e) => {
              console.log(e.layers);
            }}
          />
        </FeatureGroup>
        <Circle
          color="lime"
          center={center}
          radius={500}
          startAngle={0}
          endAngle={180}
          fillColor="lime"
          opacity={1}
        />
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <Pane name="openStreetMap" style={{ zIndex: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </Pane>
          </BaseLayer>
          <BaseLayer name="Alidade Smooth Dark">
            <Pane name="alidadesmoothdark" style={{ zIndex: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
            </Pane>
          </BaseLayer>
          <BaseLayer name="OSM Bright">
            <Pane name="osmbright" style={{ zIndex: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
              />
            </Pane>
          </BaseLayer>
        </LayersControl>

        <Marker position={center} icon={markerIcon}>
          <Popup>
            {latitude}, {longitude}
          </Popup>
        </Marker>

        {Object.keys(drones).map((label) => (
          <Marker
            key={label}
            position={drones[label]}
            icon={droneIcon}
            eventHandlers={{ click: openPopup }}
          >
            <Popup>
              {label}: {drones[label][0]}, {drones[label][1]}
            </Popup>
          </Marker>
        ))}

        <Polyline positions={polyline1} color="lime" />
        <Polyline positions={polyline2} color="lime" />
      </MapContainer>

      <div className="notifications">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.hide ? "hide" : ""}`}
          >
            <p>Label: {notification.label}</p>
            <p>Latitude: {notification.latitude}</p>
            <p>Longitude: {notification.longitude}</p>
            <p>Time: {notification.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
