// snapshotEngine.js

const { Worker, isMainThread, parentPort } = require('worker_threads');
const Redis = require('ioredis');

// Your Redis configuration here
const redisConfig = {
  host: 'trade-exchange-redis-host',
  port: 6379,
};

// Initialize Redis client
const redisClient = new Redis(redisConfig);

// Function to store the current state in Redis
async function saveSnapshot(state) {
  await redisClient.set('ordersNumber', state.ordersNumber);
  await redisClient.set('lastOrder', JSON.stringify(state.lastOrder));
  await redisClient.set('collectivePrice', state.collectivePrice);
}

// Function to read the snapshot from Redis
async function readSnapshot() {
  const ordersNumber = await redisClient.get('ordersNumber');
  const lastOrder = await redisClient.get('lastOrder');
  const collectivePrice = await redisClient.get('collectivePrice');
  return {
    ordersNumber: parseInt(ordersNumber, 10) || 0,
    lastOrder: lastOrder ? JSON.parse(lastOrder) : null,
    collectivePrice: parseFloat(collectivePrice) || 0,
  };
}

if (isMainThread) {
  // Main application thread

  // Create the worker thread for snapshot engine
  const worker = new Worker(__filename);
  
  // Schedule a snapshot every 1 second
  setInterval(() => {
    worker.postMessage('takeSnapshot');
  }, 1000);

  worker.on('message', (message) => {
    console.log('Snapshot taken:', message);
  });
} else {
  // Snapshot engine worker thread

  let state = {
    ordersNumber: 0,
    lastOrder: null,
    collectivePrice: 0,
  };

  // Function to take a snapshot
  function takeSnapshot() {
    saveSnapshot(state)
      .then(() => {
        parentPort.postMessage('Snapshot completed');
      })
      .catch((err) => {
        console.error('Error while taking snapshot:', err);
      });
  }

  // Function to update the state
  function updateState(newOrder) {
    state.ordersNumber++;
    state.lastOrder = newOrder;
    state.collectivePrice += newOrder.price;
  }

  // Logic to simulate new orders (you should replace this with actual order handling logic)
  setInterval(() => {
    const newOrder = {
      id: state.ordersNumber + 1,
      side: Math.random() < 0.5 ? 'buy' : 'sell',
      price: parseFloat((Math.random() * 100).toFixed(2)),
    };
    updateState(newOrder);
    console.log('New order:', newOrder);
  }, 300);

  // Handle messages from the main thread
  parentPort.on('message', (message) => {
    if (message === 'takeSnapshot') {
      takeSnapshot();
    }
  });
}
