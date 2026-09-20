# Maintained provenance action snapshot

## Status and decision

Accepted for maintained evaluation by the repository owner on 2026-09-20.
Production integration remains conditional on hosted validation and review.
This is not an official GitHub action release or a CCE package release.

## Context

Upstream is `actions/attest` v4.2.2, commit
`1e69f48acb82d1966a394da916b4c1698aa569d6`. Its complete declared production
closure matched nine GitHub advisory records in the retained 2026-09-20
database snapshot. Those matches are not proof of exploitable CCE paths.

The tested dependency patch changes `csv-parse` to 7.0.2, the two nested
`undici` pins to 6.28.0, and overrides `@sigstore/core` to 3.2.1. The latter
crosses the signer's declared `^2.0.0` range. All consumed exports and the
tested signing paths work; this does not create upstream compatibility support.

## Evidence and limits

The patched runtime manifests and initial bundle are copied byte-for-byte from
the isolated candidate. All 230 unchanged upstream tests, lint, formatting and
TypeScript checks passed there. Two Node 24.21.0 builds were byte-identical.
The non-ASCII DSSE regression fails on the old library and passes on the patch.
Actual signing, upload refusal, tamper and bundled default-provenance controls
passed with synthetic endpoints and identity. They are not hosted OIDC proof.

The distributed bundle makes 106 pre-existing invisible characters in upstream
encoding-table string literals explicit as Unicode escapes. The build's small
postprocessor refuses non-string replacements and asserts equality of the entire
JavaScript token stream, including every decoded string value. It changes source
spelling, not table values or instructions. The original tested bundle remains
retained independently; hosted validation must reproduce the escaped bundle.

The retained GitHub advisory-database snapshot is
`de1cb1ff919d60e211f841016848d07bce6903ba`. Its complete production assessment
covered 148 lock entries and 132 distinct pins, with no candidate matches or
unresolved ranges. This is a dated assessment, not proof of no vulnerabilities.
Development tools and the hosted runner are separate trust dependencies.

The build pin is Node 24.21.0. The upstream Node 24.5.0 development pin does
not satisfy ten existing production dependency declarations. The tested build
version satisfies every declared production Node range. Action execution uses
the hosted runner's Node 24 runtime; actual hosted validation is required.

The license, TypeScript source, tests, action interface and distributed license
notices are retained. The upstream automatic release/prober workflows are not
enabled here. A manual workflow checks the build and signs a clearly marked
test subject with short-lived hosted identity, then independently verifies it
and requires altered bytes and missing identity permission to be rejected.

## Alternatives and consequences

Waiting for an official fixed release avoids maintenance but leaves the release
blocked. Continuing with known affected pins, suppressing advisories, or
removing provenance was not selected. A maintained snapshot permits a bounded
repair but requires upstream tracking, complete closure review, reproducible
bundles, regression controls and immutable consumer pins for every update.

Stop release publication if the snapshot cannot be validated; reverting to the
affected dependency bundle is not a security rollback. Prefer returning to an
official supported release once its dependency closure and hosted behavior have
been independently validated. No long-lived signing key is introduced.
