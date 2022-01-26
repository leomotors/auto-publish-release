# Change Log

All notable changes to the "auto-publish-release" extension will be documented in this file.

## [1.5.0] - 2022-01-26

- Default value of all boolean input is now false

## [1.4.3] - 2022-01-25

- Fixed some bug reading CHANGELOG.md

## [1.4.2] - 2022-01-24

- New Parameter: ALWAYS_GENERATE_NOTES

## [1.4.0] - 2022-01-23

- Fix error handling error (it should now work as intended)

- New Parameter: RELEASE_ON_KEYWORD

## [1.3.3] - 2021-11-27

- Now end its job quietly if already_exists

## [1.3.1 & 1.3.2] - 2021-11-23

- Addressing errors in 1.3.0

## [1.3.0] - 2021-11-23

- Added Version from Commit Count

- Added String Substitution of Release Body

## [1.2.1] - 2021-10-14

- Added "next" for pre-release

## [1.2.0] - 2021-10-08

- Now detects pre-release version and release as it should be

## [1.1.0] - 2021-10-05

- Now detects CHANGELOG.md (this exact form) and add to release body, see the code to know how it is detected

## [1.0.0] - 2021-09-27

- Initial release
