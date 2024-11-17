import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  private characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  generateRandomCharacter(): string {
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    return this.characters.charAt(randomIndex);
  }

  generateRandomNumber(length: number): string {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
    ).toString();
  }
}
