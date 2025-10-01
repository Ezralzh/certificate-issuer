const fs = require('fs');
const { wrapDocuments } = require('@govtechsg/open-attestation');

const recipientName = process.env.RECIPIENT_NAME;

if (!recipientName) {
  console.error("❌ Error: RECIPIENT_NAME not set");
  process.exit(1);
}

// Load certificate template
let template;
try {
  template = JSON.parse(fs.readFileSync('certificate-template.json'));
} catch (err) {
  console.error("❌ Error reading/parsing certificate-template.json:", err.message);
  process.exit(1);
}

// Replace recipient name inside `data`
template.data.recipient.name = recipientName;

// Wrap certificate
let wrappedCertificate;
try {
  wrappedCertificate = wrapDocuments([template]);
} catch (err) {
  console.error("❌ Error wrapping certificate:", err.message);
  process.exit(1);
}

// Save certificate
const fileName = `issued-certificate-${recipientName.replace(/\s+/g, '-')}.json`;
fs.writeFileSync(fileName, JSON.stringify(wrappedCertificate, null, 2));
console.log(`✅ Certificate issued for ${recipientName} -> ${fileName}`);
