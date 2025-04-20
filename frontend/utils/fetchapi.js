// apiRequest.js
export async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };
  
    
  
    if (body) {
      options.body = JSON.stringify(body);
    }




  
    try {
      const response = await fetch(`http://localhost:8080/api${endpoint}`, options);
      console.log(response)
      const data = await response.json();
      
      if (!response.ok) {
        
        throw new Error(data.message || 'Erreur API');
      }
  
      return data;
    } catch (err){
      
      console.error('apiRequest error:', err.message);
      throw err;
    }
  }
  