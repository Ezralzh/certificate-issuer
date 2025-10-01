const fs = require('fs');
const { issue } = require('@govtechsg/open-attestation');

const recipientName = process.env.RECIPIENT_NAME;

if (!recipientName) {
  console.error("❌ Error: RECIPIENT_NAME not set");
  process.exit(1);
}

let template = JSON.parse(fs.readFileSync('certificate-template.json'));
template.recipient.name = recipientName;

const issuedCertificate = issue(template);
const fileName = `issued-certificate-${recipientName.replace(/\s+/g, '-')}.json`;
fs.writeFileSync(fileName, JSON.stringify(issuedCertificate, null, 2));
console.log(`✅ Certificate issued for ${recipientName} -> ${fileName}`);
