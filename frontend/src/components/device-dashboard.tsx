import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import CircularSlider from '@fseehawer/react-circular-slider';
import Chart from "react-apexcharts";
import { FcAcceptDatabase, FcDataBackup } from 'react-icons/fc';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import Header from "./header";
import Footer from "./footer";
import { WsConnection } from "../websockets/ws-connection";
import { w3cwebsocket } from "websocket";
import { WsCommands } from "../websockets/ws-commands";
import { WsDeviceMessage } from "../websockets/ws-device-message";


export default function DeviceDashboard() {
  /* Refs */
  const dataFetchedRef = useRef<boolean>(false);
  const wsRef = useRef<w3cwebsocket>();
  const wsCommands = useRef<WsCommands>();

  /* Set the initial state */
  const [ready, setReady] = useState<boolean>(false); // Used to store the ready state of the component
  const [cmdResult, setCmdResult] = useState<boolean>(true); // Used to store the command result (true = success, false = error)

  const [dimmerValue, setDimmerValue] = useState<number>(0); // Used to store the dimmer value
  const [dimmerNewValue, setDimmerNewValue] = useState<number>(0); // Used to store the new dimmer value

  const { deviceId } = useParams(); // Gets the device ID from the URL
  const [connected, setConnected] = useState<boolean>(false); // Used to store the device connectivity status
  const [created_at, setCreatedAt] = useState<number>(0); // Used to store the device creation date
  const [updated_at, setUpdatedAt] = useState<number>(0); // Used to store the device last update date

  const [telemetry, setTelemetry] = useState<number[]>([]); // Used to store the device telemetry values
  const [telemetryTime, setTelemetryTime] = useState<string[]>([]); // Used to store the device telemetry timestamps

  /* Start the websocket connection */
  useLayoutEffect(() => {
    if (wsRef.current) return;

    // Websocket message handler
    const onWsMessage = (wsMessage: WsDeviceMessage) => {
      console.log("Websocket message ", wsMessage)
      if (wsMessage.type == "DeviceConnectivity") {
        setConnected(wsMessage.payload.connectivityStatus == "DEVICE_CONNECTED"? true:false)
        setUpdatedAt(Date.now())
      }

      if (wsMessage.type == "CommandResult") {
        setCmdResult(true)
        toast.success("Command executed successfully")
      }

      if (wsMessage.type == "CommandError") {
        setCmdResult(true)
        toast.error(`Command execution failed. ${wsMessage.payload.error || "Unknown error."}`)
      }

      if (wsMessage.type == "Status") {
        setDimmerValue(wsMessage.payload.dimmer as number || 0)
      }

      if (wsMessage.type == "Telemetry") {
        const telemetryValue = wsMessage.payload.value as number
        setTelemetry(telemetry => [...telemetry, telemetryValue].slice(-10))
        const telemetryTimestamp = new Date(wsMessage.payload.timestamp as number).toLocaleString()
        setTelemetryTime(telemetryTime => [...telemetryTime, telemetryTimestamp].slice(-10))
      }
    }

    // Save the websocket connection as a ref
    wsRef.current = WsConnection(deviceId as string, onWsMessage)

    // Save the websocket commands as a ref
    wsCommands.current = new WsCommands(deviceId as string, wsRef.current)
  }, [deviceId, connected, updated_at]);

  /* Websocket connection closer */
  const closeWsConnection = () => {
    wsRef.current?.close()
  }

  /* Commands */
  const setDimmer = (value: number) => {
    console.log("Dimmer set to: ", value)
    setDimmerNewValue(value)
  }

  const sendSetDimmer = () => {
    if(dimmerNewValue != dimmerValue){
      setDimmerValue(dimmerNewValue)
      setCmdResult(false)
      wsCommands.current?.sendSetDimmer(dimmerNewValue)
    }else{
      console.log("Dimmer value: ", dimmerNewValue)
    }
  }

  const sendStart = () => {
    setCmdResult(false)
    wsCommands.current?.sendStart()
  }

  const sendStop = () => {
    setCmdResult(false)
    wsCommands.current?.sendStop()
  }

  const sendEnableTelemetry = () => {
    setCmdResult(false)
    wsCommands.current?.sendEnableTelemetry()
  }

  const sendDisableTelemetry = () => {
    setCmdResult(false)
    wsCommands.current?.sendDisableTelemetry()
  }


  /* State management */
  useEffect(() => {
    /* Executed when the component mounts */
    // Prevents the data from being fetched again when the component re-renders
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    // Fetches the device data from the backend
    fetch(`${import.meta.env.VITE_BACKEND_URL}/device/${deviceId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Device data fetched ", data)
        setConnected(data.connected)
        setDimmerValue(data.dimmer)
        setCreatedAt(data.created_at)
        setUpdatedAt(data.updated_at)
        setReady(true);
      });

    /* Executed when the component unmounts */
    // return () => { ... }
  }, [deviceId]);

  /* Telemetry Chart Configuration */
  const telemetryChartConfig = {
    options: {
      chart: {
        id: "telemetry-chart"
      },
      xaxis: {
        categories: telemetryTime
      }
    },
    series: [
      {
        name: "temperature",
        data: telemetry
      }
    ]
  };

  /* Render */
  let dimmer;
  let startButton;
  let stopButton;
  let enableTelemetryButton;
  let disableTelemetryButton;

  if(connected && cmdResult){
    /* If the device is connected and the command result is true, the commands can be executed */
    dimmer = <div onMouseUpCapture={sendSetDimmer} className="circularDimmer">
      <CircularSlider
        width={200}
        label="Set Dimmer"
        min={0}
        max={100}
        dataIndex={dimmerValue}
        labelColor="#005a58"
        labelBottom={true}
        knobColor="#005a58"
        knobSize={55}
        progressColorFrom="#00bfbd"
        progressColorTo="#005a58"
        progressSize={10}
        trackColor="#eeeeee"
        trackSize={20}
        onChange={(value:number) => { setDimmer(value) } } />
      </div>
    startButton = <button onClick={sendStart}>START</button>
    stopButton = <button onClick={sendStop}>STOP</button>
    enableTelemetryButton = <button onClick={sendEnableTelemetry}>ENABLE TELEMETRY</button>
    disableTelemetryButton = <button onClick={sendDisableTelemetry}>DISABLE TELEMETRY</button>
  } else {
    /* If the device is not connected or the command result is false, the commands cannot be executed */
    dimmer = <div onMouseOver={sendSetDimmer} className="circularDimmer disabledElement">
    <CircularSlider
      width={200}
      label="Set Dimmer"
      min={0}
      max={100}
      dataIndex={dimmerValue}
      labelColor="#005a58"
      labelBottom={true}
      knobColor="#005a58"
      knobSize={55}
      progressColorFrom="#00bfbd"
      progressColorTo="#005a58"
      progressSize={10}
      trackColor="#eeeeee"
      trackSize={20}
      trackDraggable={true}
      onChange={(value:number) => { setDimmer(value) } } />
    </div>
    startButton = <button disabled>START</button>
    stopButton = <button disabled>STOP</button>
    enableTelemetryButton = <button disabled>ENABLE TELEMETRY</button>
    disableTelemetryButton = <button disabled>DISABLE TELEMETRY</button>
  }

  return (
    <>
      <Header />

      {/* Back Button */}
      <p onClick={closeWsConnection}><Link to="/"> Back to Devices</Link></p>

      {/* Device Info */} 
      <div className="dashboard-row">
        {ready?"":<h2>Loading device info...</h2>}
          <div className="dashboard-column" key={deviceId}>
            <div className="dashboard-card">
              <h3>{deviceId}</h3>
              <h1>{connected?<FiWifi />:<FiWifiOff />}</h1>
              <p>
                <FcAcceptDatabase /> {new Date(created_at).toLocaleString()}
              </p>
              <p>
                <FcDataBackup /> {new Date(updated_at).toLocaleString()}
              </p>
            </div>
          </div>
      </div>

      {/* Device Commands */}
      <div className="dashboard-row">
        <div className="dashboard-column" key={deviceId}>
          <div className="dashboard-card">
            <p>{connected?"Remote Commands":"The device must be connected to receive commands..."}</p>
            {dimmer}
            {startButton}
            {stopButton}
            {enableTelemetryButton}
            {disableTelemetryButton}
          </div>
        </div>
      </div>

      {/* Telemetry Chart */}
      <div className="dashboard-row">
        <div className="dashboard-column" key={deviceId}>
          <div className="dashboard-card">
            <p>Telemetry Chart</p>
            <Chart
              options={telemetryChartConfig.options}
              series={telemetryChartConfig.series}
              type="area"
              width="100%"
              height="300px"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Toast (real-time notifications) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#252525',
            color: '#dcdcdc',
            fontSize: '1rem',
          },
        }}/>
    </>
  );
}
