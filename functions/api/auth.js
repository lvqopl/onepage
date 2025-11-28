export async function onRequestPost(context) {
  try {
    const { password } = await context.request.json();
    const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
    
    if (!ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ 
        error: '服务器配置错误',
        message: '管理员密码未设置'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (password === ADMIN_PASSWORD) {
      // 生成 token
      const token = btoa(`auth:${Date.now()}:${Math.random()}`);
      
      return new Response(JSON.stringify({ 
        success: true,
        token,
        message: '登录成功'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
        }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false,
        message: '密码错误'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '服务器错误',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  const cookies = context.request.headers.get('Cookie') || '';
  const hasAuthToken = cookies.includes('auth_token=');
  
  return new Response(JSON.stringify({ 
    authenticated: hasAuthToken
  }), {
    headers: { 
      'Content-Type': 'application/json'
    }
  });
}

export async function onRequestDelete(context) {
  return new Response(JSON.stringify({ 
    success: true,
    message: '已退出登录'
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth_token=; Path=/; Max-Age=0'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
