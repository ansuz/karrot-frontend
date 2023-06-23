import { dom } from 'quasar'
import { vi } from 'vitest'
const { height } = dom
const mockPlatform = { is: { } }

vi.mock('quasar', () => {
  const original = jest.requireActual('quasar')

  return {
    ...original,
    Platform: mockPlatform,
  }
})

describe('detectMobileKeyboard', () => {
  let originalWindowAddEventListener, detectMobileKeyboard

  beforeEach(async () => {
    vi.resetModules()
    originalWindowAddEventListener = window.addEventListener
    window.addEventListener = vi.fn().mockImplementation(function () {
      originalWindowAddEventListener.apply(window, arguments)
    })
    detectMobileKeyboard = (await import('./detectMobileKeyboard')).default
  })

  afterEach(() => {
    window.addEventListener = originalWindowAddEventListener
  })

  describe('desktop', () => {
    beforeEach(() => { mockPlatform.is.mobile = false })
    it('defaults to closed', () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
    it('does not register resize handler', () => {
      expect(window.addEventListener).not.toBeCalledWith('resize', expect.any(Function))
    })
    it('says closed even if size changes by >150', async () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
      window.innerHeight = height(window) - 151
      window.dispatchEvent(new Event('resize'))
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
  })

  describe('mobile', () => {
    beforeEach(() => { mockPlatform.is.mobile = true })
    it('defaults to closed', () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
    it('registers resize handler', () => {
      expect(window.addEventListener).toBeCalledWith('resize', expect.any(Function))
    })
    it('says closed if size changes by <=150', async () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
      window.innerHeight = height(window) - 150
      window.dispatchEvent(new Event('resize'))
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
    it('says open if size changes by >150', async () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
      window.innerHeight = height(window) - 151
      window.dispatchEvent(new Event('resize'))
      expect(detectMobileKeyboard.is.open).toBe(true)
    })
  })
})
