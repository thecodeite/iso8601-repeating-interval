"use strict"

const moment = require('moment')

Object.getPrototypeOf(moment.duration(0)).times = function (factor) {
  return moment.duration({
    seconds: this._data.seconds * factor,
    minutes: this._data.minutes * factor,
    hours: this._data.hours * factor,
    days: this._data.days * factor,
    months: this._data.months * factor,
    years: this._data.years * factor
  })
}

function readIso8601String (iso8601String) {
  const data = {}
  const parts = iso8601String.split('/')
  const repeat = parts[0]
  const partA = parts[1]
  const partB = parts[2]

  if (repeat === 'R') {
    data.repeatCount = Infinity
  } else {
    data.repeatCount = parseInt(repeat.substr(1))
  }

  if (partA.startsWith('P')) {
    data.duration = moment.duration(partA)
    if (partB) data.end = moment(partB)
  } else {
    data.start = moment(partA)
    if (partB.startsWith('P')) {
      data.duration = moment.duration(partB)
    } else {
      data.end = moment(partB)
    }
  }

  return data
}

class Iso8601RepeatingInterval {
  constructor (repeatCount, start, end, duration) {
    this._repeatCount = repeatCount
    this._start = start
    this._end = end
    this._duration = duration
  }

  firstAfter (date) {
    date = moment(date)
    if (this._end && date.isAfter(this._end)) return undefined
    if (this._start && date.isSameOrBefore(this._start)) return {index: 0, date: this._start.clone()}

    let index = 0
    let cursor = this._start.clone()

    do {
      index++
      //if (index > this._repeat) ;

      cursor = this._start.clone().add(this._duration.times(index))
    } while (cursor.isBefore(date))

    return {index, date: cursor}
  }
}

module.exports = function (iso8601String) {
  const data = readIso8601String(iso8601String)
  return new Iso8601RepeatingInterval(data.repeatCount, data.start, data.end, data.duration)
}

