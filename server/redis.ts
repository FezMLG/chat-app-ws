import { createClient } from 'redis';

async function redisInit() {
  try {
    const client = createClient();
    await client.connect();

    const room_name = 'General';
    const value = await client.json.set('Rooms', `.`, {
      [room_name]: {
        ListOfUsers: [
          { id: '123456', name: 'user1' },
          { id: '7890', name: 'user2' },
        ],
        ListOfMessages: [
          {
            id: '123456',
            user: 'user1',
            timestamp: 123456789,
            message: 'Hi bitchers',
          },
          {
            id: '453',
            user: 'user2',
            timestamp: 6523456,
            message: 'Hi bitchersssss',
          },
        ],
      },
    });

    // const value = await client.json.get('Rooms', {
    //   path: room_name,
    // });
    await client.quit();

    return value;
  } catch (e) {
    console.error(e);
  }
}

redisInit();

// async function redisJSONDemo() {
//   try {
//     const TEST_KEY = 'test_node';

//     const client = createClient();
//     await client.connect();

//     // RedisJSON uses JSON Path syntax. '.' is the root.
//     // const value = await client.json.get(TEST_KEY, {
//     // JSON Path: .node = the element called 'node' at root level.
//     //   path: '.node',
//     // });
//     const room_name = 'room5';
//     await client.json.set('Rooms', `.${room_name}`, {
//       ListOfUsers: [
//         { id: '123456', name: 'user1' },
//         { id: '7890', name: 'user2' },
//       ],
//       ListOfMessages: [
//         {
//           id: '123456',
//           user: 'user1',
//           timestamp: 123456789,
//           message: 'Hi bitchers',
//         },
//         {
//           id: '453',
//           user: 'user2',
//           timestamp: 6523456,
//           message: 'Hi bitchersssss',
//         },
//       ],
//     });

//     const value = await client.json.get('Rooms', {
//       path: room_name,
//     });

//     console.log(`value of node: ${value}`);

//     await client.quit();
//   } catch (e) {
//     console.error(e);
//   }
// }

// redisJSONDemo();
