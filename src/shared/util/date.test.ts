import { describe, expect, it } from 'vitest'
import { getDayjs } from './date'
import dayjs from 'dayjs'

describe('getDayjs', () => {
  it('date format', () => {
    const result = getDayjs('20240131', 'YYYYMMDD')
    expect(dayjs.isDayjs(result)).toBe(true)
    expect(result.year()).toBe(2024)
    expect(result.month()).toBe(0) // 1月
    expect(result.date()).toBe(31)
  })

  it('date time format', () => {
    const result = getDayjs('20240131123456', 'YYYYMMDDhhmmss')
    expect(dayjs.isDayjs(result)).toBe(true)
    expect(result.year()).toBe(2024)
    expect(result.month()).toBe(0) // 1月
    expect(result.date()).toBe(31)
    expect(result.hour()).toBe(12)
    expect(result.minute()).toBe(34)
    expect(result.second()).toBe(56)
  })

  it('invalid format', () => {
    // TODO
    expect(true).toBe(false)
  })
})
