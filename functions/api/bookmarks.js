function checkAuth(request) {
  const cookies = request.headers.get('Cookie') || '';
  return cookies.includes('auth_token=');
}

export async function onRequestGet(context) {
  try {
    const { BOOKMARKS_KV } = context.env;
    const bookmarks = await BOOKMARKS_KV.get('user_bookmarks', { type: 'json' });
    
    return new Response(JSON.stringify({ 
      bookmarks: bookmarks || [] 
    }), {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '加载失败',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  // 检查认证
  if (!checkAuth(context.request)) {
    return new Response(JSON.stringify({ 
      error: '未授权',
      message: '需要管理员权限'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { BOOKMARKS_KV } = context.env;
    const data = await context.request.json();
    
    await BOOKMARKS_KV.put('user_bookmarks', JSON.stringify(data.bookmarks));
    
    return new Response(JSON.stringify({ 
      success: true,
      message: '保存成功' 
    }), {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '保存失败',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
