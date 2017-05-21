import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import update from 'immutability-helper'

class Puzzle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: new Array(props.rows.length).fill(0).map(_ => new Array(props.cols.length).fill(0)),
      rowMarks: new Set(),
      colMarks: new Set(),
    }
  }

  render() {
    const {rows, cols} = this.props
    const {grid} = this.state
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
        width,
        height,
        position: 'relative',
        border: thickBorder,
        marginLeft: 'auto',
        marginRight: 'auto',
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
                  { cell == -1 ? 'X' : ''}
                </div>
              ))}
            </div>
          ))}
      </div>

      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Puzzle
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
      </div>
    )
  }
}

export default App
