"""Check the already cryptographically verified statement's exact test subject."""
import hashlib
import json
import os
from pathlib import Path

subject = Path('validation-subject.txt')
digest = hashlib.sha256(subject.read_bytes()).hexdigest()
results = json.loads(Path('verification.json').read_text())
after = json.loads(Path('verification-after.json').read_text())
assert len(results) == len(after) == 1
statement = results[0]['verificationResult']['statement']
assert statement == after[0]['verificationResult']['statement']
assert statement['predicateType'] == 'https://slsa.dev/provenance/v1'
assert statement['subject'] == [{'name': subject.name, 'digest': {'sha256': digest}}]
record = {'source': os.environ['GITHUB_SHA'], 'repository': os.environ['GITHUB_REPOSITORY'],
          'run': os.environ['GITHUB_RUN_ID'], 'attempt': os.environ['GITHUB_RUN_ATTEMPT'],
          'subject_sha256': digest, 'predicate_type': statement['predicateType'],
          'positive_before_and_after': True, 'altered_subject_refused': True,
          'limit': 'The CLI enforces certificate/source/workflow identity; these assertions bind the toy payload, not a CCE release.'}
Path('statement-check.json').write_text(json.dumps(record, indent=2))
