# Changelog

All notable changes to the "auto-publish-release" extension will be documented in this file.

## [4.1.0] - 2023-09-21

- feat: now tag version correctly when given package@version format

## [4.0.0] - 2023-09-21

- feat: now runs on node20
- feat: new input `changelog` to override changelog path

## [3.0.0] - 2022-12-10

First Release after almost 8 months? 🤔  
This release is major refactor of this library

- Convert to TypeScript with actions/typescript template
- Many inputs have been removed and renamed, check action.yml
- Legacy functions ex. read from package.json is now removed, only push tag

## [2.1.1] - 2022-04-26

- Add test to pre-release keywords

## [2.1.0] - 2022-04-21

- LEADING_ZERO_IS_RELEASE is now default to `true`

## [2.0.5] - 2022-04-21

- Fix getBoolean Bug

## [2.0.3-2.0.4] - 2022-04-20

- Test Commits, no changes

## [2.0.2] - 2022-04-20

- Now warn if deprecated options are passed

- Fix wrong version name from tag source

## [2.0.1] - 2022-04-03

- Fixing bug (that I found on production)

## [2.0.0] - 2022-03-26

- Many options are removed

- Added support for push tag

- Added support for setup.cfg

## [1.6.1] - 2022-03-25

- Added option to turn off feature from previous release

## [1.6.0] - 2022-03-25

- Leading Zero are considered as Pre-release

## [1.5.2] - 2022-02-22

- Fix Bug when parsing Changelog

## [1.5.1] - 2022-02-07

- Update Description

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

Below are used for testing
