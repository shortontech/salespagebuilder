import ColorPicker from '../src/js/widgets/ColorPicker.js'
import color from '../src/js/helpers/Color.js'
import { jest } from '@jest/globals';

global.HTMLCanvasElement.prototype.getContext = () => ({
  createImageData: (w, h) => ({
    data: new Uint8ClampedArray(w * h * 4),
  }),
  putImageData: jest.fn(),
});

function createMockCanvas(bounds) {
  return {
    getBoundingClientRect: () => bounds,
  }
}

describe('ColorPicker', () => {
  let picker
  let hslToRgbaSpy
  let rgbaToHexSpy

  

  beforeEach(() => {
    picker = new ColorPicker({ label: 'Color Picker', min: 0, max: 100, increment: 1 });
    picker.canvas = createMockCanvas({ left: 0, top: 0, width: 200, height: 200 });
    picker.hueCanvas = createMockCanvas({ top: 0, height: 100 });
    picker.hue = 0.5;
    hslToRgbaSpy = jest.spyOn(color, 'hslToRgba').mockImplementation((h, s, l, a) => [Math.floor(h * 255), Math.floor(s * 255), Math.floor(l * 255), a]);
    rgbaToHexSpy = jest.spyOn(color, 'rgbaToHex').mockImplementation((r, g, b, a) => `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${a.toString(16)}`);
  });
  afterEach(() => {
    hslToRgbaSpy.mockRestore();
    rgbaToHexSpy.mockRestore();
    
  });


  test('getColor returns correct hex value', () => {
    const result = picker.getColor(100, 100) // x=100, y=100 inside a 200x200 canvas
    expect(hslToRgbaSpy).toHaveBeenCalledWith(0.5, 0.5, 0.5, 255)
    expect(rgbaToHexSpy).toHaveBeenCalled();
    expect(result).toMatch(/^#[a-f0-9]{8}$/i); // something like #deadbeef

  })

  test('getHue returns clamped value between 0 and 1', () => {
    const y = 25
    const result = picker.getHue(y)
    expect(result).toBeCloseTo(0.75)
  })

  test('getHue does not go below 0 or above 1', () => {
    expect(picker.getHue(-10)).toBe(1)
    expect(picker.getHue(9999)).toBe(0)
  })
})