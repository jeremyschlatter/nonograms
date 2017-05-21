import React, { Component } from 'react'
import './App.css'
import update from 'immutability-helper'

const Space = ({width, height}) => (
  <div style={{display: 'block', width, height}}/>
)

class Puzzle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: new Array(props.rows.length).fill(0).map(_ => new Array(props.cols.length).fill(0)),
      rowMarks: new Set(),
      colMarks: new Set(),
      message: '',
      messageColor: '',
    }
  }

  // Experimental syntax.
  // See https://babeljs.io/docs/plugins/transform-class-properties/
  // and https://facebook.github.io/react/docs/handling-events.html
  check = () => {
    const {rows, cols, solution} = this.props
    const {grid} = this.state

    let remaining = 0
    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < cols.length; col++) {
        if (grid[row][col] === 1) {
          if (solution[row][col] !== 1) {
            this.setState({message: 'There are mistakes somewhere.', messageColor: 'red'})
            return
          }
        } else if (solution[row][col] === 1) {
          remaining++
        }
      }
    }
    if (remaining === 0) {
      this.setState({message: 'Congratulations! You solved it.', messageColor: 'green'})
    } else {
      this.setState({message: `So far so good! ${remaining} to go`, messageColor: 'green'})
    }
  }

  render() {
    const {rows, cols} = this.props
    const {grid, message, messageColor} = this.state
    const cellSize = 20
    let maxRow = -1
    for (let row of rows) {
      if (row.length > maxRow) {
        maxRow = row.length
      }
    }
    let maxCol = -1
    for (let col of cols) {
      if (col.length > maxCol) {
        maxCol = col.length
      }
    }
    const width = cellSize * (cols.length + maxRow)
    const height = cellSize * (rows.length + maxCol)
    const thickBorder = 'solid 2px black'
    const thinBorder = 'solid 1px black'
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        { /* validation message */ }
        <span style={{color: messageColor}}>{message}</span>
        <Space height={20}/>

        { /* main puzzle box */ }
        <div style={{
          width,
          height,
          position: 'relative',
          border: thickBorder,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
        }}>

          { /* column headers */ }
          <div style={{
            position: 'absolute',
            top: -2,
            left: -2,
            width,
            height: maxCol * cellSize,
            borderBottom: thickBorder,
          }}>
            <div style={{display: 'inline-block', width: width - cols.length * cellSize}}/>
            {cols.map((col, colIdx) => (
              <div
                key={colIdx}
                style={{
                  width: cellSize,
                  height: '100%',
                  borderLeft: colIdx && thinBorder,
                  display: 'inline-flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  verticalAlign: 'top',
                }}
              >
                {col.map((n, nIdx) => (
                  <div
                    key={nIdx}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      fontWeight: 'bold',
                      color: this.state.colMarks.has(`${colIdx}-${nIdx}`) ? 'red' : 'black',
                      cursor: 'default',
                    }}
                    onClick={_ => {
                      const key = `${colIdx}-${nIdx}`
                      let newMarks = new Set(this.state.colMarks)
                      if (newMarks.has(key)) {
                        newMarks.delete(key)
                      } else {
                        newMarks.add(key)
                      }
                      this.setState({colMarks: newMarks})
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            ))}
          </div>

          { /* row headers */ }
          <div style={{
            position: 'absolute',
            top: -2,
            left: -2,
            width: maxRow * cellSize,
            height,
            borderRight: thickBorder,
          }}>
            <div style={{height: height - rows.length * cellSize}}/>
            {rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  width: '100%',
                  height: cellSize,
                  borderTop: rowIdx && thinBorder,
                  display: 'inline-flex',
                  justifyContent: 'flex-end',
                }}
              >
                {row.map((n, nIdx) => (
                  <div
                    key={nIdx}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      fontWeight: 'bold',
                      color: this.state.rowMarks.has(`${rowIdx}-${nIdx}`) ? 'red' : 'black',
                      cursor: 'default',
                    }}
                    onClick={_ => {
                      const key = `${rowIdx}-${nIdx}`
                      let newMarks = new Set(this.state.rowMarks)
                      if (newMarks.has(key)) {
                        newMarks.delete(key)
                      } else {
                        newMarks.add(key)
                      }
                      this.setState({rowMarks: newMarks})
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            ))}
          </div>

          { /* grid headers */ }
          <div style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
          }}>
            {grid.map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  height: cellSize,
                  display: 'flex',
                  borderTop: rowIdx && thinBorder,
                }}
              >
                {row.map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    style={{
                      width: cellSize,
                      borderLeft: colIdx && thinBorder,
                      cursor: 'pointer',
                      backgroundColor: cell === 1 ? 'black' : '',
                      color: 'red',
                    }}
                    onClick={_ => {
                      let newCell
                      if (cell === 1) {
                        newCell = 0
                      } else {
                        newCell = 1
                      }
                      this.setState(update(this.state, {
                        grid: {[rowIdx]: {[colIdx]: {$set: newCell}}}
                      }))
                    }}
                    onContextMenu={e => {
                      e.preventDefault()
                      let newCell
                      if (cell === -1) {
                        newCell = 0
                      } else {
                        newCell = -1
                      }
                      this.setState(update(this.state, {
                        grid: {[rowIdx]: {[colIdx]: {$set: newCell}}}
                      }))
                    }}
                  >
                    { cell === -1 ? 'X' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        { /* buttons */ }
        <Space height={20}/>
        <button
          style={{
            width: 100,
          }}
          onClick={this.check}
        >
          Check
        </button>
      </div>

    )
  }
}

class App extends Component {
  render() {
    return (
      <Puzzle
        solution={[
          [0, 0, 0, 1, 1],
          [0, 0, 0, 0, 1],
          [1, 1, 1, 1, 0],
          [1, 1, 0, 0, 0],
          [1, 1, 0, 1, 1],
        ]}
        rows={[
          [2],
          [1],
          [4],
          [2],
          [2, 2],
        ]}
        cols={[
          [3],
          [3],
          [1],
          [1, 1, 1],
          [2, 1],
        ]}
      />
    )
  }
}

export default App
