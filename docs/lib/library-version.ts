import pkg from "@skygenesisenterprise/react-sds/package.json";

/**
 * Version of the React SDS package installed in the workspace (or resolved from
 * npm when the docs are built from a released version). Read from the package
 * manifest so the documentation never displays a hand-maintained version.
 */
export const libraryVersion: string = pkg.version;
