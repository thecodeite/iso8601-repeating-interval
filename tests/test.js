const demand = require('must')
const moment = require('moment')

const makeInterval = require('../index')

demand.prototype.sameDateAs = function (expected) {
  expected = moment(expected)
  this.assert(expected.isSame(this.actual), 'must be same as date ' + expected.format())
  return this
}

describe('reading iso 8601 string without recurence', () => {
  it('should read a simple date', () => {
    const interval = makeInterval('2017-01-01')

    demand(interval._repeatCount).must.equal(1)
    demand(interval._start).must.be.sameDateAs('2017-01-01')
    demand(interval._end).must.be.sameDateAs('2017-01-01')
    demand(interval._duration).must.be.undefined()
  })

  describe('firstAfter', () => {
    it('should return start date for pre start', () => {
      const interval = makeInterval('2017-01-01')
      const date = moment('2016-01-01')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.sameDateAs('2017-01-01')
      demand(result.index).must.equal(0)
    })

    it('should return undefined for after', () => {
      const interval = makeInterval('2017-01-01')
      const date = moment('2018-01-01')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.undefined()
      demand(result.index).must.be.undefined()
    })
  })
})

describe('reading iso 8601 string with recurence', () => {
  it('should read a simple forward repeating interval', () => {
    const interval = makeInterval('R/2017-01-01/P3M')

    demand(interval._repeatCount).must.equal(Infinity)
    demand(interval._start).must.be.sameDateAs('2017-01-01')
    demand(interval._end).must.be.undefined()
    demand(interval._duration.months()).must.equal(3)
  })

  it('should read a simple backwards repeating interval', () => {
    const interval = makeInterval('R/P3M/2017-01-01')

    demand(interval._repeatCount).must.equal(Infinity)
    demand(interval._start).must.be.undefined()
    demand(interval._end).must.be.sameDateAs('2017-01-01')
    demand(interval._duration.months()).must.equal(3)
  })

  describe('firstAfter', () => {
    it('should return start date for pre start', () => {
      const interval = makeInterval('R/2017-01-01/P3M')
      const date = moment('2016-01-01')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.sameDateAs('2017-01-01')
      demand(result.index).must.equal(0)
    })

    it('should return start date for same as start', () => {
      const interval = makeInterval('R/2017-01-01/P3M')
      const date = moment('2017-01-01')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.sameDateAs('2017-01-01')
      demand(result.index).must.equal(0)
      // console.log('result:', result)
    })

    it('should return next date for one second firstAfter start', () => {
      const interval = makeInterval('R/2017-01-01/P3M')
      const date = moment('2017-01-01')
      date.add(1, 'second')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.sameDateAs('2017-04-01')
      demand(result.index).must.equal(1)
      // console.log('result:', result)
    })

    it('should return a year for 12 months', () => {
      const interval = makeInterval('R/2017-01-01/P3M')
      const date = moment('2017-12-30')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.sameDateAs('2018-01-01')
      demand(result.index).must.equal(4)
      // console.log('result:', result)
    })

    it('should not take too long to do a day of seconds', () => {
      const interval = makeInterval('R/2017-01-01/PT1S')
      const date = moment('2017-01-02')

      const result = interval.firstAfter(date)
      demand(result.date).must.be.sameDateAs('2017-01-02')
      demand(result.index).must.equal(86400)
    })
  })
})
