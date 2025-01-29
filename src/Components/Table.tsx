import style from "./style.module.css";
import { useEffect, useState } from "react";
import { useMatrix } from "../Context/MatrixContext";
import { Cell, CellId } from "../Types/Types";
import {
  calculatePercentile,
  calculateRowSum,
  findClosestCells,
  generateMatrix,
} from "../Utils/generateMatrix";

export const Table: React.FC = () => {
  const { matrix, setMatrix } = useMatrix();
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<CellId>>(
    new Set()
  );
  const X = 5;

  const addRow = () => {
    setMatrix((prev: any) => {
      const newRow = generateMatrix(1, prev.length > 0 ? prev[0].length : 5)[0];

      const updatedRow = newRow.map((cell, index) => ({
        ...cell,
        id: `${Date.now()}-${index}`,
      }));

      if (prev.length === 0) {
        return [[...updatedRow]];
      }

      return [...prev, updatedRow];
    });
  };

  const deleteRow = (index: number) => {
    setMatrix((prev) => {
      const newMatrix = prev.filter((_, i) => i !== index);

      if (newMatrix.length === 0) {
        setHoveredCell(null);
        setHighlightedCells(new Set());
      }

      return newMatrix;
    });
  };

  const updateCell = (rowIndex: number, colIndex: number) => {
    setMatrix((prev) => {
      const newMatrix = [...prev];
      newMatrix[rowIndex][colIndex] = {
        ...newMatrix[rowIndex][colIndex],
        amount: newMatrix[rowIndex][colIndex].amount + 1,
      };
      return newMatrix;
    });
  };

  useEffect(() => {
    if (hoveredCell && matrix.length > 0) {
      const closestCells = findClosestCells(matrix, hoveredCell.amount, X);
      setHighlightedCells(new Set(closestCells.map((cell) => cell.id)));
    } else {
      setHighlightedCells(new Set());
    }
  }, [hoveredCell, matrix]);

  const columnPercentiles = matrix[0]?.map((_, colIndex) =>
    calculatePercentile(
      matrix.map((row) => row[colIndex].amount),
      50
    )
  );

  return (
    <div className={style.appContainer}>
      <table>
        <thead>
          <tr>
            {matrix[0]?.map((_, colIndex) => (
              <th key={colIndex} className={style.textStyleForHead}>
                Col {colIndex + 1}
              </th>
            ))}
            {matrix[0] && <th className={style.textStyleForHead}>Sum</th>}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => {
            const rowSum = calculateRowSum(row);
            return (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isHighlighted = highlightedCells.has(cell.id);
                  const backgroundColor = isHighlighted
                    ? "blue"
                    : "transparent";
                  const percentage = ((cell.amount / rowSum) * 100).toFixed(0);

                  return (
                    <td
                      key={cell.id}
                      onClick={() => updateCell(rowIndex, colIndex)}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        backgroundColor,
                      }}
                      className={style.stylesForX}
                    >
                      {hoveredCell?.id === cell.id
                        ? `${percentage}%`
                        : cell.amount}
                    </td>
                  );
                })}
                <td className={style.styleForSumm}>{rowSum}</td>
                <td>
                  <button
                    className={style.styleForButton}
                    onClick={() => deleteRow(rowIndex)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {columnPercentiles && (
            <tr>
              {columnPercentiles.map((percentile, index) => (
                <td key={index} className={style.stylesForProcent}>
                  {percentile}
                </td>
              ))}
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      <button className={style.styleForButton} onClick={addRow}>
        Add Row
      </button>
    </div>
  );
};
