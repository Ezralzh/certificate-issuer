const fs = require('fs');
const { wrapDocuments, validateSchema } = require('@govtechsg/open-attestation');

const recipientName = process.env.RECIPIENT_NAME;

if (!recipientName) {
  console.error("❌ Error: RECIPIENT_NAME not set");
  process.exit(1);
}

// Load template
let template;
try {
  template = JSON.parse(fs.readFileSync('certificate-template.json'));
} catch (err) {
  console.error("❌ Error reading certificate-template.json:", err.message);
  process.exit(1);
}

// Replace placeholder
template.data.recipient.name = recipientName;

// ✅ Validate before wrapping
const validation = validateSchema(template);
if (!validation.valid) {
  console.error("❌ Schema validation failed:", validation.errors);
  process.exit(1);
}

// Wrap into verifiable certificate
let wrappedCertificate;
try {
  wrappedCertificate = wrapDocuments([template]);
} catch (err) {
  console.error("❌ Error wrapping certificate:", err.message);
  process.exit(1);
}

// Save result
const fileName = `issued-certificate-${recipientName.replace(/\s+/g, '-')}.json`;
fs.writeFileSync(fileName, JSON.stringify(wrappedCertificate, null, 2));
console.log(`✅ Certificate issued for ${recipientName} -> ${fileName}`);
