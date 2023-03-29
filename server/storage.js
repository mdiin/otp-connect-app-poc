var store = {
  otps: {},
  accessKeys: {},
  cycleCounts: {
    "CC123": {
      id: "CC123",
      skus: {
        1: { sku: 1, expected: 10 },
        2: { sku: 2, expected: 1 },
        3: { sku: 3, expected: 55 }
      }
    }
  },
};

function debugGetStore() {
  return store;
}

function addOTP(otp, cycleCountId) {
  store = {
    ...(store || {}),
    otps: {
      ...(store.otps || {}),
      [cycleCountId]: otp
    }
  };
}

function disableOTP(cycleCountId) {
  store = {
    ...(store || {}),
    otps: {
      ...(store.otps || {}),
      [cycleCountId]: undefined
    }
  };
}

function testOTP(otp, cycleCountId) {
  console.log("store", JSON.stringify(store, null, 2));
  return store.otps && store.otps[cycleCountId] === otp;
}

function addAccessKey(cycleCountId, accessKey) {
  store = {
    ...(store || {}),
    accessKeys: {
      ...(store.accessKeys || {}),
      [cycleCountId]: accessKey
    }
  };
}

function disableAccessKey(cycleCountId) {
  store = {
    ...(store || {}),
    accessKeys: {
      ...(store.accessKeys || {}),
      [cycleCountId]: undefined
    }
  };
}

function testAccessKey(cycleCountId, accessKey) {
  return store.accessKeys && store.accessKeys[cycleCountId] === accessKey;
}

function getCycleCount(cycleCountId) {
  return store.cycleCounts && store.cycleCounts[cycleCountId];
}

function setCycleCount(cycleCountId, cycleCount) {
  console.log("cycleCountId", cycleCountId, "cycleCount", JSON.stringify(cycleCount, null, 2));
  store = {
    ...(store || {}),
    cycleCounts: {
      ...(store.cycleCounts || {}),
      [cycleCountId]: cycleCount
    }
  }
}

module.exports = {
  debugGetStore,
  addOTP,
  disableOTP,
  testOTP,
  addAccessKey,
  disableAccessKey,
  testAccessKey,
  getCycleCount,
  setCycleCount,
}
