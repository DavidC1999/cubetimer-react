import React, { useEffect, useState } from 'react';

import './App.css';

import Settings from './Settings';

import 'bootswatch/dist/darkly/bootstrap.css';

import {
  Container,
  Row,
  Col
} from 'reactstrap';

import Timer from './components/Timer';
import CustomNavbar from './components/CustomNavbar';
import TimeList from './components/TimeList';
import StatsList from './components/StatsList';
import Scramble from './components/Scramble';
import ManualTimes from './components/ManualTimes';

function App() {
  const [settings, setSettings] = useState(new Settings())

  const [timeList, setTimeList] = useState([]);


  const [scramble, setScramble] = useState("");

  const selectTimer = () => {
    if(manualTimes) {
      return <ManualTimes setTimeList={setTimeList} scramble={scramble} />;
    } else {
      return <Timer settings={settings} setTimeList={setTimeList} scramble={scramble} />;
    }
  }

  return (
    <div className="app">
      <CustomNavbar settings={settings} setSettings={setSettings} />

      <Container className="mt-3">
        <Scramble settings={settings} scramble={scramble} setScramble={setScramble} />
        {selectTimer()}
        <Row>
          <Col>
            <TimeList timeList={timeList} setTimeList={setTimeList} />
          </Col>
          <Col>
            <StatsList timeList={timeList} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App;
