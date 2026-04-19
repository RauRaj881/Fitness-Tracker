const axios = require('axios');

async function testUpdate() {
  try {
    const timestamp = Date.now();
    const regRes = await axios.post('http://localhost:1337/api/auth/local/register', {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: 'Password123!',
    });
    
    const jwt = regRes.data.jwt;

    console.log("Attempting to update user undefined...");
    const updateData = { age: 25 };
    
    const upRes = await axios.put(`http://localhost:1337/api/users/undefined`, updateData, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    console.log("Update successful!", upRes.data);
  } catch (error) {
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Network/Other Error:", error.message);
    }
  }
}

testUpdate();
