# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 4/13/2022

### Added

- Yu-Gi-Oh! Wordle-like website
- Compares secret card against users input
  - Checks name, attribute, type, level, attack, and defense
  - Depending on the users guess it will return green for correct, red for wrong, and an up or down arrow depending on where the provided level, attack, and defense was in comparison to the actual value.
- Allows users to provide filters to limit the auto-suggested cards
- Available filters:
  - type
  - atr
  - level
  - atk
  - def
- Has a daily mode where every day there is a new hidden card that is the same for everyone
- Has a practice mode where you can repeatedly try to guess the card
