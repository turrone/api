# Turrone Server

_Turrone Server_ is designed to be a NuGet compatible server to host an internal package feed. It is designed to be used as a source for a [Chocolatey](https://chocolatey.org/) [internal package feed](https://chocolatey.org/docs/how-to-host-feed), but should support other NuGet clients.

_Turrone Server_ is written in Node.js and designed to provide a number of features. Some planned features are:

- Simple installation and setup, to get running as quickly as possible
- A package source for NuGet clients
- Inform nominated admin users when a client attempts to first download a package, so they can moderate it
- Automatic notification on external package updates (depending on source)
- Internal hosting of NuGet packages, with automatic re-packaging

## Developing

### Documentation

_Turone Server_ has two locations for documentation. One is [for developers](doc/dev/index.html) of _Turrone Server_ and the other is for consumers of the [HTTP API endpoints](doc/api/index.html). When _Turrone Server_ is running, the HTTP API endpoints documentation is available at the root API endpoint (e.g. `http://localhost:8080/api/`).

To generate documentation, run `npm run doc`. This will run the generators for both documentation locations. Alternatively, run the relevant command: `npm run doc:api` or `npm run doc:dev`.

Documentation for developers uses [JSDoc](http://usejsdoc.org/) syntax and [documentation.js](http://documentation.js.org/) to generate them. HTTP API endpoint documentation uses [apiDoc](http://apidocjs.com) for both syntax and generation.

## License

This project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details.
