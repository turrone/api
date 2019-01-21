# Turrone Server

_Turrone Server_ is designed to be a NuGet compatible server to host an internal package feed. It is designed to be used as a source for a [Chocolatey](https://chocolatey.org/) [internal package feed](https://chocolatey.org/docs/how-to-host-feed), but should support other NuGet clients.

_Turrone Server_ is written in Node.js and designed to provide a number of features. Some planned features are:

- Simple installation and setup, to get running as quickly as possible
- A package source for NuGet clients
- Inform nominated admin users when a client attempts to first download a package, so they can moderate it
- Automatic notification on external package updates (depending on source)
- Internal hosting of NuGet packages, with automatic re-packaging
