# Firestore rules tests

Checks who can read and change roles, the activity log, meetings, department records, attachments, assignments, duties and settings, and that an unverified e-mail gets nothing.

```
cd tests/rules
npm i firebase-tools@13 @firebase/rules-unit-testing@3 firebase@10
echo '{"firestore":{"rules":"../../firestore.rules"},"emulators":{"firestore":{"port":8085}}}' > firebase.json
npx firebase emulators:exec --only firestore --project demo-brega "node rules.test.mjs"
```
Expected output: `PASS 133 FAIL 0`.
