# API

_API_ contains the REST API endpoints for powering [Turrone Server](https://github.com/turrone/turrone-server). It is intended to be included as a module in _Turrone Server_, to be mounted at `/api`.

_API_ is written in TypeScript and uses the NodeJS runtime environment.

## Installing

Run:

```
npm install
```

## Running

_API_ is intended to be included as a module of _Turrone Server_. However, if you want to run _API_ on its own instance, run:

```
npm start
```

This will start an instance of the server ready to use.

## Developing

### Building

Once you have updated the code in `/src`, run:

```
npm run build
```

The TypeScript code will be compiled to JavaScript and output to the `/dist` directory.

### Documentation

_API_ has two locations for documentation. One is [for developers](doc/dev/index.html) of _API_ and the other is for consumers of the [HTTP API endpoints](doc/api/index.html). When _API_ is running, the HTTP API endpoints documentation is available at the root API endpoint (e.g. `http://localhost:8080/api/`).

To generate documentation, run:

```
npm run doc
```

This will run the generators for both documentation locations. Alternatively, run the relevant command:

```
npm run doc:api
npm run doc:dev
```

Documentation for developers uses [TypeDoc](https://typedoc.org/) syntax and [typedoc](https://www.npmjs.com/package/typedoc) to generate them. HTTP API endpoint documentation uses [apiDoc](http://apidocjs.com) for both syntax and generation.

### Testing

Tests are created in the `/test` directory. To run them, use:

```
npm test
```

## License

This project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details.
