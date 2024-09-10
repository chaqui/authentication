const errorMiddleware = async (event, context) => {
  console.log(event);
  try {
    return await event();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
