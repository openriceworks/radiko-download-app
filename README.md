# radiko-download-app

radikoのタイムフリー番組をダウンロードするelectronアプリ。

## ディレクトリ構成

| パス                            |                                                                |
| ------------------------------- | -------------------------------------------------------------- |
| [/src/main](/src/main/)         | Node.jsで実行するコード                                        |
| [/src/preload](/src/preload/)   | Node.jsとChromiumの仲介コード(今のままにしておく)              |
| [/src/renderer](/src/renderer/) | Chromiumで実行するコード(React)                                |
| [/src/shared](/src/shared/)     | `/src/main`と`/src/renderer`の両方で使用する可能性のあるコード |

## Project Setup

### Install

```bash
$ npm install -g corepack
$ corepack enable
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

> `/src/main` を変更した時にはホットリロードされないので、終了し、再実行する

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
