import React, { useMemo } from "react";

import "./grid.css";

export default function (props) {
  const { rows, cols, data } = props;
  const containsValue = useMemo(
    () => (rowIndex, colIndex) => {
      const pos = `${rowIndex}-${colIndex}`;
      const exists = data.positions.includes(pos) || data.foodPosition === pos;
      return exists ? "fill" : "";
    },
    [data]
  );

  return (
    <div className="grid">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="rows">
          {cols.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`cols ${containsValue(rowIndex, colIndex)}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
