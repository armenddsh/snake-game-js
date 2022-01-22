import React, { useEffect, useMemo, useRef, useState } from "react";
import Grid from "./Grid";
import "./styles.css";

export default function App() {
  const interval = useRef();
  const [data, setData] = useState({
    direction: "right",
    positions: ["0-0", "0-1", "0-2", "0-3", "0-4", "0-5"],
    foodPosition: "25-30",
    points: 0
  });

  const [speed, setSpeed] = useState(200);

  const rows = useMemo(() => {
    return new Array(50).fill(null);
  }, []);

  const cols = useMemo(() => {
    return new Array(50).fill(null);
  }, []);

  useEffect(() => {
    const eventL = window.addEventListener("keyup", (event) => {
      setData((data) => {
        const userType = event.key.replace("Arrow", "").toLowerCase();
        let direction = "";
        if (userType !== data.direction) {
          if (data.direction === "up" || data.direction === "down") {
            if (userType === "left") {
              direction = "left";
            } else if (userType === "right") {
              direction = "right";
            }
          } else if (data.direction === "left" || data.direction === "right") {
            if (userType === "up") {
              direction = "up";
            } else if (userType === "down") {
              direction = "down";
            }
          }
        }

        if (!direction) {
          return data;
        } else {
          return {
            ...data,
            direction
          };
        }
      });
    });
    () => window.removeEventListener(eventL);
  }, []);

  useEffect(() => {
    interval.current = setInterval(() => {
      setData((data) => {
        const newPositions = [];
        for (let index = 1; index < data.positions.length; index++) {
          const item = data.positions[index];
          newPositions.push(item);
        }

        const [xStr, yStr] = data.positions[data.positions.length - 1].split(
          "-"
        );
        const x = parseInt(xStr, 10) | 0;
        const y = parseInt(yStr, 10) | 0;

        // check if collision
        if (data.direction === "right" && y === rows.length) {
          clearInterval(interval.current);
          return data;
        } else if (data.direction === "left" && y === 0) {
          clearInterval(interval.current);
          return data;
        } else if (data.direction === "up" && x === 0) {
          clearInterval(interval.current);
          return data;
        } else if (data.direction === "down" && x === cols.length) {
          clearInterval(interval.current);
          return data;
        }

        // collision with snake
        let nextPosition = "";
        if (data.direction === "right" && y === rows.length) {
          nextPosition = `${y + 1}-${x}`;
        } else if (data.direction === "left" && y === 0) {
          nextPosition = `${y - 1}-${x}`;
        } else if (data.direction === "up" && x === 0) {
          nextPosition = `${y}-${x - 1}`;
        } else if (data.direction === "down" && x === cols.length) {
          nextPosition = `${y}-${x + 1}`;
        }

        if (data.positions.includes(nextPosition)) {
          clearInterval(interval.current);
          return data;
        }

        // set new position
        if (data.direction === "right") {
          newPositions.push(`${x}-${y + 1}`);
        } else if (data.direction === "left") {
          newPositions.push(`${x}-${y - 1}`);
        } else if (data.direction === "up") {
          newPositions.push(`${x - 1}-${y}`);
        } else if (data.direction === "down") {
          newPositions.push(`${x + 1}-${y}`);
        }

        // check if current position is food position
        let newFoodPosition = "";
        let newPoints = data.points;
        const lastPosition = data.positions[data.positions.length - 1];
        if (lastPosition === data.foodPosition) {
          newPositions.push(data.foodPosition);
          newPoints += 10;

          function generateNewFoodPosition() {
            const x = Math.floor(Math.random() * (rows.length - 0 + 1) + 0);
            const y = Math.floor(Math.random() * (cols.length - 0 + 1) + 0);

            const newFoodPosition = x + "-" + y;
            if (data.positions.includes(newFoodPosition)) {
              return generateNewFoodPosition();
            }

            return newFoodPosition;
          }
          newFoodPosition = generateNewFoodPosition();
          clearInterval(interval.current);
          setSpeed((speed) => speed - 5);
        }

        return {
          ...data,
          positions: newPositions,
          foodPosition: newFoodPosition ? newFoodPosition : data.foodPosition,
          points: newPoints
        };
      });
    }, speed);
    () => clearInterval(interval.current);
  }, [speed, cols, rows]);

  return (
    <div className="App">
      <p className="points">Points: {data.points}</p>
      <Grid cols={cols} rows={rows} data={data}></Grid>
    </div>
  );
}
