import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer";
import { useEffect, useRef, useState } from "react";
import {Device} from "../models/device";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function DeviceList() {
  const navigate = useNavigate();
  
  const dataFetchedRef = useRef<boolean>(false);
  
  const [ready, setReady] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/devices`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setDevices(data);
        setReady(true);
      });
  }, []);

  const viewDevice = (deviceId: string) => {
    return () => {
      navigate(`/device/${deviceId}`);
    }
  }

  return (
    <>
      <div className="row">
        {ready?<h2>Devices</h2>:<h2>Loading devices...</h2>}
        {devices.map((device: Device) => (
            <div className="column" key={device.deviceId} onClick={viewDevice(device.deviceId)}>
              <div className="card">
                <p><Link to={`/device/${device.deviceId}`}>{device.deviceId}</Link></p>
                <h1>{device.connected?<FiWifi />:<FiWifiOff />}</h1>
              </div>
            </div>
        ))}
      </div>
      <Footer />
    </>
  );
}