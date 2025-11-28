export async function onRequestGet(context) {
  try {
    const { BOOKMARKS_KV } = context.env;
    const bookmarks = await BOOKMARKS_KV.get('user_bookmarks', { type: 'json' });
    
    return new Response(JSON.stringify({ 
      bookmarks: bookmarks || [] 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
  try {
    const { BOOKMARKS_KV } = context.env;
    const data = await context.request.json();
    
    await BOOKMARKS_KV.put('user_bookmarks', JSON.stringify(data.bookmarks));
    
    return new Response(JSON.stringify({ 
      success: true,
      message: '保存成功' 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
