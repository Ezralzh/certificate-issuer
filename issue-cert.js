name: Issue Certificate (Open Attestation)

on:
  workflow_dispatch:
    inputs:
      recipient-name:
        description: 'Recipient name'
        required: true
        default: 'John Doe'

jobs:
  issue_certificate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Open Attestation
        run: npm install @govtechsg/open-attestation

      - name: Issue Certificate
        run: node issue-cert.js
        env:
          RECIPIENT_NAME: ${{ github.event.inputs.recipient-name }}

      - name: Upload Issued Certificate
        uses: actions/upload-artifact@v4
        with:
          name: issued-certificate
          path: issued-certificate-*.json
