import { MomentTimePipe } from './moment-time.pipe';

describe('MomentTimePipe', () => {
  it('create an instance', () => {
    const pipe = new MomentTimePipe();
    expect(pipe).toBeTruthy();
  });
});
