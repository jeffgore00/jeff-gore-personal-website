/* This is attached to the global scope (`window` object) by webpack via
DefinePlugin is part of the build process. This helps the client-side to be
aware of which environment it is in, which allows it to use the correct
configuration (e.g., URL of backend). */
declare let appEnvironment: string;
