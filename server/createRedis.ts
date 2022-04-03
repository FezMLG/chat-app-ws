const createRedis = async (client: any) => {
  try {
    const room_name = 'General';
    const value = await client.json.set('Rooms', `.`, {
      [room_name]: {
        ListOfUsers: [],
        ListOfMessages: [],
      },
    });

    return value;
  } catch (e) {
    console.error(e);
  }
};

export default createRedis;
