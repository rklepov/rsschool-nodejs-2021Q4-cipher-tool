# RS School 2021Q4 NodeJS Course.
## Ciphering CLI Tool.

CLI tool that encodes and decodes text by 3 substitution ciphers according to the [task](https://github.com/rolling-scopes-school/basic-nodejs-course/blob/master/descriptions/ciphering-cli-tool.md "Ciphering CLI Tool") requirements.

Usage examples (assuming that started in the same directory as `main.js`):
```
node main -c "C1" -i data/input.txt -o data/output.txt
```
```
node main --config "C1-R1-C0-C0-A-R0-R1-R1-A-C1" --input data/input.txt
```
### Testing
0. The assumption is that **node** `v16.13.0` is used.
1. Clone the repo:
```
git clone https://github.com/rklepov/rsschool-nodejs-2021Q4-cipher-tool.git
```
2. Change to the dir with the repo created on step 1.
3. Switch to `task/02-testing` branch:
```
git checkout -b task/02-testing origin/task/02-testing
```
4. Install the dependencies with `npm`:
```
npm install
```
5. To run the test suite use `npm run test`
6. To see the coverage run `npm run test:coverage`

