# A very small test application for demonstrating issue with multiple ContainerPlugins in ModuleFederation v1  RSPack vs Webpack

The current setup is:

The host is defined as the `host`, it both exposes and consumes two remotes: `bundled-one` and `bundled-two`.

Either of these federated modules _could_ be overridden at runtime by defining a different URL to override the bundled remoteEntry.
This example does not include that logic as it would over-complicate the setup.

We can see how this works for Webpack, but does not work for Rspack.

1. install dependencies: `yarn`

## Webpack

1. build the packages: `yarn build-webpack`
2. start the server: `yarn start`
3. navigate to [http://localhost/](http://localhost/)
4. app loads without issue

## Rspack

1. build the packages: `yarn build-rspack`
2. start the server: `yarn start`
3. navigate to [http://localhost/](http://localhost/)
4. app is unable to load
