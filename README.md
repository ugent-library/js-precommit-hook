# js-precommit-hook

This package contains a default pre-commit git hook script for use in JS or Node.js projects. It will reject committing changes if any of the staged changes contains any of these text portions:

- debugger
- .only
- .skip

## How to install

Add this project as a development dependency to your project using the `npm` or `yarn` package manager.

```
$ npm install --save-dev https://github.com/ugent-library/js-precommit-hook
```

or

```
$ yarn add -D https://github.com/ugent-library/js-precommit-hook
```

Then in your `package.json` file add the `scripts` (if not already present) and `precommit` sections as follows:

```
{
    ...
    "scripts": {
        "precommit": "node node_modules/js-precommit-hook"
    },
    ...
    "precommit": "precommit",
    ...
}
```

Now whenever you commit any staged files that contain a forbidden text portion, the `git commit` command will be rejected, like this:

```
Commit rejected: Found ".only" in file index.js at line 21 position 9
```

Once installed, the hook can be incidentally bypassed by committing using the `--no-verify` flag.
