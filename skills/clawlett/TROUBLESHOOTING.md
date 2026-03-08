## ⚠️ Troubleshooting

If you are building autonomous bots wrapping the Clawlett CLI tools, be aware of the following edge cases:

**1. Windows C++ Node.js Crash (`async.c`)**
When running `swap.js` via a parent Node.js script on Windows, using synchronous child processes (`execSync`) can trigger a fatal C++ assertion error (`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c`) as the network threads close. 
* **Fix:** Always use asynchronous execution (`exec` with `promisify`) and catch the exit codes manually, extracting the `stdout` buffer even if the child process throws an error on exit.

**2. RPC Rate Limiting (`CALL_EXCEPTION`)**
Looping quotes or trades through the default `mainnet.base.org` RPC will result in rate-limiting (silent `CALL_EXCEPTION` or missing revert data). 
* **Fix:** Pass a high-capacity public node using the `--rpc` flag (e.g., `--rpc https://base.publicnode.com`). *Note: Avoid free nodes like LlamaRPC for automated execution, as they often fall out of sync and report inaccurate token balances.*
