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

function App() {
  const [settings, setSettings] = useState(new Settings())

  const [timeList, setTimeList] = useState([]);


  const [scramble, setScramble] = useState("");

  return (
    <div className="app">
      <CustomNavbar settings={settings} setSettings={setSettings} />

      <Container className="mt-3">
        <Scramble settings={settings} scramble={scramble} setScramble={setScramble}/>
        <Timer settings={settings} setTimeList={setTimeList} scramble={scramble} />

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
