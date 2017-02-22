# iso8601-repeating-interval

A module for parsing ISO 8601:2004 dates that involve a repeating interval.

Read about ISO 8601 Repeating Intervals over on [Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals)

Also, the PDF of the actual ISO Standard is floating around if you google for it.

## Installation
`npm install iso8601-repeating-interval --save`

## Usage
```javascript
const makeInterval = require('iso8601-repeating-interval')

const interval = makeInterval('R/2017-01-01/P3M')
console.log(interval.firstAfter('2017-06-05'))
//{
//  index: 2,
//  date: moment("2017-07-01T00:00:00.000")
//}
```

## Rational
I really like https://github.com/enriched/repeating-interval but it handles months in a way I don't like.
A month is converted to a fix duration of 30 days which means ```R/2017-01-15/P1M``` returns the following dates:
```
2017-01-15,2017-02-14,2017-03-16
```
I.e. the day of the month changes depending on month length.

This package returns as follows:
```
2017-01-15,2017-02-15,2017-03-15
```
