# Security and encryption with MLS and XMTP

A user starts with a predefined Ethereum wallet and loads up an app that supports XMTP. Once the user has [joined or created an inbox](/protocol/v3/identity), XMTP creates an installation key pair for the app.  The public key component of this pair is also known as the *signature key*.

XMTP then takes the installation key and creates an *MLS credential* (Messaging Layer Security).  This is signed by the Ethereum wallet and contains the wallet address and a hash of the signature key. XMTP uses the [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) signature algorithm and curve25519 elliptic curve for the installation key. Because XMTP uses Ed25519, the public key is in the format specified in [RFC8032](https://www.rfc-editor.org/rfc/rfc8032.html).

Using the MLS credential and the signature key, the app then constructs the *key package*. The key package is used by other apps to contact this user on this app. The key package contains a leaf node, which is a combo of the signature key and MLS credential. The leaf node is stored in the MLS ratchet tree. The key package also contains the expiration date of the package (TTL) along with a list of the client capabilities and MLS extensions used by the app and XMTP. XMTP will rotate the key package when a new welcome message is received and delete expired key packages automatically.

![MLS keys](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/mls-keys.png)

## Group chat security properties

Specifically, XMTP group chat is implemented using MLS and inherits the comprehensive security properties of the MLS standard listed below:

- **Message confidentiality**  
Ensures that the contents of messages in transit cannot be read without the corresponding encryption keys.
    
- **Forward secrecy**  
Ensures that past messages remain secure even if current encryption keys are compromised.
    
- **Post-compromise security**  
Ensures that future messages remain secure even if current encryption keys are compromised.
    
- **Message authentication**  
Validates the identity of the participants in the conversation, preventing impersonation.
    
- **Message integrity**  
Ensures that messages cannot be tampered with during transit.
    
- **Group state and operation protection**  
Protects the group state cryptographically and hides group operations from the server or infrastructure.
    
In addition to the security properties provided by MLS, XMTP also adds:

- **User anonymity**  
Ensures that outsiders cannot deduce the participants of a group, users who have interacted with each other, or the sender or recipient of individual messages.
    
### More details

- **Message confidentiality**  
Message confidentiality is achieved through symmetric encryption, ensuring that only intended recipients can read the message content. [*AEAD*](#cryptographic-tools-in-use) (Authenticated Encryption with Associated Data) is used to encrypt the message content, providing robust protection against unauthorized access.

- **Forward secrecy**  
Forward secrecy ensures that even if current session keys are compromised, previous communications remain secure. MLS achieves this by using *the ratcheting mechanism,* where the keys used to encrypt application messages are ratcheted forward every time a message is sent. When the old key is deleted, old messages cannot be decrypted, even if the newer keys are known. This property is supported by using ephemeral keys during the *key encapsulation* process.

- **Post-compromise security**  
Post-compromise security ensures that future messages remain secure after a compromise. XMTP uses regular *key rotation* achieved through a *commit mechanism* with a specific *update path* in MLS, meaning a new group secret is encrypted to all other members. This essentially resets the key and an attacker with the old state cannot derive the new secret, as long as the private key from the leaf node in the ratchet tree construction has not been compromised. This ensures forward secrecy and protection against future compromises.

- **Message authentication**  
XMTP uses digital signatures to strongly guarantee message authenticity. These signatures ensure that each message is cryptographically signed by the sender, verifying the sender’s identity without revealing it to unauthorized parties. This prevents attackers from impersonating conversation participants.

- **Message integrity**  
Message integrity is crucial to ensure that messages are genuine and unaltered. XMTP achieves this through the use of MLS. The combination of digital signatures and [*AEAD*](#cryptographic-tools-in-use) enables XMTP to detect changes to message content.

- **User anonymity**  
User anonymity is achieved through a combination of the following functions:

    - MLS Welcome messages encrypt the sender metadata and group ID, protecting the social graph.
    - XMTP adds a layer of encryption to MLS Welcome messages using [HPKE](#cryptographic-tools-in-use) (Hybrid Public Key Encryption). This prevents multiple recipients of the same Welcome message from being correlated to the same group.
    - XMTP uses MLS [PrivateMessage](https://www.rfc-editor.org/rfc/rfc9420.html#name-confidentiality-of-sender-d) framing to hide the sender and content of group messages.
    - XMTP’s backend does not authenticate reads or writes and only implements per-IP rate limits. Aside from Welcome messages, all payloads for a given group are stored under a single group ID, and any client may anonymously query or write to any group ID. Only legitimate members possess the correct encryption keys for a given group.  
    - It is technically possible for XMTP network node operators to analyze query patterns per IP address. However, clients may choose to obfuscate this information using proxying/onion routing.
    - XMTP currently hides the sender of Welcome messages (used to add users to a group) but does not hide the Welcome message recipients. This makes it possible to determine how many groups a user was invited to but not whether the user did anything about the invitations.

### Cryptographic tools in use

XMTP group chat uses the ciphersuite *MLS_128_HPKEX25519_CHACHA20POLY1305_SHA256_Ed25519*. 

Here is a summary of individual cryptographic tools used to collectively ensure that XMTP group chat communications are secure, authenticated, and tamper-proof:

- [HPKE](https://www.rfc-editor.org/rfc/rfc9180.html)  
Used to encrypt Welcome messages, protect the identities of group invitees, and maintain the confidentiality of group membership. The ciphersuite we use is *HPKEX25519*.
    
- [AEAD](https://developers.google.com/tink/aead)  
Used to ensure both confidentiality and integrity of messages. In particular, we use the ciphersuite *CHACHA20POLY1305.*
    
- [SHA3_256 and SHA2_256](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)  
XMTP uses two cryptographic hash functions to ensure data integrity and provide strong cryptographic binding. SHA3_256 is used in the multi-wallet identity structure. SHA2_256 is used in MLS. The ciphersuite is *SHA256*.
    
- [Ed25519](https://ed25519.cr.yp.to/ed25519-20110926.pdf)  
Used for digital signatures to provide secure, high-performance signing and verification of messages. The ciphersuite is *Ed25519.*
