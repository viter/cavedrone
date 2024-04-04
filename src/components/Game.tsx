import { useEffect, useRef } from 'react';
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

export default function Game() {
  const loading = useSelector((state: RootState) => state.game.gameState.loading);
  const svgCanvas = useRef<SVGSVGElement>(null);
  const droneRef = useRef<SVGPolygonElement>(null);
  const wallsLeftSvg = useRef([]);
  const wallsRightSvg = useRef([]);
  const caveData = useRef([]);
  const counter = useRef([]);

  const dispatch = useDispatch();

  const yDelta = 30;
  const playerName = store.getState().game.gameState.name;
  const level = store.getState().game.gameState.level;

  let wallLeftPolygon: Polygon;
  let wallRightPolygon: Polygon;

  let verticalSpeed = 0;
  let horizontalSpeed = 0;
  let stopGame = false;

  //const [start, setStart] = useState(false);

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
            const socket = new WebSocket('wss://cave-drone-server.shtoa.xyz/cave');

            socket.addEventListener('open', () => {
              socket.send(`player:${id}-${token}`);
            });

            socket.addEventListener('message', (event) => {
              caveData.current.push(event.data);

              counter.current.push(0);

              if (counter.current.length === 100) {
                dispatch(updateLoad());
                counter.current = [];
              }
            });

            socket.addEventListener('close', () => {
              moveDrone();
              drawCave();
            });
          })
          .catch((err) => console.log('TOKEN ERROR: ', err));
      })
      .catch((err) => console.log('INIT ERROR: ', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          dispatch(setGameOver(true));
        }
        if (pointsArrL[1] < dd.y1) {
          currentId = wallsLeftSvg.current[i].getAttributeNS(null, 'id');
          idsSet.add(currentId);
          if (Array.from(idsSet).length > length) {
            dispatch(updateScore(3 * (verticalSpeed + level)));
            length = Array.from(idsSet).length;
            if (Array.from(idsSet).length >= caveData.current.length - 2) {
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
      if (horizontalSpeed < 3) {
        horizontalSpeed += 0.5;
        dispatch(increment());
      }
    }

    if (e.key === 'ArrowLeft') {
      if (horizontalSpeed > -3) {
        horizontalSpeed -= 0.5;
        dispatch(decrement());
      }
    }

    if (e.key === 'ArrowUp') {
      if (verticalSpeed < 10) {
        verticalSpeed += 2;
        dispatch(vincrement());
      }
    }

    if (e.key === 'ArrowDown') {
      if (verticalSpeed > 0) {
        verticalSpeed -= 2;
        dispatch(vdecrement());
      }
    }
  }

  function drawCave() {
    let y = 300;
    for (let i = 0; i < caveData.current.length; i++) {
      if (caveData.current[i] !== 'finished' && caveData.current[i + 1] !== 'finished') {
        const wallLeft1 = Number(caveData.current[i].split(',')[0]);
        const wallLeft2 = Number(caveData.current[i + 1].split(',')[0]);
        const wallRight1 = Number(caveData.current[i].split(',')[1]);
        const wallRight2 = Number(caveData.current[i + 1].split(',')[1]);

        let newPoligon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        newPoligon.setAttribute(
          'points',
          `0, ${y}, ${250 + wallLeft1}, ${y}, ${250 + wallLeft2}, ${y + yDelta}, 0, ${y + yDelta}`,
        );
        newPoligon.setAttribute('id', String(i + 1));
        wallsLeftSvg.current.push(newPoligon);

        newPoligon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        newPoligon.setAttribute(
          'points',
          `${250 + wallRight1}, ${y}, 500, ${y}, 500, ${y + yDelta}, ${250 + wallRight2}, ${
            y + yDelta
          }`,
        );
        wallsRightSvg.current.push(newPoligon);
        y += yDelta;
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
