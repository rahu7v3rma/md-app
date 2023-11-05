fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### upload_sourcemap

```sh
[bundle exec] fastlane upload_sourcemap
```



### build_release

```sh
[bundle exec] fastlane build_release
```



----


## iOS

### ios alpha

```sh
[bundle exec] fastlane ios alpha
```

ios build ipa and upload to testflight alpha version

### ios beta

```sh
[bundle exec] fastlane ios beta
```

ios build ipa and upload to testflight beta version

### ios stable

```sh
[bundle exec] fastlane ios stable
```

ios build ipa and upload to testflight

----


## Android

### android beta

```sh
[bundle exec] fastlane android beta
```

android build apk and upload to play store for internal testing

### android stable

```sh
[bundle exec] fastlane android stable
```

android build apk and upload to play store for closed testing (which can be promoted to production)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
