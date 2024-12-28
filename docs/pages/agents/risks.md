### **1. Man-in-the-Middle (MitM) Attacks**

MitM attacks occur when an attacker intercepts the communication between the client and backend where the LLM service lies. This could involve stealing sensitive information, injecting malicious data, or altering the transmitted data.

**Potential Threats:**

- **Data Interception:** The attacker captures sensitive data, including user queries and chatbot responses, potentially exposing personal or confidential information.
- **Data Manipulation:** The attacker modifies user queries or responses. This could lead to incorrect actions or responses.
- **Command Injection:** Malicious instructions injected by an attacker could trigger unintended backend actions, potentially compromising the system.

### 2. Prompt Injection

An attacker may inject malicious prompts into user queries by intercepting the request from in-between, resulting in disastrous actions (in the case of an Agentic AI system).

- https://arxiv.org/pdf/2410.14728

### 2. Cross-Site Scripting (XSS)

An attacker injects malicious scripts into the chatbot interface or backend responses, exploiting vulnerabilities in the web app.

**Potential Threats:**

- Stealing session tokens, cookies, or sensitive data via the malicious script.
- Performing unauthorized actions on behalf of the user by exploiting session data.
