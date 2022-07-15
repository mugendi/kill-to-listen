# Why

Sometimes while developing, you use a module like **nodemon** to continuously restart your server upon file changes.

However, you will often encounter the annoying **EADDRINUSE** error. This is especially the case when using websocket clients that bind to the same port and may not be releasing the port fast enough.

This simple module ensures that the target port is free before attempting to listen. It achieves this by checking if port is busy then using a cross-platform method to find and kill any applications using the port.

It is important to understand how it works as attempting to use this module in apps sharing a port will mean the apps will _kill_ each other.

## Example Usage

```javascript
// require
const kill2listen = require('kill-to-listen');

// Simply pass app/server instance and the port you wish to listen to
kill2listen(app, port)
	.then((resp) => {
		console.info(`Listening on port ${port}`);
	})
	.catch(console.error);
    
```
