const fs = require('fs');
const OpenAttestation = require('@govtechsg/open-attestation');

const recipientName = process.env.RECIPIENT_NAME;

if (!recipientName) {
  console.error("❌ Error: RECIPIENT_NAME not set");
  process.exit(1);
}

let template;
try {
  template = JSON.parse(fs.readFileSync('certificate-template.json'));
} catch (err) {
  console.error("❌ Error reading/parsing certificate-template.json:", err.message);
  process.exit(1);
}

template.recipient.name = recipientName;

let issuedCertificate;
try {
  issuedCertificate = OpenAttestation.issue(template);
} catch (err) {
  console.error("❌ Error issuing certificate:", err.message);
  process.exit(1);
}

const fileName = `issued-certificate-${recipientName.replace(/\s+/g, '-')}.json`;
fs.writeFileSync(fileName, JSON.stringify(issuedCertificate, null, 2));
console.log(`✅ Certificate issued for ${recipientName} -> ${fileName}`);

