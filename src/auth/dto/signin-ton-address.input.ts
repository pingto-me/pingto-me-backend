import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class proofInterface {
  payload: string;
}

export class accountInterface {
  address: string;
  chain: CHAIN;
  walletStateInit: string;
  publicKey?: string;
}

export enum CHAIN {
  MAINNET = '-239',
  TESTNET = '-3',
}

export class SigninTonAddressInput {
  @ApiProperty({
    example: {
      payload:
        'eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiYTI0Mjk1MzQ5ZDIwZDNkM2NmNGM5OGNhNjBkY2YxMjUyMTIzMTI4ZTU4YjQzYjBmYjlhZGRlNjBiNjQ3MTg3OSIsImlhdCI6MTczMDQ0MjMyNCwiZXhwIjoxNzMwNDQzMjI0fQ.iC7-rPU0LnAg9MkiWRSIZ13S-QJeMtu-8IL4uJoo7U8',
    },
  })
  @IsNotEmpty()
  proof: proofInterface;

  @ApiProperty({
    example: {
      address: '0x1234567890',
      chain: CHAIN.MAINNET,
      walletStateInit: 'walletStateInitInBase64',
      publicKey: 'publicKeyInHexString',
    },
  })
  @IsNotEmpty()
  account: accountInterface;
}
