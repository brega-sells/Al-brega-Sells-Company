# Firestore rules tests

Checks who can read and change assignments (`assignments`), department duties (`duties`) and settings (`config`).

```
cd tests/rules
npm i firebase-tools@13 @firebase/rules-unit-testing@3 firebase@10
echo '{"firestore":{"rules":"../../firestore.rules"},"emulators":{"firestore":{"port":8085}}}' > firebase.json
npx firebase emulators:exec --only firestore --project demo-brega "node rules.test.mjs"
```
Expected output: `PASS 42 FAIL 0`.
