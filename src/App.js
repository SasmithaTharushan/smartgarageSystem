import React, { useState, useEffect } from 'react';
import { db, ref, onValue, set } from './firebase';
import './style.css';


const App = () => {
    const [gasLevel, setGasLevel] = useState("Loading...");
    const [gasStatus, setGasStatus] = useState("Loading...");
    const [humidity,setHumidity]=useState("Loading...");
    const [temperature,setTemperature]=useState("Loading...");
    const [door,setDoor]=useState("Loading...");
    const [mq7,setMQ7]=useState("Loading...");
    const [fan,setFan]=useState("Loading...");
    const [light,setLight]=useState("Loading...");
    const [mq7status,setMQ7Status]=useState("Loading...");
    const [pir,setpir]=useState("Loading...");
    const [rfidid,setrfidid]=useState("Loading...");
    const [pump,setPump]=useState("Loading...");
    const [rfidstatus,setrfidstatus]=useState("Loading...");
    const [waterlevelstatus,setWaterLevelStatus]=useState("Loading...");
    const [servoState, setServoState] = useState("OFF");

    const toggleServo = () => {
        const newState = servoState === "On" ? "Off" : "On";
        set(ref(db, 'GarageServo/ServoStatus'), newState)
            .then(() => {
                console.log("Servo state updated successfully");
                setServoState(newState);
            })
            .catch((error) => {
                console.error("Error updating servo state:", error);
            });
    };

    useEffect(() => {
        // Create a reference to the Firebase paths you want to listen to
        const gasLevelRef = ref(db, 'GasSensorMQ2/GasLevel');
        const gasStatusRef = ref(db, 'GasSensorMQ2/GasStatus');
        const humidityRef = ref(db, 'DHT11/Humidity');
        const temperatureRef = ref(db, 'DHT11/Temperature');
        const doorRef = ref(db, 'Door/DoorStatus');
        const mq7Ref = ref(db, 'GasSensorMQ7/GasLevel');
        const mq7status = ref(db, 'GasSensorMQ7/GasStatus');
        const pir = ref(db, 'MotionSensor/MotionDetected');
        const fan = ref(db, 'Fan/FanStatus');
        const pump = ref(db, 'WaterPump/RelayStatus');
        const light = ref(db, 'Lights/LightStatus');
        const rfidid = ref(db,'RFID/CardUID');
        const waterlevelstatus = ref(db,'WaterLevelSensor/Value');
        const rfidstatus = ref(db,'RFID/AccessStatus');
        const servoRef = ref(db, 'GarageServo/ServoStatus');

        // Listen for changes to the gas level
        onValue(gasLevelRef, (snapshot) => {
            const gasData = snapshot.val();
            setGasLevel(gasData);
        });

        onValue(servoRef, (snapshot) => {
            const data = snapshot.val();
            setServoState(data);
        });

        // Listen for changes to the gas level
        onValue(pump, (snapshot) => {
            const pumpData = snapshot.val();
            setPump(pumpData);
        });

        // Listen for changes to the gas level
        onValue(waterlevelstatus, (snapshot) => {
            const waterData = snapshot.val();
            setWaterLevelStatus(waterData);
        });

        onValue(light, (snapshot) => {
            const lightData = snapshot.val();
            setLight(lightData);
        });

        onValue(fan, (snapshot) => {
            const fanData = snapshot.val();
            setFan(fanData);
        });

        onValue(rfidid, (snapshot) => {
            const rfidData = snapshot.val();
            setrfidid(rfidData);
        });

        onValue(rfidstatus, (snapshot) => {
            const rfidstatusData = snapshot.val();
            setrfidstatus(rfidstatusData);
        });

        onValue(mq7Ref, (snapshot) => {
            const mq7Data = snapshot.val();
            setMQ7(mq7Data);
        });

        onValue(mq7status, (snapshot) => {
            const mq7DataStatus = snapshot.val();
            setMQ7Status(mq7DataStatus);
        });

        onValue(pir, (snapshot) => {
            const pirData = snapshot.val();
            setpir(pirData);
        });

        onValue(doorRef, (snapshot) => {
            const doorData = snapshot.val();
            setDoor(doorData);
        });

        onValue(temperatureRef, (snapshot) => {
            const tempData = snapshot.val();
            setTemperature(tempData);
        });

        onValue(humidityRef,(snapshot)=>{
            const  humidityData = snapshot.val();
            setHumidity(humidityData);
        })


        // Listen for changes to the gas status
        onValue(gasStatusRef, (snapshot) => {
            const gasStatusData = snapshot.val();
            setGasStatus(gasStatusData); // Correct state update
        });
    }, []);

    return (
        <div className="smart-garage">
            <header>
                <h1>𝙎𝙈𝘼𝙍𝙏 𝙂𝘼𝙍𝘼𝙂𝙀</h1>
            </header>
            <div className="data-section">
                <div className="data-item">
                    <span className="label">ꜱᴍᴏᴋᴇ ʟᴇᴠᴇʟ:</span>
                    <span className="value">{gasLevel}</span>
                </div>

                <div className="data-item">
                    <span className="label">ʜᴜᴍɪᴅɪᴛʏ:</span>
                    <span className="value">{humidity}</span>
                </div>

                <div className="data-item">
                    <span className="label">ᴄᴏ-ɢᴀꜱ ʟᴇᴠᴇʟ:</span>
                    <span className="value">{mq7}</span>
                </div>

                <div className="data-item">
                    <span className="label">♨ ꜱᴍᴏᴋᴇ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{gasStatus}</span>
                </div>

                <div className="data-item">
                    <span className="label"> ❆ ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ:</span>
                    <span className="value">{temperature}</span>
                </div>

                <div className="data-item">
                    <span className="label"> ⚠ ᴄᴏ-ɢᴀꜱ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{mq7status}</span>
                </div>

                <div className="data-item">
                    <span className="label">ᴡᴀᴛᴇʀ ᴘᴜᴍᴘ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{pump}</span>
                </div>

                <div className="data-item">
                    <span className="label">ᴅᴏᴏʀ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{door}</span>
                </div>

                <div className="data-item">
                    <span className="label">ℜꜰɪᴅ ᴛᴀɢ:</span>
                    <span className="value">{rfidid}</span>
                </div>


                <div className="data-item">
                    <span className="label">ᴍᴏᴛɪᴏɴ:</span>
                    <span className="value">{pir}</span>
                </div>


                <div className="data-item">
                    <span className="label"> 𖣘 ꜰᴀɴ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{fan}</span>
                </div>

                <div className="data-item">
                    <span className="label">ℜꜰɪᴅ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{rfidstatus}</span>
                </div>


                <div className="data-item">
                    <span className="label">⚡︎ ʟɪɢʜᴛ ꜱᴛᴀᴛᴜꜱ:</span>
                    <span className="value">{light}</span>
                </div>


                <div className="data-item">
                    <span className="label">ᴡᴀᴛᴇʀ ʟᴇᴠᴇʟ:</span>
                    <span className="value">{waterlevelstatus}</span>
                </div>

                <div className="data-item">
                    <button className={"button"} onClick={toggleServo}>
                        ᴅᴏᴏʀ : {servoState === "ON" ? "ʟᴏᴄᴋ" : "ᴜɴʟᴏᴄᴋ"}
                    </button>
                </div>

            </div>
        </div>
    );

};

export default App;
