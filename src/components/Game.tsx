import { useEffect, useRef, useState } from 'react';
//import { cave } from '../temp';
import { Polygon, createPolygon, testForCollision } from '../lib/collisionCheck';
import Gauges from './Gauges';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, setHorizontalSpeed } from '@/slices/horizontalSpeedSlice';
import { vincrement, vdecrement } from '@/slices/verticalSpeedSlice';
import { updateScore } from '@/slices/scoreSlice';
import { setGameOver, setGameWin, updateLoad } from '@/slices/gameSlice';
import { store } from '@/app/store';
import Loader from './Loader';
import { RootState } from '../app/store';
import s from '@/lib/settings';

export default function Game() {
  const loading = useSelector((state: RootState) => state.game.gameState.loading);
  const svgCanvas = useRef<SVGSVGElement>(null);
  const droneRef = useRef<SVGPolygonElement>(null);
  const wallsLeftSvg = useRef([]);
  const wallsRightSvg = useRef([]);
  const caveData = useRef([]);
  const caveDataRest = useRef([]);
  const counter = useRef(0);
  const gameStarted = useRef(false);
  const socket = useRef(null);

  const dispatch = useDispatch();

  const playerName = store.getState().game.gameState.name;
  const level = store.getState().game.gameState.level;

  let wallLeftPolygon: Polygon;
  let wallRightPolygon: Polygon;

  let verticalSpeed = 0;
  let horizontalSpeed = 0;
  let stopGame = false;

  const [start, setStart] = useState(false);

  useEffect(() => {
    init()
      .then((data) => {
        const id = data.id;
        const chankPromises = [];
        for (let i = 1; i <= 4; i++) {
          chankPromises.push(getChank(i, id));
        }
        Promise.all(chankPromises)
          .then((data) => {
            let token = '';
            data.forEach((entry) => {
              token += entry.chunk;
            });
            socket.current = new WebSocket('wss://cave-drone-server.shtoa.xyz/cave');

            socket.current.onopen = () => {
              socket.current.send(`player:${id}-${token}`);
            };

            socket.current.onmessage = (event) => {
              if (caveData.current.length < 200) {
                caveData.current.push(event.data);

                counter.current++;

                if (counter.current === 20) {
                  dispatch(updateLoad());
                  counter.current = 0;
                }
              } else {
                caveDataRest.current.push(event.data);
              }

              if (caveData.current.length >= 200 && !gameStarted.current) {
                gameStarted.current = true;
                setStart(true);
              }
            };

            socket.current.onclose = (event) => {
              if (event.code !== 3010) {
                drawCave(true);
              }
            };
          })
          .catch((err) => console.log('TOKEN ERROR: ', err));
      })
      .catch((err) => console.log('INIT ERROR: ', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (start) {
      drawCave();
      moveDrone();
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  async function init() {
    const response = await fetch('https://cave-drone-server.shtoa.xyz/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        name: playerName,
        complexity: level,
      }),
    });
    return response.json();
  }

  async function getChank(n: number, id: string) {
    const response = await fetch(`https://cave-drone-server.shtoa.xyz/token/${n}?id=${id}`);
    return response.json();
  }

  // drone dimensions
  const dd = { x1: 240, y1: 200, x2: 260, y2: 200, x3: 250, y3: 220 };
  let dronePolygon = createPolygon([
    { x: dd.x1, y: dd.y1 },
    { x: dd.x2, y: dd.y2 },
    { x: dd.x3, y: dd.y3 },
  ]);

  let dronePointsArr: number[];
  const idsSet = new Set();
  let length = 0;

  function moveDrone() {
    let dronePoints = droneRef.current.getAttributeNS(null, 'points');
    dronePointsArr = dronePoints.split(', ').map((point) => Number(point));

    if (dronePointsArr[0] < 0) {
      horizontalSpeed = 0.5;
      dispatch(setHorizontalSpeed(0.5));
    }
    if (dronePointsArr[2] > 500) {
      horizontalSpeed = -0.5;
      dispatch(setHorizontalSpeed(-0.5));
    }

    dronePoints = dronePoints
      .split(', ')
      .map((point, index) => {
        if (!(index & 1)) {
          return String(Number(point) + horizontalSpeed);
        }
        return point;
      })
      .join(', ');

    droneRef.current?.setAttributeNS(null, 'points', dronePoints);

    let points: string;
    let currentId: string;

    for (let i = 0; i < wallsLeftSvg.current.length; i++) {
      points = wallsLeftSvg.current[i].getAttributeNS(null, 'points');

      const pointsArrL = points.split(', ').map((point) => Number(point));
      points = pointsArrL
        .map((point, index) => {
          if (index & 1) {
            return String(point - verticalSpeed);
          }
          return point;
        })
        .join(', ');
      wallsLeftSvg.current[i].setAttributeNS(null, 'points', points);

      points = wallsRightSvg.current[i].getAttributeNS(null, 'points');
      const pointsArrR = points.split(', ').map((point) => Number(point));
      points = pointsArrR
        .map((point, index) => {
          if (index & 1) {
            return String(Number(point) - verticalSpeed);
          }
          return point;
        })
        .join(', ');
      wallsRightSvg.current[i].setAttributeNS(null, 'points', points);
      let colisionDetected = false;
      if (pointsArrL[1] < dd.y3 && pointsArrL[5] >= dd.y1) {
        dronePolygon = createPolygon([
          { x: dronePointsArr[0], y: dronePointsArr[1] },
          { x: dronePointsArr[2], y: dronePointsArr[3] },
          { x: dronePointsArr[4], y: dronePointsArr[5] },
        ]);

        wallLeftPolygon = createPolygon([
          { x: pointsArrL[0], y: pointsArrL[1] },
          { x: pointsArrL[2], y: pointsArrL[3] },
          { x: pointsArrL[4], y: pointsArrL[5] },
          { x: pointsArrL[6], y: pointsArrL[7] },
        ]);
        wallRightPolygon = createPolygon([
          { x: pointsArrR[0], y: pointsArrR[1] },
          { x: pointsArrR[2], y: pointsArrR[3] },
          { x: pointsArrR[4], y: pointsArrR[5] },
          { x: pointsArrR[6], y: pointsArrR[7] },
        ]);
        colisionDetected =
          testForCollision(dronePolygon, wallLeftPolygon) ||
          testForCollision(dronePolygon, wallRightPolygon);
        if (colisionDetected) {
          stopGame = true;
          socket.current.close(3010);
          dispatch(setGameOver(true));
        }
        if (pointsArrL[1] < dd.y1) {
          currentId = wallsLeftSvg.current[i].getAttributeNS(null, 'id');
          idsSet.add(currentId);
          if (Array.from(idsSet).length > length) {
            dispatch(updateScore(3 * (verticalSpeed + level)));
            length = Array.from(idsSet).length;
            if (
              Array.from(idsSet).length >=
              caveData.current.length + caveDataRest.current.length - 5
            ) {
              stopGame = true;
              dispatch(setGameOver(true));
              dispatch(setGameWin(true));
            }
          }
        }
      }
    }

    if (!stopGame) {
      requestAnimationFrame(moveDrone);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      if (horizontalSpeed < s.HORIZONTAL_SPEED_LIMIT) {
        horizontalSpeed += 0.5;
        dispatch(increment());
      }
    }

    if (e.key === 'ArrowLeft') {
      if (horizontalSpeed > -s.HORIZONTAL_SPEED_LIMIT) {
        horizontalSpeed -= 0.5;
        dispatch(decrement());
      }
    }

    if (e.key === 'ArrowUp') {
      if (verticalSpeed < s.VERTICAL_SPEED_LIMIT) {
        verticalSpeed += s.VERTICAL_SPEED;
        dispatch(vincrement());
      }
    }

    if (e.key === 'ArrowDown') {
      if (verticalSpeed > 0) {
        verticalSpeed -= s.VERTICAL_SPEED;
        dispatch(vdecrement());
      }
    }
  }

  function drawCave(update = false) {
    let y = 0;
    let cave = [];
    caveData.current.push('finished');
    let idDelta = 0;

    if (update) {
      const points = wallsLeftSvg.current[wallsLeftSvg.current.length - 1].getAttributeNS(
        null,
        'points',
      );
      idDelta = Number(
        wallsLeftSvg.current[wallsLeftSvg.current.length - 1].getAttributeNS(null, 'id'),
      );
      y = Number(points.split(', ')[1]) + s.Y_DELTA;
      cave = caveDataRest.current;
    } else {
      y = 300;
      cave = caveData.current;
    }
    for (let i = 0; i < cave.length; i++) {
      if (cave[i] !== 'finished' && cave[i + 1] !== 'finished') {
        let wallLeft1: number;
        let wallLeft2: number;
        let wallRight1: number;
        let wallRight2: number;
        if (update) {
          if (i === 0) {
            wallLeft1 = Number(caveData.current[caveData.current.length - 3].split(',')[0]);
            wallLeft2 = Number(cave[i + 1].split(',')[0]);
            wallRight1 = Number(caveData.current[caveData.current.length - 3].split(',')[1]);
            wallRight2 = Number(cave[i + 1].split(',')[1]);
          } else {
            wallLeft1 = Number(cave[i].split(',')[0]);
            wallLeft2 = Number(cave[i + 1].split(',')[0]);
            wallRight1 = Number(cave[i].split(',')[1]);
            wallRight2 = Number(cave[i + 1].split(',')[1]);
          }
        } else {
          wallLeft1 = Number(cave[i].split(',')[0]);
          wallLeft2 = Number(cave[i + 1].split(',')[0]);
          wallRight1 = Number(cave[i].split(',')[1]);
          wallRight2 = Number(cave[i + 1].split(',')[1]);
        }
        let newPoligon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        newPoligon.setAttribute(
          'points',
          `0, ${y}, ${250 + wallLeft1}, ${y}, ${250 + wallLeft2}, ${y + s.Y_DELTA}, 0, ${
            y + s.Y_DELTA
          }`,
        );
        newPoligon.setAttribute('id', String(i + idDelta + 1));
        wallsLeftSvg.current.push(newPoligon);

        newPoligon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        newPoligon.setAttribute(
          'points',
          `${250 + wallRight1}, ${y}, 500, ${y}, 500, ${y + s.Y_DELTA}, ${250 + wallRight2}, ${
            y + s.Y_DELTA
          }`,
        );
        wallsRightSvg.current.push(newPoligon);
        y += s.Y_DELTA;
      }
    }

    for (let i = 0; i < wallsLeftSvg.current.length; i++) {
      svgCanvas.current.appendChild(wallsLeftSvg.current[i]);
      svgCanvas.current.appendChild(wallsRightSvg.current[i]);
    }

    svgCanvas.current.appendChild(droneRef.current);
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md">
          <svg ref={svgCanvas} width={500} height={700} fill="#5E81AC">
            <rect x="0" y="0" width="500" height="700" fill="#8FBCBB" />
            <polygon
              id="drone"
              ref={droneRef}
              points={`${dd.x1}, ${dd.y1}, ${dd.x2}, ${dd.y2}, ${dd.x3}, ${dd.y3}`}
              fill="#4C566A"
            />
          </svg>
          <div className="absolute bottom-0 bg-[#81A1C1] w-[500px] h-[100px] bg-opacity-90">
            <Gauges />
          </div>
        </div>
      )}
    </>
  );
}
