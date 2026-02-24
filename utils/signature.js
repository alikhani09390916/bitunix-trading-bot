const crypto = require("crypto");

function generateSignature(apiKey, secretKey, nonce, timestamp, queryParams = "", body = "") {
    // Step 1: Sort queryParams and remove spaces from body
    // queryParams are already sorted and concatenated in the caller
    const cleanedBody = body.replace(/\s/g, "");

    // Step 2: Calculate digest
    const digestInput = nonce + timestamp + apiKey + queryParams + cleanedBody;
    const digest = crypto.createHash("sha256").update(digestInput).digest("hex");

    // Step 3: Calculate final signature
    const signInput = digest + secretKey;
    const sign = crypto.createHash("sha256").update(signInput).digest("hex");

    return sign;
}

module.exports = { generateSignature };
