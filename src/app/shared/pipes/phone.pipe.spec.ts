import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {

  let pipe: PhonePipe;

  beforeEach(() => {
    pipe = new PhonePipe();
  });

  it('create an instance', () => {
    const pipe = new PhonePipe();
    expect(pipe).toBeTruthy();
  });

  it('should format an 11-digit number (mobile phone)', () => {
    const input = '65999998888';
    const result = pipe.transform(input);
    expect(result).toBe('(65) 99999-8888');
  });

  it('should format a 10-digit number (landline)', () => {
    const input = '6533332222';
    const result = pipe.transform(input);
    expect(result).toBe('(65) 3333-2222');
  });

  it('should normalize and format numbers with messy characters', () => {
    const input = '65.99999-8888-';
    const result = pipe.transform(input);
    expect(result).toBe('(65) 99999-8888');
  });

  it('should return the original value if it is not a valid phone number length', () => {
    const input = '12345';
    const result = pipe.transform(input);
    expect(result).toBe('12345');
  });

  it('should return an empty string if value is null or undefined', () => {
    expect(pipe.transform('')).toBe('');
    // @ts-ignore
    expect(pipe.transform(null)).toBe('');
  });

  it('should be idempotent (should not break an already formatted number)', () => {
    const input = '(65) 99999-8888';
    const result = pipe.transform(input);
    expect(result).toBe('(65) 99999-8888');
  });

});
