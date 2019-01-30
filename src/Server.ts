export const DELAY_MIN = 2000;
export const DELAY_MAX = 4000;
export const STUFF_MIN = 5;
export const STUFF_MAX = 10;

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export class Server {
  static getStuff(): Promise<number[]> {
    const delay = randInt(DELAY_MIN, DELAY_MAX);
    const count = randInt(STUFF_MIN, STUFF_MAX);
    const stuff = new Array<number>(count).map(() => Math.random());
    return new Promise(resolve => {
      setTimeout(() => resolve(stuff), delay);
    });
  }
}
