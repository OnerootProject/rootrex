// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    config: {
        apiUrl: 'https://uat-api.oneroot.one',
        // apiUrl: 'https://dev-bithumb-api.rex.plus',
        wsUrl: 'wss://dev-bithumb-wss.rex.plus',
        version: 'v0.1.2',
        resourceVersion: '1',
        ethNetwork: 'Kovan',
        contract: '0x046D814Bfe996E14907Dd465287a5e8c9a041188',
        appID: 2
    }
};
