import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";
const TEST_CHAT_ID = "000000000000000000000001";

async function getAccessToken(): Promise<string> {
  const response = await fetch(`${SERVER_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: "TEST-STU-001",
      password: "Password123",
    }),
  });

  const data = (await response.json()) as {
    success: boolean;
    message: string;
    data?: { accessToken: string };
  };

  if (!data.success || !data.data) {
    throw new Error(`Login failed: ${data.message}`);
  }

  return data.data.accessToken;
}

async function runTest(): Promise<void> {
  console.log("Logging in as TEST-STU-001...");
  const token = await getAccessToken();
  console.log("Got access token.");

  const socket = io(SERVER_URL, {
    auth: { token },
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    socket.emit("chat:join", { chatId: TEST_CHAT_ID });
    console.log(`Joined chat room: ${TEST_CHAT_ID}`);

    socket.on("message:new", (message) => {
      console.log("✅ Received broadcast message:", message);
      console.log("🎉 Real-time test PASSED");
      socket.disconnect();
      process.exit(0);
    });

    socket.on("message:error", (err) => {
      console.error("❌ Message error:", err);
      socket.disconnect();
      process.exit(1);
    });

    setTimeout(() => {
      console.log("Sending test message...");
      socket.emit("message:send", {
        chatId: TEST_CHAT_ID,
        content: "Hello from the real-time test script!",
        type: "text",
      });
    }, 500);
  });

  setTimeout(() => {
    console.error("❌ Test timed out after 10 seconds — no message received.");
    process.exit(1);
  }, 10000);
}

runTest().catch((error) => {
  console.error(
    "❌ Test failed:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
